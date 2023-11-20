import * as React from 'react';
import {
  Dropdown,
  IDropdownOption,
  Stack,
  useTheme,
  Text,
  SearchBox,
  MessageBar,
} from '@fluentui/react';
import { useCommonStyles } from 'src/hooks/useCommonStyles';
import { getAdminViewStyles } from '../../AdministrationViews.styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCostDateRange,
  getCostEmailQuery,
  getCostGranularity,
  getFeatureFlagUserWorkspaceCostView,
  getSelectedAdminSegment,
  getUserCostSortProperty,
  getWorkspaceCostSortProperty,
} from 'src/store/selectors';
import {
  fetchUserCosts,
  fetchWorkspaceCosts,
  setCostAnalysisEmailSearchQuery,
  setCostDateRange,
  setCostGranularity,
} from 'src/store/actions';
import { CostGranularity } from 'src/types/AuthService/CostAnalysis/CostGranularity.types';
import { CostDateRange } from 'src/types/AuthService/CostAnalysis/CostDateRange.types';
import { CostAnalysisChart } from './Segment/CostAnalysisChart';
import {
  displayDateRange,
  getDateRange,
  maxDailyDisplayInMonths,
} from './CostAnalysis.utils';
import clsx from 'clsx';
import { CostAnalysisUserView } from './UserWorkspace/CostAnalysisUserView';
import { CostAnalysisWorkspaceView } from './UserWorkspace/CostAnalysisWorkspaceView';

type ViewType = 'segment' | 'workspace' | 'user';

export const CostAnalysisView = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const styles = getAdminViewStyles(theme);
  const dateRangeInMonths = useSelector(getCostDateRange);
  const granularity = useSelector(getCostGranularity);
  const selectedSegment = useSelector(getSelectedAdminSegment);
  const userWorkspaceCostViewEnabled =
    useSelector(getFeatureFlagUserWorkspaceCostView) || true;
  const costAnalysisEmailSearchQuery = useSelector(getCostEmailQuery);
  const userCostSortProperty = useSelector(getUserCostSortProperty);
  const workspaceCostSortProperty = useSelector(getWorkspaceCostSortProperty);
  const [currentView, setCurrentView] = React.useState<ViewType>('segment');
  const [emailSearchValue, setEmailSearchValue] = React.useState('');

  const viewOptions: IDropdownOption[] = [
    { key: 'segment', text: 'Segment Cost' },
    { key: 'workspace', text: 'Workspace Cost' },
    { key: 'user', text: 'User Cost' },
  ];

  const dateRangeOptions: IDropdownOption[] = [
    { key: 1, text: 'This month' },
    { key: 2, text: 'Last 2 months' },
    { key: 3, text: 'Last 3 months' },
    {
      key: 6,
      text: 'Last 6 months',
      hidden: currentView === 'segment' && granularity === 'day',
    },
    {
      key: 12,
      text: 'Last 12 months',
      hidden: currentView === 'segment' && granularity === 'day',
    },
  ];

  const granularityOptions: IDropdownOption[] = [
    { key: 'day', text: 'Daily' },
    { key: 'month', text: 'Monthly' },
    { key: 'accumulated', text: 'Accumulated' },
  ];

  React.useEffect(() => {
    if (
      currentView === 'segment' &&
      granularity === 'day' &&
      dateRangeInMonths > maxDailyDisplayInMonths
    ) {
      dispatch(setCostDateRange(1));
    }
  }, [currentView, granularity, dateRangeInMonths, maxDailyDisplayInMonths]);

  React.useEffect(() => {
    if (selectedSegment?.ID) {
      dispatch(fetchWorkspaceCosts());
    }
  }, [
    dateRangeInMonths,
    selectedSegment?.ID,
    costAnalysisEmailSearchQuery,
    workspaceCostSortProperty,
  ]);

  React.useEffect(() => {
    if (selectedSegment?.ID) {
      dispatch(fetchUserCosts());
    }
  }, [
    dateRangeInMonths,
    selectedSegment?.ID,
    costAnalysisEmailSearchQuery,
    userCostSortProperty,
  ]);

  const { startDate, endDate } = getDateRange(dateRangeInMonths);

  return (
    <Stack
      className={clsx(
        commonStyles.fullHeight,
        styles.maxTenantSegmentAdminTabWidth,
        commonStyles.overflowYAuto
      )}
      tokens={{ childrenGap: 16 }}
    >
      <div className={commonStyles.marginTop16}>
        <Stack horizontal horizontalAlign='space-between' verticalAlign='start'>
          <Stack.Item>
            {userWorkspaceCostViewEnabled ? (
              <Dropdown
                label='View'
                options={viewOptions}
                selectedKey={currentView}
                styles={{ dropdown: { width: 150 } }}
                onChange={(e, item) => {
                  setCurrentView(item.key as ViewType);
                }}
              />
            ) : (
              <Text
                as='h2'
                variant='xLarge'
                className={clsx(commonStyles.margin0, commonStyles.marginTop24)}
              >
                Segment Cost
              </Text>
            )}
          </Stack.Item>
          <Stack.Item>
            <Stack horizontal horizontalAlign='end' tokens={{ childrenGap: 8 }}>
              {currentView === 'segment' ? (
                <Dropdown
                  label='Granularity'
                  options={granularityOptions}
                  selectedKey={granularity}
                  styles={{ dropdown: { width: 150 } }}
                  onChange={(e, item) => {
                    dispatch(setCostGranularity(item.key as CostGranularity));
                  }}
                />
              ) : (
                <SearchBox
                  styles={{
                    root: { flexGrow: 1, marginTop: 29, width: 270 },
                  }}
                  value={emailSearchValue}
                  name='tenantSegmentCostEmailSearch'
                  onSearch={(newValue) =>
                    dispatch(setCostAnalysisEmailSearchQuery(newValue))
                  }
                  onClear={() => {
                    setEmailSearchValue('');
                    dispatch(setCostAnalysisEmailSearchQuery(''));
                  }}
                  onChange={(event, newValue) => setEmailSearchValue(newValue)}
                  placeholder='Search By User Email'
                  autoComplete='off'
                />
              )}
              <Stack>
                <Dropdown
                  label='Date Range'
                  options={dateRangeOptions}
                  selectedKey={dateRangeInMonths}
                  styles={{ dropdown: { width: 150 } }}
                  onChange={(e, item) => {
                    dispatch(setCostDateRange(item.key as CostDateRange));
                  }}
                />
                <Text style={{ margin: '2px 0' }} variant='small'>
                  {displayDateRange({ startDate, endDate })}
                </Text>
              </Stack>
            </Stack>
          </Stack.Item>
        </Stack>
      </div>
      <MessageBar>
        <div>{`Cost information is delayed by 72 hours${
          startDate.isBefore('2023-04-01')
            ? ' and is not available prior to April 2023'
            : ''
        }.`}</div>
      </MessageBar>
      {currentView === 'segment' && <CostAnalysisChart />}
      {currentView === 'workspace' && <CostAnalysisWorkspaceView />}
      {currentView === 'user' && <CostAnalysisUserView />}
    </Stack>
  );
};
