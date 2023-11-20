import { AxiosError } from 'axios';

import {
  FETCH_ADMIN_FIREWALLS_BEGIN,
  FETCH_ADMIN_FIREWALLS_FAILURE,
  FETCH_ADMIN_FIREWALLS_SUCCESS,
  SET_SELECTED_ADMIN_FIREWALL_HUB,
  SET_SELECTED_ADMIN_FIREWALL,
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
  UPDATE_NEW_FIREWALL_SETTINGS,
  SET_NEW_HUB_NETWORK,
  UPDATE_NEW_HUB_NETWORK,
  FETCH_ADMIN_CONFIG_PROFILES_SUCCESS,
  FETCH_ADMIN_CONFIG_PROFILES_BEGIN,
  FETCH_ADMIN_CONFIG_PROFILES_FAILURE,
  UPDATE_NEW_CONFIG_PROFILE,
  UPDATE_SELECTED_CONFIG_PROFILE,
  SET_SELECTED_CONFIG_PROFILE,
  RESET_SELECTED_CONFIG_PROFILE,
  RESET_NEW_CONFIG_PROFILE,
  SAVE_SELECTED_CONFIG_PROFILE_BEGIN,
  SAVE_SELECTED_CONFIG_PROFILE_FAILURE,
  SAVE_SELECTED_CONFIG_PROFILE_SUCCESS,
  SET_SELECTED_FIREWALLS,
  CREATE_HUB_NETWORK_DNS_RECORD_CREATION_JOB_BEGIN,
  CREATE_HUB_NETWORK_DNS_RECORD_CREATION_JOB_FAILURE,
  CREATE_HUB_NETWORK_DNS_RECORD_CREATION_JOB_SUCCESS,
  FETCH_FIREWALL_DEPLOYMENT_REGION_BEGIN,
  FETCH_FIREWALL_DEPLOYMENT_REGION_FAILURE,
  FETCH_FIREWALL_DEPLOYMENT_REGION_SUCCESS,
  SET_NEW_FIREWALL_DEPLOYMENT,
  UPDATE_NEW_FIREWALL_DEPLOYMENT,
  FETCH_FIREWALL_TENANTS_SUCCESS,
  FETCH_FIREWALL_TENANTS_BEGIN,
  FETCH_FIREWALL_TENANTS_FAILURE,
  FIREWALL_SOFTWARE_UPDATE_BEGIN,
  FIREWALL_SOFTWARE_UPDATE_FAILURE,
  FIREWALL_SOFTWARE_UPDATE_SUCCESS,
  FETCH_FIREWALL_SOFTWARE_VERSIONS_BEGIN,
  FETCH_FIREWALL_SOFTWARE_VERSIONS_SUCCESS,
  FETCH_FIREWALL_SOFTWARE_VERSIONS_FAILURE,
} from '../actions/actionTypes';
import { AdminFirewallAction } from '../actions/adminFirewallActions';
import { FirewallHubNetworkInfoDto } from '../../types/FirewallManager/FirewallHubNetworkInfoDto';
import { FirewallSettingsDto } from '../../types/FirewallManager/FirewallSettingsDto';
import { HubNetworkDto } from '../../types/FirewallManager/HubNetworkDto';
import cloneDeep from 'lodash/cloneDeep';
import { HubNetworkForCreationDto } from '../../types/ResourceCreation/HubNetworkForCreationDto.types';
import { SyncStatus } from '../../types/enums/SyncStatus';
import { ConfigProfileDto } from '../../types/FirewallManager/ConfigProfileDto.types';
import { ConfigProfileForCreationDto } from '../../types/ResourceCreation/ConfigProfileForCreationDto.types';
import { FirewallDeploymentDto } from '../../types/FirewallManager/FirewallDeploymentDto';
import { FirewallTenantDto } from '../../types/FirewallManager/FirewallTenantDto';

