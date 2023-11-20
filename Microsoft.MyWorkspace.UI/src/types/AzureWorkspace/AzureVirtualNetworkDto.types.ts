import { ResourceState } from './enums/ResourceState';
import { Subnet } from './Subnet.types';

export interface AzureVirtualNetworkDto {
  ID: string;
  Name: string;
  InternalName: string;
  Description: string;
  Created?: string;
  Deployed?: string;
  Updated?: string;
  State: ResourceState;
  WorkspaceID: string;
  AddressSpaces: string[];
  Subnets: Record<string, string>;
  SubnetProperties: Record<string, Subnet>;
  SubscriptionID: string;
  ResourceGroupName: string;
  Location: string;
  IsRoutable: boolean;
}
