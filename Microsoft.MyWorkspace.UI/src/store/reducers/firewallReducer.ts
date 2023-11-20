import { AxiosError } from 'axios';
import { JitAddressDto } from '../../types/FirewallManager/JitAddressDto';
import { NatRuleJitEntryDto } from '../../types/AzureWorkspace/NatRuleJitEntryDto.types';
import {
  ACTIVATE_EC_JIT_ENTRY_BEGIN,
  ACTIVATE_EC_JIT_ENTRY_FAILURE,
  ACTIVATE_EC_JIT_ENTRY_SUCCESS,
  ADD_JIT_ADDRESS_BEGIN,
  ADD_JIT_ADDRESS_FAILURE,
  ADD_JIT_ADDRESS_SUCCESS,
  DEACTIVATE_EC_JIT_ENTRY_BEGIN,
  DEACTIVATE_EC_JIT_ENTRY_FAILURE,
  DEACTIVATE_EC_JIT_ENTRY_SUCCESS,
  FETCH_EC_JIT_ENTRIES_BEGIN,
  FETCH_EC_JIT_ENTRIES_FAILURE,
  FETCH_EC_JIT_ENTRIES_SUCCESS,
  FETCH_FIREWALL_API_VERSION_BEGIN,
  FETCH_FIREWALL_API_VERSION_FAILURE,
  FETCH_FIREWALL_API_VERSION_SUCCESS,
  FETCH_JIT_ADDRESSES_BEGIN,
  FETCH_JIT_ADDRESSES_FAILURE,
  FETCH_JIT_ADDRESSES_FOR_ADMIN_WORKSPACE_BEGIN,
  FETCH_JIT_ADDRESSES_FOR_ADMIN_WORKSPACE_FAILURE,
  FETCH_JIT_ADDRESSES_FOR_ADMIN_WORKSPACE_SUCCESS,
  FETCH_JIT_ADDRESSES_SUCCESS,
  REMOVE_JIT_ADDRESS_BEGIN,
  REMOVE_JIT_ADDRESS_FAILURE,
  REMOVE_JIT_ADDRESS_SUCCESS,
} from '../actions/actionTypes';
import { SyncStatus } from '../../types/enums/SyncStatus';
import { FirewallAction } from '../actions';
import { JitAddressWithIP } from '../../types/FirewallManager/JitAddressWithIP';

export interface ReduxFirewallState {
  jitAddresses: JitAddressDto[];
  isJitAddressesLoading: boolean;
  isJitAddressesError: AxiosError;
  jitAddressesForAdminWorkspace: JitAddressDto[];
  isJitAddressesForAdminWorkspaceLoading: boolean;
  isJitAddressesForAdminWorkspaceError: AxiosError;
  natRuleJitEntries: NatRuleJitEntryDto[];
  isNatRuleJitEntriesLoading: boolean;
  isNatRuleJitEntriesError: AxiosError;
  userIP: string;
  jitWorkspaceRequested: string;
  apiVersion: string;
  apiVersionError: AxiosError;
}

export const firewallInitialState: ReduxFirewallState = {
  jitAddresses: [],
  isJitAddressesLoading: false,
  isJitAddressesError: null,
  jitAddressesForAdminWorkspace: [],
  isJitAddressesForAdminWorkspaceLoading: false,
  isJitAddressesForAdminWorkspaceError: null,
  natRuleJitEntries: [],
  isNatRuleJitEntriesLoading: false,
  isNatRuleJitEntriesError: null,
  userIP: '',
  jitWorkspaceRequested: null,
  apiVersion: 'unavailable',
  apiVersionError: null,
};

