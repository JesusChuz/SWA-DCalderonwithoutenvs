import {
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
  EDITABLE_WORKSPACE_SAVE_DNS_ZONE,
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
  SHOW_DEFAULT_NOTIFICATION,
  SHOW_ERROR_NOTIFICATION,
  SHOW_SUCCESS_NOTIFICATION,
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
import { AzureWorkspaceDto } from '../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { getMockStore } from '../../utils/mockStore.util';
import ErrorAction from '../../../store/actions/errorAction';
import { telemetryContext } from '../../../applicationInsights/TelemetryService';
import { httpAuthService } from '../../../applicationInsights/httpAuthService';
import {
  clearAzureWorkspaceSearch,
  createAzureWorkspace,
  createDNSZone,
  deleteAzureWorkspace,
  fetchAdminAzureWorkspace,
  fetchAdminWorkspaceTasks,
  fetchAzureWorkspaces,
  fetchProvisioningApiVersion,
  resetPassword,
  savePublicAddressChanges,
  searchAzureWorkspace,
  setSelectedAdminWorkspace,
  startStopAzureMachine,
  startStopAzureWorkspace,
  updateAzureWorkspace,
  updateDNSZone,
} from '../../../store/actions';
import { EditableWorkspace } from '../../../types/Forms/EditableWorkspace.types';
import { AzurePublicAddressDto } from '../../../types/AzureWorkspace/AzurePublicAddressDto.types';
import { AzureDNSZoneDto } from '../../../types/AzureWorkspace/AzureDNSZoneDto.types';
import { AzureDNSZoneForCreationDto } from '../../../types/ResourceCreation/AzureDNSZoneForCreationDto.types';

jest.mock('../../../store/actions/errorAction');
jest.mock('../../../applicationInsights/TelemetryService.tsx');
jest.mock('src/applicationInsights/httpAuthService.ts');

(ErrorAction as jest.Mock).mockReturnValue(true);
(telemetryContext.logException as jest.Mock).mockReturnValue(true);
jest.spyOn(console, 'log').mockImplementation(() => null);
const failure = new Error('failure');

const store = getMockStore();

describe('Azure Workspace Action Tests', () => {
  beforeEach(() => {
    // Runs before each test in the suite
    store.clearActions();
  });
  test('fetchAzureWorkspaces action creator dispatches expected actions on success', async () => {
    const mockData: { data: AzureWorkspaceDto[] } = { data: [] };
    (httpAuthService.get as jest.Mock).mockReturnValue(mockData);
    const expectedActions = [
      { type: FETCH_AZURE_WORKSPACES_BEGIN, payload: false },
      {
        type: FETCH_AZURE_WORKSPACES_SUCCESS,
        payload: mockData.data,
      },
    ];
    await fetchAzureWorkspaces()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchAzureWorkspaces action creator dispatches expected actions on failure', async () => {
    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: FETCH_AZURE_WORKSPACES_BEGIN, payload: false },
      {
        type: FETCH_AZURE_WORKSPACES_FAILURE,
        payload: failure,
      },
    ];
    await fetchAzureWorkspaces()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('createAzureWorkspace action creator dispatches expected actions on success', async () => {
    const mockData = { Name: 'testName' };
    (httpAuthService.post as jest.Mock).mockResolvedValue(true);
    const expectedActions = [
      { type: CREATE_AZURE_WORKSPACE_BEGIN, payload: mockData.Name },
      {
        type: CREATE_AZURE_WORKSPACE_SUCCESS,
      },
    ];
    await createAzureWorkspace(mockData as EditableWorkspace)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('createAzureWorkspace action creator dispatches expected actions on failure', async () => {
    const mockData = { Name: 'testName' };
    (httpAuthService.post as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: CREATE_AZURE_WORKSPACE_BEGIN, payload: mockData.Name },
      {
        type: CREATE_AZURE_WORKSPACE_FAILURE,
        payload: failure,
      },
    ];
    await createAzureWorkspace(mockData as EditableWorkspace)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('updateAzureWorkspace action creator dispatches expected actions on success', async () => {
    const mockData = { ID: 'testid' };
    (httpAuthService.put as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      { type: UPDATE_AZURE_WORKSPACE_BEGIN, payload: mockData.ID },
      {
        type: UPDATE_AZURE_WORKSPACE_SUCCESS,
      },
    ];
    await updateAzureWorkspace(mockData as AzureWorkspaceDto)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('updateAzureWorkspace action creator dispatches expected actions on failure', async () => {
    const mockData = { ID: 'testid' };
    (httpAuthService.put as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: UPDATE_AZURE_WORKSPACE_BEGIN, payload: mockData.ID },
      {
        type: UPDATE_AZURE_WORKSPACE_FAILURE,
        payload: failure,
      },
    ];
    await updateAzureWorkspace(mockData as AzureWorkspaceDto)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('startStopAzureWorkspace action creator dispatches expected actions on start success', async () => {
    const mockData = 'testid';
    (httpAuthService.post as jest.Mock).mockResolvedValue(true);
    const expectedActions = [
      { type: START_STOP_WORKSPACE_BEGIN, payload: mockData },
      {
        type: START_STOP_WORKSPACE_SUCCESS,
      },
    ];
    await startStopAzureWorkspace(mockData, true)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('startStopAzureWorkspace action creator dispatches expected actions on start failure', async () => {
    const mockData = 'testid';
    (httpAuthService.post as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: START_STOP_WORKSPACE_BEGIN, payload: mockData },
      {
        type: START_STOP_WORKSPACE_FAILURE,
        payload: failure,
      },
    ];
    await startStopAzureWorkspace(mockData, true)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('startStopAzureWorkspace action creator dispatches expected actions on stop success', async () => {
    const mockData = 'testid';
    (httpAuthService.post as jest.Mock).mockResolvedValue(true);
    const expectedActions = [
      { type: START_STOP_WORKSPACE_BEGIN, payload: mockData },
      {
        type: START_STOP_WORKSPACE_SUCCESS,
      },
    ];
    await startStopAzureWorkspace(mockData, false)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('startStopAzureWorkspace action creator dispatches expected actions on stop failure', async () => {
    const mockData = 'testid';
    (httpAuthService.post as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: START_STOP_WORKSPACE_BEGIN, payload: mockData },
      {
        type: START_STOP_WORKSPACE_FAILURE,
        payload: failure,
      },
    ];
    await startStopAzureWorkspace(mockData, false)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('startStopAzureMachine action creator dispatches expected actions on start success', async () => {
    const mockWorkspaceID = 'testWorkspaceID';
    const mockMachineID = 'testMachineID';
    (httpAuthService.post as jest.Mock).mockResolvedValue(true);
    const expectedActions = [
      { type: START_STOP_MACHINE_BEGIN, payload: mockWorkspaceID },
      {
        type: START_STOP_MACHINE_SUCCESS,
      },
    ];
    await startStopAzureMachine(
      mockWorkspaceID,
      mockMachineID,
      true
    )(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('startStopAzureMachine action creator dispatches expected actions on start failure', async () => {
    const mockWorkspaceID = 'testWorkspaceID';
    const mockMachineID = 'testMachineID';
    (httpAuthService.post as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: START_STOP_MACHINE_BEGIN, payload: mockWorkspaceID },
      {
        type: START_STOP_MACHINE_FAILURE,
        payload: failure,
      },
    ];
    await startStopAzureMachine(
      mockWorkspaceID,
      mockMachineID,
      true
    )(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('startStopAzureMachine action creator dispatches expected actions on stop success', async () => {
    const mockWorkspaceID = 'testWorkspaceID';
    const mockMachineID = 'testMachineID';
    (httpAuthService.post as jest.Mock).mockResolvedValue(true);
    const expectedActions = [
      { type: START_STOP_MACHINE_BEGIN, payload: mockWorkspaceID },
      {
        type: START_STOP_MACHINE_SUCCESS,
      },
    ];
    await startStopAzureMachine(
      mockWorkspaceID,
      mockMachineID,
      false
    )(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('startStopAzureMachine action creator dispatches expected actions on stop failure', async () => {
    const mockWorkspaceID = 'testWorkspaceID';
    const mockMachineID = 'testMachineID';
    (httpAuthService.post as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: START_STOP_MACHINE_BEGIN, payload: mockWorkspaceID },
      {
        type: START_STOP_MACHINE_FAILURE,
        payload: failure,
      },
    ];
    await startStopAzureMachine(
      mockWorkspaceID,
      mockMachineID,
      false
    )(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('deleteAzureWorkspace action creator dispatches expected actions on success', async () => {
    const mockWorkspaceID = 'testWorkspaceID';
    (httpAuthService.delete as jest.Mock).mockResolvedValue(true);
    const expectedActions = [
      { type: DELETE_AZURE_WORKSPACE_BEGIN },
      {
        type: SHOW_DEFAULT_NOTIFICATION,
        message: 'Deletion in progress. Please wait.',
      },
      { type: DELETE_AZURE_WORKSPACE_SUCCESS },
      {
        type: SHOW_SUCCESS_NOTIFICATION,
        message: 'Successfully deleted workspace',
      },
    ];
    await deleteAzureWorkspace(mockWorkspaceID)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('deleteAzureWorkspace action creator dispatches expected actions on failure', async () => {
    const mockWorkspaceID = 'testWorkspaceID';
    (httpAuthService.delete as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: DELETE_AZURE_WORKSPACE_BEGIN },
      {
        type: SHOW_DEFAULT_NOTIFICATION,
        message: 'Deletion in progress. Please wait.',
      },
      {
        type: DELETE_AZURE_WORKSPACE_FAILURE,
        payload: failure,
      },
    ];
    await deleteAzureWorkspace(mockWorkspaceID)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('searchAzureWorkspace action creator dispatches expected actions on success', async () => {
    const mockQuery = 'bigQuery';
    const returnValue: AzureWorkspaceDto[] = [];
    (httpAuthService.get as jest.Mock).mockResolvedValue(true);
    const expectedActions = [
      { type: SEARCH_AZURE_WORKSPACE_BEGIN },
      {
        type: SEARCH_AZURE_WORKSPACE_SUCCESS,
        payload: returnValue,
      },
    ];
    await searchAzureWorkspace(mockQuery)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('searchAzureWorkspace action creator dispatches expected actions on failure', async () => {
    const mockQuery = 'bigQuery';

    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    jest.spyOn(console, 'error').mockImplementation(() => null);
    const expectedActions = [
      { type: SEARCH_AZURE_WORKSPACE_BEGIN },
      {
        type: SEARCH_AZURE_WORKSPACE_FAILURE,
        payload: failure,
      },
      {
        type: SHOW_ERROR_NOTIFICATION,
        message: 'Failed to retrieve Azure Workspaces:\nError: failure',
        linkText: '',
        panelToOpen: '',
      },
    ];
    await searchAzureWorkspace(mockQuery)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchAdminAzureWorkspace action creator dispatches expected actions on success', async () => {
    const workspaceID = 'testId';
    const returnValue: AzureWorkspaceDto[] = [];
    (httpAuthService.get as jest.Mock).mockResolvedValue(true);
    const expectedActions = [
      { type: FETCH_ADMIN_AZURE_WORKSPACE_BEGIN },
      {
        type: FETCH_ADMIN_AZURE_WORKSPACE_SUCCESS,
        payload: returnValue,
      },
    ];
    await fetchAdminAzureWorkspace(workspaceID)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchAdminAzureWorkspace action creator dispatches expected actions on failure', async () => {
    const workspaceID = 'testId';

    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: FETCH_ADMIN_AZURE_WORKSPACE_BEGIN },
      {
        type: FETCH_ADMIN_AZURE_WORKSPACE_FAILURE,
        payload: failure,
      },
      {
        type: SHOW_ERROR_NOTIFICATION,
        message: 'Failed to retrieve Azure Workspaces:\nError: failure',
        linkText: '',
        panelToOpen: '',
      },
    ];
    await fetchAdminAzureWorkspace(workspaceID)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchAdminWorkspaceTasks action creator dispatches expected actions on success', async () => {
    const workspaceID = 'testID';
    const returnValue: Record<string, unknown>[] = [];
    (httpAuthService.get as jest.Mock).mockResolvedValue(true);
    const expectedActions = [
      { type: FETCH_ADMIN_WORKSPACE_TASKS_BEGIN },
      {
        type: FETCH_ADMIN_WORKSPACE_TASKS_SUCCESS,
        payload: returnValue,
      },
    ];
    await fetchAdminWorkspaceTasks(workspaceID)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchAdminWorkspaceTasks action creator dispatches expected actions on failure', async () => {
    const workspaceID = 'testID';

    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: FETCH_ADMIN_WORKSPACE_TASKS_BEGIN },
      {
        type: FETCH_ADMIN_WORKSPACE_TASKS_FAILURE,
        payload: failure,
      },
      {
        type: SHOW_ERROR_NOTIFICATION,
        message: 'Failed to retrieve Azure Workspace tasks:\nError: failure',
        linkText: '',
        panelToOpen: '',
      },
    ];
    await fetchAdminWorkspaceTasks(workspaceID)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('savePublicAddressChanges action creator dispatches expected actions on success', async () => {
    const mockData = { ID: 'testid' };
    const expectedActions = [
      { type: SAVE_PUBLIC_ADDRESS_CHANGES_BEGIN, payload: mockData.ID },
      {
        type: SAVE_PUBLIC_ADDRESS_CHANGES_SUCCESS,
      },
    ];
    await savePublicAddressChanges(
      mockData as AzureWorkspaceDto,
      [],
      0
    )(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('savePublicAddressChanges action creator dispatches expected actions on failure', async () => {
    const mockData = { ID: 'testid' };
    (httpAuthService.delete as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: SAVE_PUBLIC_ADDRESS_CHANGES_BEGIN, payload: mockData.ID },
      {
        type: SAVE_PUBLIC_ADDRESS_CHANGES_FAILURE,
        payload: failure,
      },
    ];
    await savePublicAddressChanges(
      mockData as AzureWorkspaceDto,
      [{} as AzurePublicAddressDto],
      0
    )(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchProvisioningApiVersion action creator dispatches expected actions on success', async () => {
    const mockData = { data: '1.0.0' };
    (httpAuthService.get as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      { type: FETCH_PROVISIONING_API_VERSION_BEGIN },
      {
        type: FETCH_PROVISIONING_API_VERSION_SUCCESS,
        payload: mockData.data,
      },
    ];
    await fetchProvisioningApiVersion()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchProvisioningApiVersion action creator dispatches expected actions on failure', async () => {
    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: FETCH_PROVISIONING_API_VERSION_BEGIN },
      {
        type: FETCH_PROVISIONING_API_VERSION_FAILURE,
        payload: failure,
      },
    ];
    await fetchProvisioningApiVersion()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('updateDNSZone action creator dispatches expected actions on success', async () => {
    const mockData = { ID: 'testid', WorkspaceID: 'testWorkspaceID' };
    (httpAuthService.put as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      { type: UPDATE_DNS_ZONE_BEGIN, payload: mockData.WorkspaceID },
      {
        type: UPDATE_DNS_ZONE_SUCCESS,
      },
    ];
    await updateDNSZone(mockData as AzureDNSZoneDto)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('updateDNSZone action creator dispatches expected actions on failure', async () => {
    const mockData = { ID: 'testid', WorkspaceID: 'testWorkspaceID' };
    (httpAuthService.put as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: UPDATE_DNS_ZONE_BEGIN, payload: mockData.WorkspaceID },
      {
        type: UPDATE_DNS_ZONE_FAILURE,
        payload: failure,
      },
    ];
    await updateDNSZone(mockData as AzureDNSZoneDto)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('createDNSZone action creator dispatches expected actions on success', async () => {
    const mockData = { WorkspaceID: 'testWorkspaceID' };
    const mockResponse = { data: mockData };
    (httpAuthService.post as jest.Mock).mockResolvedValue(mockResponse);
    const expectedActions = [
      { type: CREATE_DNS_ZONE_BEGIN, payload: mockData.WorkspaceID },
      {
        type: CREATE_DNS_ZONE_SUCCESS,
      },
      {
        type: EDITABLE_WORKSPACE_SAVE_DNS_ZONE,
        payload: mockData,
      },
    ];
    await createDNSZone(mockData as AzureDNSZoneForCreationDto)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('createDNSZone action creator dispatches expected actions on failure', async () => {
    const mockData = { WorkspaceID: 'testWorkspaceID' };
    (httpAuthService.post as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: CREATE_DNS_ZONE_BEGIN, payload: mockData.WorkspaceID },
      {
        type: CREATE_DNS_ZONE_FAILURE,
        payload: failure,
      },
    ];
    await createDNSZone(mockData as AzureDNSZoneForCreationDto)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('resetPassword action creator dispatches expected actions on success', async () => {
    const workspaceID = 'testWorkspaceID';
    const machineID = 'testMachineID';
    const mockResponse = { status: 200 };
    (httpAuthService.put as jest.Mock).mockResolvedValue(mockResponse);
    const expectedActions = [
      { type: RESET_PASSWORD_BEGIN },
      {
        type: RESET_PASSWORD_SUCCESS,
      },
      expect.objectContaining({
        type: SHOW_DEFAULT_NOTIFICATION,
      }),
    ];
    await resetPassword(workspaceID, machineID)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('resetPassword action creator dispatches expected actions on failure', async () => {
    const workspaceID = 'testWorkspaceID';
    const machineID = 'testMachineID';
    (httpAuthService.put as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: RESET_PASSWORD_BEGIN },
      {
        type: RESET_PASSWORD_FAILURE,
        payload: failure,
      },
    ];
    await resetPassword(workspaceID, machineID)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('clearAzureWorkspaceSearch action contains expected type', () => {
    const expectedActions = [{ type: CLEAR_AZURE_WORKSPACE_SEARCH }];
    store.dispatch(clearAzureWorkspaceSearch());
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('setSelectedAdminWorkspace action contains expected type and payload', () => {
    const payload = [{}];
    const expectedActions = [{ type: SET_SELECTED_ADMIN_WORKSPACE, payload }];
    store.dispatch(setSelectedAdminWorkspace(payload[0] as AzureWorkspaceDto));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
