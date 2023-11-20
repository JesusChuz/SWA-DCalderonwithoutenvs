import { ResourceState } from './enums/ResourceState';
import { IPAllocationMethod } from './enums/IPAllocationMethod';

export interface AzureNicDto {
  ID: string;
  Name: string;
  InternalName: string;
  Description: string;
  Created?: string;
  Deployed?: string;
  Updated?: string;
  State: ResourceState;
  WorkspaceID: string;
  VirtualMachineID: string;
  VirtualNetworkName: string;
  VirtualNetworkInternalName: string;
  SubnetName: string;
  PrivateIPAddress: string;
  PrivateIPAllocationMethod: IPAllocationMethod;
  SubscriptionID: string;
  ResourceGroupName: string;
  Location: string;
}
