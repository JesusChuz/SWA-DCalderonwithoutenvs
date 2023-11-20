/* eslint-disable @typescript-eslint/no-empty-interface */
import { AzureStorageAccountType } from '../AzureWorkspace/enums/AzureStorageAccountType';
import { DomainRoles } from '../AzureWorkspace/enums/DomainRoles';
import { MachineImageType } from '../AzureWorkspace/enums/MachineImageType';
import { OSVersion } from '../enums/OSVersion';
import { PatchMode } from '../enums/PatchMode';
import { AzureDataDiskForCreationDto } from './AzureDataDiskForCreationDto.types';
import { AzureNicForCreationDto } from './AzureNicForCreationDto.types';

export interface AzureVirtualMachineForCreationDto {
  Name: string;
  Description: string;
  AdministratorName: string;
  AdministratorPassword: string;
  ComputerName: string;
  DomainRole: DomainRoles;
  DomainID?: string;
  MemoryGB: number;
  ImageSourceID: string;
  PrimaryNicName: string;
  Sku: string;
  StorageAccountType: AzureStorageAccountType;
  Nics: AzureNicForCreationDto[];
  OSDiskSizeInGB: number;
  DataDisks: AzureDataDiskForCreationDto[];
  PatchMode: PatchMode;
  OSVersion: OSVersion;
  MachineImageType: MachineImageType;
  IsNested: boolean;
}
