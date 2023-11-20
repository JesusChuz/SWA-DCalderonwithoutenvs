import { ResourceState } from './enums/ResourceState';

export interface AzureWorkspaceInsightsDto {
  WorkspaceID: string;
  WorkspaceName: string;
  AzureResourceGroupName: string;
  State: ResourceState;
  OwnerID: string;
  OwnerEmail: string;
  TemplateID?: string;
  SubscriptionID: string;
  DeploymentRegion: string;
  HubNetworkRegion: string;
  SegmentName: string;
  SegmentId?: string;
  LastJitActivationDateTime?: string;
  LastJitActivationAge?: number;
  WorkspaceAge?: number;
  CurrentAzureCost: number;
  DailyCost: number;
  LastCostSnapshotDateTime?: string;
  TotalVCPUsConsumed: number;
  TotalStandardBSFamilyVCPUsConsumed: number;
  TotalStandardDSv4FamilyVCPUsConsumed: number;
  CreatedOn?: string;
  WorkspaceOwnerExists: boolean;
  WorkspaceDeletionStatus: ResourceState;
  WorkspaceDeleteLockEnabled: boolean;
  LastUpdatedOn?: string;
}
