import { AzureStorageType } from './enums/AzureStorageType';
import { ResourceState } from './enums/ResourceState';

export interface AzureDataDiskDto {
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
  VirtualMachineName: string;
  SizeGB: number;
  Lun: number;
  StorageType: AzureStorageType;
  SubscriptionID: string;
  ResourceGroupName: string;
  Location: string;
}
