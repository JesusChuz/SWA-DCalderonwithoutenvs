import { AxiosError } from 'axios';

export interface SegmentUpdatePayload {
  percent: number;
  segmentId: string;
  error?: AxiosError;
}
