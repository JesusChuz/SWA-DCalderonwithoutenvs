import { AzureNicForCreationDto } from '../../types/ResourceCreation/AzureNicForCreationDto.types';
import { ResourceState } from '../../types/AzureWorkspace/enums/ResourceState';
import { AzureNicDto } from '../../types/AzureWorkspace/AzureNicDto.types';
import { IPAllocationMethod } from '../../types/AzureWorkspace/enums/IPAllocationMethod';

export const AzureNicDtoTestData: AzureNicDto = {
  ID: '',
  Name: '',
  InternalName: '',
  State: ResourceState.Running,
  WorkspaceID: '',
  Description: '',
  SubscriptionID: '',
  ResourceGroupName: '',
  Location: '',
  VirtualMachineID: '',
  VirtualNetworkInternalName: '',
  VirtualNetworkName: '',
  SubnetName: '',
  PrivateIPAddress: '',
  PrivateIPAllocationMethod: IPAllocationMethod.Dynamic,
};

export const AzureNicForCreationDtoTestData: AzureNicForCreationDto = {
  Name: '',
  Description: '',
  VirtualNetworkName: '',
  SubnetName: '',
};

export const getTestNicDto = (
  properties: Partial<AzureNicDto> = {}
): AzureNicDto => {
  return {
    ...AzureNicDtoTestData,
    ...properties,
  };
};

export const getTestNicForCreationDto = (
  properties: Partial<AzureNicForCreationDto> = {}
): AzureNicForCreationDto => {
  return {
    ...AzureNicDtoTestData,
    ...properties,
  };
};
