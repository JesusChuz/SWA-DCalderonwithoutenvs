import { AzureStorageAccountType } from '../AzureWorkspace/enums/AzureStorageAccountType';
import { DomainRoles } from '../AzureWorkspace/enums/DomainRoles';
import { DataDiskTemplateDto } from './DataDiskTemplateDto.types';
import { NicTemplateDto } from './NicTemplateDto.types';
import { VirtualMachineBaseDto } from './VirtualMachineBaseDto.types';

export interface VirtualMachineTemplateDto extends VirtualMachineBaseDto {
  AdministratorName: string;
  AdministratorPassword: string;
  ComputerName: string;
  DomainRole: DomainRoles;
  DomainID: string;
  MemoryGB: number;
  PrimaryNicName: string;
  Sku: string;
  StorageAccountType: AzureStorageAccountType;
  Nics: NicTemplateDto[];
  OSDiskSizeInGB: number;
  DataDisks: DataDiskTemplateDto[];
  IsNested: boolean;
}
