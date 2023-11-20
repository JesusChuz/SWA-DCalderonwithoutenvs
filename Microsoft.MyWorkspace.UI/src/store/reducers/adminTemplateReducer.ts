import { AxiosError } from 'axios';
import {
  AddStaleDocuments,
  UpdateStaleDocuments,
} from '../../shared/helpers/StaleDocumentsHelper';
import { AxiosErrorWithId } from 'src/types/AxiosErrorWithId';
import { WorkspaceTemplateDto } from 'src/types/Catalog/WorkspaceTemplateDto.types';
import { PageResult } from 'src/types/PageResult.types';
import {
  CREATE_TEMPLATE_BEGIN,
  CREATE_TEMPLATE_FAILURE,
  CREATE_TEMPLATE_SUCCESS,
  FETCH_TEMPLATES_SUCCESS,
  FETCH_TEMPLATES_BEGIN,
  FETCH_TEMPLATES_FAILURE,
  FETCH_INITIAL_AUTHOR_TEMPLATES_BEGIN,
  FETCH_INITIAL_AUTHOR_TEMPLATES_SUCCESS,
  FETCH_INITIAL_AUTHOR_TEMPLATES_FAILURE,
  UPDATE_TEMPLATE_BEGIN,
  UPDATE_TEMPLATE_FAILURE,
  UPDATE_TEMPLATE_SUCCESS,
  FETCH_NEXT_AUTHOR_TEMPLATES_BEGIN,
  FETCH_NEXT_AUTHOR_TEMPLATES_FAILURE,
  FETCH_NEXT_AUTHOR_TEMPLATES_SUCCESS,
  REFRESH_AUTHOR_TEMPLATES_BEGIN,
  REFRESH_AUTHOR_TEMPLATES_FAILURE,
  REFRESH_AUTHOR_TEMPLATES_SUCCESS,
  SET_TEMPLATE_REQUESTS,
  SET_TEMPLATE_REQUESTS_FILTER_PROPERTIES,
  FETCH_INITIAL_AUTHOR_TEMPLATES_ODATA_SUCCESS,
  REFRESH_AUTHOR_TEMPLATES_ODATA_SUCCESS,
  FETCH_NEXT_AUTHOR_TEMPLATES_ODATA_SUCCESS,
  SET_TEMPLATE_REQUESTS_SORT_PROPERTY,
} from '../actions/actionTypes';
import { AdminTemplateAction } from '../actions/adminTemplateActions';
import { FilterProperty } from 'src/types/AzureWorkspace/FilterProperty.types';
import { PageResultOData } from 'src/types/OData/PageResultOData.types';
import { parseNextLink } from 'src/shared/helpers/ODataHelper';
import { ODataQueryParams } from 'src/types/OData/ODataQueryParams.types';
import { SortProperty } from 'src/types/SortProperty.types';

export interface ReduxAdminTemplateState {
  templates: WorkspaceTemplateDto[];
  filters: FilterProperty[];
  staleTemplates: Set<string>;
  templatesLoading: boolean;
  templateRequestsRefreshing: boolean;
  templatesError: AxiosError;
  templateRequests: WorkspaceTemplateDto[];
  templateRequestsLoading: boolean;
  templateRequestsError: AxiosError;
  templateRequestsContinuation: string; // Will remove once OData is implemented
  templateRequestsNextLink: Partial<ODataQueryParams<WorkspaceTemplateDto>>;
  templateRequestsSortProperty: SortProperty<WorkspaceTemplateDto>;
  createTemplateLoading: boolean;
  createTemplateError: AxiosError;
  updateTemplateLoading: boolean;
  updateTemplateError: AxiosError;
  deleteTemplateLoading: boolean;
  deleteTemplateError: AxiosError;
}

export const initialAdminTemplateState: ReduxAdminTemplateState = {
  templates: [],
  filters: [],
  staleTemplates: new Set(),
  templatesLoading: false,
  templateRequestsRefreshing: false,
  templatesError: null,
  templateRequests: [],
  templateRequestsLoading: false,
  templateRequestsError: null,
  templateRequestsContinuation: null,
  templateRequestsNextLink: null,
  templateRequestsSortProperty: { Name: 'CreatedDate', IsDescending: true },
  createTemplateLoading: false,
  createTemplateError: null,
  updateTemplateLoading: false,
  updateTemplateError: null,
  deleteTemplateLoading: false,
  deleteTemplateError: null,
};

