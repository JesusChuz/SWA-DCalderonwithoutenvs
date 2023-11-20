import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Stack,
  Text,
  Dropdown,
  IDropdownOption,
  useTheme,
} from '@fluentui/react';
import { getCommonStyles } from '../../../components/GeneralComponents/CommonStyles';
import { TenantSegmentAdminTabs } from './TenantSegmentAdminTabs';
import {
  getCostDateRange,
  getFeatureFlagCostAnalysisView,
  getFeatureFlagMoveTenantSegmentUser,
  getFeatureFlagRemoveTenantSegmentUser,
  getFeatureFlagShowUserManagementCounts,
  getFeatureFlagUserWorkspaceCostView,
  getSegmentMemberEmailSearchQuery,
  getSegmentMemberUserExistsFilter,
  getSelectedAdminSegment,
  getTenantSegmentAdminSegments,
  getWorkspaceInsightsFilterProperties,
  getWorkspaceInsightsSortProperty,
} from '../../../store/selectors';
import {
  fetchSegmentMembers,
  fetchWorkspaceInsights,
  fetchWorkspaceInsightsSummary,
  fetchStaleWorkspaceAutoDeleteTotal,
  setTenantSegmentAdminSegment,
  setSelectedUsers,
  fetchInitialUserManagementRequests,
  fetchUserManagementRequestUpdates,
  fetchDailySegmentCosts,
  fetchMonthlySegmentCosts,
  fetchUserCostSummary,
  fetchWorkspaceCostSummary,
  fetchSegmentPendingUserManagementRequestCount,
  fetchTotalPendingUserManagementRequestCount,
} from '../../../store/actions';
import { signalRConnection } from '../../../services/signalRService';
import { getAdminViewStyles } from '../AdministrationViews.styles';
import {
  getDateRange,
  useDisplayCostAnalysisDayOrMonth,
} from './CostAnalysis/CostAnalysis.utils';

