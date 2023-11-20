import { AxiosError } from 'axios';
import cloneDeep from 'lodash/cloneDeep';

import {
  FETCH_USER_ROLE_ASSIGNMENT_BEGIN,
  FETCH_USER_ROLE_ASSIGNMENT_SUCCESS,
  FETCH_USER_ROLE_ASSIGNMENT_FAILURE,
  FETCH_ADMIN_USER_ROLE_ASSIGNMENT_BEGIN,
  FETCH_ADMIN_USER_ROLE_ASSIGNMENT_FAILURE,
  FETCH_ADMIN_USER_ROLE_ASSIGNMENT_SUCCESS,
  CLEAR_ADMIN_USER_ROLE_SEARCH,
  SET_SELECTED_ADMIN_SEGMENT,
  FETCH_ADMIN_SEGMENTS_BEGIN,
  FETCH_ADMIN_SEGMENTS_FAILURE,
  FETCH_ADMIN_SEGMENTS_SUCCESS,
  FETCH_SEGMENT_MEMBERS_FAILURE,
  FETCH_SEGMENT_MEMBERS_BEGIN,
  FETCH_SEGMENT_MEMBERS_SUCCESS,
  APPEND_SEGMENT_MEMBERS_BEGIN,
  APPEND_SEGMENT_MEMBERS_FAILURE,
  APPEND_SEGMENT_MEMBERS_SUCCESS,
  ADD_SEGMENT_MEMBER_BEGIN,
  ADD_SEGMENT_MEMBER_FAILURE,
  ADD_SEGMENT_MEMBER_SUCCESS,
  SET_TENANT_SEGMENT_ADMIN_EMAIL_QUERY,
  BULK_DELETE_AZURE_WORKSPACES_BEGIN,
  BULK_DELETE_AZURE_WORKSPACES_SUCCESS,
  BULK_DELETE_AZURE_WORKSPACES_FAILURE,
  FETCH_SEGMENT_UPDATE_PERCENTAGE_SUCCESS,
  FETCH_SEGMENT_UPDATE_PERCENTAGE_FAILURE,
  FETCH_SEGMENT_UPDATE_PERCENTAGE_BEGIN,
  PATCH_SEGMENT_RESTRICTED_DNS_ADDRESSES_BEGIN,
  PATCH_SEGMENT_RESTRICTED_DNS_ADDRESSES_FAILURE,
  PATCH_SEGMENT_RESTRICTED_DNS_ADDRESSES_SUCCESS,
  UPDATE_RESTRICTED_ENDPOINTS,
  UPDATE_DIRTY_RESTRICTED_ENDPOINTS,
  SET_SELECTED_USERS,
  DELETE_USERS_SUCCESS,
  DELETE_USERS_FAILURE,
  DELETE_USERS_BEGIN,
  SET_SELECTED_USER_MANAGEMENT_REQUESTS,
  UPDATE_USER_MANAGEMENT_REQUESTS_BEGIN,
  UPDATE_USER_MANAGEMENT_REQUESTS_FAILURE,
  UPDATE_USER_MANAGEMENT_REQUESTS_SUCCESS,
  APPEND_USER_MANAGEMENT_REQUESTS_BEGIN,
  APPEND_USER_MANAGEMENT_REQUESTS_FAILURE,
  APPEND_USER_MANAGEMENT_REQUESTS_SUCCESS,
  FETCH_INITIAL_USER_MANAGEMENT_REQUESTS_BEGIN,
  FETCH_INITIAL_USER_MANAGEMENT_REQUESTS_FAILURE,
  FETCH_INITIAL_USER_MANAGEMENT_REQUESTS_SUCCESS,
  FETCH_USER_MANAGEMENT_REQUEST_UPDATES_BEGIN,
  FETCH_USER_MANAGEMENT_REQUEST_UPDATES_FAILURE,
  FETCH_USER_MANAGEMENT_REQUEST_UPDATES_SUCCESS,
  UPDATE_EDITABLE_SEGMENT_CONSTRAINT,
  CANCEL_EDITABLE_SEGMENT_CONSTRAINT_CHANGES,
  UPDATE_SEGMENT_CONSTRAINT_BEGIN,
  UPDATE_SEGMENT_CONSTRAINT_SUCCESS,
  UPDATE_SEGMENT_CONSTRAINT_FAILURE,
  SET_TENANT_SEGMENT_USER_EXISTS_QUERY,
  FETCH_ALL_PENDING_USER_MANAGEMENT_REQUEST_COUNT_BEGIN,
  FETCH_ALL_PENDING_USER_MANAGEMENT_REQUEST_COUNT_FAILURE,
  FETCH_ALL_PENDING_USER_MANAGEMENT_REQUEST_COUNT_SUCCESS,
  FETCH_SEGMENT_PENDING_USER_MANAGEMENT_REQUEST_COUNT_BEGIN,
  FETCH_SEGMENT_PENDING_USER_MANAGEMENT_REQUEST_COUNT_FAILURE,
  FETCH_SEGMENT_PENDING_USER_MANAGEMENT_REQUEST_COUNT_SUCCESS,
} from '../actions/actionTypes';
import { UserRoleAssignmentDto } from '../../types/AuthService/UserRoleAssignmentDto.types';
import { SegmentDefinitionDto } from '../../types/AuthService/SegmentDefinitionDto.types';
import { AuthServiceAction } from '../actions/authServiceActions';
import { SegmentConstraintDto } from '../../types/AuthService/SegmentConstraintDto.types';
import { DEFAULT_SEGMENT_CONSTRAINTS } from '../../shared/DefaultSegmentConstraints';
import { RoleAssignmentDto } from '../../types/AuthService/RoleAssignmentDto.types';
import { PageResult } from '../../types/PageResult.types';
import { TENANT_SEGMENT_CONTRIBUTOR_ROLE_NAME } from '../../shared/Constants';
import { SegmentUpdatePayload } from '../../types/Forms/SegmentUpdatePayload';
import { LightUserRoleAssignmentDto } from '../../types/AuthService/LightUserRoleAssignmentDto.types';
import { UserManagementRequest } from '../../types/AuthService/UserManagement/UserManagementRequest.types';

