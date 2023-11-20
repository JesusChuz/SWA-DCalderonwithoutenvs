import {
  DISMISS_NOTIFICATIONS,
  HIDE_BLOCKED_NOTIFICATION,
  HIDE_DEFAULT_NOTIFICATION,
  HIDE_ERROR_NOTIFICATION,
  HIDE_SEVERE_WARNING_NOTIFICATION,
  HIDE_SUCCESS_NOTIFICATION,
  HIDE_USER_CONFIRMATION_DIALOG,
  HIDE_WARNING_NOTIFICATION,
  SET_OPENED_PANEL_NAME,
  SHOW_BLOCKED_NOTIFICATION,
  SHOW_DEFAULT_NOTIFICATION,
  SHOW_ERROR_NOTIFICATION,
  SHOW_SEVERE_WARNING_NOTIFICATION,
  SHOW_SUCCESS_NOTIFICATION,
  SHOW_USER_CONFIRMATION_DIALOG,
  SHOW_WARNING_NOTIFICATION,
} from '../../../store/actions/actionTypes';
import { NotificationAction } from '../../../store/actions/notificationActions';
import notificationReducer, {
  notificationInitialState,
} from '../../../store/reducers/notificationReducer';

const initialState = notificationInitialState;

describe('Notification Reducer Tests', () => {
  test('Action with SHOW_DEFAULT_NOTIFICATION type returns correct state', () => {
    const message = 'This is a default notification.';
    const startState = {
      ...initialState,
      showError: true,
      showBlocked: true,
      showSevereWarning: true,
      showSuccess: true,
      showWarning: true,
    };
    const action: NotificationAction = {
      type: SHOW_DEFAULT_NOTIFICATION,
      message,
    };
    const newState = notificationReducer(startState, action);
    expect(newState.showDefault).toBe(true);
    expect(newState.defaultMessage).toBe(message);
    expect(newState.showError).toBe(false);
    expect(newState.showBlocked).toBe(false);
    expect(newState.showSevereWarning).toBe(false);
    expect(newState.showSuccess).toBe(false);
    expect(newState.showWarning).toBe(false);
  });
  test('Action with HIDE_DEFAULT_NOTIFICATION type returns correct state', () => {
    const action: NotificationAction = {
      type: HIDE_DEFAULT_NOTIFICATION,
    };
    const newState = notificationReducer(
      { ...initialState, showDefault: true },
      action
    );
    expect(newState.showDefault).toBeFalsy();
  });
  test('Action with SHOW_ERROR_NOTIFICATION type returns correct state', () => {
    const message = 'This is an error notification.';
    const startState = {
      ...initialState,
      showDefault: true,
      showBlocked: true,
      showSevereWarning: true,
      showSuccess: true,
      showWarning: true,
    };
    const action: NotificationAction = {
      type: SHOW_ERROR_NOTIFICATION,
      message,
    };
    const newState = notificationReducer(startState, action);
    expect(newState.showError).toBe(true);
    expect(newState.errorMessage).toBe(message);
    expect(newState.showDefault).toBe(false);
    expect(newState.showBlocked).toBe(false);
    expect(newState.showSevereWarning).toBe(false);
    expect(newState.showSuccess).toBe(false);
    expect(newState.showWarning).toBe(false);
  });
  test('Action with HIDE_ERROR_NOTIFICATION type returns correct state', () => {
    const action: NotificationAction = {
      type: HIDE_ERROR_NOTIFICATION,
    };
    const newState = notificationReducer(
      { ...initialState, showError: true },
      action
    );
    expect(newState.showError).toBeFalsy();
  });
  test('Action with SHOW_BLOCKED_NOTIFICATION type returns correct state', () => {
    const message = 'This is a blocked notification.';
    const startState = {
      ...initialState,
      showDefault: true,
      showError: true,
      showSevereWarning: true,
      showSuccess: true,
      showWarning: true,
    };
    const action: NotificationAction = {
      type: SHOW_BLOCKED_NOTIFICATION,
      message,
    };
    const newState = notificationReducer(startState, action);
    expect(newState.showBlocked).toBe(true);
    expect(newState.blockedMessage).toBe(message);
    expect(newState.showDefault).toBe(false);
    expect(newState.showError).toBe(false);
    expect(newState.showSevereWarning).toBe(false);
    expect(newState.showSuccess).toBe(false);
    expect(newState.showWarning).toBe(false);
  });
  test('Action with HIDE_BLOCKED_NOTIFICATION type returns correct state', () => {
    const action: NotificationAction = {
      type: HIDE_BLOCKED_NOTIFICATION,
    };
    const newState = notificationReducer(
      { ...initialState, showBlocked: true },
      action
    );
    expect(newState.showBlocked).toBeFalsy();
  });
  test('Action with SHOW_SEVERE_WARNING_NOTIFICATION type returns correct state', () => {
    const message = 'This is a severe warning notification.';
    const startState = {
      ...initialState,
      showDefault: true,
      showError: true,
      showBlocked: true,
      showSuccess: true,
      showWarning: true,
    };
    const action: NotificationAction = {
      type: SHOW_SEVERE_WARNING_NOTIFICATION,
      message,
    };
    const newState = notificationReducer(startState, action);
    expect(newState.showSevereWarning).toBe(true);
    expect(newState.severeWarningMessage).toBe(message);
    expect(newState.showDefault).toBe(false);
    expect(newState.showError).toBe(false);
    expect(newState.showBlocked).toBe(false);
    expect(newState.showSuccess).toBe(false);
    expect(newState.showWarning).toBe(false);
  });
  test('Action with HIDE_SEVERE_WARNING_NOTIFICATION type returns correct state', () => {
    const action: NotificationAction = {
      type: HIDE_SEVERE_WARNING_NOTIFICATION,
    };
    const newState = notificationReducer(
      { ...initialState, showSevereWarning: true },
      action
    );
    expect(newState.showSevereWarning).toBeFalsy();
  });
  test('Action with SHOW_SUCCESS_NOTIFICATION type returns correct state', () => {
    const message = 'This is a success notification.';
    const startState = {
      ...initialState,
      showDefault: true,
      showError: true,
      showBlocked: true,
      showSevereWarning: true,
      showWarning: true,
    };
    const action: NotificationAction = {
      type: SHOW_SUCCESS_NOTIFICATION,
      message,
    };
    const newState = notificationReducer(startState, action);
    expect(newState.showSuccess).toBe(true);
    expect(newState.successMessage).toBe(message);
    expect(newState.showDefault).toBe(false);
    expect(newState.showError).toBe(false);
    expect(newState.showBlocked).toBe(false);
    expect(newState.showSevereWarning).toBe(false);
    expect(newState.showWarning).toBe(false);
  });
  test('Action with HIDE_SUCCESS_NOTIFICATION type returns correct state', () => {
    const action: NotificationAction = {
      type: HIDE_SUCCESS_NOTIFICATION,
    };
    const newState = notificationReducer(
      { ...initialState, showSuccess: true },
      action
    );
    expect(newState.showSuccess).toBeFalsy();
  });
  test('Action with SHOW_WARNING_NOTIFICATION type returns correct state', () => {
    const message = 'This is a warning notification.';
    const startState = {
      ...initialState,
      showDefault: true,
      showError: true,
      showBlocked: true,
      showSevereWarning: true,
      showSuccess: true,
    };
    const action: NotificationAction = {
      type: SHOW_WARNING_NOTIFICATION,
      message,
    };
    const newState = notificationReducer(startState, action);
    expect(newState.showWarning).toBe(true);
    expect(newState.warningMessage).toBe(message);
    expect(newState.showDefault).toBe(false);
    expect(newState.showError).toBe(false);
    expect(newState.showBlocked).toBe(false);
    expect(newState.showSevereWarning).toBe(false);
    expect(newState.showSuccess).toBe(false);
  });
  test('Action with HIDE_WARNING_NOTIFICATION type returns correct state', () => {
    const action: NotificationAction = {
      type: HIDE_WARNING_NOTIFICATION,
    };
    const newState = notificationReducer(
      { ...initialState, showWarning: true },
      action
    );
    expect(newState.showWarning).toBeFalsy();
  });
  test('Action with SET_OPENED_PANEL_NAME type returns correct state', () => {
    const openedPanel = 'about';
    const action: NotificationAction = {
      type: SET_OPENED_PANEL_NAME,
      openedPanel,
    };
    const newState = notificationReducer(initialState, action);
    expect(newState.openedPanel).toBe(openedPanel);
  });
  test('Action with SHOW_USER_CONFIRMATION_DIALOG type returns correct state', () => {
    const title = 'Test title';
    const userConfirmationBody = 'Test Message';
    const userConfirmationConfirmCallback = jest.fn();
    const userConfirmationCancelCallback = jest.fn();
    const action: NotificationAction = {
      type: SHOW_USER_CONFIRMATION_DIALOG,
      title,
      userConfirmationBody,
      userConfirmationConfirmCallback,
      userConfirmationCancelCallback,
    };
    const newState = notificationReducer(initialState, action);
    expect(newState.userConfirmationDialogTitle).toBe(title);
    expect(newState.userConfirmationDialogBody).toBe(userConfirmationBody);
    expect(newState.userConfirmationDialogConfirmCallback).toBe(
      userConfirmationConfirmCallback
    );
    expect(newState.userConfirmationDialogCancelCallback).toBe(
      userConfirmationCancelCallback
    );
  });
  test('Action with HIDE_USER_CONFIRMATION_DIALOG type returns correct state', () => {
    const action: NotificationAction = {
      type: HIDE_USER_CONFIRMATION_DIALOG,
    };
    const newState = notificationReducer(
      { ...initialState, showUserConfirmationDialog: true },
      action
    );
    expect(newState.showUserConfirmationDialog).toBe(false);
  });
  test('Action with DISMISS_NOTIFICATIONS type returns correct state', () => {
    const startState = {
      ...initialState,
      showDefault: true,
      showError: true,
      showBlocked: true,
      showSevereWarning: true,
      showSuccess: true,
      showWarning: true,
      defaultMessage: 'This is a default notification.',
      errorMessage: 'This is an error notification.',
      blockedMessage: 'This is a blocked notification.',
      severeWarningMessage: 'This is a severe warning notification.',
      successMessage: 'This is a success notification.',
      warningMessage: 'This is a warning notification.',
    };
    const action: NotificationAction = {
      type: DISMISS_NOTIFICATIONS,
    };
    const newState = notificationReducer(startState, action);
    expect(newState.showWarning).toBe(false);
    expect(newState.warningMessage).toBe('');
    expect(newState.showDefault).toBe(false);
    expect(newState.defaultMessage).toBe('');
    expect(newState.showError).toBe(false);
    expect(newState.errorMessage).toBe('');
    expect(newState.showBlocked).toBe(false);
    expect(newState.blockedMessage).toBe('');
    expect(newState.showSevereWarning).toBe(false);
    expect(newState.severeWarningMessage).toBe('');
    expect(newState.showSuccess).toBe(false);
    expect(newState.successMessage).toBe('');
  });
  test('Default case returns initial state', () => {
    const action: NotificationAction = {
      type: null,
    };
    const newState = notificationReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
});
