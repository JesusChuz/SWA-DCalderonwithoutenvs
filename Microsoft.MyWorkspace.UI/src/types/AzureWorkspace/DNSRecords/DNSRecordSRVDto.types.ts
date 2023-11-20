import { DNSRecordDto } from './DNSRecordDto.types';

export interface DNSRecordSRVDto extends DNSRecordDto {
  Priority: number;
  Weight: number;
  Port: number;
  DomainName: string;
}
