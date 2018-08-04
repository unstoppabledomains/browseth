pragma solidity ^0.4.23;

import "./PriceCurve.sol";
import "./zeppelin/lifecycle/Pausable.sol";
import "./zeppelin/token/ERC721/ERC721Token.sol";

contract NFTSubscription is ERC721Token("SubscriptionToken", "SUB"), Pausable {
    event Renew(uint256 tokenId, uint256 value, uint256 addedTime);

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

    function expiresAt(uint256 _tokenId) external view returns (uint256) {
        return expirations_[_tokenId];
    }

    function () external payable whenNotPaused {
        if (priceCurve_.getMinimumPrice() == 0) {
            mint_(msg.sender, block.timestamp + priceCurve_.getMinimumTime());
        } else {
            mint_(msg.sender, block.timestamp + priceCurve_.getTimeFromAmount(msg.value));
        }
    }

    function getMinimumPrice() external view returns (uint256) {
        return priceCurve_.getMinimumPrice();
    }

    function renew(uint256 _tokenId) external payable {
        uint256 addedTime = priceCurve_.getTimeFromAmount(msg.value);
        expirations_[_tokenId] += addedTime;

        emit Renew(_tokenId, msg.value, addedTime);
    }

    function mint_(address _owner, uint256 _expiresAt) internal returns (uint256 _tokenId) {
        uint256 newId = expirations_.push(_expiresAt) - 1;

        _mint(_owner, newId);
        return newId;
    }

    function getTokenId(uint256 _index) external view returns (uint256) {
        require(_index < balanceOf(msg.sender));

        return ownedTokens[msg.sender][_index];
    }
}
