import cloneDeep from 'lodash/cloneDeep';
import { EditableWorkspaceDispatch } from './index';
import { showBlockedNotification } from '..';
import { AzureDataDiskDto } from '../../../types/AzureWorkspace/AzureDataDiskDto.types';
import { AzureVirtualMachineDto } from '../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { AzureWorkspaceDto } from '../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { AzureStorageType } from '../../../types/AzureWorkspace/enums/AzureStorageType';
import { AzureDataDiskForCreationDto } from '../../../types/ResourceCreation/AzureDataDiskForCreationDto.types';
import { MyWorkspacesStore } from '../../reducers/rootReducer';
import { checkMaxMachinesStorageQuota } from '../../validators/quotaValidators';
import {
  workspaceValidateDataDisks,
  workspaceValidateDataDisksStorageSize,
} from '../../validators/workspaceValidators';
import {
  EDITABLE_WORKSPACE_ADD_DATA_DISK,
  EDITABLE_WORKSPACE_REMOVE_DATA_DISK,
  EDITABLE_WORKSPACE_UPDATE_DATA_DISK,
} from '../actionTypes';

export const editableWorkspaceAddDataDisk = (
  machineIndex: number
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace, authService } = getState();
    const machines = cloneDeep(
      editableWorkspace.editableWorkspace.VirtualMachines
    );
    (machines[machineIndex].DataDisks as AzureDataDiskForCreationDto[]).push({
      Name: 'Disk Name',
      Description: '',
      SizeGB: 1,
      Lun:
        (
          machines[machineIndex].DataDisks as AzureDataDiskForCreationDto[]
        ).reduce(
          (v: number, c: AzureDataDiskForCreationDto) =>
            c.Lun > v ? c.Lun : v,
          0
        ) + 1,
      StorageType: AzureStorageType.StandardSSD,
    } as AzureDataDiskForCreationDto);
    const quotaError = checkMaxMachinesStorageQuota(
      machines,
      machineIndex,
      authService.constraint
    );
    if (quotaError) {
      dispatch(showBlockedNotification(quotaError));
      return;
    }
    dispatch({
      type: EDITABLE_WORKSPACE_ADD_DATA_DISK,
      payload: {
        machines,
      },
    });
  };
};

export const editableWorkspaceRemoveDataDisk = (
  machineIndex: number,
  lunId: number
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const machines = cloneDeep(
      editableWorkspace.editableWorkspace.VirtualMachines
    );
    const i = machines[machineIndex].DataDisks.findIndex(
      (d) => d.Lun === lunId
    );
    machines[machineIndex].DataDisks.splice(i, 1);
    dispatch({
      type: EDITABLE_WORKSPACE_REMOVE_DATA_DISK,
      payload: {
        machines,
      },
    });
  };
};

export const editableWorkspaceUpdateDataDisk = <
  K extends keyof AzureDataDiskForCreationDto
>(
  machineIndex: number,
  diskIndex: number,
  field: K,
  value: AzureDataDiskForCreationDto[K]
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace, authService } = getState();
    const machines = cloneDeep(
      editableWorkspace.editableWorkspace.VirtualMachines
    );
    const originalSize = machines[machineIndex].DataDisks[diskIndex]['SizeGB'];
    machines[machineIndex].DataDisks[diskIndex][field] = value;
    const error = workspaceValidateDataDisks(machines);
    const quotaError = checkMaxMachinesStorageQuota(
      machines,
      machineIndex,
      authService.constraint
    );
    if (quotaError) {
      dispatch(showBlockedNotification(quotaError));
      return;
    }
    if (
      field === 'SizeGB' &&
      (machines[machineIndex].DataDisks as AzureDataDiskDto[])[diskIndex].ID
    ) {
      /* First find VM based on ID, then find old disk based on ID */
      const disk = (
        editableWorkspace.originalWorkspace as AzureWorkspaceDto
      ).VirtualMachines.find(
        (machine) =>
          machine.ID === (machines[machineIndex] as AzureVirtualMachineDto).ID
      )?.DataDisks.find(
        (disk) =>
          disk.ID ===
          (machines[machineIndex] as AzureVirtualMachineDto).DataDisks[
            diskIndex
          ].ID
      );

      if (disk) {
        const sizeError = workspaceValidateDataDisksStorageSize(
          disk,
          value as number
        );
        if (sizeError) {
          dispatch(showBlockedNotification(sizeError));
          return;
        }
      }
    }
    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_DATA_DISK,
      payload: {
        machines,
      },
      error,
    });
  };
};
