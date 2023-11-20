import { createAction, Dispatch } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { httpAuthService } from 'src/applicationInsights/httpAuthService';
import {
  DEFAULT_WORKSPACE_INSIGHTS_FILTER_PROPERTIES,
  DEFAULT_WORKSPACE_INSIGHTS_FILTER_PROPERTIES_ODATA,
} from 'src/shared/DefaultWorkspaceInsightsFilterProperties';
import { getErrorMessage } from 'src/shared/ErrorHelper';
import { MyWorkspacesStore } from 'src/store/reducers/rootReducer';
import { AzureWorkspaceInsightsDto } from 'src/types/AzureWorkspace/AzureWorkspaceInsightsDto.types';
import { AzureWorkspaceInsightsSummaryDto } from 'src/types/AzureWorkspace/AzureWorkspaceInsightsSummaryDto.types';
import { FilterProperty } from 'src/types/AzureWorkspace/FilterProperty.types';
import { WorkspaceInsightRequestDto } from 'src/types/AzureWorkspace/WorkspaceInsightRequestDto.type';
import { WorkspacesForDeletionDto } from 'src/types/AzureWorkspace/WorkspacesForDeletionDto.types';
import { PageResult } from 'src/types/PageResult.types';
import { FilterOperator } from 'src/types/enums/FilterOperator';
import {
  FETCH_WORKSPACE_INSIGHTS_BEGIN,
  FETCH_WORKSPACE_INSIGHTS_SUCCESS,
  FETCH_WORKSPACE_INSIGHTS_FAILURE,
  FETCH_USER_WORKSPACE_INSIGHTS_BEGIN,
  FETCH_USER_WORKSPACE_INSIGHTS_SUCCESS,
  FETCH_USER_WORKSPACE_INSIGHTS_FAILURE,
  APPEND_WORKSPACE_INSIGHTS_BEGIN,
  APPEND_WORKSPACE_INSIGHTS_SUCCESS,
  APPEND_WORKSPACE_INSIGHTS_FAILURE,
  SET_WORKSPACE_INSIGHTS_SORT_PROPERTY,
  SET_WORKSPACE_INSIGHTS_FILTER_PROPERTIES,
  FETCH_WORKSPACE_INSIGHTS_SUMMARY_BEGIN,
  FETCH_WORKSPACE_INSIGHTS_SUMMARY_SUCCESS,
  FETCH_WORKSPACE_INSIGHTS_SUMMARY_FAILURE,
  FETCH_STALE_WORKSPACE_AUTODELETE_TOTAL_BEGIN,
  FETCH_STALE_WORKSPACE_AUTODELETE_TOTAL_SUCCESS,
  FETCH_STALE_WORKSPACE_AUTODELETE_TOTAL_FAILURE,
  SET_SELECTED_WORKSPACE_INSIGHTS,
  BULK_DELETE_AZURE_WORKSPACES_BEGIN,
  BULK_DELETE_AZURE_WORKSPACES_SUCCESS,
  BULK_DELETE_AZURE_WORKSPACES_FAILURE,
  APPEND_WORKSPACE_INSIGHTS_ODATA_SUCCESS,
  FETCH_USER_WORKSPACE_INSIGHTS_ODATA_SUCCESS,
  FETCH_WORKSPACE_INSIGHTS_ODATA_SUCCESS,
} from '../actionTypes';
import ErrorAction from '../errorAction';
import {
  showDefaultNotification,
  showSuccessNotification,
} from '../notificationActions';
import { SortProperty } from 'src/types/SortProperty.types';
import { ODataQueryParams } from 'src/types/OData/ODataQueryParams.types';
import { PageResultOData } from 'src/types/OData/PageResultOData.types';
import {
  buildODataQueryString,
  createFilterObjectArray,
} from 'src/shared/helpers/ODataHelper';
import { Filter, PlainObject } from 'odata-query';
import { convertResourceStateStringToEnums } from 'src/shared/helpers/WorkspaceHelper';

export const fetchWorkspaceInsightsBegin = createAction(
  FETCH_WORKSPACE_INSIGHTS_BEGIN
);

export const fetchWorkspaceInsightsSuccess = createAction<
  PageResult<AzureWorkspaceInsightsDto>
>(FETCH_WORKSPACE_INSIGHTS_SUCCESS);

export const fetchWorkspaceInsightsSuccessOData = createAction<
  PageResultOData<AzureWorkspaceInsightsDto>
