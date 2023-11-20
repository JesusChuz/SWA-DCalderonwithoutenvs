export * from './catalogActions';
export * from './authServiceActions';
export * from './azureWorkspaceActions';
export * from './notificationActions';
export * from './configActions';
export * from './editableWorkspaceActions';
export * from './firewallActions';
export * from './adminFirewallActions';
export * from './scheduleActions';
export * from './adminTaskTreeActions';
export * from './adminTemplateActions';
export * from './adminDiagnosticActions';

import * as ActionTypes from '.';

export type ActionType = keyof typeof ActionTypes;

export interface Action {
  type: keyof typeof ActionTypes;
}
