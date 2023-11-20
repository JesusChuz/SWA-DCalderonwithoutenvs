import { AxiosError } from 'axios';
import { Dispatch } from '@reduxjs/toolkit';

import { telemetryContext } from '../../applicationInsights/TelemetryService';
import { showErrorNotification } from './notificationActions';

export default function ErrorAction(
  dispatch: Dispatch,
  error: AxiosError,
  errorText: string,
  showCorrelationID: boolean,
  show403?: boolean
): void {
  const correlationMesssage =
    showCorrelationID &&
    error.response?.headers['x-correlation-id'] !== undefined
      ? `<br><br>Please use the Correlation ID ${error.response?.headers['x-correlation-id']} when you create a ticket at <a href="https://aka.ms/mywshelp" target=_blank>MyWorkspace Support.<a/>`
      : '';
  telemetryContext.logException(error);
  error.response &&
    (error.response.status !== 403 || show403) &&
    dispatch(showErrorNotification(errorText + ' ' + correlationMesssage));
  console.error(error);
}