>(FETCH_WORKSPACE_INSIGHTS_ODATA_SUCCESS);

export const fetchWorkspaceInsightsError = createAction<AxiosError>(
  FETCH_WORKSPACE_INSIGHTS_FAILURE
);

export const fetchWorkspaceInsights = (
  segmentIds: string[],
  filterProperties: FilterProperty[] = []
) => {
  return async (dispatch: Dispatch, getState: () => MyWorkspacesStore) => {
    const { tenantSegmentAdminWorkspaceActivity, config } = getState();
    dispatch(fetchWorkspaceInsightsBegin());
    try {
      if (config.featureFlags.ODataEndpoints) {
        const res = await fetchWorkspaceActivitiesOData(
          segmentIds,

          filterProperties.length !== 0
            ? createFilterObjectArray(filterProperties)
            : createFilterObjectArray(
                tenantSegmentAdminWorkspaceActivity.workspaceInsightsFilterProperties
              ).concat(DEFAULT_WORKSPACE_INSIGHTS_FILTER_PROPERTIES_ODATA),
          tenantSegmentAdminWorkspaceActivity.workspaceInsightsSortProperty
        );
        dispatch(fetchWorkspaceInsightsSuccessOData(res.data));
      } else {
        const res = await fetchWorkspaceActivities(
          segmentIds,
          filterProperties.length !== 0
            ? filterProperties
            : tenantSegmentAdminWorkspaceActivity.workspaceInsightsFilterProperties.concat(
                DEFAULT_WORKSPACE_INSIGHTS_FILTER_PROPERTIES
              ),
          tenantSegmentAdminWorkspaceActivity.workspaceInsightsSortProperty
        );
        dispatch(fetchWorkspaceInsightsSuccess(res.data));
      }
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(fetchWorkspaceInsightsError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve Segment Workspaces :\n${getErrorMessage(err)}`,
          true
        );
      }
    }
  };
};

export const fetchUserWorkspaceInsightsBegin = createAction(
  FETCH_USER_WORKSPACE_INSIGHTS_BEGIN
);

export const fetchUserWorkspaceInsightsSuccess = createAction<
  PageResult<AzureWorkspaceInsightsDto>
>(FETCH_USER_WORKSPACE_INSIGHTS_SUCCESS);

export const fetchUserWorkspaceInsightsSuccessOData = createAction<
  PageResultOData<AzureWorkspaceInsightsDto>
>(FETCH_USER_WORKSPACE_INSIGHTS_ODATA_SUCCESS);

export const fetchUserWorkspaceInsightsError = createAction<AxiosError>(
  FETCH_USER_WORKSPACE_INSIGHTS_FAILURE
);

export const fetchUserWorkspaceInsights = (
  segmentIds: string[],
  userId: string
) => {
  return async (dispatch: Dispatch, getState: () => MyWorkspacesStore) => {
    dispatch(fetchUserWorkspaceInsightsBegin());
    try {
      const { tenantSegmentAdminWorkspaceActivity, config } = getState();
      if (config.featureFlags.ODataEndpoints) {
        const ownerFilter: Filter = {
          'Resource/OwnerID': { eq: { type: 'guid', value: userId } },
        };
        const res = await fetchWorkspaceActivitiesOData(
          segmentIds,
          [ownerFilter],
          tenantSegmentAdminWorkspaceActivity.workspaceInsightsSortProperty
        );
        dispatch(fetchUserWorkspaceInsightsSuccessOData(res.data));
      } else {
        const filterProperties: FilterProperty[] = [
          {
            Name: 'OwnerID',
            Operator: FilterOperator.eq,
            Value: userId,
          },
        ];
        const res = await fetchWorkspaceActivities(
          segmentIds,
          filterProperties,
          tenantSegmentAdminWorkspaceActivity.workspaceInsightsSortProperty
        );
        dispatch(fetchUserWorkspaceInsightsSuccess(res.data));
      }
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(fetchUserWorkspaceInsightsError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve user workspaces :\n${getErrorMessage(err)}`,
          true
        );
      }
    }
  };
};

export const appendWorkspaceInsightsBegin = createAction(
  APPEND_WORKSPACE_INSIGHTS_BEGIN
);

export const appendWorkspaceInsightsSuccess = createAction<
  PageResult<AzureWorkspaceInsightsDto>
>(APPEND_WORKSPACE_INSIGHTS_SUCCESS);

