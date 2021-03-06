/* Author: Victor Mezrin  victor@mezrin.com */

pragma solidity ^0.4.24;


import '../../util/CommonModifiers/CommonModifiers.sol';
import '../../feature/AssetID/AssetID.sol';
import '../../lifecycle/Ownable/Ownable.sol';
import '../../lifecycle/Manageable/Manageable.sol';
import '../../lifecycle/Pausable/Pausable.sol';
import '../../feature/BytecodeExecutor/BytecodeExecutor.sol';
import '../../crydr/controller/CrydrControllerBase/CrydrControllerBase.sol';
import '../../crydr/controller/CrydrControllerBlockable/CrydrControllerBlockable.sol';
import '../../crydr/controller/CrydrControllerMintable/CrydrControllerMintable.sol';
import '../../crydr/controller/CrydrControllerERC20/CrydrControllerERC20.sol';
import '../../crydr/controller/CrydrControllerForcedTransfer/CrydrControllerForcedTransfer.sol';
import '../../crydr/controller/CrydrControllerLicensedBase/CrydrControllerLicensedBase.sol';
import '../../crydr/controller/CrydrControllerLicensedERC20/CrydrControllerLicensedERC20.sol';


/**
 * @title JCashCrydrControllerLicensed
 * @dev Mediates views and storage of an licensed CryDR
 */
contract JCashCrydrControllerLicensed is CommonModifiers,
                                         AssetID,
                                         Ownable,
                                         Manageable,
                                         Pausable,
                                         BytecodeExecutor,
                                         CrydrControllerBase,
                                         CrydrControllerBlockable,
                                         CrydrControllerMintable,
                                         CrydrControllerERC20,
                                         CrydrControllerForcedTransfer,
                                         CrydrControllerLicensedBase,
                                         CrydrControllerLicensedERC20 {

  /* Constructor */

  constructor (string _assetID)
    public
    AssetID(_assetID)
  {}
}
