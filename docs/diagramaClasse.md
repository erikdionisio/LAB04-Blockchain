# Diagrama de Classes - Seguro Paramétrico de Voo

classDiagram
    class FlightInsurance {
        +address airline
        +uint256 thresholdHours
        +uint256 payoutAmount
        +mapping(string => Policy) policies
        +constructor(uint256 _thresholdHours, uint256 _payoutAmount)
        +depositEscrow() void
        +buyInsurance(string flightNumber) void
        +reportDelay(string flightNumber, uint256 delayHours) void
    }

    class Policy {
        +address passenger
        +bool isActive
        +bool isSettled
    }

    FlightInsurance "1" *-- "many" Policy : armazena