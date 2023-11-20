import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

import {
  EDITABLE_WORKSPACE_UPDATE_WORKSPACE_EDIT_TYPE,
  EDITABLE_WORKSPACE_SET_CURRENT_WORKSPACE_EDIT,
  EDITABLE_WORKSPACE_SET_CURRENT_WORKSPACE_NEW,
  EDITABLE_WORKSPACE_RESET_CHANGES,
  EDITABLE_WORKSPACE_RESET_WORKSPACE_CHANGES,
  EDITABLE_WORKSPACE_RESET_SUBNET_CHANGES,
  EDITABLE_WORKSPACE_SET_SAVING,
  EDITABLE_WORKSPACE_RESET_MACHINE_SELECTION,
  EDITABLE_WORKSPACE_SAVE_SUCCESS,
  EDITABLE_WORKSPACE_SAVE_FAILURE,
  EDITABLE_WORKSPACE_UPDATE_CURRENT_WORKSPACE_EDIT,
  EDITABLE_WORKSPACE_RESET_CONFIGURED_MACHINE_SELECTION,
} from '../actionTypes';
import {
  updateDNSZone,
  createDNSZone,
  createWorkspaceScheduleJob,
  updateWorkspaceScheduleJob,
  fetchWorkspaceScheduleJobs,
  setPoliteScreenReaderAnnouncement,
} from '..';
import { saveWorkspace } from '../../../components/MyWorkspaces/workspaceService';
import { AzureWorkspaceDto } from '../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { WorkspaceEditType } from '../../../types/enums/WorkspaceEditType';
import { EditableWorkspaceAction, EditableWorkspaceDispatch } from './index';
import { MyWorkspacesStore } from '../../reducers/rootReducer';
import { AzurePublicAddressDto } from '../../../types/AzureWorkspace/AzurePublicAddressDto.types';
import { EditableWorkspace } from '../../../types/Forms/EditableWorkspace.types';
import { WorkspaceErrors } from '../../../types/Forms/WorkspaceErrors.types';
import { ResourceState } from '../../../types/AzureWorkspace/enums/ResourceState';
import { AzureVirtualMachineDto } from '../../../types/AzureWorkspace/AzureVirtualMachineDto.types';

export const editableWorkspaceUpdateWorkspaceEditType = (
  editType: WorkspaceEditType
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch): Promise<void> => {
    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_WORKSPACE_EDIT_TYPE,
      payload: editType,
    });
  };
};

export const editableWorkspaceSetCurrentWorkspaceEdit = (
  workspace: AzureWorkspaceDto,
  isAdminSelection?: boolean
): EditableWorkspaceAction => {
  return {
    type: EDITABLE_WORKSPACE_SET_CURRENT_WORKSPACE_EDIT,
    payload: workspace,
    isAdminSelection,
  };
};

export const editableWorkspaceSetCurrentWorkspaceNew = (
  workspaceEditType: WorkspaceEditType
): EditableWorkspaceAction => {
  return {
    type: EDITABLE_WORKSPACE_SET_CURRENT_WORKSPACE_NEW,
    payload: workspaceEditType,
  };
};

const updateVirtualMachines = (
  currentWorkspaceVirtualMachines: AzureVirtualMachineDto[],
  newWorkspaceVirtualMachines: AzureVirtualMachineDto[],
  dispatch: EditableWorkspaceDispatch,
  announceStateChanges = false
): AzureVirtualMachineDto[] => {
  return newWorkspaceVirtualMachines.map((newMachine) => {
    const currentMachine = currentWorkspaceVirtualMachines.find(
      (machine) => machine.ID === newMachine.ID
    );
    const areSnapshotsEqual = isEqual(
      newMachine.Snapshots,
      currentMachine?.Snapshots
    );
    if (currentMachine.State !== newMachine.State && announceStateChanges) {
      dispatch(
        setPoliteScreenReaderAnnouncement(
          `Machine, ${currentMachine.Name}, state updated to ${
            ResourceState[newMachine.State]
          }.`
        )
      );
    }
    return currentMachine
      ? ({
          ...currentMachine,
          State: newMachine.State,
          AdministratorName: newMachine.AdministratorName,
          AdministratorPassword: newMachine.AdministratorPassword,
          Snapshots: areSnapshotsEqual
            ? currentMachine.Snapshots
            : newMachine.Snapshots,
          RDPPort: newMachine.RDPPort,
          SSHPort: newMachine.SSHPort,
          RDPAddress: newMachine.RDPAddress,
          NatRules: newMachine.NatRules,
        } as AzureVirtualMachineDto)
      : newMachine;
  });
};

