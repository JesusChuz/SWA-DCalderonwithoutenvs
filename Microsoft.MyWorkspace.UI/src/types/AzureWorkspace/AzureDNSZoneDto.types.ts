import { ResourceState } from './enums/ResourceState';
import {
  DNSRecordADto,
  DNSRecordCNAMEDto,
  DNSRecordMXDto,
  DNSRecordNSDto,
  DNSRecordSRVDto,
  DNSRecordTXTDto,
} from './DNSRecords';

export interface AzureDNSZoneDto {
  Name: string;
  Description: string;
  WorkspaceID: string;
  DNSServerID: string;
  Path: string;
  ID: string;
  InternalName: string;
  Created?: string;
  Deployed?: string;
  Updated?: string;
  State: ResourceState;
  SubscriptionID: string;
  ResourceGroupName: string;
  Location: string;
  DnsARecords: DNSRecordADto[];
  DnsCNAMERecords: DNSRecordCNAMEDto[];
  DnsMXRecords: DNSRecordMXDto[];
  DnsNSRecords: DNSRecordNSDto[];
  DnsSRVRecords: DNSRecordSRVDto[];
  DnsTXTRecords: DNSRecordTXTDto[];
}
