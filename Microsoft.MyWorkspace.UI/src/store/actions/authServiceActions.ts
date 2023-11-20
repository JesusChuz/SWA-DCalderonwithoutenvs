import { Action, createAction, Dispatch } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import {
  FETCH_USER_ROLE_ASSIGNMENT_BEGIN,
  FETCH_USER_ROLE_ASSIGNMENT_SUCCESS,
  FETCH_USER_ROLE_ASSIGNMENT_FAILURE,
  FETCH_ADMIN_USER_ROLE_ASSIGNMENT_BEGIN,
  FETCH_ADMIN_USER_ROLE_ASSIGNMENT_FAILURE,
  FETCH_ADMIN_USER_ROLE_ASSIGNMENT_SUCCESS,
  CLEAR_ADMIN_USER_ROLE_SEARCH,
  SET_SELECTED_ADMIN_SEGMENT,
  FETCH_ADMIN_SEGMENTS_SUCCESS,
  FETCH_ADMIN_SEGMENTS_BEGIN,
  FETCH_ADMIN_SEGMENTS_FAILURE,
  FETCH_SEGMENT_MEMBERS_BEGIN,
  FETCH_SEGMENT_MEMBERS_FAILURE,
  FETCH_SEGMENT_MEMBERS_SUCCESS,
  APPEND_SEGMENT_MEMBERS_BEGIN,
  APPEND_SEGMENT_MEMBERS_FAILURE,
  APPEND_SEGMENT_MEMBERS_SUCCESS,
  ADD_SEGMENT_MEMBER_BEGIN,
  ADD_SEGMENT_MEMBER_SUCCESS,
  ADD_SEGMENT_MEMBER_FAILURE,
  SET_TENANT_SEGMENT_ADMIN_EMAIL_QUERY,
  FETCH_SEGMENT_UPDATE_PERCENTAGE_BEGIN,
  FETCH_SEGMENT_UPDATE_PERCENTAGE_SUCCESS,
  FETCH_SEGMENT_UPDATE_PERCENTAGE_FAILURE,
  PATCH_SEGMENT_RESTRICTED_DNS_ADDRESSES_FAILURE,
  PATCH_SEGMENT_RESTRICTED_DNS_ADDRESSES_BEGIN,
  PATCH_SEGMENT_RESTRICTED_DNS_ADDRESSES_SUCCESS,
  UPDATE_RESTRICTED_ENDPOINTS,
  UPDATE_DIRTY_RESTRICTED_ENDPOINTS,
  SET_SELECTED_USERS,
  DELETE_USERS_BEGIN,
  DELETE_USERS_FAILURE,
  DELETE_USERS_SUCCESS,
  MOVE_SEGMENT_MEMBER_BEGIN,
  MOVE_SEGMENT_MEMBER_FAILURE,
  MOVE_SEGMENT_MEMBER_SUCCESS,
  SET_SELECTED_USER_MANAGEMENT_REQUESTS,
  UPDATE_USER_MANAGEMENT_REQUESTS_BEGIN,
  UPDATE_USER_MANAGEMENT_REQUESTS_FAILURE,
  UPDATE_USER_MANAGEMENT_REQUESTS_SUCCESS,
  APPEND_USER_MANAGEMENT_REQUESTS_BEGIN,
  APPEND_USER_MANAGEMENT_REQUESTS_FAILURE,
  APPEND_USER_MANAGEMENT_REQUESTS_SUCCESS,
  FETCH_USER_MANAGEMENT_REQUEST_UPDATES_BEGIN,
  FETCH_USER_MANAGEMENT_REQUEST_UPDATES_FAILURE,
  FETCH_USER_MANAGEMENT_REQUEST_UPDATES_SUCCESS,
  FETCH_INITIAL_USER_MANAGEMENT_REQUESTS_BEGIN,
  FETCH_INITIAL_USER_MANAGEMENT_REQUESTS_FAILURE,
  FETCH_INITIAL_USER_MANAGEMENT_REQUESTS_SUCCESS,
  UPDATE_SEGMENT_CONSTRAINT_BEGIN,
  UPDATE_SEGMENT_CONSTRAINT_FAILURE,
  UPDATE_SEGMENT_CONSTRAINT_SUCCESS,
  UPDATE_EDITABLE_SEGMENT_CONSTRAINT,
  CANCEL_EDITABLE_SEGMENT_CONSTRAINT_CHANGES,
  SET_TENANT_SEGMENT_USER_EXISTS_QUERY,
  FETCH_ALL_PENDING_USER_MANAGEMENT_REQUEST_COUNT_BEGIN,
  FETCH_ALL_PENDING_USER_MANAGEMENT_REQUEST_COUNT_FAILURE,
  FETCH_ALL_PENDING_USER_MANAGEMENT_REQUEST_COUNT_SUCCESS,
  FETCH_SEGMENT_PENDING_USER_MANAGEMENT_REQUEST_COUNT_BEGIN,
  FETCH_SEGMENT_PENDING_USER_MANAGEMENT_REQUEST_COUNT_FAILURE,
  FETCH_SEGMENT_PENDING_USER_MANAGEMENT_REQUEST_COUNT_SUCCESS,
} from './actionTypes';
import { showSuccessNotification } from './notificationActions';
import ErrorAction from './errorAction';
import { httpAuthService } from '../../applicationInsights/httpAuthService';
import { UserRoleAssignmentDto } from '../../types/AuthService/UserRoleAssignmentDto.types';
import { getErrorMessage } from '../../shared/ErrorHelper';
import { SegmentDefinitionDto } from '../../types/AuthService/SegmentDefinitionDto.types';
import { PageResult } from '../../types/PageResult.types';
import { AzureWorkspaceInsightsDto } from '../../types/AzureWorkspace/AzureWorkspaceInsightsDto.types';
import { AzureWorkspaceInsightsSummaryDto } from '../../types/AzureWorkspace/AzureWorkspaceInsightsSummaryDto.types';
import { MyWorkspacesStore } from '../reducers/rootReducer';
import { FilterProperty } from '../../types/AzureWorkspace/FilterProperty.types';
import { FilterOperator } from '../../types/enums/FilterOperator';
import { SegmentUpdatePayload } from '../../types/Forms/SegmentUpdatePayload';
import { LightUserRoleAssignmentDto } from '../../types/AuthService/LightUserRoleAssignmentDto.types';
import { DeleteUserRequests } from '../../types/AuthService/UserManagement/DeleteUserRequests.types';
import { UserManagementRequests } from '../../types/AuthService/UserManagement/UserManagementRequests.types';
import { OperationType } from '../../types/AuthService/UserManagement/OperationType.types';
import { UserManagementRequest } from '../../types/AuthService/UserManagement/UserManagementRequest.types';
import { SegmentConstraintDto } from '../../types/AuthService/SegmentConstraintDto.types';
import { apiErrorToString } from '../../shared/helpers/ApiErrorsHelper';

