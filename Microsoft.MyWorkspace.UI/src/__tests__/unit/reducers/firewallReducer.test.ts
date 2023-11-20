import { AxiosError } from 'axios';
import { FirewallAction } from '../../../store/actions';
import {
  ActionType,
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
} from '../../../store/actions/actionTypes';
import firewallReducer, {
  firewallInitialState,
} from '../../../store/reducers/firewallReducer';
import { NatRuleJitEntryDto } from '../../../types/AzureWorkspace/NatRuleJitEntryDto.types';
import { SyncStatus } from '../../../types/enums/SyncStatus';
import { JitAddressDto } from '../../../types/FirewallManager/JitAddressDto';
import { JitAddressWithIP } from '../../../types/FirewallManager/JitAddressWithIP';
import { AxiosErrorTestData } from '../../data/AxiosErrorTestData';
import { getTestJitAddressDto } from '../../data/JitAddressDtoTestData';
import { getTestNatRuleJitEntryDto } from '../../data/NatRuleJitEntryDtoTestData';

const initialState = firewallInitialState;
const axiosError: AxiosError = {
  ...AxiosErrorTestData,
};

describe('Firewall Reducer Tests', () => {
  test.each([
    ACTIVATE_EC_JIT_ENTRY_BEGIN,
    DEACTIVATE_EC_JIT_ENTRY_BEGIN,
    FETCH_EC_JIT_ENTRIES_BEGIN,
  ])('Action with %s type returns correct state', (type: ActionType) => {
    const action: FirewallAction = {
      type,
    };
    const startState = {
      ...initialState,
      isNatRuleJitEntriesError: axiosError,
    };
    const newState = firewallReducer(startState, action);
    expect(newState.isNatRuleJitEntriesLoading).toBe(true);
    expect(newState.isNatRuleJitEntriesError).toBeNull();
  });

  test.each([
    ACTIVATE_EC_JIT_ENTRY_FAILURE,
    DEACTIVATE_EC_JIT_ENTRY_FAILURE,
    FETCH_EC_JIT_ENTRIES_FAILURE,
  ])(
    // eslint-disable-next-line jest/no-identical-title
    'Action with %s type returns correct state',
    (type: ActionType) => {
      const action: FirewallAction = {
        type,
        payload: axiosError,
      };
      const startState = {
        ...initialState,
        isNatRuleJitEntriesLoading: true,
      };
      const newState = firewallReducer(startState, action);
      expect(newState.isNatRuleJitEntriesLoading).toBe(false);
      expect(newState.isNatRuleJitEntriesError).toEqual(axiosError);
    }
  );
  test('Action with ACTIVATE_EC_JIT_ENTRY_SUCCESS type returns correct state', () => {
    const initialNatRuleJitAddresses = [
      getTestNatRuleJitEntryDto({ ID: 'nat-rule-jit-address-id-1' }),
      getTestNatRuleJitEntryDto({ ID: 'nat-rule-jit-address-id-2' }),
    ];
    const payload = [
      getTestNatRuleJitEntryDto({
        ID: 'new-nat-rule-jit-address-id',
      }),
    ];

    const action: FirewallAction = {
      type: ACTIVATE_EC_JIT_ENTRY_SUCCESS,
      payload,
    };
    const startState = {
      ...initialState,
      isNatRuleJitEntriesLoading: true,
      natRuleJitEntries: initialNatRuleJitAddresses,
    };
    const newState = firewallReducer(startState, action);
    expect(newState.natRuleJitEntries).toEqual([
      ...initialNatRuleJitAddresses,
      ...payload,
    ]);
    expect(newState.isJitAddressesLoading).toBe(false);
  });
  test.each([ADD_JIT_ADDRESS_BEGIN, REMOVE_JIT_ADDRESS_BEGIN])(
    // eslint-disable-next-line jest/no-identical-title
    'Action with %s type returns correct state',
    (type: ActionType) => {
      const workspaceRequested = 'workspace-requested-id';
      const action: FirewallAction = {
        type,
        payload: workspaceRequested,
      };
      const startState = {
        ...initialState,
        isJitAddressesError: axiosError,
      };
      const newState = firewallReducer(startState, action);
      expect(newState.isJitAddressesLoading).toBe(true);
      expect(newState.isJitAddressesError).toBeNull();
      expect(newState.jitWorkspaceRequested).toBe(workspaceRequested);
    }
  );
  test.each([ADD_JIT_ADDRESS_FAILURE, REMOVE_JIT_ADDRESS_FAILURE])(
    // eslint-disable-next-line jest/no-identical-title
    'Action with %s type returns correct state',
    (type: ActionType) => {
      const workspaceRequested = 'workspace-requested-id';
      const action: FirewallAction = {
        type,
        payload: axiosError,
      };
      const startState = {
        ...initialState,
        isJitAddressLoading: true,
        jitWorkspaceRequested: workspaceRequested,
      };
      const newState = firewallReducer(startState, action);
      expect(newState.isJitAddressesLoading).toBe(false);
      expect(newState.isJitAddressesError).toEqual(axiosError);
      expect(newState.jitWorkspaceRequested).toBe(null);
    }
  );
  test('Action with ADD_JIT_ADDRESS_SUCCESS type returns correct state', () => {
    const initialjitAddresses = [
      getTestJitAddressDto({ ID: 'jit-address-id-1' }),
      getTestJitAddressDto({ ID: 'jit-address-id-2' }),
    ];
    const payload: JitAddressDto = getTestJitAddressDto({
      ID: 'new-jit-address-id',
    });

    const action: FirewallAction = {
      type: ADD_JIT_ADDRESS_SUCCESS,
      payload,
    };
    const startState = {
      ...initialState,
      isJitAddressesLoading: true,
      jitAddresses: initialjitAddresses,
      jitWorkspaceRequested: 'new-jit-address-id',
    };
    const newState = firewallReducer(startState, action);
    expect(newState.jitAddresses).toEqual([...initialjitAddresses, payload]);
    expect(newState.isJitAddressesLoading).toBe(false);
    expect(newState.isJitAddressesError).toBeNull();
    expect(newState.jitWorkspaceRequested).toBeNull();
  });
  test('Action with DEACTIVATE_EC_JIT_ENTRY_SUCCESS type returns correct state', () => {
    const payload = 'workspace-id-1';
    const natRuleJitEntries: NatRuleJitEntryDto[] = [
      getTestNatRuleJitEntryDto({
        ID: 'nat-rule-jit-id-2',
        WorkspaceID: payload,
      }),
      getTestNatRuleJitEntryDto({
        ID: 'nat-rule-jit-id-2',
        WorkspaceID: 'workspace-id-2',
      }),
    ];

    const action: FirewallAction = {
      type: DEACTIVATE_EC_JIT_ENTRY_SUCCESS,
      payload,
    };
    const startState = {
      ...initialState,
      natRuleJitEntries,
    };
    const newState = firewallReducer(startState, action);
    expect(newState.natRuleJitEntries).toContainEqual(
      expect.objectContaining({
        WorkspaceID: payload,
        Status: SyncStatus.DeletePending,
      })
    );
    expect(newState.isNatRuleJitEntriesLoading).toBe(false);
  });
  test('Action with FETCH_EC_JIT_ENTRIES_SUCCESS type returns correct state', () => {
    const payload: NatRuleJitEntryDto[] = [
      getTestNatRuleJitEntryDto({
        ID: 'new-nat-rule-jit-id-1',
      }),
      getTestNatRuleJitEntryDto({
        ID: 'new-nat-rule-jit-id-2',
      }),
    ];

    const action: FirewallAction = {
      type: FETCH_EC_JIT_ENTRIES_SUCCESS,
      payload,
    };
    const startState = {
      ...initialState,
      isNatRuleJitEntriesLoading: true,
    };
    const newState = firewallReducer(startState, action);
    expect(newState.natRuleJitEntries).toEqual(payload);
    expect(newState.isNatRuleJitEntriesLoading).toBe(false);
  });
  test('Action with FETCH_FIREWALL_API_VERSION_BEGIN type returns correct state', () => {
    const action: FirewallAction = {
      type: FETCH_FIREWALL_API_VERSION_BEGIN,
    };
    const newState = firewallReducer(initialState, action);
    expect(newState.apiVersion).toBe('Loading...');
  });
  test('Action with FETCH_FIREWALL_API_VERSION_FAILURE type returns correct state', () => {
    const action: FirewallAction = {
      type: FETCH_FIREWALL_API_VERSION_FAILURE,
    };
    const newState = firewallReducer(initialState, action);
    expect(newState.apiVersion).toBe('unavailable');
  });
  test('Action with FETCH_FIREWALL_API_VERSION_SUCCESS type returns correct state', () => {
    const apiVersion = '1.1';
    const action: FirewallAction = {
      type: FETCH_FIREWALL_API_VERSION_SUCCESS,
      payload: apiVersion,
    };
    const newState = firewallReducer(initialState, action);
    expect(newState.apiVersion).toBe(apiVersion);
  });
  test('Action with FETCH_JIT_ADDRESSES_BEGIN type returns correct state', () => {
    const action: FirewallAction = {
      type: FETCH_JIT_ADDRESSES_BEGIN,
    };
    const startState = {
      ...initialState,
      isJitAddressesError: axiosError,
    };
    const newState = firewallReducer(startState, action);
    expect(newState.isJitAddressesLoading).toBe(true);
    expect(newState.isJitAddressesError).toBeNull();
  });
  test('Action with FETCH_JIT_ADDRESSES_FAILURE type returns correct state', () => {
    const action: FirewallAction = {
      type: FETCH_JIT_ADDRESSES_FAILURE,
      payload: axiosError,
    };
    const startState = {
      ...initialState,
      isJitAddressesLoading: true,
    };
    const newState = firewallReducer(startState, action);
    expect(newState.isJitAddressesLoading).toBe(false);
    expect(newState.isJitAddressesError).toEqual(axiosError);
  });
  test('Action with FETCH_JIT_ADDRESSES_SUCCESS type returns correct state', () => {
    const payload: JitAddressWithIP = {
      IP: '1.2.3.4',
      Addresses: [
        getTestJitAddressDto({ ID: 'jit-address-id-1' }),
        getTestJitAddressDto({ ID: 'jit-address-id-2' }),
      ],
    };
    const action: FirewallAction = {
      type: FETCH_JIT_ADDRESSES_SUCCESS,
      payload,
    };
    const startState = {
      ...initialState,
      isJitAddressesLoading: true,
    };
    const newState = firewallReducer(startState, action);
    expect(newState.jitAddresses).toEqual(payload.Addresses);
    expect(newState.userIP).toEqual(payload.IP);
    expect(newState.isJitAddressesLoading).toBe(false);
    expect(newState.isJitAddressesError).toBeNull();
  });
  test('Action with FETCH_JIT_ADDRESSES_FOR_ADMIN_WORKSPACE_BEGIN type returns correct state', () => {
    const action: FirewallAction = {
      type: FETCH_JIT_ADDRESSES_FOR_ADMIN_WORKSPACE_BEGIN,
    };
    const startState = {
      ...initialState,
      isJitAddressesForAdminWorkspaceError: axiosError,
    };
    const newState = firewallReducer(startState, action);
    expect(newState.isJitAddressesForAdminWorkspaceLoading).toBe(true);
    expect(newState.isJitAddressesForAdminWorkspaceError).toBeNull();
  });
  test('Action with FETCH_JIT_ADDRESSES_FOR_ADMIN_WORKSPACE_FAILURE type returns correct state', () => {
    const action: FirewallAction = {
      type: FETCH_JIT_ADDRESSES_FOR_ADMIN_WORKSPACE_FAILURE,
      payload: axiosError,
    };
    const startState = {
      ...initialState,
      isJitAddressesForAdminWorkspaceLoading: true,
    };
    const newState = firewallReducer(startState, action);
    expect(newState.isJitAddressesForAdminWorkspaceLoading).toBe(false);
    expect(newState.isJitAddressesForAdminWorkspaceError).toEqual(axiosError);
  });
  test('Action with FETCH_JIT_ADDRESSES_FOR_ADMIN_WORKSPACE_SUCCESS type returns correct state', () => {
    const payload: JitAddressDto[] = [
      getTestJitAddressDto({ ID: 'jit-address-id-1' }),
      getTestJitAddressDto({ ID: 'jit-address-id-2' }),
    ];
    const action: FirewallAction = {
      type: FETCH_JIT_ADDRESSES_FOR_ADMIN_WORKSPACE_SUCCESS,
      payload,
    };
    const startState = {
      ...initialState,
      isJitAddressesForAdminWorkspaceLoading: true,
    };
    const newState = firewallReducer(startState, action);
    expect(newState.jitAddressesForAdminWorkspace).toEqual(payload);
    expect(newState.isJitAddressesForAdminWorkspaceLoading).toBe(false);
    expect(newState.isJitAddressesForAdminWorkspaceError).toBeNull();
  });
  test('Action with REMOVE_JIT_ADDRESS_SUCCESS type returns correct state', () => {
    const workspaceRequested = 'workspace-requested-id';
    const action: FirewallAction = {
      type: REMOVE_JIT_ADDRESS_SUCCESS,
    };
    const startState = {
      ...initialState,
      isJitAddressesLoading: true,
      isJitAddressesError: axiosError,
      jitWorkspaceRequested: workspaceRequested,
    };
    const newState = firewallReducer(startState, action);
    expect(newState.isJitAddressesLoading).toBe(false);
    expect(newState.isJitAddressesError).toBeNull();
    expect(newState.jitWorkspaceRequested).toBe(null);
  });
  test('Default case returns initial state', () => {
    const action: FirewallAction = {
      type: null,
    };
    const newState = firewallReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
});
