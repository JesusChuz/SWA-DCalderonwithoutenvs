import { createSelector } from 'reselect';

import { MyWorkspacesStore } from '../reducers/rootReducer';
import {
  checkAllMachineMaxMemoryQuotas,
  checkAllMachineMaxStorageQuotas,
  checkAllMachineSkuQuotas,
  checkCumulativeMaxMemoryQuota,
  checkCumulativeMaxStorageQuota,
  checkMaxMachinesQuota,
} from '../validators/quotaValidators';
import { MachinesUnion } from '../../types/AzureWorkspace/MachinesUnion.types';
import { SegmentConstraintDto } from '../../types/AuthService/SegmentConstraintDto.types';
import { VirtualMachineSkuDto } from '../../types/Catalog/VirtualMachineSkuDto.types';
import { WorkspaceQuotaErrors } from '../../types/Forms/WorkspaceQuotaErrors.types';
import { AzureWorkspaceDto } from '../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { UserRoleAssignmentDto } from '../../types/AuthService/UserRoleAssignmentDto.types';

const isNested = (state: MyWorkspacesStore): boolean =>
  state.editableWorkspace.isNestedVirtualizationEnabled;

const machines = (state: MyWorkspacesStore): MachinesUnion[] =>
  state.editableWorkspace.editableWorkspace.VirtualMachines;

const constraints = (state: MyWorkspacesStore): SegmentConstraintDto =>
  state.authService.constraint;

const userRoleAssignment = (state: MyWorkspacesStore): UserRoleAssignmentDto =>
  state.authService.userRoleAssignment;

const skus = (state: MyWorkspacesStore): VirtualMachineSkuDto[] =>
  state.catalog.catalogMachineSkus;

const workspaces = (state: MyWorkspacesStore): AzureWorkspaceDto[] =>
  state.azureWorkspaces.azureWorkspaces;

export const getIsAtMaxWorkspaceQuota = createSelector(
  workspaces,
  constraints,
  userRoleAssignment,
  (workspaces, constraints, userRoleAssignment) =>
    workspaces.filter((ws) => ws.OwnerID === userRoleAssignment?.UserId)
      .length >= constraints.MaxAzureWorkspacesAllowed
);

export const getWorkspaceCountUnshared = createSelector(
  workspaces,
  constraints,
  userRoleAssignment,
  (workspaces, constraints, userRoleAssignment) =>
    workspaces.filter((ws) => ws.OwnerID === userRoleAssignment?.UserId)
);

export const getEditableWorkspaceMaxMachinesQuota = createSelector(
  machines,
  constraints,
  isNested,
  (machines, constraints, isNested) =>
    checkMaxMachinesQuota(machines, constraints, [], isNested)
);

export const getEditableWorkspaceCumulativeMaxMemoryQuota = createSelector(
  machines,
  constraints,
  (machines, constraints) =>
    checkCumulativeMaxMemoryQuota(machines, constraints)
);

export const getEditableWorkspaceMachineMaxMemoryQuota = createSelector(
  machines,
  constraints,
  (machines, constraints) =>
    checkAllMachineMaxMemoryQuotas(machines, constraints)
);

export const getEditableWorkspaceCumulativeMaxStorageQuota = createSelector(
  machines,
  constraints,
  (machines, constraints) =>
    checkCumulativeMaxStorageQuota(machines, constraints)
);

export const getEditableWorkspaceMachineMaxStorageQuota = createSelector(
  machines,
  constraints,
  (machines, constraints) =>
    checkAllMachineMaxStorageQuotas(machines, constraints)
);

export const getEditableWorkspaceSkuQuota = createSelector(
  machines,
  skus,
  (machines, skus) => checkAllMachineSkuQuotas(machines, skus)
);

export const getAllQuotaErrors = createSelector(
  getEditableWorkspaceMaxMachinesQuota,
  getEditableWorkspaceCumulativeMaxMemoryQuota,
  getEditableWorkspaceMachineMaxMemoryQuota,
  getEditableWorkspaceCumulativeMaxStorageQuota,
  getEditableWorkspaceMachineMaxStorageQuota,
  getEditableWorkspaceSkuQuota,
  (
    maxMachinesQuota,
    cumulativeMaxMemoryQuota,
    machineMaxMemoryQuotas,
    cumulativeMaxStorageQuota,
    machineMaxStorageQuotas,
    skuQuota
  ) =>
    ({
      maxMachinesQuota,
      cumulativeMaxMemoryQuota,
      machineMaxMemoryQuotas,
      cumulativeMaxStorageQuota,
      machineMaxStorageQuotas,
      skuQuota,
    } as WorkspaceQuotaErrors)
);
