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
} from '../../../store/actions/actionTypes';
import { JitAddressWithIP } from '../../../types/FirewallManager/JitAddressWithIP';
import { httpAuthService } from '../../../applicationInsights/httpAuthService';
import ErrorAction from '../../../store/actions/errorAction';
import { getMockStore } from '../../utils/mockStore.util';
import {
  activateExternalConnectivityJitEntry,
  addJitAddress,
  deactivateExternalConnectivityJitEntry,
  fetchExternalConnectivityJitEntries,
  fetchFirewallApiVersion,
  fetchJitAddresses,
  fetchJitAddressesForAdminWorkspace,
  removeJitAddress,
} from '../../../store/actions';
import { JitAddressDto } from '../../../types/FirewallManager/JitAddressDto';
import { CreateJitAddressPartialDto } from '../../../types/FirewallManager/CreateJitAddressDto';
import { NatRuleJitEntryDto } from '../../../types/AzureWorkspace/NatRuleJitEntryDto.types';
import { NatRuleJitEntryForCreationDto } from '../../../types/ResourceCreation/NatRuleJitEntryForCreationDto.types';
import { getTestJitAddressDto } from '../../data/JitAddressDtoTestData';
import { getTestNatRuleJitEntryDto } from '../../data/NatRuleJitEntryDtoTestData';

jest.mock('../../../store/actions/errorAction');
jest.mock('../../../applicationInsights/TelemetryService.tsx');
jest.mock('src/applicationInsights/httpAuthService.ts');

(ErrorAction as jest.Mock).mockReturnValue(true);
const failure = { response: { status: 400 } };

const store = getMockStore();