export const TenantSegmentAdminView = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const adminViewStyles = getAdminViewStyles(theme);
  const selectedSegment = useSelector(getSelectedAdminSegment);
  const emailSearchQuery = useSelector(getSegmentMemberEmailSearchQuery);
  const userExistsFilter = useSelector(getSegmentMemberUserExistsFilter);
  const adminSegments = useSelector(getTenantSegmentAdminSegments);
  const workspaceInsightsSortProperty = useSelector(
    getWorkspaceInsightsSortProperty
  );
  const workspaceInsightsFilterProperties = useSelector(
    getWorkspaceInsightsFilterProperties
  );
  const removeUserFeatureFlag = useSelector(
    getFeatureFlagRemoveTenantSegmentUser
  );
  const moveUserFeatureFlag = useSelector(getFeatureFlagMoveTenantSegmentUser);
  const featureFlagShowUserManagementCounts = useSelector(
    getFeatureFlagShowUserManagementCounts
  );
  const featureFlagCostAnalysis = useSelector(getFeatureFlagCostAnalysisView);
  const featureFlagUserWorkspaceCost = useSelector(
    getFeatureFlagUserWorkspaceCostView
  );
  const dateRangeInMonths = useSelector(getCostDateRange);
  const displayCostAnalysisDayOrMonth = useDisplayCostAnalysisDayOrMonth();

  const dropdownOptions: IDropdownOption[] = React.useMemo(
    () =>
      adminSegments.map((a) => ({
        key: a.ID,
        text: a.Name,
      })),
    [adminSegments]
  );

  React.useEffect(() => {
    if (adminSegments.length > 0) {
      dispatch(
        setTenantSegmentAdminSegment(
          adminSegments.find((seg) => seg.ID === selectedSegment?.ID) ??
            adminSegments[0]
        )
      );
    } else {
      dispatch(setTenantSegmentAdminSegment(null));
    }
  }, [adminSegments]);

  React.useEffect(() => {
    if (selectedSegment?.ID && (removeUserFeatureFlag || moveUserFeatureFlag)) {
      dispatch(fetchInitialUserManagementRequests(selectedSegment.ID));
      if (featureFlagShowUserManagementCounts) {
        dispatch(
          fetchSegmentPendingUserManagementRequestCount(selectedSegment.ID)
        );
      }
      signalRConnection.on('onUserManagementRequestUpdate', (segmentId) => {
        if (segmentId === selectedSegment?.ID) {
          dispatch(fetchUserManagementRequestUpdates(selectedSegment?.ID));
          if (featureFlagShowUserManagementCounts) {
            dispatch(
              fetchSegmentPendingUserManagementRequestCount(selectedSegment?.ID)
            );
          }
        }
        if (featureFlagShowUserManagementCounts) {
          dispatch(fetchTotalPendingUserManagementRequestCount());
        }
      });
    }
    return () => {
      signalRConnection?.off('onUserManagementRequestUpdate');
    };
  }, [
    selectedSegment?.ID,
    removeUserFeatureFlag,
    moveUserFeatureFlag,
    featureFlagShowUserManagementCounts,
  ]);

  React.useEffect(() => {
    if (selectedSegment) {
      dispatch(fetchSegmentMembers(selectedSegment, emailSearchQuery));
      dispatch(setSelectedUsers([]));
    }
  }, [selectedSegment?.ID, emailSearchQuery, userExistsFilter]);

  React.useEffect(() => {
    if (selectedSegment) {
      dispatch(fetchWorkspaceInsightsSummary(selectedSegment.ID));
      dispatch(fetchStaleWorkspaceAutoDeleteTotal(selectedSegment.ID));
      dispatch(
        fetchWorkspaceInsights(
          [selectedSegment.ID],
          workspaceInsightsFilterProperties
        )
      );
    }
  }, [
    selectedSegment?.ID,
    workspaceInsightsSortProperty,
    workspaceInsightsFilterProperties,
  ]);

  React.useEffect(() => {
    if (selectedSegment && featureFlagCostAnalysis) {
      const { endDate, startDate } = getDateRange(dateRangeInMonths);
      if (featureFlagUserWorkspaceCost) {
        dispatch(fetchUserCostSummary(selectedSegment.ID));
        dispatch(fetchWorkspaceCostSummary(selectedSegment.ID));
      }

      if (displayCostAnalysisDayOrMonth === 'day') {
        dispatch(
          fetchDailySegmentCosts(
            selectedSegment.ID,
            startDate.toDate(),
            endDate.toDate()
          )
        );
      } else {
        dispatch(
          fetchMonthlySegmentCosts(
            selectedSegment.ID,
            startDate.toDate(),
            endDate.toDate()
          )
        );
      }
    }
  }, [
    selectedSegment?.ID,
    dateRangeInMonths,
    displayCostAnalysisDayOrMonth,
    featureFlagCostAnalysis,
    featureFlagUserWorkspaceCost,
  ]);

  return (
    <Stack className={`${commonStyles.container} ${commonStyles.fullHeight}`}>
      <Stack
        horizontal
        horizontalAlign='space-between'
        className={`${adminViewStyles.maxTenantSegmentAdminTabWidth}`}
      >
        <Text as='h1' variant='xxLarge'>
          Tenant Segment Admin Dashboard
        </Text>
        <Dropdown
          label='Segment'
          placeholder='Select a Segment'
          styles={{
            dropdownOptionText: { overflow: 'visible', whiteSpace: 'normal' },
            dropdownItem: { height: 'auto' },
            root: {
              maxWidth: '550px',
              minWidth: '300px',
              marginBottom: '16px',
            },
          }}
          selectedKey={selectedSegment ? selectedSegment.ID : undefined}
          options={dropdownOptions}
          onChange={(event, item) => {
            dispatch(
              setTenantSegmentAdminSegment(
                adminSegments.find((seg) => seg.ID === item.key.toString()) ??
                  null
              )
            );
          }}
        />
      </Stack>
      {selectedSegment && <TenantSegmentAdminTabs />}
    </Stack>
  );
};

export { TenantSegmentAdminView as default };
