import * as React from 'react';
import { AreaChart, IChartProps, LineChart } from '@fluentui/react-charting';
import { SegmentCostDailyDto } from 'src/types/AuthService/CostAnalysis/SegmentCostDailyDto.types';
import { useSelector } from 'react-redux';
import { getSelectedAdminSegment } from 'src/store/selectors';
import dayjs from 'dayjs';
import {
  accumulatedCosts,
  commonChartProps,
  getFormattedCost,
} from '../CostAnalysis.utils';
import { useTheme } from '@fluentui/react';
import { CostAnalysisNoData } from '../CostAnalysisNoData';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

interface IProps {
  dailyCosts: SegmentCostDailyDto[];
  width: number;
  accumulated?: boolean;
}

export const CostAnalysisDailyChart = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const currentSegment = useSelector(getSelectedAdminSegment);
  const dailyData: IChartProps = React.useMemo(
    () =>
      ({
        chartTitle: `${
          props.accumulated ? 'Accumulated' : 'Daily'
        } Segment Cost`,
        lineChartData: [
          {
            legend: currentSegment.Name,
            data: (props.accumulated
              ? accumulatedCosts(props.dailyCosts)
              : props.dailyCosts
            ).map((cost) => ({
              x: new Date(cost.Timestamp),
              y: parseFloat(cost.Cost.toFixed(2)),
              xAxisCalloutData: dayjs(cost.Timestamp).utc().format('M/D/YYYY'),
              yAxisCalloutData: getFormattedCost(cost.Cost),
            })),
            color: theme.palette.blue,
          },
        ],
      } as IChartProps),
    [props.dailyCosts, props.accumulated]
  );

  const getTickValues = (): Date[] => {
    const costCount = props.dailyCosts.length;
    if (costCount === 0) {
      return [];
    }
    if (costCount === 1) {
      return [new Date(props.dailyCosts[0].Timestamp)];
    }

    const firstDay = dayjs(props.dailyCosts[0].Timestamp).utc();
    const lastDay = dayjs(props.dailyCosts[costCount - 1].Timestamp).utc();
    const daysDifference = lastDay.diff(firstDay, 'day');

    if (daysDifference <= 6) {
      return props.dailyCosts.map((cost) => new Date(cost.Timestamp));
    }

    const steps = Math.floor((daysDifference - 1) / 5);

    const tickValues: Date[] = [];
    let currentDay = firstDay.clone();

    while (currentDay.isBefore(lastDay)) {
      tickValues.push(new Date(currentDay.toDate()));
      currentDay = currentDay.add(steps, 'day');
    }

    return tickValues;
  };

  if (props.dailyCosts.length === 0) {
    return <CostAnalysisNoData />;
  }

  if (props.accumulated) {
    return (
      <AreaChart
        data={dailyData}
        {...commonChartProps}
        width={props.width}
        customDateTimeFormatter={(d) => {
          const date = dayjs(d).utc();
          return date.format('MM/DD');
        }}
        tickValues={getTickValues()}
      />
    );
  }

  return (
    <LineChart
      data={dailyData}
      {...commonChartProps}
      width={props.width}
      customDateTimeFormatter={(d) => {
        const date = dayjs(d).utc();
        return date.format('MM/DD');
      }}
      tickValues={getTickValues()}
    />
  );
};
