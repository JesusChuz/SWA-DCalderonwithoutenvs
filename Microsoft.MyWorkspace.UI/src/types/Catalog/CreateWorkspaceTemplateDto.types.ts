import { VirtualNetworkTemplateDto } from './VirtualNetworkTemplateDto.types';
import { VirtualMachineTemplateDto } from './VirtualMachineTemplateDto.types';
import { AzureDomainDto } from '../AzureWorkspace/AzureDomainDto.types';

export interface CreateWorkspaceTemplateDto {
  Name: string;
  Description: string;
  SpecialInstructions: string;
  SourceWorkspaceId: string;
  VirtualMachines: VirtualMachineTemplateDto[];
  VirtualNetworks: VirtualNetworkTemplateDto[];
  Domains: AzureDomainDto[];
}
