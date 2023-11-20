import { CommandBarButton, TooltipHost, useTheme } from '@fluentui/react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { getJitAddresses } from '../../../../../store/selectors';
import { SyncStatus } from '../../../../../types/enums/SyncStatus';
import { JitAddressDto } from '../../../../../types/FirewallManager/JitAddressDto';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import {
  isWorkspaceJitValid,
  getJitStatusText,
} from '../../../JitRDP/JitRDP.utils';
import { MachineProps } from './MachineActionButtons.utils';

export const JitRDPButton = (props: MachineProps): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const jitAddresses: JitAddressDto[] = useSelector(getJitAddresses);
  const [iconProps, setIconProps] = React.useState({
    name: 'Error',
    color: theme.semanticColors.errorText,
  });
  const [toolTipMessage, setTooltipMessage] = React.useState('');

  const jitAddress = React.useMemo(() => {
    if (!props.workspace) {
      return null;
    }
    return (
      jitAddresses.find((a) => a.WorkspaceID === props.workspace.ID) || null
    );
  }, [props.workspace, jitAddresses]);

  React.useEffect(() => {
    if (!isWorkspaceJitValid(props.workspace)) {
      setIconProps({ name: 'Error', color: null });
      setTooltipMessage('Workspace must be successfully deployed');
      return;
    } else if (!jitAddress) {
      setIconProps({ name: 'Error', color: theme.semanticColors.errorText });
    } else if (jitAddress.Status == SyncStatus.Active) {
      setIconProps({
        name: 'CheckMark',
        color: theme.semanticColors.successIcon,
      });
    } else {
      setIconProps({
        name: 'Warning',
        color: theme.semanticColors.warningIcon,
      });
    }
    setTooltipMessage(getJitStatusText(jitAddress));
  }, [props.workspace, jitAddress, theme]);

  const getButton = () => (
    <CommandBarButton
      className={
        props.variant === 'CommandBarButton'
          ? commonStyles.commandBarButton
          : commonStyles.contextMenuButton
      }
      ariaLabel='JIT Status'
      text='JIT Status'
      role={props.variant === 'ContextualMenuButton' ? 'menuitem' : 'button'}
      iconProps={
        iconProps
          ? {
              iconName: iconProps.name,
              style: { color: iconProps.color },
            }
          : null
      }
      onClick={() => props.openJit(props.workspace.ID)}
      disabled={!isWorkspaceJitValid(props.workspace)}
    ></CommandBarButton>
  );

  const getComponent = () => {
    if (props.variant === 'CommandBarButton') {
      return <TooltipHost content={toolTipMessage}>{getButton()}</TooltipHost>;
    } else {
      return getButton();
    }
  };

  return getComponent();
};
