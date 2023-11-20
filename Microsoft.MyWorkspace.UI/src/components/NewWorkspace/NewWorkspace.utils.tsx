import isEqual from 'lodash/isEqual';

import { ReduxEditableWorkspaceState } from '../../store/reducers/editableWorkspaceReducer';
import { NewWorkspaceStep } from '../../types/enums/DeploymentStep';
import { WorkspaceEditType } from '../../types/enums/WorkspaceEditType';
import { WorkspaceQuotaErrors } from '../../types/Forms/WorkspaceQuotaErrors.types';
import { AxiosResponse } from 'axios';
import { EditableWorkspace } from 'src/types/Forms/EditableWorkspace.types';
import { createAzureWorkspace } from 'src/store/actions';
import { Dispatch } from '@reduxjs/toolkit';

export const nextDisabled = (
  s: NewWorkspaceStep,
  tabsComplete: Record<NewWorkspaceStep, boolean>
): boolean => {
  switch (s) {
    case NewWorkspaceStep.Choose:
      return !tabsComplete[NewWorkspaceStep.Choose];
    case NewWorkspaceStep.ConfigureNetworks:
      return !tabsComplete[NewWorkspaceStep.ConfigureNetworks];
    case NewWorkspaceStep.ConfigureMachines:
      return !tabsComplete[NewWorkspaceStep.ConfigureMachines];
    case NewWorkspaceStep.NameAndDescription:
      return !tabsComplete[NewWorkspaceStep.NameAndDescription];
    case NewWorkspaceStep.DetailsAndFinish:
      return true;
    default:
      return false;
  }
};

export const workspaceHasAtLeastOneMachine = (
  editableWorkspace: ReduxEditableWorkspaceState
): boolean => {
  return (
    editableWorkspace.editableWorkspace.VirtualMachines.length > 0 ||
    editableWorkspace.machines.length > 0
  );
};

export const configuredMachinesAreDifferent = (
  editableWorkspace: ReduxEditableWorkspaceState
): boolean => {
  return !isEqual(
    editableWorkspace.editableWorkspace.VirtualMachines,
    editableWorkspace.originalWorkspace.VirtualMachines
  );
};

const allPreviousTabsComplete = (
  tabsComplete: Record<NewWorkspaceStep, boolean>,
  currentTab: NewWorkspaceStep
) => {
  for (const [k, v] of Object.entries(tabsComplete)) {
    if (k === currentTab.toString()) {
      return true;
    } else if (!v) {
      return false;
    }
  }
  return true;
};

const getChooseStepComplete = (
  editableWorkspace: ReduxEditableWorkspaceState,
  stepsDirty: Set<NewWorkspaceStep>
) => {
  let correctMachineCount = true;
  editableWorkspace.machines.forEach(function (machine) {
    if (machine.count < 1) correctMachineCount = false;
  });
  return (
    (editableWorkspace.workspaceEditType ===
      WorkspaceEditType.NewTemplateWorkspace &&
      stepsDirty.has(NewWorkspaceStep.Choose) &&
      editableWorkspace.editableWorkspace.TemplateID !== '' &&
      editableWorkspace.editableWorkspace.TemplateID !== null &&
      editableWorkspace.editableWorkspace.TemplateID !== undefined) ||
    (editableWorkspace.workspaceEditType ===
      WorkspaceEditType.NewCustomWorkspace &&
      stepsDirty.has(NewWorkspaceStep.Choose) &&
      workspaceHasAtLeastOneMachine(editableWorkspace) &&
      correctMachineCount) ||
    (editableWorkspace.workspaceEditType === WorkspaceEditType.EditWorkspace &&
      stepsDirty.has(NewWorkspaceStep.Choose) &&
      workspaceHasAtLeastOneMachine(editableWorkspace) &&
      correctMachineCount)
  );
};

const getConfigureNetworksStepComplete = (
  editableWorkspace: ReduxEditableWorkspaceState,
  stepsDirty: Set<NewWorkspaceStep>,
  tabsCompleteObject: Record<NewWorkspaceStep, boolean>
) => {
  return (
    stepsDirty.has(NewWorkspaceStep.ConfigureNetworks) &&
    allPreviousTabsComplete(
      tabsCompleteObject,
      NewWorkspaceStep.ConfigureNetworks
    ) &&
    editableWorkspace.errors.subnetNames.length === 0
  );
};

