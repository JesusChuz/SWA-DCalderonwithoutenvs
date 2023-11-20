import { ProblemGroupDto } from './ProblemGroupDto.types';

export interface CategoryDto {
  Id: string;
  Name: string;
  CatalogType: string;
  Internal: boolean;
  Created: string;
  ProblemGroups: ProblemGroupDto[];
}
