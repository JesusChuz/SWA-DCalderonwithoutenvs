import { OperationType } from './OperationType.types';
import { RequestStatus } from './RequestStatus.types';
import { ValidationFailure } from './ValidationFailure.types';

export interface UserManagementRequest {
  Id: string;
  UserObjectId: string;
  UserEmail: string;
  MovingFromSegmentId?: string;
  MovingFromSegmentName?: string;
  NewAssignedSegmentId?: string;
  NewAssignedSegmentName?: string;
  OperationType: OperationType;
  RequestStatus: RequestStatus;
  OperationBatchId: string;
  ValidationFailures: ValidationFailure[];
  RequestedByUserEmail: string;
  RequestedOnDateTime: string;
  LastUpdatedDateTime: string;
  Justification: string;
  TenantSegmentAdminRole: boolean;
  TenantSegmentContributorRole: boolean;
}
