import { AzureDataDiskForCreationDto } from '../ResourceCreation/AzureDataDiskForCreationDto.types';
import { AzureDataDiskDto } from './AzureDataDiskDto.types';

export type DataDiskUnion = AzureDataDiskForCreationDto | AzureDataDiskDto;
