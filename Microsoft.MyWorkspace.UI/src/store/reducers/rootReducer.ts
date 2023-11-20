import { combineReducers } from '@reduxjs/toolkit';

import azureWorkspaces, {
  ReduxAzureWorkspacesState,
} from './azureWorkspaceReducer';
import authService, { ReduxAuthServiceState } from './authServiceReducer';
import notifications, { ReduxNotificationState } from './notificationReducer';
import catalog, { ReduxCatalogState } from './catalogReducer';
import firewall, { ReduxFirewallState } from './firewallReducer';
import config, { ReduxConfigState } from './configReducer';
import editableWorkspace, {
  ReduxEditableWorkspaceState,
} from './editableWorkspaceReducer';
import schedule, { ReduxScheduleState } from './scheduleReducer';
import adminFirewall, { ReduxAdminFirewallState } from './adminFirewallReducer';
import telemetryTree, { ReduxAdminTaskTreeState } from './adminTaskTreeReducer';
import azureMachines, { ReduxAzureMachinesState } from './azureMachinesReducer';
import userEngagement, {
  ReduxAdminUserEngagementState,
} from './adminUserEngagementReducer';
import adminTemplate, { ReduxAdminTemplateState } from './adminTemplateReducer';
import adminDiagnostic, {
  ReduxAdminDiagnosticState,
} from './adminDiagnosticReducer';
import tenantSegmentAdminCost, {
  ReduxTenantSegmentAdminCostState,
} from './tenantSegmentAdmin/tenantSegmentAdminCostReducer';
import tenantSegmentAdminWorkspaceActivity, {
  ReduxTenantSegmentAdminWorkspaceActivityState,
} from './tenantSegmentAdmin/tenantSegmentAdminWorkspaceActivityReducer';

export interface MyWorkspacesStore {
  adminFirewall: ReduxAdminFirewallState;
  telemetryTree: ReduxAdminTaskTreeState;
  azureWorkspaces: ReduxAzureWorkspacesState;
  azureMachines: ReduxAzureMachinesState;
  authService: ReduxAuthServiceState;
  catalog: ReduxCatalogState;
  firewall: ReduxFirewallState;
  config: ReduxConfigState;
  notifications: ReduxNotificationState;
  editableWorkspace: ReduxEditableWorkspaceState;
  schedule: ReduxScheduleState;
  userEngagement: ReduxAdminUserEngagementState;
  adminTemplate: ReduxAdminTemplateState;
  adminDiagnostic: ReduxAdminDiagnosticState;
  tenantSegmentAdminCost: ReduxTenantSegmentAdminCostState;
  tenantSegmentAdminWorkspaceActivity: ReduxTenantSegmentAdminWorkspaceActivityState;
}

const rootReducer = combineReducers({
  adminFirewall,
  telemetryTree,
  azureWorkspaces,
  azureMachines,
  authService,
  catalog,
  firewall,
  config,
  notifications,
  editableWorkspace,
  schedule,
  userEngagement,
  adminTemplate,
  adminDiagnostic,
  tenantSegmentAdminCost,
  tenantSegmentAdminWorkspaceActivity,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