export interface AuthServiceAction extends Action {
  payload?:
    | boolean
    | UserRoleAssignmentDto
    | SegmentDefinitionDto[]
    | SegmentDefinitionDto
    | LightUserRoleAssignmentDto[]
    | PageResult<LightUserRoleAssignmentDto>
    | PageResult<AzureWorkspaceInsightsDto>
    | AzureWorkspaceInsightsDto[]
    | AzureWorkspaceInsightsSummaryDto
    | FilterProperty[]
    | string
    | number
    | string[]
    | AxiosError
    | SegmentUpdatePayload
    | UserManagementRequest[]
    | PageResult<UserManagementRequest>
    | PageResult<UserManagementRequest>[]
    | Partial<SegmentConstraintDto>;
}
export const fetchUserRoleAssignmentBegin = () => ({
  type: FETCH_USER_ROLE_ASSIGNMENT_BEGIN,
});

export const fetchUserRoleAssignmentSuccess = (
  payload: UserRoleAssignmentDto
) => ({
  type: FETCH_USER_ROLE_ASSIGNMENT_SUCCESS,
  payload,
});

export const fetchUserRoleAssignmentError = (error: AxiosError | string) => ({
  type: FETCH_USER_ROLE_ASSIGNMENT_FAILURE,
  payload: error,
});

