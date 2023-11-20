import { TENANT_SEGMENT_CONTRIBUTOR_ROLE_NAME } from '../../shared/Constants';
import { RoleAssignmentDto } from '../../types/AuthService/RoleAssignmentDto.types';
import {
  getTestSegmentConstraintDto,
  SegmentConstraintDtoTestData,
} from './SegmentConstraintDtoTestData';

export const RoleAssignmentDtoTestData: RoleAssignmentDto = {
  RoleDefinitionId: '',
  RoleName: TENANT_SEGMENT_CONTRIBUTOR_ROLE_NAME,
  RoleDisplayName: '',
  Description: '',
  Actions: [],
  Scopes: [],
  SegmentDefinitionId: '',
  SegmentName: '',
  Constraint: SegmentConstraintDtoTestData,
};

export const getTestRoleAssignmentDto = (
  properties: Partial<RoleAssignmentDto> = {},
  constraintValues = 0
): RoleAssignmentDto => {
  return {
    ...RoleAssignmentDtoTestData,
    Constraint: getTestSegmentConstraintDto({}, constraintValues),
    ...properties,
  };
};
