import { SubnetForCreationDto } from './SubnetForCreationDto.types';

export interface AzureVirtualNetworkForCreationDto {
  Name: string;
  Description: string;
  SubnetProperties: Record<string, SubnetForCreationDto>;
}
