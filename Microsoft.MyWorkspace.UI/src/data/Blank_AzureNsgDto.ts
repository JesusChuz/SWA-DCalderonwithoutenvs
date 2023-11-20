import { AzureNsgDto } from '../types/AzureWorkspace/AzureNsgDto.types';
import { ResourceState } from '../types/AzureWorkspace/enums/ResourceState';

export const Blank_AzureNsgDto: AzureNsgDto = {
  Name: '',
  Description: '',
  InboundRules: [],
  OutboundRules: [],
  ID: '',
  InternalName: '',
  State: ResourceState.Off,
  WorkspaceID: '',
  SubscriptionID: '',
  ResourceGroupName: '',
  Location: '',
};
