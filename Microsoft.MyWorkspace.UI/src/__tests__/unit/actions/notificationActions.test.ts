import { httpAuthService } from '../../../applicationInsights/httpAuthService';
import {
  changeUserNotificationStatus,
  updateAllUserNotifications,
  dismissNotifications,
  fetchUserNotifications,
  hideBlockedNotification,
  hideDefaultNotification,
  hideErrorNotification,
  hideSevereWarningNotification,
  hideSuccessNotification,
  hideUserConfirmationDialog,
  hideWarningNotification,
  setOpenedPanel,
  setUserNotification,
  showBlockedNotification,
  showDefaultNotification,
  showDomainControllerConfirmationDialog,
  showErrorNotification,
  showSevereWarningNotification,
  showSuccessNotification,
  showUserConfirmationDialog,
  showWarningNotification,
} from '../../../store/actions';
import {
  CHANGE_USER_NOTIFICATION_STATUS_BEGIN,
  CHANGE_USER_NOTIFICATION_STATUS_FAILURE,
  CHANGE_USER_NOTIFICATION_STATUS_SUCCESS,
  UPDATE_ALL_USER_NOTIFICATIONS_BEGIN,
  UPDATE_ALL_USER_NOTIFICATIONS_FAILURE,
  UPDATE_ALL_USER_NOTIFICATIONS_SUCCESS,
  DISMISS_NOTIFICATIONS,
  FETCH_USER_NOTIFICATIONS_BEGIN,
  FETCH_USER_NOTIFICATIONS_FAILURE,
  FETCH_USER_NOTIFICATIONS_SUCCESS,
  HIDE_BLOCKED_NOTIFICATION,
  HIDE_DEFAULT_NOTIFICATION,
  HIDE_ERROR_NOTIFICATION,
  HIDE_SEVERE_WARNING_NOTIFICATION,
  HIDE_SUCCESS_NOTIFICATION,
  HIDE_USER_CONFIRMATION_DIALOG,
  HIDE_WARNING_NOTIFICATION,
  SET_OPENED_PANEL_NAME,
  SET_POLITE_SCREEN_READER_ANNOUNCEMENT,
  SET_USER_NOTIFICATION,
  SHOW_BLOCKED_NOTIFICATION,
  SHOW_DEFAULT_NOTIFICATION,
  SHOW_ERROR_NOTIFICATION,
  SHOW_SEVERE_WARNING_NOTIFICATION,
  SHOW_SUCCESS_NOTIFICATION,
  SHOW_USER_CONFIRMATION_DIALOG,
  SHOW_WARNING_NOTIFICATION,
} from '../../../store/actions/actionTypes';
import { NotificationDto } from '../../../types/Notification/NotificationDto.types';
import { getMockStore } from '../../utils/mockStore.util';
import { getTestNotificationDto } from '../../data/NotificationDtoTestData';
import { NotificationStatus } from '../../../types/enums/NotificationStatus';
import { notificationInitialState } from '../../../store/reducers/notificationReducer';

jest.mock('../../../applicationInsights/TelemetryService.tsx');
jest.mock('src/applicationInsights/httpAuthService.ts');
jest.mock('../../../store/actions/errorAction');
const failure = {
  response: {
    status: 400,
  },
};

const notificationID1 = 'test-notification-id-1';
const notificationID2 = 'test-notification-id-2';

const store = getMockStore({
  notifications: {
    ...notificationInitialState,
    userNotifications: [
      getTestNotificationDto({
        ID: notificationID1,
        Status: NotificationStatus.Unread,
      }),
      getTestNotificationDto({
        ID: notificationID2,
        Status: NotificationStatus.Read,
      }),
    ],
  },
});

