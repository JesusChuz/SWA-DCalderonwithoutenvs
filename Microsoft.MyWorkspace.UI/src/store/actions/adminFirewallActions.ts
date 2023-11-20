import { Action, Dispatch } from '@reduxjs/toolkit';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import {
  FETCH_ADMIN_FIREWALLS_BEGIN,
  FETCH_ADMIN_FIREWALLS_SUCCESS,
  FETCH_ADMIN_FIREWALLS_FAILURE,
  SET_SELECTED_ADMIN_FIREWALL,
  SET_SELECTED_ADMIN_FIREWALL_HUB,
  UPDATE_SELECTED_ADMIN_FIREWALL,
  UPDATE_SELECTED_ADMIN_FIREWALL_HUB,
  RESET_SELECTED_ADMIN_FIREWALL,
  RESET_SELECTED_ADMIN_FIREWALL_HUB,
  UPDATE_FIREWALL_SETTINGS_BEGIN,
  UPDATE_FIREWALL_SETTINGS_SUCCESS,
  UPDATE_FIREWALL_SETTINGS_FAILURE,
  UPDATE_HUB_NETWORK_BEGIN,
  UPDATE_HUB_NETWORK_SUCCESS,
  UPDATE_HUB_NETWORK_FAILURE,
  SET_NEW_FIREWALL_SETTINGS,
  SET_NEW_HUB_NETWORK,
  UPDATE_NEW_FIREWALL_SETTINGS,
  UPDATE_NEW_HUB_NETWORK,
  CREATE_FIREWALL_SETTINGS_BEGIN,
  CREATE_FIREWALL_SETTINGS_SUCCESS,
  CREATE_FIREWALL_SETTINGS_FAILURE,
  CREATE_HUB_NETWORK_BEGIN,
  CREATE_HUB_NETWORK_SUCCESS,
  CREATE_HUB_NETWORK_FAILURE,
  FETCH_ADMIN_CONFIG_PROFILES_BEGIN,
  FETCH_ADMIN_CONFIG_PROFILES_SUCCESS,
  FETCH_ADMIN_CONFIG_PROFILES_FAILURE,
  UPDATE_NEW_CONFIG_PROFILE,
  SET_SELECTED_CONFIG_PROFILE,
  UPDATE_SELECTED_CONFIG_PROFILE,
  RESET_SELECTED_CONFIG_PROFILE,
  CREATE_CONFIG_PROFILE_BEGIN,
  CREATE_CONFIG_PROFILE_FAILURE,
  CREATE_CONFIG_PROFILE_SUCCESS,
  RESET_NEW_CONFIG_PROFILE,
  SAVE_SELECTED_CONFIG_PROFILE_BEGIN,
  SAVE_SELECTED_CONFIG_PROFILE_FAILURE,
  SAVE_SELECTED_CONFIG_PROFILE_SUCCESS,
  DELETE_SELECTED_CONFIG_PROFILE_BEGIN,
  DELETE_SELECTED_CONFIG_PROFILE_SUCCESS,
  DELETE_SELECTED_CONFIG_PROFILE_FAILURE,
  SET_SELECTED_FIREWALLS,
  CREATE_HUB_NETWORK_DNS_RECORD_CREATION_JOB_BEGIN,
  CREATE_HUB_NETWORK_DNS_RECORD_CREATION_JOB_SUCCESS,
  CREATE_HUB_NETWORK_DNS_RECORD_CREATION_JOB_FAILURE,
  DEPLOY_NEW_FIREWALL_BEGIN,
  DEPLOY_NEW_FIREWALL_SUCCESS,
  DEPLOY_NEW_FIREWALL_FAILURE,
  UPDATE_NEW_FIREWALL_DEPLOYMENT,
  SET_NEW_FIREWALL_DEPLOYMENT,
  FETCH_FIREWALL_DEPLOYMENT_REGION_BEGIN,
  FETCH_FIREWALL_DEPLOYMENT_REGION_FAILURE,
  FETCH_FIREWALL_DEPLOYMENT_REGION_SUCCESS,
  FETCH_FIREWALL_TENANTS_BEGIN,
  FETCH_FIREWALL_TENANTS_FAILURE,
  FETCH_FIREWALL_TENANTS_SUCCESS,
  FIREWALL_SOFTWARE_UPDATE_BEGIN,
  FIREWALL_SOFTWARE_UPDATE_SUCCESS,
  FIREWALL_SOFTWARE_UPDATE_FAILURE,
  FETCH_FIREWALL_SOFTWARE_VERSIONS_BEGIN,
  FETCH_FIREWALL_SOFTWARE_VERSIONS_SUCCESS,
  FETCH_FIREWALL_SOFTWARE_VERSIONS_FAILURE,
} from './actionTypes';
import ErrorAction from './errorAction';
import {
  showDefaultNotification,
  showSuccessNotification,
} from './notificationActions';
import { httpAuthService } from '../../applicationInsights/httpAuthService';
import { FirewallHubNetworkInfoDto } from '../../types/FirewallManager/FirewallHubNetworkInfoDto';
import { FirewallSettingsDto } from '../../types/FirewallManager/FirewallSettingsDto';
import { HubNetworkDto } from '../../types/FirewallManager/HubNetworkDto';
import { HubNetworkForCreationDto } from '../../types/ResourceCreation/HubNetworkForCreationDto.types';
import { ConfigProfileDto } from '../../types/FirewallManager/ConfigProfileDto.types';
import { ConfigProfileForCreationDto } from '../../types/ResourceCreation/ConfigProfileForCreationDto.types';
import { MyWorkspacesStore } from '../reducers/rootReducer';
import { HubNetworkDnsRecordCreationJobDto } from '../../types/FirewallManager/HubNetworkDnsRecordCreationJobDto';
import { FirewallDeploymentDto } from '../../types/FirewallManager/FirewallDeploymentDto';
import { FirewallTenantDto } from '../../types/FirewallManager/FirewallTenantDto';

