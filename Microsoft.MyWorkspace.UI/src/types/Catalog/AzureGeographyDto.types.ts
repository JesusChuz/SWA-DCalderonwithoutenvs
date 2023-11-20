import { AzureRegionDto } from './AzureRegionDto.types';

export interface AzureGeographyDto {
  ID: string;
  Name: string;
  Regions: AzureRegionDto[];
  EligibleSubscriptions: string[];
}
