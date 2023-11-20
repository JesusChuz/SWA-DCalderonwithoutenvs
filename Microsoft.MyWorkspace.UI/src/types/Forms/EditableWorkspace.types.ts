import { AzureVirtualMachineForCreationDto } from '../ResourceCreation/AzureVirtualMachineForCreationDto.types';
import { AzureVirtualNetworkForCreationDto } from '../ResourceCreation/AzureVirtualNetworkForCreationDto.types';
import { AzureVirtualMachineDto } from '../AzureWorkspace/AzureVirtualMachineDto.types';
import { AzureVirtualNetworkDto } from '../AzureWorkspace/AzureVirtualNetworkDto.types';
import { AzureDNSZoneDto } from '../AzureWorkspace/AzureDNSZoneDto.types';
import { AzurePublicAddressDto } from '../AzureWorkspace/AzurePublicAddressDto.types';
import { AzureDomainDto } from '../AzureWorkspace/AzureDomainDto.types';

export interface EditableWorkspace {
  Name: string;
  Description: string;
  OwnerID: string;
  SharedOwnerIDs: string[];
  TemplateID?: string;
  VirtualMachines:
    | AzureVirtualMachineForCreationDto[]
    | AzureVirtualMachineDto[];
  VirtualNetworks:
    | AzureVirtualNetworkForCreationDto[]
    | AzureVirtualNetworkDto[];
  Location: string;
  SubscriptionID: string;
  SecurityLock: boolean;
  DNSZone?: AzureDNSZoneDto;
  SharedOwnerEmails?: string[];
  PublicAddresses?: AzurePublicAddressDto[];
  Domains: AzureDomainDto[];
  Geography: string;
  SharedWithSegment: boolean;
}
