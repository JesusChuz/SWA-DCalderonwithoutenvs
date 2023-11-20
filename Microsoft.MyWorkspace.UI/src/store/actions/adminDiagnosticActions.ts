import { Action, Dispatch } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
  FETCH_ADMIN_DIAGNOSTIC_BEGIN,
  FETCH_ADMIN_DIAGNOSTIC_SUCCESS,
  FETCH_ADMIN_DIAGNOSTIC_FAILURE,
  FETCH_ADMIN_DIAGNOSTIC_CATEGORY_BEGIN,
  FETCH_ADMIN_DIAGNOSTIC_CATEGORY_SUCCESS,
  FETCH_ADMIN_DIAGNOSTIC_CATEGORY_FAILURE,
  RUN_SELECTED_ADMIN_DIAGNOSTIC_BEGIN,
  RUN_SELECTED_ADMIN_DIAGNOSTIC_SUCCESS,
  RUN_SELECTED_ADMIN_DIAGNOSTIC_FAILURE,
  FETCH_CURRENT_DIAGNOSTIC_BEGIN,
  FETCH_CURRENT_DIAGNOSTIC_SUCCESS,
  FETCH_CURRENT_DIAGNOSTIC_FAILURE,
  RUN_SELECTED_SOLUTION_BEGIN,
  RUN_SELECTED_SOLUTION_SUCCESS,
  RUN_SELECTED_SOLUTION_FAILURE,
} from './actionTypes';
import { showDefaultNotification } from './notificationActions';
import ErrorAction from './errorAction';
import { httpAuthService } from '../../applicationInsights/httpAuthService';
import { CatalogDto } from './../../types/AzureWorkspace/AdminDiagnostics/CatalogDto.types';
import { CategoryDto } from './../../types/AzureWorkspace/AdminDiagnostics/CategoryDto.types';
import { DiagnosticDto } from './../../types/AzureWorkspace/AdminDiagnostics/DiagnosticDto.types';
import { SolutionDto } from './../../types/AzureWorkspace/AdminDiagnostics/SolutionDto.types';

export interface AdminDiagnosticAction extends Action {
  payload?:
    | CatalogDto
    | CategoryDto[]
    | AxiosError
    | DiagnosticDto
    | DiagnosticDto[]
    | SolutionDto;
}

export const fetchAdminDiagnosticBegin = () => ({
  type: FETCH_ADMIN_DIAGNOSTIC_BEGIN,
});

export const fetchAdminDiagnosticSuccess = (payload: CatalogDto) => ({
  type: FETCH_ADMIN_DIAGNOSTIC_SUCCESS,
  payload,
});

export const fetchAdminDiagnosticError = (error: AxiosError | string) => ({
  type: FETCH_ADMIN_DIAGNOSTIC_FAILURE,
  payload: error,
});

