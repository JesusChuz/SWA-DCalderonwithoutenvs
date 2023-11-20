import { createSelector } from 'reselect';
import { CategoryDto } from '../../types/AzureWorkspace/AdminDiagnostics/CategoryDto.types';
import { CatalogDto } from '../../types/AzureWorkspace/AdminDiagnostics/CatalogDto.types';
import { ReduxAdminDiagnosticState } from '../reducers/adminDiagnosticReducer';
import { MyWorkspacesStore } from '../reducers/rootReducer';
import { DiagnosticDto } from '../../types/AzureWorkspace/AdminDiagnostics/DiagnosticDto.types';

const configState = (state: MyWorkspacesStore): ReduxAdminDiagnosticState =>
  state.adminDiagnostic;

export const getAdminDiagnosticCatalog = createSelector(
  configState,
  (adminDiagnostic: ReduxAdminDiagnosticState): CatalogDto => {
    return adminDiagnostic.adminDiagnostic;
  }
);

export const getAdminDiagnosticCategory = createSelector(
  configState,
  (adminDiagnostic: ReduxAdminDiagnosticState): CategoryDto[] => {
    return adminDiagnostic.adminDiagnosticCategory;
  }
);

export const getDiagnosticRunResults = createSelector(
  configState,
  (adminDiagnostic: ReduxAdminDiagnosticState): DiagnosticDto => {
    return adminDiagnostic.runDiagnostics;
  }
);

export const getCurrentDiagnosticCatalog = createSelector(
  configState,
  (adminDiagnostic: ReduxAdminDiagnosticState): DiagnosticDto[] => {
    return adminDiagnostic.currentDiagnostic;
  }
);
