import { Dispatch } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
  FETCH_JIT_ADDRESSES_BEGIN,
  FETCH_JIT_ADDRESSES_SUCCESS,
  FETCH_JIT_ADDRESSES_FAILURE,
  ADD_JIT_ADDRESS_BEGIN,
  ADD_JIT_ADDRESS_FAILURE,
  ADD_JIT_ADDRESS_SUCCESS,
  REMOVE_JIT_ADDRESS_BEGIN,
  REMOVE_JIT_ADDRESS_FAILURE,
  REMOVE_JIT_ADDRESS_SUCCESS,
  FETCH_FIREWALL_API_VERSION_BEGIN,
  FETCH_FIREWALL_API_VERSION_SUCCESS,
  FETCH_FIREWALL_API_VERSION_FAILURE,
  ACTIVATE_EC_JIT_ENTRY_BEGIN,
  DEACTIVATE_EC_JIT_ENTRY_BEGIN,
  ACTIVATE_EC_JIT_ENTRY_SUCCESS,
  ACTIVATE_EC_JIT_ENTRY_FAILURE,
  DEACTIVATE_EC_JIT_ENTRY_SUCCESS,
  DEACTIVATE_EC_JIT_ENTRY_FAILURE,
  FETCH_EC_JIT_ENTRIES_BEGIN,
  FETCH_EC_JIT_ENTRIES_SUCCESS,
  FETCH_EC_JIT_ENTRIES_FAILURE,
  FETCH_JIT_ADDRESSES_FOR_ADMIN_WORKSPACE_BEGIN,
  FETCH_JIT_ADDRESSES_FOR_ADMIN_WORKSPACE_FAILURE,
  FETCH_JIT_ADDRESSES_FOR_ADMIN_WORKSPACE_SUCCESS,
  Action,
} from './actionTypes';
import { JitAddressWithIP } from '../../types/FirewallManager/JitAddressWithIP';
import ErrorAction from './errorAction';
import { httpAuthService } from '../../applicationInsights/httpAuthService';
import { CreateJitAddressPartialDto } from '../../types/FirewallManager/CreateJitAddressDto';
import { JitAddressDto } from '../../types/FirewallManager/JitAddressDto';
import { NatRuleJitEntryForCreationDto } from '../../types/ResourceCreation/NatRuleJitEntryForCreationDto.types';
import { NatRuleJitEntryDto } from '../../types/AzureWorkspace/NatRuleJitEntryDto.types';

export interface FirewallAction extends Action {
  payload?:
    | JitAddressWithIP
    | JitAddressDto
    | JitAddressDto[]
    | CreateJitAddressPartialDto
    | NatRuleJitEntryDto[]
    | NatRuleJitEntryForCreationDto
    | NatRuleJitEntryDto[]
    | AxiosError
    | string;
}

export const fetchJitAddressesBegin = (): FirewallAction => ({
  type: FETCH_JIT_ADDRESSES_BEGIN,
});

export const fetchJitAddressesSuccess = (
  payload: JitAddressWithIP
): FirewallAction => ({
  type: FETCH_JIT_ADDRESSES_SUCCESS,
  payload,
});

export const fetchJitAddressesError = (
  error: AxiosError | string
): FirewallAction => ({
  type: FETCH_JIT_ADDRESSES_FAILURE,
  payload: error,
});

export const fetchJitAddresses = (): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchJitAddressesBegin());
    try {
      const res = await httpAuthService.get<JitAddressWithIP>('jitAddress');
      dispatch(fetchJitAddressesSuccess(res.data));
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(fetchJitAddressesError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve Jit Addresses:\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const fetchJitAddressesForAdminWorkspaceBegin = (): FirewallAction => ({
  type: FETCH_JIT_ADDRESSES_FOR_ADMIN_WORKSPACE_BEGIN,
});

export const fetchJitAddressesForAdminWorkspaceSuccess = (
  payload: JitAddressDto[]
): FirewallAction => ({
  type: FETCH_JIT_ADDRESSES_FOR_ADMIN_WORKSPACE_SUCCESS,
  payload,
});

export const fetchJitAddressesForAdminWorkspaceError = (
  error: AxiosError | string
): FirewallAction => ({
  type: FETCH_JIT_ADDRESSES_FOR_ADMIN_WORKSPACE_FAILURE,
  payload: error,
});

export const fetchJitAddressesForAdminWorkspace = (
  workspaceID: string
): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchJitAddressesForAdminWorkspaceBegin());
    try {
      const res = await httpAuthService.get<JitAddressDto[]>(
        `jitAddress/${workspaceID}`
      );
      dispatch(fetchJitAddressesForAdminWorkspaceSuccess(res.data));
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(fetchJitAddressesForAdminWorkspaceError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve Jit Addresses:\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const addJitAddressBegin = (workspaceID: string): FirewallAction => ({
  type: ADD_JIT_ADDRESS_BEGIN,
  payload: workspaceID,
});

export const addJitAddressSuccess = (
  payload: JitAddressDto
): FirewallAction => ({
  type: ADD_JIT_ADDRESS_SUCCESS,
  payload,
});

export const addJitAddressError = (error: AxiosError): FirewallAction => ({
  type: ADD_JIT_ADDRESS_FAILURE,
  payload: error,
});

export const addJitAddress = (
  address: CreateJitAddressPartialDto
): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(addJitAddressBegin(address.WorkspaceID));
    try {
      const res = await httpAuthService.post('jitAddress/withnsg', address);
      dispatch(addJitAddressSuccess(res.data));
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(addJitAddressError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to add Jit Address:\n${err.response?.data}`,
          true,
          true
        );
      }
    }
  };
};

export const removeJitAddressBegin = (workspaceID: string): FirewallAction => ({
  type: REMOVE_JIT_ADDRESS_BEGIN,
  payload: workspaceID,
});

export const removeJitAddressSuccess = (): FirewallAction => ({
  type: REMOVE_JIT_ADDRESS_SUCCESS,
});

export const removeJitAddressError = (error: AxiosError): FirewallAction => ({
  type: REMOVE_JIT_ADDRESS_FAILURE,
  payload: error,
});

export const removeJitAddress = (
  id: string,
  workspaceID: string
): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(removeJitAddressBegin(workspaceID));
    try {
      await httpAuthService.delete(
        `jitAddress/withnsg/${id}?workspaceID=${workspaceID}`
      );

      // Log success here
      dispatch(removeJitAddressSuccess());
      fetchJitAddresses()(dispatch);
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(removeJitAddressError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to remove Jit Address:\n${err.response?.data}`,
          true,
          true
        );
      }
    }
  };
};

