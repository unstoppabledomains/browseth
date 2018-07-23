pragma solidity ^0.4.23;

interface PriceCurveInterface {
    function getAmountFromTime(uint256 _subscriptionLength) external view returns (uint256 _amount);
    function getTimeFromAmount(uint256 _amount) external view returns (uint64 _subscriptionLength);
    function getMinimumPrice() external view returns(uint256);
}

contract EthPriceCurve is PriceCurveInterface {
    event SetMinimumTime(uint256 indexed minimumTime);
    event SetCostPerSecond(uint256 indexed costPerSecond);

    uint256 internal minimumTime_;
    uint256 internal costPerSecond_;

    constructor(uint256 _minimumTime, uint256 _costPerSecond) public {
        minimumTime_ = _minimumTime;
        costPerSecond_ = _costPerSecond;
    }

    function getAmountFromTime(uint256 _subscriptionLength) external view returns (uint256 _amount) {
        require(_subscriptionLength >= minimumTime_);

        return _subscriptionLength * costPerSecond_;
    }

    function getTimeFromAmount(uint256 _amount) external view returns (uint64 _subscriptionLength) {
        require(_amount >= minimumTime_ * costPerSecond_); 
      
        return uint64(_amount / costPerSecond_);
    }

    function getMinimumTime() external view returns(uint256) {
        return minimumTime_;
    }

    function getMinimumPrice() external view returns(uint256) {
        return minimumTime_ * costPerSecond_;
    }

    function getCostPerSecond() external view returns(uint256) {
        return costPerSecond_;
    }

    function setMinimumTime(uint256 _minimumTime) external {
        minimumTime_ = _minimumTime;
        emit SetMinimumTime(_minimumTime);
    }

    function setCostPerSecond(uint256 _costPerSecond) external {
        minimumTime_ = _costPerSecond;
        emit SetCostPerSecond(_costPerSecond);
    }
}

// contract UsdPriceCurve is PriceCurveInterface {
//     uint256 internal weiToCentRatio_;

//     function setWeiToCentRatio(uint256 _ratio) external {
//         weiToCentRatio_ = _ratio;
//     }

//     function getTime(uint256 _amount, address _owner) external view returns (uint64 _expiresAt) {
//         // Check if user sent at least $2.99
//         require(_amount / weiToCentRatio_ > 299); 
      
//         // Current time + seconds in a year
//         return uint64(31536000);       
//     }
// }
