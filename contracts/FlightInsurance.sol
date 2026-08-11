// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FlightInsurance {
    address public airline;
    uint256 public thresholdHours;
    uint256 public payoutAmount;

    struct Policy {
        address passenger;
        bool isActive;
        bool isSettled;
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

    function depositEscrow() external payable {
        require(msg.sender == airline, "Only airline can deposit");
        emit EscrowDeposited(msg.value);
    }

    function buyInsurance(string memory flightNumber) external {
        policies[flightNumber] = Policy({
            passenger: msg.sender,
            isActive: true,
            isSettled: false
        });
        emit InsurancePurchased(flightNumber, msg.sender);
    }

    function reportDelay(string memory flightNumber, uint256 delayHours) external {
        Policy storage policy = policies[flightNumber];
        require(policy.isActive, "Policy not active");
        require(!policy.isSettled, "Policy already settled");

        if (delayHours > thresholdHours) {
            policy.isSettled = true;
            payable(policy.passenger).transfer(payoutAmount);
            emit PayoutExecuted(flightNumber, policy.passenger, payoutAmount);
        }
    }
}