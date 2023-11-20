import axios, { AxiosError, AxiosResponse, CancelTokenSource } from 'axios';
import { Dispatch } from '@reduxjs/toolkit';
import { telemetryContext } from '../../applicationInsights/TelemetryService';
import { httpAuthService } from '../../applicationInsights/httpAuthService';
import {
  fetchAzureWorkspaces,
  updateAzureWorkspace,
} from '../../store/actions/azureWorkspaceActions';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../../store/actions/notificationActions';

import { AzureWorkspaceDto } from '../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { DNSRecordType } from './WorkspaceMachineProperties/WorkspaceProperties/DnsPropertiesPanel.utils';
import { UserRoleAssignmentDto } from '../../types/AuthService/UserRoleAssignmentDto.types';

export const saveAzureWorkspace = async (
  dispatch: Dispatch,
  workspace: AzureWorkspaceDto
): Promise<boolean> => {
  if (workspace.DNSZone.ID === '') {
    delete workspace.DNSZone;
  }
  const res: AxiosResponse = await updateAzureWorkspace(workspace)(dispatch);
  if (res?.status === 204) {
    dispatch(showSuccessNotification('Workspace saved'));
    fetchAzureWorkspaces()(dispatch);
    return true;
  }

  return false;
};

export const saveWorkspace = async (
  dispatch: Dispatch,
  workspace: AzureWorkspaceDto
): Promise<boolean> => {
  return saveAzureWorkspace(dispatch, workspace);
};

export const validateAlias = async (
  dispatch: Dispatch,
  alias: string
): Promise<AxiosResponse<string>> => {
  try {
    const url = `users/validate`;
    return await httpAuthService.post<string>(url, `"${alias}"`, {
      headers: {
        'content-type': 'text/json',
      },
    });
  } catch (err) {
    dispatch(showErrorNotification('Failed to validate alias:\n' + err));
    telemetryContext.logException(err);
    console.error(err);
    return err;
  }
};

export const validateAliasForOwnershipTransfer = async (
  dispatch: Dispatch,
  alias: string,
  workspaceId: string
): Promise<AxiosResponse<string>> => {
  try {
    const url = `users/validate/ownership/${workspaceId}`;
    return await httpAuthService.post<string>(url, `"${alias}"`, {
      headers: {
        'content-type': 'text/json',
      },
    });
  } catch (err) {
    telemetryContext.logException(err);
    throw err;
  }
};

export const transferWorkspaceToNewOwner = async (
  dispatch: Dispatch,
  alias: string,
  workspaceId: string
): Promise<AxiosResponse<string>> => {
  try {
    const url = `azureworkspace/transfer/${workspaceId}`;
    return await httpAuthService.put<string>(url, `"${alias}"`, {
      headers: {
        'content-type': 'text/json',
      },
    });
  } catch (err) {
    dispatch(showErrorNotification('Failed to transfer workspace:\n' + err));
    telemetryContext.logException(err);
    console.error(err);
    throw err;
  }
};

export const getUserRoleAssignmentById = async (
  dispatch: Dispatch,
  id: string
): Promise<UserRoleAssignmentDto> => {
  try {
    const url = `authorizationservice/userroleassignment/${id}`;
    return (await httpAuthService.get<UserRoleAssignmentDto>(url)).data;
  } catch (err) {
    return null;
  }
};

export const checkDNSNameExists = async (
  dispatch: Dispatch,
  name: string,
  type: DNSRecordType,
  cancellationToken: CancelTokenSource
): Promise<boolean> => {
  try {
    const url = `azureworkspace/dnszone/${name}/${type}`;

    return (
      await httpAuthService.post(
        url,
        {
          headers: {
            'content-type': 'text/json',
          },
        },
        { cancelToken: cancellationToken.token }
      )
    ).data;
  } catch (err) {
    if (!(err instanceof axios.Cancel)) {
      dispatch(showErrorNotification('Failed to validate dns name:\n' + err));
      telemetryContext.logException(err);
      console.error(err);
    }
    return false;
  }
};
