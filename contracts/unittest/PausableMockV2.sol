/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;

import '../lifecycle/Ownable.sol';
import '../lifecycle/Manageable.sol';
import '../lifecycle/Pausable.sol';


/**
 * @title PausableMock
 * @dev This contract used only to test modifiers of Pausable contract
 */
contract PausableMockV2 is Ownable, Manageable, Pausable {

  event WhenContractNotPausedEvent();
  event WhenContractPausedEvent();

  uint256 public counter = 0;

  function worksWhenContractNotPaused() public whenContractNotPaused {
    counter += 1;
    emit WhenContractNotPausedEvent();
  }

  function worksWhenContractPaused() public whenContractPaused {
    counter += 10;
    emit WhenContractPausedEvent();
  }
}
