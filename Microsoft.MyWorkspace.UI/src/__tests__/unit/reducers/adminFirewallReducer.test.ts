import { AxiosError } from 'axios';
import {
  FETCH_ADMIN_CONFIG_PROFILES_BEGIN,
  FETCH_ADMIN_CONFIG_PROFILES_FAILURE,
  FETCH_ADMIN_CONFIG_PROFILES_SUCCESS,
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
import { AdminFirewallAction } from '../../../store/actions/adminFirewallActions';
import adminFirewallReducer, {
  adminFirewallInitialState,
  initialNewConfigProfile,
  initialNewFirewallSettings,
} from '../../../store/reducers/adminFirewallReducer';
import { AxiosErrorTestData } from '../../data/AxiosErrorTestData';
import { ConfigProfileDtoTestData } from '../../data/ConfigProfileDtoTestData';
import { getTestFirewallHubNetworkInfoDto } from '../../data/FirewallHubNetworkInfoDtoTestData';
import { getTestFirewallSettingsDto } from '../../data/FirewallSettingsDtoTestData';
import {
  getTestHubNetworkDto,
  getTestHubNetworkForCreationDto,
} from '../../data/HubNetworkDtoTestData';

const initialState = adminFirewallInitialState;

const axiosError: AxiosError = {
  ...AxiosErrorTestData,
};

describe('Admin Firewall Reducer Tests', () => {
  test('Action with FETCH_ADMIN_FIREWALLS_BEGIN type returns correct state', () => {
    const action: AdminFirewallAction = {
      type: FETCH_ADMIN_FIREWALLS_BEGIN,
    };
    const newState = adminFirewallReducer(initialState, action);
    expect(newState.firewallsLoading).toBe(true);
  });
  test('Action with FETCH_ADMIN_FIREWALLS_SUCCESS type returns correct state', () => {
    const payload = [
      getTestFirewallHubNetworkInfoDto({ TotalAssociatedHubNetworks: 3 }),
      getTestFirewallHubNetworkInfoDto({ TotalAssociatedHubNetworks: 5 }),
    ];
    const action: AdminFirewallAction = {
      type: FETCH_ADMIN_FIREWALLS_SUCCESS,
      payload,
    };
    const startState = {
      ...initialState,
      firewallsLoading: true,
    };
    const newState = adminFirewallReducer(startState, action);
    expect(newState.firewalls).toEqual(payload);
    expect(newState.firewallsLoading).toBe(false);
    expect(newState.getFirewallsError).toBeNull();
  });
  test('Action with FETCH_ADMIN_FIREWALLS_FAILURE type returns correct state', () => {
    const action: AdminFirewallAction = {
      type: FETCH_ADMIN_FIREWALLS_FAILURE,
      payload: axiosError,
    };
    const startState = {
      ...initialState,
      firewallsLoading: true,
    };
    const newState = adminFirewallReducer(startState, action);
    expect(newState.firewallsLoading).toBe(false);
    expect(newState.getFirewallsError).toEqual(axiosError);
  });
  test('Action with SET_SELECTED_ADMIN_FIREWALL type returns correct state with associated hub network', () => {
    const payload = 'firewall-settings-id-1';
    const initialFirewalls = [
      getTestFirewallHubNetworkInfoDto({
        FirewallSettings: getTestFirewallSettingsDto({ ID: payload }),
      }),
      getTestFirewallHubNetworkInfoDto({
        FirewallSettings: getTestFirewallSettingsDto({
          ID: 'firewall-settings-id-2',
        }),
      }),
    ];
    const action: AdminFirewallAction = {
      type: SET_SELECTED_ADMIN_FIREWALL,
      payload,
    };
    const startState = {
      ...initialState,
      firewalls: initialFirewalls,
    };
    const newState = adminFirewallReducer(startState, action);
    expect(newState.originalFirewallSettings).toEqual(
      expect.objectContaining({
        ID: payload,
      })
    );
    expect(newState.editedFirewallSettings).toEqual(
      expect.objectContaining({
        ID: payload,
      })
    );
  });
  test('Action with SET_SELECTED_ADMIN_FIREWALL type returns correct state with no associated hub network', () => {
    const payload = 'invalid-firewall-id';
    const initialFirewalls = [
      getTestFirewallHubNetworkInfoDto({
        FirewallSettings: getTestFirewallSettingsDto({
          ID: 'firewall-settings-id-1',
        }),
      }),
      getTestFirewallHubNetworkInfoDto({
        FirewallSettings: getTestFirewallSettingsDto({
          ID: 'firewall-settings-id-2',
        }),
      }),
    ];

    const action: AdminFirewallAction = {
      type: SET_SELECTED_ADMIN_FIREWALL,
      payload,
    };
    const startState = {
      ...initialState,
      firewalls: initialFirewalls,
    };
    const newState = adminFirewallReducer(startState, action);
    expect(newState.originalFirewallSettings).toBeNull();
    expect(newState.editedFirewallSettings).toBeNull();
  });
  test('Action with SET_SELECTED_ADMIN_FIREWALL_HUB type returns correct state with associated hub network', () => {
    const firewallID = 'firewall-id-1';
    const payload = 'hub-network-id-1';
    const initialFirewalls = [
      getTestFirewallHubNetworkInfoDto({
        FirewallSettings: getTestFirewallSettingsDto({ ID: firewallID }),
        AssociatedHubNetworks: [
          getTestHubNetworkDto({ ID: payload }),
          getTestHubNetworkDto({ ID: 'hub-network-id-2' }),
        ],
      }),
      getTestFirewallHubNetworkInfoDto({
        FirewallSettings: getTestFirewallSettingsDto({ ID: 'firewall-id-2' }),
        AssociatedHubNetworks: [
          getTestHubNetworkDto({ ID: 'hub-network-id-3' }),
          getTestHubNetworkDto({ ID: 'hub-network-id-4' }),
        ],
      }),
    ];
    const action: AdminFirewallAction = {
      type: SET_SELECTED_ADMIN_FIREWALL_HUB,
      payload,
      firewallID,
    };
    const startState = {
      ...initialState,
      firewalls: initialFirewalls,
    };
    const newState = adminFirewallReducer(startState, action);
    expect(newState.originalHubNetwork).toEqual(
      expect.objectContaining({ ID: payload })
    );
    expect(newState.editedHubNetwork).toEqual(
      expect.objectContaining({ ID: payload })
    );
  });
  test('Action with SET_SELECTED_ADMIN_FIREWALL_HUB type returns correct state with no associated hub network', () => {
    const payload = 'invalid-firewall-id';
    const initialFirewalls = [
      getTestFirewallHubNetworkInfoDto({
        AssociatedHubNetworks: [
          getTestHubNetworkDto({ ID: 'hub-network-id-1' }),
          getTestHubNetworkDto({ ID: 'hub-network-id-2' }),
        ],
      }),
      getTestFirewallHubNetworkInfoDto({
        AssociatedHubNetworks: [
          getTestHubNetworkDto({ ID: 'hub-network-id-3' }),
          getTestHubNetworkDto({ ID: 'hub-network-id-4' }),
        ],
      }),
    ];
    const action: AdminFirewallAction = {
      type: SET_SELECTED_ADMIN_FIREWALL_HUB,
      payload,
    };
    const startState = {
      ...initialState,
      firewalls: initialFirewalls,
    };
    const newState = adminFirewallReducer(startState, action);
    expect(newState.originalHubNetwork).toBeNull();
    expect(newState.editedHubNetwork).toBeNull();
  });
  test('Action with UPDATE_SELECTED_ADMIN_FIREWALL type returns correct state', () => {
    const editedFirewallSettings = getTestFirewallSettingsDto({
      ID: 'firewall-setting-id-1',
      Name: 'Firewall Setting 1',
    });
    const action: AdminFirewallAction = {
      type: UPDATE_SELECTED_ADMIN_FIREWALL,
      payload: editedFirewallSettings,
    };
    const newState = adminFirewallReducer(initialState, action);
    expect(newState.editedFirewallSettings).toEqual(editedFirewallSettings);
  });
  test('Action with UPDATE_SELECTED_ADMIN_FIREWALL_HUB type returns correct state', () => {
    const editedHubNetwork = getTestHubNetworkDto({
      ID: 'hub-network-id-1',
      Name: 'Hub Network 1',
    });
    const action: AdminFirewallAction = {
      type: UPDATE_SELECTED_ADMIN_FIREWALL_HUB,
      payload: editedHubNetwork,
    };
    const newState = adminFirewallReducer(initialState, action);
    expect(newState.editedHubNetwork).toEqual(editedHubNetwork);
  });
  test('Action with RESET_SELECTED_ADMIN_FIREWALL type returns correct state', () => {
    const editedFirewallSettings = getTestFirewallSettingsDto({
      ID: 'firewall-setting-id-1',
      Name: 'Firewall Setting 1',
    });
    const action: AdminFirewallAction = {
      type: RESET_SELECTED_ADMIN_FIREWALL,
    };
    const startState = {
      ...initialState,
      editedFirewallSettings,
    };
    const newState = adminFirewallReducer(startState, action);
    expect(newState.editedFirewallSettings).toEqual(
      startState.originalFirewallSettings
    );
  });
  test('Action with RESET_SELECTED_ADMIN_FIREWALL_HUB type returns correct state', () => {
    const editedHubNetwork = getTestHubNetworkDto({
      ID: 'hub-network-id-1',
      Name: 'Hub Network 1',
    });
    const action: AdminFirewallAction = {
      type: RESET_SELECTED_ADMIN_FIREWALL_HUB,
    };
    const startState = {
      ...initialState,
      editedHubNetwork,
    };
    const newState = adminFirewallReducer(startState, action);
    expect(newState.editedHubNetwork).toEqual(startState.originalHubNetwork);
  });
  test('Action with UPDATE_FIREWALL_SETTINGS_BEGIN type returns correct state', () => {
    const action: AdminFirewallAction = {
      type: UPDATE_FIREWALL_SETTINGS_BEGIN,
    };
    const newState = adminFirewallReducer(initialState, action);
    expect(newState.updateFirewallSettingsLoading).toBe(true);
  });
  test('Action with UPDATE_FIREWALL_SETTINGS_SUCCESS type returns correct state', () => {
    const action: AdminFirewallAction = {
      type: UPDATE_FIREWALL_SETTINGS_SUCCESS,
    };
    const startState = {
      ...initialState,
      updateFirewallSettingsLoading: true,
    };
    const newState = adminFirewallReducer(startState, action);
    expect(newState.updateFirewallSettingsLoading).toBe(false);
    expect(newState.updateFirewallSettingsError).toBeNull();
  });
  test('Action with UPDATE_FIREWALL_SETTINGS_FAILURE type returns correct state', () => {
    const action: AdminFirewallAction = {
      type: UPDATE_FIREWALL_SETTINGS_FAILURE,
      payload: axiosError,
    };
    const startState = {
      ...initialState,
      updateFirewallSettingsLoading: true,
    };
    const newState = adminFirewallReducer(startState, action);
    expect(newState.updateFirewallSettingsLoading).toBe(false);
    expect(newState.updateFirewallSettingsError).toEqual(axiosError);
  });
  test('Action with UPDATE_HUB_NETWORK_BEGIN type returns correct state', () => {
    const action: AdminFirewallAction = {
      type: UPDATE_HUB_NETWORK_BEGIN,
    };
    const newState = adminFirewallReducer(initialState, action);
    expect(newState.updateHubNetworkLoading).toBe(true);
  });
  test('Action with UPDATE_HUB_NETWORK_SUCCESS type returns correct state', () => {
    const action: AdminFirewallAction = {
      type: UPDATE_HUB_NETWORK_SUCCESS,
    };
    const startState = {
      ...initialState,
      updateHubNetworkLoading: true,
    };
    const newState = adminFirewallReducer(startState, action);
    expect(newState.updateHubNetworkLoading).toBe(false);
    expect(newState.updateHubNetworkError).toBeNull();
  });
  test('Action with UPDATE_HUB_NETWORK_FAILURE type returns correct state', () => {
    const action: AdminFirewallAction = {
      type: UPDATE_HUB_NETWORK_FAILURE,
      payload: axiosError,
    };
    const startState = {
      ...initialState,
      updateHubNetworkLoading: true,
    };
    const newState = adminFirewallReducer(startState, action);
    expect(newState.updateHubNetworkLoading).toBe(false);
    expect(newState.updateHubNetworkError).toEqual(axiosError);
  });
  test('Action with SET_NEW_FIREWALL_SETTINGS type returns correct state', () => {
    const newFirewallSettings = getTestFirewallSettingsDto({
      ID: 'firewall-setting-id-1',
      Name: 'Firewall Setting 1',
    });
    const action: AdminFirewallAction = {
      type: SET_NEW_FIREWALL_SETTINGS,
    };
    const startState = {
      ...initialState,
      newFirewallSettings,
    };
    const newState = adminFirewallReducer(startState, action);
    expect(newState.newFirewallSettings).toEqual(initialNewFirewallSettings);
  });
});
test('Action with UPDATE_NEW_FIREWALL_SETTINGS type returns correct state', () => {
  const payload = getTestFirewallSettingsDto({
    ID: 'firewall-setting-id-1',
    Name: 'Firewall Setting 1',
  });
  const action: AdminFirewallAction = {
    type: UPDATE_NEW_FIREWALL_SETTINGS,
    payload,
  };
  const newState = adminFirewallReducer(initialState, action);
  expect(newState.newFirewallSettings).toEqual(payload);
});
test('Action with SET_NEW_HUB_NETWORK type returns correct state', () => {
  const payload = getTestHubNetworkForCreationDto({
    Name: 'test-hub-network-1',
  });
  const action: AdminFirewallAction = {
    type: SET_NEW_HUB_NETWORK,
    payload,
  };
  const newState = adminFirewallReducer(initialState, action);
  expect(newState.newHubNetworkOriginal).toEqual(payload);
  expect(newState.newHubNetwork).toEqual(payload);
});
test('Action with UPDATE_NEW_HUB_NETWORK type returns correct state', () => {
  const payload = getTestHubNetworkForCreationDto({
    Name: 'test-hub-network-1',
  });
  const action: AdminFirewallAction = {
    type: UPDATE_NEW_HUB_NETWORK,
    payload,
  };
  const newState = adminFirewallReducer(initialState, action);
  expect(newState.newHubNetwork).toEqual(payload);
});
test('Action with FETCH_ADMIN_CONFIG_PROFILES_BEGIN type returns correct state', () => {
  const action: AdminFirewallAction = {
    type: FETCH_ADMIN_CONFIG_PROFILES_BEGIN,
  };
  const newState = adminFirewallReducer(initialState, action);
  expect(newState.configProfilesLoading).toEqual(true);
});
test('Action with FETCH_ADMIN_CONFIG_PROFILES_SUCCESS type returns correct state', () => {
  const profiles = [ConfigProfileDtoTestData];
  const action: AdminFirewallAction = {
    type: FETCH_ADMIN_CONFIG_PROFILES_SUCCESS,
    payload: profiles,
  };
  const newState = adminFirewallReducer(initialState, action);
  expect(newState.configProfilesLoading).toEqual(false);
  expect(newState.configProfilesError).toEqual(null);
  expect(newState.configProfiles).toEqual(profiles);
});
test('Action with FETCH_ADMIN_CONFIG_PROFILES_FAILURE type returns correct state', () => {
  const action: AdminFirewallAction = {
    type: FETCH_ADMIN_CONFIG_PROFILES_FAILURE,
    payload: axiosError,
  };
  const newState = adminFirewallReducer(initialState, action);
  expect(newState.configProfilesLoading).toEqual(false);
  expect(newState.configProfilesError).toEqual(axiosError);
});
test('Action with UPDATE_NEW_CONFIG_PROFILE type returns correct state', () => {
  const action: AdminFirewallAction = {
    type: UPDATE_NEW_CONFIG_PROFILE,
    payload: ConfigProfileDtoTestData,
  };
  const newState = adminFirewallReducer(initialState, action);
  expect(newState.newConfigProfile).toEqual(ConfigProfileDtoTestData);
});
test('Action with RESET_NEW_CONFIG_PROFILE type returns correct state', () => {
  const action: AdminFirewallAction = {
    type: RESET_NEW_CONFIG_PROFILE,
  };
  const newState = adminFirewallReducer(initialState, action);
  expect(newState.newConfigProfile).toEqual(initialNewConfigProfile);
});
test('Action with SET_SELECTED_CONFIG_PROFILE type returns correct state', () => {
  initialState.configProfiles = [ConfigProfileDtoTestData];
  const action: AdminFirewallAction = {
    type: SET_SELECTED_CONFIG_PROFILE,
    payload: ConfigProfileDtoTestData.ID,
  };
  const newState = adminFirewallReducer(initialState, action);
  expect(newState.originalConfigProfile).toEqual(ConfigProfileDtoTestData);
  expect(newState.editedConfigProfile).toEqual(ConfigProfileDtoTestData);
});
test('Action with UPDATE_SELECTED_CONFIG_PROFILE type returns correct state', () => {
  const data = ConfigProfileDtoTestData;
  data.Name = 'Updated Name';
  const action: AdminFirewallAction = {
    type: UPDATE_SELECTED_CONFIG_PROFILE,
    payload: data,
  };
  const newState = adminFirewallReducer(initialState, action);
  expect(newState.editedConfigProfile).toEqual(data);
});
test('Action with RESET_SELECTED_CONFIG_PROFILE type returns correct state', () => {
  initialState.originalConfigProfile = ConfigProfileDtoTestData;
  initialState.editedConfigProfile = ConfigProfileDtoTestData;
  initialState.editedConfigProfile.Name = 'I was edited';
  const action: AdminFirewallAction = {
    type: RESET_SELECTED_CONFIG_PROFILE,
  };
  const newState = adminFirewallReducer(initialState, action);
  expect(newState.editedConfigProfile).toEqual(ConfigProfileDtoTestData);
});
test('Action with SAVE_SELECTED_CONFIG_PROFILE_BEGIN type returns correct state', () => {
  const action: AdminFirewallAction = {
    type: SAVE_SELECTED_CONFIG_PROFILE_BEGIN,
  };
  const newState = adminFirewallReducer(initialState, action);
  expect(newState.editedConfigProfileSaving).toEqual(true);
});
test('Action with SAVE_SELECTED_CONFIG_PROFILE_FAILURE type returns correct state', () => {
  const action: AdminFirewallAction = {
    type: SAVE_SELECTED_CONFIG_PROFILE_FAILURE,
    payload: axiosError,
  };
  const newState = adminFirewallReducer(initialState, action);
  expect(newState.editedConfigProfileSaving).toEqual(false);
  expect(newState.editedConfigProfileSavingError).toEqual(axiosError);
});
test('Action with SAVE_SELECTED_CONFIG_PROFILE_SUCCESS type returns correct state', () => {
  const action: AdminFirewallAction = {
    type: SAVE_SELECTED_CONFIG_PROFILE_SUCCESS,
    payload: axiosError,
  };
  const newState = adminFirewallReducer(initialState, action);
  expect(newState.editedConfigProfileSaving).toEqual(false);
  expect(newState.originalConfigProfile).toEqual(null);
  expect(newState.editedConfigProfile).toEqual(null);
});
test('Default case returns initial state', () => {
  const action: AdminFirewallAction = {
    type: null,
  };
  const newState = adminFirewallReducer(initialState, action);
  expect(newState).toEqual(initialState);
});
