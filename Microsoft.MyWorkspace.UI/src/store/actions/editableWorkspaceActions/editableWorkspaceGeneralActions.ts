import { EditableWorkspaceAction, EditableWorkspaceDispatch } from './index';
import { WorkspaceTemplateDto } from '../../../types/Catalog/WorkspaceTemplateDto.types';
import { EditableWorkspace } from '../../../types/Forms/EditableWorkspace.types';
import { AzureVirtualMachineForCreationDto } from '../../../types/ResourceCreation/AzureVirtualMachineForCreationDto.types';
import { AzureVirtualNetworkForCreationDto } from '../../../types/ResourceCreation/AzureVirtualNetworkForCreationDto.types';
import { MyWorkspacesStore } from '../../reducers/rootReducer';
import {
  workspaceValidateName,
  workspaceValidateAdministratorPassword,
  workspaceValidateConfirmPassword,
} from '../../validators/workspaceValidators';
import {
  EDITABLE_WORKSPACE_UPDATE_NAME,
  EDITABLE_WORKSPACE_UPDATE_DESCRIPTION,
  EDITABLE_WORKSPACE_UPDATE_DELETE_LOCK,
  EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_NAME,
  EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_PASSWORD,
  EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_PASSWORD_CONFIRM,
  EDITABLE_WORKSPACE_UPDATE_WITH_TEMPLATE,
  EDITABLE_WORKSPACE_ADD_SHARED_OWNER,
  EDITABLE_WORKSPACE_REMOVE_SHARED_OWNER,
  EDITABLE_WORKSPACE_SET_NESTED_VIRTUALIZATION,
  ActionType,
  EDITABLE_WORKSPACE_UPDATE_GEOGRAPHY,
  EDITABLE_WORKSPACE_UPDATE_SEGMENT_SHARING,
} from '../actionTypes';
import { MachineImageType } from '../../../types/AzureWorkspace/enums/MachineImageType';
import { createAction } from '@reduxjs/toolkit';
import cloneDeep from 'lodash/cloneDeep';
import { workspaceValidateAdministratorName } from '../../../shared/AdministratorNameHelper';

export const editableWorkspaceUpdateName = (
  name: string
): EditableWorkspaceAction => {
  const error = workspaceValidateName(name);
  return {
    type: EDITABLE_WORKSPACE_UPDATE_NAME,
    payload: name,
    error,
  };
};

export const editableWorkspaceUpdateDescription = createAction<
  string,
  ActionType
>(EDITABLE_WORKSPACE_UPDATE_DESCRIPTION);

export const editableWorkspaceUpdateDeleteLock = createAction<
  boolean,
  ActionType
>(EDITABLE_WORKSPACE_UPDATE_DELETE_LOCK);

export const editableWorkspaceUpdateAdministratorName = (
  adminName: string
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const error = workspaceValidateAdministratorName(adminName);
    const machines = cloneDeep(
      editableWorkspace.editableWorkspace.VirtualMachines
    );
    machines.forEach((m) => (m.AdministratorName = adminName));
    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_NAME,
      payload: {
        name: adminName,
        machines,
      },
      error,
    });
  };
};

export const editableWorkspaceUpdateAdministratorPassword = (
  adminPassword: string
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const error = workspaceValidateAdministratorPassword(adminPassword);
    dispatch(
      editableWorkspaceUpdateAdministratorPasswordConfirm(
        editableWorkspace.administratorPasswordConfirm
      )
    );
    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_PASSWORD,
      payload: adminPassword,
      error,
    });
  };
};

export const editableWorkspaceUpdateAdministratorPasswordConfirm = (
  adminPasswordConfirm: string
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const error = workspaceValidateConfirmPassword(
      editableWorkspace.administratorPassword,
      adminPasswordConfirm
    );
    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_PASSWORD_CONFIRM,
      payload: adminPasswordConfirm,
      error,
    });
  };
};

export const editableWorkspaceUpdateWithTemplate = (
  template: WorkspaceTemplateDto
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const VirtualMachines: AzureVirtualMachineForCreationDto[] =
      template.VirtualMachines.map((vm) => ({
        ...vm,
        MachineImageType: MachineImageType.SharedImage,
        IsNested: vm.IsNested ?? false,
      }));
    const workspace = {
      ...editableWorkspace.editableWorkspace,
      Name: template.Name,
      Description: template.Description,
      TemplateID: template.ID,
      Domains: template.Domains,
      VirtualMachines,
      VirtualNetworks:
        template.VirtualNetworks as AzureVirtualNetworkForCreationDto[],
      Location: '',
      SubscriptionID: '00000000-0000-0000-0000-000000000000',
    } as EditableWorkspace;
    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_WITH_TEMPLATE,
      payload: workspace,
    });
  };
};

export const editableWorkspaceAddSharedOwner = (
  alias: string,
  id: string
): EditableWorkspaceAction => {
  return {
    type: EDITABLE_WORKSPACE_ADD_SHARED_OWNER,
    payload: {
      alias,
      id,
    },
  };
};

export const editableWorkspaceRemoveSharedOwner = (
  index: number
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const ids = [...editableWorkspace.editableWorkspace.SharedOwnerIDs];
    ids.splice(index, 1);
    const emails = [...editableWorkspace.editableWorkspace.SharedOwnerEmails];
    emails.splice(index, 1);
    dispatch({
      type: EDITABLE_WORKSPACE_REMOVE_SHARED_OWNER,
      payload: {
        emails,
        ids,
      },
    });
  };
};

export const editableWorkspaceUpdateGeography = createAction<
  string,
  ActionType
>(EDITABLE_WORKSPACE_UPDATE_GEOGRAPHY);

export const editableWorkspaceSetNestedVirtualization = createAction<
  boolean,
  ActionType
>(EDITABLE_WORKSPACE_SET_NESTED_VIRTUALIZATION);

export const editableWorkspaceUpdateSegmentSharing = createAction<
  boolean,
  ActionType
>(EDITABLE_WORKSPACE_UPDATE_SEGMENT_SHARING);
