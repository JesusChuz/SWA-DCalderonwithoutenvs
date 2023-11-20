import { AxiosError } from 'axios';
import { Blank_AzureWorkspaceDto } from '../../../data/Blank_AzureWorkspaceDto';
import { WorkspaceAction } from '../../../store/actions';
import {
  ActionType,
  CLEAR_AZURE_WORKSPACE_SEARCH,
  CREATE_AZURE_WORKSPACE_BEGIN,
  CREATE_AZURE_WORKSPACE_FAILURE,
  CREATE_AZURE_WORKSPACE_SUCCESS,
  CREATE_DNS_ZONE_BEGIN,
  CREATE_DNS_ZONE_FAILURE,
  CREATE_DNS_ZONE_SUCCESS,
  DELETE_AZURE_WORKSPACE_BEGIN,
  DELETE_AZURE_WORKSPACE_FAILURE,
  DELETE_AZURE_WORKSPACE_SUCCESS,
  EXTEND_AZURE_WORKSPACE_RUNTIME_BEGIN,
  EXTEND_AZURE_WORKSPACE_RUNTIME_FAILURE,
  EXTEND_AZURE_WORKSPACE_RUNTIME_SUCCESS,
  FETCH_ADMIN_AZURE_WORKSPACE_BEGIN,
  FETCH_ADMIN_AZURE_WORKSPACE_FAILURE,
  FETCH_ADMIN_AZURE_WORKSPACE_SUCCESS,
  FETCH_ADMIN_WORKSPACE_TASKS_BEGIN,
  FETCH_ADMIN_WORKSPACE_TASKS_FAILURE,
  FETCH_ADMIN_WORKSPACE_TASKS_SUCCESS,
  FETCH_AZURE_WORKSPACES_BEGIN,
  FETCH_AZURE_WORKSPACES_FAILURE,
  FETCH_AZURE_WORKSPACES_SUCCESS,
  FETCH_PROVISIONING_API_VERSION_BEGIN,
  FETCH_PROVISIONING_API_VERSION_FAILURE,
  FETCH_PROVISIONING_API_VERSION_SUCCESS,
  RESET_PASSWORD_BEGIN,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_SUCCESS,
  SAVE_PUBLIC_ADDRESS_CHANGES_BEGIN,
  SAVE_PUBLIC_ADDRESS_CHANGES_FAILURE,
  SAVE_PUBLIC_ADDRESS_CHANGES_SUCCESS,
  SEARCH_AZURE_WORKSPACE_BEGIN,
  SEARCH_AZURE_WORKSPACE_FAILURE,
  SEARCH_AZURE_WORKSPACE_SUCCESS,
  SET_SELECTED_ADMIN_WORKSPACE,
  START_STOP_MACHINE_BEGIN,
  START_STOP_MACHINE_FAILURE,
  START_STOP_MACHINE_SUCCESS,
  START_STOP_WORKSPACE_BEGIN,
  START_STOP_WORKSPACE_FAILURE,
  START_STOP_WORKSPACE_SUCCESS,
  UPDATE_AZURE_WORKSPACE_BEGIN,
  UPDATE_AZURE_WORKSPACE_FAILURE,
  UPDATE_AZURE_WORKSPACE_SUCCESS,
  UPDATE_DNS_ZONE_BEGIN,
  UPDATE_DNS_ZONE_FAILURE,
  UPDATE_DNS_ZONE_SUCCESS,
} from '../../../store/actions/actionTypes';
import azureWorkspaceReducer, {
  workspacesInitialState,
} from '../../../store/reducers/azureWorkspaceReducer';
import { AxiosErrorTestData } from '../../data/AxiosErrorTestData';
import { getTestVirtualMachineDto } from '../../data/AzureVirtualMachineTestData';

const initialState = workspacesInitialState;

const axiosError: AxiosError = {
  ...AxiosErrorTestData,
};

