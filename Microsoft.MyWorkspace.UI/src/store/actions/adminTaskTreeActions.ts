import { Action, Dispatch } from 'redux';
import { AxiosError } from 'axios';

import {
  FETCH_TASK_TREE_BEGIN,
  FETCH_TASK_TREE_FAILURE,
  FETCH_TASK_TREE_SUCCESS,
} from './actionTypes';
import ErrorAction from './errorAction';
import { httpAuthService } from '../../applicationInsights/httpAuthService';
import { TelemetryGraphNodeDto } from '../../types/Telemetry/TelemetryGraphNodeDto.types';

export interface WorkspaceTelemetryGraphWithID {
  workspaceID: string;
  graph: TelemetryGraphNodeDto;
}

export interface AdminTaskTreeAction extends Action {
  payload?: WorkspaceTelemetryGraphWithID | AxiosError | string;
}

export const fetchTaskTreeBegin = (workspaceID: string) => ({
  type: FETCH_TASK_TREE_BEGIN,
  payload: workspaceID,
});

export const fetchTaskTreeSuccess = (
  workspaceID: string,
  payload: TelemetryGraphNodeDto
) => ({
  type: FETCH_TASK_TREE_SUCCESS,
  payload: {
    workspaceID,
    graph: payload,
  } as WorkspaceTelemetryGraphWithID,
});

export const fetchTaskTreeError = (error: AxiosError) => ({
  type: FETCH_TASK_TREE_FAILURE,
  payload: error,
});

export const fetchTaskTree = (workspaceID: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchTaskTreeBegin(workspaceID));
    try {
      const res = await httpAuthService.get(
        `admindashboard/graph/${workspaceID}`
      );
      dispatch(
        fetchTaskTreeSuccess(workspaceID, res.data as TelemetryGraphNodeDto)
      );
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        dispatch(fetchTaskTreeError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve telemetry tree info :\n${err.response?.data}`,
          true
        );
      }
    }
  };
};
