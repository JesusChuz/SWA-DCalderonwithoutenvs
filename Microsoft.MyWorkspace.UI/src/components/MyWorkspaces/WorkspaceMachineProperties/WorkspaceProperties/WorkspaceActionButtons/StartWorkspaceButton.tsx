import { CommandBarButton, TooltipHost, useTheme } from '@fluentui/react';
import { AxiosResponse } from 'axios';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { AreAnySnapshotsPending } from '../../../../../shared/helpers/SnapshotHelpers';
import {
  showDefaultNotification,
  startStopAzureWorkspace,
  showSuccessNotification,
} from '../../../../../store/actions';
import { ResourceStateMap } from '../../../../../types/AzureWorkspace/enums/ResourceStateMap';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import {
  StartDisabled,
  IsTransitioning,
  IsOff,
  IsOn,
} from '../../../../../shared/helpers/WorkspaceHelper';
import { contextMenuStyles } from '../../AzureMachineProperties/MachineActionButtons/MachineActionButtons.utils';
import { WorkspaceActionButtonProps } from './WorkspaceActionButtons';

export const StartWorkspaceButton = (
  props: WorkspaceActionButtonProps
): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const dispatch = useDispatch();

  const anyVMSnapshotsPending = props.workspace.VirtualMachines.some((vm) =>
    AreAnySnapshotsPending(vm.Snapshots)
  );

  const disabled =
    props.disabled ||
    StartDisabled(props.workspace) ||
    props.workspace.VirtualMachines.some((vm) =>
      AreAnySnapshotsPending(vm.Snapshots)
    );

  const getTooltipText = (): string => {
    if (IsTransitioning(props.workspace)) {
      return `Can not change power state when ${
        ResourceStateMap[props.workspace.State]
      }`;
    }

    if (!IsOn(props.workspace) && anyVMSnapshotsPending) {
      return 'Workspace cannot be started while snapshots are pending';
    }
    if (IsOff(props.workspace)) {
      return 'Start Workspace';
    }
    return `Workspace is ${ResourceStateMap[props.workspace.State]}`;
  };

  const changeWorkspaceState = async () => {
    dispatch(showDefaultNotification('Starting Workspace. Please wait.'));
    const result: AxiosResponse = startStopAzureWorkspace(
      props.workspace.ID,
      true
    )(dispatch);

    if (result?.status === 204) {
      dispatch(showSuccessNotification('Workspace is now starting.'));

      if (props.refreshWorkspaceFunction) {
        props.refreshWorkspaceFunction();
      }
    }
  };

  const getButton = () => (
    <CommandBarButton
      className={
        props.variant === 'CommandBarButton'
          ? commonStyles.commandBarButton
          : commonStyles.contextMenuButton
      }
      ariaLabel={
        IsTransitioning(props.workspace)
          ? `Disabled while ${ResourceStateMap[props.workspace.State]}`
          : IsOff(props.workspace)
          ? 'Start Workspace'
          : `Workspace is ${ResourceStateMap[props.workspace.State]}`
      }
      disabled={disabled}
      text='Start'
      role={props.variant === 'ContextualMenuButton' ? 'menuitem' : 'button'}
      iconProps={{
        iconName: 'Play',
        styles:
          props.variant === 'ContextualMenuButton' ? contextMenuStyles : null,
      }}
      onClick={() => {
        changeWorkspaceState();
        if (props.onDismiss) {
          props.onDismiss();
        }
      }}
      data-custom-parentid='Start Workspace Button'
    />
  );

  const getComponent = () => {
    if (props.variant === 'CommandBarButton') {
      return (
        <TooltipHost content={getTooltipText()}>{getButton()}</TooltipHost>
      );
    } else {
      return getButton();
    }
  };

  return getComponent();
};
