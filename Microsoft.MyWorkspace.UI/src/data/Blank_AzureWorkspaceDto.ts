import { AzureWorkspaceDto } from '../types/AzureWorkspace/AzureWorkspaceDto.types';
import { ResourceState } from '../types/AzureWorkspace/enums/ResourceState';
import { Blank_AzureDNSZoneDto } from './Blank_AzureDNSZoneDto';
import { Blank_AzureNsgDto } from './Blank_AzureNsgDto';
import { Blank_AzureUdrDto } from './Blank_AzureUdrDto';
import { Blank_HubNetworkInfoDto } from './Blank_HubNetworkInfoDto';

export const Blank_AzureWorkspaceDto: AzureWorkspaceDto = {
  ID: '',
  Name: '',
  InternalName: '',
  Description: '',
  State: ResourceState.Off,
  OwnerID: '',
  SharedOwnerIDs: [],
  OwnerEmail: '',
  SharedOwnerEmails: [],
  VirtualMachines: [],
  VirtualNetworks: [],
  Domains: [],
  PublicAddresses: [],
  DNSZone: Blank_AzureDNSZoneDto,
  Nsg: Blank_AzureNsgDto,
  Udr: Blank_AzureUdrDto,
  HubNetworkInfo: Blank_HubNetworkInfoDto,
  SubscriptionID: '',
  ResourceGroupName: '',
  Location: '',
  RegionID: '',
  SecurityLock: true,
  AutoStartTime: '',
  AutoStopTime: '',
  TimeZone: '',
  DaysOfWeek: '',
  Geography: '',
  PrivateMode: false,
  SharedWithSegment: false,
};
