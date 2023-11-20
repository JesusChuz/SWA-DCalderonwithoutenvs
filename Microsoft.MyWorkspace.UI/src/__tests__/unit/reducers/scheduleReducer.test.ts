import { AxiosError } from 'axios';
import { ScheduleAction } from '../../../store/actions';
import {
  ActionType,
  CREATE_WORKSPACE_SCHEDULED_JOB_BEGIN,
  CREATE_WORKSPACE_SCHEDULED_JOB_FAILURE,
  CREATE_WORKSPACE_SCHEDULED_JOB_SUCCESS,
  FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_BEGIN,
  FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_FAILURE,
  FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_SUCCESS,
  FETCH_WORKSPACE_SCHEDULED_JOBS_BEGIN,
  FETCH_WORKSPACE_SCHEDULED_JOBS_FAILURE,
  FETCH_WORKSPACE_SCHEDULED_JOBS_SUCCESS,
  UPDATE_WORKSPACE_SCHEDULED_JOB_BEGIN,
  UPDATE_WORKSPACE_SCHEDULED_JOB_FAILURE,
  UPDATE_WORKSPACE_SCHEDULED_JOB_SUCCESS,
} from '../../../store/actions/actionTypes';
import scheduleReducer, {
  scheduleInitialState,
} from '../../../store/reducers/scheduleReducer';
import { WorkspaceScheduledJobDto } from '../../../types/Job/WorkspaceScheduledJobDto.types';
import { AxiosErrorTestData } from '../../data/AxiosErrorTestData';
import { getTestWorkspaceScheduledJobDto } from '../../data/WorkspaceScheduledJobDtoTestDta';

const initialState = scheduleInitialState;
const axiosError: AxiosError = {
  ...AxiosErrorTestData,
};

