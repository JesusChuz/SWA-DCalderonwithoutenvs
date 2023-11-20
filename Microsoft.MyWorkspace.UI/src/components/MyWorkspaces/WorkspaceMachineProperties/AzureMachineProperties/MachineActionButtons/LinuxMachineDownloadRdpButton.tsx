import * as React from 'react';

import {
  PrimaryButton,
  CommandBarButton,
  TooltipHost,
  useTheme,
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
import {
  getUserRoleAssignmentConstraint,
  getFeatureFlagModernRDP,
} from '../../../../../store/selectors';
import { downloadFile } from '../../../../../shared/utilities/DownloadUtil';

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

export const LinuxMachineDownloadRdpButton = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const featureFlagModernRDP = useSelector(getFeatureFlagModernRDP);
  const constraint: SegmentConstraintDto = useSelector(
    getUserRoleAssignmentConstraint
  );
  const dispatch = useDispatch();

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

  const getRDPFileButton = () => {
    if (props.variant === 'PrimaryButton') {
      return (
        <PrimaryButton
          iconProps={cloudDownloadIcon}
          text={'Download RDP file for Machine'}
          disabled={disabled}
          onClick={() => dispatchMachineEvent()}
          data-custom-parentid='Linux Machine Download RDP Button'
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
          data-custom-parentid='Linux Machine Download RDP Button'
        />
      );
    }
  };

  const toolTip =
    props.variant === 'PrimaryButton' ? '' : 'Download RDP File For Machine';

  return (
    <>
      <TooltipHost content={toolTip} id={'linux-machine-download-rdp-button'}>
        {(!constraint.DisableCopyPaste ||
          (constraint.DisableCopyPaste && !featureFlagModernRDP)) &&
          getRDPFileButton()}
      </TooltipHost>
      {/* {featureFlagModernRDP && getModernRDPButton()} */}
    </>
  );
};
