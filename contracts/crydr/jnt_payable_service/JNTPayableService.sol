/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.11;


import "../../lifecycle/Pausable.sol";
import "../controller/CrydrControllerBaseInterface.sol";
import "../view/ERC20Interface.sol";
import "../jnt/JNTControllerInterface.sol";
import "./JNTPayableServiceInterface.sol";


contract JNTPayableService is JNTPayableServiceInterface, Pausable {

  /* Storage */

  JNTControllerInterface jntController;
  address jntBeneficiary;


  /* JNTPayableServiceInterface */

  /* Configuration */

  function setJntController(
    address _jntController
  )
    onlyValidJntControllerAddress(_jntController)
    onlyAllowedManager('set_jnt_controller')
    whenPaused
  {
    require(_jntController != address(jntController));

    jntController = JNTControllerInterface(_jntController);
    JNTControllerChangedEvent(_jntController);
  }

  function getJntController() constant returns (address) {
    return address(jntController);
  }


  function setJntBeneficiary(
    address _jntBeneficiary
  )
    onlyValidJntBeneficiary(_jntBeneficiary)
    onlyAllowedManager('set_jnt_beneficiary')
    whenPaused
  {
    require(_jntBeneficiary != jntBeneficiary);

    jntBeneficiary = _jntBeneficiary;
    JNTBeneficiaryChangedEvent(jntBeneficiary);
  }

  function getJntBeneficiary() constant returns (address) {
    return jntBeneficiary;
  }


  /* Actions */

  function chargeJNT(address _from, address _to, uint _value) internal whenNotPaused {
    require(_from != address(0x0));
    require(_to != address(0x0));
    require(_value > 0);

    jntController.chargeJNT(_from, _to, _value);
    JNTChargedEvent(_from, _to, _value);
  }

  /**
   * @dev Method used to withdraw collected JNT if contract itself used to store charged JNT.
   * @dev Assumed that JNT provides 'erc20' view.
   */
  function withdrawJnt() onlyAllowedManager('withdraw_jnt') {
    var _jntControllerAddress = address(jntController);
    var _crydrController = CrydrControllerBaseInterface(_jntControllerAddress);
    var _jntERC20ViewAddress = _crydrController.getCrydrView('erc20');
    var _jntERC20View = ERC20Interface(_jntERC20ViewAddress);
    _jntERC20View.transfer(msg.sender, _jntERC20View.balanceOf(this));
  }


  /* Pausable */

  /**
   * @dev Override method to ensure that contract properly configured before it is unpaused
   */
  function unpause()
    onlyAllowedManager('unpause_contract')  // todo do we need to explicitly repeat modifiers ?
    whenPaused  // todo do we need to explicitly repeat modifiers ?
    onlyValidJntControllerAddress(jntController)
    onlyValidJntBeneficiary(jntBeneficiary)
  {
    super.unpause();
  }


  /* Helpers */

  modifier onlyValidJntControllerAddress(address _jntAddress) {
    require(_jntAddress != address(0x0));
    // todo check that this is contract address
    _;
  }

   modifier onlyValidJntBeneficiary(address _jntBeneficiary) {
    require(_jntBeneficiary != address(0x0));
    _;
  }
}