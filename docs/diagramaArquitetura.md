graph TD
    subgraph "Frontend (Interface do Usuário)"
        UI[Navegador Web - HTML/CSS]
        AppJS[app.js - Lógica e Ethers.js]
    end

    subgraph "Rede Hyperledger Besu (Docker)"
        RPC[Nó RPC - http://127.0.0.1:8545]
        EVM[(EVM - Smart Contract AcordoInstant)]
    end

    Passageiro((Passageiro)) -->|1. Compra Seguro| UI
    Oraculo((Oráculo/ANAC)) -->|3. Reporta Atraso| UI
    
    UI <--> AppJS
    AppJS <-->|Conexão JSON-RPC| RPC
    RPC <--> EVM

    EVM -.->|2. Trava Escrow & Apólice| EVM
    EVM -.->|4. Indenização & Termo de Quitação| Passageiro
    
    style UI fill:#e9ecef,stroke:#333
    style AppJS fill:#cfe2ff,stroke:#084298
    style RPC fill:#d1e7dd,stroke:#0f5132
    style EVM fill:#fff3cd,stroke:#664d03