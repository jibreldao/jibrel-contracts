/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../crydr/view/CrydrViewERC20.sol";


contract JNTViewERC20 is CrydrViewERC20 {

  function JNTViewERC20() CrydrViewERC20('JNT', 'Jibrel Network Token', 'JNT', 18) {}
}