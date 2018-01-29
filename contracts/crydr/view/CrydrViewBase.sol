/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.18;


import '../../lifecycle/Pausable.sol';
import '../../util/CommonModifiers.sol';
import '../../feature/assetid/AssetID.sol';
import './CrydrViewBaseInterface.sol';


contract CrydrViewBase is Pausable,
                          CommonModifiers,
                          AssetID,
                          CrydrViewBaseInterface {

  /* Storage */

  address crydrController = address(0x0);
  string crydrViewStandardName = '';


  /* Constructor */

  function CrydrViewBase(string _crydrViewStandardName) public {
    require(bytes(_crydrViewStandardName).length > 0);

    crydrViewStandardName = _crydrViewStandardName;
  }


  /* CrydrViewBaseInterface */

  function setCrydrController(
    address _crydrController
  )
    external
    onlyContractAddress(_crydrController)
    onlyAllowedManager('set_crydr_controller')
    whenContractPaused
  {
    require(crydrController != _crydrController);

    crydrController = _crydrController;
    CrydrControllerChangedEvent(_crydrController);
  }

  function getCrydrController() public constant returns (address) {
    return crydrController;
  }


  function getCrydrViewStandardName() public constant returns (string) {
    return crydrViewStandardName;
  }

  function getCrydrViewStandardNameHash() public constant returns (bytes32) {
    return keccak256(crydrViewStandardName);
  }


  /* PausableInterface */

  /**
   * @dev Override method to ensure that contract properly configured before it is unpaused
   */
  function unpauseContract() public {
    require(isContract(crydrController) == true);
    require(getAssetIDHash() == AssetIDInterface(crydrController).getAssetIDHash());

    super.unpauseContract();
  }
}
