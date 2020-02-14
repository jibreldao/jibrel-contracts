/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity >=0.4.0 <0.6.0;


/**
 * @title ManageableInterface
 * @dev Contract that allows to grant permissions to any address
 * @dev In real life we are no able to perform all actions with just one Ethereum address
 * @dev because risks are too high.
 * @dev Instead owner delegates rights to manage an contract to the different addresses and
 * @dev stay able to revoke permissions at any time.
 */
contract ManageableInterface {

  /**
   * @dev Function to check if the manager can perform the action or not
   * @param _manager        address Manager`s address
   * @param _permissionName string  Permission name
   * @return True if manager is enabled and has been granted needed permission
   */
  function isManagerAllowed(address _manager, string memory _permissionName) public view returns (bool);

  /**
   * @dev Modifier to use in derived contracts
   */
  modifier onlyAllowedManager(string memory _permissionName) {
    require(isManagerAllowed(msg.sender, _permissionName) == true);
    _;
  }
}
