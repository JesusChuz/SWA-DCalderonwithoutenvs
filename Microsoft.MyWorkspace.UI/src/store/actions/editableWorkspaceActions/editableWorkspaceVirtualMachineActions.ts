import cloneDeep from 'lodash/cloneDeep';
import { EditableWorkspaceAction, EditableWorkspaceDispatch } from './index';
import { showBlockedNotification } from '..';
import { MyWorkspacesStore } from '../../reducers/rootReducer';
import {
  checkMachineSkuQuotas,
  checkMaxMemoryQuota,
  checkMaxOSDiskSizeAllowed,
} from '../../validators/quotaValidators';
import {
  workspaceValidateOSDisksStorageSize,
  workspaceValidateVMNames,
} from '../../validators/workspaceValidators';
import {
  CREATE_SNAPSHOT_BEGIN,
  CREATE_SNAPSHOT_FAILURE,
  CREATE_SNAPSHOT_SUCCESS,
  DELETE_SNAPSHOT_BEGIN,
  DELETE_SNAPSHOT_FAILURE,
  DELETE_SNAPSHOT_SUCCESS,
  EDITABLE_WORKSPACE_UPDATE_MACHINE_MEMORY_GB,
  EDITABLE_WORKSPACE_UPDATE_MACHINE_OSDISK_GB,
  EDITABLE_WORKSPACE_UPDATE_VM_NAME,
  RESTORE_SNAPSHOT_BEGIN,
  RESTORE_SNAPSHOT_FAILURE,
  RESTORE_SNAPSHOT_SUCCESS,
} from '../actionTypes';
import { AxiosError } from 'axios';
import { Dispatch } from '@reduxjs/toolkit';
import { httpAuthService } from '../../../applicationInsights/httpAuthService';
import ErrorAction from '../errorAction';
import { AzureVirtualMachineSnapshotForCreationDto } from '../../../types/AzureWorkspace/AzureVirtualMachineSnapshotForCreationDto.types';
import { AzureVirtualMachineSnapshotDto } from '../../../types/AzureWorkspace/AzureVirtualMachineSnapshotDto.types';
import { AzureVirtualMachineDto } from 'src/types/AzureWorkspace/AzureVirtualMachineDto.types';

export const editableWorkspaceUpdateMemoryGB = (
  index: number,
  memory: number
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace, authService, catalog } = getState();
    const machines = cloneDeep(
      editableWorkspace.editableWorkspace.VirtualMachines
    );
    const originalMachineMemory = machines[index].MemoryGB;
    machines[index].MemoryGB = memory;
    const sku = catalog.catalogMachineSkus.find(
      (sku) =>
        sku.Memory === memory * 1024 &&
        sku.CanSupportVirtualization ===
          editableWorkspace.isNestedVirtualizationEnabled
    );
    machines[index].Sku = sku.Name;

    const skuError = checkMachineSkuQuotas(machines[index], sku);
    if (skuError) {
      dispatch(showBlockedNotification(skuError));
      return;
    }

    const quotaError = checkMaxMemoryQuota(
      machines,
      index,
      authService.constraint
    );
    if (memory > originalMachineMemory && quotaError) {
      dispatch(showBlockedNotification(quotaError));
      return;
    }
    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_MACHINE_MEMORY_GB,
      payload: {
        machines,
      },
    });
  };
};

export const editableWorkspaceUpdateOSDisk = (
  index: number,
  osDiskSizeInGB: number
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace, authService } = getState();
    const machines = cloneDeep(
      editableWorkspace.editableWorkspace.VirtualMachines
    );
    const deployedMachine =
      editableWorkspace.originalWorkspace.VirtualMachines.find(
        (m) =>
          (m as AzureVirtualMachineDto).ID ===
          (machines[index] as AzureVirtualMachineDto).ID
      );
    const sizeError = workspaceValidateOSDisksStorageSize(
      deployedMachine ?? machines[index],
      osDiskSizeInGB
    );
    machines[index].OSDiskSizeInGB = osDiskSizeInGB;
    const error = checkMaxOSDiskSizeAllowed(
      machines,
      index,
      authService.constraint
    );
    // allow disk size edits when adding new virtual machines
    if (deployedMachine && sizeError) {
      dispatch(showBlockedNotification(sizeError));
      return;
    }

    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_MACHINE_OSDISK_GB,
      payload: {
        machines: machines,
      },
      error,
    });
  };
};

