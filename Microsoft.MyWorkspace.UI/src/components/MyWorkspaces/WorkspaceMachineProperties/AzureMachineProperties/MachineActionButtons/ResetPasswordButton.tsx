import { CommandBarButton, TooltipHost, useTheme } from '@fluentui/react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetPassword,
  showUserConfirmationDialog,
} from '../../../../../store/actions';
import { getPasswordResetPending } from '../../../../../store/selectors';
import { ResourceStateMap } from '../../../../../types/AzureWorkspace/enums/ResourceStateMap';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import {
  IsTransitioning,
  IsOn,
} from '../../../../../shared/helpers/WorkspaceHelper';
import { MachineProps, contextMenuStyles } from './MachineActionButtons.utils';

export const ResetPasswordButton = (props: MachineProps): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const dispatch = useDispatch();
  const passwordResetPending = useSelector(getPasswordResetPending);

  const transitioning =
    IsTransitioning(props.machine) || IsTransitioning(props.workspace);

  const disabled =
    transitioning || !IsOn(props.machine) || passwordResetPending;

  const changePassword = async () => {
    dispatch(resetPassword(props.workspace.ID, props.machine.ID));
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
          ? 'Reset Password'
          : `Machine is ${ResourceStateMap[props.machine.State]}`
      }
      disabled={disabled}
      text='Reset Password'
      role={props.variant === 'ContextualMenuButton' ? 'menuitem' : 'button'}
      iconProps={{
        iconName: 'Lock',
        styles:
          props.variant === 'ContextualMenuButton' ? contextMenuStyles : null,
      }}
      onClick={() => {
        dispatch(
          showUserConfirmationDialog(
            'Reset the password?',
            "This will permanently change the VM's password.",
            changePassword
          )
        );
      }}
    />
  );

  const toolTip = transitioning
    ? `Can not reset password when ${ResourceStateMap[props.machine.State]}`
    : IsOn(props.machine)
    ? 'Reset Password'
    : `Machine is ${ResourceStateMap[props.machine.State]}`;

  const getComponent = () => {
    if (props.variant === 'CommandBarButton') {
      return <TooltipHost content={toolTip}>{getButton()}</TooltipHost>;
    } else {
      return getButton();
    }
  };

  return getComponent();
};
