export interface VMPatchSummary {
  VirtualMachineName: string;
  TimeGenerated: string;
  WorkspaceId: string;
  ResourceGroup: string;
  SubscriptionId: string;
  VirtualMachineId: string;
  WindowsUpdateSetting: string;
  RestartPending: boolean;
  SecurityUpdatesMissing: number;
  OtherUpdatesMissing: number;
  CriticalUpdatesMissing: number;
}
