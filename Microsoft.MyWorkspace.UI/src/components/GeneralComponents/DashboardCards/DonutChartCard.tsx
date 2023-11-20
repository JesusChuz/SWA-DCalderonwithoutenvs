import * as React from 'react';
import { DonutChart, IChartProps } from '@fluentui/react-charting';
import { DashboardCard, DashboardCardProps } from './DashboardCard';
import { useTheme } from '@fluentui/react';

interface IProps {
  data: IChartProps;
  dashboardCardProps: DashboardCardProps;
  emptyState?: JSX.Element;
  showEmptyState?: boolean;
}

export const DonutChartCard = (props: IProps): JSX.Element => {
  const theme = useTheme();

  return (
    <DashboardCard {...props.dashboardCardProps}>
      <div>
        {props.showEmptyState && props.emptyState}
        {!props.showEmptyState && (
          <DonutChart
            theme={theme}
            data={props.data}
            innerRadius={55}
            legendProps={{
              allowFocusOnLegends: true,
              styles: {
                legend: {
                  padding: '2px',
                },
                text: {
                  color: `${theme.semanticColors.bodyText} !important`,
                },
              },
            }}
          />
        )}
      </div>
    </DashboardCard>
  );
};
