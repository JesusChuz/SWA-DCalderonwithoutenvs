import { NetworkProtocols } from '../../types/AzureWorkspace/enums/NetworkProtocols.types';
import { NatRuleDto } from '../../types/AzureWorkspace/NatRuleDto.types';

export const NatRuleDtoTestData: NatRuleDto = {
  ID: 'testNatRuleId',
  Name: '',
  Description: 'test nat rule',
  WorkspaceID: '',
  VirtualMachineID: '',
  InternalPort: 443,
  ExternalPort: 443,
  PortCount: 1,
  InternalAddress: '1.1.1.1',
  ExternalAddress: '1.1.1.2',
  Protocol: NetworkProtocols.TCP,
};

export const getTestNatRuleDto = (
  properties: Partial<NatRuleDto> = {}
): NatRuleDto => {
  return {
    ...NatRuleDtoTestData,
    ...properties,
  };
};
