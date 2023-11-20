import { AzureVirtualMachineForCreationDto } from './AzureVirtualMachineForCreationDto.types';
import { AzureVirtualNetworkForCreationDto } from './AzureVirtualNetworkForCreationDto.types';
import { AzureDomainDto } from '../AzureWorkspace/AzureDomainDto.types';

export interface AzureWorkspaceForCreationDto {
  Name: string;
  Description: string;
  OwnerID: string;
  SharedOwnerIDs: string[];
  TemplateID?: string;
  VirtualMachines: AzureVirtualMachineForCreationDto[];
  VirtualNetworks: AzureVirtualNetworkForCreationDto[];
  Domains: AzureDomainDto[];
  Location: string;
  SubscriptionID: string;
  Geography: string;
}
