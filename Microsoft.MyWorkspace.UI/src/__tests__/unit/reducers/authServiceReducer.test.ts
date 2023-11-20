import { AuthServiceAction } from '../../../store/actions';
import {
  CLEAR_ADMIN_USER_ROLE_SEARCH,
  FETCH_ADMIN_USER_ROLE_ASSIGNMENT_BEGIN,
  FETCH_ADMIN_USER_ROLE_ASSIGNMENT_FAILURE,
  FETCH_ADMIN_USER_ROLE_ASSIGNMENT_SUCCESS,
  FETCH_USER_ROLE_ASSIGNMENT_BEGIN,
  FETCH_USER_ROLE_ASSIGNMENT_FAILURE,
  FETCH_USER_ROLE_ASSIGNMENT_SUCCESS,
} from '../../../store/actions/actionTypes';
import { AxiosErrorTestData } from '../../data/AxiosErrorTestData';
import { getTestRoleAssignmentDto } from '../../data/RoleAssignmentDtoTestData';
import authServiceReducer, {
  authServiceInitialState,
  ReduxAuthServiceState,
} from '../../../store/reducers/authServiceReducer';
import { UserRoleAssignmentDto } from '../../../types/AuthService/UserRoleAssignmentDto.types';

const initialState = authServiceInitialState;

describe('Auth Service Reducer Tests', () => {
  test('Action with FETCH_USER_ROLE_ASSIGNMENT_BEGIN type returns the correct state', () => {
    const action: AuthServiceAction = {
      type: FETCH_USER_ROLE_ASSIGNMENT_BEGIN,
    };
    const newState = authServiceReducer(initialState, action);
    expect(newState.userRoleAssignment).toBeNull();
    expect(newState.userRoleAssignmentLoading).toBe(true);
  });
  test('Action with FETCH_USER_ROLE_ASSIGNMENT_FAILURE type returns the correct state', () => {
    const error = { ...AxiosErrorTestData };
    const action: AuthServiceAction = {
      type: FETCH_USER_ROLE_ASSIGNMENT_FAILURE,
      payload: error,
    };
    const newState = authServiceReducer(initialState, action);
    expect(newState.userRoleAssignmentError).toEqual(error);
    expect(newState.userRoleAssignmentLoading).toBe(false);
  });
  test.each([0, 3])(
    'Action with FETCH_USER_ROLE_ASSIGNMENT_SUCCESS type returns the correct state (case %#)',
    (constraintValue) => {
      const payload: UserRoleAssignmentDto = {
        UserId: 'role-assignment-id',
        UserRoleAssignments: [getTestRoleAssignmentDto({}, constraintValue)],
        Email: null,
      };
      const action: AuthServiceAction = {
        type: FETCH_USER_ROLE_ASSIGNMENT_SUCCESS,
        payload,
      };
      const newState = authServiceReducer(initialState, action);
      expect(newState.userRoleAssignment).toEqual(payload);
      const constraint = payload.UserRoleAssignments[0].Constraint;
      expect(newState.constraint.MaxAzureWorkspacesAllowed).toBe(
        constraint.MaxAzureWorkspacesAllowed
      );
      expect(newState.constraint.MaxRunTimeAllowed).toBe(
        constraint.MaxRunTimeAllowed
      );
      expect(newState.constraint.MaxPublicIPAddressesAllowed).toBe(
        constraint.MaxPublicIPAddressesAllowed
      );
      expect(newState.constraint.MaxMachineMemoryAllowedCustom).toBe(
        constraint.MaxMachineMemoryAllowedCustom
      );
      expect(newState.constraint.MaxMachineStorageAllowedCustom).toBe(
        constraint.MaxMachineStorageAllowedCustom
      );
      expect(newState.constraint.MaxCumulativeStorageAllowedCustom).toBe(
        constraint.MaxCumulativeStorageAllowedCustom
      );
      expect(newState.constraint.MaxCumulativeMemoryAllowedCustom).toBe(
        constraint.MaxCumulativeMemoryAllowedCustom
      );
      expect(newState.constraint.MaxMachinesPerWorkspaceAllowedCustom).toBe(
        constraint.MaxMachinesPerWorkspaceAllowedCustom
      );
      expect(newState.constraint.MaxDataDisksPerVM).toBe(
        constraint.MaxDataDisksPerVM
      );
      expect(newState.constraint.WeeklyRuntimeExtensionHours).toBe(
        constraint.WeeklyRuntimeExtensionHours
      );

      expect(newState.segmentName).toBe(
        payload.UserRoleAssignments[0].SegmentName
      );
      expect(newState.userRoleAssignmentLoading).toBe(false);
    }
  );
  test('Action with FETCH_ADMIN_USER_ROLE_ASSIGNMENT_BEGIN type returns the correct state', () => {
    const action: AuthServiceAction = {
      type: FETCH_ADMIN_USER_ROLE_ASSIGNMENT_BEGIN,
    };
    const newState = authServiceReducer(initialState, action);
    expect(newState.adminUserRoleAssignment).toBeNull();
    expect(newState.adminUserRoleAssignmentLoading).toBe(true);
  });
  test('Action with FETCH_ADMIN_USER_ROLE_ASSIGNMENT_FAILURE type returns the correct state', () => {
    const error = { ...AxiosErrorTestData };
    const action: AuthServiceAction = {
      type: FETCH_ADMIN_USER_ROLE_ASSIGNMENT_FAILURE,
      payload: error,
    };
    const newState = authServiceReducer(initialState, action);
    expect(newState.adminUserRoleAssignmentError).toEqual(error);
    expect(newState.adminUserRoleAssignmentLoading).toBe(false);
  });
  test('Action with FETCH_ADMIN_USER_ROLE_ASSIGNMENT_SUCCESS type returns the correct state', () => {
    const payload: UserRoleAssignmentDto = {
      UserId: 'role-assignment-id',
      UserRoleAssignments: [getTestRoleAssignmentDto()],
      Email: null,
    };
    const action: AuthServiceAction = {
      type: FETCH_ADMIN_USER_ROLE_ASSIGNMENT_SUCCESS,
      payload,
    };
    const newState = authServiceReducer(
      { ...initialState, adminUserRoleAssignmentLoading: true },
      action
    );
    expect(newState.adminUserRoleAssignment).toEqual(payload);
    expect(newState.adminUserRoleAssignmentLoading).toBe(false);
  });
  test('Action with CLEAR_ADMIN_USER_ROLE_SEARCH type returns the correct state', () => {
    const adminUserRoleAssignment: UserRoleAssignmentDto = {
      UserId: 'role-assignment-id',
      UserRoleAssignments: [getTestRoleAssignmentDto()],
      Email: null,
    };
    const action: AuthServiceAction = {
      type: CLEAR_ADMIN_USER_ROLE_SEARCH,
    };
    const startState: ReduxAuthServiceState = {
      ...initialState,
      adminUserRoleAssignment,
      adminUserRoleAssignmentLoading: true,
    };
    const newState = authServiceReducer(startState, action);
    expect(newState.adminUserRoleAssignment).toEqual(null);
    expect(newState.adminUserRoleAssignmentLoading).toBe(false);
    expect(newState.adminUserRoleAssignmentError).toBeNull();
  });
  test('Default case returns initial state', () => {
    const action: AuthServiceAction = {
      type: null,
    };
    const newState = authServiceReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
});
