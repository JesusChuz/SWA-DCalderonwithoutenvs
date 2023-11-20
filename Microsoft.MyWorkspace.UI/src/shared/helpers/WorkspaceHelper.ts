import { AzureDomainDto } from '../../types/AzureWorkspace/AzureDomainDto.types';
import { AzureWorkspaceDto } from '../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { ResourceState } from '../../types/AzureWorkspace/enums/ResourceState';
import { MachinesUnion } from '../../types/AzureWorkspace/MachinesUnion.types';
import { UserProfileDto } from '../../types/Catalog/UserProfileDto.types';
import { VirtualMachineSkuDto } from '../../types/Catalog/VirtualMachineSkuDto.types';
import { VirtualMachineTemplateDto } from '../../types/Catalog/VirtualMachineTemplateDto.types';
import dayjs from 'dayjs';
import { SegmentConstraintDto } from '../../types/AuthService/SegmentConstraintDto.types';
import { VMPatchSummary } from '../../types/AzureWorkspace/VMPatchSummaryDto.types';

type Resource = { State: ResourceState };

export const EditsDisabled = (
  user: UserProfileDto,
  ws: AzureWorkspaceDto,
  originalWs: AzureWorkspaceDto,
  enableOnFailure = false,
  allowSharedOwnerEdits = false
): boolean => {
  return (
    (!allowSharedOwnerEdits && CheckSharedOwner(user, originalWs)) ||
    ws.State === ResourceState.Deploying ||
    ws.State === ResourceState.Unknown ||
    ws.State === ResourceState.NotDeployed ||
    ws.State === ResourceState.Transitioning ||
    ws.State === ResourceState.Waiting ||
    (ws.State === ResourceState.Failed && !enableOnFailure)
  );
};

export const CheckSharedOwner = (
  user: UserProfileDto,
  ws: AzureWorkspaceDto
): boolean => {
  if (!ws.SharedOwnerIDs || ws.SharedOwnerIDs.length === 0) {
    return false;
  }

  return ws.SharedOwnerIDs.findIndex((id) => id === user.ID) !== -1;
};

export const DeleteDisabled = (
  user: UserProfileDto,
  ws: AzureWorkspaceDto,
  originalWorkspace: AzureWorkspaceDto
): boolean => {
  return (
    ws.SecurityLock ||
    ws.State === ResourceState.Deploying ||
    ws.State === ResourceState.Transitioning ||
    ws.State === ResourceState.NotDeployed ||
    ws.State === ResourceState.Waiting ||
    CheckSharedOwner(user, originalWorkspace)
  );
};

export const StartDisabled = (resource: Resource): boolean => {
  return IsOn(resource) || IsTransitioning(resource);
};

export const StopDisabled = (resource: Resource): boolean => {
  return IsOff(resource) || IsTransitioning(resource);
};

export const IsOff = (resource: Resource): boolean => {
  return resource.State === ResourceState.Off;
};

export const IsOn = (resource: Resource): boolean => {
  return (
    resource.State === ResourceState.Running ||
    resource.State === ResourceState.PartiallyRunning
  );
};

export const IsTransitioning = (resource: Resource): boolean => {
  return IsTransitioningState(resource.State);
};

export const IsTransitioningState = (state: ResourceState): boolean => {
  return (
    state === ResourceState.Deploying ||
    state === ResourceState.Transitioning ||
    state === ResourceState.Waiting
  );
};

export const IsFailed = (resource: Resource): boolean => {
  return resource.State === ResourceState.Failed;
};

export const FindVirtualMachineSku = (
  skus: VirtualMachineSkuDto[],
  machine: MachinesUnion | VirtualMachineTemplateDto
): VirtualMachineSkuDto => {
  return skus.find((sku) => sku.Memory === machine.MemoryGB * 1024) || null;
};

export const FindVirtualMachineDomain = (
  domains: AzureDomainDto[],
  machine: MachinesUnion
): AzureDomainDto => {
  return domains.find((domain) => domain.ID === machine.DomainID) || null;
};

export const IsWorkspaceNested = (machines: {
  VirtualMachines: MachinesUnion[];
}): boolean => {
  return machines.VirtualMachines.some((vm) => vm.IsNested);
};

export const GetDaysSinceLastJitActivation = (
  ws: AzureWorkspaceDto
): number => {
  return dayjs().diff(
    dayjs(ws.LastJitActivationDateTime ?? ws.Created),
    'days',
    true
  );
};

