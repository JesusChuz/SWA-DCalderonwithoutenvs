import * as React from 'react';
import { Spinner, SpinnerSize, Stack } from '@fluentui/react';
import { useSelector } from 'react-redux';
import { useCommonStyles } from 'src/hooks/useCommonStyles';
import {
  getCostGranularity,
  getDailySegmentCosts,
  getDailySegmentCostsLoading,
  getMonthlySegmentCosts,
  getMonthlySegmentCostsLoading,
} from 'src/store/selectors';
import { CostAnalysisDailyChart } from './CostAnalysisDailyChart';
import { CostAnalysisMonthlyChart } from './CostAnalysisMonthlyChart';
import { useDisplayCostAnalysisDayOrMonth } from '../CostAnalysis.utils';
import clsx from 'clsx';

export const CostAnalysisChart = (): JSX.Element => {
  const [divWidth, setDivWidth] = React.useState(1500);
  const commonStyles = useCommonStyles();
  const dailyCosts = useSelector(getDailySegmentCosts);
  const monthlyCosts = useSelector(getMonthlySegmentCosts);
  const dailyCostsLoading = useSelector(getDailySegmentCostsLoading);
  const monthlyCostsLoading = useSelector(getMonthlySegmentCostsLoading);
  const granularity = useSelector(getCostGranularity);
  const displayDayOrMonth = useDisplayCostAnalysisDayOrMonth();

  const isLoading =
    (displayDayOrMonth === 'day' && dailyCostsLoading) ||
    (displayDayOrMonth === 'month' && monthlyCostsLoading);

  const getChartComponent = (divWidth: number): JSX.Element => {
    const accumulated = granularity === 'accumulated';
    if (displayDayOrMonth === 'month') {
      return (
        <CostAnalysisMonthlyChart
          monthlyCosts={monthlyCosts}
          accumulated={accumulated}
          width={divWidth}
        />
      );
    }
    return (
      <CostAnalysisDailyChart
        dailyCosts={dailyCosts}
        accumulated={accumulated}
        width={divWidth}
      />
    );
  };

  React.useLayoutEffect(() => {
    const resizeAction = () => {
      const chartStackWidth =
        document.querySelector('#chart-stack-id').clientWidth;
      setDivWidth(chartStackWidth);
    };
    resizeAction();
    window.addEventListener('resize', resizeAction);
    return () => {
      window.removeEventListener('resize', resizeAction);
    };
  }, []);

  return (
    <Stack
      id='chart-stack-id'
      style={{ minWidth: 750, maxWidth: 1500, width: '100%', height: 600 }}
    >
      {isLoading ? (
        <Stack
          horizontalAlign='center'
          verticalAlign='center'
          className={clsx(
            commonStyles.marginTop24,
            commonStyles.fullHeight,
            commonStyles.fullWidth
          )}
        >
          <Spinner size={SpinnerSize.large} />
        </Stack>
      ) : (
        getChartComponent(divWidth)
      )}
    </Stack>
  );
};
