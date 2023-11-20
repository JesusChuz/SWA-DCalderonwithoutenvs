import { createSelector } from '@reduxjs/toolkit';
import { MyWorkspacesStore } from 'src/store/reducers/rootReducer';
import { ReduxTenantSegmentAdminCostState } from 'src/store/reducers/tenantSegmentAdmin/tenantSegmentAdminCostReducer';

const tenantSegmentAdminCostState = (
  state: MyWorkspacesStore
): ReduxTenantSegmentAdminCostState => state.tenantSegmentAdminCost;

export const getDailySegmentCosts = createSelector(
  tenantSegmentAdminCostState,
  (tenantSegmentAdminCost: ReduxTenantSegmentAdminCostState) =>
    tenantSegmentAdminCost.dailySegmentCosts
);

export const getDailySegmentCostsLoading = createSelector(
  tenantSegmentAdminCostState,
  (tenantSegmentAdminCost: ReduxTenantSegmentAdminCostState) =>
    tenantSegmentAdminCost.dailySegmentCostsLoading
);

export const getMonthlySegmentCosts = createSelector(
  tenantSegmentAdminCostState,
  (tenantSegmentAdminCost: ReduxTenantSegmentAdminCostState) =>
    tenantSegmentAdminCost.monthlySegmentCosts
);

export const getMonthlySegmentCostsLoading = createSelector(
  tenantSegmentAdminCostState,
  (tenantSegmentAdminCost: ReduxTenantSegmentAdminCostState) =>
    tenantSegmentAdminCost.monthlySegmentCostsLoading
);

export const getCostDateRange = createSelector(
  tenantSegmentAdminCostState,
  (tenantSegmentAdminCost: ReduxTenantSegmentAdminCostState) =>
    tenantSegmentAdminCost.costDateRange
);

export const getCostGranularity = createSelector(
  tenantSegmentAdminCostState,
  (tenantSegmentAdminCost: ReduxTenantSegmentAdminCostState) =>
    tenantSegmentAdminCost.costGranularity
);

export const getWorkspaceCostSummary = createSelector(
  tenantSegmentAdminCostState,
  (tenantSegmentAdminCost: ReduxTenantSegmentAdminCostState) =>
    tenantSegmentAdminCost.workspaceCostSummary
);

export const getWorkspaceCostSummaryLoading = createSelector(
  tenantSegmentAdminCostState,
  (tenantSegmentAdminCost: ReduxTenantSegmentAdminCostState) =>
    tenantSegmentAdminCost.workspaceCostSummaryLoading
);

export const getWorkspaceCosts = createSelector(
  tenantSegmentAdminCostState,
  (tenantSegmentAdminCost: ReduxTenantSegmentAdminCostState) =>
    tenantSegmentAdminCost.workspaceCosts
);

export const getWorkspaceCostsLoading = createSelector(
  tenantSegmentAdminCostState,
  (tenantSegmentAdminCost: ReduxTenantSegmentAdminCostState) =>
    tenantSegmentAdminCost.workspaceCostsLoading
);

export const getWorkspaceCostsContinuationToken = createSelector(
  tenantSegmentAdminCostState,
  (tenantSegmentAdminCost: ReduxTenantSegmentAdminCostState) =>
    tenantSegmentAdminCost.workspaceCostsContinuationToken
);

export const getUserCostSummary = createSelector(
  tenantSegmentAdminCostState,
  (tenantSegmentAdminCost: ReduxTenantSegmentAdminCostState) =>
    tenantSegmentAdminCost.userCostSummary
);

export const getUserCostSummaryLoading = createSelector(
  tenantSegmentAdminCostState,
  (tenantSegmentAdminCost: ReduxTenantSegmentAdminCostState) =>
    tenantSegmentAdminCost.userCostSummaryLoading
);

export const getUserCosts = createSelector(
  tenantSegmentAdminCostState,
  (tenantSegmentAdminCost: ReduxTenantSegmentAdminCostState) =>
    tenantSegmentAdminCost.userCosts
);

export const getUserCostsLoading = createSelector(
  tenantSegmentAdminCostState,
  (tenantSegmentAdminCost: ReduxTenantSegmentAdminCostState) =>
    tenantSegmentAdminCost.userCostsLoading
);

export const getUserCostsContinuationToken = createSelector(
  tenantSegmentAdminCostState,
  (tenantSegmentAdminCost: ReduxTenantSegmentAdminCostState) =>
    tenantSegmentAdminCost.userCostsContinuationToken
);

export const getCostEmailQuery = createSelector(
  tenantSegmentAdminCostState,
  (tenantSegmentAdminCost: ReduxTenantSegmentAdminCostState) =>
    tenantSegmentAdminCost.costAnalysisEmailSearchQuery
);

export const getUserCostSortProperty = createSelector(
  tenantSegmentAdminCostState,
  (tenantSegmentAdminCost: ReduxTenantSegmentAdminCostState) =>
    tenantSegmentAdminCost.userSortProperty
);

export const getWorkspaceCostSortProperty = createSelector(
  tenantSegmentAdminCostState,
  (tenantSegmentAdminCost: ReduxTenantSegmentAdminCostState) =>
    tenantSegmentAdminCost.workspaceSortProperty
);
