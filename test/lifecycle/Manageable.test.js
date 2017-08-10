const Manageable = global.artifacts.require('Manageable.sol');

const UtilsTestRoutines = require('../../routine/utils/UtilsTest');


global.contract('Manageable', (accounts) => {
  let manageableContract;

  const owner   = accounts[0];
  const manager = accounts[1];

  global.beforeEach(async () => {
    manageableContract = await Manageable.new({ from: owner });
  });

  // todo test events

  global.it('should test that contract works as expected', async () => {
    let isManagerEnabled;
    let isPermission01Granted;
    let isPermission02Granted;
    let isPermission01Allowed;
    let isPermission02Allowed;

    isManagerEnabled = await manageableContract.isManagerEnabled.call(manager);
    global.assert.equal(isManagerEnabled, false);
    isPermission01Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_01');
    global.assert.equal(isPermission01Granted, false);
    isPermission02Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_02');
    global.assert.equal(isPermission02Granted, false);
    isPermission01Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_01');
    global.assert.equal(isPermission01Allowed, false);
    isPermission02Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_02');
    global.assert.equal(isPermission02Allowed, false);

    await manageableContract.enableManager.sendTransaction(manager, { from: owner });

    isManagerEnabled = await manageableContract.isManagerEnabled.call(manager);
    global.assert.equal(isManagerEnabled, true);
    isPermission01Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_01');
    global.assert.equal(isPermission01Granted, false);
    isPermission02Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_02');
    global.assert.equal(isPermission02Granted, false);
    isPermission01Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_01');
    global.assert.equal(isPermission01Allowed, false);
    isPermission02Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_02');
    global.assert.equal(isPermission02Allowed, false);

    await manageableContract.grantManagerPermission.sendTransaction(manager, 'permission_01', { from: owner });

    isManagerEnabled = await manageableContract.isManagerEnabled.call(manager);
    global.assert.equal(isManagerEnabled, true);
    isPermission01Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_01');
    global.assert.equal(isPermission01Granted, true);
    isPermission02Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_02');
    global.assert.equal(isPermission02Granted, false);
    isPermission01Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_01');
    global.assert.equal(isPermission01Allowed, true);
    isPermission02Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_02');
    global.assert.equal(isPermission02Allowed, false);

    await manageableContract.grantManagerPermission.sendTransaction(manager, 'permission_02', { from: owner });

    isManagerEnabled = await manageableContract.isManagerEnabled.call(manager);
    global.assert.equal(isManagerEnabled, true);
    isPermission01Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_01');
    global.assert.equal(isPermission01Granted, true);
    isPermission02Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_02');
    global.assert.equal(isPermission02Granted, true);
    isPermission01Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_01');
    global.assert.equal(isPermission01Allowed, true);
    isPermission02Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_02');
    global.assert.equal(isPermission02Allowed, true);

    await manageableContract.revokeManagerPermission.sendTransaction(manager, 'permission_02', { from: owner });

    isManagerEnabled = await manageableContract.isManagerEnabled.call(manager);
    global.assert.equal(isManagerEnabled, true);
    isPermission01Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_01');
    global.assert.equal(isPermission01Granted, true);
    isPermission02Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_02');
    global.assert.equal(isPermission02Granted, false);
    isPermission01Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_01');
    global.assert.equal(isPermission01Allowed, true);
    isPermission02Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_02');
    global.assert.equal(isPermission02Allowed, false);

    await manageableContract.disableManager.sendTransaction(manager, { from: owner });

    isManagerEnabled = await manageableContract.isManagerEnabled.call(manager);
    global.assert.equal(isManagerEnabled, false);
    isPermission01Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_01');
    global.assert.equal(isPermission01Granted, true);
    isPermission02Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_02');
    global.assert.equal(isPermission02Granted, false);
    isPermission01Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_01');
    global.assert.equal(isPermission01Allowed, false);
    isPermission02Allowed = await manageableContract.isManagerAllowed.call(manager, 'permission_02');
    global.assert.equal(isPermission02Allowed, false);
  });

  global.it('should test that functions throw if general conditions are not met', async () => {
    // getters

    await UtilsTestRoutines.checkContractThrows(manageableContract.isManagerEnabled.call,
                                                [0x0],
                                                'isManagerEnabled should reject invalid manager address');

    await UtilsTestRoutines.checkContractThrows(manageableContract.isPermissionGranted.call,
                                                [0x0, 'permission_01'],
                                                'isPermissionGranted should reject invalid manager address');
    await UtilsTestRoutines.checkContractThrows(manageableContract.isPermissionGranted.call,
                                                [manager, ''],
                                                'isPermissionGranted should reject invalid permission name');

    await UtilsTestRoutines.checkContractThrows(manageableContract.isManagerAllowed.call,
                                                [0x0, 'permission_01'],
                                                'isManagerAllowed should reject invalid manager address');
    await UtilsTestRoutines.checkContractThrows(manageableContract.isManagerAllowed.call,
                                                [manager, ''],
                                                'isManagerAllowed should reject invalid permission name');


    // setters

    // enableManager & disableManager

    const isManagerEnabled = await manageableContract.isManagerEnabled.call(manager);
    global.assert.equal(isManagerEnabled, false);

    await UtilsTestRoutines.checkContractThrows(manageableContract.enableManager.sendTransaction,
                                                [0x0, { from: owner }],
                                                'enableManager should reject invalid manager address');
    await UtilsTestRoutines.checkContractThrows(manageableContract.enableManager.sendTransaction,
                                                [manager, { from: manager }],
                                                'Only owner should be able to enable manager');
    await manageableContract.enableManager.sendTransaction(manager, { from: owner });
    await UtilsTestRoutines.checkContractThrows(manageableContract.enableManager.sendTransaction,
                                                [manager, { from: owner }],
                                                'Should not be possible to enable already enabled manager');

    await UtilsTestRoutines.checkContractThrows(manageableContract.disableManager.sendTransaction,
                                                [0x0, { from: owner }],
                                                'disableManager should reject invalid manager address');
    await UtilsTestRoutines.checkContractThrows(manageableContract.disableManager.sendTransaction,
                                                [manager, { from: manager }],
                                                'Only owner should be able to disable manager');
    await manageableContract.disableManager.sendTransaction(manager, { from: owner });
    await UtilsTestRoutines.checkContractThrows(manageableContract.disableManager.sendTransaction,
                                                [manager, { from: owner }],
                                                'Should not be possible to disable already disabled manager');


    // grantManagerPermission & revokeManagerPermission

    const isPermission01Granted = await manageableContract.isPermissionGranted.call(manager, 'permission_01');
    global.assert.equal(isPermission01Granted, false);

    await UtilsTestRoutines.checkContractThrows(manageableContract.grantManagerPermission.sendTransaction,
                                                [0x0, 'permission_01', { from: owner }],
                                                'grantManagerPermission should reject invalid manager address');
    await UtilsTestRoutines.checkContractThrows(manageableContract.grantManagerPermission.sendTransaction,
                                                [manager, '', { from: owner }],
                                                'grantManagerPermission should reject invalid permission name');
    await UtilsTestRoutines.checkContractThrows(manageableContract.grantManagerPermission.sendTransaction,
                                                [manager, 'permission_01', { from: manager }],
                                                'Only owner should be able to grant permissions');
    await manageableContract.grantManagerPermission.sendTransaction(manager, 'permission_01', { from: owner });
    await UtilsTestRoutines.checkContractThrows(manageableContract.grantManagerPermission.sendTransaction,
                                                [manager, 'permission_01', { from: owner }],
                                                'Should not be possible to grant permission that is already granted');

    await UtilsTestRoutines.checkContractThrows(manageableContract.revokeManagerPermission.sendTransaction,
                                                [0x0, 'permission_01', { from: owner }],
                                                'revokeManagerPermission should reject invalid manager address');
    await UtilsTestRoutines.checkContractThrows(manageableContract.revokeManagerPermission.sendTransaction,
                                                [manager, '', { from: owner }],
                                                'revokeManagerPermission should reject invalid permission name');
    await UtilsTestRoutines.checkContractThrows(manageableContract.revokeManagerPermission.sendTransaction,
                                                [manager, 'permission_01', { from: manager }],
                                                'Only owner should be able to revoke permissions');
    await manageableContract.revokeManagerPermission.sendTransaction(manager, 'permission_01', { from: owner });
    await UtilsTestRoutines.checkContractThrows(manageableContract.revokeManagerPermission.sendTransaction,
                                                [manager, 'permission_01', { from: owner }],
                                                'Should not be possible to revoke permission that is already revoked');
  });
});
