import { NetworkProtocols } from '../../types/AzureWorkspace/enums/NetworkProtocols.types';
import { NatRuleJitEntryDto } from '../../types/AzureWorkspace/NatRuleJitEntryDto.types';
import { SyncStatus } from '../../types/enums/SyncStatus';

export const NatRuleJitEntryDtoTestData: NatRuleJitEntryDto = {
  ID: '',
  Created: '',
  FirewallID: '',
  WorkspaceID: '',
  UserID: '',
  InternalPort: 0,
  ExternalPort: 0,
  InternalAddress: '',
  ExternalAddress: '',
  Location: '',
  Protocol: NetworkProtocols.TCP,
  Status: SyncStatus.Active,
};

export const getTestNatRuleJitEntryDto = (
  properties: Partial<NatRuleJitEntryDto> = {}
): NatRuleJitEntryDto => {
  return {
    ...NatRuleJitEntryDtoTestData,
    ...properties,
  };
};
