import isEqual from 'lodash/isEqual';
import { createSelector } from 'reselect';
import { noQuotaErrors } from '../../components/NewWorkspace/NewWorkspace.utils';
import { FirewallTenantDto } from '../../types/FirewallManager/FirewallTenantDto';
import { ConfigProfileErrors } from '../../types/Forms/ConfigProfileErrors.types';
import { FirewallDeploymentErrors } from '../../types/Forms/FirewallDeploymentErrors.types';
import {
  initialNewConfigProfile,
  initialNewFirewallSettings,
  ReduxAdminFirewallState,
} from '../reducers/adminFirewallReducer';

import { MyWorkspacesStore } from '../reducers/rootReducer';
import { NoError } from '../validators/ErrorConstants';
import {
  validateConfigProfile,
  validateFirewallDeployment,
} from '../validators/firewallManagementValidators';

const configState = (state: MyWorkspacesStore): ReduxAdminFirewallState =>
  state.adminFirewall;

export const getAdminFirewalls = createSelector(
  configState,
  (adminFirewall: ReduxAdminFirewallState) => {
    return adminFirewall.firewalls;
  }
);

export const getAdminFirewallsLoading = createSelector(
  configState,
  (adminFirewall: ReduxAdminFirewallState) => {
    return adminFirewall.firewallsLoading;
  }
);

export const getEditableAdminFirewallSettings = createSelector(
  configState,
  (adminFirewall: ReduxAdminFirewallState) => {
    return adminFirewall.editedFirewallSettings;
  }
);

export const getEditableAdminFirewallHub = createSelector(
  configState,
  (adminFirewall: ReduxAdminFirewallState) => {
    return adminFirewall.editedHubNetwork;
  }
);

export const getEditableAdminFirewallHasChanges = createSelector(
  configState,
  (adminFirewall: ReduxAdminFirewallState) => {
    return !isEqual(
      adminFirewall.originalFirewallSettings,
      adminFirewall.editedFirewallSettings
    );
  }
);

export const getEditableAdminFirewallHubHasChanges = createSelector(
  configState,
  (adminFirewall: ReduxAdminFirewallState) => {
    return !isEqual(
      adminFirewall.originalHubNetwork,
      adminFirewall.editedHubNetwork
    );
  }
);

export const getNewAdminFirewallSettings = createSelector(
  configState,
  (adminFirewall: ReduxAdminFirewallState) => {
    return adminFirewall.newFirewallSettings;
  }
);

export const getNewAdminFirewallSettingsHasChanges = createSelector(
  configState,
  (adminFirewall: ReduxAdminFirewallState) => {
    return !isEqual(
      adminFirewall.newFirewallSettings,
      initialNewFirewallSettings
    );
  }
);

export const getNewAdminHubNetwork = createSelector(
  configState,
  (adminFirewall: ReduxAdminFirewallState) => {
    return adminFirewall.newHubNetwork;
  }
);

export const getNewAdminHubNetworkHasChanges = createSelector(
  configState,
  (adminFirewall: ReduxAdminFirewallState) => {
    return !isEqual(
      adminFirewall.newHubNetwork,
      adminFirewall.newHubNetworkOriginal
    );
  }
);

export const getAdminConfigProfilesLoading = createSelector(
  configState,
  (adminFirewall: ReduxAdminFirewallState) => {
    return adminFirewall.configProfilesLoading;
  }
);

export const getAdminConfigProfiles = createSelector(
  configState,
  (adminFirewall: ReduxAdminFirewallState) => {
    return adminFirewall.configProfiles;
  }
);

export const getSelectedConfigProfileHasChanges = createSelector(
  configState,
  (adminFirewall: ReduxAdminFirewallState) => {
    return !isEqual(
      adminFirewall.originalConfigProfile,
      adminFirewall.editedConfigProfile
    );
  }
);

export const getSelectedFirewalls = createSelector(
  configState,
  (adminFirewall: ReduxAdminFirewallState) => {
    return adminFirewall.selectedFirewalls;
  }
);

export const getIsCreateHubNetworkDnsRecordCreationJobPending = createSelector(
  configState,
  (adminFirewall: ReduxAdminFirewallState) => {
    return adminFirewall.isCreateHubNetworkDnsRecordCreationJobPending;
  }
);

