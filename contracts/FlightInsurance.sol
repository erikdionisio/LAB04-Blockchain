// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FlightInsurance {
    address public airline;
    uint256 public thresholdHours;
    uint256 public payoutAmount;

    struct Policy {
        address passenger;
        bool isActive;
        bool isSettled; // Termo de quitação
    }

    mapping(string => Policy) public policies;

    event EscrowDeposited(uint256 amount);
    event InsurancePurchased(string flightNumber, address passenger);
    event PayoutExecuted(string flightNumber, address passenger, uint256 amount);

    constructor(uint256 _thresholdHours, uint256 _payoutAmount) {
        airline = msg.sender;
        thresholdHours = _thresholdHours;
        payoutAmount = _payoutAmount;
    }

    // 1. Implementação de escrow (depósito pela companhia aérea)
    function depositEscrow() external payable {
        require(msg.sender == airline, "Only airline can deposit");
        emit EscrowDeposited(msg.value);
    }

    // 2. Registro do passageiro
    function buyInsurance(string memory flightNumber) external {
        policies[flightNumber] = Policy({
            passenger: msg.sender,
            isActive: true,
            isSettled: false
        });
        emit InsurancePurchased(flightNumber, msg.sender);
    }

    // 3. Lógica paramétrica e oráculo simulado
    function reportDelay(string memory flightNumber, uint256 delayHours) external {
        Policy storage policy = policies[flightNumber];
        require(policy.isActive, "Policy not active");
        require(!policy.isSettled, "Policy already settled");

        // if atraso > X horas -> transferir Y
        if (delayHours > thresholdHours) {
            policy.isSettled = true; // Registro de quitação
            payable(policy.passenger).transfer(payoutAmount);
            emit PayoutExecuted(flightNumber, policy.passenger, payoutAmount);
        }
    }
}