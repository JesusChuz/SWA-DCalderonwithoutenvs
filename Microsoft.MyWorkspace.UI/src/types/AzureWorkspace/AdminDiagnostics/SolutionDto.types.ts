import { DiagnosticSolutionStatus } from '../enums/DiagnosticStatus';

export interface SolutionDto {
  Id: string;
  Name: string;
  InputValues?: string;
  OutputValues?: string;
  Timeout: string;
  Status?: DiagnosticSolutionStatus;
  StatusMessage?: string;
}