const updatePublicAddresses = (
  currentWorkspacePublicAddresses: AzurePublicAddressDto[],
  newWorkspacePublicAddresses: AzurePublicAddressDto[],
  deletedExistingPublicAddressIDs: string[],
  dispatch: EditableWorkspaceDispatch,
  announceStateChanges = false
): AzurePublicAddressDto[] => {
  return newWorkspacePublicAddresses
    .filter((address) => !deletedExistingPublicAddressIDs.includes(address.ID))
    .map((newAddress) => {
      const currentAddress = currentWorkspacePublicAddresses.find(
        (ws) => ws.ID === newAddress.ID
      );
      if (currentAddress) {
        if (currentAddress.State !== newAddress.State && announceStateChanges) {
          dispatch(
            setPoliteScreenReaderAnnouncement(
              `IP Address, ${newAddress.PublicIPAddress}, state updated to ${
                ResourceState[newAddress.State]
              }.`
            )
          );
        }
        return {
          ...currentAddress,
          PublicIPAddress:
            currentAddress.PublicIPAddress || newAddress.PublicIPAddress,
          State: newAddress.State,
        };
      } else {
        dispatch(
          setPoliteScreenReaderAnnouncement(
            `IP Address, ${newAddress.PublicIPAddress}, state updated to ${
              ResourceState[newAddress.State]
            }.`
          )
        );
      }
      return newAddress;
    });
};

const updateWorkspaceStates = (
  currentWorkspace: AzureWorkspaceDto,
  newWorkspace: AzureWorkspaceDto,
  dispatch: EditableWorkspaceDispatch,
  announceStateChanges = false,
  deletedExistingPublicAddressIDs: string[] = []
): void => {
  const workspaceStateChanged = currentWorkspace.State != newWorkspace.State;
  currentWorkspace.State = newWorkspace.State;
  if (workspaceStateChanged && announceStateChanges) {
    dispatch(
      setPoliteScreenReaderAnnouncement(
        `Workspace, ${currentWorkspace.Name}, state updated to ${
          ResourceState[newWorkspace.State]
        }.`
      )
    );
  }
  currentWorkspace.VirtualMachines = updateVirtualMachines(
    currentWorkspace.VirtualMachines,
    newWorkspace.VirtualMachines,
    dispatch,
    announceStateChanges
  );
  currentWorkspace.PublicAddresses = updatePublicAddresses(
    currentWorkspace.PublicAddresses,
    newWorkspace.PublicAddresses,
    deletedExistingPublicAddressIDs,
    dispatch,
    announceStateChanges
  );
};

export const editableWorkspaceUpdateCurrentWorkspace = (
  workspaces: AzureWorkspaceDto[]
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const editedWorkspace = cloneDeep(
      editableWorkspace.editableWorkspace as AzureWorkspaceDto
    );
    const originalWorkspace = cloneDeep(
      editableWorkspace.originalWorkspace as AzureWorkspaceDto
    );
    const { DeletedExistingPublicAddressIDs } = cloneDeep(
      editableWorkspace.externalConnectivityChanges
    );

    const workspace = workspaces.find((ws) => ws.ID === editedWorkspace.ID);

    // DNS zone is set to null because the default redux DNS Zone is slightly different than the default
    // Cosmos DNS Zone.
    const workspacesAreEqual = isEqual(
      { ...originalWorkspace, DNSZone: null },
      { ...workspace, DNSZone: null }
    );
    if (!workspace || workspacesAreEqual) {
      return;
    }

    if (
      editedWorkspace.State === ResourceState.Transitioning ||
      editedWorkspace.State === ResourceState.Deploying
    ) {
      dispatch(
        editableWorkspaceSetCurrentWorkspaceEdit(
          workspace,
          editableWorkspace.isAdminSelection
        )
      );
      return;
    }
    updateWorkspaceStates(
      editedWorkspace,
      workspace,
      dispatch,
      true,
      DeletedExistingPublicAddressIDs
    );
    updateWorkspaceStates(originalWorkspace, workspace, dispatch);

    if (originalWorkspace.EndRunTime !== workspace.EndRunTime) {
      originalWorkspace.EndRunTime = workspace.EndRunTime;
      editedWorkspace.EndRunTime = workspace.EndRunTime;
    }
    originalWorkspace.PrivateMode = workspace.PrivateMode;
    editedWorkspace.PrivateMode = workspace.PrivateMode;
    originalWorkspace.LastJitActivationDateTime =
      workspace.LastJitActivationDateTime;
    editedWorkspace.LastJitActivationDateTime =
      workspace.LastJitActivationDateTime;

    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_CURRENT_WORKSPACE_EDIT,
      payload: {
        originalWorkspace,
        editedWorkspace,
      },
    });
  };
};

