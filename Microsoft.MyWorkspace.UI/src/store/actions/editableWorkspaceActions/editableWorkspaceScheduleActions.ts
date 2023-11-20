import { EditableWorkspaceDispatch } from '.';
import { WorkspaceScheduledJobDto } from '../../../types/Job/WorkspaceScheduledJobDto.types';
import { MyWorkspacesStore } from '../../reducers/rootReducer';
import { workspaceValidateWorkspaceScheduledJob } from '../../validators/workspaceValidators';
import {
  EDITABLE_WORKSPACE_SET_WORKSPACE_SCHEDULED_JOB,
  EDITABLE_WORKSPACE_UPDATE_WORKSPACE_SCHEDULED_JOB,
} from '../actionTypes';

export const editableWorkspaceSetWorkspaceScheduledJob = (
  workspaceScheduledJob: WorkspaceScheduledJobDto
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const error = workspaceValidateWorkspaceScheduledJob(
      workspaceScheduledJob,
      editableWorkspace.originalWorkspaceScheduledJob
    );
    dispatch({
      type: EDITABLE_WORKSPACE_SET_WORKSPACE_SCHEDULED_JOB,
      payload: workspaceScheduledJob,
      error,
    });
  };
};

export const editableWorkspaceChangeWorkspaceScheduledJobTimeZone = (
  timeZoneID: string
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const workspaceScheduledJob: WorkspaceScheduledJobDto = {
      ...editableWorkspace.editedWorkspaceScheduledJob,
      TimeZone: timeZoneID,
    };
    const error = workspaceValidateWorkspaceScheduledJob(
      workspaceScheduledJob,
      editableWorkspace.originalWorkspaceScheduledJob
    );
    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_WORKSPACE_SCHEDULED_JOB,
      payload: workspaceScheduledJob,
      error,
    });
  };
};

export const editableWorkspaceChangeWorkspaceScheduledJobStartTime = (
  time: string
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const workspaceScheduledJob: WorkspaceScheduledJobDto = {
      ...editableWorkspace.editedWorkspaceScheduledJob,
      AutoStartTimeOfDay: time,
    };
    const error = workspaceValidateWorkspaceScheduledJob(
      workspaceScheduledJob,
      editableWorkspace.originalWorkspaceScheduledJob
    );
    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_WORKSPACE_SCHEDULED_JOB,
      payload: workspaceScheduledJob,
      error,
    });
  };
};

export const editableWorkspaceChangeWorkspaceScheduledJobStopTime = (
  time: string
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const workspaceScheduledJob: WorkspaceScheduledJobDto = {
      ...editableWorkspace.editedWorkspaceScheduledJob,
      AutoStopTimeOfDay: time,
    };
    const error = workspaceValidateWorkspaceScheduledJob(
      workspaceScheduledJob,
      editableWorkspace.originalWorkspaceScheduledJob
    );
    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_WORKSPACE_SCHEDULED_JOB,
      payload: workspaceScheduledJob,
      error,
    });
  };
};

export const editableWorkspaceChangeWorkspaceScheduledJobDaysOfWeek = (
  daysOfWeek: string
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const workspaceScheduledJob: WorkspaceScheduledJobDto = {
      ...editableWorkspace.editedWorkspaceScheduledJob,
      ScheduledDays: daysOfWeek,
    };
    const error = workspaceValidateWorkspaceScheduledJob(
      workspaceScheduledJob,
      editableWorkspace.originalWorkspaceScheduledJob
    );
    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_WORKSPACE_SCHEDULED_JOB,
      payload: workspaceScheduledJob,
      error,
    });
  };
};
