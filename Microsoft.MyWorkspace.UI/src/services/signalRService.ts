import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { acquireAccessToken } from '../authentication/msal';

const realSignalRConnection: HubConnection = new HubConnectionBuilder()
  .withUrl(`${process.env.REACT_APP_API_URL}/NotificationHubRoute`, {
    accessTokenFactory: () => {
      return acquireAccessToken();
    },
  })
  .withAutomaticReconnect()
  .build();

export class MockSignalRConnection {
  private callbacks: Map<string, ((optionalParam?: any) => null)[]>;
  public state = HubConnectionState.Connected;

  constructor() {
    this.callbacks = new Map<string, ((optionalParam?: any) => null)[]>();
  }

  on(message: string, callback: () => null) {
    const currentList = this.callbacks.get(message)
      ? this.callbacks.get(message)
      : [];
    const newList = [...currentList, callback];
    this.callbacks.set(message, newList);
  }

  start() {
    null;
  }

  triggerCallbacks(message: string, optionalParam?: any) {
    setTimeout(() => {
      const callbacksToTrigger = this.callbacks.get(message);
      if (callbacksToTrigger && callbacksToTrigger.length > 0) {
        for (let i = 0; i < callbacksToTrigger.length; i++) {
          callbacksToTrigger[i](optionalParam);
        }
      }
    }, 2000);
  }
}

export const signalRConnection =
  process.env.REACT_APP_RUN_MSW !== 'false'
    ? (new MockSignalRConnection() as unknown as HubConnection)
    : realSignalRConnection;
