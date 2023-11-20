import { SubnetForCreationDto } from '../ResourceCreation/SubnetForCreationDto.types';

export interface VirtualNetworkTemplateDto {
  Name: string;
  Description: string;
  SubnetProperties: Record<string, SubnetForCreationDto>;
}