export interface ReduxAdminFirewallState {
  firewalls: FirewallHubNetworkInfoDto[];
  firewallsLoading: boolean;
  getFirewallsError: AxiosError;
  originalFirewallSettings: FirewallSettingsDto;
  originalHubNetwork: HubNetworkDto;
  editedFirewallSettings: FirewallSettingsDto;
  editedHubNetwork: HubNetworkDto;
  updateFirewallSettingsLoading: boolean;
  updateFirewallSettingsError: AxiosError;
  updateHubNetworkLoading: boolean;
  updateHubNetworkError: AxiosError;
  newFirewallSettings: FirewallSettingsDto;
  newFirewallDeployment: FirewallDeploymentDto;
  newHubNetworkOriginal: HubNetworkForCreationDto;
  newHubNetwork: HubNetworkForCreationDto;
  originalConfigProfile: ConfigProfileDto;
  editedConfigProfile: ConfigProfileDto;
  newConfigProfile: ConfigProfileForCreationDto;
  configProfiles: ConfigProfileDto[];
  configProfilesLoading: boolean;
  configProfilesError: AxiosError;
  editedConfigProfileSaving: boolean;
  editedConfigProfileSavingError: AxiosError;
  selectedFirewalls: FirewallHubNetworkInfoDto[];
  isCreateHubNetworkDnsRecordCreationJobPending: boolean;
  createHubNetworkDnsRecordCreationJobError: AxiosError;
  FirewallDeploymentRegions: string[];
  isFirewallDeploymentRegionsLoading: boolean;
  FirewallDeploymentRegionsError: AxiosError;
  FirewallTenants: FirewallTenantDto[];
  firewallTenantsLoading: boolean;
  getFirewallTenantsError: AxiosError;
  SoftwareUpdateFirewallIds: string[];
  isSoftwareUpdateWorkCreating: boolean;
  SoftwareUpdateWorkCreationError: AxiosError;
  isFirewallSoftwareVersionsLoading: boolean;
  FirewallSoftwareVersions: string[];
  FirewallSoftwareVersionsError: AxiosError;
}

export const initialNewConfigProfile: ConfigProfileForCreationDto = {
  Name: 'New Configuration Profile',
  Description: 'This is a new Configuration Profile',
  TcpPorts: null,
  UdpPorts: null,
  OutboundTcpPorts: null,
  OutboundUdpPorts: null,
  Tags: null,
};
export const initialNewFirewallSettings: FirewallSettingsDto = {
  ID: '00000000-0000-0000-0000-000000000000',
  Name: '',
  SubscriptionId: '',
  ResourceGroupName: '',
  UsernameAppSetting: '',
  PasswordAppSetting: '',
  AddressAppSetting: '',
  OutboundBeforeRuleName: '',
  OutboundTcpServiceName: '',
  OutboundUdpServiceName: '',
  IsRequested: false,
  MaintenanceModeEnabled: true,
  Location: '',
  JitTagPrefix: '',
  ConfigID: '',
  ConfigStatus: SyncStatus.Inactive,
  EnableJit: false,
  EnablePublicFacingAddresses: false,
  EnableNatRules: false,
  EnableRestrictedEndpoints: false,
  EnableConfigProfiles: false,
  Address: '',
  PasswordKeyVaultLink: '',
  UsernameKeyVaultLink: '',
  SoftwareVersion: '',
};

export const initialHubNetwork: HubNetworkForCreationDto = {
  FirewallID: '',
  SubscriptionID: '',
  Name: '',
  IsPublished: false,
  ResourceGroupName: '',
  Location: '',
  HubFQDN: '',
  HubHopSubnetCidr: '',
  HubAddressSpace: '',
  HubInternalName: '',
  SpokeAddressSpace: '',
  SpokeNetworkBlockSize: 0,
  HubRDPInternalAddress: '',
  NatPortStart: 0,
  TotalNatPorts: 0,
  JitTag: '',
  IsExternalConnectivityEnabled: false,
  HubExternalNicInternalName: '',
  HubExternalZoneName: '',
  HubInternalZoneName: '',
  HubRdpNicInternalName: '',
  ContentFilter: null,
  MaxSpokeNetworksAllowed: 0,
  HubExternalConnectivityStartIP: '',
  HubExternalConnectivityEndIP: '',
};

