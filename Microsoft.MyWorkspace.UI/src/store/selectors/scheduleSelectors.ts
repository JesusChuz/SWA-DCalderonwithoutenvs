import { createSelector } from 'reselect';

import { MyWorkspacesStore } from '../reducers/rootReducer';
import { ReduxScheduleState } from '../reducers/scheduleReducer';

const scheduleState = (state: MyWorkspacesStore): ReduxScheduleState =>
  state.schedule;

export const getWorkspaceScheduledJobs = createSelector(
  scheduleState,
  (scheduleState: ReduxScheduleState) => {
    if (scheduleState) {
      return scheduleState.workspaceSchedules;
    }
    return [];
  }
);

export const getAreWorkspaceScheduledJobsLoading = createSelector(
  scheduleState,
  (scheduleState: ReduxScheduleState) => {
    return scheduleState.areWorkspaceSchedulesLoading;
  }
);

export const getSelectedAdminWorkspaceScheduledJob = createSelector(
  scheduleState,
  (scheduleState: ReduxScheduleState) => {
    if (scheduleState) {
      return scheduleState.selectedAdminWorkspaceSchedule;
    }
    return null;
  }
);

export const getIsAdminScheduledJobsLoading = createSelector(
  scheduleState,
  (scheduleState: ReduxScheduleState) => {
    return scheduleState.isAdminWorkspaceScheduleLoading;
  }
);

export const getIsWorkspaceScheduledJobSaving = createSelector(
  scheduleState,
  (scheduleState: ReduxScheduleState) => {
    return scheduleState.isWorkspaceScheduleSaving;
  }
);

export const getScheduledJobsLoadedFirstTime = createSelector(
  scheduleState,
  (scheduleState: ReduxScheduleState) => {
    return scheduleState.loadedWorkspaceScheduledJobsFirstTime;
  }
);
