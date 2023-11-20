import { AzureOSDiskDto } from '../types/AzureWorkspace/AzureOSDiskDto.types';
import { AzureStorageType } from '../types/AzureWorkspace/enums/AzureStorageType';

export const Default_AzureOSDiskDto: AzureOSDiskDto = {
  Name: 'OS Disk',
  Description: '',
  SizeGB: 128,
  StorageType: AzureStorageType.PremiumSSD,
};
