import { CommandBarButton, TooltipHost, useTheme } from '@fluentui/react';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { ResourceStateMap } from '../../../../../types/AzureWorkspace/enums/ResourceStateMap';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import { IsTransitioning } from '../../../../../shared/helpers/WorkspaceHelper';
import { contextMenuStyles } from '../../AzureMachineProperties/MachineActionButtons/MachineActionButtons.utils';
import { WorkspaceActionButtonProps } from './WorkspaceActionButtons';

export const EditWorkspaceButton = (
  props: WorkspaceActionButtonProps
): JSX.Element => {
  const history = useHistory();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);

  const disabled = props.disabled;

  const getButton = () => (
    <CommandBarButton
      className={
        props.variant === 'CommandBarButton'
          ? commonStyles.commandBarButton
          : commonStyles.contextMenuButton
      }
      ariaLabel={
        IsTransitioning(props.workspace)
          ? `disabled while ${ResourceStateMap[props.workspace.State]}`
          : 'edit machines'
      }
      disabled={disabled}
      text='Edit Machines'
      role={props.variant === 'ContextualMenuButton' ? 'menuitem' : 'button'}
      iconProps={{
        iconName: 'Edit',
        styles:
          props.variant === 'ContextualMenuButton' ? contextMenuStyles : null,
      }}
      onClick={() => {
        history.push(`/${props.workspace.ID}/edit`);
        if (props.onDismiss) {
          props.onDismiss();
        }
      }}
    />
  );

  const toolTip = IsTransitioning(props.workspace)
    ? `Can not edit machines while ${ResourceStateMap[props.workspace.State]}`
    : '';

  const getComponent = () => {
    if (props.variant === 'CommandBarButton') {
      return <TooltipHost content={toolTip}>{getButton()}</TooltipHost>;
    } else {
      return getButton();
    }
  };

  return getComponent();
};
