import { DNSRecordDto } from './DNSRecordDto.types';

export interface DNSRecordMXDto extends DNSRecordDto {
  Priority: number;
  Server: string;
}