export default function firewallReducer(
  state: ReduxFirewallState = firewallInitialState,
  action: FirewallAction
): ReduxFirewallState {
  switch (action.type) {
    case FETCH_JIT_ADDRESSES_BEGIN:
      return {
        ...state,
        isJitAddressesLoading: true,
        isJitAddressesError: null,
      };
    case FETCH_JIT_ADDRESSES_FAILURE:
      return {
        ...state,
        isJitAddressesLoading: false,
        isJitAddressesError: action.payload as AxiosError,
      };
    case FETCH_JIT_ADDRESSES_SUCCESS:
      return {
        ...state,
        isJitAddressesLoading: false,
        isJitAddressesError: null,
        jitAddresses: (action.payload as JitAddressWithIP).Addresses,
        userIP: (action.payload as JitAddressWithIP).IP,
      };
    case FETCH_JIT_ADDRESSES_FOR_ADMIN_WORKSPACE_BEGIN:
      return {
        ...state,
        isJitAddressesForAdminWorkspaceLoading: true,
        isJitAddressesForAdminWorkspaceError: null,
      };
    case FETCH_JIT_ADDRESSES_FOR_ADMIN_WORKSPACE_FAILURE:
      return {
        ...state,
        isJitAddressesForAdminWorkspaceLoading: false,
        isJitAddressesForAdminWorkspaceError: action.payload as AxiosError,
      };
    case FETCH_JIT_ADDRESSES_FOR_ADMIN_WORKSPACE_SUCCESS:
      return {
        ...state,
        isJitAddressesForAdminWorkspaceLoading: false,
        isJitAddressesForAdminWorkspaceError: null,
        jitAddressesForAdminWorkspace: action.payload as JitAddressDto[],
      };
    case ADD_JIT_ADDRESS_BEGIN:
      return {
        ...state,
        isJitAddressesLoading: true,
        isJitAddressesError: null,
        jitWorkspaceRequested: action.payload as string,
      };
    case ADD_JIT_ADDRESS_FAILURE:
      return {
        ...state,
        isJitAddressesLoading: false,
        isJitAddressesError: action.payload as AxiosError,
        jitWorkspaceRequested: null,
      };
    case ADD_JIT_ADDRESS_SUCCESS:
      return {
        ...state,
        isJitAddressesLoading: false,
        isJitAddressesError: null,
        jitAddresses: [...state.jitAddresses, action.payload as JitAddressDto],
        jitWorkspaceRequested: null,
      };
    case REMOVE_JIT_ADDRESS_BEGIN:
      return {
        ...state,
        isJitAddressesLoading: true,
        isJitAddressesError: null,
        jitWorkspaceRequested: action.payload as string,
      };
    case REMOVE_JIT_ADDRESS_FAILURE:
      return {
        ...state,
        isJitAddressesLoading: false,
        isJitAddressesError: action.payload as AxiosError,
        jitWorkspaceRequested: null,
      };
    case REMOVE_JIT_ADDRESS_SUCCESS:
      return {
        ...state,
        isJitAddressesLoading: false,
        isJitAddressesError: null,
        jitWorkspaceRequested: null,
      };
    case FETCH_FIREWALL_API_VERSION_BEGIN:
      return {
        ...state,
        apiVersion: 'Loading...',
      };
    case FETCH_FIREWALL_API_VERSION_FAILURE:
      return {
        ...state,
        apiVersion: 'unavailable',
      };
    case FETCH_FIREWALL_API_VERSION_SUCCESS:
      return {
        ...state,
        apiVersion: action.payload as string,
      };
    case ACTIVATE_EC_JIT_ENTRY_BEGIN:
      return {
        ...state,
        isNatRuleJitEntriesLoading: true,
        isNatRuleJitEntriesError: null,
      };
    case ACTIVATE_EC_JIT_ENTRY_FAILURE:
      return {
        ...state,
        isNatRuleJitEntriesLoading: false,
        isNatRuleJitEntriesError: action.payload as AxiosError,
      };
    case ACTIVATE_EC_JIT_ENTRY_SUCCESS:
      return {
        ...state,
        natRuleJitEntries: [
          ...state.natRuleJitEntries,
          ...(action.payload as NatRuleJitEntryDto[]),
        ],
        isNatRuleJitEntriesLoading: false,
      };
    case DEACTIVATE_EC_JIT_ENTRY_BEGIN:
      return {
        ...state,
        isNatRuleJitEntriesLoading: true,
        isNatRuleJitEntriesError: null,
      };
    case DEACTIVATE_EC_JIT_ENTRY_FAILURE:
      return {
        ...state,
        isNatRuleJitEntriesLoading: false,
        isNatRuleJitEntriesError: action.payload as AxiosError,
      };
    case DEACTIVATE_EC_JIT_ENTRY_SUCCESS:
      return {
        ...state,
        natRuleJitEntries: state.natRuleJitEntries.map((jit) => {
          if (jit.WorkspaceID === action.payload) {
            jit.Status = SyncStatus.DeletePending;
          }
          return jit;
        }),
        isNatRuleJitEntriesLoading: false,
      };
    case FETCH_EC_JIT_ENTRIES_BEGIN:
      return {
        ...state,
        isNatRuleJitEntriesError: null,
        isNatRuleJitEntriesLoading: true,
      };
    case FETCH_EC_JIT_ENTRIES_FAILURE:
      return {
        ...state,
        isNatRuleJitEntriesError: action.payload as AxiosError,
        isNatRuleJitEntriesLoading: false,
      };
    case FETCH_EC_JIT_ENTRIES_SUCCESS:
      return {
        ...state,
        natRuleJitEntries: action.payload as NatRuleJitEntryDto[],
        isNatRuleJitEntriesLoading: false,
      };

    default:
      return state;
  }
}
