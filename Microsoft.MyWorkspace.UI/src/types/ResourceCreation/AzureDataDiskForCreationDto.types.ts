import { AzureStorageType } from '../AzureWorkspace/enums/AzureStorageType';

export interface AzureDataDiskForCreationDto {
  Name: string;
  Description: string;
  SizeGB: number;
  Lun: number;
  StorageType: AzureStorageType;
}
