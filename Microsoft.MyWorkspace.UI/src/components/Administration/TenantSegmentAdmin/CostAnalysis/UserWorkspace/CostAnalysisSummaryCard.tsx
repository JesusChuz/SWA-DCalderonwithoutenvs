import * as React from 'react';
import clsx from 'clsx';
import { DashboardCard } from 'src/components/GeneralComponents/DashboardCards/DashboardCard';
import { useCommonStyles } from 'src/hooks/useCommonStyles';
import { Text, useTheme } from '@fluentui/react';
import { getFormattedCost } from '../CostAnalysis.utils';
import { getAdminViewStyles } from 'src/components/Administration/AdministrationViews.styles';

interface IProps {
  title: string;
  subTitle?: string | React.ReactNode;
  cost: number;
}

export const CostAnalysisSummaryCard = (props: IProps) => {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const adminStyles = getAdminViewStyles(theme);
  return (
    <DashboardCard
      title={props.title}
      subTitle={props.subTitle}
      className={clsx(commonStyles.boldText, adminStyles.costSummaryCard)}
      collapsible={true}
    >
      <Text className={commonStyles.font45}>
        {getFormattedCost(props.cost ?? 0, 'USD')}
      </Text>
    </DashboardCard>
  );
};
