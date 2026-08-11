# Diagrama de Arquitetura e Fluxo do Sistema

sequenceDiagram
    autonumber
    actor Companhia as Companhia Aérea
    actor Passageiro as Passageiro
    actor Oraculo as Oráculo (ANAC/FlightStats)
    participant Contrato as Smart Contract (FlightInsurance)

    Note over Companhia, Contrato: 1. Implantação e Garantia (Escrow)
    Companhia->>Contrato: Deploy do Contrato (limiar, valor indenização)
    Companhia->>Contrato: depositEscrow() (Depósito de fundos em ETH)

    Note over Passageiro, Contrato: 2. Contratação
    Passageiro->>Contrato: buyInsurance("LA8100")
    Contrato-->>Passageiro: Evento InsurancePurchased emitido

    Note over Oraculo, Contrato: 3. Gatilho Paramétrico
    Oraculo->>Contrato: reportDelay("LA8100", 3 horas)
    
    alt Atraso > Limiar Contratual
        Contrato->>Contrato: Define policy.isSettled = true (Termo de Quitação)
        Contrato->>Passageiro: Transferência Automática da Indenização (payoutAmount)
        Contrato-->>Passageiro: Evento PayoutExecuted emitido (Recibo On-Chain)
    else Atraso <= Limiar
        Contrato->>Contrato: Nenhuma ação financeira executada
    end