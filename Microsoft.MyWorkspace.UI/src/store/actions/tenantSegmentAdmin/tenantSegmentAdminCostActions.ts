import { createAction, Dispatch } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { httpAuthService } from 'src/applicationInsights/httpAuthService';
import { MyWorkspacesStore } from 'src/store/reducers/rootReducer';
import { CostDateRange } from 'src/types/AuthService/CostAnalysis/CostDateRange.types';
import { CostGranularity } from 'src/types/AuthService/CostAnalysis/CostGranularity.types';
import { SegmentCostDailyDto } from 'src/types/AuthService/CostAnalysis/SegmentCostDailyDto.types';
import { SegmentCostMonthlyDto } from 'src/types/AuthService/CostAnalysis/SegmentCostMonthlyDto.types';
import { UserAggregateCostDto } from 'src/types/AuthService/CostAnalysis/UserAggregateCostDto.types';
import { WorkspaceAggregateCostDto } from 'src/types/AuthService/CostAnalysis/WorkspaceAggregateCostDto.types';
import { PageResult } from 'src/types/PageResult.types';
import {
  FETCH_DAILY_SEGMENT_COSTS_BEGIN,
  FETCH_DAILY_SEGMENT_COSTS_SUCCESS,
  FETCH_DAILY_SEGMENT_COSTS_FAILURE,
  FETCH_MONTHLY_SEGMENT_COSTS_BEGIN,
  FETCH_MONTHLY_SEGMENT_COSTS_SUCCESS,
  FETCH_MONTHLY_SEGMENT_COSTS_FAILURE,
  SET_COST_GRANULARITY,
  SET_COST_DATE_RANGE,
  FETCH_WORKSPACE_COSTS_BEGIN,
  FETCH_WORKSPACE_COSTS_SUCCESS,
  FETCH_WORKSPACE_COSTS_FAILURE,
  FETCH_USER_COSTS_BEGIN,
  FETCH_USER_COSTS_SUCCESS,
  FETCH_USER_COSTS_FAILURE,
  SET_COST_ANALYSIS_EMAIL_QUERY,
  SET_WORKSPACE_COST_SORT_PROPERTY,
  SET_USER_COST_SORT_PROPERTY,
  FETCH_WORKSPACE_COST_SUMMARY_BEGIN,
  FETCH_WORKSPACE_COST_SUMMARY_FAILURE,
  FETCH_WORKSPACE_COST_SUMMARY_SUCCESS,
  FETCH_USER_COST_SUMMARY_BEGIN,
  FETCH_USER_COST_SUMMARY_FAILURE,
  FETCH_USER_COST_SUMMARY_SUCCESS,
  APPEND_USER_COSTS_BEGIN,
  APPEND_USER_COSTS_FAILURE,
  APPEND_USER_COSTS_SUCCESS,
  APPEND_WORKSPACE_COSTS_BEGIN,
  APPEND_WORKSPACE_COSTS_FAILURE,
  APPEND_WORKSPACE_COSTS_SUCCESS,
} from '../actionTypes';
import ErrorAction from '../errorAction';
import { SegmentSummaryDto } from 'src/types/AuthService/CostAnalysis/SegmentSummaryDto.types';

export const fetchDailySegmentCostsBegin = createAction<void>(
  FETCH_DAILY_SEGMENT_COSTS_BEGIN
);

export const fetchDailySegmentCostsSuccess = createAction<
  SegmentCostDailyDto[]
>(FETCH_DAILY_SEGMENT_COSTS_SUCCESS);

export const fetchDailySegmentCostsFailure = createAction<AxiosError>(
  FETCH_DAILY_SEGMENT_COSTS_FAILURE
);

