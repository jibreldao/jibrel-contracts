require('babel-register');
require('babel-polyfill');

global.artifacts = artifacts; // eslint-disable-line no-undef


const SubmitTx = require('../jsroutines/jsapi/misc/SubmitTx');

const JNTStorage    = global.artifacts.require('JNTStorage.sol');
const JNTController = global.artifacts.require('JNTController.sol');
const JNTViewERC20  = global.artifacts.require('JNTViewERC20.sol');

const DeployConfig = require('../jsroutines/jsconfig/DeployConfig');
const CrydrInit = require('../jsroutines/jsinit/CrydrInit');


/* Migration actions */

const executeMigration = async () => {
  await CrydrInit.initCrydr(JNTStorage, JNTController, JNTViewERC20, 'erc20');
  await CrydrInit.upauseCrydrControllerAndStorage(JNTStorage, JNTController);
};

const verifyMigration = async () => {
  // todo verify migration, make integration tests
};


/* Migration */

module.exports = (deployer, network, accounts) => {
  global.console.log('  Start migration');
  global.console.log(`  Accounts: ${accounts}`);
  global.console.log(`  Network:  ${network}`);

  SubmitTx.setWeb3(web3); // eslint-disable-line no-undef
  if (network === 'development' || network === 'coverage') {
    SubmitTx.setDefaultWaitParamsForTestNetwork();
  }

  DeployConfig.setDeployer(deployer);
  DeployConfig.setAccounts(accounts);

  deployer.then(() => executeMigration())
          .then(() => verifyMigration())
          .then(() => global.console.log('  Migration finished'));
};
