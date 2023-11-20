import { useSelector } from 'react-redux';
import { getCostDateRange, getCostGranularity } from 'src/store/selectors';
import { ICartesianChartProps } from '@fluentui/react-charting';
import * as d3 from 'd3-format';
import { SegmentCostDailyDto } from 'src/types/AuthService/CostAnalysis/SegmentCostDailyDto.types';
import { CostDateRange } from 'src/types/AuthService/CostAnalysis/CostDateRange.types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export const maxDailyDisplayInMonths = 3;

export const commonChartProps: Partial<ICartesianChartProps> = {
  yAxisTickFormat: d3.format('$.2s'),
  hideLegend: true,
};

export const useDisplayCostAnalysisDayOrMonth = (): 'day' | 'month' => {
  const granularity = useSelector(getCostGranularity);
  const dateRangeInMonths = useSelector(getCostDateRange);
  if (granularity !== 'accumulated') {
    return granularity;
  }

  if (dateRangeInMonths >= 6) {
    return 'month';
  }
  return 'day';
};

export function accumulatedCosts<T extends SegmentCostDailyDto>(
  costs: T[]
): T[] {
  let accumulatedCost = 0;
  return costs.map((cost) => {
    accumulatedCost += cost.Cost;
    return {
      ...cost,
      Cost: accumulatedCost,
    };
  });
}

export const getFormattedCost = (cost: number, currency = 'USD'): string => {
  let maximumFractionDigits = 2;
  if (cost >= 1000) {
    maximumFractionDigits = 0;
  }
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: maximumFractionDigits,
  });
  return formatter.format(cost);
};

export const getDateRange = (
  dateRangeInMonths: CostDateRange
): { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs } => {
  const endDate = dayjs().utc().endOf('day');
  const startDate = endDate
    .clone()
    .startOf('month')
    .subtract(dateRangeInMonths - 1, 'month');
  return { endDate: endDate, startDate: startDate };
};

export const displayDateRange = ({
  startDate,
  endDate,
}: {
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
}): string => {
  if (
    startDate.month() === endDate.month() &&
    startDate.year() === endDate.year()
  ) {
    return `${startDate.format('MMM YYYY')}`;
  }
  return `${startDate.format('MMM')} to ${endDate.format('MMM YYYY')}`;
};

export const getNumberOfDaysInRange = (
  dateRangeInMonths: CostDateRange
): number => {
  const { endDate, startDate } = getDateRange(dateRangeInMonths);
  return endDate.diff(startDate, 'day');
};
