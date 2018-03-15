const PausableJSAPI = require('../jsapi/lifecycle/Pausable');
const CrydrStorageBaseInterfaceJSAPI = require('../jsapi/crydr/storage/CrydrStorageBaseInterface');
const CrydrControllerBaseInterfaceJSAPI = require('../jsapi/crydr/controller/CrydrControllerBaseInterface');
const CrydrControllerLicensedBaseInterfaceJSAPI = require('../jsapi/crydr/controller/CrydrControllerLicensedBaseInterface');
const CrydrViewBaseInterfaceJSAPI = require('../jsapi/crydr/view/CrydrViewBaseInterface');

const DeployConfig = require('../jsconfig/DeployConfig');

const CrydrStorageInitJSAPI = require('./CrydrStorageInit');
const CrydrLicenseRegistryInitJSAPI = require('./CrydrLicenseRegistryInit');
const CrydrControllerInitJSAPI = require('./CrydrControllerInit');
const CrydrViewInitJSAPI = require('./CrydrViewInit');


export const linkCrydrStorage = async (crydrStorageAddress,
                                       crydrControllerAddress) => {
  global.console.log('\tLink crydr storage to controller...');
  global.console.log(`\t\tcrydrStorageAddress - ${crydrStorageAddress}`);
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);

  const { managerGeneral } = DeployConfig.getAccounts();
  global.console.log(`\t\tmanagerGeneral - ${managerGeneral}`);

  await CrydrStorageBaseInterfaceJSAPI
    .setCrydrController(crydrStorageAddress, managerGeneral, crydrControllerAddress);
  await CrydrControllerBaseInterfaceJSAPI
    .setCrydrStorage(crydrControllerAddress, managerGeneral, crydrStorageAddress);

  global.console.log('\tCrydr storage successfully linked');
  return null;
};

