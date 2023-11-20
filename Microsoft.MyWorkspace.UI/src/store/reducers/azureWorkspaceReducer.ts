import {
  FETCH_AZURE_WORKSPACES_BEGIN,
  FETCH_AZURE_WORKSPACES_SUCCESS,
  FETCH_AZURE_WORKSPACES_FAILURE,
  CREATE_AZURE_WORKSPACE_BEGIN,
  CREATE_AZURE_WORKSPACE_SUCCESS,
  CREATE_AZURE_WORKSPACE_FAILURE,
  DELETE_AZURE_WORKSPACE_BEGIN,
  DELETE_AZURE_WORKSPACE_SUCCESS,
  DELETE_AZURE_WORKSPACE_FAILURE,
  UPDATE_AZURE_WORKSPACE_BEGIN,
  UPDATE_AZURE_WORKSPACE_SUCCESS,
  UPDATE_AZURE_WORKSPACE_FAILURE,
  SEARCH_AZURE_WORKSPACE_BEGIN,
  SEARCH_AZURE_WORKSPACE_SUCCESS,
  SEARCH_AZURE_WORKSPACE_FAILURE,
  CLEAR_AZURE_WORKSPACE_SEARCH,
  SET_SELECTED_ADMIN_WORKSPACE,
  START_STOP_WORKSPACE_BEGIN,
  START_STOP_WORKSPACE_FAILURE,
  START_STOP_WORKSPACE_SUCCESS,
  START_STOP_MACHINE_BEGIN,
  START_STOP_MACHINE_FAILURE,
  START_STOP_MACHINE_SUCCESS,
  SAVE_PUBLIC_ADDRESS_CHANGES_BEGIN,
  SAVE_PUBLIC_ADDRESS_CHANGES_SUCCESS,
  SAVE_PUBLIC_ADDRESS_CHANGES_FAILURE,
  FETCH_PROVISIONING_API_VERSION_BEGIN,
  FETCH_PROVISIONING_API_VERSION_FAILURE,
  FETCH_PROVISIONING_API_VERSION_SUCCESS,
  CREATE_DNS_ZONE_BEGIN,
  CREATE_DNS_ZONE_SUCCESS,
  CREATE_DNS_ZONE_FAILURE,
  UPDATE_DNS_ZONE_BEGIN,
  UPDATE_DNS_ZONE_FAILURE,
  UPDATE_DNS_ZONE_SUCCESS,
  FETCH_ADMIN_AZURE_WORKSPACE_SUCCESS,
  FETCH_ADMIN_AZURE_WORKSPACE_BEGIN,
  FETCH_ADMIN_AZURE_WORKSPACE_FAILURE,
  FETCH_ADMIN_WORKSPACE_TASKS_FAILURE,
  FETCH_ADMIN_WORKSPACE_TASKS_BEGIN,
  FETCH_ADMIN_WORKSPACE_TASKS_SUCCESS,
  EXTEND_AZURE_WORKSPACE_RUNTIME_BEGIN,
  EXTEND_AZURE_WORKSPACE_RUNTIME_FAILURE,
  EXTEND_AZURE_WORKSPACE_RUNTIME_SUCCESS,
  ADMIN_RETRY_TASK_BEGIN,
  ADMIN_RETRY_TASK_SUCCESS,
  ADMIN_RETRY_TASK_FAILURE,
  RESET_PASSWORD_BEGIN,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  ENABLE_PRIVATE_MODE_BEGIN,
  ENABLE_PRIVATE_MODE_FAILURE,
  ENABLE_PRIVATE_MODE_SUCCESS,
  FETCH_PATCHING_DETAILS_BEGIN,
  FETCH_PATCHING_DETAILS_FAILURE,
  FETCH_PATCHING_DETAILS_SUCCESS,
  FETCH_PATCHING_SUMMARY_BEGIN,
  FETCH_PATCHING_SUMMARY_FAILURE,
  FETCH_PATCHING_SUMMARY_SUCCESS,
  FETCH_ALL_WORKSPACES_PATCHING_SUMMARY_BEGIN,
  FETCH_ALL_WORKSPACES_PATCHING_SUMMARY_FAILURE,
  FETCH_ALL_WORKSPACES_PATCHING_SUMMARY_SUCCESS,
} from '../actions/actionTypes';
import { AxiosError } from 'axios';
import { AzureWorkspaceDto } from '../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { WorkspaceAction } from '../actions/azureWorkspaceActions';
import { VMPatchSummary } from '../../types/AzureWorkspace/VMPatchSummaryDto.types';
import { VMPatchDetails } from '../../types/AzureWorkspace/VMPatchDetailsDto.types';
export interface ReduxAzureWorkspacesState {
  azureWorkspaces: AzureWorkspaceDto[];
  isAzureWorkspacesLoading: boolean;
  isAzureWorkspacesSaving?: boolean;
  loadedWorkspacesFirstTime: boolean;
  isDeletePending: boolean;
  pendingSaveID: string;
  pendingAddressChangeID: string;
  pendingDNSChangeID: string;
  fetchAzureWorkspacesError: AxiosError;
  deleteWorkspaceError: AxiosError;
  createWorkspaceError: AxiosError;
  updateWorkspaceError: AxiosError;
  azureWorkspaceSearch: AzureWorkspaceDto[];
  azureWorkspaceSearchLoading: boolean;
  azureWorkspaceSearchError: AxiosError;
  selectedAdminWorkspaces: AzureWorkspaceDto[];
  isAdminWorkspaceRefreshing: boolean;
  adminWorkspaceRefreshError: AxiosError;
  selectedAdminWorkspaceTasks: Record<string, unknown>[];
  selectedAdminWorkspaceTasksLoading: boolean;
  selectedAdminWorkspaceTasksError: AxiosError;
  adminRetryTaskLoading: boolean;
  adminRetryTaskError: AxiosError;
  extendWorkspaceRuntimeRequestPending: boolean;
  extendWorkspaceRuntimeRefreshPending: boolean;
  extendWorkspaceRuntimeRequestError: AxiosError;
  passwordResetPending: boolean;
  passwordResetError: AxiosError;
  privateModePending: boolean;
  privateModeRefreshPending: boolean;
  privateModeError: AxiosError;
  apiVersion: string;
  apiVersionError: AxiosError | string;
  workspacePatchingSummary: VMPatchSummary[];
  workspacePatchingDetails: VMPatchDetails[];
  allWorkspacesPatchingSummary: VMPatchSummary[];
  workspacePatchingSummaryLoading: boolean;
  workspacePatchingDetailsLoading: boolean;
  allWorkspacesPatchingSummaryLoading: boolean;
  workspacePatchingSummaryError: AxiosError;
  workspacePatchingDetailsError: AxiosError;
  allWorkspacesPatchingSummaryError: AxiosError;
}

