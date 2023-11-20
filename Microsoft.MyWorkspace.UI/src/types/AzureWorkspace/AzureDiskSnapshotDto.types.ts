import { AzureDataDiskDto } from './AzureDataDiskDto.types';
import { ResourceState } from './enums/ResourceState';

export interface AzureDiskSnapshotDto {
  Name: string;
  Description: string;
  DiskID: string;
  ID: string;
  WorkspaceID: string;
  InternalName: string;
  Created?: string;
  Deployed?: string;
  Updated?: string;
  State: ResourceState;
  SubscriptionID: string;
  ResourceGroupName: string;
  Location: string;
  DataDisk: AzureDataDiskDto;
}