export const fetchUserRoleAssignment = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchUserRoleAssignmentBegin());
    try {
      const res = await httpAuthService.get<UserRoleAssignmentDto>(
        'authorizationservice/userroleassignment/currentUser'
      );
      dispatch(
        fetchUserRoleAssignmentSuccess(res.data as UserRoleAssignmentDto)
      );
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(fetchUserRoleAssignmentError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve User Role Assignment :\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const fetchAdminUserRoleAssignmentBegin = () => ({
  type: FETCH_ADMIN_USER_ROLE_ASSIGNMENT_BEGIN,
});

export const fetchAdminUserRoleAssignmentSuccess = (
  payload: UserRoleAssignmentDto
) => ({
  type: FETCH_ADMIN_USER_ROLE_ASSIGNMENT_SUCCESS,
  payload,
});

export const fetchAdminUserRoleAssignmentError = (
  error: AxiosError | string
) => ({
  type: FETCH_ADMIN_USER_ROLE_ASSIGNMENT_FAILURE,
  payload: error,
});

export const fetchAdminUserRoleAssignment = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAdminUserRoleAssignmentBegin());
    try {
      const res = await httpAuthService.get(
        `authorizationservice/userroleassignment/${id}`
      );
      dispatch(
        fetchAdminUserRoleAssignmentSuccess(res.data as UserRoleAssignmentDto)
      );
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(fetchAdminUserRoleAssignmentError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve Admin User Role Assignment :\n${getErrorMessage(
            err
          )}`,
          true
        );
      }
    }
  };
};

export const fetchAdminSegmentsBegin = () => ({
  type: FETCH_ADMIN_SEGMENTS_BEGIN,
});

export const fetchAdminSegmentsSuccess = (payload: SegmentDefinitionDto[]) => ({
  type: FETCH_ADMIN_SEGMENTS_SUCCESS,
  payload,
});

export const fetchAdminSegmentsError = (error: AxiosError | string) => ({
  type: FETCH_ADMIN_SEGMENTS_FAILURE,
  payload: error,
});

export const fetchAdminSegments = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAdminSegmentsBegin());
    try {
      const res = await httpAuthService.get<SegmentDefinitionDto[]>(
        `authorizationservice/segmentdefinition/TenantSegmentAdmin`
      );
      dispatch(fetchAdminSegmentsSuccess(res.data));
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(fetchAdminSegmentsError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve Admin Segments :\n${getErrorMessage(err)}`,
          true
        );
      }
    }
  };
};

export const clearAdminUserRoleSearch = (): AuthServiceAction => ({
  type: CLEAR_ADMIN_USER_ROLE_SEARCH,
});

export const fetchSegmentMembersBegin = (): AuthServiceAction => ({
  type: FETCH_SEGMENT_MEMBERS_BEGIN,
});

export const fetchSegmentMembersSuccess = (
  payload: PageResult<LightUserRoleAssignmentDto>
): AuthServiceAction => ({
  type: FETCH_SEGMENT_MEMBERS_SUCCESS,
  payload,
});

export const fetchSegmentMembersError = (
  error: AxiosError | string
): AuthServiceAction => ({
  type: FETCH_SEGMENT_MEMBERS_FAILURE,
  payload: error,
});

