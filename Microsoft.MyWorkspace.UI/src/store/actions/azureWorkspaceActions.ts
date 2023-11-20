import { AxiosError, AxiosResponse } from 'axios';

import {
  FETCH_AZURE_WORKSPACES_BEGIN,
  FETCH_AZURE_WORKSPACES_SUCCESS,
  FETCH_AZURE_WORKSPACES_FAILURE,
  DELETE_AZURE_WORKSPACE_BEGIN,
  DELETE_AZURE_WORKSPACE_SUCCESS,
  DELETE_AZURE_WORKSPACE_FAILURE,
  CREATE_AZURE_WORKSPACE_BEGIN,
  CREATE_AZURE_WORKSPACE_SUCCESS,
  CREATE_AZURE_WORKSPACE_FAILURE,
  UPDATE_AZURE_WORKSPACE_BEGIN,
  UPDATE_AZURE_WORKSPACE_SUCCESS,
  UPDATE_AZURE_WORKSPACE_FAILURE,
  SEARCH_AZURE_WORKSPACE_BEGIN,
  SEARCH_AZURE_WORKSPACE_SUCCESS,
  SEARCH_AZURE_WORKSPACE_FAILURE,
  CLEAR_AZURE_WORKSPACE_SEARCH,
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
  FETCH_PROVISIONING_API_VERSION_SUCCESS,
  FETCH_PROVISIONING_API_VERSION_FAILURE,
  Action,
  UPDATE_DNS_ZONE_BEGIN,
  UPDATE_DNS_ZONE_FAILURE,
  UPDATE_DNS_ZONE_SUCCESS,
  CREATE_DNS_ZONE_BEGIN,
  CREATE_DNS_ZONE_SUCCESS,
  CREATE_DNS_ZONE_FAILURE,
  SET_SELECTED_ADMIN_WORKSPACE,
  FETCH_ADMIN_AZURE_WORKSPACE_FAILURE,
  FETCH_ADMIN_AZURE_WORKSPACE_BEGIN,
  FETCH_ADMIN_AZURE_WORKSPACE_SUCCESS,
  FETCH_ADMIN_WORKSPACE_TASKS_FAILURE,
  FETCH_ADMIN_WORKSPACE_TASKS_BEGIN,
  FETCH_ADMIN_WORKSPACE_TASKS_SUCCESS,
  EXTEND_AZURE_WORKSPACE_RUNTIME_BEGIN,
  EXTEND_AZURE_WORKSPACE_RUNTIME_SUCCESS,
  EXTEND_AZURE_WORKSPACE_RUNTIME_FAILURE,
  ADMIN_RETRY_TASK_BEGIN,
  ADMIN_RETRY_TASK_SUCCESS,
  ADMIN_RETRY_TASK_FAILURE,
  RESET_PASSWORD_BEGIN,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_SUCCESS,
  RESET_NIC_FAILURE,
  RESET_NIC_BEGIN,
  RESET_NIC_SUCCESS,
  ENABLE_PRIVATE_MODE_BEGIN,
  ENABLE_PRIVATE_MODE_FAILURE,
  ENABLE_PRIVATE_MODE_SUCCESS,
  FETCH_PATCHING_SUMMARY_BEGIN,
  FETCH_PATCHING_SUMMARY_SUCCESS,
  FETCH_PATCHING_SUMMARY_FAILURE,
  FETCH_PATCHING_DETAILS_BEGIN,
  FETCH_PATCHING_DETAILS_SUCCESS,
  FETCH_PATCHING_DETAILS_FAILURE,
  FETCH_ALL_WORKSPACES_PATCHING_SUMMARY_BEGIN,
  FETCH_ALL_WORKSPACES_PATCHING_SUMMARY_SUCCESS,
  FETCH_ALL_WORKSPACES_PATCHING_SUMMARY_FAILURE,
} from './actionTypes';
import {
  showDefaultNotification,
  showErrorNotification,
  showSuccessNotification,
} from './notificationActions';
import { telemetryContext } from '../../applicationInsights/TelemetryService';
import { httpAuthService } from '../../applicationInsights/httpAuthService';
import { AzureWorkspaceDto } from '../../types/AzureWorkspace/AzureWorkspaceDto.types';
import ErrorAction from './errorAction';
import { AzurePublicAddressDto } from '../../types/AzureWorkspace/AzurePublicAddressDto.types';
import { AzureDNSZoneDto } from '../../types/AzureWorkspace/AzureDNSZoneDto.types';
import { AzureDNSZoneForCreationDto } from '../../types/ResourceCreation/AzureDNSZoneForCreationDto.types';
import { EditableWorkspace } from '../../types/Forms/EditableWorkspace.types';
import {
  EditableWorkspaceAction,
  editableWorkspaceRemoveNewPublicAddress,
  editableWorkspaceUpdateCurrentWorkspace,
  saveDNSZone,
} from './editableWorkspaceActions';
import { MyWorkspacesStore } from '../reducers/rootReducer';
import { createAction, Dispatch, ThunkDispatch } from '@reduxjs/toolkit';
import { getErrorMessage } from '../../shared/ErrorHelper';
import { VMPatchDetails } from '../../types/AzureWorkspace/VMPatchDetailsDto.types';
import { VMPatchSummary } from '../../types/AzureWorkspace/VMPatchSummaryDto.types';

