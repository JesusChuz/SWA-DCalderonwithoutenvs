import { AzurePublicAddressDto } from '../../types/AzureWorkspace/AzurePublicAddressDto.types';
import { ResourceState } from '../../types/AzureWorkspace/enums/ResourceState';

export const AzurePublicAddressDtoTestData: AzurePublicAddressDto = {
  ID: 'publicAddressTestId',
  Name: 'Test Public Address',
  Description: 'Test Domain',
  PublicIPAddress: '1.1.1.1',
  PrivateIPAddress: '1.1.1.12',
  NetworkInterfaceInternalName: '',
  InternalName: '',
  State: ResourceState.Running,
  WorkspaceID: '',
  SubscriptionID: '',
  ResourceGroupName: '',
  Location: '',
};

export const getTestAzurePublicAddressDto = (
  properties: Partial<AzurePublicAddressDto> = {}
): AzurePublicAddressDto => {
  return {
    ...AzurePublicAddressDtoTestData,
    ...properties,
  };
};
