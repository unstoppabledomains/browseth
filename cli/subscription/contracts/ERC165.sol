pragma solidity ^0.4.23;

interface ERC165Interface {
    function supportsInterface(bytes4 interfaceID) external view returns (bool);
}

contract ERC165 is ERC165Interface {
    /*
     * bytes4(keccak256('supportsInterface(bytes4)'));
    */
    bytes4 constant InterfaceID_ERC165 = 0x01ffc9a7;

    function supportsInterface(bytes4 interfaceID) external view returns (bool) {
        return interfaceID == InterfaceID_ERC165;
    }
}