describe('Firewall Action Tests', () => {
  beforeEach(() => {
    // Runs before each test in the suite
    store.clearActions();
  });
  test('fetchJitAddresses action creator dispatches expected actions on success', async () => {
    const mockData: { data: JitAddressWithIP } = {
      data: {
        IP: 'test',
        Addresses: [
          getTestJitAddressDto({ ID: 'test-jit-address-id-1' }),
          getTestJitAddressDto({ ID: 'test-jit-address-id-2' }),
        ],
      },
    };
    (httpAuthService.get as jest.Mock).mockReturnValue(mockData);
    const expectedActions = [
      {
        type: FETCH_JIT_ADDRESSES_BEGIN,
      },
      {
        type: FETCH_JIT_ADDRESSES_SUCCESS,
        payload: mockData.data,
      },
    ];
    await fetchJitAddresses()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchJitAddresses action creator dispatches expected actions on failure', async () => {
    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      {
        type: FETCH_JIT_ADDRESSES_BEGIN,
      },
      {
        type: FETCH_JIT_ADDRESSES_FAILURE,
        payload: failure,
      },
    ];
    await fetchJitAddresses()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchJitAddressesForAdminWorkspace action creator dispatches expected actions on success', async () => {
    const workspaceID = 'testid';
    const mockData: { data: JitAddressDto[] } = {
      data: [
        getTestJitAddressDto({ ID: 'test-jit-address-id-1' }),
        getTestJitAddressDto({ ID: 'test-jit-address-id-2' }),
      ],
    };
    (httpAuthService.get as jest.Mock).mockReturnValue(mockData);
    const expectedActions = [
      {
        type: FETCH_JIT_ADDRESSES_FOR_ADMIN_WORKSPACE_BEGIN,
      },
      {
        type: FETCH_JIT_ADDRESSES_FOR_ADMIN_WORKSPACE_SUCCESS,
        payload: mockData.data,
      },
    ];
    await fetchJitAddressesForAdminWorkspace(workspaceID)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchJitAddressesForAdminWorkspace action creator dispatches expected actions on failure', async () => {
    const workspaceID = 'testid';
    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      {
        type: FETCH_JIT_ADDRESSES_FOR_ADMIN_WORKSPACE_BEGIN,
      },
      {
        type: FETCH_JIT_ADDRESSES_FOR_ADMIN_WORKSPACE_FAILURE,
        payload: failure,
      },
    ];
    await fetchJitAddressesForAdminWorkspace(workspaceID)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('addJitAddress action creator dispatches expected actions on success', async () => {
    const mockData: { data: CreateJitAddressPartialDto } = {
      data: { WorkspaceID: 'testID' } as CreateJitAddressPartialDto,
    };
    (httpAuthService.post as jest.Mock).mockReturnValue(mockData);
    const expectedActions = [
      {
        type: ADD_JIT_ADDRESS_BEGIN,
        payload: mockData.data.WorkspaceID,
      },
      {
        type: ADD_JIT_ADDRESS_SUCCESS,
        payload: mockData.data,
      },
    ];
    await addJitAddress(mockData.data)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('addJitAddress action creator dispatches expected actions on failure', async () => {
    const mockData: { data: CreateJitAddressPartialDto } = {
      data: { WorkspaceID: 'testID' } as CreateJitAddressPartialDto,
    };
    (httpAuthService.post as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      {
        type: ADD_JIT_ADDRESS_BEGIN,
        payload: mockData.data.WorkspaceID,
      },
      {
        type: ADD_JIT_ADDRESS_FAILURE,
        payload: failure,
      },
    ];
    await addJitAddress(mockData.data)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('removeJitAddress action creator dispatches expected actions on success', async () => {
    const id = 'testID';
    const workspaceID = 'workspaceID';
    const mockData = { data: '1.0.0' };
    (httpAuthService.delete as jest.Mock).mockReturnValue(true);
    (httpAuthService.get as jest.Mock).mockReturnValue(mockData);
    const expectedActions = [
      {
        type: REMOVE_JIT_ADDRESS_BEGIN,
        payload: workspaceID,
      },
      {
        type: REMOVE_JIT_ADDRESS_SUCCESS,
      },
      { type: FETCH_JIT_ADDRESSES_BEGIN },
      { type: FETCH_JIT_ADDRESSES_SUCCESS, payload: mockData.data },
    ];
    await removeJitAddress(id, workspaceID)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('removeJitAddress action creator dispatches expected actions on failure', async () => {
    const id = 'testID';
    const workspaceID = 'workspaceID';
    (httpAuthService.delete as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      {
        type: REMOVE_JIT_ADDRESS_BEGIN,
        payload: workspaceID,
      },
      {
        type: REMOVE_JIT_ADDRESS_FAILURE,
        payload: failure,
      },
    ];
    await removeJitAddress(id, workspaceID)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchFirewallApiVersion action creator dispatches expected actions on success', async () => {
    const mockData = { data: '1.0.0' };
    (httpAuthService.get as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      {
        type: FETCH_FIREWALL_API_VERSION_BEGIN,
      },
      {
        type: FETCH_FIREWALL_API_VERSION_SUCCESS,
        payload: mockData.data,
      },
    ];
    await fetchFirewallApiVersion()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchFirewallApiVersion action creator dispatches expected actions on failure', async () => {
    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      {
        type: FETCH_FIREWALL_API_VERSION_BEGIN,
      },
      {
        type: FETCH_FIREWALL_API_VERSION_FAILURE,
        payload: failure,
      },
    ];
    await fetchFirewallApiVersion()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('activateExternalConnectivityJitEntry action creator dispatches expected actions on success', async () => {
    const mockData: { data: NatRuleJitEntryDto[] } = {
      data: [
        getTestNatRuleJitEntryDto({ ID: 'test-nat-rule-jit-entry-id-1' }),
        getTestNatRuleJitEntryDto({ ID: 'test-nat-rule-jit-entry-id-2' }),
      ],
    };
    (httpAuthService.post as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      {
        type: ACTIVATE_EC_JIT_ENTRY_BEGIN,
      },
      {
        type: ACTIVATE_EC_JIT_ENTRY_SUCCESS,
        payload: mockData.data,
      },
    ];
    await activateExternalConnectivityJitEntry(
      {} as NatRuleJitEntryForCreationDto
    )(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('activateExternalConnectivityJitEntry action creator dispatches expected actions on failure', async () => {
    (httpAuthService.post as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      {
        type: ACTIVATE_EC_JIT_ENTRY_BEGIN,
      },
      {
        type: ACTIVATE_EC_JIT_ENTRY_FAILURE,
        payload: failure,
      },
    ];
    await activateExternalConnectivityJitEntry(
      {} as NatRuleJitEntryForCreationDto
    )(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('deactivateExternalConnectivityJitEntry action creator dispatches expected actions on success', async () => {
    const workspaceID = 'testID';
    (httpAuthService.delete as jest.Mock).mockResolvedValue(true);
    const expectedActions = [
      {
        type: DEACTIVATE_EC_JIT_ENTRY_BEGIN,
      },
      {
        type: DEACTIVATE_EC_JIT_ENTRY_SUCCESS,
        payload: workspaceID,
      },
    ];
    await deactivateExternalConnectivityJitEntry(workspaceID)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('deactivateExternalConnectivityJitEntry action creator dispatches expected actions on failure', async () => {
    const workspaceID = 'testID';
    (httpAuthService.delete as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      {
        type: DEACTIVATE_EC_JIT_ENTRY_BEGIN,
      },
      {
        type: DEACTIVATE_EC_JIT_ENTRY_FAILURE,
        payload: failure,
      },
    ];
    await deactivateExternalConnectivityJitEntry(workspaceID)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchExternalConnectivityJitEntries action creator dispatches expected actions on success', async () => {
    const mockData: { data: NatRuleJitEntryDto[] } = {
      data: [
        getTestNatRuleJitEntryDto({ ID: 'test-nat-rule-jit-entry-id-1' }),
        getTestNatRuleJitEntryDto({ ID: 'test-nat-rule-jit-entry-id-2' }),
      ],
    };
    (httpAuthService.get as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      {
        type: FETCH_EC_JIT_ENTRIES_BEGIN,
      },
      {
        type: FETCH_EC_JIT_ENTRIES_SUCCESS,
        payload: mockData.data,
      },
    ];
    await fetchExternalConnectivityJitEntries()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchExternalConnectivityJitEntries action creator dispatches expected actions on failure', async () => {
    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      {
        type: FETCH_EC_JIT_ENTRIES_BEGIN,
      },
      {
        type: FETCH_EC_JIT_ENTRIES_FAILURE,
        payload: failure,
      },
    ];
    await fetchExternalConnectivityJitEntries()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
});
