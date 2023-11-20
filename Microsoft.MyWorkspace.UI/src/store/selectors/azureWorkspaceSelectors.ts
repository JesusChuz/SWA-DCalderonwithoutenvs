import { createSelector } from 'reselect';

import { ReduxAzureWorkspacesState } from '../reducers/azureWorkspaceReducer';
import { MyWorkspacesStore } from '../reducers/rootReducer';

const workspacesState = (state: MyWorkspacesStore): ReduxAzureWorkspacesState =>
  state.azureWorkspaces;

export const getAzureWorkspaces = createSelector(
  workspacesState,
  (workspacesState: ReduxAzureWorkspacesState) => {
    if (workspacesState) {
      return workspacesState.azureWorkspaces;
    }
    return [];
  }
);

export const getAzureWorkspacesLoadingStatus = createSelector(
  workspacesState,
  (workspaces: ReduxAzureWorkspacesState) => workspaces.isAzureWorkspacesLoading
);

export const getAzureWorkspacesLoadedFirstTime = createSelector(
  workspacesState,
  (workspaces: ReduxAzureWorkspacesState) =>
    workspaces.loadedWorkspacesFirstTime
);

export const getPendingSaveID = createSelector(
  workspacesState,
  (workspaces: ReduxAzureWorkspacesState) => workspaces.pendingSaveID
);

export const getAzureWorkspaceSearchResults = createSelector(
  workspacesState,
  (workspacesState: ReduxAzureWorkspacesState) =>
    workspacesState.azureWorkspaceSearch
);

export const getSelectedAdminWorkspaces = createSelector(
  workspacesState,
  (workspacesState: ReduxAzureWorkspacesState) =>
    workspacesState.selectedAdminWorkspaces
);

export const getAdminWorkspaceIsLoading = createSelector(
  workspacesState,
  (workspacesState: ReduxAzureWorkspacesState) =>
    workspacesState.isAdminWorkspaceRefreshing
);

export const getSelectedAdminWorkspaceTasks = createSelector(
  workspacesState,
  (workspacesState: ReduxAzureWorkspacesState) =>
    workspacesState.selectedAdminWorkspaceTasks
);

export const getSelectedAdminWorkspaceTasksLoading = createSelector(
  workspacesState,
  (workspacesState: ReduxAzureWorkspacesState) =>
    workspacesState.selectedAdminWorkspaceTasksLoading
);

export const getAzureWorkspaceSearchLoading = createSelector(
  workspacesState,
  (workspacesState: ReduxAzureWorkspacesState) =>
    workspacesState.azureWorkspaceSearchLoading
);

export const getAzureWorkspacesSavingStatus = createSelector(
  workspacesState,
  (workspacesState: ReduxAzureWorkspacesState) =>
    workspacesState.isAzureWorkspacesSaving
);

export const getProvisioningApiVersion = createSelector(
  workspacesState,
  (workspacesState: ReduxAzureWorkspacesState) => workspacesState.apiVersion
);

export const getPendingAddressChangeID = createSelector(
  workspacesState,
  (workspaces: ReduxAzureWorkspacesState) => workspaces.pendingAddressChangeID
);

export const getPendingDNSChangeID = createSelector(
  workspacesState,
  (workspaces: ReduxAzureWorkspacesState) => workspaces.pendingDNSChangeID
);

export const getExtendWorkspaceRuntimeRequestPending = createSelector(
  workspacesState,
  (workspaces: ReduxAzureWorkspacesState) =>
    workspaces.extendWorkspaceRuntimeRequestPending
);

export const getExtendWorkspaceRuntimeRefreshPending = createSelector(
  workspacesState,
  (workspaces: ReduxAzureWorkspacesState) =>
    workspaces.extendWorkspaceRuntimeRefreshPending
);

export const getPasswordResetPending = createSelector(
  workspacesState,
  (workspaces: ReduxAzureWorkspacesState) => workspaces.passwordResetPending
);

export const getPrivateModePending = createSelector(
  workspacesState,
  (workspaces: ReduxAzureWorkspacesState) => workspaces.privateModePending
);

export const getPrivateModeRefreshPending = createSelector(
  workspacesState,
  (workspaces: ReduxAzureWorkspacesState) =>
    workspaces.privateModeRefreshPending
);

export const getPublicAddressesLoadingID = createSelector(
  workspacesState,
  (workspaces: ReduxAzureWorkspacesState) => workspaces.pendingAddressChangeID
);

export const getWorkspacePatchingSummary = createSelector(
  workspacesState,
  (workspaces: ReduxAzureWorkspacesState) => workspaces.workspacePatchingSummary
);

export const getWorkspacePatchingDetails = createSelector(
  workspacesState,
  (workspaces: ReduxAzureWorkspacesState) => workspaces.workspacePatchingDetails
);

export const getAllWorkspacesPatchingSummary = createSelector(
  workspacesState,
  (workspaces: ReduxAzureWorkspacesState) =>
    workspaces.allWorkspacesPatchingSummary
);

export const getWorkspacePatchingSummaryLoading = createSelector(
  workspacesState,
  (workspacesState: ReduxAzureWorkspacesState) =>
    workspacesState.workspacePatchingSummaryLoading
);

export const getWorkspacePatchingDetailsLoading = createSelector(
  workspacesState,
  (workspacesState: ReduxAzureWorkspacesState) =>
    workspacesState.workspacePatchingDetailsLoading
);

export const getAllWorkspacesPatchingSummaryLoading = createSelector(
  workspacesState,
  (workspacesState: ReduxAzureWorkspacesState) =>
    workspacesState.allWorkspacesPatchingSummaryLoading
);
