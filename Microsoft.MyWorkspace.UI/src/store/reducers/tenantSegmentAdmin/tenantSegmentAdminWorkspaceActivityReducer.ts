import { AxiosError } from 'axios';
import { AzureWorkspaceInsightsDto } from 'src/types/AzureWorkspace/AzureWorkspaceInsightsDto.types';
import { AzureWorkspaceInsightsSummaryDto } from 'src/types/AzureWorkspace/AzureWorkspaceInsightsSummaryDto.types';
import { FilterProperty } from 'src/types/AzureWorkspace/FilterProperty.types';
import { SortProperty } from 'src/types/SortProperty.types';
import { createReducer } from '@reduxjs/toolkit';
import {
  appendWorkspaceInsightsBegin,
  appendWorkspaceInsightsError,
  appendWorkspaceInsightsSuccess,
  appendWorkspaceInsightsSuccessOData,
  bulkDeleteAzureWorkspacesBegin,
  bulkDeleteAzureWorkspacesFailure,
  bulkDeleteAzureWorkspacesSuccess,
  fetchUserWorkspaceInsightsBegin,
  fetchUserWorkspaceInsightsError,
  fetchUserWorkspaceInsightsSuccess,
  fetchUserWorkspaceInsightsSuccessOData,
  fetchWorkspaceInsightsBegin,
  fetchWorkspaceInsightsError,
  fetchWorkspaceInsightsSuccess,
  fetchWorkspaceInsightsSuccessOData,
  fetchWorkspaceInsightsSummaryBegin,
  fetchWorkspaceInsightsSummaryError,
  fetchWorkspaceInsightsSummarySuccess,
  setSelectedWorkspaceInsights,
  setWorkspaceInsightFilterProperties,
  setWorkspaceInsightSortProperty,
} from 'src/store/actions';
import { ODataQueryParams } from 'src/types/OData/ODataQueryParams.types';
import { parseNextLink } from 'src/shared/helpers/ODataHelper';

export interface ReduxTenantSegmentAdminWorkspaceActivityState {
  workspaceInsights: AzureWorkspaceInsightsDto[];
  AzureWorkspaceInsightsSummaryError: AxiosError;
  AzureWorkspaceInsightsSummary: AzureWorkspaceInsightsSummaryDto;
  staleWorkspaceAutodeleteTotalError: AxiosError;
  staleWorkspaceAutodeleteTotal: string;
  workspaceInsightsLoading: boolean;
  workspaceInsightsContinuationToken: string;
  workspaceInsightsNextLink: Partial<
    ODataQueryParams<AzureWorkspaceInsightsDto>
  >;
  workspaceInsightsError: AxiosError;
  userWorkspaceInsights: AzureWorkspaceInsightsDto[];
  userWorkspaceInsightsLoading: boolean;
  userWorkspaceInsightsError: AxiosError;
  workspaceInsightsSortProperty: SortProperty<AzureWorkspaceInsightsDto>;
  selectedWorkspaceInsights: AzureWorkspaceInsightsDto[];
  bulkDeleteWorkspacesError: AxiosError;
  isBulkDeleteWorkspacesPending: boolean;
  workspaceInsightsFilterProperties: FilterProperty[];
}

export const initialTenantSegmentAdminWorkspaceActivityState: ReduxTenantSegmentAdminWorkspaceActivityState =
  {
    workspaceInsights: [],
    AzureWorkspaceInsightsSummary: null,
    AzureWorkspaceInsightsSummaryError: null,
    staleWorkspaceAutodeleteTotal: null,
    staleWorkspaceAutodeleteTotalError: null,
    workspaceInsightsLoading: false,
    workspaceInsightsContinuationToken: null,
    workspaceInsightsNextLink: null,
    workspaceInsightsError: null,
    userWorkspaceInsights: [],
    userWorkspaceInsightsLoading: false,
    userWorkspaceInsightsError: null,
    workspaceInsightsSortProperty: {
      Name: 'LastJitActivationAge',
      IsDescending: true,
    },
    selectedWorkspaceInsights: [],
    bulkDeleteWorkspacesError: null,
    isBulkDeleteWorkspacesPending: false,
    workspaceInsightsFilterProperties: [],
  };

