import { createReducer } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { CostDateRange } from 'src/types/AuthService/CostAnalysis/CostDateRange.types';
import { CostGranularity } from 'src/types/AuthService/CostAnalysis/CostGranularity.types';
import { SegmentCostDailyDto } from 'src/types/AuthService/CostAnalysis/SegmentCostDailyDto.types';
import { SegmentCostMonthlyDto } from 'src/types/AuthService/CostAnalysis/SegmentCostMonthlyDto.types';
import { SegmentSummaryDto } from 'src/types/AuthService/CostAnalysis/SegmentSummaryDto.types';
import { UserAggregateCostDto } from 'src/types/AuthService/CostAnalysis/UserAggregateCostDto.types';
import { WorkspaceAggregateCostDto } from 'src/types/AuthService/CostAnalysis/WorkspaceAggregateCostDto.types';
import { SortProperty } from 'src/types/SortProperty.types';
import {
  fetchDailySegmentCostsBegin,
  fetchDailySegmentCostsFailure,
  fetchDailySegmentCostsSuccess,
  fetchMonthlySegmentCostsBegin,
  fetchMonthlySegmentCostsFailure,
  fetchMonthlySegmentCostsSuccess,
  setCostAnalysisEmailSearchQuery,
  setCostDateRange,
  setCostGranularity,
} from '../../actions';
import {
  appendUserCostsBegin,
  appendUserCostsFailure,
  appendUserCostsSuccess,
  appendWorkspaceCostsBegin,
  appendWorkspaceCostsFailure,
  appendWorkspaceCostsSuccess,
  fetchUserCostsBegin,
  fetchUserCostsFailure,
  fetchUserCostsSuccess,
  fetchUserCostSummaryBegin,
  fetchUserCostSummaryFailure,
  fetchUserCostSummarySuccess,
  fetchWorkspaceCostsBegin,
  fetchWorkspaceCostsFailure,
  fetchWorkspaceCostsSuccess,
  fetchWorkspaceCostSummaryBegin,
  fetchWorkspaceCostSummaryFailure,
  fetchWorkspaceCostSummarySuccess,
  setCostAnalysisUserSortProperty,
  setCostAnalysisWorkspaceSortProperty,
} from '../../actions/tenantSegmentAdmin/tenantSegmentAdminCostActions';

export interface ReduxTenantSegmentAdminCostState {
  dailySegmentCosts: SegmentCostDailyDto[];
  dailySegmentCostsLoading: boolean;
  dailySegmentCostsError: AxiosError;
  monthlySegmentCosts: SegmentCostMonthlyDto[];
  monthlySegmentCostsLoading: boolean;
  monthlySegmentCostsError: AxiosError;
  costGranularity: CostGranularity;
  costDateRange: CostDateRange;
  workspaceCostSummary: SegmentSummaryDto;
  workspaceCostSummaryLoading: boolean;
  workspaceCosts: WorkspaceAggregateCostDto[];
  workspaceCostsContinuationToken: string;
  workspaceCostsLoading: boolean;
  workspaceCostsError: AxiosError;
  userCostSummary: SegmentSummaryDto;
  userCostSummaryLoading: boolean;
  userCosts: UserAggregateCostDto[];
  userCostsContinuationToken: string;
  userCostsLoading: boolean;
  userCostsError: AxiosError;
  costAnalysisEmailSearchQuery: string;
  userSortProperty: SortProperty<UserAggregateCostDto>;
  workspaceSortProperty: SortProperty<WorkspaceAggregateCostDto>;
}

export const initialTenantSegmentAdminCostState: ReduxTenantSegmentAdminCostState =
  {
    dailySegmentCosts: [],
    dailySegmentCostsLoading: false,
    dailySegmentCostsError: null,
    monthlySegmentCosts: [],
    monthlySegmentCostsLoading: false,
    monthlySegmentCostsError: null,
    costGranularity: 'day',
    costDateRange: 1,
    workspaceCostSummary: null,
    workspaceCostSummaryLoading: false,
    workspaceCosts: [],
    workspaceCostsContinuationToken: null,
    workspaceCostsLoading: false,
    workspaceCostsError: null,
    userCostSummary: null,
    userCostSummaryLoading: false,
    userCosts: [],
    userCostsContinuationToken: null,
    userCostsLoading: false,
    userCostsError: null,
    costAnalysisEmailSearchQuery: '',
    userSortProperty: {
      Name: 'TotalCost',
      IsDescending: true,
    },
    workspaceSortProperty: {
      Name: 'TotalCost',
      IsDescending: true,
    },
  };