export interface ReduxAuthServiceState {
  userRoleAssignment: UserRoleAssignmentDto;
  userRoleAssignmentLoading: boolean;
  userRoleAssignmentError: AxiosError;
  adminUserRoleAssignment: UserRoleAssignmentDto;
  adminUserRoleAssignmentLoading: boolean;
  adminUserRoleAssignmentError: AxiosError;
  constraint: SegmentConstraintDto;
  segmentId: string;
  segmentName: string;
  adminSegments: SegmentDefinitionDto[];
  adminSegmentsLoading: boolean;
  adminSegmentsError: AxiosError;
  selectedAdminSegment: SegmentDefinitionDto;
  editableSegmentConstraint: SegmentConstraintDto;
  adminSegmentConstraintsUpdating: boolean;
  dirtyRestrictedEndpoints: string[];
  segmentMembers: LightUserRoleAssignmentDto[];
  segmentMembersContinuationToken: string;
  segmentMembersLoading: boolean;
  segmentMembersError: AxiosError;
  addingSegmentMember: boolean;
  addingSegmentMemberError: AxiosError;
  segmentMemberUserExistsFilter: boolean;
  segmentMemberEmailSearchQuery: string;
  selectedUsers: LightUserRoleAssignmentDto[];
  selectedUserManagementRequests: UserManagementRequest[];
  bulkDeleteWorkspacesError: AxiosError;
  isBulkDeleteWorkspacesPending: boolean;
  segmentUpdatePercentage: Map<string, number>;
  segmentUpdatePercentageLoading: Map<string, boolean>;
  segmentUpdatePercentageError: Map<string, AxiosError>;
  updateRestrictedDNSEndpointsLoading: boolean;
  updateRestrictedDNSEndpointsError: AxiosError;
  deleteUserLoading: boolean;
  deleteUserError: AxiosError;
  userManagementRequestPages: PageResult<UserManagementRequest>[];
  userManagementRequestsLoading: boolean;
  userManagementRequestsFetchingUpdates: boolean;
  userManagementRequestsError: AxiosError;
  updateUserManagementRequestPending: boolean;
  totalPendingUserManagementRequestCount: number;
  segmentPendingUserManagementRequestCount: number;
}