export const getSelectedConfigProfile = createSelector(
  configState,
  (adminFirewall: ReduxAdminFirewallState) => {
    return adminFirewall.editedConfigProfile;
  }
);

export const getSelectedConfigProfileErrors = createSelector(
  configState,
  (adminFirewall: ReduxAdminFirewallState): ConfigProfileErrors => {
    return validateConfigProfile(adminFirewall.editedConfigProfile, true);
  }
);

export const getSelectedConfigProfileValid = createSelector(
  configState,
  (adminFirewall: ReduxAdminFirewallState): boolean => {
    const errors = validateConfigProfile(
      adminFirewall.editedConfigProfile,
      false
    );
    for (const [key, value] of Object.entries(errors)) {
      if (value !== '') {
        return false;
      }
    }
    return true;
  }
);

export const getNewConfigProfileHasChanges = createSelector(
  configState,
  (adminFirewall: ReduxAdminFirewallState) => {
    return !isEqual(adminFirewall.newConfigProfile, initialNewConfigProfile);
  }
);

export const getNewConfigProfile = createSelector(
  configState,
  (adminFirewall: ReduxAdminFirewallState) => {
    return adminFirewall.newConfigProfile;
  }
);

export const getNewConfigProfileErrors = createSelector(
  configState,
  (adminFirewall: ReduxAdminFirewallState): ConfigProfileErrors => {
    return validateConfigProfile(adminFirewall.newConfigProfile, true);
  }
);

export const getNewConfigProfileValid = createSelector(
  configState,
  (adminFirewall: ReduxAdminFirewallState): boolean => {
    const errors = validateConfigProfile(adminFirewall.newConfigProfile, false);
    for (const [key, value] of Object.entries(errors)) {
      if (value !== '') {
        return false;
      }
    }
    return true;
  }
);

export const getNewFirewallDeployment = createSelector(
  configState,
  (newFirewallDeployment: ReduxAdminFirewallState) => {
    return newFirewallDeployment.newFirewallDeployment;
  }
);

export const getFirewallDeploymentErrors = createSelector(
  configState,
  (reduxStore: ReduxAdminFirewallState): FirewallDeploymentErrors =>
    validateFirewallDeployment(reduxStore.newFirewallDeployment)
);

export const isFirewallDeploymentValid = createSelector(
  configState,
  (reduxStore: ReduxAdminFirewallState): boolean => {
    const errors = validateFirewallDeployment(reduxStore.newFirewallDeployment);
    for (const [key, value] of Object.entries(errors)) {
      if (value != NoError) {
        return false;
      }
    }
    return true;
  }
);

export const getFirewallDeploymentRegions = createSelector(
  configState,
  (reduxStore: ReduxAdminFirewallState): string[] => {
    return reduxStore.FirewallDeploymentRegions;
  }
);

export const getFirewallTenants = createSelector(
  configState,
  (reduxStore: ReduxAdminFirewallState): FirewallTenantDto[] => {
    return reduxStore.FirewallTenants;
  }
);

export const isFirewallTenantsLoading = createSelector(
  configState,
  (reduxStore: ReduxAdminFirewallState): boolean => {
    return reduxStore.firewallTenantsLoading;
  }
);

export const getSoftwareUpdateFirewallIds = createSelector(
  configState,
  (reduxStore: ReduxAdminFirewallState): string[] => {
    return reduxStore.SoftwareUpdateFirewallIds;
  }
);

export const isSoftwareUpdateWorkCreating = createSelector(
  configState,
  (reduxStore: ReduxAdminFirewallState): boolean => {
    return reduxStore.isSoftwareUpdateWorkCreating;
  }
);

export const getSoftwareVersions = createSelector(
  configState,
  (reduxStore: ReduxAdminFirewallState): string[] => {
    return reduxStore.FirewallSoftwareVersions;
  }
);

export const isFirewallSoftwareVersionsLoading = createSelector(
  configState,
  (reduxStore: ReduxAdminFirewallState): boolean => {
    return reduxStore.isFirewallSoftwareVersionsLoading;
  }
);
