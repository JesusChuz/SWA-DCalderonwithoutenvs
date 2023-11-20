import { DNSRecordDto } from './DNSRecordDto.types';

export interface DNSRecordNSDto extends DNSRecordDto {
  NameServer: string;
}