export const fetchFirewallApiVersionBegin = (): FirewallAction => ({
  type: FETCH_FIREWALL_API_VERSION_BEGIN,
});

export const fetchFirewallApiVersionSuccess = (
  payload: string
): FirewallAction => ({
  type: FETCH_FIREWALL_API_VERSION_SUCCESS,
  payload,
});

export const fetchFirewallApiVersionError = (
  error: AxiosError
): FirewallAction => ({
  type: FETCH_FIREWALL_API_VERSION_FAILURE,
  payload: error,
});

export const fetchFirewallApiVersion = (): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchFirewallApiVersionBegin());
    try {
      const res = await httpAuthService.get<string>('general/version/firewall');

      // Log success here
      dispatch(fetchFirewallApiVersionSuccess(res.data ? res.data : ''));
    } catch (err) {
      dispatch(fetchFirewallApiVersionError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to retrieve Firewall API Version:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const activateExternalConnectivityJitEntryBegin =
  (): FirewallAction => ({
    type: ACTIVATE_EC_JIT_ENTRY_BEGIN,
  });

export const activateExternalConnectivityJitEntrySuccess = (
  jitEntries: NatRuleJitEntryDto[]
): FirewallAction => ({
  type: ACTIVATE_EC_JIT_ENTRY_SUCCESS,
  payload: jitEntries,
});

export const activateExternalConnectivityJitEntryError = (
  error: AxiosError | string
): FirewallAction => ({
  type: ACTIVATE_EC_JIT_ENTRY_FAILURE,
  payload: error,
});

export const activateExternalConnectivityJitEntry = (
  address: NatRuleJitEntryForCreationDto
): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(activateExternalConnectivityJitEntryBegin());
    try {
      const res = await httpAuthService.post<NatRuleJitEntryDto[]>(
        'natrule/jit',
        address
      );

      dispatch(
        activateExternalConnectivityJitEntrySuccess(res ? res.data : [])
      );
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(activateExternalConnectivityJitEntryError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to activate External Connectivity JIT entry:\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const deactivateExternalConnectivityJitEntryBegin =
  (): FirewallAction => ({
    type: DEACTIVATE_EC_JIT_ENTRY_BEGIN,
  });

export const deactivateExternalConnectivityJitEntrySuccess = (
  workspaceID: string
): FirewallAction => ({
  type: DEACTIVATE_EC_JIT_ENTRY_SUCCESS,
  payload: workspaceID,
});

export const deactivateExternalConnectivityJitEntryError = (
  error: AxiosError | string
): FirewallAction => ({
  type: DEACTIVATE_EC_JIT_ENTRY_FAILURE,
  payload: error,
});

export const deactivateExternalConnectivityJitEntry = (
  workspaceID: string
): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(deactivateExternalConnectivityJitEntryBegin());
    try {
      await httpAuthService.delete(`natrule/jit/${workspaceID}`);

      dispatch(deactivateExternalConnectivityJitEntrySuccess(workspaceID));
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(deactivateExternalConnectivityJitEntryError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to deactivate External Connectivity JIT entry:\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const fetchExternalConnectivityJitEntriesBegin = (): FirewallAction => ({
  type: FETCH_EC_JIT_ENTRIES_BEGIN,
});

export const fetchExternalConnectivityJitEntriesSuccess = (
  payload: NatRuleJitEntryDto[]
): FirewallAction => ({
  type: FETCH_EC_JIT_ENTRIES_SUCCESS,
  payload,
});

export const fetchExternalConnectivityJitEntriesError = (
  error: AxiosError | string
): FirewallAction => ({
  type: FETCH_EC_JIT_ENTRIES_FAILURE,
  payload: error,
});

export const fetchExternalConnectivityJitEntries = (): ((
  dispatch: Dispatch
) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchExternalConnectivityJitEntriesBegin());
    try {
      const res = await httpAuthService.get<NatRuleJitEntryDto[]>(
        `natrule/jit`
      );

      dispatch(
        fetchExternalConnectivityJitEntriesSuccess(res.data ? res.data : [])
      );
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(fetchExternalConnectivityJitEntriesError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to fetch External Connectivity JIT Entries:\n${err.response?.data}`,
          true
        );
      }
    }
  };
};
