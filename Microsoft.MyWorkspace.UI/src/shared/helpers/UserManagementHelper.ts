import { RequestStatus } from '../../types/AuthService/UserManagement/RequestStatus.types';
import { ResourceType } from '../../types/AuthService/UserManagement/ResourceType.types';
import { ValidationFailure } from '../../types/AuthService/UserManagement/ValidationFailure.types';

export const displayRequestStatus = (requestStatus: RequestStatus): string => {
  switch (requestStatus) {
    case RequestStatus.MoveApproved:
    case RequestStatus.MoveApprovedWithClean:
      return 'Approved';
    case RequestStatus.QueueForOperation:
      return 'Queued';
    case RequestStatus.WaitingForAdminConsent:
    case RequestStatus.WaitingForAdminConsentWithClean:
    case RequestStatus.WaitingForOperationChange:
      return 'Waiting For Approval';
    default:
      return requestStatus;
  }
};

export const requiresApproval = (requestStatus: RequestStatus) => {
  return (
    requestStatus === RequestStatus.WaitingForAdminConsent ||
    requestStatus === RequestStatus.WaitingForAdminConsentWithClean ||
    requestStatus === RequestStatus.WaitingForOperationChange
  );
};

export const requiresClean = (requestStatus: RequestStatus) => {
  return (
    requestStatus === RequestStatus.MoveApprovedWithClean ||
    requestStatus === RequestStatus.WaitingForAdminConsentWithClean
  );
};

export const filterValidationsFailuresWithErrorMessage = (
  validationFailures: ValidationFailure[]
): ValidationFailure[] => {
  return validationFailures
    ? validationFailures.filter((f) => !!f.ErrorMessage)
    : [];
};

export const sortValidationFailures = (
  validationFailures: ValidationFailure[]
): ValidationFailure[] => {
  return validationFailures.sort((a, b) => {
    const deleteResourceType = ResourceType.WorkspaceToDelete;
    if (
      a.ResourceType === deleteResourceType &&
      b.ResourceType !== deleteResourceType
    ) {
      return -1;
    }
    if (
      a.ResourceType !== deleteResourceType &&
      b.ResourceType === deleteResourceType
    ) {
      return 1;
    }
    return 0;
  });
};

export const workspacesToDeleteCount = (
  validationFailures: ValidationFailure[]
): number => {
  if (!validationFailures) {
    return 0;
  }
  const failureSet = new Set<string>();
  validationFailures
    .filter((f) => f.ResourceType === ResourceType.WorkspaceToDelete)
    .forEach((f) => {
      failureSet.add(f.ResourceId);
    });
  return failureSet.size;
};
