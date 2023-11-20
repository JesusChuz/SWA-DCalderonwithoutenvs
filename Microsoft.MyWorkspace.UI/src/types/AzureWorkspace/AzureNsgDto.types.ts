import { AzureNsgRuleDto } from './AzureNsgRuleDto.types';
import { ResourceState } from './enums/ResourceState';

export interface AzureNsgDto {
  Name: string;
  Description: string;
  InboundRules: AzureNsgRuleDto[];
  OutboundRules: AzureNsgRuleDto[];
  ID: string;
  InternalName: string;
  Created?: string;
  Deployed?: string;
  Updated?: string;
  State: ResourceState;
  WorkspaceID: string;
  SubscriptionID: string;
  ResourceGroupName: string;
  Location: string;
}
