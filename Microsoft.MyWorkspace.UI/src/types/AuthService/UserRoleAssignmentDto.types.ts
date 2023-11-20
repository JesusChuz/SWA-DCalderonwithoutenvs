import { RoleAssignmentDto } from './RoleAssignmentDto.types';

export interface UserRoleAssignmentDto {
  UserId: string;
  UserRoleAssignments: RoleAssignmentDto[];
  Email: string;
}
