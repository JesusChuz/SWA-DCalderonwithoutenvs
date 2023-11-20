import { AxiosError } from 'axios';
import { CatalogDto } from './../../types/AzureWorkspace/AdminDiagnostics/CatalogDto.types';
import {
  FETCH_ADMIN_DIAGNOSTIC_BEGIN,
  FETCH_ADMIN_DIAGNOSTIC_FAILURE,
  FETCH_ADMIN_DIAGNOSTIC_SUCCESS,
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
} from '../actions/actionTypes';
import { AdminDiagnosticAction } from '../actions/adminDiagnosticActions';
import { CategoryDto } from './../../types/AzureWorkspace/AdminDiagnostics/CategoryDto.types';
import { DiagnosticDto } from './../../types/AzureWorkspace/AdminDiagnostics/DiagnosticDto.types';
import { SolutionDto } from './../../types/AzureWorkspace/AdminDiagnostics/SolutionDto.types';

export interface ReduxAdminDiagnosticState {
  adminDiagnostic: CatalogDto;
  adminDiagnosticLoading: boolean;
  getAdminDiagnosticError: AxiosError;
  adminDiagnosticCategory: CategoryDto[];
  adminDiagnosticCategoryLoading: boolean;
  getAdminDiagnosticCategoryError: AxiosError;
  runDiagnostics: DiagnosticDto;
  runDiagnosticsLoading: boolean;
  runDiagnosticsError: AxiosError;
  currentDiagnostic: DiagnosticDto[];
  currentDiagnosticLoading: boolean;
  getCurrentDiagnosticError: AxiosError;
  runSolution: SolutionDto;
  runSolutionLoading: boolean;
  runSolutionError: AxiosError;
}

export const adminDiagnosticInitialState: ReduxAdminDiagnosticState = {
  adminDiagnostic: {
    Categories: [],
  },
  adminDiagnosticLoading: false,
  getAdminDiagnosticError: null,
  adminDiagnosticCategory: [
    {
      Id: '',
      Name: '',
      CatalogType: '',
      Internal: false,
      Created: '',
      ProblemGroups: [],
    },
  ],
  adminDiagnosticCategoryLoading: false,
  getAdminDiagnosticCategoryError: null,
  runDiagnostics: null,
  runDiagnosticsLoading: false,
  runDiagnosticsError: null,
  currentDiagnostic: [],
  currentDiagnosticLoading: false,
  getCurrentDiagnosticError: null,
  runSolution: null,
  runSolutionLoading: false,
  runSolutionError: null,
};

export default function adminDiagnosticReducer(
  state: ReduxAdminDiagnosticState = adminDiagnosticInitialState,
  action: AdminDiagnosticAction
): ReduxAdminDiagnosticState {
  switch (action.type) {
    case FETCH_ADMIN_DIAGNOSTIC_BEGIN:
      return {
        ...state,
        adminDiagnosticLoading: true,
        getAdminDiagnosticError: null,
      };
    case FETCH_ADMIN_DIAGNOSTIC_SUCCESS: {
      return {
        ...state,
        adminDiagnostic: action.payload as CatalogDto,
        adminDiagnosticLoading: false,
      };
    }
    case FETCH_ADMIN_DIAGNOSTIC_FAILURE:
      return {
        ...state,
        adminDiagnosticLoading: false,
        getAdminDiagnosticError: action.payload as AxiosError,
      };
    case FETCH_ADMIN_DIAGNOSTIC_CATEGORY_BEGIN:
      return {
        ...state,
        adminDiagnosticCategoryLoading: true,
        getAdminDiagnosticCategoryError: null,
      };
    case FETCH_ADMIN_DIAGNOSTIC_CATEGORY_SUCCESS: {
      return {
        ...state,
        adminDiagnosticCategory: action.payload as CategoryDto[],
        adminDiagnosticCategoryLoading: false,
      };
    }
    case FETCH_ADMIN_DIAGNOSTIC_CATEGORY_FAILURE:
      return {
        ...state,
        adminDiagnosticCategoryLoading: false,
        getAdminDiagnosticCategoryError: action.payload as AxiosError,
      };
    case RUN_SELECTED_ADMIN_DIAGNOSTIC_BEGIN:
      return {
        ...state,
        runDiagnosticsLoading: true,
        runDiagnosticsError: null,
      };
    case RUN_SELECTED_ADMIN_DIAGNOSTIC_SUCCESS: {
      const payload = action.payload as DiagnosticDto;
      return {
        ...state,
        runDiagnostics: payload ?? null,
        runDiagnosticsLoading: false,
      };
    }
    case RUN_SELECTED_ADMIN_DIAGNOSTIC_FAILURE:
      return {
        ...state,
        runDiagnosticsLoading: false,
        runDiagnosticsError: action.payload as AxiosError,
      };
    case FETCH_CURRENT_DIAGNOSTIC_BEGIN:
      return {
        ...state,
        currentDiagnosticLoading: true,
        getCurrentDiagnosticError: null,
      };
    case FETCH_CURRENT_DIAGNOSTIC_SUCCESS: {
      return {
        ...state,
        currentDiagnostic: action.payload as DiagnosticDto[],
        currentDiagnosticLoading: false,
      };
    }
    case FETCH_CURRENT_DIAGNOSTIC_FAILURE:
      return {
        ...state,
        currentDiagnosticLoading: false,
        getCurrentDiagnosticError: action.payload as AxiosError,
      };
    case RUN_SELECTED_SOLUTION_BEGIN:
      return {
        ...state,
        runSolutionLoading: true,
        runSolutionError: null,
      };
    case RUN_SELECTED_SOLUTION_SUCCESS: {
      const payload = action.payload as SolutionDto;
      return {
        ...state,
        runSolution: payload ?? null,
        runSolutionLoading: false,
      };
    }
    case RUN_SELECTED_SOLUTION_FAILURE:
      return {
        ...state,
        runSolutionLoading: false,
        runSolutionError: action.payload as AxiosError,
      };
    default:
      return state;
  }
}
