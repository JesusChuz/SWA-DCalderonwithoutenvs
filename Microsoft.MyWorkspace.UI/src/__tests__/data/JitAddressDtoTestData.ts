import { SyncStatus } from '../../types/enums/SyncStatus';
import { JitAddressDto } from '../../types/FirewallManager/JitAddressDto';

export const JitAddressDtoTestData: JitAddressDto = {
  ID: '',
  RegionID: '',
  WorkspaceID: '',
  UserID: '',
  Address: '',
  Location: '',
  Hours: 1,
  Created: '',
  Status: SyncStatus.Active,
};

export const getTestJitAddressDto = (
  properties: Partial<JitAddressDto> = {}
): JitAddressDto => {
  return {
    ...JitAddressDtoTestData,
    ...properties,
  };
};
