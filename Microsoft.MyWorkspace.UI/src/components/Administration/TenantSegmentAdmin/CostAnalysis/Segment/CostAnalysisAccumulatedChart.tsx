import * as React from 'react';
import { AreaChart, IChartProps } from '@fluentui/react-charting';

export const CostAnalysisAccumulatedChart = (): JSX.Element => {
  const data: IChartProps = { chartTitle: 'Segment Cost', lineChartData: [] };
  return (
    <div>
      <AreaChart data={data} />
    </div>
  );
};
