/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.11;


/**
 * @title CrydrControllerMintableInterface interface
 * @dev Interface of a contract that allows minting/burning of tokens
 */
contract CrydrControllerMintableInterface {

  /* minting/burning */

  function mint(address _account, uint _value);
  function burn(address _account, uint _value);
}