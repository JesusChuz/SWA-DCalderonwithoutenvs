import { AzureDiskSnapshotDto } from './AzureDiskSnapshotDto.types';

export interface AzureVirtualMachineSnapshotDto {
  Name: string;
  Description: string;
  ID: string;
  Created: string;
  WorkspaceID: string;
  VirtualMachineID: string;
  OSDiskSnapshot: AzureDiskSnapshotDto;
  DiskSnapshots: AzureDiskSnapshotDto[];
}
