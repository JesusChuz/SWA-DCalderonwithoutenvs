import * as React from 'react';
import {
  IVerticalBarChartDataPoint,
  VerticalBarChart,
} from '@fluentui/react-charting';
import { SegmentCostMonthlyDto } from 'src/types/AuthService/CostAnalysis/SegmentCostMonthlyDto.types';
import { useSelector } from 'react-redux';
import { getSelectedAdminSegment } from 'src/store/selectors';
import { useTheme } from '@fluentui/react';
import dayjs from 'dayjs';
import {
  accumulatedCosts,
  commonChartProps,
  getFormattedCost,
} from '../CostAnalysis.utils';
import { CostAnalysisNoData } from '../CostAnalysisNoData';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

interface IProps {
  monthlyCosts: SegmentCostMonthlyDto[];
  width: number;
  accumulated?: boolean;
}

export const CostAnalysisMonthlyChart = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const currentSegment = useSelector(getSelectedAdminSegment);
  const monthlyData: IVerticalBarChartDataPoint[] = React.useMemo(
    () =>
      (props.accumulated
        ? accumulatedCosts(props.monthlyCosts)
        : props.monthlyCosts
      ).map((cost) => ({
        x: dayjs(cost.Timestamp).utc().format('MMMM'),
        y: parseFloat(cost.Cost.toFixed(2)),
        color: theme.palette.blue,
        legend: currentSegment.Name,
        yAxisCalloutData: getFormattedCost(cost.Cost),
      })),
    [props.monthlyCosts, props.accumulated]
  );

  if (props.monthlyCosts.length === 0) {
    return <CostAnalysisNoData />;
  }

  return (
    <VerticalBarChart
      chartTitle={`${
        props.accumulated ? 'Accumulated' : 'Monthly'
      } Segment Cost`}
      barWidth={24}
      useSingleColor={true}
      data={monthlyData}
      {...commonChartProps}
      width={props.width}
      hideLabels={true}
    />
  );
};
