import { ReduxNotificationState } from '../reducers/notificationReducer';
import { createSelector } from 'reselect';
import { MyWorkspacesStore } from '../reducers/rootReducer';
import { NotificationStatus } from '../../types/enums/NotificationStatus';

const notifications = (state: MyWorkspacesStore): ReduxNotificationState =>
  state.notifications;

export const getDefaultNotificationState = createSelector(
  notifications,
  (notifications: ReduxNotificationState) => {
    return {
      show: notifications.showDefault,
      message: notifications.defaultMessage,
    };
  }
);

export const getErrorNotificationState = createSelector(
  notifications,
  (notifications: ReduxNotificationState) => {
    return {
      show: notifications.showError,
      message: notifications.errorMessage,
      linkText: notifications.linkText,
      panelToOpen: notifications.panelToOpen,
    };
  }
);

export const getBlockedNotificationState = createSelector(
  notifications,
  (notifications: ReduxNotificationState) => {
    return {
      show: notifications.showBlocked,
      message: notifications.blockedMessage,
    };
  }
);

export const getSevereNotificationState = createSelector(
  notifications,
  (notifications: ReduxNotificationState) => {
    return {
      show: notifications.showSevereWarning,
      message: notifications.severeWarningMessage,
    };
  }
);

export const getSuccessNotificationState = createSelector(
  notifications,
  (notifications: ReduxNotificationState) => {
    return {
      show: notifications.showSuccess,
      message: notifications.successMessage,
    };
  }
);

export const getWarningNotificationState = createSelector(
  notifications,
  (notifications: ReduxNotificationState) => {
    return {
      show: notifications.showWarning,
      message: notifications.warningMessage,
    };
  }
);

export const getOpenedPanel = createSelector(
  notifications,
  (notifications: ReduxNotificationState) => {
    return notifications.openedPanel;
  }
);

export const getUserConfirmationDialogState = createSelector(
  notifications,
  (notifications: ReduxNotificationState) => {
    return {
      show: notifications.showUserConfirmationDialog,
      message: notifications.userConfirmationDialogBody,
      title: notifications.userConfirmationDialogTitle,
      confirmCallback: notifications.userConfirmationDialogConfirmCallback,
      cancelCallback: notifications.userConfirmationDialogCancelCallback,
    };
  }
);

export const getUserNotifications = createSelector(
  notifications,
  (notifications: ReduxNotificationState) => {
    return notifications.userNotifications;
  }
);

export const getUserNotificationsLoading = createSelector(
  notifications,
  (notifications: ReduxNotificationState) => {
    return notifications.userNotificationsLoading;
  }
);

export const getUnreadUserNotificationCount = createSelector(
  notifications,
  (notifications: ReduxNotificationState) => {
    return notifications.userNotifications.filter(
      (n) => n.Status === NotificationStatus.Unread
    ).length;
  }
);

export const getSelectedMachinesScreenReaderAnnouncement = createSelector(
  notifications,
  (notifications: ReduxNotificationState) => {
    return notifications.screenReaderAnnouncement;
  }
);
