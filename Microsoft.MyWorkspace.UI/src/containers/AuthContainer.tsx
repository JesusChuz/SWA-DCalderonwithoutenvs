import * as React from 'react';
import {
  AuthenticatedTemplate,
  useIsAuthenticated,
  useMsal,
} from '@azure/msal-react';
import { signalRConnection } from '../services/signalRService';
import { HubConnectionState } from '@microsoft/signalr';
import { storeCurrentPath } from '../shared/StoredRoute';
import { application } from '../authentication/msal';
import { InteractionStatus } from '@azure/msal-browser';

interface IProps {
  children?: React.ReactNode;
}

export const AuthContainer = (props: IProps): JSX.Element => {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();

  React.useEffect(() => {
    if (
      isAuthenticated &&
      signalRConnection.state === HubConnectionState.Disconnected
    ) {
      signalRConnection.start();
    } else if (!isAuthenticated && inProgress === InteractionStatus.None) {
      storeCurrentPath().then(() => application.loginRedirect());
    }
  }, [isAuthenticated, inProgress]);

  return <AuthenticatedTemplate>{props.children}</AuthenticatedTemplate>;
};
