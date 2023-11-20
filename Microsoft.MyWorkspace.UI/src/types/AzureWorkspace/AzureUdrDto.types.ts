import { ResourceState } from './enums/ResourceState';

export interface AzureUdrDto {
  Name: string;
  Description: string;
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
  DisableBgp: boolean;
  VirtualApplianceRoutes: Record<string, string>;
  Routes: Record<string, string>;
}