export const fetchDailySegmentCosts = (
  segmentID: string,
  startDate: Date,
  endDate: Date
): ((
  dispatch: Dispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch): Promise<void> => {
    dispatch(fetchDailySegmentCostsBegin());
    try {
      const res = await httpAuthService.get<SegmentCostDailyDto[]>(
        `cost/segment/daily?segmentId=${segmentID}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      res.data.sort(
        (a, b) =>
          new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime()
      );
      dispatch(fetchDailySegmentCostsSuccess(res.data));
    } catch (e) {
      dispatch(fetchDailySegmentCostsFailure(e));
      ErrorAction(
        dispatch,
        e,
        `Failed to fetch daily segment costs :\n${e.response?.data}`,
        true
      );
    }
  };
};

export const fetchMonthlySegmentCostsBegin = createAction<void>(
  FETCH_MONTHLY_SEGMENT_COSTS_BEGIN
);

export const fetchMonthlySegmentCostsSuccess = createAction<
  SegmentCostMonthlyDto[]
>(FETCH_MONTHLY_SEGMENT_COSTS_SUCCESS);

export const fetchMonthlySegmentCostsFailure = createAction<AxiosError>(
  FETCH_MONTHLY_SEGMENT_COSTS_FAILURE
);

export const fetchMonthlySegmentCosts = (
  segmentID: string,
  startDate: Date,
  endDate: Date
): ((
  dispatch: Dispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch): Promise<void> => {
    dispatch(fetchMonthlySegmentCostsBegin());
    try {
      const res = await httpAuthService.get(
        `cost/segment/monthly?segmentId=${segmentID}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      dispatch(fetchMonthlySegmentCostsSuccess(res.data));
    } catch (e) {
      dispatch(fetchMonthlySegmentCostsFailure(e));
      ErrorAction(
        dispatch,
        e,
        `Failed to fetch monthly segment costs :\n${e.response?.data}`,
        true
      );
    }
  };
};

export const setCostGranularity =
  createAction<CostGranularity>(SET_COST_GRANULARITY);
export const setCostDateRange =
  createAction<CostDateRange>(SET_COST_DATE_RANGE);

export const fetchWorkspaceCostSummaryBegin = createAction<void>(
  FETCH_WORKSPACE_COST_SUMMARY_BEGIN
);

export const fetchWorkspaceCostSummarySuccess = createAction<SegmentSummaryDto>(
  FETCH_WORKSPACE_COST_SUMMARY_SUCCESS
);

export const fetchWorkspaceCostSummaryFailure = createAction<AxiosError>(
  FETCH_WORKSPACE_COST_SUMMARY_FAILURE
);

export const fetchWorkspaceCostSummary = (
  segmentId: string
): ((
  dispatch: Dispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { tenantSegmentAdminCost } = getState();
    const { costDateRange } = tenantSegmentAdminCost;
    dispatch(fetchWorkspaceCostSummaryBegin());
    try {
      const res = await httpAuthService.get(
        `cost/segment/summary?segmentId=${segmentId}&memberType=Workspace&months=${costDateRange}`
      );
      dispatch(fetchWorkspaceCostSummarySuccess(res.data));
    } catch (e) {
      dispatch(fetchWorkspaceCostSummaryFailure(e));
      ErrorAction(
        dispatch,
        e,
        `Failed to fetch workspace costs :\n${e.response?.data}`,
        true
      );
    }
  };
};

export const fetchUserCostSummaryBegin = createAction<void>(
  FETCH_USER_COST_SUMMARY_BEGIN
);

export const fetchUserCostSummarySuccess = createAction<SegmentSummaryDto>(
  FETCH_USER_COST_SUMMARY_SUCCESS
);

export const fetchUserCostSummaryFailure = createAction<AxiosError>(
  FETCH_USER_COST_SUMMARY_FAILURE
);

export const fetchUserCostSummary = (
  segmentId: string
): ((
  dispatch: Dispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { tenantSegmentAdminCost } = getState();
    const { costDateRange } = tenantSegmentAdminCost;
    dispatch(fetchUserCostSummaryBegin());
    try {
      const res = await httpAuthService.get(
        `cost/segment/summary?segmentId=${segmentId}&memberType=User&months=${costDateRange}`
      );
      dispatch(fetchUserCostSummarySuccess(res.data));
    } catch (e) {
      dispatch(fetchUserCostSummaryFailure(e));
      ErrorAction(
        dispatch,
        e,
        `Failed to fetch user costs :\n${e.response?.data}`,
        true
      );
    }
  };
};

export const fetchWorkspaceCostsBegin = createAction<void>(
  FETCH_WORKSPACE_COSTS_BEGIN
);

export const fetchWorkspaceCostsSuccess = createAction<
  PageResult<WorkspaceAggregateCostDto>
>(FETCH_WORKSPACE_COSTS_SUCCESS);

export const fetchWorkspaceCostsFailure = createAction<AxiosError>(
  FETCH_WORKSPACE_COSTS_FAILURE
);

export const appendWorkspaceCostsBegin = createAction<void>(
  APPEND_WORKSPACE_COSTS_BEGIN
);

export const appendWorkspaceCostsSuccess = createAction<
  PageResult<WorkspaceAggregateCostDto>
>(APPEND_WORKSPACE_COSTS_SUCCESS);

export const appendWorkspaceCostsFailure = createAction<AxiosError>(
  APPEND_WORKSPACE_COSTS_FAILURE
);

export const fetchWorkspaceCosts = (
  append = false
): ((
  dispatch: Dispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { tenantSegmentAdminCost, authService } = getState();
    const { selectedAdminSegment } = authService;
    const {
      costDateRange,
      costAnalysisEmailSearchQuery,
      workspaceSortProperty,
      workspaceCostsContinuationToken,
    } = tenantSegmentAdminCost;
    dispatch(append ? appendWorkspaceCostsBegin() : fetchWorkspaceCostsBegin());
    try {
      const res = await httpAuthService.get(
        `cost/workspace/aggregate?segmentId=${
          selectedAdminSegment?.ID
        }&userEmail=${costAnalysisEmailSearchQuery}&months=${costDateRange}&orderby=${
          workspaceSortProperty.Name
        }&descending=${Boolean(workspaceSortProperty.IsDescending)}${
          append
            ? `&continuationToken=${encodeURIComponent(
                workspaceCostsContinuationToken
              )}`
            : ''
        }`
      );
      dispatch(
        append
          ? appendWorkspaceCostsSuccess(res.data)
          : fetchWorkspaceCostsSuccess(res.data)
      );
    } catch (e) {
      dispatch(
        append ? appendWorkspaceCostsFailure(e) : fetchWorkspaceCostsFailure(e)
      );
      ErrorAction(
        dispatch,
        e,
        `Failed to fetch workspace costs :\n${e.response?.data}`,
        true
      );
    }
  };
};

export const fetchUserCostsBegin = createAction<void>(FETCH_USER_COSTS_BEGIN);

export const fetchUserCostsSuccess = createAction<
  PageResult<UserAggregateCostDto>
>(FETCH_USER_COSTS_SUCCESS);

export const fetchUserCostsFailure = createAction<AxiosError>(
  FETCH_USER_COSTS_FAILURE
);

export const appendUserCostsBegin = createAction<void>(APPEND_USER_COSTS_BEGIN);

export const appendUserCostsSuccess = createAction<
  PageResult<UserAggregateCostDto>
>(APPEND_USER_COSTS_SUCCESS);

export const appendUserCostsFailure = createAction<AxiosError>(
  APPEND_USER_COSTS_FAILURE
);

export const fetchUserCosts = (
  append = false
): ((
  dispatch: Dispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { tenantSegmentAdminCost, authService } = getState();
    const { selectedAdminSegment } = authService;
    const {
      costDateRange,
      costAnalysisEmailSearchQuery,
      userSortProperty,
      userCostsContinuationToken,
    } = tenantSegmentAdminCost;
    dispatch(append ? appendUserCostsBegin() : fetchUserCostsBegin());
    try {
      const res = await httpAuthService.get(
        `cost/user/aggregate?segmentId=${
          selectedAdminSegment?.ID
        }&userEmail=${costAnalysisEmailSearchQuery}&months=${costDateRange}&orderby=${
          userSortProperty.Name
        }&descending=${Boolean(userSortProperty.IsDescending)}${
          append
            ? `&continuationToken=${encodeURIComponent(
                userCostsContinuationToken
              )}`
            : ''
        }`
      );
      dispatch(
        append
          ? appendUserCostsSuccess(res.data)
          : fetchUserCostsSuccess(res.data)
      );
    } catch (e) {
      dispatch(append ? appendUserCostsFailure(e) : fetchUserCostsFailure(e));
      ErrorAction(
        dispatch,
        e,
        `Failed to fetch user costs :\n${e.response?.data}`,
        true
      );
    }
  };
};

export const setCostAnalysisEmailSearchQuery = createAction<string>(
  SET_COST_ANALYSIS_EMAIL_QUERY
);

export const setCostAnalysisUserSortProperty = createAction<
  keyof UserAggregateCostDto
>(SET_USER_COST_SORT_PROPERTY);

export const setCostAnalysisWorkspaceSortProperty = createAction<
  keyof WorkspaceAggregateCostDto
>(SET_WORKSPACE_COST_SORT_PROPERTY);