export const authServiceInitialState: ReduxAuthServiceState = {
  userRoleAssignment: null,
  userRoleAssignmentLoading: false,
  userRoleAssignmentError: null,
  adminUserRoleAssignment: null,
  adminUserRoleAssignmentLoading: false,
  adminUserRoleAssignmentError: null,
  constraint: DEFAULT_SEGMENT_CONSTRAINTS,
  segmentId: '',
  segmentName: '',
  adminSegments: [],
  adminSegmentsLoading: false,
  adminSegmentsError: null,
  selectedAdminSegment: null,
  editableSegmentConstraint: DEFAULT_SEGMENT_CONSTRAINTS,
  adminSegmentConstraintsUpdating: false,
  dirtyRestrictedEndpoints: [],
  segmentMembers: [],
  segmentMembersContinuationToken: null,
  segmentMembersLoading: false,
  segmentMembersError: null,
  addingSegmentMember: false,
  addingSegmentMemberError: null,
  segmentMemberUserExistsFilter: null,
  segmentMemberEmailSearchQuery: null,
  selectedUsers: [],
  selectedUserManagementRequests: [],
  bulkDeleteWorkspacesError: null,
  isBulkDeleteWorkspacesPending: false,
  segmentUpdatePercentage: new Map<string, number>(),
  segmentUpdatePercentageLoading: new Map<string, boolean>(),
  segmentUpdatePercentageError: new Map<string, AxiosError>(),
  updateRestrictedDNSEndpointsLoading: false,
  updateRestrictedDNSEndpointsError: null,
  deleteUserLoading: false,
  deleteUserError: null,
  userManagementRequestPages: [],
  userManagementRequestsLoading: false,
  userManagementRequestsFetchingUpdates: false,
  userManagementRequestsError: null,
  updateUserManagementRequestPending: false,
  totalPendingUserManagementRequestCount: 0,
  segmentPendingUserManagementRequestCount: 0,
};

