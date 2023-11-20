import { AxiosError } from 'axios';
import { WorkspaceScheduledJobDto } from '../../types/Job/WorkspaceScheduledJobDto.types';
import {
  FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_BEGIN,
  FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_SUCCESS,
  FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_FAILURE,
  UPDATE_WORKSPACE_SCHEDULED_JOB_BEGIN,
  CREATE_WORKSPACE_SCHEDULED_JOB_BEGIN,
  CREATE_WORKSPACE_SCHEDULED_JOB_FAILURE,
  CREATE_WORKSPACE_SCHEDULED_JOB_SUCCESS,
  UPDATE_WORKSPACE_SCHEDULED_JOB_FAILURE,
  UPDATE_WORKSPACE_SCHEDULED_JOB_SUCCESS,
  FETCH_WORKSPACE_SCHEDULED_JOBS_BEGIN,
  FETCH_WORKSPACE_SCHEDULED_JOBS_FAILURE,
  FETCH_WORKSPACE_SCHEDULED_JOBS_SUCCESS,
} from './actionTypes/scheduleActions';
import { MyWorkspacesStore } from '../reducers/rootReducer';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { Blank_WorkspaceScheduledJobDto } from '../../data/Blank_WorkspaceScheduledJobDto';
import { httpAuthService } from '../../applicationInsights/httpAuthService';
import { editableWorkspaceSetWorkspaceScheduledJob } from './editableWorkspaceActions';
import ErrorAction from './errorAction';
import { Action } from './actionTypes';

export interface ScheduleAction extends Action {
  payload?:
    | WorkspaceScheduledJobDto
    | WorkspaceScheduledJobDto[]
    | AxiosError
    | string
    | boolean;
}

export const fetchAdminWorkspaceScheduleJobBegin = (
  payload: boolean
): ScheduleAction => ({
  type: FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_BEGIN,
  payload,
});

export const fetchAdminWorkspaceScheduleJobSuccess = (
  payload: WorkspaceScheduledJobDto
): ScheduleAction => ({
  type: FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_SUCCESS,
  payload,
});

export const fetchAdminWorkspaceScheduleJobError = (
  error: AxiosError | string
): ScheduleAction => ({
  type: FETCH_ADMIN_WORKSPACE_SCHEDULED_JOB_FAILURE,
  payload: error,
});

