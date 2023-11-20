import { AzureUdrDto } from '../types/AzureWorkspace/AzureUdrDto.types';
import { ResourceState } from '../types/AzureWorkspace/enums/ResourceState';

export const Blank_AzureUdrDto: AzureUdrDto = {
  Name: '',
  Description: '',
  ID: '',
  InternalName: '',
  State: ResourceState.Off,
  WorkspaceID: '',
  SubscriptionID: '',
  ResourceGroupName: '',
  Location: '',
  DisableBgp: false,
  VirtualApplianceRoutes: {},
  Routes: {},
};
