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
  StopDisabled,
  IsTransitioning,
  IsOn,
  IsOff,
} from '../../../../../shared/helpers/WorkspaceHelper';
import { contextMenuStyles } from '../../AzureMachineProperties/MachineActionButtons/MachineActionButtons.utils';
import { WorkspaceActionButtonProps } from './WorkspaceActionButtons';

export const StopWorkspaceButton = (
  props: WorkspaceActionButtonProps
): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);

  const anyVMSnapshotsPending = props.workspace.VirtualMachines.some((vm) =>
    AreAnySnapshotsPending(vm.Snapshots)
  );

  const getTooltipText = (): string => {
    if (IsTransitioning(props.workspace)) {
      return `Can not change power state when ${
        ResourceStateMap[props.workspace.State]
      }`;
    }
    if (!IsOff(props.workspace) && anyVMSnapshotsPending) {
      return 'Workspace cannot be stopped while snapshots are pending';
    }
    if (IsOn(props.workspace)) {
      return 'Stop Workspace';
    }
    return `Workspace is ${ResourceStateMap[props.workspace.State]}`;
  };

  const disabled =
    props.disabled ||
    StopDisabled(props.workspace) ||
    props.workspace.VirtualMachines.some((vm) =>
      AreAnySnapshotsPending(vm.Snapshots)
    );
  const changeWorkspaceState = async () => {
    dispatch(showDefaultNotification('Stopping Workspace. Please wait.'));
    const result: AxiosResponse = await startStopAzureWorkspace(
      props.workspace.ID,
      false
    )(dispatch);

    if (result?.status === 204) {
      dispatch(showSuccessNotification('Workspace is now stopping.'));

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
          : IsOn(props.workspace)
          ? 'Stop Workspace'
          : `Workspace is ${ResourceStateMap[props.workspace.State]}`
      }
      disabled={disabled}
      text='Stop'
      role={props.variant === 'ContextualMenuButton' ? 'menuitem' : 'button'}
      iconProps={{
        iconName: 'Stop',
        styles:
          props.variant === 'ContextualMenuButton' ? contextMenuStyles : null,
      }}
      onClick={() => {
        changeWorkspaceState();
        if (props.onDismiss) {
          props.onDismiss();
        }
      }}
      data-custom-parentid='Stop Workspace Button'
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
