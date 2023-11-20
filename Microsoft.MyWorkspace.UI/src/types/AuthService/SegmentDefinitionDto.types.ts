import { SegmentConstraintDto } from './SegmentConstraintDto.types';
import { DeploymentScopeDto } from './DeploymentScopeDto.types';

export interface SegmentDefinitionDto {
  ID: string;
  Name: string;
  Constraint: SegmentConstraintDto;
  DeploymentScopes: DeploymentScopeDto[];
  Updated?: string;
  UpdateByEmail?: string;
}
