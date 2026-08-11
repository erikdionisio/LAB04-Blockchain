// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FlightInsurance {
    address public airline;
    uint256 public thresholdHours; // Limiar paramétrico (ex: 2 horas)
    uint256 public payoutAmount;    // Valor da indenização por passageiro

    // Mapeamento: Voo => Lista de endereços de passageiros cadastrados
    mapping(string => address[]) public flightPassengers;
    
    // Mapeamento: Voo => Passageiro => Possui Seguro Ativo
    mapping(string => mapping(address => bool)) public hasInsurance;
    
    // Mapeamento: Voo => Estado de Quitação (Termo de Quitação On-Chain)
    mapping(string => bool) public isFlightSettled;

    // Eventos (Registros imutáveis na Blockchain)
    event EscrowDeposited(address indexed airline, uint256 amount);
    event InsurancePurchased(string indexed flightNumber, address indexed passenger);
    event PayoutExecuted(string indexed flightNumber, uint256 totalPassengersPaid, uint256 totalAmountSent);

    constructor(uint256 _thresholdHours, uint256 _payoutAmount) {
        airline = msg.sender;
        thresholdHours = _thresholdHours;
        payoutAmount = _payoutAmount;
    }

    // REQUISITO 2: Implementação de Escrow (Depósito prévio pela companhia aérea)
    function depositEscrow() external payable {
        require(msg.sender == airline, "Apenas a companhia aerea pode depositar no escrow");
        emit EscrowDeposited(msg.sender, msg.value);
    }

    // REQUISITO 1 & 5: Contratação do seguro pelo passageiro
    function buyInsurance(string memory flightNumber) external {
        require(!isFlightSettled[flightNumber], "Voo ja quitado anteriormente");
        require(!hasInsurance[flightNumber][msg.sender], "Passageiro ja possui seguro para este voo");

        flightPassengers[flightNumber].push(msg.sender);
        hasInsurance[flightNumber][msg.sender] = true;

        emit InsurancePurchased(flightNumber, msg.sender);
    }

    // REQUISITO 1, 3 & 4: Oráculo reporta o atraso -> Lógica Paramétrica -> Quitação On-Chain
    function reportDelay(string memory flightNumber, uint256 delayHours) external {
        require(!isFlightSettled[flightNumber], "Voo ja foi quitado");

        // LÓGICA PARAMÉTRICA: if (atraso >= limiar) -> Paga todos os passageiros
        if (delayHours >= thresholdHours) {
            isFlightSettled[flightNumber] = true; // Emite o termo de quitação no estado do contrato
            
            address[] memory passengers = flightPassengers[flightNumber];
            uint256 totalPaidCount = 0;
            uint256 totalAmount = 0;

            for (uint256 i = 0; i < passengers.length; i++) {
                if (address(this).balance >= payoutAmount) {
                    payable(passengers[i]).transfer(payoutAmount);
                    totalPaidCount++;
                    totalAmount += payoutAmount;
                }
            }

            // Registro permanente do Termo de Quitação e Indenização
            emit PayoutExecuted(flightNumber, totalPaidCount, totalAmount);
        }
    }

    // Consulta de quantidade de passageiros em um voo
    function getPassengerCount(string memory flightNumber) external view returns (uint256) {
        return flightPassengers[flightNumber].length;
    }
}