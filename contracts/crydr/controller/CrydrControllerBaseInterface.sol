/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


/**
 * @title CrydrControllerBaseInterface interface
 * @dev Interface of a contract that implement business-logic of an CryDR, mediates CryDR views and storage
 */
contract CrydrControllerBaseInterface {

  /* Events */

  event CrydrStorageChangedEvent(address indexed crydrstorage);
  event CrydrViewAddedEvent(address indexed crydrview, string standardname);
  event CrydrViewRemovedEvent(address indexed crydrview, string standardname);


  /* Configuration */

  function setCrydrStorage(address _newStorage) external;
  function getCrydrStorageAddress() public constant returns (address);

  function setCrydrView(address _newCrydrView, string _viewApiStandardName) external;
  function removeCrydrView(string _viewApiStandardName) external;
  function getCrydrViewAddress(string _viewApiStandardName) public constant returns (address);

  function isCrydrViewAddress(address _crydrViewAddress) public constant returns (bool);
  function isCrydrViewRegistered(string _viewApiStandardName) public constant returns (bool);
}
