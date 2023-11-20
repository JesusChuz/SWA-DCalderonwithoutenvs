import { SegmentConstraintDto } from './SegmentConstraintDto.types';

export interface RoleAssignmentDto {
  RoleDefinitionId: string;
  RoleName: string;
  RoleDisplayName: string;
  Description: string;
  Actions: string[];
  Scopes: string[];
  SegmentDefinitionId: string;
  SegmentName: string;
  Constraint: SegmentConstraintDto;
}
