pragma solidity ^0.4.23;

import "./ERC721.sol";

interface ENS {
    function owner(bytes32 _node) external returns (address);
}

contract NFTResolver is ERC721 {

    event ClaimWith(address _from, bytes32 _node, uint256 _tokenId);

    struct Token {
        uint256 meta;
        uint8 version;
        mapping (bytes32 => bytes) values;
    }

    ENS ens;

    Token[] internal tokens_;

    mapping (bytes32 => uint256) internal nodeToTokenId_;


    function mint_(address _owner, uint256 _meta, uint8 _version) internal returns (uint256 _tokenId) {
        Token memory token = Token({
            meta: _meta,
            version: _version
        });

        uint256 newId = tokens_.push(token) - 1;

        transfer_(0, _owner, newId);

        return newId;
    }

    function getTokenByNode_(bytes32 _node) internal returns (uint256 _tokenId) {
        uint256 index = nodeToTokenId_[_node];
        address owner = tokenIdToOwner_[index];

        require(ens.owner(_node) == owner);

        return index;
    }

    function claim_(address _from, bytes32 _node, uint256 _tokenId) internal {
        require(
            tokenIdToOwner_[_tokenId] == _from && ens.owner(_node) == _from
        );

        nodeToTokenId_[_node] = _tokenId;
        emit ClaimWith(_from, _node, _tokenId);
    }

    function mint() external {
        mint_(msg.sender, 0, 0);
    }

    function mintAndClaimWith(bytes32 _node) external {
        claim_(msg.sender, _node, mint_(msg.sender, 0, 0));
    }

    function claimWith(bytes32 _node, uint256 _tokenId) external {
        claim_(msg.sender, _node, _tokenId);
    }

    function getTokenByNode(bytes32 _node) external returns (uint256 _tokenId, uint256 _meta, uint8 _version) {
        uint256 tokenId = getTokenByNode_(_node);
        Token memory t = tokens_[tokenId];

        return (tokenId, t.meta, t.version);
    }
}
