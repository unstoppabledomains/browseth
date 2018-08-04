pragma solidity ^0.4.23;

import "./ERC165.sol";

interface ERC721Interface {
    event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

    function balanceOf(address _owner) external view returns (uint256);
    function ownerOf(uint256 _tokenId) external view returns (address);
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable;
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable;
    function transferFrom(address _from, address _to, uint256 _tokenId) external payable;
    function approve(address _approved, uint256 _tokenId) external payable;
    function setApprovalForAll(address _operator, bool _approved) external;
    function getApproved(uint256 _tokenId) external view returns (address);
    function isApprovedForAll(address _owner, address _operator) external view returns (bool);
    function supportsInterface(bytes4 interfaceID) external view returns (bool);
}

interface ERC721ReceiverInterface {
    function onERC721Received(address _from, uint256 _tokenId, bytes _data) external returns (bytes4);
}

contract ERC721Receiver {
    /**
    * bytes4(keccak256("onERC721Received(address,uint256,bytes)"))
    */
    bytes4 internal constant InterfaceID_ERC721Receiver = 0xf0b9e5ba;
    function onERC721Received(address _from, uint256 _tokenId, bytes _data) external pure returns (bytes4) {
        return InterfaceID_ERC721Receiver;
    }
}

contract ERC721 is ERC721Interface, ERC165 {
    /*
     * bytes4(keccak256('balanceOf(address)')) ^
     * bytes4(keccak256('ownerOf(uint256)')) ^
     * bytes4(keccak256('approve(address,uint256)')) ^
     * bytes4(keccak256('getApproved(uint256)')) ^
     * bytes4(keccak256('setApprovalForAll(address,bool)')) ^
     * bytes4(keccak256('isApprovedForAll(address,address)')) ^
     * bytes4(keccak256('transferFrom(address,address,uint256)')) ^
     * bytes4(keccak256('safeTransferFrom(address,address,uint256)')) ^
     * bytes4(keccak256('safeTransferFrom(address,address,uint256,bytes)'));
    */
    bytes4 constant InterfaceID_ERC721 = 0x80ac58cd;

    /*
     * bytes4(keccak256("onERC721Received(address,uint256,bytes)"))
     */
    bytes4 constant InterfaceID_ERC721Receiver = 0xf0b9e5ba;


    mapping (uint256 => address) internal tokenIdToOwner_;
    mapping (uint256 => address) internal tokenIdToApproval_;
    mapping (address => uint256) internal ownerToTokenCount_;
    mapping (address => mapping (address => bool)) internal operatorApprovals_;

    modifier onlyApproved(uint256 _tokenId) {
        require(msg.sender == tokenIdToApproval_[_tokenId]);
        _;
    }

    modifier onlyOperator(uint256 _tokenId) {
        require(operatorApprovals_[tokenIdToOwner_[_tokenId]][msg.sender]);
        _;
    }

    modifier onlyTokenOwner(uint256 _tokenId) {
        require(msg.sender == tokenIdToOwner_[_tokenId]);
        _;
    }

    modifier onlyApprovedOrTokenOwner(uint256 _tokenId) {
        require(
            msg.sender == tokenIdToOwner_[_tokenId] || msg.sender == tokenIdToApproval_[_tokenId]
        );
        _;
    }

    modifier onlyApprovedOperatorOrTokenOwner(uint256 _tokenId) {
        address owner = tokenIdToOwner_[_tokenId];
        require(
            msg.sender == owner || tokenIdToApproval_[_tokenId] == msg.sender || operatorApprovals_[owner][msg.sender]
        );
        _;
    }

    function __erc721ReceiverCheck(address _from, address _to, uint256 _tokenId, bytes data) private {
        uint256 recieverCodeSize;
        // solium-disable-next-line security/no-inline-assembly
        assembly { recieverCodeSize := extcodesize(_to) }
        if (recieverCodeSize == 0) {
            return;
        }

        require(
            ERC721ReceiverInterface(_to).onERC721Received(
                _from,
                _tokenId,
                data
            ) == InterfaceID_ERC721Receiver
        );
    }

    function transfer_(address _from, address _to, uint256 _tokenId) internal {
        ownerToTokenCount_[_to]++;
        tokenIdToOwner_[_tokenId] = _to;

        if (_from != address(0)) {
            ownerToTokenCount_[_from]--;
            delete tokenIdToApproval_[_tokenId];
        }

        emit Transfer(_from, _to, _tokenId);
    }

    function balanceOf(address _owner) external view returns (uint256) {
        return ownerToTokenCount_[_owner];
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
        return tokenIdToOwner_[_tokenId];
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data)
        external
        payable
        onlyApprovedOperatorOrTokenOwner(_tokenId)
    {
        transfer_(_from, _to, _tokenId);
        __erc721ReceiverCheck(_from, _to, _tokenId, data);
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable onlyApprovedOperatorOrTokenOwner(_tokenId) {
        transfer_(_from, _to, _tokenId);
        __erc721ReceiverCheck(_from, _to, _tokenId, "");
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external payable onlyApprovedOperatorOrTokenOwner(_tokenId) {
        transfer_(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external payable {
        address owner = tokenIdToOwner_[_tokenId];

        require(msg.sender == owner || operatorApprovals_[owner][msg.sender]);

        tokenIdToApproval_[_tokenId] = _approved;
        emit Approval(owner, _approved, _tokenId);
    }

    function setApprovalForAll(address _operator, bool _approved) external {
        operatorApprovals_[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    function getApproved(uint256 _tokenId) external view returns (address) {
        return tokenIdToApproval_[_tokenId];
    }

    function isApprovedForAll(address _owner, address _operator) external view returns (bool) {
        return operatorApprovals_[_owner][_operator];
    }

    function supportsInterface(bytes4 _interfaceID) external view returns (bool) {
        return  _interfaceID == InterfaceID_ERC165 || _interfaceID == InterfaceID_ERC721;
    }
}

    // contract OptOutSubscription is ERC721 {

    //     event New(uint256 subscriptionID);
    //     event Activate(uint256 subscriptionID);
    //     event Cancel(uint256 subscriptionID);

    //     uint256 withdrawableEther = 0;
    //     uint256 paymentCost = 1;
    //     uint32 subscriptionCooldown = 30 days;

    //     struct Subscription {
    //         uint256 balance;
    //         uint24 meta;
    //         uint32 birth;
    //         uint32 lastPayment;
    //         uint32 payedUntil;
    //         bool isActive;
    //     }

    //     Subscription[] subscriptions;

    //     mapping (uint256 => address) internal subscriptionIDToOwner_;

    //     modifier onlySubscriptionOwner(uint256 _subscriptionID) {
    //         require(subscriptionIDToOwner_[_subscriptionID] == msg.sender);
    //         _;
    //     }

    //     function createSubscription(uint32 _meta) external payable {
    //         subscriptions[subscriptions.length] = Subscription({
    //             balance: msg.value,
    //             meta: _meta,
    //             lastPayment: uint32(block.timestamp),
    //             payedUntil: uint32(block.timestamp),
    //             isActive: true
    //         });
    //     }

    //     function process(uint256 _subscriptionID) public {
    //         Subscription storage s = subscriptions[_subscriptionID];

    //         require(s.isActive);
    //         if (s.payedUntil - subscriptionCooldown > s.lastPayment) {
    //             return;
    //         }

    //         uint timeUnits =
    //             (s.lastPayment - uint32(block.timestamp))
    //             / subscriptionCooldown;
    //         uint cost = timeUnits * paymentCost;

    //         require(cost <= s.balance);

    //         s.payedUntil = timeUnits * subscriptionCooldown + s.lastPayment;
    //         s.lastPayment = uint32(block.timestamp);
    //         s.balance -= cost;
    //         withdrawableEther += cost;
    //     }

    //     function activate(uint256 _subscriptionID) external onlySubscriptionOwner(_subscriptionID) {
    //         subscriptions[subscriptions.length].isActive = true;
    //         process(_subscriptionID);
    //     }

    //     function cancel(uint256 _subscriptionID) external onlySubscriptionOwner(_subscriptionID) {
    //         process(_subscriptionID);
    //         subscriptions[subscriptions.length].isActive = false;
    //     }

    //     function isSubscribed(uint256 _subscriptionID) external view returns (bool) {
    //         (subscriptions[subscriptions.length].lastPayment - uint32(block.timestamp))
    //             / subscriptionCooldown
    //             * paymentCost

    //         return subscriptions[subscriptions.length].lastPayment >= block.timestamp - subscriptionCooldown;
    //     }

    //     function withdraw(uint256 _subscriptionID, uint256 amount) external onlySubscriptionOwner(_subscriptionID) {
    //     }
    // }
