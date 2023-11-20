import { AxiosError } from 'axios';
import cloneDeep from 'lodash/cloneDeep';
import { NotificationDto } from '../../types/Notification/NotificationDto.types';
import {
  SHOW_DEFAULT_NOTIFICATION,
  HIDE_DEFAULT_NOTIFICATION,
  SHOW_ERROR_NOTIFICATION,
  HIDE_ERROR_NOTIFICATION,
  SHOW_BLOCKED_NOTIFICATION,
  HIDE_BLOCKED_NOTIFICATION,
  SHOW_SEVERE_WARNING_NOTIFICATION,
  HIDE_SEVERE_WARNING_NOTIFICATION,
  SHOW_SUCCESS_NOTIFICATION,
  HIDE_SUCCESS_NOTIFICATION,
  SHOW_WARNING_NOTIFICATION,
  HIDE_WARNING_NOTIFICATION,
  SET_OPENED_PANEL_NAME,
  SHOW_USER_CONFIRMATION_DIALOG,
  HIDE_USER_CONFIRMATION_DIALOG,
  DISMISS_NOTIFICATIONS,
  FETCH_USER_NOTIFICATIONS_BEGIN,
  FETCH_USER_NOTIFICATIONS_FAILURE,
  FETCH_USER_NOTIFICATIONS_SUCCESS,
  UPDATE_ALL_USER_NOTIFICATIONS_BEGIN,
  UPDATE_ALL_USER_NOTIFICATIONS_FAILURE,
  UPDATE_ALL_USER_NOTIFICATIONS_SUCCESS,
  CHANGE_USER_NOTIFICATION_STATUS_BEGIN,
  SET_USER_NOTIFICATION,
  SET_ASSERTIVE_SCREEN_READER_ANNOUNCEMENT,
  SET_POLITE_SCREEN_READER_ANNOUNCEMENT,
} from '../actions/actionTypes';

import { NotificationAction } from '../actions/notificationActions';

export interface ReduxNotificationState {
  showDefault: boolean;
  defaultMessage: string;
  showError: boolean;
  errorMessage: string;
  showBlocked: boolean;
  blockedMessage: string;
  showSevereWarning: boolean;
  severeWarningMessage: string;
  showSuccess: boolean;
  successMessage: string;
  showWarning: boolean;
  warningMessage: string;
  linkText: string;
  openedPanel: string;
  panelToOpen: string;
  showUserConfirmationDialog: boolean;
  userConfirmationDialogConfirmCallback: () => void;
  userConfirmationDialogCancelCallback: () => void;
  userConfirmationDialogBody: React.ReactChild;
  userConfirmationDialogTitle: string;
  userNotifications: NotificationDto[];
  userNotificationsLoading: boolean;
  userNotificationError: AxiosError;
  updateAllUserNotificationsPending: boolean;
  updateAllUserNotificationsError: AxiosError;
  changeUserNotificationStatusPending: string;
  changeUserNotificationStatusError: AxiosError;
  screenReaderAnnouncement: {
    polite: string;
    assertive: string;
  };
}

export const notificationInitialState: ReduxNotificationState = {
  showDefault: false,
  defaultMessage: '',
  showError: false,
  errorMessage: '',
  showBlocked: false,
  blockedMessage: '',
  showSevereWarning: false,
  severeWarningMessage: '',
  showSuccess: false,
  successMessage: '',
  showWarning: false,
  warningMessage: '',
  showUserConfirmationDialog: false,
  userConfirmationDialogBody: '',
  userConfirmationDialogConfirmCallback: null,
  userConfirmationDialogCancelCallback: null,
  userConfirmationDialogTitle: '',
  linkText: '',
  openedPanel: '',
  panelToOpen: '',
  userNotifications: [],
  userNotificationsLoading: false,
  userNotificationError: null,
  updateAllUserNotificationsPending: false,
  updateAllUserNotificationsError: null,
  changeUserNotificationStatusPending: null,
  changeUserNotificationStatusError: null,
  screenReaderAnnouncement: {
    polite: '',
    assertive: '',
  },
};