export default function adminTemplateReducer(
  state: ReduxAdminTemplateState = initialAdminTemplateState,
  action: AdminTemplateAction
): ReduxAdminTemplateState {
  switch (action.type) {
    case FETCH_TEMPLATES_BEGIN:
      return {
        ...state,
        templatesLoading: true,
        templatesError: null,
      };
    case FETCH_TEMPLATES_SUCCESS: {
      return {
        ...state,
        templates: action.payload as WorkspaceTemplateDto[],
        templatesLoading: false,
        templatesError: null,
      };
    }
    case FETCH_TEMPLATES_FAILURE:
      return {
        ...state,
        templatesLoading: false,
        templatesError: action.payload as AxiosError,
      };
    case REFRESH_AUTHOR_TEMPLATES_BEGIN:
      return {
        ...state,
        templateRequestsLoading: true,
        templateRequestsRefreshing: true,
        templateRequestsError: action.payload as AxiosError,
      };
    case FETCH_INITIAL_AUTHOR_TEMPLATES_BEGIN:
    case FETCH_NEXT_AUTHOR_TEMPLATES_BEGIN:
      return {
        ...state,
        templateRequestsLoading: true,
        templateRequestsError: action.payload as AxiosError,
      };
    case REFRESH_AUTHOR_TEMPLATES_SUCCESS:
    case FETCH_INITIAL_AUTHOR_TEMPLATES_SUCCESS: {
      const res = action.payload as PageResult<WorkspaceTemplateDto>;
      const staleTemplates = UpdateStaleDocuments(
        state.staleTemplates,
        res.ResultSet.map((w) => w.ID)
      );
      return {
        ...state,
        templateRequests: res.ResultSet,
        templateRequestsLoading: false,
        templateRequestsRefreshing: false,
        templateRequestsError: null,
        templateRequestsContinuation: res.ContinuationToken,
        staleTemplates,
      };
    }
    case REFRESH_AUTHOR_TEMPLATES_ODATA_SUCCESS:
    case FETCH_INITIAL_AUTHOR_TEMPLATES_ODATA_SUCCESS: {
      const res = action.payload as PageResultOData<WorkspaceTemplateDto>;
      const staleTemplates = UpdateStaleDocuments(
        state.staleTemplates,
        res.value.map((w) => w.ID)
      );
      return {
        ...state,
        templateRequests: res.value,
        templateRequestsLoading: false,
        templateRequestsRefreshing: false,
        templateRequestsError: null,
        templateRequestsNextLink: parseNextLink(res),
        staleTemplates,
      };
    }
    case FETCH_NEXT_AUTHOR_TEMPLATES_SUCCESS: {
      const res = action.payload as PageResult<WorkspaceTemplateDto>;
      const staleTemplates = UpdateStaleDocuments(
        state.staleTemplates,
        res.ResultSet.map((w) => w.ID)
      );
      return {
        ...state,
        templateRequests: [...state.templateRequests, ...res.ResultSet],
        templateRequestsLoading: false,
        templateRequestsError: null,
        templateRequestsContinuation: res.ContinuationToken,
        staleTemplates,
      };
    }
    case FETCH_NEXT_AUTHOR_TEMPLATES_ODATA_SUCCESS: {
      const res = action.payload as PageResultOData<WorkspaceTemplateDto>;
      const staleTemplates = UpdateStaleDocuments(
        state.staleTemplates,
        res.value.map((w) => w.ID)
      );
      return {
        ...state,
        templateRequests: [...state.templateRequests, ...res.value],
        templateRequestsLoading: false,
        templateRequestsError: null,
        templateRequestsNextLink: parseNextLink(res),
        staleTemplates,
      };
    }
    case REFRESH_AUTHOR_TEMPLATES_FAILURE:
    case FETCH_INITIAL_AUTHOR_TEMPLATES_FAILURE:
    case FETCH_NEXT_AUTHOR_TEMPLATES_FAILURE: {
      return {
        ...state,
        templateRequestsRefreshing: false,
        templateRequestsLoading: false,
        templateRequestsError: action.payload as AxiosError,
      };
    }
    case CREATE_TEMPLATE_BEGIN:
      return {
        ...state,
        createTemplateLoading: true,
        createTemplateError: null,
      };
    case CREATE_TEMPLATE_SUCCESS: {
      return {
        ...state,
        createTemplateLoading: false,
        createTemplateError: null,
      };
    }
    case CREATE_TEMPLATE_FAILURE:
      return {
        ...state,
        createTemplateLoading: false,
        createTemplateError: action.payload as AxiosError,
      };
    case UPDATE_TEMPLATE_BEGIN: {
      const staleTemplates = AddStaleDocuments(
        state.staleTemplates,
        action.payload as string
      );
      return {
        ...state,
        updateTemplateLoading: true,
        updateTemplateError: null,
        staleTemplates,
      };
    }
    case UPDATE_TEMPLATE_SUCCESS: {
      return {
        ...state,
        updateTemplateLoading: false,
        updateTemplateError: null,
      };
    }
    case UPDATE_TEMPLATE_FAILURE: {
      const error = action.payload as AxiosErrorWithId;
      const staleTemplates = UpdateStaleDocuments(state.staleTemplates, [
        error.id,
      ]);
      return {
        ...state,
        updateTemplateLoading: false,
        updateTemplateError: error.error,
        staleTemplates,
      };
    }
    case SET_TEMPLATE_REQUESTS: {
      return {
        ...state,
        templateRequests: action.payload as WorkspaceTemplateDto[],
      };
    }
    case SET_TEMPLATE_REQUESTS_FILTER_PROPERTIES: {
      return {
        ...state,
        filters: action.payload as FilterProperty[],
      };
    }
    case SET_TEMPLATE_REQUESTS_SORT_PROPERTY: {
      return {
        ...state,
        templateRequestsSortProperty:
          action.payload as SortProperty<WorkspaceTemplateDto>,
      };
    }
    default:
      return state;
  }
}
