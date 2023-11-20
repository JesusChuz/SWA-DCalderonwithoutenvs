import { DNSRecordDto } from './DNSRecordDto.types';

export interface DNSRecordTXTDto extends DNSRecordDto {
  TxtValues: string[];
}
