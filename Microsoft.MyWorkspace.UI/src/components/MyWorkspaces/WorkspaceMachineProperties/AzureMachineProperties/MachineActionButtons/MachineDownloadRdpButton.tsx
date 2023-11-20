import * as React from 'react';

import {
  PrimaryButton,
  CommandBarButton,
  Text,
  TooltipHost,
  Stack,
  useTheme,
  MessageBar,
  MessageBarType,
} from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';
import { telemetryContext } from '../../../../../applicationInsights/TelemetryService';
import { httpAuthService } from '../../../../../applicationInsights/httpAuthService';
import { cloudDownloadIcon } from '../../../../../shared/Icons';
import { showErrorNotification } from '../../../../../store/actions';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import { IsTransitioning } from '../../../../../shared/helpers/WorkspaceHelper';
import { AzureVirtualMachineDto } from '../../../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { AzureWorkspaceDto } from '../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { SegmentConstraintDto } from '../../../../../types/AuthService/SegmentConstraintDto.types';
import { contextMenuStyles } from './MachineActionButtons.utils';
import { InfoButton } from '../../../../GeneralComponents/InfoButton';
import {
  getUserRoleAssignmentConstraint,
  getModernRdpDownloadLink,
  getFeatureFlagModernRDP,
} from '../../../../../store/selectors';
import {
  downloadFile,
  downloadModernRDP,
} from '../../../../../shared/utilities/DownloadUtil';

interface IProps {
  machine: AzureVirtualMachineDto;
  workspace?: AzureWorkspaceDto;
  endpoint?: string;
  disabled?: boolean;
  actionFunction?: () => void;
  refreshWorkspaceFunction?: () => void;
  variant:
    | 'CommandBarButton'
    | 'ContextualMenuButton'
    | 'IconOnly'
    | 'PrimaryButton';
}

export const MachineDownloadRdpButton = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const modernRDPUrl: string = useSelector(getModernRdpDownloadLink);
  const featureFlagModernRDP = useSelector(getFeatureFlagModernRDP);
  const constraint: SegmentConstraintDto = useSelector(
    getUserRoleAssignmentConstraint
  );
  const dispatch = useDispatch();
  const infoButtonId = 'infoButton-modernRDP';

  const dispatchMachineEvent = async () => {
    const url = `/azurevirtualmachines/rdp/${props.machine.ID}`;

    try {
      const res = await httpAuthService.get(url);

      if (res.status === 200) {
        downloadFile(
          `${props.workspace.Name} - ${props.machine.ComputerName}.rdp`,
          res.data
        );
      } else {
        throw new Error(res.statusText);
      }
    } catch (err) {
      console.log(err);
      telemetryContext.logException(err);
      dispatch(
        showErrorNotification(
          'Failed to download RDP file from server: \n' + err
        )
      );
    }
  };

  const disabled =
    props.disabled ||
    IsTransitioning(props.machine) ||
    IsTransitioning(props.workspace);

  const getModernRDPButton = () => {
    return (
      <Stack
        className={`${commonStyles.halfWidth}  ${commonStyles.paddingTop12}`}
      >
        <Stack
          horizontal
          tokens={{
            childrenGap: 8,
          }}
        >
          <PrimaryButton
            iconProps={cloudDownloadIcon}
            text={'Install ModernRDP'}
            disabled={disabled}
            onClick={() => downloadModernRDP(modernRDPUrl)}
            data-custom-parentid='Download ModernRDP'
          />
          <InfoButton
            buttonId={infoButtonId}
            calloutTitle={'ModernRDP'}
            calloutBody={
              <>
                <Text>
                  ModernRDP is a native windows application designed for
                  MyWorkspace users to connect to their Azure workspaces.
                </Text>
                <Text>
                  ModernRDP allows centralized access to all the users’ deployed
                  workspaces from within a single application.
                </Text>
              </>
            }
          />
        </Stack>
      </Stack>
    );
  };

  const getDownloadRDPFileWarning = () => {
    return (
      <Stack
        className={`${commonStyles.halfWidth}  ${commonStyles.marginBottom4}`}
      >
        <MessageBar messageBarType={MessageBarType.severeWarning}>
          Please download the RDP file after activating JIT each time.
        </MessageBar>
      </Stack>
    );
  };

  const getRDPFileButton = () => {
    if (props.variant === 'PrimaryButton') {
      return (
        <PrimaryButton
          iconProps={cloudDownloadIcon}
          text={'Download RDP file for Machine'}
          disabled={disabled}
          data-custom-parentid='Download RDP file'
          onClick={() => dispatchMachineEvent()}
        />
      );
    } else {
      return (
        <CommandBarButton
          className={
            props.variant === 'CommandBarButton'
              ? commonStyles.commandBarButton
              : commonStyles.contextMenuButton
          }
          iconProps={{
            ...cloudDownloadIcon,
            styles:
              props.variant === 'ContextualMenuButton'
                ? contextMenuStyles
                : null,
          }}
          text={
            props.variant === 'IconOnly'
              ? null
              : 'Download RDP file for Machine'
          }
          disabled={disabled}
          role={
            props.variant === 'ContextualMenuButton' ? 'menuitem' : 'button'
          }
          onClick={() => dispatchMachineEvent()}
          data-custom-parentid='Download RDP file'
        />
      );
    }
  };

  const toolTip =
    props.variant === 'PrimaryButton' ? '' : 'Download RDP File For Machine';

  return (
    <Stack>
      {props.workspace.HubNetworkInfo.Location === 'placeholder' &&
        getDownloadRDPFileWarning()}
      <TooltipHost content={toolTip} id={'machine-download-rdp-button'}>
        {(!constraint.DisableCopyPaste ||
          (constraint.DisableCopyPaste && !featureFlagModernRDP)) &&
          getRDPFileButton()}
      </TooltipHost>
      {featureFlagModernRDP && getModernRDPButton()}
    </Stack>
  );
};