const getConfigureMachinesStepComplete = (
  editableWorkspace: ReduxEditableWorkspaceState,
  stepsDirty: Set<NewWorkspaceStep>,
  quotaErrors: WorkspaceQuotaErrors,
  templateQuotaAdjustmentFeatureFlag: boolean,
  tabsCompleteObject: Record<NewWorkspaceStep, boolean>
) => {
  return (
    stepsDirty.has(NewWorkspaceStep.ConfigureMachines) &&
    allPreviousTabsComplete(
      tabsCompleteObject,
      NewWorkspaceStep.ConfigureMachines
    ) &&
    ((!templateQuotaAdjustmentFeatureFlag &&
      editableWorkspace.workspaceEditType ===
        WorkspaceEditType.NewTemplateWorkspace) ||
      noQuotaErrors(quotaErrors)) &&
    editableWorkspace.errors.dataDisks.length === 0 &&
    editableWorkspace.errors.vmNames.length === 0 &&
    editableWorkspace.errors.domains.length === 0
  );
};

const getNameAndDescriptionStepComplete = (
  editableWorkspace: ReduxEditableWorkspaceState,
  stepsDirty: Set<NewWorkspaceStep>,
  tabsCompleteObject: Record<NewWorkspaceStep, boolean>
) => {
  return (
    stepsDirty.has(NewWorkspaceStep.NameAndDescription) &&
    allPreviousTabsComplete(
      tabsCompleteObject,
      NewWorkspaceStep.NameAndDescription
    ) &&
    ((editableWorkspace.workspaceEditType !==
      WorkspaceEditType.NewTemplateWorkspace &&
      editableWorkspace.administratorName !== null &&
      editableWorkspace.administratorName !== '' &&
      editableWorkspace.editableWorkspace.Name !== null &&
      editableWorkspace.editableWorkspace.Name !== '' &&
      (editableWorkspace.errors.workspaceName === null ||
        editableWorkspace.errors.workspaceName === '') &&
      (editableWorkspace.errors.administratorName === null ||
        editableWorkspace.errors.administratorName === '')) ||
      (editableWorkspace.workspaceEditType ===
        WorkspaceEditType.NewTemplateWorkspace &&
        editableWorkspace.editableWorkspace.Name !== null &&
        editableWorkspace.editableWorkspace.Name !== ''))
  );
};

const getDetailsAndFinishStepComplete = (
  editableWorkspace: ReduxEditableWorkspaceState,
  stepsDirty: Set<NewWorkspaceStep>,
  tabsCompleteObject: Record<NewWorkspaceStep, boolean>
) => {
  return (
    stepsDirty.has(NewWorkspaceStep.DetailsAndFinish) &&
    allPreviousTabsComplete(
      tabsCompleteObject,
      NewWorkspaceStep.DetailsAndFinish
    ) &&
    editableWorkspace.editableWorkspace.Geography !== null &&
    editableWorkspace.editableWorkspace.Geography !== ''
  );
};

export const getTabsComplete = (
  editableWorkspace: ReduxEditableWorkspaceState,
  tabsComplete: Record<NewWorkspaceStep, boolean>,
  quotaErrors: WorkspaceQuotaErrors,
  templateQuotaAdjustmentFeatureFlag: boolean,
  stepsDirty: Set<NewWorkspaceStep>
): Record<NewWorkspaceStep, boolean> => {
  const tabsCompleteObject = { ...tabsComplete };
  tabsCompleteObject[NewWorkspaceStep.Choose] = getChooseStepComplete(
    editableWorkspace,
    stepsDirty
  );
  tabsCompleteObject[NewWorkspaceStep.ConfigureNetworks] =
    getConfigureNetworksStepComplete(
      editableWorkspace,
      stepsDirty,
      tabsCompleteObject
    );
  tabsCompleteObject[NewWorkspaceStep.ConfigureMachines] =
    getConfigureMachinesStepComplete(
      editableWorkspace,
      stepsDirty,
      quotaErrors,
      templateQuotaAdjustmentFeatureFlag,
      tabsCompleteObject
    );
  tabsCompleteObject[NewWorkspaceStep.NameAndDescription] =
    getNameAndDescriptionStepComplete(
      editableWorkspace,
      stepsDirty,
      tabsCompleteObject
    );
  tabsCompleteObject[NewWorkspaceStep.DetailsAndFinish] =
    getDetailsAndFinishStepComplete(
      editableWorkspace,
      stepsDirty,
      tabsCompleteObject
    );
  return tabsCompleteObject;
};

