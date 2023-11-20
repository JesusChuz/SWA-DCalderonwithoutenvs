import { AzureVirtualNetworkDto } from '../../types/AzureWorkspace/AzureVirtualNetworkDto.types';
import { ResourceState } from '../../types/AzureWorkspace/enums/ResourceState';

export const AzureVirtualNetworkTestData: AzureVirtualNetworkDto = {
  ID: '',
  Name: '',
  InternalName: '',
  State: ResourceState.Running,
  WorkspaceID: '',
  Description: '',
  SubscriptionID: '',
  ResourceGroupName: '',
  Location: '',
  AddressSpaces: [],
  Subnets: {},
  SubnetProperties: {},
  IsRoutable: false,
};

export const getTestVirtualNetworkDto = (
  properties: Partial<AzureVirtualNetworkDto> = {}
): AzureVirtualNetworkDto => {
  return {
    ...AzureVirtualNetworkTestData,
    ...properties,
  };
};