export const linkCrydrView = async (crydrControllerAddress,
                                    crydrViewAddress,
                                    crydrViewApiStandardName) => {
  global.console.log('\tLink crydr view to controller...');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\tcrydrViewAddress - ${crydrViewAddress}`);
  global.console.log(`\t\tcrydrViewApiStandardName - ${crydrViewApiStandardName}`);

  const { managerGeneral } = DeployConfig.getAccounts();
  global.console.log(`\t\tmanagerGeneral - ${managerGeneral}`);

  await CrydrViewBaseInterfaceJSAPI
    .setCrydrController(crydrViewAddress, managerGeneral, crydrControllerAddress);
  await CrydrControllerBaseInterfaceJSAPI
    .setCrydrView(crydrControllerAddress, managerGeneral, crydrViewAddress, crydrViewApiStandardName);

  global.console.log('\tCrydr view successfully linked');
  return null;
};

export const linkLicenseRegistry = async (licenseRegistryAddress,
                                          crydrControllerAddress) => {
  global.console.log('\tLink license registry and controller...');
  global.console.log(`\t\tlicenseRegistryAddress - ${licenseRegistryAddress}`);
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);

  const { managerGeneral } = DeployConfig.getAccounts();
  global.console.log(`\t\tmanagerLicense - ${managerGeneral}`);

  await CrydrControllerLicensedBaseInterfaceJSAPI
    .setLicenseRegistry(crydrControllerAddress, managerGeneral, licenseRegistryAddress);

  global.console.log('\tLicense registry and controller successfully linked');
  return null;
};


export const initCrydr = async (crydrStorageContractArtifact,
                                crydrControllerContractArtifact,
                                crydrViewContractArtifact,
                                crydrViewApiStandardName) => {
  global.console.log('\tDeploy and init JCash crydr...');
  global.console.log(`\t\tcrydrViewApiStandardName - ${crydrViewApiStandardName}`);

  global.console.log('\tDeploying crydr contracts');
  await CrydrStorageInitJSAPI.deployCrydrStorage(crydrStorageContractArtifact);
  await CrydrControllerInitJSAPI.deployCrydrController(crydrControllerContractArtifact);
  await CrydrViewInitJSAPI.deployCrydrView(crydrViewContractArtifact);
  global.console.log('\tCrydr contracts successfully deployed');

  const crydrStorageInstance = await crydrStorageContractArtifact.deployed();
  const crydrStorageAddress = crydrStorageInstance.address;
  const crydrControllerInstance = await crydrControllerContractArtifact.deployed();
  const crydrControllerAddress = crydrControllerInstance.address;
  const crydrViewInstance = await crydrViewContractArtifact.deployed();
  const crydrViewAddress = crydrViewInstance.address;

  global.console.log('\tConfiguring crydr managers');
  await CrydrStorageInitJSAPI.configureCrydrStorageManagers(crydrStorageAddress);
  await CrydrControllerInitJSAPI.configureCrydrControllerManagers(crydrControllerAddress);
  await CrydrViewInitJSAPI.configureCrydrViewManagers(crydrViewAddress);
  global.console.log('\tCrydr managers successfully configured');

  global.console.log('\tLink crydr contracts');
  await linkCrydrStorage(crydrStorageAddress, crydrControllerAddress);
  await linkCrydrView(crydrControllerAddress, crydrViewAddress, crydrViewApiStandardName);
  global.console.log('\tCrydr contracts successfully linked');

  global.console.log('\tJCash crydr successfully initialized');
  return null;
};

export const initLicensedCrydr = async (crydrStorageContractArtifact,
                                        licenseRegistryArtifact,
                                        crydrControllerContractArtifact,
                                        crydrViewContractArtifact,
                                        crydrViewApiStandardName) => {
  global.console.log('\tDeploy and init licensed JCash crydr...');

  await initCrydr(crydrStorageContractArtifact,
                  crydrControllerContractArtifact,
                  crydrViewContractArtifact,
                  crydrViewApiStandardName);

  global.console.log('\tDeploying license registry contract');
  await CrydrLicenseRegistryInitJSAPI.deployLiceseRegistry(licenseRegistryArtifact);
  global.console.log('\tLicense registry successfully deployed');

  const licenseRegistryInstance = await licenseRegistryArtifact.deployed();
  const licenseRegistryAddress = licenseRegistryInstance.address;
  const crydrViewInstance = await crydrViewContractArtifact.deployed();
  const crydrViewAddress = crydrViewInstance.address;
  const crydrControllerInstance = await crydrControllerContractArtifact.deployed();
  const crydrControllerAddress = crydrControllerInstance.address;

  global.console.log('\tConfiguring license managers');
  await CrydrLicenseRegistryInitJSAPI.configureLicenseRegistryManagers(licenseRegistryAddress);
  await CrydrControllerInitJSAPI.configureCrydrControllerLicensedManagers(crydrControllerAddress);
  await CrydrViewInitJSAPI.configureCrydrViewMetadataManagers(crydrViewAddress);
  global.console.log('\tLicense managers successfully configured');

  global.console.log('\tLink license registry and controller');
  await linkLicenseRegistry(licenseRegistryAddress, crydrControllerAddress);
  global.console.log('\tLicense registry and controller successfully linked');

  global.console.log('\tLicensed JCash crydr successfully initialized');
  return null;
};


export const upauseCrydrContract = async (crydrContractArtifact, contractType) => {
  global.console.log(`\tUnpause ${contractType} of JCash crydr...`);

  const { managerPause } = DeployConfig.getAccounts();
  global.console.log(`\t\tmanagerPause - ${managerPause}`);

  const crydrContractInstance = await crydrContractArtifact.deployed();
  const crydrContractAddress = crydrContractInstance.address;

  await PausableJSAPI.unpauseContract(crydrContractAddress, managerPause);

  global.console.log(`\t${contractType} of JCash crydr successfully unpaused`);
  return null;
};