export const fetchAdminDiagnosticCatalog = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAdminDiagnosticBegin());
    try {
      const res = await httpAuthService.get('diagnostics/catalog');
      dispatch(fetchAdminDiagnosticSuccess(res.data as CatalogDto));
    } catch (err: any) {
      if (err.response.status !== 401) {
        dispatch(fetchAdminDiagnosticError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve admin diagnostics info :\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const fetchAdminDiagnosticCategoryBegin = () => ({
  type: FETCH_ADMIN_DIAGNOSTIC_CATEGORY_BEGIN,
});

export const fetchAdminDiagnosticCategorySuccess = (
  payload: CategoryDto[]
) => ({
  type: FETCH_ADMIN_DIAGNOSTIC_CATEGORY_SUCCESS,
  payload,
});

export const fetchAdminDiagnosticCategoryError = (
  error: AxiosError | string
) => ({
  type: FETCH_ADMIN_DIAGNOSTIC_CATEGORY_FAILURE,
  payload: error,
});

export const fetchAdminDiagnosticCategory = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAdminDiagnosticCategoryBegin());
    try {
      const res = await httpAuthService.get('diagnostics/catalog/category');
      dispatch(fetchAdminDiagnosticCategorySuccess(res.data as CategoryDto[]));
    } catch (err: any) {
      if (err.response.status !== 401) {
        dispatch(fetchAdminDiagnosticCategoryError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve admin diagnostics category info :\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const runSelectedAdminDiagnosticBegin = () => ({
  type: RUN_SELECTED_ADMIN_DIAGNOSTIC_BEGIN,
});

export const runSelectedAdminDiagnosticSuccess = (payload: DiagnosticDto) => ({
  type: RUN_SELECTED_ADMIN_DIAGNOSTIC_SUCCESS,
  payload,
});

export const runSelectedAdminDiagnosticError = (
  error: AxiosError | string
) => ({
  type: RUN_SELECTED_ADMIN_DIAGNOSTIC_FAILURE,
  payload: error,
});

export const runSelectedAdminDiagnostic = (
  diagnosticId: string,
  workspaceId: string,
  virtualMachineId: string
): ((dispatch: Dispatch) => Promise<void>) => {
  return async (dispatch): Promise<void> => {
    dispatch(runSelectedAdminDiagnosticBegin());
    try {
      dispatch(
        showDefaultNotification(
          'Running the diagnostic. Please refresh the diagnostics list and wait for this diagnostic to complete.'
        )
      );
      const request = {
        DiagnosticId: diagnosticId,
        WorkspaceId: workspaceId,
        VirtualMachineId: virtualMachineId,
      };
      const res = await httpAuthService.post<DiagnosticDto>(
        'diagnostics/',
        request
      );
      dispatch(runSelectedAdminDiagnosticSuccess(res.data));
    } catch (err: any) {
      if (err.response.status !== 401) {
        dispatch(runSelectedAdminDiagnosticError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to run selected admin diagnostics :\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const fetchCurrentDiagnosticBegin = () => ({
  type: FETCH_CURRENT_DIAGNOSTIC_BEGIN,
});

export const fetchCurrentDiagnosticSuccess = (payload: DiagnosticDto[]) => ({
  type: FETCH_CURRENT_DIAGNOSTIC_SUCCESS,
  payload,
});

export const fetchCurrentDiagnosticError = (error: AxiosError | string) => ({
  type: FETCH_CURRENT_DIAGNOSTIC_FAILURE,
  payload: error,
});

export const fetchCurrentDiagnostic = (
  machineId: string
): ((dispatch: Dispatch) => Promise<void>) => {
  return async (dispatch): Promise<void> => {
    dispatch(fetchCurrentDiagnosticBegin());
    try {
      const res = await httpAuthService.get(
        `diagnostics/virtualmachines/${machineId}/diagnostics`
      );
      dispatch(fetchCurrentDiagnosticSuccess(res.data as DiagnosticDto[]));
    } catch (err: any) {
      if (err.response.status !== 401) {
        dispatch(fetchCurrentDiagnosticError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to run selected admin diagnostics :\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const runSelectedSolutionBegin = () => ({
  type: RUN_SELECTED_SOLUTION_BEGIN,
});

export const runSelectedSolutionSuccess = (payload: SolutionDto) => ({
  type: RUN_SELECTED_SOLUTION_SUCCESS,
  payload,
});

export const runSelectedSolutionError = (error: AxiosError | string) => ({
  type: RUN_SELECTED_SOLUTION_FAILURE,
  payload: error,
});

export const runSelectedSolution = (
  diagnosticId: string
): ((dispatch: Dispatch) => Promise<void>) => {
  return async (dispatch): Promise<void> => {
    dispatch(runSelectedSolutionBegin());
    try {
      dispatch(
        showDefaultNotification(
          'Running the solution. Please refresh the diagnostics list and wait for this solution to complete.'
        )
      );
      const res = await httpAuthService.post<SolutionDto>(
        `diagnostics/${diagnosticId}/solution/run`
      );
      dispatch(runSelectedSolutionSuccess(res.data as SolutionDto));
    } catch (err: any) {
      if (err.response.status !== 401) {
        dispatch(runSelectedSolutionError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to run selected diagnostic solution :\n${err.response?.data}`,
          true
        );
      }
    }
  };
};
