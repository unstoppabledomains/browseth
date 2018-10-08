pragma solidity ^0.4.22;

contract Test {
    uint256 a;
    uint256 b;

    constructor(uint256 _a, uint256 _b) public {
        a = _a;
        b = _b;
    }

    function getA() public returns (uint256) {
        return a;
    }

    function getB() public returns (uint256) {
        return b;
    }

    function getATimesB() public returns (uint256) {
        return getA() * getB();
    }
}