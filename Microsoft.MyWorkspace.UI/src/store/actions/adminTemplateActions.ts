import { Action, Dispatch } from 'redux';
import { AxiosError } from 'axios';

import ErrorAction from './errorAction';
import { httpAuthService } from '../../applicationInsights/httpAuthService';
import { WorkspaceTemplateDto } from 'src/types/Catalog/WorkspaceTemplateDto.types';
import {
  FETCH_TEMPLATES_BEGIN,
  FETCH_TEMPLATES_SUCCESS,
  FETCH_TEMPLATES_FAILURE,
  CREATE_TEMPLATE_BEGIN,
  CREATE_TEMPLATE_SUCCESS,
  CREATE_TEMPLATE_FAILURE,
  UPDATE_TEMPLATE_BEGIN,
  UPDATE_TEMPLATE_SUCCESS,
  UPDATE_TEMPLATE_FAILURE,
  DELETE_TEMPLATE_BEGIN,
  DELETE_TEMPLATE_SUCCESS,
  DELETE_TEMPLATE_FAILURE,
  FETCH_INITIAL_AUTHOR_TEMPLATES_SUCCESS,
  FETCH_INITIAL_AUTHOR_TEMPLATES_BEGIN,
  FETCH_INITIAL_AUTHOR_TEMPLATES_FAILURE,
  FETCH_NEXT_AUTHOR_TEMPLATES_BEGIN,
  FETCH_NEXT_AUTHOR_TEMPLATES_FAILURE,
  FETCH_NEXT_AUTHOR_TEMPLATES_SUCCESS,
  REFRESH_AUTHOR_TEMPLATES_BEGIN,
  REFRESH_AUTHOR_TEMPLATES_FAILURE,
  REFRESH_AUTHOR_TEMPLATES_SUCCESS,
  SET_TEMPLATE_REQUESTS,
  SET_TEMPLATE_REQUESTS_FILTER_PROPERTIES,
  FETCH_INITIAL_AUTHOR_TEMPLATES_ODATA_SUCCESS,
  FETCH_NEXT_AUTHOR_TEMPLATES_ODATA_SUCCESS,
  REFRESH_AUTHOR_TEMPLATES_ODATA_SUCCESS,
} from './actionTypes';
import { CreateWorkspaceTemplateDto } from 'src/types/Catalog/CreateWorkspaceTemplateDto.types';
import { PageResult } from 'src/types/PageResult.types';
import { MyWorkspacesStore } from '../reducers/rootReducer';
import { AxiosErrorWithId } from 'src/types/AxiosErrorWithId';
import { createAction } from '@reduxjs/toolkit';
import { FilterProperty } from 'src/types/AzureWorkspace/FilterProperty.types';
import { showSuccessNotification } from './notificationActions';
import {
  buildODataQueryString,
  createFilterObjectArray,
  parseNextLink,
} from 'src/shared/helpers/ODataHelper';
import isEqual from 'lodash/isEqual';
import { getFilterPropertiesQuery } from 'src/shared/helpers/FilterPropertiesHelper';
import { ODataQueryParams } from 'src/types/OData/ODataQueryParams.types';
import { PageResultOData } from 'src/types/OData/PageResultOData.types';
import { SortProperty } from 'src/types/SortProperty.types';

const baseRoute = 'catalog/templates';

export interface AdminTemplateAction extends Action {
  payload?:
    | PageResult<WorkspaceTemplateDto>
    | PageResultOData<WorkspaceTemplateDto>
    | WorkspaceTemplateDto
    | WorkspaceTemplateDto[]
    | AxiosError
    | AxiosErrorWithId
    | FilterProperty[]
    | SortProperty<WorkspaceTemplateDto>
    | string;
}

export const fetchTemplatesBegin = () => ({
  type: FETCH_TEMPLATES_BEGIN,
});

export const fetchTemplatesSuccess = (payload: WorkspaceTemplateDto[]) => ({
  type: FETCH_TEMPLATES_SUCCESS,
  payload,
});

export const fetchTemplatesError = (error: AxiosError) => ({
  type: FETCH_TEMPLATES_FAILURE,
  payload: error,
});

