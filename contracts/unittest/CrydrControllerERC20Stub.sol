/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.15;


import "../feature/assetid/AssetID.sol";
import "../../contracts/crydr/controller/CrydrControllerERC20Interface.sol";
import "../../contracts/crydr/view/CrydrViewERC20LoggableInterface.sol";


/**
 * @title CrydrControllerERC20Stub
 * @dev This contract used only to test contracts
 */
contract CrydrControllerERC20Stub is AssetID,
                                     CrydrControllerERC20Interface,
                                     CrydrViewERC20LoggableInterface {

  /* Storage */

  uint public transferCounter = 0;
  uint public approveCounter = 0;
  uint public transferFromCounter = 0;
  address crydrView;


  /* Constructor */

  function CrydrControllerERC20Stub(string _assetID, address _crydrView) AssetID(_assetID) {
    crydrView = _crydrView;
  }


  /* CrydrControllerERC20Interface */

  function transfer(address _msgsender, address _to, uint _value)
  {
    transferCounter += 1;
  }

  function getTotalSupply() constant returns (uint)
  {
    return 60 * (10 ** 18);
  }

  function getBalance(address _owner) constant returns (uint balance)
  {
    require(_owner == _owner); // always true, to avoid annoying compilation warnings
    return 40 * (10 ** 18);
  }

  function approve(address _msgsender, address _spender, uint _value)
  {
    approveCounter += 1;
  }

  function transferFrom(address _msgsender, address _from, address _to, uint _value)
  {
    require(_msgsender == _msgsender); // always true, to avoid annoying compilation warnings
    transferFromCounter += 1;
  }

  function getAllowance(address _owner, address _spender) constant returns (uint remaining)
  {
    require(_owner == _owner); // always true, to avoid annoying compilation warnings
    require(_spender == _spender); // always true, to avoid annoying compilation warnings
    return 20 * (10 ** 18);
  }


  /* CrydrViewERC20LoggableInterface */

  function emitTransferEvent(address _from, address _to, uint _value) external
  {
    CrydrViewERC20LoggableInterface(crydrView).emitTransferEvent(_from, _to, _value);
  }

  function emitApprovalEvent(address _owner, address _spender, uint _value) external
  {
    CrydrViewERC20LoggableInterface(crydrView).emitApprovalEvent(_owner, _spender, _value);
  }
}