export const fetchSegmentMembers = (
  segment: SegmentDefinitionDto,
  emailSearchQuery?: string,
  pageSize?: number
) => {
  return async (dispatch: Dispatch, getState: () => MyWorkspacesStore) => {
    const { authService } = getState();
    dispatch(fetchSegmentMembersBegin());
    try {
      const res = await httpAuthService.get<
        PageResult<LightUserRoleAssignmentDto>
      >(
        `authorizationservice/userroleassignment/lightweight?segmentId=${
          segment.ID
        }${emailSearchQuery ? `&emailSearchQuery=${emailSearchQuery}` : ''}${
          pageSize ? `&pageSize=${pageSize}` : ''
        }${
          authService.segmentMemberUserExistsFilter !== null
            ? `&filterProperties=[{"Name":"UserExists","FilterOperator":"${
                FilterOperator[FilterOperator.eq]
              }","Value":${authService.segmentMemberUserExistsFilter}}]`
            : ''
        }`
      );
      dispatch(fetchSegmentMembersSuccess(res.data));
      return res.data;
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(fetchSegmentMembersError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve Segment Members :\n${getErrorMessage(err)}`,
          true
        );
      }
    }
  };
};

export const appendSegmentMembersBegin = (): AuthServiceAction => ({
  type: APPEND_SEGMENT_MEMBERS_BEGIN,
});

export const appendSegmentMembersSuccess = (
  payload: PageResult<LightUserRoleAssignmentDto>
): AuthServiceAction => ({
  type: APPEND_SEGMENT_MEMBERS_SUCCESS,
  payload,
});

export const appendSegmentMembersError = (
  error: AxiosError | string
): AuthServiceAction => ({
  type: APPEND_SEGMENT_MEMBERS_FAILURE,
  payload: error,
});

export const appendSegmentMembers = (
  segment: SegmentDefinitionDto,
  continuationToken: string,
  emailSearchQuery?: string,
  pageSize?: number
) => {
  return async (dispatch: Dispatch, getState: () => MyWorkspacesStore) => {
    const { authService } = getState();
    dispatch(appendSegmentMembersBegin());
    try {
      const res = await httpAuthService.get<
        PageResult<LightUserRoleAssignmentDto>
      >(
        `authorizationservice/userroleassignment/lightweight?segmentId=${
          segment.ID
        }${emailSearchQuery ? `&emailSearchQuery=${emailSearchQuery}` : ''}
        ${
          authService.segmentMemberUserExistsFilter
            ? `&userExists=${authService.segmentMemberUserExistsFilter}`
            : ''
        }${
          pageSize ? `&pageSize=${pageSize}` : ''
        }&continuationToken=${encodeURIComponent(continuationToken)}`
      );
      dispatch(appendSegmentMembersSuccess(res.data));
      return res.data;
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(appendSegmentMembersError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve Segment Members :\n${getErrorMessage(err)}`,
          true
        );
      }
    }
  };
};

export const setTenantSegmentAdminSegment = (
  segment: SegmentDefinitionDto
): AuthServiceAction => ({
  type: SET_SELECTED_ADMIN_SEGMENT,
  payload: segment,
});

export const setTenantSegmentMemberUserExistsFilter = (
  userExists: boolean
): AuthServiceAction => ({
  type: SET_TENANT_SEGMENT_USER_EXISTS_QUERY,
  payload: userExists,
});

export const setTenantSegmentMemberEmailSearchQuery = (
  emailAddress: string
): AuthServiceAction => ({
  type: SET_TENANT_SEGMENT_ADMIN_EMAIL_QUERY,
  payload: emailAddress ?? null,
});

export const addTenantSegmentMemberBegin = () => ({
  type: ADD_SEGMENT_MEMBER_BEGIN,
});

export const addTenantSegmentMemberSuccess = () => ({
  type: ADD_SEGMENT_MEMBER_SUCCESS,
});

export const addTenantSegmentMemberFailure = (error: AxiosError | string) => ({
  type: ADD_SEGMENT_MEMBER_FAILURE,
  payload: error,
});

export const addTenantSegmentMember = (
  userId: string,
  segment: SegmentDefinitionDto,
  roleName: string
) => {
  return async (dispatch: Dispatch) => {
    dispatch(addTenantSegmentMemberBegin());
    try {
      await httpAuthService.post(
        `authorizationservice/userroleassignment/${segment.ID}/roles/${roleName}/users/${userId}/add`
      );
      dispatch(addTenantSegmentMemberSuccess());
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(addTenantSegmentMemberFailure(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to add user to Tenant Segment Role :\n${getErrorMessage(
            err
          )}`,
          true
        );
      }
    }
  };
};

