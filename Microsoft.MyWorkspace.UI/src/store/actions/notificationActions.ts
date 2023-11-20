import { AxiosError } from 'axios';
import { createAction, Dispatch } from '@reduxjs/toolkit';
import { httpAuthService } from '../../applicationInsights/httpAuthService';
import { NotificationStatus } from '../../types/enums/NotificationStatus';
import { NotificationDto } from '../../types/Notification/NotificationDto.types';
import { MyWorkspacesStore } from '../reducers/rootReducer';
import {
  SHOW_DEFAULT_NOTIFICATION,
  HIDE_DEFAULT_NOTIFICATION,
  SHOW_ERROR_NOTIFICATION,
  HIDE_ERROR_NOTIFICATION,
  HIDE_BLOCKED_NOTIFICATION,
  SHOW_BLOCKED_NOTIFICATION,
  SHOW_SEVERE_WARNING_NOTIFICATION,
  HIDE_SEVERE_WARNING_NOTIFICATION,
  SHOW_SUCCESS_NOTIFICATION,
  HIDE_SUCCESS_NOTIFICATION,
  SHOW_WARNING_NOTIFICATION,
  HIDE_WARNING_NOTIFICATION,
  Action,
  SET_OPENED_PANEL_NAME,
  SHOW_USER_CONFIRMATION_DIALOG,
  HIDE_USER_CONFIRMATION_DIALOG,
  DISMISS_NOTIFICATIONS,
  FETCH_USER_NOTIFICATIONS_BEGIN,
  FETCH_USER_NOTIFICATIONS_FAILURE,
  FETCH_USER_NOTIFICATIONS_SUCCESS,
  CHANGE_USER_NOTIFICATION_STATUS_BEGIN,
  CHANGE_USER_NOTIFICATION_STATUS_FAILURE,
  CHANGE_USER_NOTIFICATION_STATUS_SUCCESS,
  SET_USER_NOTIFICATION,
  SET_ASSERTIVE_SCREEN_READER_ANNOUNCEMENT,
  ActionType,
  SET_POLITE_SCREEN_READER_ANNOUNCEMENT,
  UPDATE_ALL_USER_NOTIFICATIONS_BEGIN,
  UPDATE_ALL_USER_NOTIFICATIONS_FAILURE,
  UPDATE_ALL_USER_NOTIFICATIONS_SUCCESS,
  UPDATE_SUBSET_USER_NOTIFICATIONS_BEGIN,
  UPDATE_SUBSET_USER_NOTIFICATIONS_FAILURE,
  UPDATE_SUBSET_USER_NOTIFICATIONS_SUCCESS,
} from './actionTypes';
import ErrorAction from './errorAction';

export interface NotificationAction extends Action {
  payload?: NotificationDto | NotificationDto[] | AxiosError | string;
  message?: string;
  title?: string;
  linkText?: string;
  panelToOpen?: string;
  openedPanel?: string;
  userConfirmationBody?: React.ReactChild;
  userConfirmationConfirmCallback?: () => void;
  userConfirmationCancelCallback?: () => void;
}

export const showDefaultNotification = (
  message: string
): NotificationAction => ({
  type: SHOW_DEFAULT_NOTIFICATION,
  message,
});

export const hideDefaultNotification = (): NotificationAction => ({
  type: HIDE_DEFAULT_NOTIFICATION,
});

export const showErrorNotification = (
  message: string,
  linkText = '',
  panelToOpen = ''
): NotificationAction => ({
  type: SHOW_ERROR_NOTIFICATION,
  message,
  linkText,
  panelToOpen,
});

export const hideErrorNotification = (): NotificationAction => ({
  type: HIDE_ERROR_NOTIFICATION,
});

export const showBlockedNotification = (
  message: string
): NotificationAction => ({
  type: SHOW_BLOCKED_NOTIFICATION,
  message,
});

export const hideBlockedNotification = (): NotificationAction => ({
  type: HIDE_BLOCKED_NOTIFICATION,
});

export const showSevereWarningNotification = (
  message: string
): NotificationAction => ({
  type: SHOW_SEVERE_WARNING_NOTIFICATION,
  message,
});

export const hideSevereWarningNotification = (): NotificationAction => ({
  type: HIDE_SEVERE_WARNING_NOTIFICATION,
});

export const showSuccessNotification = (
  message: string
): NotificationAction => ({
  type: SHOW_SUCCESS_NOTIFICATION,
  message,
});

