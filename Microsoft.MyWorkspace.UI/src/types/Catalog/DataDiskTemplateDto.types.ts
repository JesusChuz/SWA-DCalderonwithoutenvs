import { AzureStorageType } from '../AzureWorkspace/enums/AzureStorageType';

export interface DataDiskTemplateDto {
  Name: string;
  Description: string;
  SizeGB: number;
  Lun: number;
  StorageType: AzureStorageType;
  FromImage: boolean;
}
