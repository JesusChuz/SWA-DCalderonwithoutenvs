import { Blank_WorkspaceScheduledJobError } from '../../../data/Blank_WorkspaceScheduledJobError';
import {
  EDITABLE_WORKSPACE_SET_WORKSPACE_SCHEDULED_JOB,
  EDITABLE_WORKSPACE_UPDATE_WORKSPACE_SCHEDULED_JOB,
} from '../../../store/actions/actionTypes';
import {
  EditableWorkspaceAction,
  editableWorkspaceChangeWorkspaceScheduledJobDaysOfWeek,
  editableWorkspaceChangeWorkspaceScheduledJobStartTime,
  editableWorkspaceChangeWorkspaceScheduledJobStopTime,
  editableWorkspaceChangeWorkspaceScheduledJobTimeZone,
  editableWorkspaceSetWorkspaceScheduledJob,
} from '../../../store/actions/editableWorkspaceActions';
import { editableWorkspaceInitialState } from '../../../store/reducers/editableWorkspaceReducer';
import { workspaceValidateWorkspaceScheduledJob } from '../../../store/validators/workspaceValidators';
import { WorkspaceScheduledJobError } from '../../../types/Forms/WorkspaceScheduledJobError.types';
import { getTestWorkspaceScheduledJobDto } from '../../data/WorkspaceScheduledJobDtoTestDta';
import { getMockStore } from '../../utils/mockStore.util';

jest.mock('../../../store/validators/workspaceValidators');

const initialWorkspaceScheduledJob = getTestWorkspaceScheduledJobDto({
  WorkspaceID: 'test-workspace-id',
});

const store = getMockStore({
  editableWorkspace: {
    ...editableWorkspaceInitialState,
    originalWorkspaceScheduledJob: initialWorkspaceScheduledJob,
    editedWorkspaceScheduledJob: initialWorkspaceScheduledJob,
  },
});

describe('Workspace Schedule Action Tests', () => {
  beforeEach(() => {
    // Runs before each test in the suite
    store.clearActions();
  });
  test('editableWorkspaceSetWorkspaceScheduledJob action creator dispatches expected action', async () => {
    const payload = getTestWorkspaceScheduledJobDto({
      ScheduledDays: 'Monday',
      AutoStartTimeOfDay: '00:00',
      AutoStopTimeOfDay: '12:00',
      TimeZone: 'new-timezone-id',
      WorkspaceID: 'new-workspace-id',
    });
    const error: WorkspaceScheduledJobError = {
      ...Blank_WorkspaceScheduledJobError,
      timeZoneError: 'This is an error',
    };
    (workspaceValidateWorkspaceScheduledJob as jest.Mock).mockReturnValue(
      error
    );
    const expectedAction: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_SET_WORKSPACE_SCHEDULED_JOB,
      payload,
      error,
    };
    await editableWorkspaceSetWorkspaceScheduledJob(payload)(
      store.dispatch,
      store.getState
    );
    expect(store.getActions()).toEqual([expectedAction]);
  });
  test('editableWorkspaceChangeWorkspaceScheduledJobTimeZone action creator dispatches expected action', async () => {
    const payload = 'new-timezone-id';
    const error: WorkspaceScheduledJobError = {
      ...Blank_WorkspaceScheduledJobError,
      timeZoneError: 'This is a time zone error',
    };
    (workspaceValidateWorkspaceScheduledJob as jest.Mock).mockReturnValue(
      error
    );
    const expectedAction: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_UPDATE_WORKSPACE_SCHEDULED_JOB,
      payload: {
        ...store.getState().editableWorkspace.editedWorkspaceScheduledJob,
        TimeZone: payload,
      },
      error,
    };
    await editableWorkspaceChangeWorkspaceScheduledJobTimeZone(payload)(
      store.dispatch,
      store.getState
    );
    expect(store.getActions()).toEqual([expectedAction]);
  });
  test('editableWorkspaceChangeWorkspaceScheduledJobStartTime action creator dispatches expected action', async () => {
    const payload = '03:00';
    const error: WorkspaceScheduledJobError = {
      ...Blank_WorkspaceScheduledJobError,
      timeError: 'This is a start time error',
    };
    (workspaceValidateWorkspaceScheduledJob as jest.Mock).mockReturnValue(
      error
    );
    const expectedAction: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_UPDATE_WORKSPACE_SCHEDULED_JOB,
      payload: {
        ...store.getState().editableWorkspace.editedWorkspaceScheduledJob,
        AutoStartTimeOfDay: payload,
      },
      error,
    };
    await editableWorkspaceChangeWorkspaceScheduledJobStartTime(payload)(
      store.dispatch,
      store.getState
    );
    expect(store.getActions()).toEqual([expectedAction]);
  });
  test('editableWorkspaceChangeWorkspaceScheduledJobStopTime action creator dispatches expected action', async () => {
    const payload = '14:00';
    const error: WorkspaceScheduledJobError = {
      ...Blank_WorkspaceScheduledJobError,
      timeError: 'This is a start time error',
    };
    (workspaceValidateWorkspaceScheduledJob as jest.Mock).mockReturnValue(
      error
    );
    const expectedAction: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_UPDATE_WORKSPACE_SCHEDULED_JOB,
      payload: {
        ...store.getState().editableWorkspace.editedWorkspaceScheduledJob,
        AutoStopTimeOfDay: payload,
      },
      error,
    };
    await editableWorkspaceChangeWorkspaceScheduledJobStopTime(payload)(
      store.dispatch,
      store.getState
    );
    expect(store.getActions()).toEqual([expectedAction]);
  });
  test('editableWorkspaceChangeWorkspaceScheduledJobDaysOfWeek action creator dispatches expected action', async () => {
    const payload = 'Monday, Friday';
    const error: WorkspaceScheduledJobError = {
      ...Blank_WorkspaceScheduledJobError,
      daysOfWeekError: 'This is a start time error',
    };
    (workspaceValidateWorkspaceScheduledJob as jest.Mock).mockReturnValue(
      error
    );
    const expectedAction: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_UPDATE_WORKSPACE_SCHEDULED_JOB,
      payload: {
        ...store.getState().editableWorkspace.editedWorkspaceScheduledJob,
        ScheduledDays: payload,
      },
      error,
    };
    await editableWorkspaceChangeWorkspaceScheduledJobDaysOfWeek(payload)(
      store.dispatch,
      store.getState
    );
    expect(store.getActions()).toEqual([expectedAction]);
  });
});
