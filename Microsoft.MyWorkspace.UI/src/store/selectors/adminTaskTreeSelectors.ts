import { createSelector } from 'reselect';
import { TelemetryGraphNodeDto } from '../../types/Telemetry/TelemetryGraphNodeDto.types';
import { ReduxAdminTaskTreeState } from '../reducers/adminTaskTreeReducer';

import { MyWorkspacesStore } from '../reducers/rootReducer';

const taskTreeState = (state: MyWorkspacesStore): ReduxAdminTaskTreeState =>
  state.telemetryTree;

export const getTreeByWorkspaceID = (workspaceID: string) => {
  return createSelector(
    taskTreeState,
    (telemetryTree: ReduxAdminTaskTreeState): TelemetryGraphNodeDto => {
      return telemetryTree.trees[workspaceID];
    }
  );
};

export const getFetchingID = createSelector(
  taskTreeState,
  (taskTree: ReduxAdminTaskTreeState) => {
    return taskTree.fetchingID;
  }
);

export const getTaskTreeError = createSelector(
  taskTreeState,
  (taskTree: ReduxAdminTaskTreeState) => {
    return taskTree.error;
  }
);
