/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.24;


import '../../../lifecycle/Manageable/ManageableInterface.sol';
import '../CrydrControllerBase/CrydrControllerBaseInterface.sol';
import './CrydrControllerBlockableInterface.sol';

import '../../storage/CrydrStorageBlocks/CrydrStorageBlocksInterface.sol';


/**
 * @title CrydrControllerBlockable interface
 * @dev Implementation of a contract that allows blocking/unlocking accounts
 */
contract CrydrControllerBlockable is ManageableInterface,
                                     CrydrControllerBaseInterface,
                                     CrydrControllerBlockableInterface {


  /* blocking/unlocking */

  function blockAccount(
    address _account
  )
    public
    onlyAllowedManager('block_account')
  {
    CrydrStorageBlocksInterface(getCrydrStorageAddress()).blockAccount(_account);
  }

  function unblockAccount(
    address _account
  )
    public
    onlyAllowedManager('unblock_account')
  {
    CrydrStorageBlocksInterface(getCrydrStorageAddress()).unblockAccount(_account);
  }

  function blockAccountFunds(
    address _account,
    uint256 _value
  )
    public
    onlyAllowedManager('block_account_funds')
  {
    CrydrStorageBlocksInterface(getCrydrStorageAddress()).blockAccountFunds(_account, _value);
  }

  function unblockAccountFunds(
    address _account,
    uint256 _value
  )
    public
    onlyAllowedManager('unblock_account_funds')
  {
    CrydrStorageBlocksInterface(getCrydrStorageAddress()).unblockAccountFunds(_account, _value);
  }
}
