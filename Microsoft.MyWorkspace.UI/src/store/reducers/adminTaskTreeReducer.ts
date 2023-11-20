import {
  FETCH_TASK_TREE_BEGIN,
  FETCH_TASK_TREE_SUCCESS,
  FETCH_TASK_TREE_FAILURE,
} from '../actions/actionTypes';
import cloneDeep from 'lodash/cloneDeep';
import { TelemetryGraphNodeDto } from '../../types/Telemetry/TelemetryGraphNodeDto.types';
import {
  AdminTaskTreeAction,
  WorkspaceTelemetryGraphWithID,
} from '../actions/adminTaskTreeActions';
import { AxiosError } from 'axios';

export interface ReduxAdminTaskTreeState {
  trees: Record<string, TelemetryGraphNodeDto>;
  fetchingID: string;
  error: AxiosError;
}

export const initialAdminTaskTreeState: ReduxAdminTaskTreeState = {
  trees: {},
  fetchingID: null,
  error: null,
};

export default function taskTreeReducer(
  state: ReduxAdminTaskTreeState = initialAdminTaskTreeState,
  action: AdminTaskTreeAction
): ReduxAdminTaskTreeState {
  switch (action.type) {
    case FETCH_TASK_TREE_BEGIN:
      return {
        ...state,
        fetchingID: action.payload as string,
        error: null,
      };
    case FETCH_TASK_TREE_SUCCESS: {
      const trees = cloneDeep(state.trees);
      const graph = action.payload as WorkspaceTelemetryGraphWithID;
      trees[graph.workspaceID] = graph.graph;
      return {
        ...state,
        trees,
        fetchingID: null,
        error: null,
      };
    }
    case FETCH_TASK_TREE_FAILURE:
      return {
        ...state,
        fetchingID: null,
        error: action.payload as AxiosError,
      };
    default:
      return state;
  }
}