describe('Notification Action Tests', () => {
  beforeEach(() => {
    // Runs before each test in the suite
    store.clearActions();
  });
  test('showDefaultNotification action creator dispatches expected action', () => {
    const message = 'testMessage';
    const expectedActions = [
      {
        type: SHOW_DEFAULT_NOTIFICATION,
        message,
      },
    ];
    store.dispatch(showDefaultNotification(message));
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('hideDefaultNotification action creator dispatches expected action', () => {
    const expectedActions = [
      {
        type: HIDE_DEFAULT_NOTIFICATION,
      },
    ];
    store.dispatch(hideDefaultNotification());
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('showErrorNotification action creator dispatches expected action', () => {
    const message = 'testMessage';
    const expectedActions = [
      {
        type: SHOW_ERROR_NOTIFICATION,
        message,
        linkText: '',
        panelToOpen: '',
      },
    ];
    store.dispatch(showErrorNotification(message));
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('hideErrorNotification action creator dispatches expected action', () => {
    const expectedActions = [
      {
        type: HIDE_ERROR_NOTIFICATION,
      },
    ];
    store.dispatch(hideErrorNotification());
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('showBlockedNotification action creator dispatches expected action', () => {
    const message = 'testMessage';
    const expectedActions = [
      {
        type: SHOW_BLOCKED_NOTIFICATION,
        message,
      },
    ];
    store.dispatch(showBlockedNotification(message));
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('hideBlockedNotification action creator dispatches expected action', () => {
    const expectedActions = [
      {
        type: HIDE_BLOCKED_NOTIFICATION,
      },
    ];
    store.dispatch(hideBlockedNotification());
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('showSevereWarningNotification action creator dispatches expected action', () => {
    const message = 'testMessage';
    const expectedActions = [
      {
        type: SHOW_SEVERE_WARNING_NOTIFICATION,
        message,
      },
    ];
    store.dispatch(showSevereWarningNotification(message));
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('hideSevereWarningNotification action creator dispatches expected action', () => {
    const expectedActions = [
      {
        type: HIDE_SEVERE_WARNING_NOTIFICATION,
      },
    ];
    store.dispatch(hideSevereWarningNotification());
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('showSuccessNotification action creator dispatches expected action', () => {
    const message = 'testMessage';
    const expectedActions = [
      {
        type: SHOW_SUCCESS_NOTIFICATION,
        message,
      },
    ];
    store.dispatch(showSuccessNotification(message));
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('hideSuccessNotification action creator dispatches expected action', () => {
    const expectedActions = [
      {
        type: HIDE_SUCCESS_NOTIFICATION,
      },
    ];
    store.dispatch(hideSuccessNotification());
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('showWarningNotification action creator dispatches expected action', () => {
    const message = 'testMessage';
    const expectedActions = [
      {
        type: SHOW_WARNING_NOTIFICATION,
        message,
      },
    ];
    store.dispatch(showWarningNotification(message));
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('hideWarningNotification action creator dispatches expected action', () => {
    const expectedActions = [
      {
        type: HIDE_WARNING_NOTIFICATION,
      },
    ];
    store.dispatch(hideWarningNotification());
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('dismissNotifications action creator dispatches expected action', () => {
    const expectedActions = [
      {
        type: DISMISS_NOTIFICATIONS,
      },
    ];
    store.dispatch(dismissNotifications());
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('setOpenedPanel action creator dispatches expected action', () => {
    const openedPanel = 'name';
    const expectedActions = [
      {
        type: SET_OPENED_PANEL_NAME,
        openedPanel,
      },
    ];
    store.dispatch(setOpenedPanel(openedPanel));
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('showUserConfirmationDialog action creator dispatches expected action', () => {
    const title = 'title';
    const userConfirmationBody = 'message';
    const userConfirmationConfirmCallback = (): void => null;
    const userConfirmationCancelCallback = (): void => null;
    const expectedActions = [
      {
        type: SHOW_USER_CONFIRMATION_DIALOG,
        title,
        userConfirmationBody,
        userConfirmationConfirmCallback,
        userConfirmationCancelCallback,
      },
    ];
    store.dispatch(
      showUserConfirmationDialog(
        title,
        userConfirmationBody,
        userConfirmationConfirmCallback,
        userConfirmationCancelCallback
      )
    );
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('showDomainControllerConfirmationDialog action creator dispatches expected action', () => {
    const userConfirmationCancelCallback: () => void = null;
    const userConfirmationConfirmCallback: () => void = null;
    const expectedActions = [
      {
        type: SHOW_USER_CONFIRMATION_DIALOG,
        title: 'Do you want to proceed?',
        userConfirmationBody:
          'This will result in all current domain members in this domain being switched to Workgroup.',
        userConfirmationConfirmCallback,
        userConfirmationCancelCallback,
      },
    ];
    store.dispatch(
      showDomainControllerConfirmationDialog(userConfirmationConfirmCallback)
    );

    expect(store.getActions()).toEqual(expectedActions);
  });
  test('hideUserConfirmationDialog action creator dispatches expected action', () => {
    const expectedActions = [
      {
        type: HIDE_USER_CONFIRMATION_DIALOG,
      },
    ];
    store.dispatch(hideUserConfirmationDialog());
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchUserNotifications action creator dispatches expected actions on success', async () => {
    const mockData: { data: NotificationDto[] } = {
      data: [getTestNotificationDto({ ID: notificationID1 })],
    };
    (httpAuthService.get as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      { type: FETCH_USER_NOTIFICATIONS_BEGIN },
      {
        type: FETCH_USER_NOTIFICATIONS_SUCCESS,
        payload: mockData.data,
      },
    ];
    await fetchUserNotifications()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchUserNotifications action creator dispatches expected actions on failure', async () => {
    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = expect.arrayContaining([
      { type: FETCH_USER_NOTIFICATIONS_BEGIN },
      {
        type: FETCH_USER_NOTIFICATIONS_FAILURE,
        payload: failure,
      },
    ]);
    await fetchUserNotifications()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('udpateAllUserNotifications action creator dispatches expected actions on success', async () => {
    (httpAuthService.put as jest.Mock).mockResolvedValue(null);
    const expectedActions = [
      { type: UPDATE_ALL_USER_NOTIFICATIONS_BEGIN },
      {
        type: FETCH_USER_NOTIFICATIONS_SUCCESS,
        payload: [] as NotificationDto[],
      },
      {
        type: SET_POLITE_SCREEN_READER_ANNOUNCEMENT,
        payload: 'All notifications updated.',
      },
      {
        type: UPDATE_ALL_USER_NOTIFICATIONS_SUCCESS,
      },
    ];
    await updateAllUserNotifications(NotificationStatus.Dismissed)(
      store.dispatch,
      store.getState
    );
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('updateAllUserNotifications action creator dispatches expected actions on failure', async () => {
    (httpAuthService.put as jest.Mock).mockRejectedValue(failure);
    const { notifications } = store.getState();
    const expectedActions = [
      { type: UPDATE_ALL_USER_NOTIFICATIONS_BEGIN },
      {
        type: FETCH_USER_NOTIFICATIONS_SUCCESS,
        payload: [] as NotificationDto[],
      },
      {
        type: SET_POLITE_SCREEN_READER_ANNOUNCEMENT,
        payload: 'All notifications updated.',
      },
      {
        type: UPDATE_ALL_USER_NOTIFICATIONS_FAILURE,
        payload: failure,
      },
      {
        type: FETCH_USER_NOTIFICATIONS_SUCCESS,
        payload: [...notifications.userNotifications],
      },
    ];
    await updateAllUserNotifications(NotificationStatus.Dismissed)(
      store.dispatch,
      store.getState
    );
    expect(store.getActions()).toEqual(expectedActions);
  });
  test.each([notificationID1, notificationID2])(
    'changeUserNotificationStatus action creator dispatches nothing if notification status is the same (case %#)',
    async (notificationID) => {
      const { notifications } = store.getState();
      const notificationStatus = notifications.userNotifications.find(
        (n) => n.ID === notificationID
      ).Status;
      const expectedActions: NotificationAction[] = [];
      await changeUserNotificationStatus(notificationID, notificationStatus)(
        store.dispatch,
        store.getState
      );
      expect(store.getActions()).toEqual(expectedActions);
    }
  );
  test.each([notificationID1, notificationID2])(
    'changeUserNotificationStatus action creator dispatches expected actions on success (case %#)',
    async (notificationID) => {
      const { notifications } = store.getState();
      const notification = notifications.userNotifications.find(
        (n) => n.ID === notificationID
      );
      const notificationStatus =
        notification.Status === NotificationStatus.Read
          ? NotificationStatus.Unread
          : NotificationStatus.Read;
      (httpAuthService.put as jest.Mock).mockResolvedValue(null);
      const expectedActions = [
        { type: CHANGE_USER_NOTIFICATION_STATUS_BEGIN },
        {
          type: SET_USER_NOTIFICATION,
          payload: { ...notification, Status: notificationStatus },
        },
        {
          type: SET_POLITE_SCREEN_READER_ANNOUNCEMENT,
          payload: `Notification status set to ${NotificationStatus[notificationStatus]}`,
        },
        {
          type: CHANGE_USER_NOTIFICATION_STATUS_SUCCESS,
        },
      ];
      await changeUserNotificationStatus(notificationID, notificationStatus)(
        store.dispatch,
        store.getState
      );
      expect(store.getActions()).toEqual(expectedActions);
    }
  );
  test.each([notificationID1, notificationID2])(
    'changeUserNotificationStatus action creator dispatches expected actions on failure',
    async (notificationID) => {
      const { notifications } = store.getState();
      const notification = notifications.userNotifications.find(
        (n) => n.ID === notificationID
      );
      const notificationStatus =
        notification.Status === NotificationStatus.Read
          ? NotificationStatus.Unread
          : NotificationStatus.Read;
      (httpAuthService.put as jest.Mock).mockRejectedValue(failure);
      const expectedActions = expect.arrayContaining([
        { type: CHANGE_USER_NOTIFICATION_STATUS_BEGIN },
        {
          type: SET_USER_NOTIFICATION,
          payload: { ...notification, Status: notificationStatus },
        },
        {
          type: CHANGE_USER_NOTIFICATION_STATUS_FAILURE,
          payload: failure,
        },
        {
          type: SET_USER_NOTIFICATION,
          payload: { ...notification },
        },
      ]);
      await changeUserNotificationStatus(notificationID, notificationStatus)(
        store.dispatch,
        store.getState
      );
      expect(store.getActions()).toEqual(expectedActions);
    }
  );
  test('setUserNotification action creator dispatches expected action', async () => {
    const { notifications } = store.getState();
    const notification = notifications.userNotifications[0];
    const expectedActions = [
      {
        type: SET_USER_NOTIFICATION,
        payload: { ...notification },
      },
    ];
    await store.dispatch(setUserNotification(notification));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
