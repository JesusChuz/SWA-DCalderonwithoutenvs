import { LightRoleAssignmentDto } from './LightRoleAssignmentDto.types';

export interface LightUserRoleAssignmentDto {
  UserId: string;
  LightRoleAssignments: LightRoleAssignmentDto[];
  Email: string;
  UserExists: boolean;
}