export const appendWorkspaceInsightsSuccessOData = createAction<
  PageResultOData<AzureWorkspaceInsightsDto>
>(APPEND_WORKSPACE_INSIGHTS_ODATA_SUCCESS);

export const appendWorkspaceInsightsError = createAction<AxiosError>(
  APPEND_WORKSPACE_INSIGHTS_FAILURE
);

export const appendWorkspaceInsights = (segmentIds: string[]) => {
  return async (dispatch: Dispatch, getState: () => MyWorkspacesStore) => {
    dispatch(appendWorkspaceInsightsBegin());
    try {
      const { tenantSegmentAdminWorkspaceActivity, config } = getState();
      const {
        workspaceInsightsContinuationToken: continuationToken,
        workspaceInsightsNextLink,
      } = tenantSegmentAdminWorkspaceActivity;
      if (config.featureFlags.ODataEndpoints) {
        const res = await fetchWorkspaceActivitiesOData(
          segmentIds,
          createFilterObjectArray(
            tenantSegmentAdminWorkspaceActivity.workspaceInsightsFilterProperties
          ).concat(DEFAULT_WORKSPACE_INSIGHTS_FILTER_PROPERTIES_ODATA),
          tenantSegmentAdminWorkspaceActivity.workspaceInsightsSortProperty,
          workspaceInsightsNextLink
        );
        dispatch(appendWorkspaceInsightsSuccessOData(res.data));
      } else {
        const res = await fetchWorkspaceActivities(
          segmentIds,
          tenantSegmentAdminWorkspaceActivity.workspaceInsightsFilterProperties.concat(
            DEFAULT_WORKSPACE_INSIGHTS_FILTER_PROPERTIES
          ),
          tenantSegmentAdminWorkspaceActivity.workspaceInsightsSortProperty,
          continuationToken
        );
        dispatch(appendWorkspaceInsightsSuccess(res.data));
      }
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(appendWorkspaceInsightsError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve Segment Workspaces :\n${getErrorMessage(err)}`,
          true
        );
      }
    }
  };
};

export const setWorkspaceInsightSortProperty = createAction<
  keyof AzureWorkspaceInsightsDto
>(SET_WORKSPACE_INSIGHTS_SORT_PROPERTY);

export const setWorkspaceInsightFilterProperties = createAction<
  FilterProperty[]
>(SET_WORKSPACE_INSIGHTS_FILTER_PROPERTIES);

export const fetchWorkspaceInsightsSummaryBegin = createAction(
  FETCH_WORKSPACE_INSIGHTS_SUMMARY_BEGIN
);

export const fetchWorkspaceInsightsSummarySuccess =
  createAction<AzureWorkspaceInsightsSummaryDto>(
    FETCH_WORKSPACE_INSIGHTS_SUMMARY_SUCCESS
  );

export const fetchWorkspaceInsightsSummaryError = createAction<AxiosError>(
  FETCH_WORKSPACE_INSIGHTS_SUMMARY_FAILURE
);

export const fetchWorkspaceInsightsSummary = (segmentID: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchWorkspaceInsightsSummaryBegin());
    try {
      const res = await httpAuthService.get<AzureWorkspaceInsightsSummaryDto>(
        `insights/azureworkspace/summary?segmentIds=${segmentID}`
      );
      dispatch(
        fetchWorkspaceInsightsSummarySuccess(
          res.data as AzureWorkspaceInsightsSummaryDto
        )
      );
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(fetchWorkspaceInsightsSummaryError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve Segment summarize insight  :\n${getErrorMessage(
            err
          )}`,
          true
        );
      }
    }
  };
};

export const fetchStaleWorkspaceAutoDeleteTotalBegin = createAction(
  FETCH_STALE_WORKSPACE_AUTODELETE_TOTAL_BEGIN
);

export const fetchStaleWorkspaceAutoDeleteTotalSuccess = createAction<string>(
  FETCH_STALE_WORKSPACE_AUTODELETE_TOTAL_SUCCESS
);

export const fetchStaleWorkspaceAutoDeleteTotalError = createAction<AxiosError>(
  FETCH_STALE_WORKSPACE_AUTODELETE_TOTAL_FAILURE
);