export default function authServiceReducer(
  state: ReduxAuthServiceState = authServiceInitialState,
  action: AuthServiceAction
): ReduxAuthServiceState {
  switch (action.type) {
    case FETCH_USER_ROLE_ASSIGNMENT_BEGIN:
      return {
        ...state,
        userRoleAssignmentLoading: true,
      };
    case FETCH_USER_ROLE_ASSIGNMENT_FAILURE:
      return {
        ...state,
        userRoleAssignmentLoading: false,
        userRoleAssignmentError: action.payload as AxiosError,
      };
    case FETCH_USER_ROLE_ASSIGNMENT_SUCCESS: {
      const role: RoleAssignmentDto = (
        action.payload as UserRoleAssignmentDto
      ).UserRoleAssignments.find(
        (role) =>
          role.Constraint &&
          role.RoleName === TENANT_SEGMENT_CONTRIBUTOR_ROLE_NAME
      );
      return {
        ...state,
        userRoleAssignment: action.payload as UserRoleAssignmentDto,
        constraint: role?.Constraint,
        segmentId: role?.SegmentDefinitionId,
        segmentName: role?.SegmentName,
        userRoleAssignmentLoading: false,
      };
    }
    case FETCH_ADMIN_USER_ROLE_ASSIGNMENT_BEGIN:
      return {
        ...state,
        adminUserRoleAssignment: null,
        adminUserRoleAssignmentLoading: true,
      };
    case FETCH_ADMIN_USER_ROLE_ASSIGNMENT_FAILURE:
      return {
        ...state,
        adminUserRoleAssignmentLoading: false,
        adminUserRoleAssignmentError: action.payload as AxiosError,
      };
    case FETCH_ADMIN_USER_ROLE_ASSIGNMENT_SUCCESS: {
      return {
        ...state,
        adminUserRoleAssignment: action.payload as UserRoleAssignmentDto,
        adminUserRoleAssignmentLoading: false,
      };
    }
    case FETCH_ADMIN_SEGMENTS_BEGIN:
      return {
        ...state,
        adminSegmentsLoading: true,
      };
    case FETCH_ADMIN_SEGMENTS_FAILURE:
      return {
        ...state,
        adminSegmentsLoading: false,
        adminSegmentsError: action.payload as AxiosError,
      };
    case FETCH_ADMIN_SEGMENTS_SUCCESS: {
      return {
        ...state,
        adminSegments: action.payload as SegmentDefinitionDto[],
        adminSegmentsLoading: false,
      };
    }
    case FETCH_SEGMENT_MEMBERS_BEGIN:
      return {
        ...state,
        segmentMembers: [],
        segmentMembersContinuationToken: null,
        segmentMembersLoading: true,
      };
    case FETCH_SEGMENT_MEMBERS_FAILURE:
      return {
        ...state,
        segmentMembersLoading: false,
        segmentMembersError: action.payload as AxiosError,
      };
    case FETCH_SEGMENT_MEMBERS_SUCCESS: {
      const payload = action.payload as PageResult<LightUserRoleAssignmentDto>;
      return {
        ...state,
        segmentMembers: payload.ResultSet ?? [],
        segmentMembersContinuationToken: payload.ContinuationToken ?? null,
        segmentMembersLoading: false,
      };
    }
    case APPEND_SEGMENT_MEMBERS_BEGIN:
      return {
        ...state,
        segmentMembersLoading: true,
      };
    case APPEND_SEGMENT_MEMBERS_FAILURE:
      return {
        ...state,
        segmentMembersLoading: false,
        segmentMembersError: action.payload as AxiosError,
      };
    case APPEND_SEGMENT_MEMBERS_SUCCESS: {
      const payload = action.payload as PageResult<LightUserRoleAssignmentDto>;
      const newResultSet = payload.ResultSet ?? [];
      return {
        ...state,
        segmentMembers: [...state.segmentMembers, ...newResultSet],
        segmentMembersContinuationToken: payload.ContinuationToken ?? null,
        segmentMembersLoading: false,
      };
    }
    case CLEAR_ADMIN_USER_ROLE_SEARCH:
      return {
        ...state,
        adminUserRoleAssignment: null,
        adminUserRoleAssignmentLoading: false,
        adminUserRoleAssignmentError: null,
      };
    case SET_SELECTED_ADMIN_SEGMENT: {
      const segmentDefinition = action.payload as SegmentDefinitionDto;
      return {
        ...state,
        selectedAdminSegment: segmentDefinition,
        editableSegmentConstraint: { ...segmentDefinition.Constraint },
      };
    }
    case ADD_SEGMENT_MEMBER_BEGIN:
      return {
        ...state,
        addingSegmentMember: true,
      };
    case ADD_SEGMENT_MEMBER_FAILURE:
      return {
        ...state,
        addingSegmentMember: false,
        addingSegmentMemberError: action.payload as AxiosError,
      };
    case ADD_SEGMENT_MEMBER_SUCCESS: {
      return {
        ...state,
        addingSegmentMember: false,
        addingSegmentMemberError: null,
      };
    }
    case SET_TENANT_SEGMENT_USER_EXISTS_QUERY: {
      return {
        ...state,
        segmentMemberUserExistsFilter: action.payload as boolean,
      };
    }
    case SET_TENANT_SEGMENT_ADMIN_EMAIL_QUERY: {
      return {
        ...state,
        segmentMemberEmailSearchQuery: action.payload as string,
      };
    }
    case SET_SELECTED_USERS: {
      return {
        ...state,
        selectedUsers: action.payload as LightUserRoleAssignmentDto[],
      };
    }
    case SET_SELECTED_USER_MANAGEMENT_REQUESTS: {
      return {
        ...state,
        selectedUserManagementRequests:
          action.payload as UserManagementRequest[],
      };
    }
    case BULK_DELETE_AZURE_WORKSPACES_BEGIN: {
      return {
        ...state,
        isBulkDeleteWorkspacesPending: true,
        bulkDeleteWorkspacesError: null,
      };
    }
    case BULK_DELETE_AZURE_WORKSPACES_SUCCESS: {
      return {
        ...state,
        isBulkDeleteWorkspacesPending: false,
      };
    }
    case BULK_DELETE_AZURE_WORKSPACES_FAILURE: {
      return {
        ...state,
        isBulkDeleteWorkspacesPending: false,
        bulkDeleteWorkspacesError: action.payload as AxiosError,
      };
    }
    case FETCH_SEGMENT_UPDATE_PERCENTAGE_BEGIN: {
      const p = action.payload as string;
      const loading = cloneDeep(state.segmentUpdatePercentageLoading);
      const errors = cloneDeep(state.segmentUpdatePercentageError);
      errors.set(p, null);
      loading.set(p, true);
      return {
        ...state,
        segmentUpdatePercentageLoading: loading,
        segmentUpdatePercentageError: errors,
      };
    }
    case FETCH_SEGMENT_UPDATE_PERCENTAGE_SUCCESS: {
      const p = action.payload as SegmentUpdatePayload;
      const percentages = cloneDeep(state.segmentUpdatePercentage);
      const loading = cloneDeep(state.segmentUpdatePercentageLoading);
      const errors = cloneDeep(state.segmentUpdatePercentageError);
      percentages.set(p.segmentId, p.percent);
      loading.set(p.segmentId, false);
      errors.set(p.segmentId, null);
      return {
        ...state,
        segmentUpdatePercentage: percentages,
        segmentUpdatePercentageLoading: loading,
        segmentUpdatePercentageError: errors,
      };
    }
    case FETCH_SEGMENT_UPDATE_PERCENTAGE_FAILURE: {
      const p = action.payload as SegmentUpdatePayload;
      const percentages = cloneDeep(state.segmentUpdatePercentage);
      const loading = cloneDeep(state.segmentUpdatePercentageLoading);
      const errors = cloneDeep(state.segmentUpdatePercentageError);
      percentages.set(p.segmentId, p.percent);
      loading.set(p.segmentId, false);
      errors.set(p.segmentId, p.error);
      return {
        ...state,
        segmentUpdatePercentage: percentages,
        segmentUpdatePercentageLoading: loading,
        segmentUpdatePercentageError: errors,
      };
    }
    case PATCH_SEGMENT_RESTRICTED_DNS_ADDRESSES_BEGIN: {
      return {
        ...state,
        updateRestrictedDNSEndpointsError: null,
        updateRestrictedDNSEndpointsLoading: true,
      };
    }
    case PATCH_SEGMENT_RESTRICTED_DNS_ADDRESSES_FAILURE: {
      return {
        ...state,
        updateRestrictedDNSEndpointsError: action.payload as AxiosError,
        updateRestrictedDNSEndpointsLoading: false,
      };
    }
    case PATCH_SEGMENT_RESTRICTED_DNS_ADDRESSES_SUCCESS: {
      return {
        ...state,
        updateRestrictedDNSEndpointsError: null,
        updateRestrictedDNSEndpointsLoading: false,
      };
    }
    case UPDATE_RESTRICTED_ENDPOINTS: {
      const indexOfSegment = state.adminSegments
        .map(function (segment) {
          return segment.ID;
        })
        .indexOf(state.selectedAdminSegment.ID);
      const newSegment = {
        ...state.selectedAdminSegment,
        Constraint: {
          ...state.selectedAdminSegment.Constraint,
          RestrictedDnsEndpoints: action.payload as string[],
        },
      };
      return {
        ...state,
        selectedAdminSegment: newSegment,
        adminSegments: [
          ...state.adminSegments.slice(0, indexOfSegment),
          newSegment,
          ...state.adminSegments.slice(indexOfSegment + 1),
        ],
      };
    }
    case UPDATE_DIRTY_RESTRICTED_ENDPOINTS: {
      return {
        ...state,
        dirtyRestrictedEndpoints: action.payload as string[],
      };
    }
    case DELETE_USERS_BEGIN:
      return {
        ...state,
        deleteUserLoading: true,
        deleteUserError: null,
      };
    case DELETE_USERS_SUCCESS:
      return {
        ...state,
        deleteUserLoading: false,
      };
    case DELETE_USERS_FAILURE:
      return {
        ...state,
        deleteUserLoading: false,
        deleteUserError: action.payload as AxiosError,
      };
    case FETCH_INITIAL_USER_MANAGEMENT_REQUESTS_BEGIN:
      return {
        ...state,
        userManagementRequestPages: [],
        userManagementRequestsLoading: true,
        userManagementRequestsError: null,
      };
    case FETCH_INITIAL_USER_MANAGEMENT_REQUESTS_SUCCESS: {
      const payload = action.payload as PageResult<UserManagementRequest>;
      return {
        ...state,
        userManagementRequestsLoading: false,
        userManagementRequestPages: [payload],
      };
    }
    case FETCH_INITIAL_USER_MANAGEMENT_REQUESTS_FAILURE:
      return {
        ...state,
        userManagementRequestsLoading: false,
        userManagementRequestsError: action.payload as AxiosError,
      };
    case APPEND_USER_MANAGEMENT_REQUESTS_BEGIN:
      return {
        ...state,
        userManagementRequestsLoading: true,
      };
    case APPEND_USER_MANAGEMENT_REQUESTS_FAILURE:
      return {
        ...state,
        userManagementRequestsLoading: false,
        userManagementRequestsError: action.payload as AxiosError,
      };
    case APPEND_USER_MANAGEMENT_REQUESTS_SUCCESS: {
      const payload = action.payload as PageResult<UserManagementRequest>;
      return {
        ...state,
        userManagementRequestsLoading: false,
        userManagementRequestPages: [
          ...state.userManagementRequestPages,
          payload,
        ],
      };
    }
    case FETCH_USER_MANAGEMENT_REQUEST_UPDATES_BEGIN:
      return {
        ...state,
        userManagementRequestsFetchingUpdates: true,
      };
    case FETCH_USER_MANAGEMENT_REQUEST_UPDATES_FAILURE:
      return {
        ...state,
        userManagementRequestsFetchingUpdates: false,
      };
    case FETCH_USER_MANAGEMENT_REQUEST_UPDATES_SUCCESS: {
      const payload = action.payload as PageResult<UserManagementRequest>[];
      return {
        ...state,
        userManagementRequestsFetchingUpdates: false,
        userManagementRequestPages: payload,
      };
    }
    case UPDATE_USER_MANAGEMENT_REQUESTS_BEGIN:
      return {
        ...state,
        updateUserManagementRequestPending: true,
      };
    case UPDATE_USER_MANAGEMENT_REQUESTS_SUCCESS:
      return {
        ...state,
        updateUserManagementRequestPending: false,
      };
    case UPDATE_USER_MANAGEMENT_REQUESTS_FAILURE:
      return {
        ...state,
        updateUserManagementRequestPending: false,
      };
    case UPDATE_SEGMENT_CONSTRAINT_BEGIN:
      return {
        ...state,
        adminSegmentConstraintsUpdating: true,
      };
    case UPDATE_SEGMENT_CONSTRAINT_SUCCESS: {
      return {
        ...state,
        selectedAdminSegment: {
          ...state.selectedAdminSegment,
          Constraint: { ...state.editableSegmentConstraint },
        },
        adminSegmentConstraintsUpdating: false,
      };
    }
    case UPDATE_SEGMENT_CONSTRAINT_FAILURE:
      return {
        ...state,
        adminSegmentConstraintsUpdating: false,
      };
    case UPDATE_EDITABLE_SEGMENT_CONSTRAINT: {
      const constraintPayload = action.payload as Partial<SegmentConstraintDto>;
      return {
        ...state,
        editableSegmentConstraint: {
          ...state.editableSegmentConstraint,
          ...constraintPayload,
        },
      };
    }
    case CANCEL_EDITABLE_SEGMENT_CONSTRAINT_CHANGES: {
      return {
        ...state,
        editableSegmentConstraint: {
          ...state.selectedAdminSegment.Constraint,
        },
      };
    }
    case FETCH_ALL_PENDING_USER_MANAGEMENT_REQUEST_COUNT_BEGIN:
      return {
        ...state,
        totalPendingUserManagementRequestCount: 0,
      };
    case FETCH_ALL_PENDING_USER_MANAGEMENT_REQUEST_COUNT_SUCCESS:
      return {
        ...state,
        totalPendingUserManagementRequestCount: action.payload as number,
      };
    case FETCH_ALL_PENDING_USER_MANAGEMENT_REQUEST_COUNT_FAILURE:
      return {
        ...state,
        totalPendingUserManagementRequestCount: 0,
      };
    case FETCH_SEGMENT_PENDING_USER_MANAGEMENT_REQUEST_COUNT_BEGIN:
      return {
        ...state,
        segmentPendingUserManagementRequestCount: 0,
      };
    case FETCH_SEGMENT_PENDING_USER_MANAGEMENT_REQUEST_COUNT_SUCCESS:
      return {
        ...state,
        segmentPendingUserManagementRequestCount: action.payload as number,
      };
    case FETCH_SEGMENT_PENDING_USER_MANAGEMENT_REQUEST_COUNT_FAILURE:
      return {
        ...state,
        segmentPendingUserManagementRequestCount: 0,
      };
    default:
      return state;
  }
}