export const fetchTemplates = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchTemplatesBegin());
    try {
      const res = await httpAuthService.get(`${baseRoute}/v2`);
      dispatch(fetchTemplatesSuccess(res.data as WorkspaceTemplateDto[]));
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        dispatch(fetchTemplatesError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve templates :\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const fetchInitialAuthorTemplatesBegin = () => ({
  type: FETCH_INITIAL_AUTHOR_TEMPLATES_BEGIN,
});

export const fetchInitialAuthorTemplatesSuccess = (
  payload: PageResult<WorkspaceTemplateDto>
) => ({
  type: FETCH_INITIAL_AUTHOR_TEMPLATES_SUCCESS,
  payload,
});

export const fetchInitialAuthorTemplatesODataSuccess = (
  payload: PageResultOData<WorkspaceTemplateDto>
) => ({
  type: FETCH_INITIAL_AUTHOR_TEMPLATES_ODATA_SUCCESS,
  payload,
});

export const fetchInitialAuthorTemplatesError = (error: AxiosError) => ({
  type: FETCH_INITIAL_AUTHOR_TEMPLATES_FAILURE,
  payload: error,
});

export const fetchInitialAuthorTemplates = (
  segmentId: string,
  filterProperties?: FilterProperty[]
) => {
  return async (dispatch: Dispatch, getState: () => MyWorkspacesStore) => {
    dispatch(fetchInitialAuthorTemplatesBegin());
    try {
      const { config } = getState();
      const { featureFlags } = config;
      // Temporary feature flag to OData endpoint. Will remove once OData is fully integrated.
      if (featureFlags.ODataEndpoints) {
        const res = await fetchAuthorTemplatesOData(
          filterProperties,
          segmentId
        );
        dispatch(
          fetchInitialAuthorTemplatesODataSuccess(
            res.data as PageResultOData<WorkspaceTemplateDto>
          )
        );
      } else {
        const res = await fetchAuthorTemplates(segmentId, filterProperties);
        dispatch(
          fetchInitialAuthorTemplatesSuccess(
            res.data as PageResult<WorkspaceTemplateDto>
          )
        );
      }
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        dispatch(fetchInitialAuthorTemplatesError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve templates :\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const fetchNextAuthorTemplatesBegin = () => ({
  type: FETCH_NEXT_AUTHOR_TEMPLATES_BEGIN,
});

export const fetchNextAuthorTemplatesSuccess = (
  payload: PageResult<WorkspaceTemplateDto>
) => ({
  type: FETCH_NEXT_AUTHOR_TEMPLATES_SUCCESS,
  payload,
});

export const fetchNextAuthorTemplatesODataSuccess = (
  payload: PageResultOData<WorkspaceTemplateDto>
) => ({
  type: FETCH_NEXT_AUTHOR_TEMPLATES_ODATA_SUCCESS,
  payload,
});

export const fetchNextAuthorTemplatesError = (error: AxiosError) => ({
  type: FETCH_NEXT_AUTHOR_TEMPLATES_FAILURE,
  payload: error,
});

export const fetchNextAuthorTemplates = (
  segmentId: string,
  filterProperties?: FilterProperty[]
) => {
  return async (dispatch: Dispatch, getState: () => MyWorkspacesStore) => {
    dispatch(fetchNextAuthorTemplatesBegin());
    try {
      const { adminTemplate, config } = getState();
      const {
        templateRequestsNextLink,
        templateRequestsContinuation: continuationToken,
      } = adminTemplate;
      const { featureFlags } = config;
      // Temporary feature flag to OData endpoint. Will remove once OData is fully integrated.
      if (featureFlags.ODataEndpoints) {
        const res = await fetchAuthorTemplatesOData(
          filterProperties,
          segmentId,
          templateRequestsNextLink
        );
        dispatch(
          fetchNextAuthorTemplatesODataSuccess(
            res.data as PageResultOData<WorkspaceTemplateDto>
          )
        );
      } else {
        const res = await fetchAuthorTemplates(
          segmentId,
          filterProperties,
          continuationToken
        );
        dispatch(
          fetchNextAuthorTemplatesSuccess(
            res.data as PageResult<WorkspaceTemplateDto>
          )
        );
      }
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        dispatch(fetchNextAuthorTemplatesError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve templates :\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const refreshAuthorTemplatesBegin = () => ({
  type: REFRESH_AUTHOR_TEMPLATES_BEGIN,
});

export const refreshAuthorTemplatesSuccess = (
  payload: PageResult<WorkspaceTemplateDto>
) => ({
  type: REFRESH_AUTHOR_TEMPLATES_SUCCESS,
  payload,
});

export const refreshAuthorTemplatesSuccessOData = (
  payload: PageResultOData<WorkspaceTemplateDto>
) => ({
  type: REFRESH_AUTHOR_TEMPLATES_ODATA_SUCCESS,
  payload,
});

export const refreshAuthorTemplatesError = (error: AxiosError) => ({
  type: REFRESH_AUTHOR_TEMPLATES_FAILURE,
  payload: error,
});

export const refreshAuthorTemplates = (
  segmentId: string,
  filterProperties?: FilterProperty[]
): ((
  dispatch: Dispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    dispatch(refreshAuthorTemplatesBegin());
    try {
      const { adminTemplate, config } = getState();
      const { templateRequestsNextLink, templateRequestsContinuation } =
        adminTemplate;
      const { featureFlags } = config;
      const templates: WorkspaceTemplateDto[] = [];
      // Temporary feature flag to OData endpoint. Will remove once OData is fully integrated.
      if (featureFlags.ODataEndpoints) {
        const initialRes = await fetchAuthorTemplatesOData(
          filterProperties,
          segmentId
        );
        templates.push(...initialRes.data.value);
        let currentResponse = initialRes.data;
        let currentNextLink = parseNextLink(initialRes.data);
        while (!isEqual(templateRequestsNextLink, currentNextLink)) {
          const res = await fetchAuthorTemplatesOData(
            filterProperties,
            segmentId,
            currentNextLink
          );
          templates.push(...res.data.value);
          currentResponse = res.data;
          currentNextLink = parseNextLink(res.data);
        }

        dispatch(
          refreshAuthorTemplatesSuccessOData({
            ...currentResponse,
            value: templates,
          })
        );
      } else {
        const initialRes = await fetchAuthorTemplates(
          segmentId,
          filterProperties
        );
        templates.push(...initialRes.data.ResultSet);
        let nextToken = initialRes.data.ContinuationToken;
        while (templateRequestsContinuation !== nextToken) {
          const res = await fetchAuthorTemplates(
            segmentId,
            filterProperties,
            nextToken
          );
          templates.push(...res.data.ResultSet);
          nextToken = res.data.ContinuationToken;
        }

        dispatch(
          refreshAuthorTemplatesSuccess({
            ResultSet: templates,
            ContinuationToken: nextToken,
          })
        );
      }
    } catch (e) {
      dispatch(refreshAuthorTemplatesError(e));
      ErrorAction(
        dispatch,
        e,
        `Failed to refresh templates:\n${e.response?.data}`,
        true
      );
    }
  };
};

export const createTemplateBegin = () => ({
  type: CREATE_TEMPLATE_BEGIN,
});

export const createTemplateSuccess = (payload: WorkspaceTemplateDto) => ({
  type: CREATE_TEMPLATE_SUCCESS,
  payload,
});

export const createTemplateError = (error: AxiosError) => ({
  type: CREATE_TEMPLATE_FAILURE,
  payload: error,
});

export const createTemplate = (template: CreateWorkspaceTemplateDto) => {
  return async (dispatch: Dispatch) => {
    dispatch(createTemplateBegin());
    try {
      const res = await httpAuthService.post(baseRoute, template);
      dispatch(createTemplateSuccess(res.data as WorkspaceTemplateDto));
      dispatch(
        showSuccessNotification(
          'The template request was successfully submitted.'
        )
      );
      return res;
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        dispatch(createTemplateError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to create template :\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const updateTemplateBegin = (id: string) => ({
  type: UPDATE_TEMPLATE_BEGIN,
  payload: id,
});

export const updateTemplateSuccess = (payload: WorkspaceTemplateDto) => ({
  type: UPDATE_TEMPLATE_SUCCESS,
  payload,
});

export const updateTemplateError = (error: AxiosErrorWithId) => ({
  type: UPDATE_TEMPLATE_FAILURE,
  payload: error,
});

export const updateTemplate = (template: WorkspaceTemplateDto) => {
  return async (dispatch: Dispatch) => {
    dispatch(updateTemplateBegin(template.ID));
    try {
      const res = await httpAuthService.put(baseRoute, template);
      dispatch(updateTemplateSuccess(res.data as WorkspaceTemplateDto));
      dispatch(
        showSuccessNotification(
          'The template request was successfully updated.'
        )
      );
      return res;
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        dispatch(updateTemplateError({ error: err, id: template.ID }));
        ErrorAction(
          dispatch,
          err,
          `Failed to update template :\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const deleteTemplateBegin = () => ({
  type: DELETE_TEMPLATE_BEGIN,
});

export const deleteTemplateSuccess = () => ({
  type: DELETE_TEMPLATE_SUCCESS,
});

export const deleteTemplateError = (error: AxiosError) => ({
  type: DELETE_TEMPLATE_FAILURE,
  payload: error,
});

export const deleteTemplate = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(deleteTemplateBegin());
    try {
      const res = await httpAuthService.delete(`${baseRoute}/${id}`);
      dispatch(
        showSuccessNotification(
          'The template request was successfully deleted.'
        )
      );
      dispatch(deleteTemplateSuccess());
      return res;
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        dispatch(deleteTemplateError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to delete template :\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const setTemplateRequests = createAction<WorkspaceTemplateDto[]>(
  SET_TEMPLATE_REQUESTS
);

export const setTemplateFilterProperties = createAction<FilterProperty[]>(
  SET_TEMPLATE_REQUESTS_FILTER_PROPERTIES
);

async function fetchAuthorTemplates(
  segmentId: string,
  filterProperties: FilterProperty[] = [],
  continuationToken?: string
) {
  const filterQuery = getFilterPropertiesQuery(filterProperties);
  const res = await httpAuthService.get(
    `${baseRoute}/v2/segment?segmentId=${segmentId}${
      continuationToken
        ? `&continuationToken=${encodeURIComponent(continuationToken)}`
        : ''
    }
          ${filterQuery ? `&${filterQuery}` : ''}`
  );
  return res;
}

async function fetchAuthorTemplatesOData(
  filterProperties: FilterProperty[],
  segmentId: string,
  nextLinkParams?: Partial<ODataQueryParams<WorkspaceTemplateDto>>
) {
  const route = `${baseRoute}/v2/odata/segment?$batch`;
  const filter = createFilterObjectArray(filterProperties);
  const query = buildODataQueryString<WorkspaceTemplateDto>('templates', {
    filter,
    additionalQueryParams: { segmentId },
    ...nextLinkParams,
  });
  const res = await httpAuthService.post<PageResultOData<WorkspaceTemplateDto>>(
    route,
    query.toString(),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return res;
}