export default createReducer(initialTenantSegmentAdminCostState, (builder) => {
  builder
    .addCase(fetchDailySegmentCostsBegin, (state) => {
      state.dailySegmentCosts = [];
      state.dailySegmentCostsLoading = true;
    })
    .addCase(fetchDailySegmentCostsSuccess, (state, action) => {
      state.dailySegmentCostsLoading = false;
      state.dailySegmentCosts = action.payload;
    })
    .addCase(fetchDailySegmentCostsFailure, (state, action) => {
      state.dailySegmentCostsLoading = false;
      state.dailySegmentCostsError = action.payload;
    })
    .addCase(fetchMonthlySegmentCostsBegin, (state) => {
      state.monthlySegmentCosts = [];
      state.monthlySegmentCostsLoading = true;
    })
    .addCase(fetchMonthlySegmentCostsSuccess, (state, action) => {
      state.monthlySegmentCostsLoading = false;
      state.monthlySegmentCosts = action.payload;
    })
    .addCase(fetchMonthlySegmentCostsFailure, (state, action) => {
      state.monthlySegmentCostsLoading = false;
      state.monthlySegmentCostsError = action.payload;
    })
    .addCase(setCostGranularity, (state, action) => {
      state.costGranularity = action.payload;
    })
    .addCase(setCostDateRange, (state, action) => {
      state.costDateRange = action.payload;
    })
    .addCase(fetchWorkspaceCostSummaryBegin, (state) => {
      state.workspaceCostSummaryLoading = true;
    })
    .addCase(fetchWorkspaceCostSummarySuccess, (state, action) => {
      state.workspaceCostSummary = action.payload;
      state.workspaceCostSummaryLoading = false;
    })
    .addCase(fetchWorkspaceCostSummaryFailure, (state) => {
      state.workspaceCostSummaryLoading = false;
    })
    .addCase(fetchWorkspaceCostsBegin, (state) => {
      state.workspaceCostsLoading = true;
      state.workspaceCosts = [];
    })
    .addCase(fetchWorkspaceCostsSuccess, (state, action) => {
      state.workspaceCosts = action.payload.ResultSet;
      state.workspaceCostsContinuationToken = action.payload.ContinuationToken;
      state.workspaceCostsLoading = false;
    })
    .addCase(fetchWorkspaceCostsFailure, (state, action) => {
      state.workspaceCostsLoading = false;
      state.workspaceCostsError = action.payload as AxiosError;
    })
    .addCase(appendWorkspaceCostsBegin, (state) => {
      state.workspaceCostsLoading = true;
    })
    .addCase(appendWorkspaceCostsSuccess, (state, action) => {
      const newResultSet = action.payload.ResultSet ?? [];
      state.workspaceCosts.push(...newResultSet);
      state.workspaceCostsContinuationToken = action.payload.ContinuationToken;
      state.workspaceCostsLoading = false;
    })
    .addCase(appendWorkspaceCostsFailure, (state, action) => {
      state.workspaceCostsLoading = false;
      state.workspaceCostsError = action.payload as AxiosError;
    })
    .addCase(fetchUserCostSummaryBegin, (state) => {
      state.userCostSummaryLoading = true;
    })
    .addCase(fetchUserCostSummarySuccess, (state, action) => {
      state.userCostSummary = action.payload;
      state.userCostSummaryLoading = false;
    })
    .addCase(fetchUserCostSummaryFailure, (state) => {
      state.userCostSummaryLoading = false;
    })
    .addCase(fetchUserCostsBegin, (state) => {
      state.userCostsLoading = true;
      state.userCosts = [];
    })
    .addCase(fetchUserCostsSuccess, (state, action) => {
      state.userCosts = action.payload.ResultSet;
      state.userCostsContinuationToken = action.payload.ContinuationToken;
      state.userCostsLoading = false;
    })
    .addCase(fetchUserCostsFailure, (state, action) => {
      state.userCostsLoading = false;
      state.userCostsError = action.payload as AxiosError;
    })
    .addCase(appendUserCostsBegin, (state) => {
      state.userCostsLoading = true;
    })
    .addCase(appendUserCostsSuccess, (state, action) => {
      const newResultSet = action.payload.ResultSet ?? [];
      state.userCosts.push(...newResultSet);
      state.userCostsContinuationToken = action.payload.ContinuationToken;
      state.userCostsLoading = false;
    })
    .addCase(appendUserCostsFailure, (state, action) => {
      state.userCostsLoading = false;
      state.userCostsError = action.payload as AxiosError;
    })
    .addCase(setCostAnalysisEmailSearchQuery, (state, action) => {
      state.costAnalysisEmailSearchQuery = action.payload;
    })
    .addCase(setCostAnalysisUserSortProperty, (state, action) => {
      const { payload } = action;
      if (payload === state.userSortProperty.Name) {
        state.userSortProperty.IsDescending =
          !state.userSortProperty.IsDescending;
      } else {
        state.userSortProperty.Name = payload as keyof UserAggregateCostDto;
        state.userSortProperty.IsDescending = false;
      }
    })
    .addCase(setCostAnalysisWorkspaceSortProperty, (state, action) => {
      const { payload } = action;
      if (payload === state.workspaceSortProperty.Name) {
        state.workspaceSortProperty.IsDescending =
          !state.workspaceSortProperty.IsDescending;
      } else {
        state.workspaceSortProperty.Name =
          payload as keyof WorkspaceAggregateCostDto;
        state.userSortProperty.IsDescending = false;
      }
    });
});
