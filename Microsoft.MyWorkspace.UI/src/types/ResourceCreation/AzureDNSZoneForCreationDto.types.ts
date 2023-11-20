import {
  DNSRecordADto,
  DNSRecordCNAMEDto,
  DNSRecordMXDto,
  DNSRecordNSDto,
  DNSRecordSRVDto,
  DNSRecordTXTDto,
} from '../AzureWorkspace/DNSRecords';

export interface AzureDNSZoneForCreationDto {
  Name: string;
  Description: string;
  WorkspaceID: string;
  DnsARecords: DNSRecordADto[];
  DnsCNAMERecords: DNSRecordCNAMEDto[];
  DnsMXRecords: DNSRecordMXDto[];
  DnsNSRecords: DNSRecordNSDto[];
  DnsSRVRecords: DNSRecordSRVDto[];
  DnsTXTRecords: DNSRecordTXTDto[];
}