export interface AdminFirewallAction extends Action {
  payload?:
    | FirewallHubNetworkInfoDto[]
    | AxiosError
    | string
    | string[]
    | FirewallSettingsDto
    | HubNetworkDto
    | HubNetworkForCreationDto
    | ConfigProfileForCreationDto
    | ConfigProfileDto
    | ConfigProfileDto[]
    | FirewallDeploymentDto
    | FirewallTenantDto[];
  firewallID?: string;
}

export const fetchAdminConfigProfilesBegin = () => ({
  type: FETCH_ADMIN_CONFIG_PROFILES_BEGIN,
});

export const fetchAdminConfigProfilesSuccess = (
  payload: ConfigProfileDto[]
) => ({
  type: FETCH_ADMIN_CONFIG_PROFILES_SUCCESS,
  payload,
});

export const fetchAdminConfigProfilesError = (error: AxiosError | string) => ({
  type: FETCH_ADMIN_CONFIG_PROFILES_FAILURE,
  payload: error,
});

export const fetchAdminConfigProfiles = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAdminConfigProfilesBegin());
    try {
      const res = await httpAuthService.get('firewall/configprofile');
      dispatch(fetchAdminConfigProfilesSuccess(res.data as ConfigProfileDto[]));
    } catch (err: any) {
      if (err.response.status !== 401) {
        dispatch(fetchAdminConfigProfilesError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve admin config profile info :\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const fetchAdminFirewallsBegin = () => ({
  type: FETCH_ADMIN_FIREWALLS_BEGIN,
});

export const fetchAdminFirewallsSuccess = (
  payload: FirewallHubNetworkInfoDto[]
) => ({
  type: FETCH_ADMIN_FIREWALLS_SUCCESS,
  payload,
});

export const fetchAdminFirewallsError = (error: AxiosError | string) => ({
  type: FETCH_ADMIN_FIREWALLS_FAILURE,
  payload: error,
});

export const fetchAdminFirewalls = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAdminFirewallsBegin());
    try {
      const res = await httpAuthService.get('firewallsettings/withhubnetworks');
      dispatch(
        fetchAdminFirewallsSuccess(res.data as FirewallHubNetworkInfoDto[])
      );
    } catch (err: any) {
      if (err.response.status !== 401) {
        dispatch(fetchAdminFirewallsError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve admin firewall info :\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const setSelectedAdminFirewallId = (id: string) => ({
  type: SET_SELECTED_ADMIN_FIREWALL,
  payload: id,
});

export const setSelectedAdminFirewallHubId = (
  firewallID: string,
  hubID: string
) => ({
  type: SET_SELECTED_ADMIN_FIREWALL_HUB,
  firewallID,
  payload: hubID,
});

export const updateSelectedAdminFirewallSettings = (
  firewallSettings: FirewallSettingsDto
) => ({
  type: UPDATE_SELECTED_ADMIN_FIREWALL,
  payload: firewallSettings,
});

export const updateSelectedAdminFirewallHub = (hubnetwork: HubNetworkDto) => ({
  type: UPDATE_SELECTED_ADMIN_FIREWALL_HUB,
  payload: hubnetwork,
});

export const resetSelectedAdminFirewallSettings = () => ({
  type: RESET_SELECTED_ADMIN_FIREWALL,
});

export const resetSelectedAdminFirewallHub = () => ({
  type: RESET_SELECTED_ADMIN_FIREWALL_HUB,
});

export const updateFirewallSettingsBegin = () => ({
  type: UPDATE_FIREWALL_SETTINGS_BEGIN,
});

export const updateFirewallSettingsSuccess = () => ({
  type: UPDATE_FIREWALL_SETTINGS_SUCCESS,
});

export const updateFirewallSettingsError = (error: AxiosError | string) => ({
  type: UPDATE_FIREWALL_SETTINGS_FAILURE,
  payload: error,
});

export const updateFirewallSettings = (
  firewallSettings: FirewallSettingsDto
) => {
  return async (dispatch: Dispatch): Promise<AxiosResponse> => {
    dispatch(updateFirewallSettingsBegin());
    try {
      dispatch(showSuccessNotification('Updating Firewall Settings.'));
      return httpAuthService.put('firewallsettings', firewallSettings).then(
        (res) => {
          dispatch(updateFirewallSettingsSuccess());
          fetchAdminFirewalls()(dispatch);
          return res;
        },
        (err) => {
          dispatch(updateFirewallSettingsError(err));
          ErrorAction(
            dispatch,
            err,
            `Failed to update firewall settings :\n${err.response?.data}`,
            true
          );
          return err.response;
        }
      );
    } catch (err: any) {
      if (err.response.status !== 401) {
        dispatch(updateFirewallSettingsError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to update firewall settings :\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const updateFirewallHubNetworkBegin = () => ({
  type: UPDATE_HUB_NETWORK_BEGIN,
});

export const updateFirewallHubNetworkSuccess = () => ({
  type: UPDATE_HUB_NETWORK_SUCCESS,
});

export const updateFirewallHubNetworkError = (error: AxiosError | string) => ({
  type: UPDATE_HUB_NETWORK_FAILURE,
  payload: error,
});

export const updateFirewallHubNetwork = (hub: HubNetworkDto) => {
  return async (dispatch: Dispatch): Promise<AxiosResponse> => {
    dispatch(updateFirewallHubNetworkBegin());
    try {
      dispatch(showSuccessNotification('Updating Hub Network.'));
      return httpAuthService.put('firewall/hubnetworks', hub).then(
        (res) => {
          dispatch(updateFirewallHubNetworkSuccess());
          fetchAdminFirewalls()(dispatch);
          return res;
        },
        (err) => {
          dispatch(updateFirewallHubNetworkError(err));
          ErrorAction(
            dispatch,
            err,
            `Failed to update hub network :\n${err.response?.data}`,
            true
          );
          return err.response;
        }
      );
    } catch (err: any) {
      if (err.response.status !== 401) {
        dispatch(updateFirewallHubNetworkError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to update hub network :\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const setNewAdminFirewallSettings = () => ({
  type: SET_NEW_FIREWALL_SETTINGS,
});

export const setNewAdminFirewallHub = (hub: HubNetworkForCreationDto) => ({
  type: SET_NEW_HUB_NETWORK,
  payload: hub,
});

export const updateNewAdminFirewallSettings = (
  firewallSettings: FirewallSettingsDto
) => ({
  type: UPDATE_NEW_FIREWALL_SETTINGS,
  payload: firewallSettings,
});

export const updateNewAdminFirewallHub = (
  hubnetwork: HubNetworkForCreationDto
) => ({
  type: UPDATE_NEW_HUB_NETWORK,
  payload: hubnetwork,
});

export const createFirewallSettingsBegin = () => ({
  type: CREATE_FIREWALL_SETTINGS_BEGIN,
});

export const createFirewallSettingsSuccess = () => ({
  type: CREATE_FIREWALL_SETTINGS_SUCCESS,
});

export const createFirewallSettingsError = (error: AxiosError | string) => ({
  type: CREATE_FIREWALL_SETTINGS_FAILURE,
  payload: error,
});

export const createFirewallSettings = (
  firewallSettings: FirewallSettingsDto
) => {
  return (dispatch: Dispatch): Promise<AxiosResponse> => {
    dispatch(createFirewallSettingsBegin());
    try {
      return httpAuthService.post('firewallsettings', firewallSettings).then(
        (res) => {
          dispatch(showSuccessNotification('Created firewall settings.'));
          dispatch(createFirewallSettingsSuccess());
          fetchAdminFirewalls()(dispatch);
          return res;
        },
        (err) => {
          dispatch(createFirewallSettingsError(err));
          ErrorAction(
            dispatch,
            err,
            `Failed to create firewall settings :\n${err.response?.data}`,
            true
          );
          return err.response;
        }
      );
    } catch (err: any) {
      if (err.response.status !== 401) {
        dispatch(createFirewallSettingsError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to create firewall settings :\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const createFirewallHubNetworkBegin = () => ({
  type: CREATE_HUB_NETWORK_BEGIN,
});

export const createFirewallHubNetworkSuccess = () => ({
  type: CREATE_HUB_NETWORK_SUCCESS,
});

export const createFirewallHubNetworkError = (error: AxiosError | string) => ({
  type: CREATE_HUB_NETWORK_FAILURE,
  payload: error,
});

export const createFirewallHubNetwork = (hub: HubNetworkForCreationDto) => {
  return async (dispatch: Dispatch): Promise<AxiosResponse> => {
    dispatch(createFirewallHubNetworkBegin());
    try {
      dispatch(showSuccessNotification('Creating Hub Network.'));
      return httpAuthService.post('firewall/hubnetworks', hub).then(
        (res) => {
          dispatch(createFirewallHubNetworkSuccess());
          fetchAdminFirewalls()(dispatch);
          return res;
        },
        (err) => {
          dispatch(createFirewallHubNetworkError(err));
          ErrorAction(
            dispatch,
            err,
            `Failed to create hub network :\n${err.response?.data}`,
            true
          );
          return err.response;
        }
      );
    } catch (err: any) {
      if (err.response.status !== 401) {
        dispatch(createFirewallHubNetworkError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to create hub network :\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const createConfigProfileBegin = () => ({
  type: CREATE_CONFIG_PROFILE_BEGIN,
});

export const createConfigProfileSuccess = () => ({
  type: CREATE_CONFIG_PROFILE_SUCCESS,
});

export const createConfigProfileError = (error: AxiosError | string) => ({
  type: CREATE_CONFIG_PROFILE_FAILURE,
  payload: error,
});

export const createConfigProfile = (): ((
  dispatch: Dispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    dispatch(createConfigProfileBegin());
    const { adminFirewall } = getState();

    try {
      await httpAuthService.post(
        'firewall/configprofile',
        adminFirewall.newConfigProfile
      );
      dispatch(createConfigProfileSuccess());
      dispatch(showSuccessNotification('Configuration profile created.'));
      fetchAdminConfigProfiles()(dispatch);
    } catch (e) {
      dispatch(createConfigProfileError(e));
      ErrorAction(
        dispatch,
        e,
        `Failed to create configuration profile :\n${e.response?.data}`,
        true
      );
    }
  };
};

export const deleteConfigProfileBegin = () => ({
  type: DELETE_SELECTED_CONFIG_PROFILE_BEGIN,
});

export const deleteConfigProfileSuccess = () => ({
  type: DELETE_SELECTED_CONFIG_PROFILE_SUCCESS,
});

export const deleteConfigProfileError = (error: AxiosError | string) => ({
  type: DELETE_SELECTED_CONFIG_PROFILE_FAILURE,
  payload: error,
});

export const deleteConfigProfile = (
  id: string
): ((
  dispatch: Dispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch): Promise<void> => {
    dispatch(deleteConfigProfileBegin());
    try {
      await httpAuthService.delete(`firewall/configprofile/${id}`);
      dispatch(deleteConfigProfileSuccess());
      dispatch(showSuccessNotification('Configuration profile deleted.'));
      fetchAdminConfigProfiles()(dispatch);
    } catch (e) {
      dispatch(deleteConfigProfileError(e));
      ErrorAction(
        dispatch,
        e,
        `Failed to create configuration profile :\n${e.response?.data}`,
        true
      );
    }
  };
};

export const updateNewConfigProfile = (
  configProfile: ConfigProfileForCreationDto
) => ({
  type: UPDATE_NEW_CONFIG_PROFILE,
  payload: configProfile,
});

export const resetNewConfigProfile = () => ({
  type: RESET_NEW_CONFIG_PROFILE,
});

export const setSelectedConfigProfile = (id: string) => ({
  type: SET_SELECTED_CONFIG_PROFILE,
  payload: id,
});

export const updateSelectedConfigProfile = (
  configProfile: ConfigProfileDto
) => ({
  type: UPDATE_SELECTED_CONFIG_PROFILE,
  payload: configProfile,
});

export const resetSelectedConfigProfile = () => ({
  type: RESET_SELECTED_CONFIG_PROFILE,
});

export const saveSelectedConfigProfileBegin = () => ({
  type: SAVE_SELECTED_CONFIG_PROFILE_BEGIN,
});

export const saveSelectedConfigProfileSuccess = () => ({
  type: SAVE_SELECTED_CONFIG_PROFILE_SUCCESS,
});

export const saveSelectedConfigProfileFailure = (e: AxiosError) => ({
  type: SAVE_SELECTED_CONFIG_PROFILE_FAILURE,
  payload: e,
});

export const saveSelectedConfigProfile = (): ((
  dispatch: Dispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    dispatch(saveSelectedConfigProfileBegin());
    const { adminFirewall } = getState();

    try {
      await httpAuthService.put(
        'firewall/configprofile',
        adminFirewall.editedConfigProfile
      );
      dispatch(saveSelectedConfigProfileSuccess());
    } catch (e) {
      dispatch(saveSelectedConfigProfileFailure(e));
      ErrorAction(
        dispatch,
        e,
        `Failed to create configuration profile :\n${e.response?.data}`,
        true
      );
    }
  };
};

export const setSelectedFirewalls = (
  firewalls: FirewallHubNetworkInfoDto[]
): AdminFirewallAction => ({
  type: SET_SELECTED_FIREWALLS,
  payload: firewalls,
});

export const createHubNetworkDnsRecordCreationJobBegin = () => ({
  type: CREATE_HUB_NETWORK_DNS_RECORD_CREATION_JOB_BEGIN,
});

export const createHubNetworkDnsRecordCreationJobSuccess = () => ({
  type: CREATE_HUB_NETWORK_DNS_RECORD_CREATION_JOB_SUCCESS,
});

export const createHubNetworkDnsRecordCreationJobFailure = (
  error: AxiosError | string
): AdminFirewallAction => ({
  type: CREATE_HUB_NETWORK_DNS_RECORD_CREATION_JOB_FAILURE,
  payload: error,
});

export const createHubNetworkDnsRecordCreationJob = (
  jobDto: HubNetworkDnsRecordCreationJobDto
): ((dispatch: Dispatch) => Promise<AxiosResponse>) => {
  return async (dispatch: Dispatch) => {
    dispatch(createHubNetworkDnsRecordCreationJobBegin());
    dispatch(
      showDefaultNotification(
        'DNS record creation initiation in progress. Please wait.'
      )
    );
    try {
      const url = 'firewall/hubnetworks/dnsrecords';
      return await httpAuthService.put(url, jobDto).then(
        (res) => {
          dispatch(createHubNetworkDnsRecordCreationJobSuccess());
          dispatch(showSuccessNotification('DNS record creation in progress.'));
          return res;
        },
        (err) => {
          dispatch(createHubNetworkDnsRecordCreationJobFailure(err));
          ErrorAction(
            dispatch,
            err,
            `Failed to initiate DNS record creation:\n${err.response?.data}`,
            true,
            true
          );

          return err;
        }
      );
    } catch (err) {
      dispatch(createHubNetworkDnsRecordCreationJobFailure(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to initiate DNS record creation:\n${err.response?.data}`,
        true,
        true
      );
      return err;
    }
  };
};

export const deployNewFirewallBegin = () => ({
  type: DEPLOY_NEW_FIREWALL_BEGIN,
});

export const deployNewFirewallSuccess = () => ({
  type: DEPLOY_NEW_FIREWALL_SUCCESS,
});

export const deployNewFirewallFailure = (
  error: AxiosError | string
): AdminFirewallAction => ({
  type: DEPLOY_NEW_FIREWALL_FAILURE,
  payload: error,
});

export const deployNewFirewall = (
  firewallDeployment: FirewallDeploymentDto
) => {
  return (dispatch: Dispatch): Promise<AxiosResponse> => {
    dispatch(deployNewFirewallBegin());
    try {
      dispatch(
        showDefaultNotification('Creating deployment job for new firewall.')
      );
      return httpAuthService.post('firewall/deploy', firewallDeployment).then(
        (res) => {
          const newFirewall: FirewallSettingsDto =
            res.data as FirewallSettingsDto;
          dispatch(deployNewFirewallSuccess());
          dispatch(
            showSuccessNotification(
              `Successfully created deployment job for firewall "${newFirewall.Name}"`
            )
          );
          fetchAdminFirewalls()(dispatch);
          dispatch(setNewFirewallDeployment());
          return res;
        },
        (err) => {
          dispatch(deployNewFirewallFailure(err));
          ErrorAction(
            dispatch,
            err,
            `Failed to deploy firewall. \n${err.response?.data}`,
            true
          );
          return err.response;
        }
      );
    } catch (err: any) {
      if (err.response.status !== 401) {
        dispatch(deployNewFirewallFailure(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to deploy firewall. \n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const updateNewFirewallDeployment = (
  newFirewallDeployment: FirewallDeploymentDto
) => ({
  type: UPDATE_NEW_FIREWALL_DEPLOYMENT,
  payload: newFirewallDeployment,
});

export const setNewFirewallDeployment = () => ({
  type: SET_NEW_FIREWALL_DEPLOYMENT,
});

export const getFirewallDeploymentRegionsBegin = () => ({
  type: FETCH_FIREWALL_DEPLOYMENT_REGION_BEGIN,
  payload: true,
});

export const getFirewallDeploymentRegionsSuccess = (regions: string[]) => ({
  type: FETCH_FIREWALL_DEPLOYMENT_REGION_SUCCESS,
  payload: regions,
});

export const getFirewallDeploymentRegionsError = (
  error: AxiosError | string
): AdminFirewallAction => ({
  type: FETCH_FIREWALL_DEPLOYMENT_REGION_FAILURE,
  payload: error,
});

export const fetchFirewallDeploymentRegions = () => {
  return async (dispatch: Dispatch) => {
    dispatch(getFirewallDeploymentRegionsBegin());
    try {
      const res = await httpAuthService.get('firewall/deploy/regions');
      dispatch(getFirewallDeploymentRegionsSuccess(res.data as string[]));
    } catch (err: any) {
      if (err.response.status !== 401) {
        dispatch(deployNewFirewallFailure(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve firewall deployment regions. \n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const getFirewallTenantsBegin = () => ({
  type: FETCH_FIREWALL_TENANTS_BEGIN,
  payload: true,
});

export const getFirewallTenantsSuccess = (
  firewallTenants: FirewallTenantDto[]
) => ({
  type: FETCH_FIREWALL_TENANTS_SUCCESS,
  payload: firewallTenants,
});

export const getFirewallTenantsError = (
  error: AxiosError | string
): AdminFirewallAction => ({
  type: FETCH_FIREWALL_TENANTS_FAILURE,
  payload: error,
});

export const fetchFirewallTenants = () => {
  return async (dispatch: Dispatch) => {
    dispatch(getFirewallTenantsBegin());
    try {
      const res = await httpAuthService.get('firewall/tenant');
      dispatch(getFirewallTenantsSuccess(res.data as FirewallTenantDto[]));
    } catch (err: any) {
      if (err.response.status !== 401) {
        dispatch(getFirewallTenantsError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve firewall tenants. \n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const softwareUpdateBegin = () => ({
  type: FIREWALL_SOFTWARE_UPDATE_BEGIN,
});

export const softwareUpdateSuccess = () => ({
  type: FIREWALL_SOFTWARE_UPDATE_SUCCESS,
  payload: false,
});

export const softwareUpdateFailed = (
  error: AxiosError | string
): AdminFirewallAction => ({
  type: FIREWALL_SOFTWARE_UPDATE_FAILURE,
  payload: error,
});

export const initiateSoftwareUpdate = (
  softwareVersion: string,
  firewallIds: string[]
) => {
  return async (dispatch: Dispatch) => {
    dispatch(softwareUpdateBegin());
    try {
      debugger;
      const res = await httpAuthService.post(
        `firewall/configuration/softwareversions/${softwareVersion}`,
        firewallIds
      );
      dispatch(softwareUpdateSuccess());
      fetchAdminFirewalls()(dispatch);
      dispatch(
        showSuccessNotification(
          `Software update initiated on the following firewalls: \n${res.data.join(
            ', '
          )}`
        )
      );
    } catch (err: any) {
      if (err.response.status !== 401) {
        dispatch(softwareUpdateFailed(err));
        ErrorAction(
          dispatch,
          err,
          `Unable to initiate software update work: \n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const fetchFirewallSoftwareVersionsBegin = () => ({
  type: FETCH_FIREWALL_SOFTWARE_VERSIONS_BEGIN,
});

export const fetchFirewallSoftwareVersionsSuccess = (
  softwareVersions: string[]
) => ({
  type: FETCH_FIREWALL_SOFTWARE_VERSIONS_SUCCESS,
  payload: softwareVersions,
});

export const fetchFirewallSoftwareVersionsFailure = (
  error: AxiosError | string
): AdminFirewallAction => ({
  type: FETCH_FIREWALL_SOFTWARE_VERSIONS_FAILURE,
  payload: error,
});

export const fetchFirewallSoftwareVersions = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchFirewallSoftwareVersionsBegin());
    try {
      const res = await httpAuthService.get(
        `firewall/configuration/softwareversions`
      );
      dispatch(fetchFirewallSoftwareVersionsSuccess(res.data as string[]));
    } catch (err: any) {
      if (err.response.status !== 401) {
        dispatch(fetchFirewallSoftwareVersionsFailure(err));
        ErrorAction(
          dispatch,
          err,
          `Unable to fetch software versions: \n${err.response?.data}`,
          true
        );
      }
    }
  };
};