export const hideSuccessNotification = (): NotificationAction => ({
  type: HIDE_SUCCESS_NOTIFICATION,
});

export const showWarningNotification = (
  message: string
): NotificationAction => ({
  type: SHOW_WARNING_NOTIFICATION,
  message,
});

export const hideWarningNotification = (): NotificationAction => ({
  type: HIDE_WARNING_NOTIFICATION,
});

export const dismissNotifications = (): NotificationAction => ({
  type: DISMISS_NOTIFICATIONS,
});

export const setOpenedPanel = (name: string): NotificationAction => ({
  type: SET_OPENED_PANEL_NAME,
  openedPanel: name,
});

export const showUserConfirmationDialog = (
  title: string,
  userConfirmationBody: React.ReactChild,
  confirmCallback: () => void,
  cancelCallback: () => void = null
): NotificationAction => ({
  type: SHOW_USER_CONFIRMATION_DIALOG,
  title,
  userConfirmationBody,
  userConfirmationConfirmCallback: confirmCallback,
  userConfirmationCancelCallback: cancelCallback,
});

export const showDomainControllerConfirmationDialog = (
  callback: () => void
): NotificationAction => {
  return showUserConfirmationDialog(
    'Do you want to proceed?',
    'This will result in all current domain members in this domain being switched to Workgroup.',
    callback
  );
};

export const hideUserConfirmationDialog = (): NotificationAction => ({
  type: HIDE_USER_CONFIRMATION_DIALOG,
});

export const fetchUserNotificationsBegin = (): NotificationAction => ({
  type: FETCH_USER_NOTIFICATIONS_BEGIN,
});

export const fetchUserNotificationsSuccess = (
  payload: NotificationDto[]
): NotificationAction => ({
  type: FETCH_USER_NOTIFICATIONS_SUCCESS,
  payload,
});

export const fetchUserNotificationsError = (
  error: AxiosError | string
): NotificationAction => ({
  type: FETCH_USER_NOTIFICATIONS_FAILURE,
  payload: error,
});

