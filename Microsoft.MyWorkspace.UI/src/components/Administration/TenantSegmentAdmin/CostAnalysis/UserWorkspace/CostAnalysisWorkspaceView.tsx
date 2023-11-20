import * as React from 'react';
import {
  DetailsList,
  IColumn,
  SelectionMode,
  Stack,
  Text,
} from '@fluentui/react';
import { useCommonStyles } from 'src/hooks/useCommonStyles';
import { CostAnalysisNoData } from '../CostAnalysisNoData';
import { getDateRange, getFormattedCost } from '../CostAnalysis.utils';
import { CostAnalysisSummaryCard } from './CostAnalysisSummaryCard';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCostDateRange,
  getWorkspaceCosts,
  getWorkspaceCostsContinuationToken,
  getWorkspaceCostsLoading,
  getWorkspaceCostSortProperty,
  getWorkspaceCostSummary,
} from 'src/store/selectors';
import { WorkspaceAggregateCostDto } from 'src/types/AuthService/CostAnalysis/WorkspaceAggregateCostDto.types';
import clsx from 'clsx';
import { ContinuationDetailsListWrapper } from 'src/components/GeneralComponents/ContinuationDetailsListWrapper';
import {
  fetchWorkspaceCosts,
  setCostAnalysisWorkspaceSortProperty,
} from 'src/store/actions';
import { InfoButton } from 'src/components/GeneralComponents/InfoButton';

export const CostAnalysisWorkspaceView = (): JSX.Element => {
  const dispatch = useDispatch();
  const commonStyles = useCommonStyles();
  const workspaceCosts = useSelector(getWorkspaceCosts);
  const workspaceCostsLoading = useSelector(getWorkspaceCostsLoading);
  const workspaceCostsContinuationToken = useSelector(
    getWorkspaceCostsContinuationToken
  );
  const workspaceCostsSortProperty = useSelector(getWorkspaceCostSortProperty);
  const workspaceCostSummary = useSelector(getWorkspaceCostSummary);
  const dateRangeInMonths = useSelector(getCostDateRange);
  const { startDate, endDate } = getDateRange(dateRangeInMonths);

  const sortColumn = (key: keyof WorkspaceAggregateCostDto) => {
    dispatch(setCostAnalysisWorkspaceSortProperty(key));
  };

  const columns: IColumn[] = [
    {
      key: 'workspaceName',
      name: 'Workspace Name',
      fieldName: 'WorkspaceName',
      minWidth: 50,
      maxWidth: 350,
      onColumnClick: () => sortColumn('WorkspaceName'),
      isSorted: workspaceCostsSortProperty.Name === 'WorkspaceName',
      isSortedDescending: workspaceCostsSortProperty.IsDescending,
    },
    {
      key: 'workspaceOwner',
      name: 'Workspace Owner',
      fieldName: 'UserEmail',
      minWidth: 250,
      maxWidth: 350,
      onColumnClick: () => sortColumn('UserEmail'),
      isSorted: workspaceCostsSortProperty.Name === 'UserEmail',
      isSortedDescending: workspaceCostsSortProperty.IsDescending,
    },
    {
      key: 'totalCost',
      name: 'Total Cost (USD)',
      minWidth: 220,
      maxWidth: 250,
      onColumnClick: () => sortColumn('TotalCost'),
      onRenderHeader: (columnProps, defaultRenderer) => (
        <Stack horizontal verticalAlign='center'>
          {defaultRenderer(columnProps)}
          <InfoButton
            buttonId='workspace-total-cost'
            calloutTitle='Total Cost'
            calloutBody={`The total cost of the workspace's resources in Azure between ${startDate.format(
              'MMMM D, YYYY'
            )} and ${endDate.format('MMMM D, YYYY')}.`}
          />
        </Stack>
      ),
      isSorted: workspaceCostsSortProperty.Name === 'TotalCost',
      isSortedDescending: workspaceCostsSortProperty.IsDescending,
      onRender: (item: WorkspaceAggregateCostDto) =>
        getFormattedCost(item.TotalCost),
    },
    {
      key: 'averageCost',
      name: 'Avg Daily Cost (USD)',
      minWidth: 220,
      maxWidth: 250,
      onColumnClick: () => sortColumn('AverageCost'),
      onRenderHeader: (columnProps, defaultRenderer) => (
        <Stack horizontal verticalAlign='center'>
          {defaultRenderer(columnProps)}
          <InfoButton
            buttonId='workspace-average-cost'
            calloutTitle='Average Daily Cost'
            calloutBody={`The average daily cost of the workspace's resources in Azure between ${startDate.format(
              'MMMM D, YYYY'
            )} and ${endDate.format('MMMM D, YYYY')}.`}
          />
        </Stack>
      ),
      isSorted: workspaceCostsSortProperty.Name === 'AverageCost',
      isSortedDescending: workspaceCostsSortProperty.IsDescending,
      onRender: (item: WorkspaceAggregateCostDto) =>
        getFormattedCost(item.AverageCost),
    },
  ];

  return (
    <Stack
      className={clsx(commonStyles.fullHeight, commonStyles.overflowYAuto)}
      tokens={{ childrenGap: 8 }}
    >
      {workspaceCosts.length === 0 && !workspaceCostsLoading ? (
        <CostAnalysisNoData />
      ) : (
        <>
          <Stack horizontal tokens={{ childrenGap: 16 }}>
            <CostAnalysisSummaryCard
              title='Total Cost'
              cost={workspaceCostSummary?.TotalCost}
              subTitle={
                <InfoButton
                  buttonId='infobutton-total-cost'
                  calloutTitle='Total Cost'
                  calloutBody={
                    <Text>
                      {`The total cost of workspace resources in this segment between ${startDate.format(
                        'MMMM D YYYY'
                      )} and ${endDate.format('MMMM D YYYY')}.`}
                    </Text>
                  }
                />
              }
            />
            <CostAnalysisSummaryCard
              title='Avg Daily Cost'
              cost={workspaceCostSummary?.AverageCost}
              subTitle={
                <InfoButton
                  buttonId='infobutton-daily-cost'
                  calloutTitle='Average Daily Cost'
                  calloutBody={
                    <Text>
                      {`The average daily cost of workspace resources in this segment between ${startDate.format(
                        'MMMM D YYYY'
                      )} and ${endDate.format('MMMM D YYYY')}.`}
                    </Text>
                  }
                />
              }
            />
            <CostAnalysisSummaryCard
              title='Avg Cost / Workspace'
              cost={workspaceCostSummary?.AverageCostPerMember}
              subTitle={
                <InfoButton
                  buttonId='infobutton-cost-workspace'
                  calloutTitle='Workspace Count Overview'
                  calloutBody={
                    <Text>
                      {`The average cost of workspace resources per workspace in this segment between ${startDate.format(
                        'MMMM D YYYY'
                      )} and ${endDate.format('MMMM D YYYY')}.`}
                    </Text>
                  }
                />
              }
            />
          </Stack>
          <ContinuationDetailsListWrapper
            dataLoading={workspaceCostsLoading}
            data={workspaceCosts}
            dataName={'Workspace'}
            showLoadMore={Boolean(workspaceCostsContinuationToken)}
            loadMoreClick={() => dispatch(fetchWorkspaceCosts(true))}
          >
            <DetailsList
              columns={columns}
              items={workspaceCosts}
              selectionMode={SelectionMode.none}
            />
          </ContinuationDetailsListWrapper>
        </>
      )}
    </Stack>
  );
};
