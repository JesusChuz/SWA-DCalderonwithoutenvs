import * as React from 'react';
import {
  DetailsList,
  IColumn,
  SelectionMode,
  Stack,
  Text,
} from '@fluentui/react';
import { useCommonStyles } from 'src/hooks/useCommonStyles';
import { CostAnalysisSummaryCard } from './CostAnalysisSummaryCard';
import { CostAnalysisNoData } from '../CostAnalysisNoData';
import { getDateRange, getFormattedCost } from '../CostAnalysis.utils';
import {
  getCostDateRange,
  getUserCosts,
  getUserCostsContinuationToken,
  getUserCostsLoading,
  getUserCostSortProperty,
  getUserCostSummary,
} from 'src/store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { UserAggregateCostDto } from 'src/types/AuthService/CostAnalysis/UserAggregateCostDto.types';
import clsx from 'clsx';
import { ContinuationDetailsListWrapper } from 'src/components/GeneralComponents/ContinuationDetailsListWrapper';
import {
  fetchUserCosts,
  setCostAnalysisUserSortProperty,
} from 'src/store/actions';
import { InfoButton } from 'src/components/GeneralComponents/InfoButton';

export const CostAnalysisUserView = (): JSX.Element => {
  const dispatch = useDispatch();
  const commonStyles = useCommonStyles();
  const userCosts = useSelector(getUserCosts);
  const userCostsLoading = useSelector(getUserCostsLoading);
  const userCostsContinuationToken = useSelector(getUserCostsContinuationToken);
  const userCostsSortProperty = useSelector(getUserCostSortProperty);
  const userCostSummary = useSelector(getUserCostSummary);
  const dateRangeInMonths = useSelector(getCostDateRange);
  const { startDate, endDate } = getDateRange(dateRangeInMonths);

  const sortColumn = (key: keyof UserAggregateCostDto) => {
    dispatch(setCostAnalysisUserSortProperty(key));
  };

  const columns: IColumn[] = [
    {
      key: 'userEmail',
      name: 'User Email',
      fieldName: 'UserEmail',
      minWidth: 250,
      onColumnClick: () => sortColumn('UserEmail'),
      isSorted: userCostsSortProperty.Name === 'UserEmail',
      isSortedDescending: userCostsSortProperty.IsDescending,
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
            buttonId='user-total-cost'
            calloutTitle='Total Cost'
            calloutBody={`The total cost of the user's workspace resources in Azure between ${startDate.format(
              'MMMM D, YYYY'
            )} and ${endDate.format('MMMM D, YYYY')}.`}
          />
        </Stack>
      ),
      isSorted: userCostsSortProperty.Name === 'TotalCost',
      isSortedDescending: userCostsSortProperty.IsDescending,
      onRender: (item: UserAggregateCostDto) =>
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
            buttonId='user-average-cost'
            calloutTitle='Average Daily Cost'
            calloutBody={`The average daily cost of the user's workspace resources in Azure between ${startDate.format(
              'MMMM D, YYYY'
            )} and ${endDate.format('MMMM D, YYYY')}.`}
          />
        </Stack>
      ),
      isSorted: userCostsSortProperty.Name === 'AverageCost',
      isSortedDescending: userCostsSortProperty.IsDescending,
      onRender: (item: UserAggregateCostDto) =>
        getFormattedCost(item.AverageCost),
    },
  ];

  return (
    <Stack
      className={clsx(commonStyles.fullHeight, commonStyles.overflowYAuto)}
      tokens={{ childrenGap: 8 }}
    >
      {userCosts.length === 0 && !userCostsLoading ? (
        <CostAnalysisNoData />
      ) : (
        <>
          <Stack horizontal tokens={{ childrenGap: 16 }}>
            <CostAnalysisSummaryCard
              title='Total Cost'
              cost={userCostSummary?.TotalCost}
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
              cost={userCostSummary?.AverageCost}
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
              title='Avg Cost / User'
              cost={userCostSummary?.AverageCostPerMember}
              subTitle={
                <InfoButton
                  buttonId='infobutton-cost-user'
                  calloutTitle='Workspace Count Overview'
                  calloutBody={
                    <Text>
                      {`The average cost of workspace resources per user in this segment between ${startDate.format(
                        'MMMM D YYYY'
                      )} and ${endDate.format('MMMM D YYYY')}.`}
                    </Text>
                  }
                />
              }
            />
          </Stack>
          <ContinuationDetailsListWrapper
            dataLoading={userCostsLoading}
            data={userCosts}
            dataName={'User'}
            showLoadMore={Boolean(userCostsContinuationToken)}
            loadMoreClick={() => dispatch(fetchUserCosts(true))}
          >
            <DetailsList
              columns={columns}
              items={userCosts}
              selectionMode={SelectionMode.none}
            />
          </ContinuationDetailsListWrapper>
        </>
      )}
    </Stack>
  );
};
