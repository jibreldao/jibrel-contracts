import * as ManageableJSAPI from '../../../contracts/lifecycle/Manageable/Manageable.jsapi';
import * as PausableInterfaceJSAPI from '../../../contracts/lifecycle/Pausable/PausableInterface.jsapi';
import * as PausableJSAPI from '../../../contracts/lifecycle/Pausable/Pausable.jsapi';
import * as JNTPayableServiceInterfaceJSAPI from '../../../contracts/crydr/jnt/JNTPayableService/JNTPayableServiceInterface.jsapi';
import * as JNTPayableServiceJSAPI from '../../../contracts/crydr/jnt/JNTPayableService/JNTPayableService.jsapi';

import * as TxConfig from '../../../jsroutines/jsconfig/TxConfig';
import * as CheckExceptions from '../../../jsroutines/util/CheckExceptions';

const JNTPayableServiceMock = global.artifacts.require('JNTPayableServiceMock.sol');
const JNTPaymentGatewayStub = global.artifacts.require('JNTPaymentGatewayStub.sol');


global.contract('JNTPayableService', (accounts) => {
  let jntPayableServiceInstance;
  let JNTPaymentGatewayStubInstance01;
  let JNTPaymentGatewayStubInstance02;

  TxConfig.setEthAccounts(accounts);
  const ethAccounts = TxConfig.getEthAccounts();


  global.beforeEach(async () => {
    jntPayableServiceInstance = await JNTPayableServiceMock.new({ from: ethAccounts.owner });
    JNTPaymentGatewayStubInstance01 = await JNTPaymentGatewayStub.new({ from: ethAccounts.owner }); // we need to mock it
    JNTPaymentGatewayStubInstance02 = await JNTPaymentGatewayStub.new({ from: ethAccounts.owner }); // we need to mock it

    await PausableJSAPI.grantManagerPermissions(jntPayableServiceInstance.address, ethAccounts.owner, ethAccounts.managerPause);
    await JNTPayableServiceJSAPI.grantManagerPermissions(jntPayableServiceInstance.address, ethAccounts.owner, ethAccounts.managerJNT);
    await ManageableJSAPI.enableManager(jntPayableServiceInstance.address, ethAccounts.owner, ethAccounts.managerPause);
    await ManageableJSAPI.enableManager(jntPayableServiceInstance.address, ethAccounts.owner, ethAccounts.managerJNT);

    await JNTPayableServiceInterfaceJSAPI.setJntController(jntPayableServiceInstance.address, ethAccounts.managerJNT,
                                                           JNTPaymentGatewayStubInstance01.address);
    await JNTPayableServiceInterfaceJSAPI.setJntBeneficiary(jntPayableServiceInstance.address, ethAccounts.managerJNT, ethAccounts.jntBeneficiary);

    await PausableInterfaceJSAPI.unpauseContract(jntPayableServiceInstance.address, ethAccounts.managerPause);
  });

  global.it('should test setJntController method', async () => {
    await PausableInterfaceJSAPI.pauseContract(jntPayableServiceInstance.address, ethAccounts.managerPause);

    let isThrows = await CheckExceptions.isContractThrows(JNTPayableServiceInterfaceJSAPI.setJntController,
                                                          [jntPayableServiceInstance.address, ethAccounts.testInvestor1,
                                                           JNTPaymentGatewayStubInstance02.address]);
    global.assert.strictEqual(isThrows, true, 'Only manager should be able to set JntController');
    isThrows = await CheckExceptions.isContractThrows(JNTPayableServiceInterfaceJSAPI.setJntController,
                                                      [jntPayableServiceInstance.address, ethAccounts.managerJNT,
                                                       ethAccounts.testInvestor1]);
    global.assert.strictEqual(isThrows, true, 'Should be a valid address of JntController');
    isThrows = await CheckExceptions.isContractThrows(JNTPayableServiceInterfaceJSAPI.setJntController,
                                                      [jntPayableServiceInstance.address, ethAccounts.managerJNT,
                                                       0x0]);
    global.assert.strictEqual(isThrows, true, 'Should be a valid address of JntController');
    isThrows = await CheckExceptions.isContractThrows(JNTPayableServiceInterfaceJSAPI.setJntController,
                                                      [jntPayableServiceInstance.address, ethAccounts.managerJNT,
                                                       JNTPaymentGatewayStubInstance01.address]);
    global.assert.strictEqual(isThrows, true, 'Not possible to set the same address');

    await JNTPayableServiceInterfaceJSAPI.setJntController(jntPayableServiceInstance.address, ethAccounts.managerJNT,
                                                           JNTPaymentGatewayStubInstance02.address);

    await PausableInterfaceJSAPI.unpauseContract(jntPayableServiceInstance.address, ethAccounts.managerPause);

    isThrows = await CheckExceptions.isContractThrows(JNTPayableServiceInterfaceJSAPI.setJntController,
                                                      [jntPayableServiceInstance.address, ethAccounts.managerJNT,
                                                       JNTPaymentGatewayStubInstance01.address]);
    global.assert.strictEqual(isThrows, true, 'Not possible to configure unpaused contract');
  });

  global.it('should test setJntBeneficiary method', async () => {
    let isThrows = await CheckExceptions.isContractThrows(JNTPayableServiceInterfaceJSAPI.setJntBeneficiary,
                                                          [jntPayableServiceInstance.address, ethAccounts.managerJNT,
                                                           ethAccounts.jntBeneficiary]);
    global.assert.strictEqual(isThrows, true, 'Not possible to configure unpaused contract');

    await PausableInterfaceJSAPI.pauseContract(jntPayableServiceInstance.address, ethAccounts.managerPause);

    isThrows = await CheckExceptions.isContractThrows(JNTPayableServiceInterfaceJSAPI.setJntBeneficiary,
                                                      [jntPayableServiceInstance.address, ethAccounts.testInvestor1,
                                                       ethAccounts.testInvestor2]);
    global.assert.strictEqual(isThrows, true, 'Only manager should be able to set JntBeneficiary');
    isThrows = await CheckExceptions.isContractThrows(JNTPayableServiceInterfaceJSAPI.setJntBeneficiary,
                                                      [jntPayableServiceInstance.address, ethAccounts.managerJNT, 0x0]);
    global.assert.strictEqual(isThrows, true, 'Should be a valid address of JntBeneficiary');
    isThrows = await CheckExceptions.isContractThrows(JNTPayableServiceInterfaceJSAPI.setJntBeneficiary,
                                                      [jntPayableServiceInstance.address, ethAccounts.managerJNT,
                                                       ethAccounts.jntBeneficiary]);
    global.assert.strictEqual(isThrows, true, 'Not possible to set the same address');

    await JNTPayableServiceInterfaceJSAPI.setJntBeneficiary(jntPayableServiceInstance.address, ethAccounts.managerJNT,
                                                            ethAccounts.testInvestor1);
  });
});