export const getTabsErrors = (
  editableWorkspace: ReduxEditableWorkspaceState,
  tabErrors: Record<NewWorkspaceStep, boolean>,
  quotaErrors: WorkspaceQuotaErrors,
  stepsDirty: Set<NewWorkspaceStep>
): Record<NewWorkspaceStep, boolean> => {
  const tabErrorsObject = { ...tabErrors };
  tabErrorsObject[NewWorkspaceStep.Choose] = false;
  tabErrorsObject[NewWorkspaceStep.ConfigureNetworks] =
    stepsDirty.has(NewWorkspaceStep.ConfigureNetworks) &&
    editableWorkspace.errors.subnetNames.length > 0;
  tabErrorsObject[NewWorkspaceStep.ConfigureMachines] =
    stepsDirty.has(NewWorkspaceStep.ConfigureMachines) &&
    (!noQuotaErrors(quotaErrors) ||
      editableWorkspace.errors.dataDisks.length !== 0 ||
      editableWorkspace.errors.vmNames.length !== 0 ||
      editableWorkspace.errors.domains.length !== 0);
  tabErrorsObject[NewWorkspaceStep.NameAndDescription] =
    (editableWorkspace.workspaceEditType ===
      WorkspaceEditType.NewCustomWorkspace &&
      stepsDirty.has(NewWorkspaceStep.NameAndDescription) &&
      editableWorkspace.errors.administratorName !== null &&
      editableWorkspace.errors.administratorName !== '') ||
    (stepsDirty.has(NewWorkspaceStep.NameAndDescription) &&
      editableWorkspace.errors.workspaceName !== null &&
      editableWorkspace.errors.workspaceName !== '');

  tabErrorsObject[NewWorkspaceStep.DetailsAndFinish] = false;
  return tabErrorsObject;
};

export const getStepCompleteAnnouncement = (
  step: NewWorkspaceStep,
  workspaceEditType: WorkspaceEditType
) => {
  switch (step) {
    case NewWorkspaceStep.Choose:
      return `${
        workspaceEditType === WorkspaceEditType.NewTemplateWorkspace
          ? 'Template'
          : 'Machine'
      } selection complete. Continue editing, or use the next button to continue.`;
    case NewWorkspaceStep.ConfigureNetworks:
      return 'Network configuration complete. Continue editing, or use the next button to continue.';
    case NewWorkspaceStep.ConfigureMachines:
      return 'Machine configuration complete. Continue editing, or use the next button to continue.';
    case NewWorkspaceStep.NameAndDescription:
      return 'Name and description complete. Continue editing, or use the next button to continue.';
    case NewWorkspaceStep.DetailsAndFinish:
      return `All steps complete. Continue editing, or use the ${
        workspaceEditType === WorkspaceEditType.EditWorkspace
          ? 'save'
          : 'deploy'
      } button to ${
        workspaceEditType === WorkspaceEditType.EditWorkspace
          ? 'update'
          : 'deploy'
      } your workspace.`;
  }
};

export const getStepErrorAnnouncement = (
  step: NewWorkspaceStep,
  workspaceEditType: WorkspaceEditType
) => {
  switch (step) {
    case NewWorkspaceStep.Choose:
      return `${
        workspaceEditType === WorkspaceEditType.NewTemplateWorkspace
          ? 'Template'
          : 'Machine'
      } selection contains an error. Fix the error to continue.`;
    case NewWorkspaceStep.ConfigureNetworks:
      return 'Network configuration contains an error. Fix the error to continue.';
    case NewWorkspaceStep.ConfigureMachines:
      return 'Machine configuration contains an error. Fix the error to continue.';
    case NewWorkspaceStep.NameAndDescription:
      return 'Name and description contains an error. Fix the error to continue.';
    case NewWorkspaceStep.DetailsAndFinish:
      return 'Details and Finish contains an error. Fix the error to continue.';
  }
};

export const noQuotaErrors = (quotaErrors: WorkspaceQuotaErrors): boolean => {
  return Object.entries(quotaErrors).every(([, value]) => value === '');
};

export const submitNewWorkspace = async (
  dispatch: Dispatch,
  editableWorkspace: EditableWorkspace
): Promise<boolean> => {
  try {
    const res: AxiosResponse = await createAzureWorkspace(editableWorkspace)(
      dispatch
    );
    return res.status === 200 ? true : false;
  } catch {
    return false;
  }
};

export const getTitleText = (editType: WorkspaceEditType) => {
  switch (editType) {
    case WorkspaceEditType.EditWorkspace:
      return 'Edit Workspace';
    case WorkspaceEditType.NewTemplateWorkspace:
      return 'New Workspace from Template';
    case WorkspaceEditType.NewCustomWorkspace:
      return 'New Custom Workspace';
    default:
      return 'Invalid Title';
  }
};
