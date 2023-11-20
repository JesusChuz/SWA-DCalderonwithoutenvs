import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import thunk from 'redux-thunk';
import { initialAdminUserEngagementState } from '../../store/reducers/adminUserEngagementReducer';
import { adminFirewallInitialState } from '../../store/reducers/adminFirewallReducer';
import { initialAdminTaskTreeState } from '../../store/reducers/adminTaskTreeReducer';
import { authServiceInitialState } from '../../store/reducers/authServiceReducer';
import { azureMachinesInitialState } from '../../store/reducers/azureMachinesReducer';
import { workspacesInitialState } from '../../store/reducers/azureWorkspaceReducer';
import { catalogInitialState } from '../../store/reducers/catalogReducer';
import { configInitialState } from '../../store/reducers/configReducer';
import { editableWorkspaceInitialState } from '../../store/reducers/editableWorkspaceReducer';
import { firewallInitialState } from '../../store/reducers/firewallReducer';
import { initialAdminTemplateState } from '../../store/reducers/adminTemplateReducer';
import { notificationInitialState } from '../../store/reducers/notificationReducer';
import { MyWorkspacesStore } from '../../store/reducers/rootReducer';
import { scheduleInitialState } from '../../store/reducers/scheduleReducer';
import { initialTenantSegmentAdminCostState } from '../../store/reducers/tenantSegmentAdmin/tenantSegmentAdminCostReducer';
import { initialTenantSegmentAdminWorkspaceActivityState } from '../../store/reducers/tenantSegmentAdmin/tenantSegmentAdminWorkspaceActivityReducer';
import { adminDiagnosticInitialState } from '../../store/reducers/adminDiagnosticReducer';

export const getMockStore = (
  state?: Partial<MyWorkspacesStore>
): MockStoreEnhanced<MyWorkspacesStore> => {
  const middlewares = [thunk];
  const mockStore = configureStore<MyWorkspacesStore>(middlewares);
  return mockStore({
    ...initialState,
    ...state,
  });
};

const initialState: MyWorkspacesStore = {
  adminFirewall: adminFirewallInitialState,
  azureMachines: azureMachinesInitialState,
  authService: authServiceInitialState,
  azureWorkspaces: workspacesInitialState,
  catalog: catalogInitialState,
  config: configInitialState,
  editableWorkspace: editableWorkspaceInitialState,
  firewall: firewallInitialState,
  notifications: notificationInitialState,
  schedule: scheduleInitialState,
  telemetryTree: initialAdminTaskTreeState,
  userEngagement: initialAdminUserEngagementState,
  adminTemplate: initialAdminTemplateState,
  tenantSegmentAdminCost: initialTenantSegmentAdminCostState,
  adminDiagnostic: adminDiagnosticInitialState,
  tenantSegmentAdminWorkspaceActivity:
    initialTenantSegmentAdminWorkspaceActivityState,
};
