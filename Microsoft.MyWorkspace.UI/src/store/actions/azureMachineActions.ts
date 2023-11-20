import {
  Action,
  REQUEST_RDP_BEGIN,
  REQUEST_RDP_FAILURE,
  REQUEST_RDP_SUCCESS,
  REVOKE_RDP_BEGIN,
  REVOKE_RDP_FAILURE,
  REVOKE_RDP_SUCCESS,
} from './actionTypes';
import { AxiosError } from 'axios';
import { Dispatch } from '@reduxjs/toolkit';
import { httpAuthService } from '../../applicationInsights/httpAuthService';
import ErrorAction from './errorAction';
import { fetchAzureWorkspaces } from '.';

export interface AzureMachineAction extends Action {
  payload?: string | AxiosError;
}

export const requestRdpPortBegin = (machineID: string): AzureMachineAction => ({
  type: REQUEST_RDP_BEGIN,
  payload: machineID,
});

export const requestRdpPortSuccess = (): AzureMachineAction => ({
  type: REQUEST_RDP_SUCCESS,
});

export const requestRdpPortError = (error: AxiosError): AzureMachineAction => ({
  type: REQUEST_RDP_FAILURE,
  payload: error,
});

export const requestRdpPort = (
  machineID: string,
  workspaceID: string
): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(requestRdpPortBegin(machineID));
    try {
      await httpAuthService.get(
        `/azurevirtualmachines/${machineID}/requestrdpport?workspaceID=${workspaceID}`
      );
      await fetchAzureWorkspaces()(dispatch);
      dispatch(requestRdpPortSuccess());
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(requestRdpPortError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to request RDP port:\n${err.response?.data}`,
          true,
          true
        );
      }
    }
  };
};

export const revokeRdpPortBegin = (machineID: string): AzureMachineAction => ({
  type: REVOKE_RDP_BEGIN,
  payload: machineID,
});

export const revokeRdpPortSuccess = (): AzureMachineAction => ({
  type: REVOKE_RDP_SUCCESS,
});

export const revokeRdpPortError = (error: AxiosError): AzureMachineAction => ({
  type: REVOKE_RDP_FAILURE,
  payload: error,
});

export const revokeRdpPort = (
  machineID: string,
  workspaceID: string
): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(revokeRdpPortBegin(machineID));
    try {
      await httpAuthService.delete(
        `/azurevirtualmachines/${machineID}/revokerdpport?workspaceID=${workspaceID}`
      );
      await fetchAzureWorkspaces()(dispatch);
      dispatch(revokeRdpPortSuccess());
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(revokeRdpPortError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to revoke RDP port:\n${err.response?.data}`,
          true,
          true
        );
      }
    }
  };
};
