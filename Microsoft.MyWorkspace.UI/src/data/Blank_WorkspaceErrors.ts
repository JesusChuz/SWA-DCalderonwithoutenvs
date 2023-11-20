import { WorkspaceErrors } from '../types/Forms/WorkspaceErrors.types';
import { Blank_WorkspaceScheduledJobError } from './Blank_WorkspaceScheduledJobError';

export const Blank_WorkspaceErrors: WorkspaceErrors = {
  workspaceName: null,
  administratorName: null,
  administratorPassword: null,
  administratorPasswordConfirm: null,
  dataDisks: [],
  vmNames: [],
  machineAmount: null,
  subnetNames: [],
  domains: [],
  workspaceScheduledJob: Blank_WorkspaceScheduledJobError,
};