const testWorkspaceList = [
  {
    ...Blank_AzureWorkspaceDto,
    ID: 'workspace-id-1',
    VirtualMachines: [getTestVirtualMachineDto({ ID: 'virtual-machine-id-1' })],
  },
  {
    ...Blank_AzureWorkspaceDto,
    ID: 'workspace-id-2',
    VirtualMachines: [getTestVirtualMachineDto({ ID: 'virtual-machine-id-2' })],
  },
  {
    ...Blank_AzureWorkspaceDto,
    ID: 'workspace-id-3',
    VirtualMachines: [getTestVirtualMachineDto({ ID: 'virtual-machine-id-3' })],
  },
];

describe('Azure Workspace Reducer Tests', () => {
  test('Action with FETCH_AZURE_WORKSPACES_BEGIN type returns correct state', () => {
    const action: WorkspaceAction = {
      type: FETCH_AZURE_WORKSPACES_BEGIN,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.isAzureWorkspacesLoading).toBe(true);
    expect(newState.fetchAzureWorkspacesError).toBeNull();
  });
  test('Action with FETCH_AZURE_WORKSPACES_SUCCESS type returns correct state', () => {
    const action: WorkspaceAction = {
      type: FETCH_AZURE_WORKSPACES_SUCCESS,
      payload: testWorkspaceList,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.azureWorkspaces).toEqual(testWorkspaceList);
    expect(newState.isAzureWorkspacesLoading).toBe(false);
    expect(newState.loadedWorkspacesFirstTime).toBe(true);
    expect(newState.extendWorkspaceRuntimeRefreshPending).toBe(false);
  });
  test('Action with FETCH_AZURE_WORKSPACES_FAILURE type returns correct state', () => {
    const action: WorkspaceAction = {
      type: FETCH_AZURE_WORKSPACES_FAILURE,
      payload: axiosError,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.isAzureWorkspacesLoading).toBe(false);
    expect(newState.fetchAzureWorkspacesError).toEqual(axiosError);
    expect(newState.loadedWorkspacesFirstTime).toBe(true);
    expect(newState.extendWorkspaceRuntimeRefreshPending).toBe(false);
  });
  test('Action with CREATE_AZURE_WORKSPACE_BEGIN type returns correct state', () => {
    const pendingSaveID = 'pending-save-id';
    const action: WorkspaceAction = {
      type: CREATE_AZURE_WORKSPACE_BEGIN,
      payload: pendingSaveID,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.isAzureWorkspacesSaving).toBe(true);
    expect(newState.pendingSaveID).toBe(pendingSaveID);
    expect(newState.createWorkspaceError).toBeNull();
  });
  test('Action with CREATE_AZURE_WORKSPACE_SUCCESS type returns correct state', () => {
    const action: WorkspaceAction = {
      type: CREATE_AZURE_WORKSPACE_SUCCESS,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.isAzureWorkspacesSaving).toBe(false);
    expect(newState.pendingSaveID).toBe('');
  });
  test('Action with CREATE_AZURE_WORKSPACE_FAILURE type returns correct state', () => {
    const action: WorkspaceAction = {
      type: CREATE_AZURE_WORKSPACE_FAILURE,
      payload: axiosError,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.isAzureWorkspacesSaving).toBe(false);
    expect(newState.pendingSaveID).toBe('');
    expect(newState.createWorkspaceError).toEqual(axiosError);
  });
  test.each([
    UPDATE_AZURE_WORKSPACE_BEGIN,
    START_STOP_WORKSPACE_BEGIN,
    START_STOP_MACHINE_BEGIN,
  ])('Action with %s type returns correct state', (type: ActionType) => {
    const pendingSaveID = 'pending-save-id';
    const action: WorkspaceAction = {
      type,
      payload: pendingSaveID,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.pendingSaveID).toBe(pendingSaveID);
    expect(newState.updateWorkspaceError).toBeNull();
  });
  test.each([
    UPDATE_AZURE_WORKSPACE_SUCCESS,
    START_STOP_WORKSPACE_SUCCESS,
    START_STOP_MACHINE_SUCCESS,
  ])(
    // eslint-disable-next-line jest/no-identical-title
    'Action with %s type returns correct state',
    (type: ActionType) => {
      const action: WorkspaceAction = {
        type,
      };
      const newState = azureWorkspaceReducer(initialState, action);
      expect(newState.pendingSaveID).toBe('');
    }
  );
  test.each([
    UPDATE_AZURE_WORKSPACE_FAILURE,
    START_STOP_WORKSPACE_FAILURE,
    START_STOP_MACHINE_FAILURE,
  ])(
    // eslint-disable-next-line jest/no-identical-title
    'Action with %s type returns correct state',
    (type: ActionType) => {
      const action: WorkspaceAction = {
        type,
        payload: axiosError,
      };
      const newState = azureWorkspaceReducer(initialState, action);
      expect(newState.pendingSaveID).toBe('');
      expect(newState.updateWorkspaceError).toEqual(axiosError);
    }
  );
  test('Action with DELETE_AZURE_WORKSPACE_BEGIN type returns correct state', () => {
    const action: WorkspaceAction = {
      type: DELETE_AZURE_WORKSPACE_BEGIN,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.isDeletePending).toBe(true);
    expect(newState.deleteWorkspaceError).toBeNull();
  });
  test('Action with DELETE_AZURE_WORKSPACE_SUCCESS type returns correct state', () => {
    const action: WorkspaceAction = {
      type: DELETE_AZURE_WORKSPACE_SUCCESS,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.isDeletePending).toBe(false);
  });
  test('Action with DELETE_AZURE_WORKSPACE_FAILURE type returns correct state', () => {
    const action: WorkspaceAction = {
      type: DELETE_AZURE_WORKSPACE_FAILURE,
      payload: axiosError,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.isDeletePending).toBe(false);
    expect(newState.deleteWorkspaceError).toEqual(axiosError);
  });
  test('Action with SEARCH_AZURE_WORKSPACE_BEGIN type returns correct state', () => {
    const action: WorkspaceAction = {
      type: SEARCH_AZURE_WORKSPACE_BEGIN,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.azureWorkspaceSearchLoading).toBe(true);
    expect(newState.azureWorkspaceSearchError).toBeNull();
  });
  test('Action with SEARCH_AZURE_WORKSPACE_SUCCESS type returns correct state', () => {
    const action: WorkspaceAction = {
      type: SEARCH_AZURE_WORKSPACE_SUCCESS,
      payload: testWorkspaceList,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.azureWorkspaceSearch).toEqual(testWorkspaceList);
    expect(newState.azureWorkspaceSearchLoading).toBe(false);
  });
  test('Action with SEARCH_AZURE_WORKSPACE_FAILURE type returns correct state', () => {
    const action: WorkspaceAction = {
      type: SEARCH_AZURE_WORKSPACE_FAILURE,
      payload: axiosError,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.azureWorkspaceSearchLoading).toBe(false);
    expect(newState.azureWorkspaceSearchError).toEqual(axiosError);
  });
  test('Action with CLEAR_AZURE_WORKSPACE_SEARCH type returns correct state', () => {
    const action: WorkspaceAction = {
      type: CLEAR_AZURE_WORKSPACE_SEARCH,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.azureWorkspaceSearch).toBeNull();
    expect(newState.azureWorkspaceSearchLoading).toBe(false);
    expect(newState.azureWorkspaceSearchError).toBeNull();
  });
  test('Action with SET_SELECTED_ADMIN_WORKSPACE type returns correct state', () => {
    const action: WorkspaceAction = {
      type: SET_SELECTED_ADMIN_WORKSPACE,
      payload: testWorkspaceList,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.selectedAdminWorkspaces).toEqual(testWorkspaceList);
  });
  test('Action with FETCH_ADMIN_AZURE_WORKSPACE_BEGIN type returns correct state', () => {
    const action: WorkspaceAction = {
      type: FETCH_ADMIN_AZURE_WORKSPACE_BEGIN,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.isAdminWorkspaceRefreshing).toBe(true);
    expect(newState.adminWorkspaceRefreshError).toBeNull();
  });
  test('Action with FETCH_ADMIN_AZURE_WORKSPACE_SUCCESS type returns correct state', () => {
    const action: WorkspaceAction = {
      type: FETCH_ADMIN_AZURE_WORKSPACE_SUCCESS,
      payload: testWorkspaceList,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.selectedAdminWorkspaces).toEqual(testWorkspaceList);
    expect(newState.isAdminWorkspaceRefreshing).toBe(false);
  });
  test('Action with FETCH_ADMIN_AZURE_WORKSPACE_FAILURE type returns correct state', () => {
    const action: WorkspaceAction = {
      type: FETCH_ADMIN_AZURE_WORKSPACE_FAILURE,
      payload: axiosError,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.isAdminWorkspaceRefreshing).toBe(false);
    expect(newState.adminWorkspaceRefreshError).toEqual(axiosError);
  });
  test('Action with FETCH_ADMIN_WORKSPACE_TASKS_BEGIN type returns correct state', () => {
    const action: WorkspaceAction = {
      type: FETCH_ADMIN_WORKSPACE_TASKS_BEGIN,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.selectedAdminWorkspaceTasksLoading).toBe(true);
    expect(newState.selectedAdminWorkspaceTasksError).toBeNull();
  });
  test('Action with FETCH_ADMIN_WORKSPACE_TASKS_SUCCESS type returns correct state', () => {
    const payload = [
      {
        task1: { Type: 'Test Task 1', ID: 'task-id-1' },
        task2: { Type: 'Test Task 2', ID: 'task-id-2' },
      },
    ];
    const action: WorkspaceAction = {
      type: FETCH_ADMIN_WORKSPACE_TASKS_SUCCESS,
      payload,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.selectedAdminWorkspaceTasks).toEqual(payload);
    expect(newState.selectedAdminWorkspaceTasksLoading).toBe(false);
  });
  test('Action with FETCH_ADMIN_WORKSPACE_TASKS_FAILURE type returns correct state', () => {
    const action: WorkspaceAction = {
      type: FETCH_ADMIN_WORKSPACE_TASKS_FAILURE,
      payload: axiosError,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.selectedAdminWorkspaceTasksLoading).toBe(false);
    expect(newState.selectedAdminWorkspaceTasksError).toEqual(axiosError);
  });
  test('Action with FETCH_PROVISIONING_API_VERSION_BEGIN type returns correct state', () => {
    const action: WorkspaceAction = {
      type: FETCH_PROVISIONING_API_VERSION_BEGIN,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.apiVersion).toBe('Loading...');
  });
  test('Action with FETCH_PROVISIONING_API_VERSION_FAILURE type returns correct state', () => {
    const action: WorkspaceAction = {
      type: FETCH_PROVISIONING_API_VERSION_FAILURE,
      payload: axiosError,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.apiVersion).toBe('unavailable');
    expect(newState.apiVersionError).toEqual(axiosError);
  });
  test('Action with FETCH_PROVISIONING_API_VERSION_SUCCESS type returns correct state', () => {
    const apiVersion = '1.1';
    const action: WorkspaceAction = {
      type: FETCH_PROVISIONING_API_VERSION_SUCCESS,
      payload: apiVersion,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.apiVersion).toBe(apiVersion);
  });
  test('Action with SAVE_PUBLIC_ADDRESS_CHANGES_BEGIN type returns correct state', () => {
    const addressID = 'address-id';
    const action: WorkspaceAction = {
      type: SAVE_PUBLIC_ADDRESS_CHANGES_BEGIN,
      payload: addressID,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.pendingAddressChangeID).toBe(addressID);
  });
  test.each([
    SAVE_PUBLIC_ADDRESS_CHANGES_SUCCESS,
    SAVE_PUBLIC_ADDRESS_CHANGES_FAILURE,
  ])(
    // eslint-disable-next-line jest/no-identical-title
    'Action with %s type returns correct state',
    (actionType: ActionType) => {
      const action: WorkspaceAction = {
        type: actionType,
      };
      const newState = azureWorkspaceReducer(initialState, action);
      expect(newState.pendingAddressChangeID).toBe('');
    }
  );
  test.each([
    CREATE_DNS_ZONE_BEGIN,
    UPDATE_DNS_ZONE_BEGIN,
    // eslint-disable-next-line jest/no-identical-title
  ])('Action with %s type returns correct state', (actionType: ActionType) => {
    const dnsChangeID = 'dns-id';
    const action: WorkspaceAction = {
      type: actionType,
      payload: dnsChangeID,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.pendingDNSChangeID).toBe(dnsChangeID);
  });
  test.each([
    CREATE_DNS_ZONE_SUCCESS,
    CREATE_DNS_ZONE_FAILURE,
    UPDATE_DNS_ZONE_SUCCESS,
    UPDATE_DNS_ZONE_FAILURE,
  ])(
    // eslint-disable-next-line jest/no-identical-title
    'Action with %s type returns correct state',
    (actionType: ActionType) => {
      const action: WorkspaceAction = {
        type: actionType,
      };
      const newState = azureWorkspaceReducer(initialState, action);
      expect(newState.pendingDNSChangeID).toBe('');
    }
  );
  test('Action with EXTEND_AZURE_WORKSPACE_RUNTIME_BEGIN type returns correct state', () => {
    const action: WorkspaceAction = {
      type: EXTEND_AZURE_WORKSPACE_RUNTIME_BEGIN,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.extendWorkspaceRuntimeRequestPending).toBe(true);
    expect(newState.extendWorkspaceRuntimeRequestError).toBeNull();
  });
  test('Action with EXTEND_AZURE_WORKSPACE_RUNTIME_SUCCESS type returns correct state', () => {
    const action: WorkspaceAction = {
      type: EXTEND_AZURE_WORKSPACE_RUNTIME_SUCCESS,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.extendWorkspaceRuntimeRequestPending).toBe(false);
    expect(newState.extendWorkspaceRuntimeRefreshPending).toBe(true);
  });
  test('Action with EXTEND_AZURE_WORKSPACE_RUNTIME_FAILURE type returns correct state', () => {
    const action: WorkspaceAction = {
      type: EXTEND_AZURE_WORKSPACE_RUNTIME_FAILURE,
      payload: axiosError,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.extendWorkspaceRuntimeRequestPending).toBe(false);
    expect(newState.extendWorkspaceRuntimeRequestError).toEqual(axiosError);
  });
  test('Action with RESET_PASSWORD_BEGIN type returns correct state', () => {
    const action: WorkspaceAction = {
      type: RESET_PASSWORD_BEGIN,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.passwordResetPending).toBe(true);
    expect(newState.passwordResetError).toBeNull();
  });
  test('Action with RESET_PASSWORD_SUCCESS type returns correct state', () => {
    const action: WorkspaceAction = {
      type: RESET_PASSWORD_SUCCESS,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.passwordResetPending).toBe(false);
  });
  test('Action with RESET_PASSWORD_FAILURE type returns correct state', () => {
    const action: WorkspaceAction = {
      type: RESET_PASSWORD_FAILURE,
      payload: axiosError,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState.passwordResetError).toEqual(axiosError);
  });
  test('Default case returns initial state', () => {
    const action: WorkspaceAction = {
      type: null,
    };
    const newState = azureWorkspaceReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
});
