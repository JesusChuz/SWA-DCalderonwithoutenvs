import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';

import { ReduxEditableWorkspaceState } from '../reducers/editableWorkspaceReducer';
import { MyWorkspacesStore } from '../reducers/rootReducer';
import { AzureWorkspaceDto } from '../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { AzureDataDiskDto } from '../../types/AzureWorkspace/AzureDataDiskDto.types';

const editableWorkspaceState = (
  state: MyWorkspacesStore
): ReduxEditableWorkspaceState => state.editableWorkspace;

export const getEditableWorkspaceName = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) =>
    editableWorkspace.editableWorkspace.Name
);

export const getEditableWorkspaceNameError = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) =>
    editableWorkspace.errors.workspaceName
);

export const getEditableWorkspaceDescription = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) =>
    editableWorkspace.editableWorkspace.Description
);

export const getEditableWorkspaceAdministratorName = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) =>
    editableWorkspace.administratorName
);

export const getEditableWorkspaceAdministratorNameError = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) =>
    editableWorkspace.errors.administratorName
);

export const getEditableWorkspaceAdministratorPassword = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) =>
    editableWorkspace.administratorPassword
);

export const getEditableWorkspaceAdministratorPasswordError = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) =>
    editableWorkspace.errors.administratorPassword
);

export const getEditableWorkspaceAdministratorPasswordConfirm = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) =>
    editableWorkspace.administratorPasswordConfirm
);

export const getEditableWorkspaceAdministratorPasswordConfirmError =
  createSelector(
    editableWorkspaceState,
    (editableWorkspace: ReduxEditableWorkspaceState) =>
      editableWorkspace.errors.administratorPasswordConfirm
  );

export const getEditableWorkspaceEditType = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) =>
    editableWorkspace.workspaceEditType
);

export const getEditableWorkspaceMachineSelection = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) => editableWorkspace.machines
);

export const getEditableWorkspaceVirtualMachines = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) =>
    editableWorkspace.editableWorkspace.VirtualMachines
);

export const getEditableWorkspaceVirtualNetwork = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) =>
    editableWorkspace.editableWorkspace.VirtualNetworks.length > 0
      ? editableWorkspace.editableWorkspace.VirtualNetworks[0]
      : {}
);

export const getEditableWorkspaceSubnets = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) => editableWorkspace.subnets
);

export const getEditableWorkspaceVMNameErrors = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) =>
    editableWorkspace.errors.vmNames
);

export const getEditableWorkspaceDataDiskErrors = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) =>
    editableWorkspace.errors.dataDisks
);

export const getEditableWorkspaceSubnetNameErrors = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) =>
    editableWorkspace.errors.subnetNames
);

export const getEditableWorkspaceExternalConnectivityChanges = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) =>
    editableWorkspace.externalConnectivityChanges
);

const getDataDisks = (workspace: AzureWorkspaceDto) => {
  const dataDiskRecords: Record<string, AzureDataDiskDto[]> = {};
  [...workspace.VirtualMachines].forEach((vm) => {
    dataDiskRecords[vm.ID] = vm.DataDisks;
  });
  return dataDiskRecords;
};

export const getEditableWorkspaceHasDataDiskChanges = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) => {
    const originalDataDisks = getDataDisks(
      editableWorkspace.originalWorkspace as AzureWorkspaceDto
    );
    const editedDataDisks = getDataDisks(
      editableWorkspace.editableWorkspace as AzureWorkspaceDto
    );
    return !isEqual(editedDataDisks, originalDataDisks);
  }
);

const getMemory = (workspace: AzureWorkspaceDto) => {
  const memoryRecords: Record<string, number> = {};
  [...workspace.VirtualMachines].forEach((vm) => {
    memoryRecords[vm.ID] = vm.MemoryGB;
  });
  return memoryRecords;
};

export const getEditableWorkspaceHasSkuChanges = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) => {
    const originalVMMemory = getMemory(
      editableWorkspace.originalWorkspace as AzureWorkspaceDto
    );
    const editedVMMemory = getMemory(
      editableWorkspace.editableWorkspace as AzureWorkspaceDto
    );
    return !isEqual(editedVMMemory, originalVMMemory);
  }
);

export const getEditableWorkspaceDomains = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) =>
    editableWorkspace.editableWorkspace.Domains
);

