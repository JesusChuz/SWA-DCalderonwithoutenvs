import {
  createConfigProfile,
  createFirewallHubNetwork,
  createFirewallSettings,
  deleteConfigProfile,
  fetchAdminFirewalls,
  resetNewConfigProfile,
  resetSelectedAdminFirewallHub,
  resetSelectedAdminFirewallSettings,
  resetSelectedConfigProfile,
  saveSelectedConfigProfile,
  setNewAdminFirewallHub,
  setNewAdminFirewallSettings,
  setSelectedAdminFirewallHubId,
  setSelectedAdminFirewallId,
  setSelectedConfigProfile,
  updateFirewallHubNetwork,
  updateFirewallSettings,
  updateNewAdminFirewallHub,
  updateNewAdminFirewallSettings,
  updateNewConfigProfile,
  updateSelectedAdminFirewallHub,
  updateSelectedAdminFirewallSettings,
  updateSelectedConfigProfile,
} from '../../../store/actions/adminFirewallActions';
import { getMockStore } from '../../utils/mockStore.util';
import { httpAuthService } from '../../../applicationInsights/httpAuthService';
import {
  CREATE_CONFIG_PROFILE_BEGIN,
  CREATE_CONFIG_PROFILE_FAILURE,
  CREATE_CONFIG_PROFILE_SUCCESS,
  CREATE_FIREWALL_SETTINGS_BEGIN,
  CREATE_FIREWALL_SETTINGS_FAILURE,
  CREATE_FIREWALL_SETTINGS_SUCCESS,
  CREATE_HUB_NETWORK_BEGIN,
  CREATE_HUB_NETWORK_FAILURE,
  CREATE_HUB_NETWORK_SUCCESS,
  DELETE_SELECTED_CONFIG_PROFILE_BEGIN,
  DELETE_SELECTED_CONFIG_PROFILE_FAILURE,
  DELETE_SELECTED_CONFIG_PROFILE_SUCCESS,
  FETCH_ADMIN_CONFIG_PROFILES_BEGIN,
  FETCH_ADMIN_FIREWALLS_BEGIN,
  FETCH_ADMIN_FIREWALLS_FAILURE,
  FETCH_ADMIN_FIREWALLS_SUCCESS,
  RESET_NEW_CONFIG_PROFILE,
  RESET_SELECTED_ADMIN_FIREWALL,
  RESET_SELECTED_ADMIN_FIREWALL_HUB,
  RESET_SELECTED_CONFIG_PROFILE,
  SAVE_SELECTED_CONFIG_PROFILE_BEGIN,
  SAVE_SELECTED_CONFIG_PROFILE_FAILURE,
  SAVE_SELECTED_CONFIG_PROFILE_SUCCESS,
  SET_NEW_FIREWALL_SETTINGS,
  SET_NEW_HUB_NETWORK,
  SET_SELECTED_ADMIN_FIREWALL,
  SET_SELECTED_ADMIN_FIREWALL_HUB,
  SET_SELECTED_CONFIG_PROFILE,
  SHOW_SUCCESS_NOTIFICATION,
  UPDATE_FIREWALL_SETTINGS_BEGIN,
  UPDATE_FIREWALL_SETTINGS_FAILURE,
  UPDATE_FIREWALL_SETTINGS_SUCCESS,
  UPDATE_HUB_NETWORK_BEGIN,
  UPDATE_HUB_NETWORK_FAILURE,
  UPDATE_HUB_NETWORK_SUCCESS,
  UPDATE_NEW_CONFIG_PROFILE,
  UPDATE_NEW_FIREWALL_SETTINGS,
  UPDATE_NEW_HUB_NETWORK,
  UPDATE_SELECTED_ADMIN_FIREWALL,
  UPDATE_SELECTED_ADMIN_FIREWALL_HUB,
  UPDATE_SELECTED_CONFIG_PROFILE,
} from '../../../store/actions/actionTypes';
import ErrorAction from '../../../store/actions/errorAction';
import { HubNetworkDto } from '../../../types/FirewallManager/HubNetworkDto';
import { FirewallSettingsDto } from '../../../types/FirewallManager/FirewallSettingsDto';
import { FirewallSettingsDtoTestData } from '../../data/FirewallSettingsDtoTestData';
import {
  HubNetworkDtoTestData,
  HubNetworkForCreationDtoTestData,
} from '../../data/HubNetworkDtoTestData';
import { FirewallHubNetworkInfoDto } from '../../../types/FirewallManager/FirewallHubNetworkInfoDto';
import { getTestFirewallHubNetworkInfoDto } from '../../data/FirewallHubNetworkInfoDtoTestData';
import { ConfigProfileDtoTestData } from '../../data/ConfigProfileDtoTestData';
import { initialNewConfigProfile } from '../../../store/reducers/adminFirewallReducer';

