pragma solidity ^0.4.22;

contract Test {
    uint256 a;
    uint256 b;

    event ASet(uint256 a);
    event BSet(uint256 b);

    constructor(uint256 _a, uint256 _b) public {
        a = _a;
        b = _b;
    }

    function getA() public view returns (uint256) {
        return a;
    }

    function getB() public view returns (uint256) {
        return b;
    }

    function getATimesB() public view returns (uint256) {
        return getA() * getB();
    }

    function setA(uint256 _a) public {
        a = _a;
        emit ASet(a);
    }

    function setB(uint256 _b) public {
        b = _b;
        emit BSet(b);
    }

    function setAB(uint256 _a, uint256 _b) public {
        a = _a;
        b = _b;
        emit ASet(a);
        emit BSet(b);
    }
}