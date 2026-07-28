```
classDiagram

class FlightInsurance{
    +address owner
    +address oHardhatracle
    +uint thresholdHours
    +uint payoutAmount
    +mapping insurances

    +depositEscrow()
    +buyInsurance()
    +reportDelay()
    +executePayout()
    +generateSettlement()
}

class FlightOracle{
    +mapping delays
    +updateFlightDelay()
    +getDelay()
}

FlightOracle --> FlightInsurance : envia atraso
```