export interface WorkspaceAction extends Action {
  payload?:
    | boolean
    | string[]
    | AzureWorkspaceDto[]
    | AxiosError
    | string
    | Record<string, unknown>[]
    | AzureDNSZoneDto
    | VMPatchSummary[]
    | VMPatchDetails[];
}

export const fetchAzureWorkspacesBegin = (
  refreshWorkspaces: boolean
): WorkspaceAction => ({
  type: FETCH_AZURE_WORKSPACES_BEGIN,
  payload: refreshWorkspaces,
});

export const fetchAzureWorkspacesSuccess = (
  payload: AzureWorkspaceDto[]
): WorkspaceAction => ({
  type: FETCH_AZURE_WORKSPACES_SUCCESS,
  payload,
});

export const fetchAzureWorkspacesError = (
  error: AxiosError | string
): WorkspaceAction => ({
  type: FETCH_AZURE_WORKSPACES_FAILURE,
  payload: error,
});

export const fetchAzureWorkspaces = (refreshWorkspaces = false) => {
  return async (
    dispatch: ThunkDispatch<
      MyWorkspacesStore,
      undefined,
      EditableWorkspaceAction | WorkspaceAction
    >
  ): Promise<void> => {
    dispatch(fetchAzureWorkspacesBegin(refreshWorkspaces));
    try {
      const res = await httpAuthService.get<AzureWorkspaceDto[]>(
        `azureworkspace/userworkspaces`
      );

      // Log success here
      dispatch(fetchAzureWorkspacesSuccess(res.data ? res.data : []));
      dispatch(editableWorkspaceUpdateCurrentWorkspace(res.data));
    } catch (err) {
      dispatch(fetchAzureWorkspacesError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to retrieve Azure Workspaces:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const createAzureWorkspaceBegin = (name: string): WorkspaceAction => ({
  type: CREATE_AZURE_WORKSPACE_BEGIN,
  payload: name,
});

export const createAzureWorkspaceSuccess = (): WorkspaceAction => ({
  type: CREATE_AZURE_WORKSPACE_SUCCESS,
});

export const createAzureWorkspaceError = (
  error: AxiosError | string
): WorkspaceAction => ({
  type: CREATE_AZURE_WORKSPACE_FAILURE,
  payload: error,
});

export const createAzureWorkspace = (workspace: EditableWorkspace) => {
  return (dispatch: Dispatch): Promise<AxiosResponse> => {
    dispatch(createAzureWorkspaceBegin(workspace.Name));
    try {
      return httpAuthService.post('azureworkspace', workspace).then(
        (res) => {
          dispatch(createAzureWorkspaceSuccess());
          return res;
        },
        (err) => {
          dispatch(createAzureWorkspaceError(err));
          ErrorAction(
            dispatch,
            err,
            `Failed to create Azure Workspace:\n${getErrorMessage(err)}.`,
            true,
            true
          );
          return err.response;
        }
      );
    } catch (err) {
      dispatch(createAzureWorkspaceError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to create Azure Workspace:\n${getErrorMessage(err)}.`,
        true
      );
      return err;
    }
  };
};

export const updateAzureWorkspaceBegin = (
  savingID: string
): WorkspaceAction => ({
  type: UPDATE_AZURE_WORKSPACE_BEGIN,
  payload: savingID,
});

export const updateAzureWorkspaceSuccess = (): WorkspaceAction => ({
  type: UPDATE_AZURE_WORKSPACE_SUCCESS,
});

export const updateAzureWorkspaceError = (
  error: AxiosError | string
): WorkspaceAction => ({
  type: UPDATE_AZURE_WORKSPACE_FAILURE,
  payload: error,
});

export const updateAzureWorkspace = (workspace: AzureWorkspaceDto) => {
  return (dispatch: Dispatch): Promise<AxiosResponse> => {
    dispatch(updateAzureWorkspaceBegin(workspace.ID));
    try {
      return httpAuthService
        .put(`azureworkspace/${workspace.ID}`, workspace)
        .then(
          (res) => {
            dispatch(updateAzureWorkspaceSuccess());
            return res;
          },
          (err) => {
            dispatch(updateAzureWorkspaceError(err));
            ErrorAction(
              dispatch,
              err,
              `Failed to update Azure Workspace:\n${getErrorMessage(err)}`,
              true,
              true
            );
            return err.response;
          }
        );
    } catch (err) {
      dispatch(updateAzureWorkspaceError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to update Azure Workspace:\n${getErrorMessage(err)}`,
        true,
        true
      );
      return err;
    }
  };
};

export const startStopAzureWorkspaceBegin = (
  savingID: string
): WorkspaceAction => ({
  type: START_STOP_WORKSPACE_BEGIN,
  payload: savingID,
});

export const startStopAzureWorkspaceSuccess = (): WorkspaceAction => ({
  type: START_STOP_WORKSPACE_SUCCESS,
});

export const startStopAzureWorkspaceError = (
  error: AxiosError | string
): WorkspaceAction => ({
  type: START_STOP_WORKSPACE_FAILURE,
  payload: error,
});

export const startStopAzureWorkspace = (
  id: string,
  start: boolean
): ((dispatch: Dispatch) => AxiosResponse) => {
  const text = start ? 'start' : 'stop';
  return (dispatch: Dispatch) => {
    dispatch(startStopAzureWorkspaceBegin(id));
    try {
      return httpAuthService.post(`azureworkspace/${text}/${id}`).then(
        (res) => {
          dispatch(startStopAzureWorkspaceSuccess());
          return res;
        },
        (err) => {
          dispatch(startStopAzureWorkspaceError(err));
          ErrorAction(
            dispatch,
            err,
            `Failed to ${text} Azure Workspace:\n${err.response?.data}`,
            true
          );
          return err.response;
        }
      );
    } catch (err) {
      dispatch(startStopAzureWorkspaceError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to ${text} Azure Workspace:\n${err.response?.data}`,
        true,
        true
      );
      return err;
    }
  };
};

export const startStopAzureMachineBegin = (
  savingID: string
): WorkspaceAction => ({
  type: START_STOP_MACHINE_BEGIN,
  payload: savingID,
});

export const startStopAzureMachineSuccess = (): WorkspaceAction => ({
  type: START_STOP_MACHINE_SUCCESS,
});

export const startStopAzureMachineError = (
  error: AxiosError | string
): WorkspaceAction => ({
  type: START_STOP_MACHINE_FAILURE,
  payload: error,
});

export const startStopAzureMachine = (
  workspaceId: string,
  machineId: string,
  start: boolean
): ((dispatch: Dispatch) => Promise<AxiosResponse>) => {
  const text = start ? 'start' : 'stop';
  return (dispatch: Dispatch) => {
    dispatch(startStopAzureMachineBegin(workspaceId));
    try {
      return httpAuthService
        .post(`azurevirtualmachines/${text}/${workspaceId}/${machineId}`)
        .then(
          (res) => {
            dispatch(startStopAzureMachineSuccess());
            return res;
          },
          (err) => {
            dispatch(startStopAzureMachineError(err));
            ErrorAction(
              dispatch,
              err,
              `Failed to ${text} Azure Machine:\n${err.response?.data}`,
              true
            );
            return err.response;
          }
        );
    } catch (err) {
      dispatch(startStopAzureMachineError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to ${text} Azure Machine:\n${err.response?.data}`,
        true
      );
      return err;
    }
  };
};

export const deleteAzureWorkspaceBegin = (): WorkspaceAction => ({
  type: DELETE_AZURE_WORKSPACE_BEGIN,
});

export const deleteAzureWorkspaceSuccess = (): WorkspaceAction => ({
  type: DELETE_AZURE_WORKSPACE_SUCCESS,
});

export const deleteAzureWorkspaceFailure = (
  error: AxiosError | string
): WorkspaceAction => ({
  type: DELETE_AZURE_WORKSPACE_FAILURE,
  payload: error,
});

export const deleteAzureWorkspace = (
  workspaceID: string
): ((dispatch: Dispatch) => Promise<AxiosResponse>) => {
  return async (dispatch: Dispatch) => {
    dispatch(deleteAzureWorkspaceBegin());
    dispatch(showDefaultNotification('Deletion in progress. Please wait.'));
    try {
      return httpAuthService.delete(`azureworkspace/${workspaceID}`).then(
        (res) => {
          dispatch(deleteAzureWorkspaceSuccess());
          dispatch(showSuccessNotification('Successfully deleted workspace'));
          return res;
        },
        (err) => {
          dispatch(deleteAzureWorkspaceFailure(err));
          ErrorAction(
            dispatch,
            err,
            `Failed to delete workspace:\n${err.response?.data}`,
            true,
            true
          );

          return err.response;
        }
      );
    } catch (err) {
      dispatch(deleteAzureWorkspaceFailure(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to delete workspace:\n${err.response?.data}`,
        true,
        true
      );
      return err;
    }
  };
};

export const searchAzureWorkspaceBegin = (): WorkspaceAction => ({
  type: SEARCH_AZURE_WORKSPACE_BEGIN,
});

export const searchAzureWorkspaceSuccess = (
  payload: AzureWorkspaceDto[]
): WorkspaceAction => ({
  type: SEARCH_AZURE_WORKSPACE_SUCCESS,
  payload,
});

export const searchAzureWorkspaceFailure = (
  error: AxiosError | string
): WorkspaceAction => ({
  type: SEARCH_AZURE_WORKSPACE_FAILURE,
  payload: error,
});

export const searchAzureWorkspace = (
  searchQuery: string
): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(searchAzureWorkspaceBegin());
    try {
      const res = await httpAuthService.get(
        `azureworkspace?searchQuery=${searchQuery.trim()}`
      );

      // Log success here
      dispatch(searchAzureWorkspaceSuccess(res.data ? res.data : []));
    } catch (err) {
      dispatch(searchAzureWorkspaceFailure(err));
      telemetryContext.logException(err);
      dispatch(
        showErrorNotification('Failed to retrieve Azure Workspaces:\n' + err)
      );
      console.error(err);
    }
  };
};

export const fetchAdminAzureWorkspaceBegin = (): WorkspaceAction => ({
  type: FETCH_ADMIN_AZURE_WORKSPACE_BEGIN,
});

export const fetchAdminAzureWorkspaceSuccess = (
  payload: AzureWorkspaceDto[]
): WorkspaceAction => ({
  type: FETCH_ADMIN_AZURE_WORKSPACE_SUCCESS,
  payload,
});

export const fetchAdminAzureWorkspaceFailure = (
  error: AxiosError | string
): WorkspaceAction => ({
  type: FETCH_ADMIN_AZURE_WORKSPACE_FAILURE,
  payload: error,
});

export const fetchAdminAzureWorkspace = (
  workspaceID: string
): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAdminAzureWorkspaceBegin());
    try {
      const res = await httpAuthService.get(`azureworkspace/${workspaceID}`);

      // Log success here
      dispatch(fetchAdminAzureWorkspaceSuccess(res.data ? [res.data] : []));
    } catch (err) {
      dispatch(fetchAdminAzureWorkspaceFailure(err));
      telemetryContext.logException(err);
      dispatch(
        showErrorNotification('Failed to retrieve Azure Workspaces:\n' + err)
      );
      console.error(err);
    }
  };
};

export const fetchAdminWorkspaceTasksBegin = (): WorkspaceAction => ({
  type: FETCH_ADMIN_WORKSPACE_TASKS_BEGIN,
});

export const fetchAdminWorkspaceTasksSuccess = (
  payload: Record<string, unknown>[]
): WorkspaceAction => ({
  type: FETCH_ADMIN_WORKSPACE_TASKS_SUCCESS,
  payload,
});

export const fetchAdminWorkspaceTasksFailure = (
  error: AxiosError | string
): WorkspaceAction => ({
  type: FETCH_ADMIN_WORKSPACE_TASKS_FAILURE,
  payload: error,
});

export const fetchAdminWorkspaceTasks = (
  workspaceID: string
): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAdminWorkspaceTasksBegin());
    try {
      const res = await httpAuthService.get(
        `azureworkspace/tasks/${workspaceID}`
      );

      // Log success here
      dispatch(fetchAdminWorkspaceTasksSuccess(res.data ? res.data : []));
    } catch (err) {
      dispatch(fetchAdminWorkspaceTasksFailure(err));
      telemetryContext.logException(err);
      dispatch(
        showErrorNotification(
          'Failed to retrieve Azure Workspace tasks:\n' + err
        )
      );
      console.error(err);
    }
  };
};

export const clearAzureWorkspaceSearch = (): WorkspaceAction => ({
  type: CLEAR_AZURE_WORKSPACE_SEARCH,
});

export const setSelectedAdminWorkspace = (
  workspace: AzureWorkspaceDto
): WorkspaceAction => ({
  type: SET_SELECTED_ADMIN_WORKSPACE,
  payload: [workspace], // List for WorkspaceMachineProperties view which expects a list
});

const createPublicAddresses = async (
  workspace: AzureWorkspaceDto,
  newAddressCount: number,
  dispatch: Dispatch
) => {
  await httpAuthService.post<AzurePublicAddressDto[]>(
    `azureworkspace/publicaddress/${workspace.ID}?numberOfAddresses=${newAddressCount}`
  );
  dispatch(editableWorkspaceRemoveNewPublicAddress());
};

const deletePublicAddress = async (address: AzurePublicAddressDto) => {
  await httpAuthService.delete(`azureworkspace/publicaddress/${address.ID}`);
};

export const savePublicAddressChangesBegin = (
  savingID: string
): WorkspaceAction => ({
  type: SAVE_PUBLIC_ADDRESS_CHANGES_BEGIN,
  payload: savingID,
});

export const savePublicAddressChangesSuccess = (): WorkspaceAction => ({
  type: SAVE_PUBLIC_ADDRESS_CHANGES_SUCCESS,
});

export const savePublicAddressChangesFailure = (
  error: AxiosError | string
): WorkspaceAction => ({
  type: SAVE_PUBLIC_ADDRESS_CHANGES_FAILURE,
  payload: error,
});

export const savePublicAddressChanges = (
  workspace: AzureWorkspaceDto,
  deletedPublicAddresses: AzurePublicAddressDto[],
  newPublicAddressCount: number
): ((dispatch: Dispatch) => Promise<boolean>) => {
  return async (dispatch: Dispatch) => {
    dispatch(savePublicAddressChangesBegin(workspace.ID));
    try {
      await Promise.all(deletedPublicAddresses.map(deletePublicAddress));
      if (newPublicAddressCount > 0) {
        await createPublicAddresses(workspace, newPublicAddressCount, dispatch);
      }
      dispatch(savePublicAddressChangesSuccess());
      return true;
    } catch (err) {
      dispatch(savePublicAddressChangesFailure(err));
      console.log(err);
      ErrorAction(
        dispatch,
        err,
        `Failed to update Azure Public IP Addresses for this workspace:\n${err.response?.data}`,
        true,
        true
      );
      return false;
    }
  };
};

export const fetchProvisioningApiVersionBegin = (): WorkspaceAction => ({
  type: FETCH_PROVISIONING_API_VERSION_BEGIN,
});

export const fetchProvisioningApiVersionSuccess = (
  payload: string
): WorkspaceAction => ({
  type: FETCH_PROVISIONING_API_VERSION_SUCCESS,
  payload,
});

export const fetchProvisioningApiVersionError = (
  error: AxiosError | string
): WorkspaceAction => ({
  type: FETCH_PROVISIONING_API_VERSION_FAILURE,
  payload: error,
});

export const fetchProvisioningApiVersion = (): ((
  dispatch: Dispatch
) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchProvisioningApiVersionBegin());
    try {
      const res = await httpAuthService.get<string>(
        'general/version/provisioning'
      );

      // Log success here
      dispatch(fetchProvisioningApiVersionSuccess(res.data ? res.data : ''));
    } catch (err) {
      dispatch(fetchProvisioningApiVersionError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to retrieve Provisioning API Version:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const updateDNSZoneBegin = (savingID: string): WorkspaceAction => ({
  type: UPDATE_DNS_ZONE_BEGIN,
  payload: savingID,
});

export const updateDNSZoneSuccess = (): WorkspaceAction => ({
  type: UPDATE_DNS_ZONE_SUCCESS,
});

export const updateDNSZoneFailure = (
  error: AxiosError | string
): WorkspaceAction => ({
  type: UPDATE_DNS_ZONE_FAILURE,
  payload: error,
});

export const updateDNSZone = (
  dnsZone: AzureDNSZoneDto
): ((dispatch: Dispatch) => Promise<boolean>) => {
  return async (dispatch: Dispatch) => {
    dispatch(updateDNSZoneBegin(dnsZone.WorkspaceID));
    try {
      await httpAuthService.put(
        `azureworkspace/dnszone/${dnsZone.ID}`,
        dnsZone
      );
      dispatch(updateDNSZoneSuccess());
      return true;
    } catch (err) {
      dispatch(updateDNSZoneFailure(err));
      console.log(err);
      ErrorAction(
        dispatch,
        err,
        `Failed to update the DNS Zone for this workspace:\n${err.response?.data}`,
        true,
        true
      );
      return false;
    }
  };
};

export const createDNSZoneBegin = (savingID: string): WorkspaceAction => ({
  type: CREATE_DNS_ZONE_BEGIN,
  payload: savingID,
});

export const createDNSZoneSuccess = (): WorkspaceAction => ({
  type: CREATE_DNS_ZONE_SUCCESS,
});

export const createDNSZoneFailure = (
  error: AxiosError | string
): WorkspaceAction => ({
  type: CREATE_DNS_ZONE_FAILURE,
  payload: error,
});

export const createDNSZone = (
  dnsZone: AzureDNSZoneForCreationDto
): ((dispatch: Dispatch) => Promise<boolean>) => {
  return async (dispatch: Dispatch) => {
    dispatch(createDNSZoneBegin(dnsZone.WorkspaceID));
    try {
      const zone: AzureDNSZoneDto = (
        await httpAuthService.post('azureworkspace/dnszone', dnsZone)
      ).data;
      dispatch(createDNSZoneSuccess());
      dispatch(saveDNSZone(zone));
      return true;
    } catch (err) {
      dispatch(createDNSZoneFailure(err));
      console.log(err);
      ErrorAction(
        dispatch,
        err,
        `Failed to create a DNS Zone for this workspace:\n${err.response?.data}`,
        true,
        true
      );
      return false;
    }
  };
};

export const extendAzureWorkspaceRuntimeBegin = (): WorkspaceAction => ({
  type: EXTEND_AZURE_WORKSPACE_RUNTIME_BEGIN,
});

export const extendAzureWorkspaceRuntimeSuccess = (): WorkspaceAction => ({
  type: EXTEND_AZURE_WORKSPACE_RUNTIME_SUCCESS,
});

export const extendAzureWorkspaceRuntimeError = (
  error: AxiosError | string
): WorkspaceAction => ({
  type: EXTEND_AZURE_WORKSPACE_RUNTIME_FAILURE,
  payload: error,
});

export const extendAzureWorkspaceRuntime = (
  workspace: AzureWorkspaceDto,
  hours: number
) => {
  return async (dispatch: Dispatch): Promise<boolean> => {
    dispatch(extendAzureWorkspaceRuntimeBegin());
    try {
      await httpAuthService.put(
        `azureworkspace/extendruntime/${workspace.ID}`,
        `${hours}`,
        {
          headers: {
            'content-type': 'text/json',
          },
        }
      );
      dispatch(extendAzureWorkspaceRuntimeSuccess());
      return true;
    } catch (err) {
      dispatch(extendAzureWorkspaceRuntimeError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to extend Azure workspace runtime:\n${err.response?.data}.`,
        true
      );
      return false;
    }
  };
};

export const adminRetryTaskBegin = (): WorkspaceAction => ({
  type: ADMIN_RETRY_TASK_BEGIN,
});

export const adminRetryTaskSuccess = (): WorkspaceAction => ({
  type: ADMIN_RETRY_TASK_SUCCESS,
});

export const adminRetryTaskError = (
  error: AxiosError | string
): WorkspaceAction => ({
  type: ADMIN_RETRY_TASK_FAILURE,
  payload: error,
});

export const adminRetryTask = (taskID: string, taskType: string) => {
  return async (dispatch: Dispatch): Promise<boolean> => {
    dispatch(adminRetryTaskBegin());
    try {
      await httpAuthService.post(
        `azureworkspace/tasks/retry?taskID=${taskID}&taskType=${taskType}`
      );
      dispatch(adminRetryTaskSuccess());
      dispatch(showSuccessNotification(`Retrying task with ID: ${taskID}`));
      return true;
    } catch (err) {
      dispatch(adminRetryTaskError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to schedule task retry:\n${err.response?.data}.`,
        true
      );
      return false;
    }
  };
};

export const resetPasswordBegin = (): WorkspaceAction => ({
  type: RESET_PASSWORD_BEGIN,
});

export const resetPasswordSuccess = (): WorkspaceAction => ({
  type: RESET_PASSWORD_SUCCESS,
});

export const resetPasswordError = (
  error: AxiosError | string
): WorkspaceAction => ({
  type: RESET_PASSWORD_FAILURE,
  payload: error,
});

export const resetPassword = (workspaceID: string, machineID: string) => {
  return async (dispatch: Dispatch): Promise<boolean> => {
    dispatch(resetPasswordBegin());
    try {
      await httpAuthService.put(
        `azurevirtualmachines/updatepassword/${workspaceID}/${machineID}`
      );
      dispatch(resetPasswordSuccess());
      dispatch(
        showDefaultNotification(
          `Your machine's password is being rotated. This may take several minutes.`
        )
      );
      return true;
    } catch (err) {
      dispatch(resetPasswordError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to reset password:\n${err.response?.data}.`,
        true
      );
      return false;
    }
  };
};

export const resetNicBegin = (): WorkspaceAction => ({
  type: RESET_NIC_BEGIN,
});

export const resetNicSuccess = (): WorkspaceAction => ({
  type: RESET_NIC_SUCCESS,
});

export const resetNicError = (error: AxiosError | string): WorkspaceAction => ({
  type: RESET_NIC_FAILURE,
  payload: error,
});

export const resetNic = (
  workspaceID: string,
  machineID: string,
  nicID: string
) => {
  return async (dispatch: Dispatch): Promise<boolean> => {
    dispatch(resetNicBegin());
    try {
      await httpAuthService.put(
        `azurevirtualmachines/resetnic/${workspaceID}/${machineID}/${nicID}`
      );
      dispatch(resetNicSuccess());
      dispatch(
        showDefaultNotification(
          `This NIC is being reset. This may take several minutes.`
        )
      );
      return true;
    } catch (err) {
      dispatch(resetNicError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to reset NIC:\n${err.response?.data}.`,
        true
      );
      return false;
    }
  };
};

export const enablePrivateModeBegin = createAction<undefined>(
  ENABLE_PRIVATE_MODE_BEGIN
);

export const enablePrivateModeSuccess = createAction<undefined>(
  ENABLE_PRIVATE_MODE_SUCCESS
);

export const enablePrivateModeFailure = createAction<AxiosError>(
  ENABLE_PRIVATE_MODE_FAILURE
);

export const enablePrivateMode = (
  workspaceID: string
): ((dispatch: Dispatch) => Promise<void>) => {
  return async (dispatch): Promise<void> => {
    dispatch(enablePrivateModeBegin());
    try {
      await httpAuthService.put(`azureworkspace/private/${workspaceID}`);
      dispatch(enablePrivateModeSuccess());
    } catch (e) {
      dispatch(enablePrivateModeFailure(e));
      ErrorAction(
        dispatch,
        e,
        `Failed to enable Private Mode :\n${e.response?.data}`,
        true
      );
    }
  };
};

export const fetchPatchingSummaryBegin = (): WorkspaceAction => ({
  type: FETCH_PATCHING_SUMMARY_BEGIN,
});

export const fetchPatchingSummarySuccess = (
  payload: VMPatchSummary[]
): WorkspaceAction => ({
  type: FETCH_PATCHING_SUMMARY_SUCCESS,
  payload,
});

export const fetchPatchingSummaryError = (
  error: AxiosError | string
): WorkspaceAction => ({
  type: FETCH_PATCHING_SUMMARY_FAILURE,
  payload: error,
});

export const fetchPatchingSummary = (workspaceID: string) => {
  return async (dispatch: Dispatch): Promise<void> => {
    dispatch(fetchPatchingSummaryBegin());
    try {
      const res = await httpAuthService.get<VMPatchSummary[]>(
        `workspace/${workspaceID}/patch-summary/virtualMachines`
      );
      dispatch(fetchPatchingSummarySuccess(res.data));
    } catch (err) {
      dispatch(fetchPatchingSummaryError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to retrieve Workspace Patch Summary:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const fetchPatchingDetailsBegin = (): WorkspaceAction => ({
  type: FETCH_PATCHING_DETAILS_BEGIN,
});

export const fetchPatchingDetailsSuccess = (
  payload: VMPatchDetails[]
): WorkspaceAction => ({
  type: FETCH_PATCHING_DETAILS_SUCCESS,
  payload,
});

export const fetchPatchingDetailsError = (
  error: AxiosError | string
): WorkspaceAction => ({
  type: FETCH_PATCHING_DETAILS_FAILURE,
  payload: error,
});

export const fetchPatchingDetails = (workspaceID: string) => {
  return async (dispatch: Dispatch): Promise<void> => {
    dispatch(fetchPatchingDetailsBegin());
    try {
      const res = await httpAuthService.get<VMPatchDetails[]>(
        `workspace/${workspaceID}/patch-details/virtualMachines`
      );
      dispatch(fetchPatchingDetailsSuccess(res.data));
    } catch (err) {
      dispatch(fetchPatchingDetailsError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to retrieve Workspace Patch Details:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const fetchAllWorkspacesPatchingSummaryBegin = (): WorkspaceAction => ({
  type: FETCH_ALL_WORKSPACES_PATCHING_SUMMARY_BEGIN,
});

export const fetchAllWorkspacesPatchingSummarySuccess = (
  payload: VMPatchSummary[]
): WorkspaceAction => ({
  type: FETCH_ALL_WORKSPACES_PATCHING_SUMMARY_SUCCESS,
  payload,
});

export const fetchAllWorkspacesPatchingSummaryError = (
  error: AxiosError | string
): WorkspaceAction => ({
  type: FETCH_ALL_WORKSPACES_PATCHING_SUMMARY_FAILURE,
  payload: error,
});

export const fetchAllWorkspacesPatchingSummary = (segmentId: string) => {
  return async (dispatch: Dispatch): Promise<void> => {
    dispatch(fetchPatchingDetailsBegin());
    try {
      const res = await httpAuthService.get<VMPatchSummary[]>(
        `workspace/patch-summary/segments/${segmentId}`
      );
      dispatch(fetchAllWorkspacesPatchingSummarySuccess(res.data));
    } catch (err) {
      dispatch(fetchAllWorkspacesPatchingSummaryError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to retrieve Workspace Patch Summaries:\n${err.response?.data}`,
        true
      );
    }
  };
};
