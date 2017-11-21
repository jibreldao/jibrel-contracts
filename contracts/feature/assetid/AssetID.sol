/* Author: Aleksey Selikhov  aleksey.selikhov@gmail.com */

pragma solidity ^0.4.15;


import "./AssetIDInterface.sol";


/**
 * @title AssetID
 * @dev Base contract implementing AssetIDInterface
 */
contract AssetID is AssetIDInterface {

  /* Storage */

  string assetID;


  /* Constructor */

  function AssetID(string _assetID) {
    assetID = _assetID;
  }


  /* Getters */

  function getAssetID() constant returns (string) {
    return assetID;
  }

  function getAssetIDHash() constant returns (bytes32) {
    return sha3(assetID);
  }
}