export const GetDaysUntilStaleWorkspaceDeletion = (
  ws: AzureWorkspaceDto,
  constraint: SegmentConstraintDto,
  round = false
): number => {
  if (
    !constraint?.EnableAutoStaleWorkspaceDeletion ||
    constraint?.StaleWorkspaceDeletionDays === undefined ||
    constraint?.StaleWorkspaceDeletionDays === null ||
    ws.SecurityLock
  ) {
    return undefined;
  }
  const days =
    constraint.StaleWorkspaceDeletionDays - GetDaysSinceLastJitActivation(ws);
  return round ? Math.round(days) : Math.floor(days);
};

export const ShouldDisplayStaleWorkspaceWarning = (
  ws: AzureWorkspaceDto,
  constraint: SegmentConstraintDto,
  warningThresholdInDays: number
): boolean => {
  const daysUntilStaleWorkspaceDeletion = GetDaysUntilStaleWorkspaceDeletion(
    ws,
    constraint
  );
  if (
    daysUntilStaleWorkspaceDeletion === undefined ||
    warningThresholdInDays === undefined
  ) {
    return false;
  }
  return daysUntilStaleWorkspaceDeletion < warningThresholdInDays;
};

export const HasCriticalUpdatesPending = (
  ws: AzureWorkspaceDto,
  allWorkspacesPatchingSummary: VMPatchSummary[]
): boolean => {
  let hasCriticalUpdatesPending = false;
  if (
    allWorkspacesPatchingSummary &&
    Array.isArray(allWorkspacesPatchingSummary)
  ) {
    allWorkspacesPatchingSummary.forEach((patchSummary) => {
      if (
        patchSummary.WorkspaceId === ws.ID &&
        patchSummary.CriticalUpdatesMissing > 0
      ) {
        hasCriticalUpdatesPending = true;
      }
    });
  }
  return hasCriticalUpdatesPending;
};

export const HasSecurityUpdatesPending = (
  ws: AzureWorkspaceDto,
  allWorkspacesPatchingSummary: VMPatchSummary[]
): boolean => {
  let hasSecurityUpdatesPending = false;
  if (
    allWorkspacesPatchingSummary &&
    Array.isArray(allWorkspacesPatchingSummary)
  ) {
    allWorkspacesPatchingSummary.forEach((patchSummary) => {
      if (
        patchSummary.WorkspaceId === ws.ID &&
        patchSummary.SecurityUpdatesMissing > 0
      ) {
        hasSecurityUpdatesPending = true;
      }
    });
  }
  return hasSecurityUpdatesPending;
};

export const HasOtherUpdatesPending = (
  ws: AzureWorkspaceDto,
  allWorkspacesPatchingSummary: VMPatchSummary[]
): boolean => {
  let hasOtherUpdatesPending = false;
  if (
    allWorkspacesPatchingSummary &&
    Array.isArray(allWorkspacesPatchingSummary)
  ) {
    allWorkspacesPatchingSummary.forEach((patchSummary) => {
      if (
        patchSummary.WorkspaceId === ws.ID &&
        patchSummary.OtherUpdatesMissing > 0
      ) {
        hasOtherUpdatesPending = true;
      }
    });
  }
  return hasOtherUpdatesPending;
};

export function convertResourceStateStringToEnums(
  value: string
): ResourceState {
  if (typeof value === 'string') {
    switch (value) {
      case 'NotDeployed':
        return ResourceState.NotDeployed;
      case 'Waiting':
        return ResourceState.Waiting;
      case 'Deploying':
        return ResourceState.Deploying;
      case 'Running':
        return ResourceState.Running;
      case 'PartiallyRunning':
        return ResourceState.PartiallyRunning;
      case 'Transitioning':
        return ResourceState.Transitioning;
      case 'Off':
        return ResourceState.Off;
      case 'Failed':
        return ResourceState.Failed;
      case 'Deleting':
        return ResourceState.Deleting;
      default:
        return ResourceState.Unknown;
    }
  }
  return value;
}

export function convertResourceStateEnumToStringEnum(
  value: ResourceState
): string {
  switch (value) {
    case ResourceState.NotDeployed:
      return 'NotDeployed';
    case ResourceState.Waiting:
      return 'Waiting';
    case ResourceState.Deploying:
      return 'Deploying';
    case ResourceState.Running:
      return 'Running';
    case ResourceState.PartiallyRunning:
      return 'PartiallyRunning';
    case ResourceState.Transitioning:
      return 'Transitioning';
    case ResourceState.Off:
      return 'Off';
    case ResourceState.Failed:
      return 'Failed';
    case ResourceState.Deleting:
      return 'Deleting';
    default:
      return 'Unknown';
  }
}
