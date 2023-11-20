import { DiagnosticDto } from './DiagnosticDto.types';

export interface ProblemDto {
  Id: string;
  Name: string;
  CatalogType: string;
  Internal: boolean;
  ProblemGroupId: string;
  Created: string;
  Diagnostics: DiagnosticDto[];
}