export const editableWorkspaceResetChanges = (): EditableWorkspaceAction => {
  return {
    type: EDITABLE_WORKSPACE_RESET_CHANGES,
  };
};

export const editableWorkspaceResetMachineSelection =
  (): EditableWorkspaceAction => {
    return {
      type: EDITABLE_WORKSPACE_RESET_MACHINE_SELECTION,
    };
  };

export const editableWorkspaceResetConfiguredMachineSelection =
  (): EditableWorkspaceAction => {
    return {
      type: EDITABLE_WORKSPACE_RESET_CONFIGURED_MACHINE_SELECTION,
    };
  };

export const editableWorkspaceResetWorkspaceChanges = (
  previousEditableWorkspace: EditableWorkspace,
  previousErrors: WorkspaceErrors
): EditableWorkspaceAction => {
  return {
    type: EDITABLE_WORKSPACE_RESET_WORKSPACE_CHANGES,
    payload: previousEditableWorkspace,
    error: previousErrors,
  };
};

export const editableWorkspaceResetSubnetChanges =
  (): EditableWorkspaceAction => {
    return {
      type: EDITABLE_WORKSPACE_RESET_SUBNET_CHANGES,
    };
  };

export const editableWorkspaceSaveChanges = (): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    dispatch({
      type: EDITABLE_WORKSPACE_SET_SAVING,
      payload: true,
    });

    const workspaceToSave = {
      ...cloneDeep(editableWorkspace.originalWorkspace),
      ...cloneDeep(editableWorkspace.editableWorkspace),
    } as AzureWorkspaceDto;

    let dnsSuccess = true;
    let scheduleSuccess = true;
    const dnsChanges = !isEqual(
      editableWorkspace.editableWorkspace.DNSZone,
      (editableWorkspace.originalWorkspace as AzureWorkspaceDto).DNSZone
    );
    if (dnsChanges && workspaceToSave.DNSZone.ID !== '') {
      // PUT
      dnsSuccess = await updateDNSZone(workspaceToSave.DNSZone)(dispatch);
    } else if (dnsChanges && workspaceToSave.DNSZone.ID === '') {
      // POST
      dnsSuccess = await createDNSZone({
        Name: `DNSZone-${workspaceToSave.ID}`,
        Description: '',
        WorkspaceID: workspaceToSave.ID,
        DnsARecords: workspaceToSave.DNSZone.DnsARecords,
        DnsCNAMERecords: workspaceToSave.DNSZone.DnsCNAMERecords,
        DnsMXRecords: workspaceToSave.DNSZone.DnsMXRecords,
        DnsNSRecords: workspaceToSave.DNSZone.DnsNSRecords,
        DnsSRVRecords: workspaceToSave.DNSZone.DnsSRVRecords,
        DnsTXTRecords: workspaceToSave.DNSZone.DnsTXTRecords,
      })(dispatch);
    }

    if (
      dnsSuccess &&
      !isEqual(
        editableWorkspace.originalWorkspaceScheduledJob,
        editableWorkspace.editedWorkspaceScheduledJob
      )
    ) {
      if (
        !editableWorkspace.originalWorkspaceScheduledJob.AutoStartTimeOfDay &&
        !editableWorkspace.originalWorkspaceScheduledJob.AutoStopTimeOfDay
      ) {
        scheduleSuccess = await createWorkspaceScheduleJob(
          editableWorkspace.editedWorkspaceScheduledJob
        )(dispatch);
      } else {
        scheduleSuccess = await updateWorkspaceScheduleJob(
          editableWorkspace.editedWorkspaceScheduledJob
        )(dispatch);
        if (
          !editableWorkspace.editedWorkspaceScheduledJob.AutoStartTimeOfDay &&
          !editableWorkspace.editedWorkspaceScheduledJob.AutoStopTimeOfDay
        ) {
          dispatch(fetchWorkspaceScheduleJobs());
        }
      }
    }

    const success =
      dnsSuccess && scheduleSuccess
        ? await saveWorkspace(dispatch, workspaceToSave)
        : false;
    if (success) {
      dispatch({
        type: EDITABLE_WORKSPACE_SAVE_SUCCESS,
      });
    }
    if (!success) {
      dispatch({
        type: EDITABLE_WORKSPACE_SAVE_FAILURE,
      });
    }
    dispatch({
      type: EDITABLE_WORKSPACE_SET_SAVING,
      payload: false,
    });
  };
};
