import { checkNicNatRuleAssociation } from '../../../store/validators/nicNatRuleValidators';
import { getTestNatRuleDto } from '../../data/NatRuleDtoTestData';
import { getTestNicDto } from '../../data/AzureNicDtoTestData';
import { getTestVirtualMachineDto } from '../../data/AzureVirtualMachineTestData';

describe('NIC Nat Rule Validator Tests', () => {
  test("checkNicNatRuleAssociation returns null when NAT rule internal addresses match a NIC's' private address", () => {
    const natRules = [
      getTestNatRuleDto({ InternalAddress: '1.2.3.5' }),
      getTestNatRuleDto({ InternalAddress: '1.2.3.6' }),
    ];
    const nics = [getTestNicDto({ PrivateIPAddress: '1.2.3.4' })];
    const machine = getTestVirtualMachineDto({
      Nics: nics,
      NatRules: natRules,
    });
    const error = checkNicNatRuleAssociation(machine, 0);
    expect(error).toBeNull();
  });

  test("checkNicNatRuleAssociation returns an error when NAT rule internal addresses match a NIC's private address", () => {
    const natRules = [
      getTestNatRuleDto({ InternalAddress: '1.2.3.5' }),
      getTestNatRuleDto({ InternalAddress: '1.2.3.4' }),
    ];
    const nics = [getTestNicDto({ PrivateIPAddress: '1.2.3.4' })];
    const machine = getTestVirtualMachineDto({
      Nics: nics,
      NatRules: natRules,
    });
    const error = checkNicNatRuleAssociation(machine, 0);
    expect(error).not.toBeFalsy();
  });
});