export const setSelectedUsers = (
  users: LightUserRoleAssignmentDto[]
): AuthServiceAction => ({
  type: SET_SELECTED_USERS,
  payload: users,
});

export const fetchSegmentUpdatePercentageBegin = createAction<string>(
  FETCH_SEGMENT_UPDATE_PERCENTAGE_BEGIN
);

export const fetchSegmentUpdatePercentageFailure =
  createAction<SegmentUpdatePayload>(FETCH_SEGMENT_UPDATE_PERCENTAGE_FAILURE);

export const fetchSegmentUpdatePercentageSuccess =
  createAction<SegmentUpdatePayload>(FETCH_SEGMENT_UPDATE_PERCENTAGE_SUCCESS);

export const fetchSegmentUpdatePercentage = (segmentID: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchSegmentUpdatePercentageBegin());
    try {
      const res = await httpAuthService.get<number>(
        `authorizationservice/segmentconstraint/endpointsprogress/${segmentID}`
      );
      dispatch(
        fetchSegmentUpdatePercentageSuccess({
          percent: res.data,
          segmentId: segmentID,
        })
      );
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(
          fetchSegmentUpdatePercentageFailure({
            percent: 0,
            segmentId: segmentID,
            error: err,
          })
        );
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve Segment summarize insight  :\n${getErrorMessage(
            err
          )}`,
          true
        );
      }
    }
  };
};

export const patchSegmentRestrictedDnsAddressesBegin = createAction(
  PATCH_SEGMENT_RESTRICTED_DNS_ADDRESSES_BEGIN
);

export const patchSegmentRestrictedDnsAddressesFailure =
  createAction<AxiosError>(PATCH_SEGMENT_RESTRICTED_DNS_ADDRESSES_FAILURE);

export const patchSegmentRestrictedDnsAddressesSuccess =
  createAction<AxiosError>(PATCH_SEGMENT_RESTRICTED_DNS_ADDRESSES_SUCCESS);

export const patchSegmentRestrictedDnsAddresses = (
  segmentID: string,
  endpoints: string[]
) => {
  return async (dispatch: Dispatch, getState: () => MyWorkspacesStore) => {
    const { authService } = getState();
    dispatch(patchSegmentRestrictedDnsAddressesBegin());
    try {
      await httpAuthService.patch(
        `authorizationservice/segmentconstraint/endpoints/${segmentID}`,
        endpoints
      );
      dispatch(patchSegmentRestrictedDnsAddressesSuccess());
      fetchSegmentUpdatePercentage(segmentID)(dispatch);
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(patchSegmentRestrictedDnsAddressesFailure(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to update restricted DNS addresses:\n${getErrorMessage(err)}`,
          true
        );
      }
    }
  };
};

export const updateDirtyRestrictedEndpoints = (
  restrictedDomains: string[]
): AuthServiceAction => ({
  type: UPDATE_DIRTY_RESTRICTED_ENDPOINTS,
  payload: restrictedDomains,
});

export const updateRestrictedEndpointsForConstraint = (
  restrictedDomains: string[]
): AuthServiceAction => ({
  type: UPDATE_RESTRICTED_ENDPOINTS,
  payload: restrictedDomains,
});

export const fetchInitialUserManagementRequestsBegin = createAction<void>(
  FETCH_INITIAL_USER_MANAGEMENT_REQUESTS_BEGIN
);

export const fetchInitialUserManagementRequestsSuccess = createAction<
  PageResult<UserManagementRequest>
>(FETCH_INITIAL_USER_MANAGEMENT_REQUESTS_SUCCESS);

export const fetchInitialUserManagementRequestsFailure =
  createAction<AxiosError>(FETCH_INITIAL_USER_MANAGEMENT_REQUESTS_FAILURE);

