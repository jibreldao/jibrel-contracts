import { submitTxAndWaitConfirmation } from '../../../../jsroutines/util/SubmitTx';

const Promise = require('bluebird');

const CrydrStorageBalanceInterfaceArtifact = global.artifacts.require('CrydrStorageBalanceInterface.sol');


/**
 * Low-level change of balance
 */

export const increaseBalance = async (crydrStorageAddress, crydrControllerAddress,
                                      accountAddress, valueWei) => {
  global.console.log('\tIncrease balance of account:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\taccountAddress - ${accountAddress}`);
  global.console.log(`\t\tvalueWei - ${valueWei}`);
  // await submitTxAndWaitConfirmation(
  //   CrydrStorageBalanceInterfaceArtifact
  //     .at(crydrStorageAddress)
  //     .increaseBalance
  //     .sendTransaction,
  //   [accountAddress, valueWei],
  //   { from: crydrControllerAddress }
  // );
  const instance = await CrydrStorageBalanceInterfaceArtifact.at(crydrStorageAddress);
  await instance.increaseBalance(accountAddress, valueWei, { from: crydrControllerAddress });
  global.console.log('\tBalance successfully increased');
};

export const decreaseBalance = async (crydrStorageAddress, crydrControllerAddress,
                                      accountAddress, valueWei) => {
  global.console.log('\tDecrease balance of account:');
  global.console.log(`\t\tstorage - ${crydrStorageAddress}`);
  global.console.log(`\t\tcontroller - ${crydrControllerAddress}`);
  global.console.log(`\t\taccountAddress - ${accountAddress}`);
  global.console.log(`\t\tvalueWei - ${valueWei}`);
  // await submitTxAndWaitConfirmation(
  //   CrydrStorageBalanceInterfaceArtifact
  //     .at(crydrStorageAddress)
  //     .decreaseBalance
  //     .sendTransaction,
  //   [accountAddress, valueWei],
  //   { from: crydrControllerAddress }
  // );
  const instance = await CrydrStorageBalanceInterfaceArtifact.at(crydrStorageAddress);
  await instance.decreaseBalance(accountAddress, valueWei, { from: crydrControllerAddress });
  global.console.log('\tBalance successfully decreased');
};

export const getBalance = async (crydrStorageAddress, accountAddress) =>
  CrydrStorageBalanceInterfaceArtifact.at(crydrStorageAddress).getBalance.call(accountAddress);

export const getTotalSupply = async (crydrStorageAddress) =>
  CrydrStorageBalanceInterfaceArtifact.at(crydrStorageAddress).getTotalSupply.call();


/**
 * Events
 */


export const getAccountBalanceIncreasedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageBalanceInterfaceArtifact
    .at(contractAddress)
    .AccountBalanceIncreasedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};

export const getAccountBalanceDecreasedEvents = (contractAddress, eventDataFilter = {}, commonFilter = {}) => {
  const eventObj = CrydrStorageBalanceInterfaceArtifact
    .at(contractAddress)
    .AccountBalanceDecreasedEvent(eventDataFilter, commonFilter);
  const eventGet = Promise.promisify(eventObj.get).bind(eventObj);
  return eventGet();
};
