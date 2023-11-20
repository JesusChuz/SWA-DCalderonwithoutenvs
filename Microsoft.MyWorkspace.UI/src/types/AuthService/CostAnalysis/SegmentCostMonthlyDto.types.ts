import { SegmentCostDailyDto } from './SegmentCostDailyDto.types';

export interface SegmentCostMonthlyDto extends SegmentCostDailyDto {
  Month: string;
}
