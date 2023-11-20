import { DiagnosticSolutionStatus } from '../enums/DiagnosticStatus';
import { SolutionDto } from './SolutionDto.types';

export interface DiagnosticDto {
  Id: string;
  Name: string;
  CatalogType: string;
  ProblemId: string;
  Timeout?: string;
  Internal: boolean;
  InputValues: null;
  Created?: string;
  Updated?: string;
  ScriptBlobName?: string;
  VirtualMachineRequirements?: string;
  Status?: DiagnosticSolutionStatus;
  Discovery?: string;
  StatusMessage?: string;
  Solution?: SolutionDto;
}
