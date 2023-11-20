import { ResourceState } from './enums/ResourceState';

export interface AzurePublicAddressDto {
  Name: string;
  Description: string;
  PublicIPAddress: string;
  PrivateIPAddress: string;
  NetworkInterfaceInternalName: string;
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
