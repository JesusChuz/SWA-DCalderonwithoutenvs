import { FirewallType } from './enums/FirewallType';

export interface SegmentConstraintDto {
  MaxAzureWorkspacesAllowed: number;
  MaxRunTimeAllowed: number;
  MaxPublicIPAddressesAllowed: number;
  MaxMachineMemoryAllowedCustom: number;
  MaxMachineStorageAllowedCustom: number;
  MaxCumulativeStorageAllowedCustom: number;
  MaxCumulativeMemoryAllowedCustom: number;
  MaxMachinesPerWorkspaceAllowedCustom: number;
  MaxSnapshotsPerWorkspace: number;
  MaxDataDisksPerVM: number;
  FirewallType: FirewallType;
  TopologyIds: string[];
  ContentFilter: string;
  WeeklyRuntimeExtensionHours: number;
  DisableAutoShutDown: boolean;
  MaxNestedWorkspacesAllowed: number;
  MaxHypervHostMachinesAllowedPerWorkspace: number;
  MaxMachineMemoryAllowedNested: number;
  MaxMachineStorageAllowedNested: number;
  EnableNestedDeployments: boolean;
  DisableCopyPaste: boolean;
  EnableAutoDeleteNonExistentUsers: boolean;
  EnableShareWithSegment: boolean;
  RestrictedDnsEndpoints: string[];
  StaleWorkspaceDeletionDays: number;
  EnableAutoStaleWorkspaceDeletion: boolean;
  MaxBulkDeleteWorkspacesThreshold: number;
  MaxOSDiskSizeAllowed: number;
  AllowTemplateCreation: boolean;
  EnablePatchInfoForVM: boolean;
  EnableWorkspaceScheduledStart: boolean;
  CancelScheduledStartAfterInactivityInDays: number;
}
