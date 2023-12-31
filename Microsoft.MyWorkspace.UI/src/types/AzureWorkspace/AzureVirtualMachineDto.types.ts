import { OSVersion } from '../enums/OSVersion';
import { PatchMode } from '../enums/PatchMode';
import { AzureDataDiskDto } from './AzureDataDiskDto.types';
import { AzureNicDto } from './AzureNicDto.types';
import { AzureStorageAccountType } from './enums/AzureStorageAccountType';
import { DomainRoles } from './enums/DomainRoles';
import { MachineImageType } from './enums/MachineImageType';
import { ResourceState } from './enums/ResourceState';
import { NatRuleDto } from './NatRuleDto.types';
import { AzureVirtualMachineSnapshotDto } from './AzureVirtualMachineSnapshotDto.types';

export interface AzureVirtualMachineDto {
  ID: string;
  Name: string;
  InternalName: string;
  Description: string;
  Created?: string;
  Deployed?: string;
  Updated?: string;
  LastStarted?: string;
  LastPasswordChange?: string;
  State: ResourceState;
  WorkspaceID: string;
  AdministratorName: string;
  AdministratorPassword: string;
  ComputerName: string;
  DomainRole: DomainRoles;
  DomainID: string;
  MemoryGB: number;
  ImageSourceID: string;
  PrimaryNicName: string;
  PrimaryNicID: string;
  Sku: string;
  StorageAccountType: AzureStorageAccountType;
  Nics: AzureNicDto[];
  OSDiskSizeInGB: number;
  DataDisks: AzureDataDiskDto[];
  RDPAddress: string;
  RDPPort?: number;
  SSHPort?: number;
  SubscriptionID: string;
  ResourceGroupName: string;
  Location: string;
  NatRules: NatRuleDto[];
  PatchMode: PatchMode;
  OSVersion: OSVersion;
  MachineImageType: MachineImageType;
  Snapshots: AzureVirtualMachineSnapshotDto[];
  IsNested: boolean;
}