jest.mock('../../../store/actions/errorAction');
jest.mock('../../../applicationInsights/TelemetryService.tsx');
jest.mock('src/applicationInsights/httpAuthService.ts');

(ErrorAction as jest.Mock).mockReturnValue(true);
const failure = {
  response: {
    status: 400,
  },
};

const store = getMockStore();

describe('Admin Firewall Action Tests', () => {
  beforeEach(() => {
    // Runs before each test in the suite
    store.clearActions();
  });
  test('fetchAdminFirewalls action creator contains expected actions on success', async () => {
    const mockData: { data: FirewallHubNetworkInfoDto[] } = {
      data: [
        getTestFirewallHubNetworkInfoDto({
          TotalAssociatedHubNetworks: 1,
          TotalSpokeNetworkConsumed: 2,
        }),
      ],
    };
    (httpAuthService.get as jest.Mock).mockReturnValue(mockData);
    const expectedActions = [
      { type: FETCH_ADMIN_FIREWALLS_BEGIN },
      {
        type: FETCH_ADMIN_FIREWALLS_SUCCESS,
        payload: mockData.data,
      },
    ];
    await fetchAdminFirewalls()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchAdminFirewalls action creator contains expected actions on failure', async () => {
    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: FETCH_ADMIN_FIREWALLS_BEGIN },
      {
        type: FETCH_ADMIN_FIREWALLS_FAILURE,
        payload: failure,
      },
    ];
    await fetchAdminFirewalls()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('setSelectedAdminFirewallId action creator contains expected action', () => {
    const newID = '10000000-0000-0000-0000-000000000000';
    const expectedAction = {
      type: SET_SELECTED_ADMIN_FIREWALL,
      payload: newID,
    };
    store.dispatch(setSelectedAdminFirewallId(newID));
    expect(store.getActions()).toEqual([expectedAction]);
  });

  test('setSelectedAdminFirewallHubId action creator contains expected action', () => {
    const hubID = '10000000-0000-0000-0000-000000000000';
    const firewallID = '20000000-0000-0000-0000-000000000000';
    const expectedAction = {
      type: SET_SELECTED_ADMIN_FIREWALL_HUB,
      firewallID,
      payload: hubID,
    };
    store.dispatch(setSelectedAdminFirewallHubId(firewallID, hubID));
    expect(store.getActions()).toEqual([expectedAction]);
  });
  test('updateSelectedAdminFirewallSettings action creator contains expected action', () => {
    const firewallSettings: FirewallSettingsDto = FirewallSettingsDtoTestData;
    const expectedAction = {
      type: UPDATE_SELECTED_ADMIN_FIREWALL,
      payload: firewallSettings,
    };
    store.dispatch(updateSelectedAdminFirewallSettings(firewallSettings));
    expect(store.getActions()).toEqual([expectedAction]);
  });
  test('updateSelectedAdminFirewallHub action creator contains expected action', () => {
    const hubNetwork: HubNetworkDto = HubNetworkDtoTestData;
    const expectedAction = {
      type: UPDATE_SELECTED_ADMIN_FIREWALL_HUB,
      payload: hubNetwork,
    };
    store.dispatch(updateSelectedAdminFirewallHub(hubNetwork));
    expect(store.getActions()).toEqual([expectedAction]);
  });
  test('resetSelectedAdminFirewallSettings action creator contains expected action', () => {
    const expectedAction = { type: RESET_SELECTED_ADMIN_FIREWALL };
    store.dispatch(resetSelectedAdminFirewallSettings());
    expect(store.getActions()).toEqual([expectedAction]);
  });

  test('resetSelectedAdminFirewallHub action creator contains expected action', () => {
    const expectedAction = { type: RESET_SELECTED_ADMIN_FIREWALL_HUB };
    store.dispatch(resetSelectedAdminFirewallHub());
    expect(store.getActions()).toEqual([expectedAction]);
  });

  test('updateFirewallSettings action creator contains expected actions on success', async () => {
    const firewallSettings = FirewallSettingsDtoTestData;
    const mockData = { data: firewallSettings, status: 204 };
    (httpAuthService.put as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      { type: UPDATE_FIREWALL_SETTINGS_BEGIN },
      {
        type: SHOW_SUCCESS_NOTIFICATION,
        message: 'Updating Firewall Settings.',
      },
      {
        type: UPDATE_FIREWALL_SETTINGS_SUCCESS,
      },
      {
        type: FETCH_ADMIN_FIREWALLS_BEGIN,
      },
    ];
    await updateFirewallSettings(firewallSettings)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('updateFirewallSettings action creator contains expected actions on failure', async () => {
    const firewallSettings = FirewallSettingsDtoTestData;
    (httpAuthService.put as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: UPDATE_FIREWALL_SETTINGS_BEGIN },
      {
        type: SHOW_SUCCESS_NOTIFICATION,
        message: 'Updating Firewall Settings.',
      },
      {
        type: UPDATE_FIREWALL_SETTINGS_FAILURE,
        payload: failure,
      },
    ];
    await updateFirewallSettings(firewallSettings)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('updateFirewallHubNetwork action creator contains expected actions on success', async () => {
    const hubNetwork = HubNetworkDtoTestData;
    const mockData = { data: hubNetwork, status: 204 };
    (httpAuthService.put as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      { type: UPDATE_HUB_NETWORK_BEGIN },
      {
        type: SHOW_SUCCESS_NOTIFICATION,
        message: 'Updating Hub Network.',
      },
      {
        type: UPDATE_HUB_NETWORK_SUCCESS,
      },
      {
        type: FETCH_ADMIN_FIREWALLS_BEGIN,
      },
    ];
    await updateFirewallHubNetwork(hubNetwork)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('updateFirewallHubNetwork action creator contains expected actions on failure', async () => {
    const hubNetwork = HubNetworkDtoTestData;
    (httpAuthService.put as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: UPDATE_HUB_NETWORK_BEGIN },
      {
        type: SHOW_SUCCESS_NOTIFICATION,
        message: 'Updating Hub Network.',
      },
      {
        type: UPDATE_HUB_NETWORK_FAILURE,
        payload: failure,
      },
    ];
    await updateFirewallHubNetwork(hubNetwork)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('setNewAdminFirewallSettings action creator contains expected action', () => {
    const expectedAction = { type: SET_NEW_FIREWALL_SETTINGS };
    store.dispatch(setNewAdminFirewallSettings());
    expect(store.getActions()).toEqual([expectedAction]);
  });

  test('setNewAdminFirewallHub action creator contains expected action', () => {
    const hubNetwork = HubNetworkForCreationDtoTestData;
    const expectedAction = { type: SET_NEW_HUB_NETWORK, payload: hubNetwork };
    store.dispatch(setNewAdminFirewallHub(hubNetwork));
    expect(store.getActions()).toEqual([expectedAction]);
  });
  test('updateNewAdminFirewallSettings action creator contains expected action', () => {
    const firewallSettings = FirewallSettingsDtoTestData;
    const expectedAction = {
      type: UPDATE_NEW_FIREWALL_SETTINGS,
      payload: firewallSettings,
    };
    store.dispatch(updateNewAdminFirewallSettings(firewallSettings));
    expect(store.getActions()).toEqual([expectedAction]);
  });

  test('updateNewAdminFirewallHub action creator contains expected action', () => {
    const hubNetwork = HubNetworkForCreationDtoTestData;
    const expectedAction = {
      type: UPDATE_NEW_HUB_NETWORK,
      payload: hubNetwork,
    };
    store.dispatch(updateNewAdminFirewallHub(hubNetwork));
    expect(store.getActions()).toEqual([expectedAction]);
  });

  test('createFirewallSettings action creator contains expected actions on success', async () => {
    const firewallSettings = FirewallSettingsDtoTestData;
    const mockData = { data: firewallSettings, status: 204 };
    (httpAuthService.post as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      { type: CREATE_FIREWALL_SETTINGS_BEGIN },
      {
        type: SHOW_SUCCESS_NOTIFICATION,
        message: 'Created firewall settings.',
      },
      {
        type: CREATE_FIREWALL_SETTINGS_SUCCESS,
      },
      {
        type: FETCH_ADMIN_FIREWALLS_BEGIN,
      },
    ];
    await createFirewallSettings(firewallSettings)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('createFirewallSettings action creator contains expected actions on failure', async () => {
    const firewallSettings = FirewallSettingsDtoTestData;
    (httpAuthService.post as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: CREATE_FIREWALL_SETTINGS_BEGIN },
      {
        type: CREATE_FIREWALL_SETTINGS_FAILURE,
        payload: failure,
      },
    ];
    await createFirewallSettings(firewallSettings)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('createFirewallHubNetwork action creator contains expected actions on success', async () => {
    const hubNetwork = HubNetworkForCreationDtoTestData;
    const mockData = { data: hubNetwork, status: 204 };
    (httpAuthService.post as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      { type: CREATE_HUB_NETWORK_BEGIN },
      {
        type: SHOW_SUCCESS_NOTIFICATION,
        message: 'Creating Hub Network.',
      },
      {
        type: CREATE_HUB_NETWORK_SUCCESS,
      },
      {
        type: FETCH_ADMIN_FIREWALLS_BEGIN,
      },
    ];
    await createFirewallHubNetwork(hubNetwork)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('createFirewallHubNetwork action creator contains expected actions on failure', async () => {
    const hubNetwork = HubNetworkForCreationDtoTestData;
    (httpAuthService.post as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: CREATE_HUB_NETWORK_BEGIN },
      {
        type: SHOW_SUCCESS_NOTIFICATION,
        message: 'Creating Hub Network.',
      },
      {
        type: CREATE_HUB_NETWORK_FAILURE,
        payload: failure,
      },
    ];
    await createFirewallHubNetwork(hubNetwork)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('createConfigProfile action creator contains expected actions on success', async () => {
    const profile = initialNewConfigProfile;
    const mockData = { data: profile, status: 204 };
    (httpAuthService.post as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      {
        type: CREATE_CONFIG_PROFILE_BEGIN,
      },
      {
        type: CREATE_CONFIG_PROFILE_SUCCESS,
      },
      {
        type: SHOW_SUCCESS_NOTIFICATION,
        message: 'Configuration profile created.',
      },
      {
        type: FETCH_ADMIN_CONFIG_PROFILES_BEGIN,
      },
    ];
    await createConfigProfile()(store.dispatch, store.getState);
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('createConfigProfile action creator contains expected actions on failure', async () => {
    (httpAuthService.post as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: CREATE_CONFIG_PROFILE_BEGIN },
      {
        type: CREATE_CONFIG_PROFILE_FAILURE,
        payload: failure,
      },
    ];
    await createConfigProfile()(store.dispatch, store.getState);
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('deleteConfigProfile action creator contains expected actions on success', async () => {
    const mockData = { status: 204 };
    (httpAuthService.delete as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      {
        type: DELETE_SELECTED_CONFIG_PROFILE_BEGIN,
      },
      {
        type: DELETE_SELECTED_CONFIG_PROFILE_SUCCESS,
      },
      {
        type: SHOW_SUCCESS_NOTIFICATION,
        message: 'Configuration profile deleted.',
      },
      {
        type: FETCH_ADMIN_CONFIG_PROFILES_BEGIN,
      },
    ];
    await deleteConfigProfile('test-id')(store.dispatch, store.getState);
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('deleteConfigProfile action creator contains expected actions on failure', async () => {
    (httpAuthService.delete as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: DELETE_SELECTED_CONFIG_PROFILE_BEGIN },
      {
        type: DELETE_SELECTED_CONFIG_PROFILE_FAILURE,
        payload: failure,
      },
    ];
    await deleteConfigProfile('test-id')(store.dispatch, store.getState);
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('updateNewConfigProfile action creator contains expected action', () => {
    const config = ConfigProfileDtoTestData;
    const expectedAction = {
      type: UPDATE_NEW_CONFIG_PROFILE,
      payload: config,
    };
    store.dispatch(updateNewConfigProfile(config));
    expect(store.getActions()).toEqual([expectedAction]);
  });

  test('resetNewConfigProfile action creator contains expected action', () => {
    const expectedAction = {
      type: RESET_NEW_CONFIG_PROFILE,
    };
    store.dispatch(resetNewConfigProfile());
    expect(store.getActions()).toEqual([expectedAction]);
  });

  test('setSelectedConfigProfile action creator contains expected action', () => {
    const id = 'test-id';
    const expectedAction = {
      type: SET_SELECTED_CONFIG_PROFILE,
      payload: id,
    };
    store.dispatch(setSelectedConfigProfile(id));
    expect(store.getActions()).toEqual([expectedAction]);
  });

  test('updateSelectedConfigProfile action creator contains expected action', () => {
    const config = ConfigProfileDtoTestData;
    const expectedAction = {
      type: UPDATE_SELECTED_CONFIG_PROFILE,
      payload: config,
    };
    store.dispatch(updateSelectedConfigProfile(config));
    expect(store.getActions()).toEqual([expectedAction]);
  });

  test('resetSelectedConfigProfile action creator contains expected action', () => {
    const expectedAction = {
      type: RESET_SELECTED_CONFIG_PROFILE,
    };
    store.dispatch(resetSelectedConfigProfile());
    expect(store.getActions()).toEqual([expectedAction]);
  });

  test('saveSelectedConfigProfile action creator contains expected action on success', async () => {
    (httpAuthService.put as jest.Mock).mockReturnValue({ status: 204 });
    const expectedActions = [
      { type: SAVE_SELECTED_CONFIG_PROFILE_BEGIN },
      { type: SAVE_SELECTED_CONFIG_PROFILE_SUCCESS },
    ];
    await saveSelectedConfigProfile()(store.dispatch, store.getState);
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('saveSelectedConfigProfile action creator contains expected action on failure', async () => {
    (httpAuthService.put as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: SAVE_SELECTED_CONFIG_PROFILE_BEGIN },
      { type: SAVE_SELECTED_CONFIG_PROFILE_FAILURE, payload: failure },
    ];
    await saveSelectedConfigProfile()(store.dispatch, store.getState);
    expect(store.getActions()).toEqual(expectedActions);
  });
});
