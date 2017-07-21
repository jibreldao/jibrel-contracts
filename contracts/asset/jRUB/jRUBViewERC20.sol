/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.11;


import '../../crydr/view/CrydrViewERC20.sol';


contract jRUBViewERC20 is CrydrViewERC20 {
  function jRUBViewERC20() CrydrViewERC20("Russian ruble", "jRUB", 18) {}
}