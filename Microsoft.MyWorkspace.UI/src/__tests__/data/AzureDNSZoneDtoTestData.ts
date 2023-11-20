import { ResourceState } from '../../types/AzureWorkspace/enums/ResourceState';
import { AzureDNSZoneDto } from '../../types/AzureWorkspace/AzureDNSZoneDto.types';
import { DNSRecordCombinedDtoTestData } from './DNSRecordCombinedDtoTestData';
import {
  DNSRecordADto,
  DNSRecordCNAMEDto,
  DNSRecordMXDto,
  DNSRecordNSDto,
  DNSRecordSRVDto,
  DNSRecordTXTDto,
} from '../../types/AzureWorkspace/DNSRecords';

export const AzureDNSZoneDtoTestData: AzureDNSZoneDto = {
  Name: 'TestName',
  Description: 'TestDesc',
  WorkspaceID: 'WorkspaceID',
  DNSServerID: 'ServerID',
  Path: 'Path',
  ID: 'ID',
  InternalName: 'InternalName',
  State: ResourceState.Running,
  SubscriptionID: 'SubID',
  ResourceGroupName: 'RG',
  Location: 'Location',
  DnsARecords: [{ ...DNSRecordCombinedDtoTestData } as DNSRecordADto],
  DnsCNAMERecords: [{ ...DNSRecordCombinedDtoTestData } as DNSRecordCNAMEDto],
  DnsMXRecords: [{ ...DNSRecordCombinedDtoTestData } as DNSRecordMXDto],
  DnsNSRecords: [{ ...DNSRecordCombinedDtoTestData } as DNSRecordNSDto],
  DnsSRVRecords: [{ ...DNSRecordCombinedDtoTestData } as DNSRecordSRVDto],
  DnsTXTRecords: [{ ...DNSRecordCombinedDtoTestData } as DNSRecordTXTDto],
};

export const getTestDNSZoneDto = (
  properties: Partial<AzureDNSZoneDto> = {}
): AzureDNSZoneDto => {
  return {
    ...AzureDNSZoneDtoTestData,
    ...properties,
  };
};
