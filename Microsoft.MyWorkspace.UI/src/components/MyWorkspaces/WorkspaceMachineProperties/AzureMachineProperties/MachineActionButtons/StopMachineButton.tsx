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
  IsOn,
  IsOff,
} from '../../../../../shared/helpers/WorkspaceHelper';
import { MachineProps, contextMenuStyles } from './MachineActionButtons.utils';
import { AreAnySnapshotsPending } from '../../../../../shared/helpers/SnapshotHelpers';

export const StopMachineButton = (props: MachineProps): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const dispatch = useDispatch();

  const transitioning =
    IsTransitioning(props.machine) || IsTransitioning(props.workspace);

  const disabled =
    transitioning ||
    !IsOn(props.machine) ||
    AreAnySnapshotsPending(props.machine.Snapshots);

  const getTooltipText = (): string => {
    if (IsTransitioning(props.workspace)) {
      return `Can not change power state while the workspace is ${
        ResourceStateMap[props.workspace.State]
      }`;
    }
    if (transitioning) {
      return `Can not change power state when ${
        ResourceStateMap[props.machine.State]
      }`;
    }
    if (
      !IsOff(props.machine) &&
      AreAnySnapshotsPending(props.machine.Snapshots)
    ) {
      return 'Machine cannot be stopped while snapshots are pending';
    }
    if (IsOn(props.machine)) {
      return 'Stop Machine';
    }
    return `Machine is ${ResourceStateMap[props.machine.State]}`;
  };

  const changeMachineState = async () => {
    dispatch(
      startStopAzureMachine(props.workspace.ID, props.machine.ID, false)
    );
    dispatch(showSuccessNotification('Stopping Machine'));
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
          : IsOn(props.machine)
          ? 'Stop Machine'
          : `Machine is ${ResourceStateMap[props.machine.State]}`
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
        changeMachineState();
      }}
      data-custom-parentid='Stop Machine Button'
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
