import { AzureStorageType } from '../../types/AzureWorkspace/enums/AzureStorageType';
import { DataDiskTemplateDto } from 'src/types/Catalog/DataDiskTemplateDto.types';

export const DataDiskTemplateDtoTestData: DataDiskTemplateDto = {
  Name: '',
  Description: '',
  SizeGB: 1,
  Lun: 0,
  StorageType: AzureStorageType.PremiumSSD,
  FromImage: false,
};

export const getTestDataDiskTemplateDto = (
  properties: Partial<DataDiskTemplateDto> = {}
): DataDiskTemplateDto => {
  return {
    ...DataDiskTemplateDtoTestData,
    ...properties,
  };
};