export const fetchStaleWorkspaceAutoDeleteTotal = (segmentID: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchStaleWorkspaceAutoDeleteTotalBegin());
    try {
      const res = await httpAuthService.get<string>(
        `insights/azureworkspace/autodeletetotal?segmentIds=${segmentID}`
      );
      dispatch(fetchStaleWorkspaceAutoDeleteTotalSuccess(res.data as string));
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(fetchStaleWorkspaceAutoDeleteTotalError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve stale workspace autodelete total  :\n${getErrorMessage(
            err
          )}`,
          true
        );
      }
    }
  };
};

export const setSelectedWorkspaceInsights = createAction<
  AzureWorkspaceInsightsDto[]
>(SET_SELECTED_WORKSPACE_INSIGHTS);

export const bulkDeleteAzureWorkspacesBegin = createAction(
  BULK_DELETE_AZURE_WORKSPACES_BEGIN
);

export const bulkDeleteAzureWorkspacesSuccess = createAction(
  BULK_DELETE_AZURE_WORKSPACES_SUCCESS
);

export const bulkDeleteAzureWorkspacesFailure = createAction<AxiosError>(
  BULK_DELETE_AZURE_WORKSPACES_FAILURE
);

export const bulkDeleteAzureWorkspaces = (
  workspacesForDeletionDto: WorkspacesForDeletionDto
): ((dispatch: Dispatch) => Promise<AxiosResponse>) => {
  return async (dispatch: Dispatch) => {
    dispatch(bulkDeleteAzureWorkspacesBegin());
    dispatch(showDefaultNotification('Deletion in progress. Please wait.'));
    try {
      const url = 'insights/azureworkspace/bulk';
      const config = { data: workspacesForDeletionDto } as AxiosRequestConfig;
      return await httpAuthService.delete(url, config).then(
        (res) => {
          dispatch(bulkDeleteAzureWorkspacesSuccess());
          dispatch(showSuccessNotification('Deletion in progress.'));
          return res;
        },
        (err) => {
          dispatch(bulkDeleteAzureWorkspacesFailure(err));
          ErrorAction(
            dispatch,
            err,
            `Failed to initiate bulk deletion of workspaces:\n${err.response?.data}`,
            true,
            true
          );

          return err.response;
        }
      );
    } catch (err) {
      dispatch(bulkDeleteAzureWorkspacesFailure(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to initiate bulk deletion of workspaces:\n${err.response?.data}`,
        true,
        true
      );
      return err;
    }
  };
};

async function fetchWorkspaceActivities(
  segmentIds?: string[],
  workspaceInsightsFilterProperties?: FilterProperty[],
  workspaceInsightsSortProperty?: SortProperty<AzureWorkspaceInsightsDto>,
  continuationToken?: string
) {
  const request: WorkspaceInsightRequestDto = {
    SegmentIds: segmentIds,
    SortProperty: workspaceInsightsSortProperty,
    FilterProperties: workspaceInsightsFilterProperties,
  };
  const res = await httpAuthService.post<PageResult<AzureWorkspaceInsightsDto>>(
    `insights/azureworkspace${
      continuationToken
        ? `?continuationToken=${encodeURIComponent(continuationToken)}`
        : ''
    }`,
    request
  );
  return res;
}

async function fetchWorkspaceActivitiesOData(
  segmentIds?: string[],
  workspaceInsightsFilterProperties?: (string | PlainObject)[],
  workspaceInsightsSortProperty?: SortProperty<AzureWorkspaceInsightsDto>,
  nextLinkParams?: Partial<ODataQueryParams<AzureWorkspaceInsightsDto>>
) {
  const route = 'insights/v2/azureworkspace?$batch';
  const segmentFilter: Filter = {
    or: segmentIds.map((segmentId) => ({
      'Resource/SegmentId': { eq: { value: segmentId, type: 'guid' } },
    })),
  };
  const filter = segmentIds
    ? [segmentFilter, ...workspaceInsightsFilterProperties]
    : workspaceInsightsFilterProperties;
  const query = buildODataQueryString<AzureWorkspaceInsightsDto>(
    'azureworkspace',
    {
      filter,
      orderBy: [workspaceInsightsSortProperty],
      ...nextLinkParams,
    }
  );
  const res = await httpAuthService.post<
    PageResultOData<AzureWorkspaceInsightsDto>
  >(route, query, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  res.data.value.forEach((insight) => {
    // Temporary scaffolding to convert string to enum, as the backend requires a string, but backend provides int enum
    insight.State = convertResourceStateStringToEnums(
      insight.State as unknown as string
    );
    insight.WorkspaceDeletionStatus = convertResourceStateStringToEnums(
      insight.WorkspaceDeletionStatus as unknown as string
    );
  });
  return res;
}
