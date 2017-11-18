/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import '../../crydr/view/CrydrViewERC20.sol';


contract jGDRViewERC20 is CrydrViewERC20 {
  function jGDRViewERC20() CrydrViewERC20("Global depositary receipt", "jGDR", 18, 0x5) {}
}
