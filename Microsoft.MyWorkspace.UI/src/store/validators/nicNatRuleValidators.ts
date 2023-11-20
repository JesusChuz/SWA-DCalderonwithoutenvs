import { AzureVirtualMachineDto } from '../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { NatRuleDto } from '../../types/AzureWorkspace/NatRuleDto.types';

export const checkNicNatRuleAssociation = (
  machine: AzureVirtualMachineDto,
  nicIndex: number
): string => {
  const nicNatRules = [] as NatRuleDto[];
  for (let i = 0; i < machine.NatRules.length; i++) {
    if (
      machine.NatRules[i].InternalAddress ===
      machine.Nics[nicIndex].PrivateIPAddress
    ) {
      nicNatRules.push(machine.NatRules[i] as NatRuleDto);
    }
  }
  if (nicNatRules.length > 0) {
    return `${machine.Nics[nicIndex].Name} has ${nicNatRules.length} NAT ${
      nicNatRules.length === 1 ? 'rule' : 'rules'
    } associated with it. Please delete those NAT rules first.`;
  } else return null;
};