export default createReducer(
  initialTenantSegmentAdminWorkspaceActivityState,
  (builder) => {
    builder
      .addCase(fetchWorkspaceInsightsBegin, (state) => {
        state.workspaceInsights = [];
        state.workspaceInsightsContinuationToken = null;
        state.workspaceInsightsLoading = true;
      })
      .addCase(fetchWorkspaceInsightsError, (state, action) => {
        state.workspaceInsightsLoading = false;
        state.workspaceInsightsError = action.payload;
      })
      .addCase(fetchWorkspaceInsightsSuccess, (state, action) => {
        const payload = action.payload;
        state.workspaceInsights = payload.ResultSet ?? [];
        state.workspaceInsightsContinuationToken =
          payload.ContinuationToken ?? null;
        state.workspaceInsightsLoading = false;
      })
      .addCase(fetchWorkspaceInsightsSuccessOData, (state, action) => {
        const payload = action.payload;
        state.workspaceInsights = payload.value ?? [];
        state.workspaceInsightsNextLink = parseNextLink(payload);
        state.workspaceInsightsLoading = false;
      })
      .addCase(fetchUserWorkspaceInsightsBegin, (state) => {
        state.userWorkspaceInsights = [];
        state.userWorkspaceInsightsLoading = true;
      })
      .addCase(fetchUserWorkspaceInsightsError, (state, action) => {
        state.userWorkspaceInsightsLoading = false;
        state.userWorkspaceInsightsError = action.payload;
      })
      .addCase(fetchUserWorkspaceInsightsSuccess, (state, action) => {
        const payload = action.payload;
        state.userWorkspaceInsights = payload.ResultSet ?? [];
        state.userWorkspaceInsightsLoading = false;
      })
      .addCase(fetchUserWorkspaceInsightsSuccessOData, (state, action) => {
        const payload = action.payload;
        state.userWorkspaceInsights = payload.value ?? [];
        state.userWorkspaceInsightsLoading = false;
      })
      .addCase(appendWorkspaceInsightsBegin, (state) => {
        state.workspaceInsightsLoading = true;
      })
      .addCase(appendWorkspaceInsightsError, (state, action) => {
        state.workspaceInsightsLoading = false;
        state.workspaceInsightsError = action.payload;
      })
      .addCase(appendWorkspaceInsightsSuccess, (state, action) => {
        const payload = action.payload;
        const newResultSet = payload.ResultSet ?? [];
        state.workspaceInsights = [...state.workspaceInsights, ...newResultSet];
        state.workspaceInsightsContinuationToken =
          payload.ContinuationToken ?? null;
        state.workspaceInsightsLoading = false;
      })
      .addCase(appendWorkspaceInsightsSuccessOData, (state, action) => {
        const payload = action.payload;
        const newResultSet = payload.value ?? [];
        state.workspaceInsights = [...state.workspaceInsights, ...newResultSet];
        state.workspaceInsightsNextLink = parseNextLink(payload);
        state.workspaceInsightsLoading = false;
      })
      .addCase(setWorkspaceInsightSortProperty, (state, action) => {
        const currentSortProperty = state.workspaceInsightsSortProperty;
        const newSortName = action.payload;
        const newSortProperty: SortProperty<AzureWorkspaceInsightsDto> =
          newSortName === currentSortProperty.Name
            ? {
                ...currentSortProperty,
                IsDescending: !currentSortProperty.IsDescending,
              }
            : { Name: newSortName, IsDescending: false };
        state.workspaceInsightsSortProperty = newSortProperty;
      })
      .addCase(setWorkspaceInsightFilterProperties, (state, action) => {
        state.workspaceInsightsFilterProperties = action.payload;
      })
      .addCase(fetchWorkspaceInsightsSummaryBegin, (state) => {
        state.AzureWorkspaceInsightsSummary = null;
      })
      .addCase(fetchWorkspaceInsightsSummaryError, (state, action) => {
        state.AzureWorkspaceInsightsSummaryError = action.payload;
      })
      .addCase(fetchWorkspaceInsightsSummarySuccess, (state, action) => {
        state.AzureWorkspaceInsightsSummary = action.payload;
      })
      .addCase(setSelectedWorkspaceInsights, (state, action) => {
        state.selectedWorkspaceInsights = action.payload;
      })
      .addCase(bulkDeleteAzureWorkspacesBegin, (state) => {
        state.isBulkDeleteWorkspacesPending = true;
        state.bulkDeleteWorkspacesError = null;
      })
      .addCase(bulkDeleteAzureWorkspacesSuccess, (state) => {
        state.isBulkDeleteWorkspacesPending = false;
      })
      .addCase(bulkDeleteAzureWorkspacesFailure, (state, action) => {
        state.isBulkDeleteWorkspacesPending = false;
        state.bulkDeleteWorkspacesError = action.payload;
      });
  }
);
