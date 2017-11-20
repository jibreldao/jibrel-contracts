/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import './CrydrControllerBase.sol';
import './CrydrControllerERC20Interface.sol';
import "../storage/CrydrStorageBaseInterface.sol";
import "../storage/CrydrStorageERC20Interface.sol";
import "../view/CrydrViewERC20LoggableInterface.sol";


/**
 * @title CrydrControllerERC20Interface interface
 * @dev Interface of a contract that implement business-logic of an ERC20 CryDR
 */
contract CrydrControllerERC20 is CrydrControllerBase, CrydrControllerERC20Interface {

  /* ERC20 support. _msgsender - account that invoked CrydrView */

  function transfer(
    address _msgsender,
    address _to,
    uint _value
  )
    onlyCrydrView
    whenContractNotPaused
  {
    CrydrStorageERC20Interface(address(crydrStorage)).transfer(_msgsender, _to, _value);

    if (crydrViewsAddresses['erc20'] != 0x0) {
        CrydrViewERC20LoggableInterface(crydrViewsAddresses['erc20']).emitTransferEvent(_msgsender, _to, _value);
    }
  }

  function getTotalSupply() constant returns (uint) {
    return CrydrStorageBaseInterface(address(crydrStorage)).getTotalSupply();
  }

  function getBalance(address _owner) constant returns (uint balance) {
    return CrydrStorageBaseInterface(address(crydrStorage)).getBalance(_owner);
  }

  function approve(
    address _msgsender,
    address _spender,
    uint _value
  )
    onlyCrydrView
    whenContractNotPaused
  {
    // https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
    var allowance = crydrStorage.getAllowance(_msgsender, _spender);
    require((allowance > 0 && _value == 0) || (allowance == 0 && _value > 0));

    CrydrStorageERC20Interface(address(crydrStorage)).approve(_msgsender, _spender, _value);

    if (crydrViewsAddresses['erc20'] != 0x0) {
        CrydrViewERC20LoggableInterface(crydrViewsAddresses['erc20']).emitApprovalEvent(_msgsender, _spender, _value);
    }
  }

  function transferFrom(
    address _msgsender,
    address _from,
    address _to,
    uint _value
  )
    onlyCrydrView
    whenContractNotPaused
  {
    CrydrStorageERC20Interface(address(crydrStorage)).transferFrom(_msgsender, _from, _to, _value);

    if (crydrViewsAddresses['erc20'] != 0x0) {
        CrydrViewERC20LoggableInterface(crydrViewsAddresses['erc20']).emitTransferEvent(_from, _to, _value);
    }
  }

  function getAllowance(address _owner, address _spender) constant returns (uint remaining) {
    return CrydrStorageBaseInterface(address(crydrStorage)).getAllowance(_owner, _spender);
  }
}