export const initialNewFirewallDeployment: FirewallDeploymentDto = {
  SubscriptionId: '',
  AzureRegion: '',
  FirewallTenantId: '',
};

export const adminFirewallInitialState: ReduxAdminFirewallState = {
  firewalls: [],
  firewallsLoading: false,
  getFirewallsError: null,
  originalFirewallSettings: null,
  originalHubNetwork: null,
  editedFirewallSettings: null,
  editedHubNetwork: null,
  updateFirewallSettingsLoading: false,
  updateFirewallSettingsError: null,
  updateHubNetworkLoading: false,
  updateHubNetworkError: null,
  newFirewallSettings: initialNewFirewallSettings,
  newFirewallDeployment: initialNewFirewallDeployment,
  newHubNetwork: initialHubNetwork,
  newHubNetworkOriginal: initialHubNetwork,
  newConfigProfile: initialNewConfigProfile,
  originalConfigProfile: null,
  editedConfigProfile: null,
  configProfiles: [],
  configProfilesLoading: false,
  configProfilesError: null,
  editedConfigProfileSaving: false,
  editedConfigProfileSavingError: null,
  selectedFirewalls: [],
  isCreateHubNetworkDnsRecordCreationJobPending: false,
  createHubNetworkDnsRecordCreationJobError: null,
  FirewallDeploymentRegions: [],
  isFirewallDeploymentRegionsLoading: false,
  FirewallDeploymentRegionsError: null,
  FirewallTenants: [],
  firewallTenantsLoading: false,
  getFirewallTenantsError: null,
  SoftwareUpdateFirewallIds: [],
  isSoftwareUpdateWorkCreating: false,
  SoftwareUpdateWorkCreationError: null,
  isFirewallSoftwareVersionsLoading: false,
  FirewallSoftwareVersions: [],
  FirewallSoftwareVersionsError: null,
};

