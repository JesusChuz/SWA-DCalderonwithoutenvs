import * as React from 'react';
import {
  CommandBarButton,
  TooltipHost,
  Text,
  Stack,
  useTheme,
} from '@fluentui/react';
import { useDispatch } from 'react-redux';
import { ResourceStateMap } from '../../../../../types/AzureWorkspace/enums/ResourceStateMap';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import { IsTransitioning } from '../../../../../shared/helpers/WorkspaceHelper';
import { contextMenuStyles } from '../../AzureMachineProperties/MachineActionButtons/MachineActionButtons.utils';
import { WorkspaceActionButtonProps } from './WorkspaceActionButtons';
import {
  enablePrivateMode,
  showUserConfirmationDialog,
} from '../../../../../store/actions';

export const PrivateWorkspaceButton = (
  props: WorkspaceActionButtonProps
): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);

  const disabled = React.useMemo(
    () => props.disabled || IsTransitioning(props.workspace),
    [props.disabled, props.workspace, IsTransitioning]
  );

  const getTooltipText = (): string => {
    if (props.workspace.PrivateMode) {
      return 'Private Mode is already enabled';
    }
    if (IsTransitioning(props.workspace)) {
      return `Can not enable private workspace when ${
        ResourceStateMap[props.workspace.State]
      }`;
    }
    return `Enable Private Mode`;
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
          : props.workspace.PrivateMode
          ? 'Private Mode is already enabled'
          : 'Enable Private Mode'
      }
      disabled={disabled}
      text={'Private Mode'}
      role={props.variant === 'ContextualMenuButton' ? 'menuitem' : 'button'}
      iconProps={{
        iconName: 'Lock',
        styles:
          props.variant === 'ContextualMenuButton' ? contextMenuStyles : null,
      }}
      onClick={() => {
        dispatch(
          showUserConfirmationDialog(
            'Warning',
            <Stack>
              <Text>
                {`By using this option, you are attesting that you are hosting
                source code. Therefore, external connectivity and DNS functionality will
                be permanently disabled for this workspace.`}
              </Text>
              <br />
              <Text>
                All public IP addresses, NAT rules and DNS records associated
                with this workspace will be deallocated.
              </Text>
              <br />
              <Text className={commonStyles.boldText}>
                This action is irreversible.
              </Text>
            </Stack>,
            () => dispatch(enablePrivateMode(props.workspace.ID))
          )
        );
        if (props.onDismiss) {
          props.onDismiss();
        }
      }}
      data-custom-parentid='Private Workspace Button'
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
