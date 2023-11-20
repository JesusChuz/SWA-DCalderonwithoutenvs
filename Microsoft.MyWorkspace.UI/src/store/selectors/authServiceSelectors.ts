import { isEqual } from 'lodash';
import { createSelector } from 'reselect';

import { ReduxAuthServiceState } from '../reducers/authServiceReducer';
import { MyWorkspacesStore } from '../reducers/rootReducer';
import { validateDomainNames } from '../validators/segmentConstraintValidators';

const authState = (state: MyWorkspacesStore): ReduxAuthServiceState =>
  state.authService;

export const getUserRoleAssignment = createSelector(
  authState,
  (authService: ReduxAuthServiceState) => {
    return authService.userRoleAssignment;
  }
);

export const getIsTenantSegmentAdmin = createSelector(
  (state: MyWorkspacesStore) => state.authService,
  (authService: ReduxAuthServiceState) => {
    return authService.adminSegments.length > 0;
  }
);

export const getTenantSegmentAdminSegments = createSelector(
  (state: MyWorkspacesStore) => state.authService,
  (authService: ReduxAuthServiceState) => {
    return authService.adminSegments;
  }
);

export const getUserRoleAssignmentConstraint = createSelector(
  authState,
  (authService: ReduxAuthServiceState) => {
    return authService.constraint;
  }
);

export const getUserRoleAssignmentSegmentId = createSelector(
  authState,
  (authService: ReduxAuthServiceState) => {
    return authService.segmentId;
  }
);

export const getUserRoleAssignmentSegmentName = createSelector(
  authState,
  (authService: ReduxAuthServiceState) => {
    return authService.segmentName;
  }
);

export const getAdminUserRoleAssignment = createSelector(
  authState,
  (authService: ReduxAuthServiceState) => {
    return authService.adminUserRoleAssignment;
  }
);

export const getAdminUserRoleAssignmentLoading = createSelector(
  authState,
  (authService: ReduxAuthServiceState) => {
    return authService.userRoleAssignmentLoading;
  }
);

export const getSelectedAdminSegment = createSelector(
  authState,
  (authService: ReduxAuthServiceState) => {
    return authService.selectedAdminSegment;
  }
);
export const getSelectedAdminSegmentConstraint = createSelector(
  authState,
  (authService: ReduxAuthServiceState) => {
    return authService.selectedAdminSegment?.Constraint;
  }
);

export const getDirtyRestrictedEndpoints = createSelector(
  authState,
  (authService: ReduxAuthServiceState) => {
    return authService.dirtyRestrictedEndpoints;
  }
);

export const getSegmentRestrictedDomainsErrors = createSelector(
  authState,
  (authService: ReduxAuthServiceState): string[] => {
    return validateDomainNames(authService.dirtyRestrictedEndpoints);
  }
);

export const getSegmentRestrictedDomainsValid = createSelector(
  authState,
  (authService: ReduxAuthServiceState): boolean => {
    const errors = validateDomainNames(authService.dirtyRestrictedEndpoints);
    return errors.every((element) => element === '');
  }
);

export const getSelectedAdminSegmentName = createSelector(
  authState,
  (authService: ReduxAuthServiceState) => {
    return authService.selectedAdminSegment?.Name;
  }
);

export const getSegmentMembers = createSelector(
  authState,
  (authService: ReduxAuthServiceState) => {
    return authService.segmentMembers;
  }
);

export const getSegmentMembersContinuationToken = createSelector(
  authState,
  (authService: ReduxAuthServiceState) => {
    return authService.segmentMembersContinuationToken;
  }
);

export const getSegmentMembersLoading = createSelector(
  authState,
  (authService: ReduxAuthServiceState) => {
    return authService.segmentMembersLoading;
  }
);

export const getAddingSegmentMemberLoading = createSelector(
  authState,
  (authService: ReduxAuthServiceState) => {
    return authService.addingSegmentMember;
  }
);

export const getSegmentMemberUserExistsFilter = createSelector(
  authState,
  (authService: ReduxAuthServiceState) => {
    return authService.segmentMemberUserExistsFilter;
  }
);

export const getSegmentMemberEmailSearchQuery = createSelector(
  authState,
  (authService: ReduxAuthServiceState) => {
    return authService.segmentMemberEmailSearchQuery;
  }
);

export const getSelectedUsers = createSelector(
  authState,
  (authService: ReduxAuthServiceState) => {
    return authService.selectedUsers;
  }
);

export const getSegmentUpdatePercentage = createSelector(
  authState,
  (authService: ReduxAuthServiceState) => {
    return authService.segmentUpdatePercentage;
  }
);

export const getSegmentUpdatePercentageLoading = createSelector(
  authState,
  (authService: ReduxAuthServiceState) => {
    return authService.segmentUpdatePercentageLoading;
  }
);

export const getDeleteUsersLoading = createSelector(
  authState,
  (authService: ReduxAuthServiceState) => {
    return authService.deleteUserLoading;
  }
);

export const getUserManagementRequests = createSelector(
  authState,
  (authService: ReduxAuthServiceState) =>
    authService.userManagementRequestPages.flatMap((r) => r.ResultSet)
);

export const getUserManagementRequestsLoading = createSelector(
  authState,
  (authService: ReduxAuthServiceState) =>
    authService.userManagementRequestsLoading
);

export const getUserManagementRequestsContinuationToken = createSelector(
  authState,
  (authService: ReduxAuthServiceState) => {
    const length = authService.userManagementRequestPages.length;
    if (length === 0) {
      return null;
    }
    return authService.userManagementRequestPages[length - 1].ContinuationToken;
  }
);

export const getSelectedUserManagementRequests = createSelector(
  authState,
  (authService: ReduxAuthServiceState) =>
    authService.selectedUserManagementRequests
);

export const getUpdateUserManagementRequestPending = createSelector(
  authState,
  (authService: ReduxAuthServiceState) =>
    authService.updateUserManagementRequestPending
);

export const getEditableSegmentConstraint = createSelector(
  authState,
  (authService: ReduxAuthServiceState) => authService.editableSegmentConstraint
);

export const getEditableSegmentConstraintChanges = createSelector(
  authState,
  (authService: ReduxAuthServiceState) =>
    !isEqual(
      authService.editableSegmentConstraint,
      authService.selectedAdminSegment?.Constraint
    )
);

export const getAdminConstraintsUpdating = createSelector(
  authState,
  (authService: ReduxAuthServiceState) =>
    authService.adminSegmentConstraintsUpdating
);

export const getTotalPendingUserManagementRequestCount = createSelector(
  authState,
  (authService: ReduxAuthServiceState) =>
    authService.totalPendingUserManagementRequestCount
);

export const getCurrentPendingUserManagementRequestCount = createSelector(
  authState,
  (authService: ReduxAuthServiceState) =>
    authService.segmentPendingUserManagementRequestCount
);
