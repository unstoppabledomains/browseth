pragma solidity ^0.4.23;

contract EFOAccessControl {

    address public ceoAddress;
    address public cfoAddress;
    address public cooAddress;

    address public withdrawalAddress;

    modifier onlyCEO() {
        require(msg.sender == ceoAddress);
        _;
    }

    modifier onlyCFO() {
        require(msg.sender == cfoAddress);
        _;
    }

    modifier onlyCOO() {
        require(msg.sender == cooAddress);
        _;
    }

    modifier onlyCLevel() {
        require(
            msg.sender == cooAddress || msg.sender == ceoAddress || msg.sender == cfoAddress
        );
        _;
    }

    modifier onlyCEOOrCFO() {
        require(
            msg.sender == cfoAddress || msg.sender == ceoAddress
        );
        _;
    }

    modifier onlyCEOOrCOO() {
        require(
            msg.sender == cooAddress || msg.sender == ceoAddress
        );
        _;
    }

    function setCEO(address _newCEO) external onlyCEO {
        require(_newCEO != address(0));
        ceoAddress = _newCEO;
    }

    function setCFO(address _newCFO) external onlyCEO {
        require(_newCFO != address(0));
        cfoAddress = _newCFO;
    }

    function setCOO(address _newCOO) external onlyCEO {
        require(_newCOO != address(0));
        cooAddress = _newCOO;
    }

    function setWithdrawalAddress(address _newWithdrawalAddress) external onlyCEO {
        require(_newWithdrawalAddress != address(0));
        withdrawalAddress = _newWithdrawalAddress;
    }

    function withdrawBalance() external onlyCEOOrCFO {
        require(withdrawalAddress != address(0));
        withdrawalAddress.transfer(address(this).balance);
    }
}

contract Pausable is EFOAccessControl {
    event Paused();
    event Unpaused();

    bool public paused = false;

    modifier whenNotPaused() {
        require(!paused);
        _;
    }

    modifier whenPaused() {
        require(paused);
        _;
    }

    function pause() public onlyCLevel whenNotPaused {
        paused = true;
        emit Paused();
    }

    function unpause() public onlyCEO whenPaused {
        paused = false;
        emit Unpaused();
    }
}
