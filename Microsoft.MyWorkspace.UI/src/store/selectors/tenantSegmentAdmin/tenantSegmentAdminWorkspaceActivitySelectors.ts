import { createSelector } from 'reselect';
import { ReduxTenantSegmentAdminWorkspaceActivityState } from 'src/store/reducers/tenantSegmentAdmin/tenantSegmentAdminWorkspaceActivityReducer';
import { MyWorkspacesStore } from 'src/store/reducers/rootReducer';

const reduxTenantSegmentAdminWorkspaceActivityState = (
  state: MyWorkspacesStore
): ReduxTenantSegmentAdminWorkspaceActivityState =>
  state.tenantSegmentAdminWorkspaceActivity;

export const getWorkspaceInsights = createSelector(
  reduxTenantSegmentAdminWorkspaceActivityState,
  (workspaceActivityState: ReduxTenantSegmentAdminWorkspaceActivityState) => {
    return workspaceActivityState.workspaceInsights;
  }
);

export const getWorkspaceInsightsContinuationToken = createSelector(
  reduxTenantSegmentAdminWorkspaceActivityState,
  (workspaceActivityState: ReduxTenantSegmentAdminWorkspaceActivityState) => {
    return workspaceActivityState.workspaceInsightsContinuationToken;
  }
);

export const getWorkspaceInsightsNextLink = createSelector(
  reduxTenantSegmentAdminWorkspaceActivityState,
  (workspaceActivityState: ReduxTenantSegmentAdminWorkspaceActivityState) => {
    return workspaceActivityState.workspaceInsightsNextLink;
  }
);

export const getWorkspaceInsightsLoading = createSelector(
  reduxTenantSegmentAdminWorkspaceActivityState,
  (workspaceActivityState: ReduxTenantSegmentAdminWorkspaceActivityState) => {
    return workspaceActivityState.workspaceInsightsLoading;
  }
);

export const getUserWorkspaceInsights = createSelector(
  reduxTenantSegmentAdminWorkspaceActivityState,
  (workspaceActivityState: ReduxTenantSegmentAdminWorkspaceActivityState) => {
    return workspaceActivityState.userWorkspaceInsights;
  }
);

export const getUserWorkspaceInsightsLoading = createSelector(
  reduxTenantSegmentAdminWorkspaceActivityState,
  (workspaceActivityState: ReduxTenantSegmentAdminWorkspaceActivityState) => {
    return workspaceActivityState.userWorkspaceInsightsLoading;
  }
);

export const getWorkspaceInsightsSortProperty = createSelector(
  reduxTenantSegmentAdminWorkspaceActivityState,
  (workspaceActivityState: ReduxTenantSegmentAdminWorkspaceActivityState) => {
    return workspaceActivityState.workspaceInsightsSortProperty;
  }
);

export const getWorkspaceInsightsFilterProperties = createSelector(
  reduxTenantSegmentAdminWorkspaceActivityState,
  (workspaceActivityState: ReduxTenantSegmentAdminWorkspaceActivityState) => {
    return workspaceActivityState.workspaceInsightsFilterProperties;
  }
);

export const getWorkspaceInsightsSummary = createSelector(
  reduxTenantSegmentAdminWorkspaceActivityState,
  (workspaceActivityState: ReduxTenantSegmentAdminWorkspaceActivityState) => {
    return workspaceActivityState.AzureWorkspaceInsightsSummary;
  }
);

export const getStaleWorkspaceAutoDeleteTotal = createSelector(
  reduxTenantSegmentAdminWorkspaceActivityState,
  (workspaceActivityState: ReduxTenantSegmentAdminWorkspaceActivityState) => {
    return workspaceActivityState.staleWorkspaceAutodeleteTotal;
  }
);

export const getSelectedWorkspaceInsights = createSelector(
  reduxTenantSegmentAdminWorkspaceActivityState,
  (workspaceActivityState: ReduxTenantSegmentAdminWorkspaceActivityState) => {
    return workspaceActivityState.selectedWorkspaceInsights;
  }
);
