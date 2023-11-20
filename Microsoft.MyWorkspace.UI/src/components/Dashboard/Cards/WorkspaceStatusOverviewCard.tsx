import * as React from 'react';
import { IChartProps } from '@fluentui/react-charting';
import { getAzureWorkspaces } from '../../../store/selectors/azureWorkspaceSelectors';
import { AzureWorkspaceDto } from '../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { ResourceState } from '../../../types/AzureWorkspace/enums/ResourceState';
import { useHistory } from 'react-router';
import { getDashboardStyles } from '../Dashboard.styles';
import { useSelector } from 'react-redux';
import { CardEmptyState } from './CardEmptyState';
import {
  donutChartGreen,
  donutChartYellow,
  donutChartBlue,
  donutChartRed,
} from '../../../shared/Colors';
import KittyEmptyState from '../../../assets/kittyEmptyPage.svg';
import { useTheme } from '@fluentui/react';
import { DonutChartCard } from '../../GeneralComponents/DashboardCards/DonutChartCard';

type WorkspaceStatusOccurrences = {
  [key: number]: number;
};

export const WorkspaceStatusOverviewCard = (): JSX.Element => {
  const theme = useTheme();
  const styles = getDashboardStyles(theme);
  const allWorkspaces: AzureWorkspaceDto[] = useSelector(getAzureWorkspaces);
  const [workspaceStatusCounts, setWorkspaceStatusCounts] =
    React.useState<WorkspaceStatusOccurrences>({});
  const history = useHistory();

  const data: IChartProps = {
    chartData: [
      {
        legend: 'Active',
        data: workspaceStatusCounts[ResourceState.Running] || 0,
        color: donutChartGreen,
      },
      {
        legend: 'Stopped',
        data: workspaceStatusCounts[ResourceState.Off] || 0,
        color: donutChartBlue,
      },
      {
        legend: 'Deploying',
        data: workspaceStatusCounts[ResourceState.Deploying] || 0,
        color: donutChartYellow,
      },
      {
        legend: 'Failed',
        data: workspaceStatusCounts[ResourceState.Failed] || 0,
        color: donutChartRed,
      },
    ],
  };

  const buildWorkspaceStatusCountsObject = () => {
    const statusCounts: WorkspaceStatusOccurrences = {};
    allWorkspaces.forEach(
      (val: AzureWorkspaceDto) =>
        (statusCounts[val.State] = statusCounts[val.State]
          ? ++statusCounts[val.State]
          : 1)
    );
    setWorkspaceStatusCounts(statusCounts);
  };

  React.useEffect(() => {
    buildWorkspaceStatusCountsObject();
  }, [allWorkspaces]);

  return (
    <>
      <DonutChartCard
        data={data}
        dashboardCardProps={{
          title: 'Workspace Status Overview',
          className: styles.medDashboardCard,
          buttonProps: allWorkspaces.length > 0 && {
            title: 'Go to Workspaces',
            onClick: () => history.push('/'),
            footerContainerStyles: {
              display: 'flex',
              justifyContent: 'center',
            },
          },
        }}
        emptyState={
          <CardEmptyState
            imgSrc={KittyEmptyState}
            headerText='No Workspaces'
            descriptionText='You do not have any workspaces. Select New Workspace from the side
          menu to get started.'
          />
        }
        showEmptyState={allWorkspaces.length === 0}
      />
    </>
  );
};