export default function notificationReducer(
  state: ReduxNotificationState = notificationInitialState,
  action: NotificationAction
): ReduxNotificationState {
  switch (action.type) {
    case SHOW_DEFAULT_NOTIFICATION:
      return {
        ...state,
        showDefault: true,
        showError: false,
        showBlocked: false,
        showSevereWarning: false,
        showSuccess: false,
        showWarning: false,
        defaultMessage: action.message,
      };
    case HIDE_DEFAULT_NOTIFICATION:
      return {
        ...state,
        showDefault: false,
      };
    case SHOW_ERROR_NOTIFICATION:
      return {
        ...state,
        showDefault: false,
        showError: true,
        showBlocked: false,
        showSevereWarning: false,
        showSuccess: false,
        showWarning: false,
        errorMessage: action.message,
        linkText: action.linkText,
        openedPanel: action.openedPanel,
        panelToOpen: action.panelToOpen,
      };
    case HIDE_ERROR_NOTIFICATION:
      return {
        ...state,
        showError: false,
      };
    case SHOW_BLOCKED_NOTIFICATION:
      return {
        ...state,
        showDefault: false,
        showError: false,
        showBlocked: true,
        showSevereWarning: false,
        showSuccess: false,
        showWarning: false,
        blockedMessage: action.message,
      };
    case HIDE_BLOCKED_NOTIFICATION:
      return {
        ...state,
        showBlocked: false,
      };
    case SHOW_SEVERE_WARNING_NOTIFICATION:
      return {
        ...state,
        showDefault: false,
        showError: false,
        showBlocked: false,
        showSevereWarning: true,
        showSuccess: false,
        showWarning: false,
        severeWarningMessage: action.message,
      };
    case HIDE_SEVERE_WARNING_NOTIFICATION:
      return {
        ...state,
        showSevereWarning: false,
      };
    case SHOW_SUCCESS_NOTIFICATION:
      return {
        ...state,
        showDefault: false,
        showError: false,
        showBlocked: false,
        showSevereWarning: false,
        showSuccess: true,
        showWarning: false,
        successMessage: action.message,
      };
    case HIDE_SUCCESS_NOTIFICATION:
      return {
        ...state,
        showSuccess: false,
      };
    case SHOW_WARNING_NOTIFICATION:
      return {
        ...state,
        showDefault: false,
        showError: false,
        showBlocked: false,
        showSevereWarning: false,
        showSuccess: false,
        showWarning: true,
        warningMessage: action.message,
      };
    case HIDE_WARNING_NOTIFICATION:
      return {
        ...state,
        showWarning: false,
      };
    case SET_OPENED_PANEL_NAME:
      return {
        ...state,
        openedPanel: action.openedPanel,
      };
    case SHOW_USER_CONFIRMATION_DIALOG:
      return {
        ...state,
        userConfirmationDialogTitle: action.title,
        userConfirmationDialogBody: action.userConfirmationBody,
        userConfirmationDialogConfirmCallback:
          action.userConfirmationConfirmCallback,
        userConfirmationDialogCancelCallback:
          action.userConfirmationCancelCallback,
        showUserConfirmationDialog: true,
      };
    case HIDE_USER_CONFIRMATION_DIALOG:
      return {
        ...state,
        showUserConfirmationDialog: false,
      };
    case DISMISS_NOTIFICATIONS: {
      return {
        ...state,
        showDefault: false,
        defaultMessage: '',
        showError: false,
        errorMessage: '',
        showBlocked: false,
        blockedMessage: '',
        showSevereWarning: false,
        severeWarningMessage: '',
        showSuccess: false,
        successMessage: '',
        showWarning: false,
        warningMessage: '',
      };
    }
    case FETCH_USER_NOTIFICATIONS_BEGIN:
      return {
        ...state,
        userNotificationsLoading: true,
        userNotificationError: null,
      };
    case FETCH_USER_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        userNotificationsLoading: false,
        userNotificationError: action.payload as AxiosError,
      };
    case FETCH_USER_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        userNotificationsLoading: false,
        userNotifications: action.payload as NotificationDto[],
      };
    case UPDATE_ALL_USER_NOTIFICATIONS_BEGIN:
      return {
        ...state,
        updateAllUserNotificationsPending: true,
        updateAllUserNotificationsError: null,
      };
    case UPDATE_ALL_USER_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        updateAllUserNotificationsPending: false,
        updateAllUserNotificationsError: action.payload as AxiosError,
      };
    case UPDATE_ALL_USER_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        updateAllUserNotificationsPending: false,
      };
    case CHANGE_USER_NOTIFICATION_STATUS_BEGIN:
      return {
        ...state,
        changeUserNotificationStatusPending: action.payload as string,
        changeUserNotificationStatusError: null,
      };
    case SET_USER_NOTIFICATION:
      const newNotification = action.payload as NotificationDto;
      const notifications = cloneDeep(state.userNotifications);
      const originalNotification = notifications.find(
        (n) => n.ID === newNotification.ID
      );
      if (originalNotification) {
        originalNotification.Status = newNotification.Status;
      }

      return {
        ...state,
        userNotifications: notifications,
      };
    case SET_POLITE_SCREEN_READER_ANNOUNCEMENT:
      return {
        ...state,
        screenReaderAnnouncement: {
          ...state.screenReaderAnnouncement,
          polite: action.payload as string,
        },
      };
    case SET_ASSERTIVE_SCREEN_READER_ANNOUNCEMENT:
      return {
        ...state,
        screenReaderAnnouncement: {
          ...state.screenReaderAnnouncement,
          assertive: action.payload as string,
        },
      };
    default:
      return state;
  }
}
