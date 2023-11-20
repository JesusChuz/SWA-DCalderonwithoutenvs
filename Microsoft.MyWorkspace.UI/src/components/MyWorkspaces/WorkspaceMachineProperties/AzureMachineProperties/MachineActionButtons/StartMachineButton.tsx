import * as React from 'react';

import { CommandBarButton, TooltipHost, useTheme } from '@fluentui/react';
import { useDispatch } from 'react-redux';
import {
  startStopAzureMachine,
  showSuccessNotification,
} from '../../../../../store/actions';
import { ResourceStateMap } from '../../../../../types/AzureWorkspace/enums/ResourceStateMap';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import {
  IsTransitioning,
  IsOff,
  IsOn,
} from '../../../../../shared/helpers/WorkspaceHelper';
import { MachineProps, contextMenuStyles } from './MachineActionButtons.utils';
import { AreAnySnapshotsPending } from '../../../../../shared/helpers/SnapshotHelpers';

export const StartMachineButton = (props: MachineProps): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const dispatch = useDispatch();

  const transitioning =
    IsTransitioning(props.machine) || IsTransitioning(props.workspace);

  const disabled =
    !IsOff(props.machine) ||
    IsTransitioning(props.machine) ||
    IsTransitioning(props.workspace) ||
    AreAnySnapshotsPending(props.machine.Snapshots);

  const changeMachineState = async () => {
    dispatch(startStopAzureMachine(props.workspace.ID, props.machine.ID, true));
    dispatch(showSuccessNotification('Starting Machine'));
  };

  const getTooltipText = (): string => {
    if (IsTransitioning(props.workspace)) {
      return `Can not change power state while the workspace is ${
        ResourceStateMap[props.workspace.State]
      }`;
    }
    if (transitioning) {
      return `Can not change power state while ${
        ResourceStateMap[props.machine.State]
      }`;
    }
    if (
      !IsOn(props.machine) &&
      AreAnySnapshotsPending(props.machine.Snapshots)
    ) {
      return 'Machine cannot be started while snapshots are pending';
    }
    if (IsOff(props.machine)) {
      return 'Start Machine';
    }
    return `Machine is ${ResourceStateMap[props.machine.State]}`;
  };

  const getButton = () => (
    <CommandBarButton
      className={
        props.variant === 'CommandBarButton'
          ? commonStyles.commandBarButton
          : commonStyles.contextMenuButton
      }
      ariaLabel={
        transitioning
          ? `Disabled while ${ResourceStateMap[props.machine.State]}`
          : IsOff(props.machine)
          ? 'Start Machine'
          : `Machine is ${ResourceStateMap[props.machine.State]}`
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
        changeMachineState();
      }}
      data-custom-parentid='Start Machine Button'
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
