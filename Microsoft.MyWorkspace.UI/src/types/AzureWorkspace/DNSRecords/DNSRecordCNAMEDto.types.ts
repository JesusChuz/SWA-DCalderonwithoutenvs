import { DNSRecordDto } from './DNSRecordDto.types';

export interface DNSRecordCNAMEDto extends DNSRecordDto {
  CanonicalName: string;
}
