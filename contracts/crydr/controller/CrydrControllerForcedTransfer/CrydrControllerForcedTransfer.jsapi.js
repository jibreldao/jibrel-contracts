import * as ManageableInterfaceJSAPI from '../../../lifecycle/Manageable/ManageableInterface.jsapi';
import * as ManageableJSAPI from '../../../lifecycle/Manageable/Manageable.jsapi';


/**
 * Permissions
 */

export const grantManagerPermissions = async (crydrControllerAddress, ownerAddress, managerAddress) => {
  global.console.log('\tConfiguring manager permissions for mintable crydr controller ...');
  global.console.log(`\t\tcrydrControllerAddress - ${crydrControllerAddress}`);
  global.console.log(`\t\townerAddress - ${ownerAddress}`);
  global.console.log(`\t\tmanagerAddress - ${managerAddress}`);

  const managerPermissions = [
    'forced_transfer',
  ];

  await ManageableJSAPI.grantManagerPermissions(crydrControllerAddress, ownerAddress, managerAddress, managerPermissions);

  global.console.log('\tPermissions to the manager of ForcedTransfer crydr controller granted');
  return null;
};

export const verifyManagerPermissions = async (contractAddress, managerAddress) =>
  ManageableInterfaceJSAPI.verifyManagerAllowed(contractAddress, managerAddress, 'forced_transfer');
