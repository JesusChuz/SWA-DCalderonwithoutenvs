import { OperationType } from './OperationType.types';

export interface UserManagementRequestDto {
  NewAssignedSegmentId: string;
  NewAssignedSegmentName: string;
  OperationType: OperationType;
  UserEmail: string;
  Justification: string;
  TenantSegmentAdminRole: boolean;
  TenantSegmentContributorRole: boolean;
}
