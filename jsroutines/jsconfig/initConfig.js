const TxConfig = require('./TxConfig');
const DeployConfig = require('./DeployConfig');

module.exports = function initConfig(web3, deployer, network, accounts) {
  global.console.log(`  Network:  ${network}`);
  global.console.log(`  Accounts: ${accounts.join('\n            ')}`);

  TxConfig.setWeb3(web3);
  TxConfig.setNetworkType(network);

  DeployConfig.setDeployer(deployer);
  DeployConfig.setAccounts(accounts);
};