export const workspacesInitialState: ReduxAzureWorkspacesState = {
  azureWorkspaces: [],
  isAzureWorkspacesLoading: false,
  loadedWorkspacesFirstTime: false,
  isDeletePending: false,
  pendingSaveID: '',
  pendingAddressChangeID: '',
  pendingDNSChangeID: '',
  isAzureWorkspacesSaving: false,
  fetchAzureWorkspacesError: null,
  deleteWorkspaceError: null,
  createWorkspaceError: null,
  updateWorkspaceError: null,
  azureWorkspaceSearch: null,
  azureWorkspaceSearchLoading: false,
  azureWorkspaceSearchError: null,
  selectedAdminWorkspaces: [],
  isAdminWorkspaceRefreshing: false,
  adminWorkspaceRefreshError: null,
  selectedAdminWorkspaceTasks: [],
  selectedAdminWorkspaceTasksLoading: false,
  selectedAdminWorkspaceTasksError: null,
  adminRetryTaskLoading: false,
  adminRetryTaskError: null,
  extendWorkspaceRuntimeRequestPending: false,
  extendWorkspaceRuntimeRequestError: null,
  extendWorkspaceRuntimeRefreshPending: false,
  passwordResetPending: false,
  passwordResetError: null,
  privateModePending: false,
  privateModeRefreshPending: false,
  privateModeError: null,
  apiVersion: 'unavailable',
  apiVersionError: null,
  workspacePatchingSummary: [],
  workspacePatchingDetails: [],
  allWorkspacesPatchingSummary: [],
  workspacePatchingSummaryError: null,
  workspacePatchingDetailsError: null,
  allWorkspacesPatchingSummaryError: null,
  workspacePatchingSummaryLoading: false,
  workspacePatchingDetailsLoading: false,
  allWorkspacesPatchingSummaryLoading: false,
};

