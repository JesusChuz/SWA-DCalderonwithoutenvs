import { Announced } from '@fluentui/react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  hideDefaultNotification,
  hideErrorNotification,
  hideBlockedNotification,
  hideSevereWarningNotification,
  hideSuccessNotification,
  hideWarningNotification,
} from '../../../store/actions';
import {
  getDefaultNotificationState,
  getErrorNotificationState,
  getBlockedNotificationState,
  getSevereNotificationState,
  getSuccessNotificationState,
  getWarningNotificationState,
} from '../../../store/selectors';
import { Notification } from './Notification';

export const NotificationContainer = (): JSX.Element => {
  const dispatch = useDispatch();
  const defaultMessageState = useSelector(getDefaultNotificationState);
  const errorMessageState = useSelector(getErrorNotificationState);
  const blockedMessageState = useSelector(getBlockedNotificationState);
  const severeWarningMessageState = useSelector(getSevereNotificationState);
  const successMessageState = useSelector(getSuccessNotificationState);
  const warningMessageState = useSelector(getWarningNotificationState);

  return (
    <>
      <div role='status'>
        {defaultMessageState.show && (
          <Notification
            messageText={defaultMessageState.message}
            messageVariant='default'
            role='none'
            onClose={() => {
              dispatch(hideDefaultNotification());
            }}
          />
        )}
      </div>
      {errorMessageState.show && (
        <Notification
          messageText={errorMessageState.message}
          linkText={errorMessageState.linkText}
          panelToOpen={errorMessageState.panelToOpen}
          messageVariant='error'
          onClose={() => {
            dispatch(hideErrorNotification());
          }}
        />
      )}
      {blockedMessageState.show && (
        <Notification
          messageText={blockedMessageState.message}
          messageVariant='blocked'
          onClose={() => {
            dispatch(hideBlockedNotification());
          }}
        />
      )}
      {severeWarningMessageState.show && (
        <Notification
          messageText={severeWarningMessageState.message}
          messageVariant='severeWarning'
          onClose={() => {
            dispatch(hideSevereWarningNotification());
          }}
        />
      )}
      <div role='status'>
        {successMessageState.show && (
          <Notification
            messageText={successMessageState.message}
            messageVariant='success'
            role='none'
            onClose={() => {
              dispatch(hideSuccessNotification());
            }}
          />
        )}
      </div>
      <div role='status'>
        {warningMessageState.show && (
          <Notification
            messageText={warningMessageState.message}
            messageVariant='warning'
            role='none'
            onClose={() => {
              dispatch(hideWarningNotification());
            }}
          />
        )}
      </div>
    </>
  );
};
