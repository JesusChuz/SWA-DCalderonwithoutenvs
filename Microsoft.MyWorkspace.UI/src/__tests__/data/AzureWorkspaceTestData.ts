import { AzureWorkspaceDto } from 'src/types/AzureWorkspace/AzureWorkspaceDto.types';
import { ResourceState } from 'src/types/AzureWorkspace/enums/ResourceState';
import { getTestDNSZoneDto } from './AzureDNSZoneDtoTestData';

export const AzureWorkspaceDtoTestData: AzureWorkspaceDto = {
  ID: '',
  Name: '',
  Description: '',
  VirtualMachines: [],
  VirtualNetworks: [],
  ResourceGroupName: '',
  Location: '',
  SubscriptionID: '',
  State: ResourceState.Off,
  OwnerID: '',
  OwnerEmail: '',
  InternalName: '',
  SharedOwnerEmails: [],
  SharedOwnerIDs: [],
  Domains: [],
  PublicAddresses: [],
  DNSZone: getTestDNSZoneDto(),
  RegionID: '',
  SecurityLock: false,
  TimeZone: '',
  AutoStartTime: '',
  AutoStopTime: '',
  DaysOfWeek: '',
  Geography: '',
  PrivateMode: false,
  SharedWithSegment: false,
  HubNetworkInfo: null,
  Nsg: null,
  Udr: null,
};

export const getTestWorkspace = (
  properties: Partial<AzureWorkspaceDto> = {}
): AzureWorkspaceDto => {
  return {
    ...AzureWorkspaceDtoTestData,
    ...properties,
  };
};
