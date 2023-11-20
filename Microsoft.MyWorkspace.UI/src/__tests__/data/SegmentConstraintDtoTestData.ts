import { FirewallType } from 'src/types/AuthService/enums/FirewallType';
import { SegmentConstraintDto } from '../../types/AuthService/SegmentConstraintDto.types';

export const SegmentConstraintDtoTestData: SegmentConstraintDto = {
  MaxAzureWorkspacesAllowed: 0,
  MaxRunTimeAllowed: 0,
  MaxPublicIPAddressesAllowed: 0,
  MaxMachineMemoryAllowedCustom: 0,
  MaxMachineStorageAllowedCustom: 0,
  MaxCumulativeStorageAllowedCustom: 0,
  MaxCumulativeMemoryAllowedCustom: 0,
  MaxMachinesPerWorkspaceAllowedCustom: 0,
  MaxSnapshotsPerWorkspace: 1,
  MaxDataDisksPerVM: 0,
  FirewallType: FirewallType.PaloAlto,
  TopologyIds: [],
  ContentFilter: '',
  WeeklyRuntimeExtensionHours: 0,
  DisableAutoShutDown: false,
  MaxNestedWorkspacesAllowed: 0,
  MaxHypervHostMachinesAllowedPerWorkspace: 0,
  MaxMachineMemoryAllowedNested: 0,
  MaxMachineStorageAllowedNested: 0,
  EnableNestedDeployments: false,
  DisableCopyPaste: false,
  EnableAutoDeleteNonExistentUsers: false,
  EnableShareWithSegment: false,
  RestrictedDnsEndpoints: [],
  StaleWorkspaceDeletionDays: 10,
  EnableAutoStaleWorkspaceDeletion: false,
  MaxBulkDeleteWorkspacesThreshold: 100,
  MaxOSDiskSizeAllowed: 128,
  AllowTemplateCreation: false,
  EnablePatchInfoForVM: false,
  EnableWorkspaceScheduledStart: true,
  CancelScheduledStartAfterInactivityInDays: 0,
};

export const getTestSegmentConstraintDto = (
  properties: Partial<SegmentConstraintDto> = {},
  constraintValues = 0
): SegmentConstraintDto => {
  const segmentConstraint: SegmentConstraintDto = {
    ...SegmentConstraintDtoTestData,
    ...properties,
  };
  if (constraintValues !== 0) {
    segmentConstraint.MaxAzureWorkspacesAllowed = constraintValues;
    segmentConstraint.MaxRunTimeAllowed = constraintValues;
    segmentConstraint.MaxPublicIPAddressesAllowed = constraintValues;
    segmentConstraint.MaxMachineMemoryAllowedCustom = constraintValues;
    segmentConstraint.MaxMachineStorageAllowedCustom = constraintValues;
    segmentConstraint.MaxCumulativeStorageAllowedCustom = constraintValues;
    segmentConstraint.MaxCumulativeMemoryAllowedCustom = constraintValues;
    segmentConstraint.MaxMachinesPerWorkspaceAllowedCustom = constraintValues;
    segmentConstraint.MaxSnapshotsPerWorkspace = constraintValues;
    segmentConstraint.MaxDataDisksPerVM = constraintValues;
    segmentConstraint.WeeklyRuntimeExtensionHours = constraintValues;
    segmentConstraint.MaxNestedWorkspacesAllowed = constraintValues;
    segmentConstraint.MaxHypervHostMachinesAllowedPerWorkspace =
      constraintValues;
    segmentConstraint.MaxMachineMemoryAllowedNested = constraintValues;
    segmentConstraint.MaxMachineStorageAllowedNested = constraintValues;
  }
  return segmentConstraint;
};
