import { DataDiskError } from './DataDiskError.types';
import { SubnetNameError } from './SubnetNameError.types';
import { VMNameError } from './VMNameError.types';
import { DomainError } from './DomainError.types';
import { WorkspaceScheduledJobError } from './WorkspaceScheduledJobError.types';

export interface WorkspaceErrors {
  workspaceName: string | null;
  administratorName: string | null;
  administratorPassword: string | null;
  administratorPasswordConfirm: string | null;
  dataDisks: DataDiskError[];
  vmNames: VMNameError[];
  machineAmount: string | null;
  subnetNames: SubnetNameError[];
  domains: DomainError[];
  workspaceScheduledJob: WorkspaceScheduledJobError;
}
