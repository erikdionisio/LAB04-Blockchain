```
flowchart LR

P[Passageiro]

F[Frontend React]

SC[Smart Contract<br/>FlightInsurance]

OR[Oráculo<br/>Mock / Chainlink]

API[API de Voos<br/>ANAC / FlightStats]

BC[(Blockchain)]

P --> F

F --> SC

OR --> SC

API --> OR

SC --> BC

BC --> F

SC -->|Pagamento automático| P

SC -->|Registro de quitação| BC
```