export const fetchUserNotifications = (): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchUserNotificationsBegin());
    try {
      const res = await httpAuthService.get<NotificationDto[]>('notification');
      // Log success here
      dispatch(fetchUserNotificationsSuccess(res.data ?? []));
    } catch (err) {
      dispatch(fetchUserNotificationsError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to retrieve Notifications:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const updateAllUserNotificationsBegin = (): NotificationAction => ({
  type: UPDATE_ALL_USER_NOTIFICATIONS_BEGIN,
});

export const updateAllUserNotificationsSuccess = (): NotificationAction => ({
  type: UPDATE_ALL_USER_NOTIFICATIONS_SUCCESS,
});

export const updateAllUserNotificationsError = (
  error: AxiosError | string
): NotificationAction => ({
  type: UPDATE_ALL_USER_NOTIFICATIONS_FAILURE,
  payload: error,
});

export const updateAllUserNotifications = (
  notificationStatus: NotificationStatus
): ((dispatch: Dispatch, getState: () => MyWorkspacesStore) => void) => {
  return async (dispatch: Dispatch, getState: () => MyWorkspacesStore) => {
    const { notifications } = getState();
    const originalNotifications = notifications.userNotifications;
    dispatch(updateAllUserNotificationsBegin());
    if (notificationStatus === NotificationStatus.Dismissed) {
      dispatch(fetchUserNotificationsSuccess([]));
    } else {
      dispatch(
        fetchUserNotificationsSuccess(
          notifications.userNotifications.map((n) => {
            return {
              ...n,
              Status: notificationStatus,
            };
          })
        )
      );
    }
    dispatch(setPoliteScreenReaderAnnouncement('All notifications updated.'));
    try {
      await httpAuthService.put(`notification/updateall/${notificationStatus}`);

      // Log success here
      dispatch(updateAllUserNotificationsSuccess());
    } catch (err) {
      dispatch(updateAllUserNotificationsError(err));
      dispatch(fetchUserNotificationsSuccess(originalNotifications));
      ErrorAction(
        dispatch,
        err,
        `Failed to update all notifications:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const updateSubsetUserNotificationsBegin = (): NotificationAction => ({
  type: UPDATE_SUBSET_USER_NOTIFICATIONS_BEGIN,
});

export const updateSubsetAllUserNotificationsSuccess =
  (): NotificationAction => ({
    type: UPDATE_SUBSET_USER_NOTIFICATIONS_SUCCESS,
  });

export const updateSubsetUserNotificationsError = (
  error: AxiosError | string
): NotificationAction => ({
  type: UPDATE_SUBSET_USER_NOTIFICATIONS_FAILURE,
  payload: error,
});

export const updateSubsetUserNotifications = (
  notificationStatus: NotificationStatus,
  idsToUpdate: string[]
): ((dispatch: Dispatch, getState: () => MyWorkspacesStore) => void) => {
  return async (dispatch: Dispatch, getState: () => MyWorkspacesStore) => {
    const { notifications } = getState();
    const originalNotifications = notifications.userNotifications;
    dispatch(updateSubsetUserNotificationsBegin());
    if (notificationStatus === NotificationStatus.Dismissed) {
      dispatch(
        fetchUserNotificationsSuccess(
          notifications.userNotifications.filter(
            (n) => idsToUpdate.indexOf(n.ID) === -1
          )
        )
      );
    } else {
      dispatch(
        fetchUserNotificationsSuccess(
          notifications.userNotifications.map((n) => {
            if (idsToUpdate.indexOf(n.ID) !== -1) {
              return {
                ...n,
                Status: notificationStatus,
              };
            } else {
              return n;
            }
          })
        )
      );
    }
    dispatch(setPoliteScreenReaderAnnouncement('Notifications updated.'));
    try {
      await httpAuthService.put(
        `notification/updatesubset/${notificationStatus}`,
        idsToUpdate
      );

      // Log success here
      dispatch(updateSubsetAllUserNotificationsSuccess());
    } catch (err) {
      dispatch(updateSubsetUserNotificationsError(err));
      dispatch(fetchUserNotificationsSuccess(originalNotifications));
      ErrorAction(
        dispatch,
        err,
        `Failed to update notifications:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const changeUserNotificationStatusBegin = (): NotificationAction => ({
  type: CHANGE_USER_NOTIFICATION_STATUS_BEGIN,
});

export const changeUserNotificationStatusSuccess = (): NotificationAction => ({
  type: CHANGE_USER_NOTIFICATION_STATUS_SUCCESS,
});

export const changeUserNotificationStatusError = (
  error: AxiosError | string
): NotificationAction => ({
  type: CHANGE_USER_NOTIFICATION_STATUS_FAILURE,
  payload: error,
});

export const changeUserNotificationStatus = (
  notificationID: string,
  notificationStatus: NotificationStatus
): ((dispatch: Dispatch, getState: () => MyWorkspacesStore) => void) => {
  return async (dispatch: Dispatch, getState: () => MyWorkspacesStore) => {
    const { notifications } = getState();
    const originalNotification = notifications.userNotifications.find(
      (n) => n.ID === notificationID
    );
    if (
      !originalNotification ||
      originalNotification.Status === notificationStatus
    ) {
      return;
    }
    dispatch(changeUserNotificationStatusBegin());
    if (notificationStatus === NotificationStatus.Dismissed) {
      dispatch(
        fetchUserNotificationsSuccess(
          notifications.userNotifications.filter((n) => n.ID !== notificationID)
        )
      );
    }
    dispatch(
      setUserNotification({
        ...originalNotification,
        Status: notificationStatus,
      })
    );
    dispatch(
      setPoliteScreenReaderAnnouncement(
        `Notification status set to ${NotificationStatus[notificationStatus]}`
      )
    );
    try {
      await httpAuthService.put(
        `notification/${notificationID}/changestatus/${notificationStatus}`
      );

      // Log success here
      dispatch(changeUserNotificationStatusSuccess());
    } catch (err) {
      dispatch(changeUserNotificationStatusError(err));
      dispatch(setUserNotification(originalNotification));
      ErrorAction(
        dispatch,
        err,
        `Failed to change notification status:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const setUserNotification = (
  notification: NotificationDto
): NotificationAction => ({
  type: SET_USER_NOTIFICATION,
  payload: notification,
});

export const setAssertiveScreenReaderAnnouncement = createAction<
  string,
  ActionType
>(SET_ASSERTIVE_SCREEN_READER_ANNOUNCEMENT);

export const setPoliteScreenReaderAnnouncement = createAction<
  string,
  ActionType
>(SET_POLITE_SCREEN_READER_ANNOUNCEMENT);