export const fetchInitialUserManagementRequests = (
  segmentId: string
): ((dispatch: Dispatch) => Promise<void>) => {
  return async (dispatch): Promise<void> => {
    dispatch(fetchInitialUserManagementRequestsBegin());
    try {
      const res = await httpAuthService.get<PageResult<UserManagementRequest>>(
        `user-management/users/page-requests?segmentId=${segmentId}`
      );

      dispatch(fetchInitialUserManagementRequestsSuccess(res.data));
    } catch (e) {
      dispatch(fetchInitialUserManagementRequestsFailure(e));
      ErrorAction(
        dispatch,
        e,
        `Failed to fetch user management requests:\n${e.response?.data}`,
        true
      );
    }
  };
};

export const fetchUserManagementRequestUpdatesBegin = createAction<void>(
  FETCH_USER_MANAGEMENT_REQUEST_UPDATES_BEGIN
);

export const fetchUserManagementRequestUpdatesSuccess = createAction<
  PageResult<UserManagementRequest>[]
>(FETCH_USER_MANAGEMENT_REQUEST_UPDATES_SUCCESS);

export const fetchUserManagementRequestUpdatesFailure =
  createAction<AxiosError>(FETCH_USER_MANAGEMENT_REQUEST_UPDATES_FAILURE);

export const fetchUserManagementRequestUpdates = (
  segmentId: string
): ((
  dispatch: Dispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    dispatch(fetchUserManagementRequestUpdatesBegin());
    try {
      const { authService } = getState();
      const { userManagementRequestPages } = authService;
      const resList: PageResult<UserManagementRequest>[] = [];
      for (let i = 0; i < userManagementRequestPages.length; i++) {
        const continuationToken =
          i === 0 ? null : resList[i - 1].ContinuationToken;
        const res = await httpAuthService.get<
          PageResult<UserManagementRequest>
        >(
          `user-management/users/page-requests?segmentId=${segmentId}${
            continuationToken
              ? `&continuationToken=${encodeURIComponent(continuationToken)}`
              : ''
          }`
        );
        resList.push(res.data);
      }

      dispatch(fetchUserManagementRequestUpdatesSuccess(resList));
    } catch (e) {
      dispatch(fetchUserManagementRequestUpdatesFailure(e));
      ErrorAction(
        dispatch,
        e,
        `Failed to fetch user management request updates:\n${e.response?.data}`,
        true
      );
    }
  };
};

export const appendUserManagementRequestsBegin = createAction<void>(
  APPEND_USER_MANAGEMENT_REQUESTS_BEGIN
);

export const appendUserManagementRequestsSuccess = createAction<
  PageResult<UserManagementRequest>
>(APPEND_USER_MANAGEMENT_REQUESTS_SUCCESS);

export const appendUserManagementRequestsFailure = createAction<AxiosError>(
  APPEND_USER_MANAGEMENT_REQUESTS_FAILURE
);

export const appendUserManagementRequests = (
  segmentId: string,
  continuationToken: string
): ((dispatch: Dispatch) => Promise<void>) => {
  return async (dispatch): Promise<void> => {
    dispatch(appendUserManagementRequestsBegin());
    try {
      const res = await httpAuthService.get<PageResult<UserManagementRequest>>(
        `user-management/users/page-requests?segmentId=${segmentId}&continuationToken=${encodeURIComponent(
          continuationToken
        )}`
      );

      dispatch(appendUserManagementRequestsSuccess(res.data));
    } catch (e) {
      dispatch(appendUserManagementRequestsFailure(e));
      ErrorAction(
        dispatch,
        e,
        `Failed to append user management requests:\n${e.response?.data}`,
        true
      );
    }
  };
};

export const deleteUsersBegin = createAction<void>(DELETE_USERS_BEGIN);

export const deleteUsersSuccess = createAction<void>(DELETE_USERS_SUCCESS);

