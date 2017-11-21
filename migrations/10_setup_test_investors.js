require('babel-register');
require('babel-polyfill');

global.artifacts = artifacts; // eslint-disable-line no-undef

const GlobalConfig = require('../routine/misc/GlobalConfig');
const SubmitTx     = require('../routine/misc/SubmitTx');

const InvestorRegistry                = global.artifacts.require('InvestorRegistry.sol');
const InvestorRegistryRoutines        = require('../routine/registry/InvestorRegistry');
const CrydrControllerMintableRoutines = require('../routine/crydr/controller/CrydrControllerMintableInterface');

const JNTController    = global.artifacts.require('JNTController.sol');
const jUSDController   = global.artifacts.require('jUSDController.sol');
const jEURController   = global.artifacts.require('jEURController.sol');
const jGBPController   = global.artifacts.require('jGBPController.sol');
const jAEDController   = global.artifacts.require('jAEDController.sol');
const jRUBController   = global.artifacts.require('jRUBController.sol');
const jCNYController   = global.artifacts.require('jCNYController.sol');
const jTBillController = global.artifacts.require('jTBillController.sol');
const jGDRController   = global.artifacts.require('jGDRController.sol');


const migrationRoutine = async (manager, jntHolders, tokensHolder, licensedInvestors) => {
  const licensesNames   = ['gdr_license', 'treasury_bill_license'];
  const expireTimestamp = 1514678400;
  const amountToMint    = 1000 * (10 ** 18);

  const investorRegistryInstance = await InvestorRegistry.deployed();
  await Promise.all(licensedInvestors.map(
    (licensedInvestor) => InvestorRegistryRoutines.registerInvestor(investorRegistryInstance.address, manager,
                                                                    licensedInvestor, licensesNames, expireTimestamp)
  ));

  const JNTControllerInstance = await JNTController.deployed();
  await Promise.all(jntHolders.map(
    (jntHolder) => CrydrControllerMintableRoutines.mintTokens(JNTControllerInstance.address, manager,
                                                              jntHolder, amountToMint)
  ));

  const crydrControllerObjects = [jUSDController,
                                  jEURController,
                                  jGBPController,
                                  jAEDController,
                                  jRUBController,
                                  jCNYController,
                                  jTBillController,
                                  jGDRController];

  const crydrControllerInstances = await Promise.all(crydrControllerObjects.map((obj) => obj.deployed()));
  await Promise.all(crydrControllerInstances.map(
    (instance) => CrydrControllerMintableRoutines.mintTokens(instance.address, manager, tokensHolder, amountToMint)
  ));
};

// todo verify migration


/* Migration */

module.exports = (deployer, network, accounts) => {
  GlobalConfig.setWeb3(web3); // eslint-disable-line no-undef
  if (network === 'development' || network === 'coverage') {
    SubmitTx.setDefaultWaitParams(
      {
        minConfirmations:   0,
        pollingInterval:    50,
        maxTimeoutMillisec: 60 * 1000,
        maxTimeoutBlocks:   5,
      });
  }

  const manager           = accounts[2];
  const jntHolders        = accounts.slice(3, 8);
  const tokensHolder      = accounts[3];
  const licensedInvestors = accounts.slice(3, 6);

  global.console.log('  Start migration');
  global.console.log('  Accounts:');
  global.console.log(`\tmanager: ${manager}`);
  global.console.log(`\tjntHolders: ${jntHolders}`);
  global.console.log(`\ttokensHolder: ${tokensHolder}`);
  global.console.log(`\tlicensedInvestors: ${licensedInvestors}`);

  deployer.then(() => migrationRoutine(manager, jntHolders, tokensHolder, licensedInvestors));
};