describe('Schedule Reducer Tests', () => {
  test('Action with FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_BEGIN type returns correct state', () => {
    const action: ScheduleAction = {
      type: FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_BEGIN,
    };
    const newState = scheduleReducer(initialState, action);
    expect(newState.isAdminWorkspaceScheduleLoading).toBe(true);
    expect(newState.selectedAdminWorkspaceSchedule).toBeNull();
  });
  test('Action with FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_SUCCESS type returns correct state', () => {
    const payload: WorkspaceScheduledJobDto = getTestWorkspaceScheduledJobDto({
      TimeZone: 'workspace-scheduled-job-timezone',
      ScheduledDays: 'Monday',
      AutoStartTimeOfDay: '00:00',
      AutoStopTimeOfDay: '12:30',
    });
    const action: ScheduleAction = {
      type: FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_SUCCESS,
      payload,
    };
    const startState = {
      ...initialState,
      isWorkspaceScheduleLoading: true,
    };
    const newState = scheduleReducer(startState, action);
    expect(newState.selectedAdminWorkspaceSchedule).toEqual(payload);
    expect(newState.isAdminWorkspaceScheduleLoading).toBe(false);
  });
  test('Action with FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_FAILURE type returns correct state', () => {
    const action: ScheduleAction = {
      type: FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_FAILURE,
      payload: axiosError,
    };
    const startState = {
      ...initialState,
      isWorkspaceScheduleLoading: true,
    };
    const newState = scheduleReducer(startState, action);
    expect(newState.isAdminWorkspaceScheduleLoading).toBe(false);
    expect(newState.fetchAdminWorkspaceScheduleError).toEqual(axiosError);
  });
  test('Action with FETCH_WORKSPACE_SCHEDULED_JOBS_BEGIN type returns correct state', () => {
    const action: ScheduleAction = {
      type: FETCH_WORKSPACE_SCHEDULED_JOBS_BEGIN,
    };
    const newState = scheduleReducer(initialState, action);
    expect(newState.areWorkspaceSchedulesLoading).toBe(true);
    expect(newState.workspaceSchedules).toEqual([]);
    expect(newState.selectedAdminWorkspaceSchedule).toBeNull();
  });
  test('Action with FETCH_WORKSPACE_SCHEDULED_JOBS_SUCCESS type returns correct state', () => {
    const payload: WorkspaceScheduledJobDto[] = [
      getTestWorkspaceScheduledJobDto({
        TimeZone: 'workspace-scheduled-job-timezone',
        ScheduledDays: 'Monday',
        AutoStartTimeOfDay: '00:00',
        AutoStopTimeOfDay: '12:30',
      }),
    ];
    const action: ScheduleAction = {
      type: FETCH_WORKSPACE_SCHEDULED_JOBS_SUCCESS,
      payload,
    };
    const startState = {
      ...initialState,
      isWorkspaceScheduleLoading: true,
    };
    const newState = scheduleReducer(startState, action);
    expect(newState.workspaceSchedules).toEqual(payload);
    expect(newState.areWorkspaceSchedulesLoading).toBe(false);
    expect(newState.loadedWorkspaceScheduledJobsFirstTime).toEqual(true);
  });
  test('Action with FETCH_WORKSPACE_SCHEDULED_JOBS_FAILURE type returns correct state', () => {
    const action: ScheduleAction = {
      type: FETCH_WORKSPACE_SCHEDULED_JOBS_FAILURE,
      payload: axiosError,
    };
    const startState = {
      ...initialState,
      isWorkspaceScheduleLoading: true,
    };
    const newState = scheduleReducer(startState, action);
    expect(newState.areWorkspaceSchedulesLoading).toBe(false);
    expect(newState.fetchWorkspaceSchedulesError).toEqual(axiosError);
    expect(newState.loadedWorkspaceScheduledJobsFirstTime).toEqual(true);
  });
  test('Action with CREATE_WORKSPACE_SCHEDULED_JOB_BEGIN type returns correct state', () => {
    const action: ScheduleAction = {
      type: CREATE_WORKSPACE_SCHEDULED_JOB_BEGIN,
    };
    const newState = scheduleReducer(initialState, action);
    expect(newState.isWorkspaceScheduleSaving).toBe(true);
    expect(newState.createWorkspaceScheduleError).toBeNull();
  });
  test('Action with CREATE_WORKSPACE_SCHEDULED_JOB_FAILURE type returns correct state', () => {
    const action: ScheduleAction = {
      type: CREATE_WORKSPACE_SCHEDULED_JOB_FAILURE,
      payload: axiosError,
    };
    const startState = {
      ...initialState,
      isWorkspaceScheduleSaving: true,
    };
    const newState = scheduleReducer(startState, action);
    expect(newState.isWorkspaceScheduleSaving).toBe(false);
    expect(newState.createWorkspaceScheduleError).toEqual(axiosError);
  });
  test('Action with UPDATE_WORKSPACE_SCHEDULED_JOB_BEGIN type returns correct state', () => {
    const action: ScheduleAction = {
      type: UPDATE_WORKSPACE_SCHEDULED_JOB_BEGIN,
    };
    const newState = scheduleReducer(initialState, action);
    expect(newState.isWorkspaceScheduleSaving).toBe(true);
    expect(newState.updateWorkspaceScheduleError).toBeNull();
  });
  test.each([
    CREATE_WORKSPACE_SCHEDULED_JOB_SUCCESS,
    UPDATE_WORKSPACE_SCHEDULED_JOB_SUCCESS,
  ])('Action with %s type returns correct state', (type) => {
    const action: ScheduleAction = {
      type: type as ActionType,
    };
    const startState = {
      ...initialState,
      isWorkspaceScheduleSaving: true,
    };
    const newState = scheduleReducer(startState, action);
    expect(newState.isWorkspaceScheduleSaving).toBe(false);
  });
  test('Action with UPDATE_WORKSPACE_SCHEDULED_JOB_FAILURE type returns correct state', () => {
    const action: ScheduleAction = {
      type: UPDATE_WORKSPACE_SCHEDULED_JOB_FAILURE,
      payload: axiosError,
    };
    const startState = {
      ...initialState,
      isWorkspaceScheduleSaving: true,
    };
    const newState = scheduleReducer(startState, action);
    expect(newState.isWorkspaceScheduleSaving).toBe(false);
    expect(newState.updateWorkspaceScheduleError).toEqual(axiosError);
  });
  test('Default case returns initial state', () => {
    const action: ScheduleAction = {
      type: null,
    };
    const newState = scheduleReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
});