export const fetchAdminWorkspaceScheduleJob = (workspaceID: string) => {
  return async (
    dispatch: ThunkDispatch<MyWorkspacesStore, undefined, ScheduleAction>,
    getState: () => MyWorkspacesStore
  ): Promise<void> => {
    const doesWorkspaceIDMatchEditableWorkspace =
      getState().editableWorkspace.originalWorkspaceScheduledJob
        ?.WorkspaceID !== workspaceID;
    dispatch(
      fetchAdminWorkspaceScheduleJobBegin(doesWorkspaceIDMatchEditableWorkspace)
    );
    if (doesWorkspaceIDMatchEditableWorkspace) {
      dispatch(editableWorkspaceSetWorkspaceScheduledJob(null));
    }
    try {
      const res = await httpAuthService.get<WorkspaceScheduledJobDto>(
        `schedule/workspace/${workspaceID}`
      );

      // Log success here
      const data: WorkspaceScheduledJobDto = {
        AutoStartTimeOfDay: undefined,
        AutoStopTimeOfDay: undefined,
        ...res.data,
      } ?? {
        ...Blank_WorkspaceScheduledJobDto,
        WorkspaceID: workspaceID,
      };
      dispatch(fetchAdminWorkspaceScheduleJobSuccess(data));
      dispatch(editableWorkspaceSetWorkspaceScheduledJob(data));
    } catch (err) {
      dispatch(fetchAdminWorkspaceScheduleJobError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to get Workspace Schedule:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const fetchWorkspaceScheduleJobsBegin = (
  payload: boolean
): ScheduleAction => ({
  type: FETCH_WORKSPACE_SCHEDULED_JOBS_BEGIN,
  payload,
});

export const fetchWorkspaceScheduleJobsSuccess = (
  payload: WorkspaceScheduledJobDto[]
): ScheduleAction => ({
  type: FETCH_WORKSPACE_SCHEDULED_JOBS_SUCCESS,
  payload,
});

export const fetchWorkspaceScheduleJobsError = (
  error: AxiosError | string
): ScheduleAction => ({
  type: FETCH_WORKSPACE_SCHEDULED_JOBS_FAILURE,
  payload: error,
});

export const fetchWorkspaceScheduleJobs = () => {
  return async (
    dispatch: ThunkDispatch<MyWorkspacesStore, undefined, ScheduleAction>,
    getState: () => MyWorkspacesStore
  ): Promise<void> => {
    const { azureWorkspaces } = getState();
    try {
      const url = new URLSearchParams();
      azureWorkspaces.azureWorkspaces.map((ws) =>
        url.append('workspaceIDs', ws.ID)
      );
      const res = await httpAuthService.get<WorkspaceScheduledJobDto[]>(
        `schedule/workspace/workspaces?${url.toString()}`
      );

      // Log success here
      const data: WorkspaceScheduledJobDto[] = res.data
        ? res.data.map((job) => ({
            AutoStartTimeOfDay: undefined,
            AutoStopTimeOfDay: undefined,
            ...job,
          }))
        : [];
      dispatch(fetchWorkspaceScheduleJobsSuccess(data));
    } catch (err) {
      dispatch(fetchWorkspaceScheduleJobsError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to get Workspace Schedules:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const createWorkspaceScheduleJobBegin = (): ScheduleAction => ({
  type: CREATE_WORKSPACE_SCHEDULED_JOB_BEGIN,
});

export const createWorkspaceScheduleJobSuccess = (): ScheduleAction => ({
  type: CREATE_WORKSPACE_SCHEDULED_JOB_SUCCESS,
});

export const createWorkspaceScheduleJobError = (
  error: AxiosError | string
): ScheduleAction => ({
  type: CREATE_WORKSPACE_SCHEDULED_JOB_FAILURE,
  payload: error,
});

export const createWorkspaceScheduleJob = (
  workspaceSchedule: WorkspaceScheduledJobDto
) => {
  return async (
    dispatch: ThunkDispatch<MyWorkspacesStore, undefined, ScheduleAction>
  ): Promise<boolean> => {
    dispatch(createWorkspaceScheduleJobBegin());
    try {
      await httpAuthService.post<WorkspaceScheduledJobDto>(
        `schedule/workspace`,
        workspaceSchedule
      );

      // Log success here
      dispatch(createWorkspaceScheduleJobSuccess());
      return true;
    } catch (err) {
      dispatch(createWorkspaceScheduleJobError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to create Workspace Schedule:\n${err.response?.data}`,
        true
      );
      return false;
    }
  };
};

export const updateWorkspaceScheduleJobBegin = (): ScheduleAction => ({
  type: UPDATE_WORKSPACE_SCHEDULED_JOB_BEGIN,
});

export const updateWorkspaceScheduleJobSuccess = (): ScheduleAction => ({
  type: UPDATE_WORKSPACE_SCHEDULED_JOB_SUCCESS,
});

export const updateWorkspaceScheduleJobError = (
  error: AxiosError | string
): ScheduleAction => ({
  type: UPDATE_WORKSPACE_SCHEDULED_JOB_FAILURE,
  payload: error,
});

export const updateWorkspaceScheduleJob = (
  workspaceSchedule: WorkspaceScheduledJobDto
) => {
  return async (
    dispatch: ThunkDispatch<MyWorkspacesStore, undefined, ScheduleAction>
  ): Promise<boolean> => {
    dispatch(updateWorkspaceScheduleJobBegin());
    try {
      await httpAuthService.put<WorkspaceScheduledJobDto>(
        `schedule/workspace/${workspaceSchedule.WorkspaceID}`,
        workspaceSchedule
      );

      // Log success here
      dispatch(updateWorkspaceScheduleJobSuccess());
      return true;
    } catch (err) {
      dispatch(updateWorkspaceScheduleJobError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to update Workspace Schedule:\n${err.response?.data}`,
        true
      );
      return false;
    }
  };
};
