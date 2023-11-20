import {
  clearAdminUserRoleSearch,
  fetchAdminUserRoleAssignment,
  fetchUserRoleAssignment,
  setTenantSegmentMemberEmailSearchQuery,
} from '../../../store/actions';
import { getMockStore } from '../../utils/mockStore.util';
import { httpAuthService } from '../../../applicationInsights/httpAuthService';
import {
  CLEAR_ADMIN_USER_ROLE_SEARCH,
  FETCH_ADMIN_USER_ROLE_ASSIGNMENT_BEGIN,
  FETCH_ADMIN_USER_ROLE_ASSIGNMENT_FAILURE,
  FETCH_ADMIN_USER_ROLE_ASSIGNMENT_SUCCESS,
  FETCH_USER_ROLE_ASSIGNMENT_BEGIN,
  FETCH_USER_ROLE_ASSIGNMENT_FAILURE,
  FETCH_USER_ROLE_ASSIGNMENT_SUCCESS,
  SET_TENANT_SEGMENT_ADMIN_EMAIL_QUERY,
} from '../../../store/actions/actionTypes';
import ErrorAction from '../../../store/actions/errorAction';
import { getErrorMessage } from '../../../shared/ErrorHelper';
import { getTestRoleAssignmentDto } from '../../data/RoleAssignmentDtoTestData';

jest.mock('../../../store/actions/errorAction');
jest.mock('../../../applicationInsights/TelemetryService.tsx');
jest.mock('src/applicationInsights/httpAuthService.ts');
jest.mock('../../../shared/ErrorHelper');

(ErrorAction as jest.Mock).mockReturnValue(true);
(getErrorMessage as jest.Mock).mockReturnValue('');
const failure = {
  response: {
    status: 400,
  },
};

const store = getMockStore();

describe('Auth Service Action Tests', () => {
  beforeEach(() => {
    // Runs before each test in the suite
    store.clearActions();
  });
  test('fetchUserRoleAssignment action creator contains expected actions on success', async () => {
    const mockData = {
      data: {
        ID: 'role-assignment-id',
        UserRoleAssignments: [getTestRoleAssignmentDto()],
      },
    };
    (httpAuthService.get as jest.Mock).mockReturnValue(mockData);
    const expectedActions = [
      { type: FETCH_USER_ROLE_ASSIGNMENT_BEGIN },
      {
        type: FETCH_USER_ROLE_ASSIGNMENT_SUCCESS,
        payload: mockData.data,
      },
    ];
    await fetchUserRoleAssignment()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchUserRoleAssignment action creator contains expected actions on failure', async () => {
    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: FETCH_USER_ROLE_ASSIGNMENT_BEGIN },
      {
        type: FETCH_USER_ROLE_ASSIGNMENT_FAILURE,
        payload: failure,
      },
    ];
    await fetchUserRoleAssignment()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchAdminUserRoleAssignment action creator contains expected actions on success', async () => {
    const id = 'role-assignment-id';
    const mockData = {
      data: {
        ID: id,
        UserRoleAssignments: [getTestRoleAssignmentDto()],
      },
    };
    (httpAuthService.get as jest.Mock).mockReturnValue(mockData);
    const expectedActions = [
      { type: FETCH_ADMIN_USER_ROLE_ASSIGNMENT_BEGIN },
      {
        type: FETCH_ADMIN_USER_ROLE_ASSIGNMENT_SUCCESS,
        payload: mockData.data,
      },
    ];
    await fetchAdminUserRoleAssignment(id)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchAdminUserRoleAssignment action creator contains expected actions on failure', async () => {
    const id = 'role-assignment-id';
    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: FETCH_ADMIN_USER_ROLE_ASSIGNMENT_BEGIN },
      {
        type: FETCH_ADMIN_USER_ROLE_ASSIGNMENT_FAILURE,
        payload: failure,
      },
    ];
    await fetchAdminUserRoleAssignment(id)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('clearAdminUserRoleSearch action creator dispatches expected action', async () => {
    const expectedActions = [{ type: CLEAR_ADMIN_USER_ROLE_SEARCH }];
    store.dispatch(clearAdminUserRoleSearch());
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('setTenantSegmentMemberEmailSearchQuery action creator dispatches expected action', async () => {
    const testEmailSearchQuery = 'test@example.com';
    const expectedActions = [
      {
        type: SET_TENANT_SEGMENT_ADMIN_EMAIL_QUERY,
        payload: testEmailSearchQuery,
      },
    ];
    store.dispatch(
      setTenantSegmentMemberEmailSearchQuery(testEmailSearchQuery)
    );
    expect(store.getActions()).toEqual(expectedActions);
  });
});
