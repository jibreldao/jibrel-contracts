/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.15;


import "../../crydr/storage/CrydrStorage.sol";


contract jRUBStorage is CrydrStorage {
  function jRUBStorage() CrydrStorage(0x6) {}
}