export const getEditableWorkspaceDomainErrors = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) =>
    editableWorkspace.errors.domains
);

export const getEditableWorkspaceSaving = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) => editableWorkspace.saving
);

export const getEditableWorkspaceIsValid = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) => {
    return (
      (editableWorkspace.errors.administratorName === null ||
        editableWorkspace.errors.administratorName === '') &&
      (editableWorkspace.errors.administratorPassword === null ||
        editableWorkspace.errors.administratorPassword === '') &&
      (editableWorkspace.errors.administratorPasswordConfirm === null ||
        editableWorkspace.errors.administratorPasswordConfirm === '') &&
      (editableWorkspace.errors.workspaceName === null ||
        editableWorkspace.errors.workspaceName === '') &&
      editableWorkspace.errors.dataDisks.length === 0 &&
      editableWorkspace.errors.domains.length === 0 &&
      editableWorkspace.errors.vmNames.length === 0 &&
      editableWorkspace.errors.subnetNames.length === 0 &&
      (isEqual(
        editableWorkspace.editedWorkspaceScheduledJob,
        editableWorkspace.originalWorkspaceScheduledJob
      ) ||
        Object.values(editableWorkspace.errors.workspaceScheduledJob).every(
          (value) => value === null
        ))
    );
  }
);

export const getEditableWorkspaceErrors = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) => editableWorkspace.errors
);

export const getReduxEditableWorkspace = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) => editableWorkspace
);

export const getEditableWorkspace = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) =>
    editableWorkspace.editableWorkspace
);

export const getEditableWorkspaceOriginalWorkspace = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) =>
    editableWorkspace.originalWorkspace
);

export const getEditableWorkspaceHasChanges = createSelector(
  editableWorkspaceState,
  (editableWorkspace: ReduxEditableWorkspaceState) =>
    !isEqual(
      editableWorkspace.editableWorkspace,
      editableWorkspace.originalWorkspace
    )
);

export const getEditWorkspaceIsAdminSelection = createSelector(
  editableWorkspaceState,
  (editWorkspace: ReduxEditableWorkspaceState) => editWorkspace.isAdminSelection
);

export const getEditableWorkspaceHasNewMachines = createSelector(
  editableWorkspaceState,
  (editWorkspace: ReduxEditableWorkspaceState) =>
    editWorkspace.machines.length > 0
);

export const getEditableWorkspaceIsSaving = createSelector(
  editableWorkspaceState,
  (editWorkspace: ReduxEditableWorkspaceState) => editWorkspace.saving
);

export const getEditableWorkspaceLastSaveSuccess = createSelector(
  editableWorkspaceState,
  (editWorkspace: ReduxEditableWorkspaceState) => editWorkspace.lastSaveSuccess
);

export const getEditableWorkspaceScheduledWorkspaceJob = createSelector(
  editableWorkspaceState,
  (editWorkspace: ReduxEditableWorkspaceState) =>
    editWorkspace.editedWorkspaceScheduledJob
);

export const getEditableWorkspaceOriginalScheduledWorkspaceJob = createSelector(
  editableWorkspaceState,
  (editWorkspace: ReduxEditableWorkspaceState) =>
    editWorkspace.originalWorkspaceScheduledJob
);

export const getEditableWorkspaceScheduledWorkspaceJobError = createSelector(
  editableWorkspaceState,
  (editWorkspace: ReduxEditableWorkspaceState) =>
    editWorkspace.errors.workspaceScheduledJob
);

export const getEditableWorkspaceScheduledWorkspaceJobChanges = createSelector(
  editableWorkspaceState,
  (editWorkspace: ReduxEditableWorkspaceState) =>
    !isEqual(
      editWorkspace.editedWorkspaceScheduledJob,
      editWorkspace.originalWorkspaceScheduledJob
    )
);

export const getEditableWorkspaceSnapshotSavingID = createSelector(
  editableWorkspaceState,
  (editWorkspace: ReduxEditableWorkspaceState) =>
    editWorkspace.snapshotVirtualMachineSavingID
);

export const getEditableWorkspaceIsNestedVirtualizationEnabled = createSelector(
  editableWorkspaceState,
  (editWorkspace: ReduxEditableWorkspaceState) =>
    editWorkspace.isNestedVirtualizationEnabled
);
