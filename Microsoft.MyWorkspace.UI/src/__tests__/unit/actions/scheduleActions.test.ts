import { getMockStore } from '../../utils/mockStore.util';
import { httpAuthService } from '../../../applicationInsights/httpAuthService';
import { WorkspaceScheduledJobDto } from '../../../types/Job/WorkspaceScheduledJobDto.types';
import { getTestWorkspaceScheduledJobDto } from '../../data/WorkspaceScheduledJobDtoTestDta';
import {
  CREATE_WORKSPACE_SCHEDULED_JOB_BEGIN,
  CREATE_WORKSPACE_SCHEDULED_JOB_FAILURE,
  CREATE_WORKSPACE_SCHEDULED_JOB_SUCCESS,
  EDITABLE_WORKSPACE_SET_WORKSPACE_SCHEDULED_JOB,
  FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_BEGIN,
  FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_FAILURE,
  FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_SUCCESS,
  UPDATE_WORKSPACE_SCHEDULED_JOB_BEGIN,
  UPDATE_WORKSPACE_SCHEDULED_JOB_FAILURE,
  UPDATE_WORKSPACE_SCHEDULED_JOB_SUCCESS,
} from '../../../store/actions/actionTypes';
import {
  createWorkspaceScheduleJob,
  fetchAdminWorkspaceScheduleJob,
  updateWorkspaceScheduleJob,
} from '../../../store/actions';

const store = getMockStore();

jest.mock('../../../store/actions/errorAction');
jest.mock('../../../applicationInsights/TelemetryService.tsx');
jest.mock('src/applicationInsights/httpAuthService.ts');
const failure = new Error('failure');

describe('Azure Workspace Action Tests', () => {
  beforeEach(() => {
    // Runs before each test in the suite
    store.clearActions();
  });
  test('fetchWorkspaceScheduleJob action creator action creator dispatches expected actions on success', async () => {
    const mockWorkspaceID = 'mock-workspace-id-1';
    const mockData: { data: WorkspaceScheduledJobDto } = {
      data: getTestWorkspaceScheduledJobDto({ WorkspaceID: mockWorkspaceID }),
    };
    (httpAuthService.get as jest.Mock).mockReturnValue(mockData);
    const expectedActions = [
      expect.objectContaining({
        type: FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_BEGIN,
      }),
      expect.objectContaining({
        type: EDITABLE_WORKSPACE_SET_WORKSPACE_SCHEDULED_JOB,
      }),
      {
        type: FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_SUCCESS,
        payload: mockData.data,
      },
    ];
    await fetchAdminWorkspaceScheduleJob(mockWorkspaceID)(
      store.dispatch,
      store.getState
    );
    expect(store.getActions()).toEqual(expect.arrayContaining(expectedActions));
  });
  test('fetchWorkspaceScheduleJob action creator action creator dispatches expected actions on failure', async () => {
    const mockWorkspaceID = 'mock-workspace-id-1';
    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      expect.objectContaining({
        type: FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_BEGIN,
      }),
      expect.objectContaining({
        type: EDITABLE_WORKSPACE_SET_WORKSPACE_SCHEDULED_JOB,
      }),
      {
        type: FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_FAILURE,
        payload: failure,
      },
    ];
    await fetchAdminWorkspaceScheduleJob(mockWorkspaceID)(
      store.dispatch,
      store.getState
    );
    expect(store.getActions()).toEqual(expect.arrayContaining(expectedActions));
  });
  test('createWorkspaceScheduleJob action creator action creator dispatches expected actions on success', async () => {
    (httpAuthService.post as jest.Mock).mockReturnValue(true);
    const mockWorkspaceID = 'mock-workspace-id-2';
    const mockData = getTestWorkspaceScheduledJobDto({
      WorkspaceID: mockWorkspaceID,
    });
    const expectedActions = [
      { type: CREATE_WORKSPACE_SCHEDULED_JOB_BEGIN },
      {
        type: CREATE_WORKSPACE_SCHEDULED_JOB_SUCCESS,
      },
    ];
    await createWorkspaceScheduleJob(mockData)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('createWorkspaceScheduleJob action creator action creator dispatches expected actions on failure', async () => {
    (httpAuthService.post as jest.Mock).mockRejectedValue(failure);
    const mockWorkspaceID = 'mock-workspace-id-2';
    const mockData = getTestWorkspaceScheduledJobDto({
      WorkspaceID: mockWorkspaceID,
    });
    const expectedActions = [
      { type: CREATE_WORKSPACE_SCHEDULED_JOB_BEGIN },
      {
        type: CREATE_WORKSPACE_SCHEDULED_JOB_FAILURE,
        payload: failure,
      },
    ];
    await createWorkspaceScheduleJob(mockData)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('updateWorkspaceScheduleJob action creator action creator dispatches expected actions on success', async () => {
    (httpAuthService.put as jest.Mock).mockReturnValue(true);
    const mockWorkspaceID = 'mock-workspace-id-3';
    const mockData = getTestWorkspaceScheduledJobDto({
      WorkspaceID: mockWorkspaceID,
    });
    const expectedActions = [
      { type: UPDATE_WORKSPACE_SCHEDULED_JOB_BEGIN },
      {
        type: UPDATE_WORKSPACE_SCHEDULED_JOB_SUCCESS,
      },
    ];
    await updateWorkspaceScheduleJob(mockData)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('updateWorkspaceScheduleJob action creator action creator dispatches expected actions on failure', async () => {
    (httpAuthService.put as jest.Mock).mockRejectedValue(failure);
    const mockWorkspaceID = 'mock-workspace-id-3';
    const mockData = getTestWorkspaceScheduledJobDto({
      WorkspaceID: mockWorkspaceID,
    });
    const expectedActions = [
      { type: UPDATE_WORKSPACE_SCHEDULED_JOB_BEGIN },
      {
        type: UPDATE_WORKSPACE_SCHEDULED_JOB_FAILURE,
        payload: failure,
      },
    ];
    await updateWorkspaceScheduleJob(mockData)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
});
