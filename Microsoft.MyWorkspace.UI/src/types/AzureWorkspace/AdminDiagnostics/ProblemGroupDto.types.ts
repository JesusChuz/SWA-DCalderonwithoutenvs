import { ProblemDto } from './ProblemDto.types';

export interface ProblemGroupDto {
  Id: string;
  Name: string;
  CatalogType: string;
  CategoryId: string;
  Internal: boolean;
  Created: string;
  Problems: ProblemDto[];
}
