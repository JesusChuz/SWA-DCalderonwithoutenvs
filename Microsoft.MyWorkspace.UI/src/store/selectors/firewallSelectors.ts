import { createSelector } from 'reselect';

import { ReduxFirewallState } from '../reducers/firewallReducer';
import { MyWorkspacesStore } from '../reducers/rootReducer';

const firewallState = (state: MyWorkspacesStore): ReduxFirewallState =>
  state.firewall;

export const getJitAddresses = createSelector(
  firewallState,
  (firewall: ReduxFirewallState) => firewall.jitAddresses
);

export const getJitAddressesForAdminWorkspace = createSelector(
  firewallState,
  (firewall: ReduxFirewallState) => firewall.jitAddressesForAdminWorkspace
);

export const getJitAddressesForAdminWorkspaceLoading = createSelector(
  firewallState,
  (firewall: ReduxFirewallState) =>
    firewall.isJitAddressesForAdminWorkspaceLoading
);

export const getUserIP = createSelector(
  firewallState,
  (firewall: ReduxFirewallState) => firewall.userIP
);

export const getJitWorkspaceRequested = createSelector(
  firewallState,
  (firewall: ReduxFirewallState) => firewall.jitWorkspaceRequested
);

export const getFirewallApiVersion = createSelector(
  firewallState,
  (firewall: ReduxFirewallState) => firewall.apiVersion
);

export const getNatRuleJitEntries = createSelector(
  firewallState,
  (firewall: ReduxFirewallState) => firewall.natRuleJitEntries
);

export const getNatRuleJitEntriesLoading = createSelector(
  firewallState,
  (firewall: ReduxFirewallState) => firewall.isNatRuleJitEntriesLoading
);