export default function adminFirewallReducer(
  state: ReduxAdminFirewallState = adminFirewallInitialState,
  action: AdminFirewallAction
): ReduxAdminFirewallState {
  switch (action.type) {
    case FETCH_ADMIN_FIREWALLS_BEGIN:
      return {
        ...state,
        firewallsLoading: true,
      };
    case FETCH_ADMIN_FIREWALLS_SUCCESS: {
      return {
        ...state,
        firewalls: action.payload as FirewallHubNetworkInfoDto[],
        firewallsLoading: false,
        getFirewallsError: null,
      };
    }
    case FETCH_ADMIN_FIREWALLS_FAILURE:
      return {
        ...state,
        firewallsLoading: false,
        getFirewallsError: action.payload as AxiosError,
      };
    case SET_SELECTED_ADMIN_FIREWALL:
      const firewallSettings = state.firewalls.find(
        (f) => f.FirewallSettings.ID === action.payload
      )?.FirewallSettings;
      if (firewallSettings) {
        return {
          ...state,
          originalFirewallSettings: firewallSettings,
          editedFirewallSettings: cloneDeep(firewallSettings),
        };
      } else {
        return {
          ...state,
          originalFirewallSettings: null,
          editedFirewallSettings: null,
        };
      }
    case SET_SELECTED_ADMIN_FIREWALL_HUB:
      const hub = state.firewalls
        .find((f) => f.FirewallSettings.ID == action.firewallID)
        ?.AssociatedHubNetworks?.find((h) => h.ID === action.payload);
      if (hub) {
        return {
          ...state,
          originalHubNetwork: hub,
          editedHubNetwork: cloneDeep(hub),
        };
      } else {
        return {
          ...state,
          originalHubNetwork: null,
          editedHubNetwork: null,
        };
      }
    case UPDATE_SELECTED_ADMIN_FIREWALL:
      return {
        ...state,
        editedFirewallSettings: action.payload as FirewallSettingsDto,
      };
    case UPDATE_SELECTED_ADMIN_FIREWALL_HUB:
      return {
        ...state,
        editedHubNetwork: action.payload as HubNetworkDto,
      };
    case RESET_SELECTED_ADMIN_FIREWALL:
      return {
        ...state,
        editedFirewallSettings: state.originalFirewallSettings,
      };
    case RESET_SELECTED_ADMIN_FIREWALL_HUB:
      return {
        ...state,
        editedHubNetwork: state.originalHubNetwork,
      };
    case UPDATE_FIREWALL_SETTINGS_BEGIN:
      return {
        ...state,
        updateFirewallSettingsLoading: true,
      };
    case UPDATE_FIREWALL_SETTINGS_SUCCESS: {
      return {
        ...state,
        updateFirewallSettingsLoading: false,
        updateFirewallSettingsError: null,
      };
    }
    case UPDATE_FIREWALL_SETTINGS_FAILURE:
      return {
        ...state,
        updateFirewallSettingsLoading: false,
        updateFirewallSettingsError: action.payload as AxiosError,
      };
    case UPDATE_HUB_NETWORK_BEGIN:
      return {
        ...state,
        updateHubNetworkLoading: true,
      };
    case UPDATE_HUB_NETWORK_SUCCESS: {
      return {
        ...state,
        updateHubNetworkLoading: false,
        updateHubNetworkError: null,
      };
    }
    case UPDATE_HUB_NETWORK_FAILURE:
      return {
        ...state,
        updateHubNetworkLoading: false,
        updateHubNetworkError: action.payload as AxiosError,
      };
    case SET_NEW_FIREWALL_SETTINGS:
      return {
        ...state,
        newFirewallSettings: initialNewFirewallSettings,
      };
    case UPDATE_NEW_FIREWALL_SETTINGS:
      return {
        ...state,
        newFirewallSettings: action.payload as FirewallSettingsDto,
      };
    case SET_NEW_HUB_NETWORK:
      return {
        ...state,
        newHubNetworkOriginal: action.payload as HubNetworkForCreationDto,
        newHubNetwork: action.payload as HubNetworkForCreationDto,
      };
    case UPDATE_NEW_HUB_NETWORK:
      return {
        ...state,
        newHubNetwork: action.payload as HubNetworkForCreationDto,
      };
    case FETCH_ADMIN_CONFIG_PROFILES_BEGIN:
      return {
        ...state,
        configProfilesLoading: true,
      };
    case FETCH_ADMIN_CONFIG_PROFILES_SUCCESS:
      return {
        ...state,
        configProfiles: action.payload as ConfigProfileDto[],
        configProfilesLoading: false,
        configProfilesError: null,
      };
    case FETCH_ADMIN_CONFIG_PROFILES_FAILURE:
      return {
        ...state,
        configProfilesLoading: false,
        configProfilesError: action.payload as AxiosError,
      };
    case UPDATE_NEW_CONFIG_PROFILE:
      return {
        ...state,
        newConfigProfile: action.payload as ConfigProfileForCreationDto,
      };
    case RESET_NEW_CONFIG_PROFILE:
      return {
        ...state,
        newConfigProfile: initialNewConfigProfile,
      };
    case SET_SELECTED_CONFIG_PROFILE:
      const profile = state.configProfiles?.find(
        (p) => p.ID === (action.payload as string)
      );
      return {
        ...state,
        originalConfigProfile: profile,
        editedConfigProfile: profile,
      };
    case UPDATE_SELECTED_CONFIG_PROFILE:
      return {
        ...state,
        editedConfigProfile: action.payload as ConfigProfileDto,
      };
    case RESET_SELECTED_CONFIG_PROFILE:
      return {
        ...state,
        editedConfigProfile: state.originalConfigProfile,
      };
    case SAVE_SELECTED_CONFIG_PROFILE_BEGIN:
      return {
        ...state,
        editedConfigProfileSaving: true,
      };
    case SAVE_SELECTED_CONFIG_PROFILE_FAILURE:
      return {
        ...state,
        editedConfigProfileSaving: false,
        editedConfigProfileSavingError: action.payload as AxiosError,
      };
    case SAVE_SELECTED_CONFIG_PROFILE_SUCCESS:
      return {
        ...state,
        editedConfigProfileSaving: false,
        originalConfigProfile: null,
        editedConfigProfile: null,
      };
    case SET_SELECTED_FIREWALLS:
      return {
        ...state,
        selectedFirewalls: action.payload as FirewallHubNetworkInfoDto[],
      };
    case CREATE_HUB_NETWORK_DNS_RECORD_CREATION_JOB_BEGIN:
      return {
        ...state,
        isCreateHubNetworkDnsRecordCreationJobPending: true,
        createHubNetworkDnsRecordCreationJobError: null,
      };
    case CREATE_HUB_NETWORK_DNS_RECORD_CREATION_JOB_SUCCESS:
      return {
        ...state,
        isCreateHubNetworkDnsRecordCreationJobPending: false,
      };
    case CREATE_HUB_NETWORK_DNS_RECORD_CREATION_JOB_FAILURE:
      return {
        ...state,
        isCreateHubNetworkDnsRecordCreationJobPending: false,
        createHubNetworkDnsRecordCreationJobError: action.payload as AxiosError,
      };
    case FETCH_FIREWALL_DEPLOYMENT_REGION_BEGIN:
      return {
        ...state,
        isFirewallDeploymentRegionsLoading: true,
      };
    case FETCH_FIREWALL_DEPLOYMENT_REGION_SUCCESS: {
      return {
        ...state,
        isFirewallDeploymentRegionsLoading: false,
        FirewallDeploymentRegions: action.payload as string[],
      };
    }
    case FETCH_FIREWALL_DEPLOYMENT_REGION_FAILURE:
      return {
        ...state,
        isFirewallDeploymentRegionsLoading: false,
        FirewallDeploymentRegionsError: action.payload as AxiosError,
      };
    case SET_NEW_FIREWALL_DEPLOYMENT:
      return {
        ...state,
        newFirewallDeployment: initialNewFirewallDeployment,
      };
    case UPDATE_NEW_FIREWALL_DEPLOYMENT:
      return {
        ...state,
        newFirewallDeployment: action.payload as FirewallDeploymentDto,
      };
    case FETCH_FIREWALL_TENANTS_BEGIN: {
      return {
        ...state,
        firewallTenantsLoading: true,
      };
    }
    case FETCH_FIREWALL_TENANTS_SUCCESS: {
      return {
        ...state,
        firewallTenantsLoading: false,
        FirewallTenants: action.payload as FirewallTenantDto[],
      };
    }
    case FETCH_FIREWALL_TENANTS_FAILURE:
      return {
        ...state,
        firewallTenantsLoading: false,
        getFirewallTenantsError: action.payload as AxiosError,
      };
    case FIREWALL_SOFTWARE_UPDATE_BEGIN: {
      return {
        ...state,
        isSoftwareUpdateWorkCreating: true,
      };
    }
    case FIREWALL_SOFTWARE_UPDATE_SUCCESS: {
      return {
        ...state,
        isSoftwareUpdateWorkCreating: false,
        SoftwareUpdateFirewallIds: action.payload as string[],
      };
    }
    case FIREWALL_SOFTWARE_UPDATE_FAILURE:
      return {
        ...state,
        isSoftwareUpdateWorkCreating: false,
        SoftwareUpdateWorkCreationError: action.payload as AxiosError,
      };
    case FETCH_FIREWALL_SOFTWARE_VERSIONS_BEGIN: {
      return {
        ...state,
        isFirewallSoftwareVersionsLoading: true,
      };
    }
    case FETCH_FIREWALL_SOFTWARE_VERSIONS_SUCCESS: {
      return {
        ...state,
        isFirewallSoftwareVersionsLoading: false,
        FirewallSoftwareVersions: action.payload as string[],
      };
    }
    case FETCH_FIREWALL_SOFTWARE_VERSIONS_FAILURE:
      return {
        ...state,
        isFirewallSoftwareVersionsLoading: false,
        FirewallSoftwareVersionsError: action.payload as AxiosError,
      };
    default:
      return state;
  }
}