export default function azureWorkspacesReducer(
  state: ReduxAzureWorkspacesState = workspacesInitialState,
  action: WorkspaceAction
): ReduxAzureWorkspacesState {
  switch (action.type) {
    case FETCH_AZURE_WORKSPACES_BEGIN:
      return {
        ...state,
        loadedWorkspacesFirstTime:
          state.loadedWorkspacesFirstTime && !(action.payload as boolean),
        isAzureWorkspacesLoading: true,
        fetchAzureWorkspacesError: null,
      };
    case FETCH_AZURE_WORKSPACES_SUCCESS:
      return {
        ...state,
        azureWorkspaces: action.payload as AzureWorkspaceDto[],
        isAzureWorkspacesLoading: false,
        loadedWorkspacesFirstTime: true,
        extendWorkspaceRuntimeRefreshPending: false,
        privateModeRefreshPending: false,
      };
    case FETCH_AZURE_WORKSPACES_FAILURE:
      return {
        ...state,
        isAzureWorkspacesLoading: false,
        fetchAzureWorkspacesError: action.payload as AxiosError,
        loadedWorkspacesFirstTime: true,
        extendWorkspaceRuntimeRefreshPending: false,
        privateModeRefreshPending: false,
      };
    case CREATE_AZURE_WORKSPACE_BEGIN:
      return {
        ...state,
        isAzureWorkspacesSaving: true,
        pendingSaveID: action.payload as string,
        createWorkspaceError: null,
      };
    case CREATE_AZURE_WORKSPACE_SUCCESS:
      return {
        ...state,
        isAzureWorkspacesSaving: false,
        pendingSaveID: '',
      };
    case CREATE_AZURE_WORKSPACE_FAILURE:
      return {
        ...state,
        isAzureWorkspacesSaving: false,
        pendingSaveID: '',
        createWorkspaceError: action.payload as AxiosError,
      };
    case UPDATE_AZURE_WORKSPACE_BEGIN:
    case START_STOP_WORKSPACE_BEGIN:
    case START_STOP_MACHINE_BEGIN:
      return {
        ...state,
        pendingSaveID: action.payload as string,
        updateWorkspaceError: null,
      };
    case UPDATE_AZURE_WORKSPACE_SUCCESS:
    case START_STOP_WORKSPACE_SUCCESS:
    case START_STOP_MACHINE_SUCCESS:
      return {
        ...state,
        pendingSaveID: '',
      };
    case UPDATE_AZURE_WORKSPACE_FAILURE:
    case START_STOP_WORKSPACE_FAILURE:
    case START_STOP_MACHINE_FAILURE:
      return {
        ...state,
        pendingSaveID: '',
        updateWorkspaceError: action.payload as AxiosError,
      };
    case DELETE_AZURE_WORKSPACE_BEGIN:
      return {
        ...state,
        isDeletePending: true,
        deleteWorkspaceError: null,
      };
    case DELETE_AZURE_WORKSPACE_SUCCESS:
      return {
        ...state,
        isDeletePending: false,
      };
    case DELETE_AZURE_WORKSPACE_FAILURE:
      return {
        ...state,
        isDeletePending: false,
        deleteWorkspaceError: action.payload as AxiosError,
      };
    case SEARCH_AZURE_WORKSPACE_BEGIN:
      return {
        ...state,
        azureWorkspaceSearchLoading: true,
        azureWorkspaceSearchError: null,
      };
    case SEARCH_AZURE_WORKSPACE_SUCCESS:
      return {
        ...state,
        azureWorkspaceSearch: action.payload as AzureWorkspaceDto[],
        azureWorkspaceSearchLoading: false,
      };
    case SEARCH_AZURE_WORKSPACE_FAILURE:
      return {
        ...state,
        azureWorkspaceSearchLoading: false,
        azureWorkspaceSearchError: action.payload as AxiosError,
      };
    case CLEAR_AZURE_WORKSPACE_SEARCH:
      return {
        ...state,
        azureWorkspaceSearch: null,
        azureWorkspaceSearchLoading: false,
        azureWorkspaceSearchError: null,
      };
    case SET_SELECTED_ADMIN_WORKSPACE:
      return {
        ...state,
        selectedAdminWorkspaces: action.payload as AzureWorkspaceDto[],
      };
    case FETCH_ADMIN_AZURE_WORKSPACE_BEGIN:
      return {
        ...state,
        isAdminWorkspaceRefreshing: true,
        adminWorkspaceRefreshError: null,
      };
    case FETCH_ADMIN_AZURE_WORKSPACE_SUCCESS:
      return {
        ...state,
        isAdminWorkspaceRefreshing: false,
        selectedAdminWorkspaces: action.payload as AzureWorkspaceDto[],
      };
    case FETCH_ADMIN_AZURE_WORKSPACE_FAILURE:
      return {
        ...state,
        isAdminWorkspaceRefreshing: false,
        adminWorkspaceRefreshError: action.payload as AxiosError,
      };
    case FETCH_ADMIN_WORKSPACE_TASKS_BEGIN:
      return {
        ...state,
        selectedAdminWorkspaceTasksLoading: true,
        selectedAdminWorkspaceTasksError: null,
      };
    case FETCH_ADMIN_WORKSPACE_TASKS_SUCCESS:
      return {
        ...state,
        selectedAdminWorkspaceTasksLoading: false,
        selectedAdminWorkspaceTasks: action.payload as Record<
          string,
          unknown
        >[],
      };
    case FETCH_ADMIN_WORKSPACE_TASKS_FAILURE:
      return {
        ...state,
        selectedAdminWorkspaceTasksLoading: false,
        selectedAdminWorkspaceTasksError: action.payload as AxiosError,
      };
    case FETCH_PROVISIONING_API_VERSION_BEGIN:
      return {
        ...state,
        apiVersion: 'Loading...',
      };
    case FETCH_PROVISIONING_API_VERSION_FAILURE:
      return {
        ...state,
        apiVersion: 'unavailable',
        apiVersionError: action.payload as AxiosError,
      };
    case FETCH_PROVISIONING_API_VERSION_SUCCESS:
      return {
        ...state,
        apiVersion: action.payload as string,
      };
    case SAVE_PUBLIC_ADDRESS_CHANGES_BEGIN:
      return {
        ...state,
        pendingAddressChangeID: action.payload as string,
      };
    case SAVE_PUBLIC_ADDRESS_CHANGES_SUCCESS:
    case SAVE_PUBLIC_ADDRESS_CHANGES_FAILURE:
      return {
        ...state,
        pendingAddressChangeID: '',
      };
    case CREATE_DNS_ZONE_BEGIN:
    case UPDATE_DNS_ZONE_BEGIN:
      return {
        ...state,
        pendingDNSChangeID: action.payload as string,
      };
    case CREATE_DNS_ZONE_SUCCESS:
    case CREATE_DNS_ZONE_FAILURE:
    case UPDATE_DNS_ZONE_SUCCESS:
    case UPDATE_DNS_ZONE_FAILURE:
      return {
        ...state,
        pendingDNSChangeID: '',
      };
    case EXTEND_AZURE_WORKSPACE_RUNTIME_BEGIN:
      return {
        ...state,
        extendWorkspaceRuntimeRequestPending: true,
        extendWorkspaceRuntimeRequestError: null,
      };
    case EXTEND_AZURE_WORKSPACE_RUNTIME_SUCCESS:
      return {
        ...state,
        extendWorkspaceRuntimeRequestPending: false,
        extendWorkspaceRuntimeRefreshPending: true,
      };
    case EXTEND_AZURE_WORKSPACE_RUNTIME_FAILURE:
      return {
        ...state,
        extendWorkspaceRuntimeRequestPending: false,
        extendWorkspaceRuntimeRequestError: action.payload as AxiosError,
      };
    case ADMIN_RETRY_TASK_BEGIN:
      return {
        ...state,
        adminRetryTaskLoading: true,
        adminRetryTaskError: null,
      };
    case ADMIN_RETRY_TASK_SUCCESS:
      return {
        ...state,
        adminRetryTaskLoading: false,
      };
    case ADMIN_RETRY_TASK_FAILURE:
      return {
        ...state,
        adminRetryTaskLoading: false,
        adminRetryTaskError: action.payload as AxiosError,
      };
    case RESET_PASSWORD_BEGIN:
      return {
        ...state,
        passwordResetPending: true,
        passwordResetError: null,
      };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        passwordResetPending: false,
      };
    case RESET_PASSWORD_FAILURE:
      return {
        ...state,
        passwordResetError: action.payload as AxiosError,
      };
    case ENABLE_PRIVATE_MODE_BEGIN:
      return {
        ...state,
        privateModePending: true,
        privateModeError: null,
      };
    case ENABLE_PRIVATE_MODE_SUCCESS:
      return {
        ...state,
        privateModePending: false,
        privateModeRefreshPending: true,
        privateModeError: null,
      };
    case ENABLE_PRIVATE_MODE_FAILURE:
      return {
        ...state,
        privateModePending: false,
        privateModeError: action.payload as AxiosError,
      };
    case FETCH_PATCHING_SUMMARY_BEGIN:
      return {
        ...state,
        workspacePatchingSummary: [],
        workspacePatchingSummaryLoading: true,
        workspacePatchingSummaryError: null,
      };
    case FETCH_PATCHING_SUMMARY_SUCCESS:
      return {
        ...state,
        workspacePatchingSummary: action.payload as VMPatchSummary[],
        workspacePatchingSummaryLoading: false,
      };
    case FETCH_PATCHING_SUMMARY_FAILURE:
      return {
        ...state,
        workspacePatchingSummaryError: action.payload as AxiosError,
        workspacePatchingSummaryLoading: false,
      };
    case FETCH_PATCHING_DETAILS_BEGIN:
      return {
        ...state,
        workspacePatchingDetails: [],
        workspacePatchingDetailsError: null,
        workspacePatchingDetailsLoading: true,
      };
    case FETCH_PATCHING_DETAILS_SUCCESS:
      return {
        ...state,
        workspacePatchingDetails: action.payload as VMPatchDetails[],
        workspacePatchingDetailsLoading: false,
      };
    case FETCH_PATCHING_DETAILS_FAILURE:
      return {
        ...state,
        workspacePatchingDetailsError: action.payload as AxiosError,
        workspacePatchingDetailsLoading: false,
      };
    case FETCH_ALL_WORKSPACES_PATCHING_SUMMARY_BEGIN:
      return {
        ...state,
        allWorkspacesPatchingSummary: [],
        allWorkspacesPatchingSummaryLoading: true,
        allWorkspacesPatchingSummaryError: null,
      };
    case FETCH_ALL_WORKSPACES_PATCHING_SUMMARY_SUCCESS:
      return {
        ...state,
        allWorkspacesPatchingSummary: action.payload as VMPatchSummary[],
        allWorkspacesPatchingSummaryLoading: false,
      };
    case FETCH_ALL_WORKSPACES_PATCHING_SUMMARY_FAILURE:
      return {
        ...state,
        allWorkspacesPatchingSummaryError: action.payload as AxiosError,
        allWorkspacesPatchingSummaryLoading: false,
      };
    default:
      return state;
  }
}