export const deleteUsersFailure =
  createAction<AxiosError>(DELETE_USERS_FAILURE);

export const deleteUsers = (
  deleteUserRequests: DeleteUserRequests
): ((dispatch: Dispatch) => Promise<void>) => {
  return async (dispatch): Promise<void> => {
    dispatch(deleteUsersBegin());
    try {
      await httpAuthService.post(
        'user-management/users/delete',
        deleteUserRequests
      );
      dispatch(deleteUsersSuccess());
      dispatch(
        showSuccessNotification(
          'The deletion request was successful. There will be a delay until the user is deleted from the segment.'
        )
      );
    } catch (e) {
      dispatch(deleteUsersFailure(e));
      ErrorAction(
        dispatch,
        e,
        `Failed to delete users:\n${e.response?.data}`,
        true
      );
    }
  };
};

export const moveTenantSegmentMemberBegin = createAction<void>(
  MOVE_SEGMENT_MEMBER_BEGIN
);

export const moveTenantSegmentMemberSuccess = createAction<void>(
  MOVE_SEGMENT_MEMBER_SUCCESS
);

export const moveTenantSegmentMemberFailure = createAction<AxiosError>(
  MOVE_SEGMENT_MEMBER_FAILURE
);

export const moveTenantSegmentMember = (
  userManagementRequests: UserManagementRequests,
  operationType: OperationType
): ((dispatch: Dispatch) => Promise<void>) => {
  return async (dispatch): Promise<void> => {
    dispatch(moveTenantSegmentMemberBegin());
    try {
      await httpAuthService.post(
        'user-management/users',
        userManagementRequests
      );
      dispatch(moveTenantSegmentMemberSuccess());
      if (operationType === OperationType.Move) {
        dispatch(
          showSuccessNotification(
            "The user request was successful. The admin of the user's segment may need to review the request and either approve or deny it."
          )
        );
      }
    } catch (e) {
      dispatch(moveTenantSegmentMemberFailure(e));
      ErrorAction(
        dispatch,
        e,
        `Failed to submit user request:\n${e.response?.data}`,
        true
      );
    }
  };
};

export const setSelectedUserManagementRequests = (
  userManagementRequests: UserManagementRequest[]
): AuthServiceAction => ({
  type: SET_SELECTED_USER_MANAGEMENT_REQUESTS,
  payload: userManagementRequests,
});

export const updateUserManagementRequestsBegin = createAction<void>(
  UPDATE_USER_MANAGEMENT_REQUESTS_BEGIN
);

export const updateUserManagementRequestsSuccess = createAction<void>(
  UPDATE_USER_MANAGEMENT_REQUESTS_SUCCESS
);

export const updateUserManagementRequestsFailure = createAction<AxiosError>(
  UPDATE_USER_MANAGEMENT_REQUESTS_FAILURE
);

export const updateUserManagementRequests = (
  approval: boolean,
  userManagementRequests: UserManagementRequest[]
): ((dispatch: Dispatch) => Promise<void>) => {
  return async (dispatch): Promise<void> => {
    dispatch(updateUserManagementRequestsBegin());
    try {
      await httpAuthService.put(
        `user-management/users?approval=${approval}`,
        userManagementRequests
      );
      dispatch(updateUserManagementRequestsSuccess());
    } catch (e) {
      dispatch(updateUserManagementRequestsFailure(e));
      ErrorAction(
        dispatch,
        e,
        `Failed to update user requests:\n${e.response?.data}`,
        true
      );
    }
  };
};

export const updateEditableSegmentConstraint = (
  partialConstraint: Partial<SegmentConstraintDto>
): AuthServiceAction => ({
  type: UPDATE_EDITABLE_SEGMENT_CONSTRAINT,
  payload: partialConstraint,
});

export const cancelEditableSegmentConstraintChanges = createAction<void>(
  CANCEL_EDITABLE_SEGMENT_CONSTRAINT_CHANGES
);

export const updateSegmentConstraintBegin = createAction<void>(
  UPDATE_SEGMENT_CONSTRAINT_BEGIN
);

