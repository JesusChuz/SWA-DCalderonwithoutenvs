export interface DeleteUserRequest {
  UserEmail: string;
  Justification: string;
  UserObjectId: string;
  TenantSegmentAdminRole: boolean;
  TenantSegmentContributorRole: boolean;
}
