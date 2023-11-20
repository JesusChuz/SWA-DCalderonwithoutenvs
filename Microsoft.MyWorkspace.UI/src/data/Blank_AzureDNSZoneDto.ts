import { AzureDNSZoneDto } from '../types/AzureWorkspace/AzureDNSZoneDto.types';
import { ResourceState } from '../types/AzureWorkspace/enums/ResourceState';

export const Blank_AzureDNSZoneDto: AzureDNSZoneDto = {
  Name: '',
  Description: '',
  WorkspaceID: '',
  DNSServerID: '',
  Path: '',
  ID: '',
  InternalName: '',
  State: ResourceState.Off,
  SubscriptionID: '',
  ResourceGroupName: '',
  Location: '',
  DnsARecords: [],
  DnsCNAMERecords: [],
  DnsMXRecords: [],
  DnsNSRecords: [],
  DnsSRVRecords: [],
  DnsTXTRecords: [],
};
