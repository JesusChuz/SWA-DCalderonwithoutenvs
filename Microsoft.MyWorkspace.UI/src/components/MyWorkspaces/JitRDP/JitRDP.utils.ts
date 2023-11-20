import { IContextualMenuItem } from '@fluentui/react';
import { getFormattedHoursAndMinutesRemaining } from '../../../shared/DateTimeHelpers';
import { AzureWorkspaceDto } from '../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { ResourceState } from '../../../types/AzureWorkspace/enums/ResourceState';
import { NatRuleJitEntryDto } from '../../../types/AzureWorkspace/NatRuleJitEntryDto.types';
import { SyncStatus } from '../../../types/enums/SyncStatus';
import { JitAddressDto } from '../../../types/FirewallManager/JitAddressDto';
import { RemainingTime } from '../../../types/RemainingTime.types';
import { IsTransitioning } from '../../../shared/helpers/WorkspaceHelper';

export interface JitProps {
  open: boolean;
  workspaceID: string;
  highlightID?: string;
}

export interface JitMessages {
  addressMismatchMessage: string;
  activeAddressMessage: string;
  expiredAddressMessage: string;
  corpNetAndAvdAccessible: string;
  defaultMessage: string;
}

export const JIT_ADDRESS_MESSAGES: JitMessages = {
  addressMismatchMessage:
    'Looks like JIT is already active from another address or location. If you have changed locations, please reactivate JIT.',
  activeAddressMessage: 'Just in Time access active.',
  expiredAddressMessage: 'Just in Time expired.',
  corpNetAndAvdAccessible:
    'When JIT is active, access to workspace resources is enabled from CorpNet, AVD and the current address or location.',
  defaultMessage: 'Just in Time access.',
};

export const getJitStatusText = (
  jit: JitAddressDto | NatRuleJitEntryDto,
  detailed = false
): string => {
  if (!jit) {
    return 'Not Active';
  }
  const status = jit.Status;
  switch (status) {
    case SyncStatus.CreatePending:
      return detailed ? 'Activation Pending' : 'Activating';
    case SyncStatus.Creating:
      return 'Activating';
    case SyncStatus.Failed:
      return 'Failed';
    case SyncStatus.Active:
      return 'Active';
    case SyncStatus.DeletePending:
      return detailed ? 'Deactivation Pending' : 'Deactivating';
    case SyncStatus.Deleting:
      return 'Deactivating';
    default:
      return 'Not Active';
  }
};

export const getJitAddress = (
  jitAddresses: JitAddressDto[],
  workspace: AzureWorkspaceDto
): JitAddressDto => {
  if (!workspace) {
    return null;
  }
  return jitAddresses.find((a) => a.WorkspaceID === workspace.ID) || null;
};

export const isJitAddressExpired = (jitAddress: JitAddressDto): boolean => {
  if (!jitAddress.Expiration) {
    return false;
  }
  const expirationTime = new Date(jitAddress.Expiration);
  return new Date() > expirationTime;
};

export const getJitRemainingTime = (
  jitAddress: JitAddressDto
): RemainingTime => {
  if (!jitAddress) {
    return {
      longFormattedString: 'Invalid JIT Address',
      shortFormattedString: 'Invalid JIT Address',
      isExpired: false,
    };
  }
  return getFormattedHoursAndMinutesRemaining(jitAddress.Expiration);
};

export const isWorkspaceJitValid = (workspace: AzureWorkspaceDto): boolean => {
  return (
    workspace &&
    workspace.Deployed &&
    workspace.State !== ResourceState.Unknown &&
    workspace.State !== ResourceState.NotDeployed &&
    workspace.State !== ResourceState.Deleting &&
    workspace.State !== ResourceState.Waiting &&
    workspace.State !== ResourceState.Deploying
  );
};

export const getJitErrorMessage = (workspace: AzureWorkspaceDto): string => {
  if (isWorkspaceJitValid(workspace)) {
    return '';
  }
  if (
    !workspace ||
    workspace.State === ResourceState.Waiting ||
    workspace.State === ResourceState.Deploying ||
    workspace.State === ResourceState.NotDeployed
  ) {
    return 'JIT is not available until this workspace is successfully deployed.';
  }
  if (workspace.State === ResourceState.Deleting) {
    return 'JIT is not available as this workspace is being deleted.';
  }
  if (!workspace.Deployed || workspace.State === ResourceState.Unknown) {
    return 'JIT is only available for successfully deployed workspaces.';
  }
};

export const getJitDropdownHours = (
  maxHours: number,
  disabled: boolean
): IContextualMenuItem[] => {
  if (!maxHours) {
    return [];
  }
  const countArray = Array.from(new Array(maxHours), (x, i) => i + 1);
  return countArray.map((count) => ({
    key: `${count}`,
    text: `${count} Hour${count !== 1 ? 's' : ''}`,
    disabled,
  }));
};

export const isAddressMismatch = (
  jitAddress: JitAddressDto,
  currentIP: string
): boolean => {
  if (!jitAddress) return false;
  return jitAddress.Address !== currentIP;
};
