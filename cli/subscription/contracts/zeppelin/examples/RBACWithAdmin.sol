pragma solidity ^0.4.23;

import "../ownership/rbac/RBAC.sol";


/**
 * @title RBACWithAdmin
 * @author Matt Condon (@Shrugs)
 * @dev It's recommended that you define constants in the contract,
 * @dev like ROLE_ADMIN below, to avoid typos.
 * @dev
 * @dev NOTE: RBACWithAdmin is probably too expansive and powerful for your
 * @dev  application; an admin is actually able to change any address to any role
 * @dev  which is a very large API surface. It's recommended that you follow a strategy
 * @dev  of strictly defining the abilities of your roles
 * @dev  and the API-surface of your contract.
 * @dev  This is just an example for example's sake.
 */
contract RBACWithAdmin is RBAC {
  /**
   * A constant role name for indicating admins.
   */
  string public constant ROLE_ADMIN = "admin";

  /**
   * @dev modifier to scope access to admins
   * // reverts
   */
  modifier onlyAdmin()
  {
    checkRole(msg.sender, ROLE_ADMIN);
    _;
  }

  /**
   * @dev constructor. Sets msg.sender as admin by default
   */
  constructor()
    public
  {
    addRole(msg.sender, ROLE_ADMIN);
  }

  /**
   * @dev add a role to an address
   * @param addr address
   * @param roleName the name of the role
   */
  function adminAddRole(address addr, string roleName)
    onlyAdmin
    public
  {
    addRole(addr, roleName);
  }

  /**
   * @dev remove a role from an address
   * @param addr address
   * @param roleName the name of the role
   */
  function adminRemoveRole(address addr, string roleName)
    onlyAdmin
    public
  {
    removeRole(addr, roleName);
  }
}
