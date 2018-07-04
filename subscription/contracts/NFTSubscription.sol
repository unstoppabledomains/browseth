pragma solidity ^0.4.23;

import "./PriceCurve.sol";
// import "./AccessControl.sol";
import "./zeppelin/lifecycle/Pausable.sol";
import "./zeppelin/token/ERC721/ERC721Token.sol";

contract NFTSubscription is ERC721Token("SubscriptionToken", "SUB"), Pausable {
    PriceCurveInterface internal priceCurve_;

    uint256[] internal expirations_;

    constructor(address _priceCurve) public {
        priceCurve_ = PriceCurveInterface(_priceCurve);
    }

    function getPriceCurve() external view returns (address) {
        return priceCurve_;
    }

    function setPriceCurve(address _priceCurve) external {
        priceCurve_ = PriceCurveInterface(_priceCurve);
    }

    function getAmountFromTime(uint256 _subscriptionLength) external view returns (uint256 _amount) {
        return priceCurve_.getAmountFromTime(_subscriptionLength);
    }

    function expiresAt(uint256 _tokenId) external view returns (uint256 _timestamp) {
        uint256 timestamp = expirations_[_tokenId];
        require(_timestamp != 0);
        return timestamp;
    }

    function () external payable whenNotPaused {
        mint_(msg.sender, block.timestamp + priceCurve_.getTimeFromAmount(msg.value));
    }

    function mint_(address _owner, uint256 _expiresAt) internal returns (uint256 _tokenId) {
        uint256 newId = expirations_.push(_expiresAt) - 1;

        transferFrom(0, _owner, newId);

        return newId;
    }

    // function burn_(uint256 _tokenId) internal {
    //     transfer_(tokenIdToOwner_[_tokenId], 0, _tokenId);
    // }
}

