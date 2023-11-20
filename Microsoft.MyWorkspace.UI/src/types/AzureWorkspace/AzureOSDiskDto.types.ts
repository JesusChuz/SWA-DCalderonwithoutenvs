import { AzureStorageType } from './enums/AzureStorageType';

export interface AzureOSDiskDto {
  Name: string;
  Description: string;
  SizeGB: number;
  StorageType: AzureStorageType;
}
