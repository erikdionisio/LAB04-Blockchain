classDiagram
    class FlightInsurance {
        +address airline
        +uint256 thresholdHours
        +uint256 payoutAmount
        +mapping policies
        +depositEscrow()
        +buyInsurance(string flightNumber)
        +reportDelay(string flightNumber, uint256 delayHours)
        +isFlightSettled(string flightNumber) bool
        +hasInsurance(string flightNumber, address passenger) bool
    }

    class Policy {
        +address passenger
        +bool isActive
        +bool isSettled
    }

    FlightInsurance "1" *-- "*" Policy : gerencia