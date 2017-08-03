/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.13;


import "../../lifecycle/Pausable.sol";
import "../storage/CrydrStorageBaseInterface.sol";
import "../view/CrydrViewBaseInterface.sol";
import "./CrydrControllerBaseInterface.sol";


/**
 * @title CrydrControllerBase
 * @dev Implementation of a contract with business-logic of an CryDR, mediates CryDR views and storage
 */
contract CrydrControllerBase is CrydrControllerBaseInterface, Pausable {

  /* Storage */

  CrydrStorageBaseInterface crydrStorage;
  mapping (string => address) crydrViewsAddresses;

  // optimizations
  address[] crydrViewsAddressesList;
  mapping (address => bool) isRegisteredView;


  /* CrydrControllerInterface */

  /* Configuration */

  function setCrydrStorage(
    address _crydrStorage
  )
    onlyValidCrydrStorageAddress(_crydrStorage)
    onlyDifferentAddress(_crydrStorage)
    onlyAllowedManager('set_crydr_storage')
    whenPaused
  {
    require(_crydrStorage != address(crydrStorage));

    crydrStorage = CrydrStorageBaseInterface(_crydrStorage);
    CrydrStorageChangedEvent(_crydrStorage);
  }

  function getCrydrStorage() constant returns (address) {
    return address(crydrStorage);
  }


  function setCrydrView(
    string _viewApiStandardName, address _crydrView
  )
    onlyValidCrydrViewStandardName(_viewApiStandardName)
    onlyValidCrydrViewAddress(_crydrView)
    onlyDifferentAddress(_crydrView)
    onlyAllowedManager('set_crydr_view')
    whenPaused
  {
    require(crydrViewsAddresses[_viewApiStandardName] == address(0x0));

    var crydrViewInstance = CrydrViewBaseInterface(_crydrView);
    var standardNameHash = crydrViewInstance.getCrydrViewStandardNameHash();
    require(standardNameHash == sha3(_viewApiStandardName));

    crydrViewsAddresses[_viewApiStandardName] = _crydrView;
    isRegisteredView[_crydrView] = true;
    crydrViewsAddressesList.push(_crydrView);

    CrydrViewAddedEvent(_viewApiStandardName, _crydrView);
  }

  function removeCrydrView(
    string _viewApiStandardName
  )
    onlyValidCrydrViewStandardName(_viewApiStandardName)
    onlyAllowedManager('remove_crydr_view')
    whenPaused
  {
    require(crydrViewsAddresses[_viewApiStandardName] != address(0x0));

    address removedView = crydrViewsAddresses[_viewApiStandardName];

    // make changes to the storage
    crydrViewsAddresses[_viewApiStandardName] == address(0x0);
    isRegisteredView[removedView] = false;

    // remove element from the list
    uint index = 0;
    uint i;
    for (i = 0; i < crydrViewsAddressesList.length; i++) {
      if (crydrViewsAddressesList[i] == removedView) {
        index = i;
      }
    }
    for (i = index; i < crydrViewsAddressesList.length - 1; i++){
        crydrViewsAddressesList[i] = crydrViewsAddressesList[i+1];
    }
    delete crydrViewsAddressesList[crydrViewsAddressesList.length - 1];
    crydrViewsAddressesList.length--;

    CrydrViewRemovedEvent(_viewApiStandardName, removedView);
  }

  function getCrydrView(string _viewApiStandardName) constant returns (address) {
    return crydrViewsAddresses[_viewApiStandardName];
  }

  function getCrydrViewsNumber() constant returns (uint) {
    return crydrViewsAddressesList.length;
  }

  function getCrydrViewByNumber(uint _viewId) constant returns (address) {
    return crydrViewsAddressesList[_viewId];
  }


  /* Pausable */

  /**
   * @dev Override method to ensure that contract properly configured before it is unpaused
   */
  function unpause()
    onlyAllowedManager('unpause_contract')  // todo do we need to explicitly repeat modifiers ?
    whenPaused  // todo do we need to explicitly repeat modifiers ?
    onlyValidCrydrStorageAddress(crydrStorage)
  {
    require(crydrViewsAddressesList.length > 0);

    super.unpause();
  }


  /* Helpers */

  modifier onlyValidCrydrStorageAddress(address _storageAddress) {
    require(_storageAddress != address(0x0));
    // todo check that this is contract address
    _;
  }

  modifier onlyValidCrydrViewStandardName(string _viewApiStandard) {
    require(bytes(_viewApiStandard).length > 0);
    _;
  }

  modifier onlyValidCrydrViewAddress(address _viewAddress) {
    require(_viewAddress != address(0x0));
    // todo check that this is contract address
    _;
  }

  modifier onlyDifferentAddress(address _address) {
    require(_address != address(this));
    _;
  }

  modifier onlyCrydrView() {
    require(isRegisteredView[msg.sender] == true);
    _;
  }
}
