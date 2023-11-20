import { ResourceState } from '../../types/AzureWorkspace/enums/ResourceState';
import { AzureDataDiskDto } from '../../types/AzureWorkspace/AzureDataDiskDto.types';
import { AzureStorageType } from '../../types/AzureWorkspace/enums/AzureStorageType';

export const AzureDataDiskDtoTestData: AzureDataDiskDto = {
  Name: '',
  Description: '',
  WorkspaceID: '',
  ID: '',
  InternalName: '',
  State: ResourceState.Running,
  SubscriptionID: '',
  ResourceGroupName: '',
  Location: '',
  VirtualMachineName: '',
  VirtualMachineID: '',
  SizeGB: 1,
  Lun: 0,
  StorageType: AzureStorageType.PremiumSSD,
};

export const getTestDataDiskDto = (
  properties: Partial<AzureDataDiskDto> = {}
): AzureDataDiskDto => {
  return {
    ...AzureDataDiskDtoTestData,
    ...properties,
  };
};