export const editableWorkspaceUpdateVMName = (
  index: number,
  name: string
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const machines = cloneDeep(
      editableWorkspace.editableWorkspace.VirtualMachines
    );
    machines[index].ComputerName = name;
    const error = workspaceValidateVMNames(machines);
    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_VM_NAME,
      payload: {
        machines,
      },
      error,
    });
  };
};

export const createSnapshotBegin = (
  snapshot: AzureVirtualMachineSnapshotForCreationDto
): EditableWorkspaceAction => ({
  type: CREATE_SNAPSHOT_BEGIN,
  payload: snapshot,
});

export const createSnapshotSuccess = (
  snapshot: AzureVirtualMachineSnapshotDto
): EditableWorkspaceAction => ({
  type: CREATE_SNAPSHOT_SUCCESS,
  payload: snapshot,
});

export const createSnapshotError = (
  error: AxiosError
): EditableWorkspaceAction => ({
  type: CREATE_SNAPSHOT_FAILURE,
  payload: error,
});

export const createSnapshot = (
  snapshot: AzureVirtualMachineSnapshotForCreationDto
): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(createSnapshotBegin(snapshot));
    try {
      const res = await httpAuthService.post<AzureVirtualMachineSnapshotDto>(
        'azurevmsnapshots',
        snapshot
      );

      dispatch(createSnapshotSuccess(res.data));
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(createSnapshotError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to create Snapshot:\n${err.response?.data}`,
          true,
          true
        );
      }
    }
  };
};

export const restoreSnapshotBegin = (
  snapshot: AzureVirtualMachineSnapshotDto
): EditableWorkspaceAction => ({
  type: RESTORE_SNAPSHOT_BEGIN,
  payload: snapshot,
});

export const restoreSnapshotSuccess = (): EditableWorkspaceAction => ({
  type: RESTORE_SNAPSHOT_SUCCESS,
});

export const restoreSnapshotError = (
  error: AxiosError
): EditableWorkspaceAction => ({
  type: RESTORE_SNAPSHOT_FAILURE,
  payload: error,
});

export const restoreSnapshot = (
  snapshot: AzureVirtualMachineSnapshotDto
): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(restoreSnapshotBegin(snapshot));
    try {
      await httpAuthService.post(
        `azurevmsnapshots/${snapshot.ID}/restore`,
        snapshot
      );

      dispatch(restoreSnapshotSuccess());
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(restoreSnapshotError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to restore Snapshot:\n${err.response?.data}`,
          true,
          true
        );
      }
    }
  };
};

export const deleteSnapshotBegin = (
  snapshot: AzureVirtualMachineSnapshotDto
): EditableWorkspaceAction => ({
  type: DELETE_SNAPSHOT_BEGIN,
  payload: snapshot,
});

export const deleteSnapshotSuccess = (
  snapshot: AzureVirtualMachineSnapshotDto
): EditableWorkspaceAction => ({
  type: DELETE_SNAPSHOT_SUCCESS,
  payload: snapshot,
});

export const deleteSnapshotError = (
  error: AxiosError
): EditableWorkspaceAction => ({
  type: DELETE_SNAPSHOT_FAILURE,
  payload: error,
});

export const deleteSnapshot = (
  snapshot: AzureVirtualMachineSnapshotDto
): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(deleteSnapshotBegin(snapshot));
    try {
      await httpAuthService.delete(`azurevmsnapshots/${snapshot.ID}`);

      dispatch(deleteSnapshotSuccess(snapshot));
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(deleteSnapshotError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to delete Snapshot:\n${err.response?.data}`,
          true,
          true
        );
      }
    }
  };
};
