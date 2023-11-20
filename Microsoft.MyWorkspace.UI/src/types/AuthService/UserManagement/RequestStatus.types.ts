export enum RequestStatus {
  QueueForOperation = 'QueueForOperation',
  WaitingForAdminConsent = 'WaitingForAdminConsent',
  WaitingForAdminConsentWithClean = 'WaitingForAdminConsentWithClean',
  MoveApproved = 'MoveApproved',
  MoveApprovedWithClean = 'MoveApprovedWithClean',
  Completed = 'Completed',
  Rejected = 'Rejected',
  WaitingForOperationChange = 'WaitingForOperationChange',
}
