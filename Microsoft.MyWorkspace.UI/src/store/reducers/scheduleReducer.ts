import {
  FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_BEGIN,
  FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_SUCCESS,
  CREATE_WORKSPACE_SCHEDULED_JOB_BEGIN,
  CREATE_WORKSPACE_SCHEDULED_JOB_FAILURE,
  CREATE_WORKSPACE_SCHEDULED_JOB_SUCCESS,
  FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_FAILURE,
  UPDATE_WORKSPACE_SCHEDULED_JOB_BEGIN,
  UPDATE_WORKSPACE_SCHEDULED_JOB_FAILURE,
  UPDATE_WORKSPACE_SCHEDULED_JOB_SUCCESS,
  FETCH_WORKSPACE_SCHEDULED_JOBS_BEGIN,
  FETCH_WORKSPACE_SCHEDULED_JOBS_FAILURE,
  FETCH_WORKSPACE_SCHEDULED_JOBS_SUCCESS,
} from '../actions/actionTypes';
import { AxiosError } from 'axios';
import { WorkspaceScheduledJobDto } from '../../types/Job/WorkspaceScheduledJobDto.types';
import { ScheduleAction } from '../actions';

export interface ReduxScheduleState {
  workspaceSchedules: WorkspaceScheduledJobDto[];
  selectedAdminWorkspaceSchedule: WorkspaceScheduledJobDto;
  areWorkspaceSchedulesLoading: boolean;
  isAdminWorkspaceScheduleLoading: boolean;
  fetchWorkspaceSchedulesError: AxiosError;
  fetchAdminWorkspaceScheduleError: AxiosError;
  isWorkspaceScheduleSaving: boolean;
  createWorkspaceScheduleError: AxiosError;
  updateWorkspaceScheduleError: AxiosError;
  loadedWorkspaceScheduledJobsFirstTime: boolean;
}

export const scheduleInitialState: ReduxScheduleState = {
  workspaceSchedules: [],
  selectedAdminWorkspaceSchedule: null,
  areWorkspaceSchedulesLoading: false,
  isAdminWorkspaceScheduleLoading: false,
  fetchWorkspaceSchedulesError: null,
  fetchAdminWorkspaceScheduleError: null,
  isWorkspaceScheduleSaving: false,
  createWorkspaceScheduleError: null,
  updateWorkspaceScheduleError: null,
  loadedWorkspaceScheduledJobsFirstTime: false,
};

export default function scheduleReducer(
  state: ReduxScheduleState = scheduleInitialState,
  action: ScheduleAction
): ReduxScheduleState {
  switch (action.type) {
    case FETCH_WORKSPACE_SCHEDULED_JOBS_BEGIN:
      return {
        ...state,
        areWorkspaceSchedulesLoading: true,
        workspaceSchedules: [],
        fetchWorkspaceSchedulesError: null,
      };
    case FETCH_WORKSPACE_SCHEDULED_JOBS_SUCCESS:
      return {
        ...state,
        workspaceSchedules: action.payload as WorkspaceScheduledJobDto[],
        areWorkspaceSchedulesLoading: false,
        loadedWorkspaceScheduledJobsFirstTime: true,
      };
    case FETCH_WORKSPACE_SCHEDULED_JOBS_FAILURE:
      return {
        ...state,
        fetchWorkspaceSchedulesError: action.payload as AxiosError,
        areWorkspaceSchedulesLoading: false,
        loadedWorkspaceScheduledJobsFirstTime: true,
      };
    case FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_BEGIN:
      return {
        ...state,
        isAdminWorkspaceScheduleLoading: true,
        selectedAdminWorkspaceSchedule: null,
      };
    case FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_SUCCESS:
      return {
        ...state,
        selectedAdminWorkspaceSchedule:
          action.payload as WorkspaceScheduledJobDto,
        isAdminWorkspaceScheduleLoading: false,
      };
    case FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_FAILURE:
      return {
        ...state,
        fetchAdminWorkspaceScheduleError: action.payload as AxiosError,
        isAdminWorkspaceScheduleLoading: false,
      };
    case CREATE_WORKSPACE_SCHEDULED_JOB_BEGIN:
      return {
        ...state,
        isWorkspaceScheduleSaving: true,
        createWorkspaceScheduleError: null,
      };
    case CREATE_WORKSPACE_SCHEDULED_JOB_SUCCESS:
      return {
        ...state,
        isWorkspaceScheduleSaving: false,
      };
    case CREATE_WORKSPACE_SCHEDULED_JOB_FAILURE:
      return {
        ...state,
        isWorkspaceScheduleSaving: false,
        createWorkspaceScheduleError: action.payload as AxiosError,
      };
    case UPDATE_WORKSPACE_SCHEDULED_JOB_BEGIN:
      return {
        ...state,
        isWorkspaceScheduleSaving: true,
        updateWorkspaceScheduleError: null,
      };
    case UPDATE_WORKSPACE_SCHEDULED_JOB_SUCCESS:
      return {
        ...state,
        isWorkspaceScheduleSaving: false,
      };
    case UPDATE_WORKSPACE_SCHEDULED_JOB_FAILURE:
      return {
        ...state,
        isWorkspaceScheduleSaving: false,
        updateWorkspaceScheduleError: action.payload as AxiosError,
      };
    default:
      return state;
  }
}