export const updateSegmentConstraintSuccess = createAction<void>(
  UPDATE_SEGMENT_CONSTRAINT_SUCCESS
);

export const updateSegmentConstraintFailure = createAction<AxiosError>(
  UPDATE_SEGMENT_CONSTRAINT_FAILURE
);

export const updateSegmentConstraint = (
  segmentID: string,
  segmentName: string,
  constraint: SegmentConstraintDto
): ((dispatch: Dispatch) => Promise<void>) => {
  return async (dispatch): Promise<void> => {
    dispatch(updateSegmentConstraintBegin());
    try {
      await httpAuthService.patch(
        `authorizationservice/segmentconstraint/${segmentID}/segmentname/${encodeURIComponent(
          segmentName
        )}`,
        constraint
      );
      dispatch(
        showSuccessNotification(
          'The quota values for this segment have been updated.'
        )
      );
      dispatch(updateSegmentConstraintSuccess());
    } catch (e) {
      dispatch(updateSegmentConstraintFailure(e));
      ErrorAction(
        dispatch,
        e,
        `Failed to update quota values:\n${apiErrorToString(
          e.response?.data?.errors
        )}`,
        true
      );
    }
  };
};

export const fetchTotalPendingUserManagementRequestCountBegin =
  createAction<void>(FETCH_ALL_PENDING_USER_MANAGEMENT_REQUEST_COUNT_BEGIN);

export const fetchTotalPendingUserManagementRequestCountSuccess =
  createAction<number>(FETCH_ALL_PENDING_USER_MANAGEMENT_REQUEST_COUNT_SUCCESS);

export const fetchTotalPendingUserManagementRequestCountFailure =
  createAction<AxiosError>(
    FETCH_ALL_PENDING_USER_MANAGEMENT_REQUEST_COUNT_FAILURE
  );

export const fetchTotalPendingUserManagementRequestCount = (): ((
  dispatch: Dispatch
) => Promise<void>) => {
  return async (dispatch): Promise<void> => {
    dispatch(fetchTotalPendingUserManagementRequestCountBegin());
    try {
      const res = await httpAuthService.get<number>(
        `user-management/users/pending-count`
      );

      dispatch(fetchTotalPendingUserManagementRequestCountSuccess(res.data));
    } catch (e) {
      dispatch(fetchTotalPendingUserManagementRequestCountFailure(e));
      ErrorAction(
        dispatch,
        e,
        `Failed to fetch user management request counts:\n${e.response?.data}`,
        true
      );
    }
  };
};

export const fetchSegmentPendingUserManagementRequestCountBegin =
  createAction<void>(FETCH_SEGMENT_PENDING_USER_MANAGEMENT_REQUEST_COUNT_BEGIN);

export const fetchSegmentPendingUserManagementRequestCountSuccess =
  createAction<number>(
    FETCH_SEGMENT_PENDING_USER_MANAGEMENT_REQUEST_COUNT_SUCCESS
  );

export const fetchSegmentPendingUserManagementRequestCountFailure =
  createAction<AxiosError>(
    FETCH_SEGMENT_PENDING_USER_MANAGEMENT_REQUEST_COUNT_FAILURE
  );

export const fetchSegmentPendingUserManagementRequestCount = (
  segmentId: string
): ((dispatch: Dispatch) => Promise<void>) => {
  return async (dispatch): Promise<void> => {
    dispatch(fetchSegmentPendingUserManagementRequestCountBegin());
    try {
      const res = await httpAuthService.get<number>(
        `user-management/users/pending-count?segmentId=${segmentId}`
      );

      dispatch(fetchSegmentPendingUserManagementRequestCountSuccess(res.data));
    } catch (e) {
      dispatch(fetchSegmentPendingUserManagementRequestCountFailure(e));
      ErrorAction(
        dispatch,
        e,
        `Failed to fetch user management request counts:\n${e.response?.data}`,
        true
      );
    }
  };
};
