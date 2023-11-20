import {
  Stack,
  Separator,
  ITextFieldProps,
  IRenderFunction,
  Toggle,
  Spinner,
  SpinnerSize,
  TooltipHost,
  DefaultButton,
  useTheme,
  Text,
} from '@fluentui/react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEditableWorkspace } from '../../../../../store/selectors/editableWorkspaceSelectors';
import { AzureVirtualMachineDto } from '../../../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { AzureWorkspaceDto } from '../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { OSVersion } from '../../../../../types/enums/OSVersion';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import { CopyDisplayField } from '../../../../GeneralComponents/CopyDisplayField';
import { InfoButton } from '../../../../GeneralComponents/InfoButton';
import { PasswordDisplayField } from '../../../../GeneralComponents/PasswordDisplayField';
import { MachineDownloadRdpButton } from '../MachineActionButtons/MachineDownloadRdpButton';
import { LinuxMachineDownloadRdpButton } from '../MachineActionButtons/LinuxMachineDownloadRdpButton';
import { styles } from './AzureMachinePropertyTab.styles';
import { getLinuxRDPSavingID } from '../../../../../store/selectors/azureMachinesSelector';
import {
  requestRdpPort,
  revokeRdpPort,
} from '../../../../../store/actions/azureMachineActions';
import { getFeatureFlagLinuxRdp } from '../../../../../store/selectors';

interface IProps {
  machineIndex: number;
}

export const AzureMachineConnect = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const dispatch = useDispatch();
  const workspace = useSelector(getEditableWorkspace) as AzureWorkspaceDto;
  const linuxRDPID = useSelector(getLinuxRDPSavingID);
  const featureFlagLinuxRdp = useSelector(getFeatureFlagLinuxRdp);
  const machines: AzureVirtualMachineDto[] = React.useMemo(() => {
    return workspace.VirtualMachines;
  }, [workspace]);
  const machine = React.useMemo(
    () => machines[props.machineIndex],
    [machines, props.machineIndex]
  );

  const onRenderLabel = (
    props: ITextFieldProps,
    defaultRender: IRenderFunction<ITextFieldProps>,
    buttonId: string,
    message: string,
    title: string = null
  ): JSX.Element => {
    return (
      <Stack horizontal verticalAlign='center'>
        <Text>{defaultRender(props)}</Text>
        <InfoButton
          buttonId={buttonId}
          calloutTitle={title}
          calloutBody={message}
        />
      </Stack>
    );
  };

  const linuxRequestOrRevokeRdpPort = () => {
    machine.RDPPort
      ? dispatch(revokeRdpPort(machine.ID, workspace.ID))
      : dispatch(requestRdpPort(machine.ID, workspace.ID));
  };

  const [showTooltip, setShowTooltip] = React.useState(false);

  const buttonStyles = {
    root: {
      background: 'transparent',
      border: 'none',
      minWidth: '16px',
      padding: 0,
    },
  };

  return (
    <Stack className={styles.propertiesContent}>
      <Stack
        horizontal
        tokens={{ childrenGap: 8 }}
        className={commonStyles.fullWidth}
      >
        <CopyDisplayField
          label='Administrator Name'
          value={machine.AdministratorName}
        />
        <PasswordDisplayField
          label='Administrator Password'
          password={machine.AdministratorPassword}
          showCopy
        />
      </Stack>
      <Separator />
      {machine.OSVersion === OSVersion.Windows ? (
        <MachineDownloadRdpButton
          variant='PrimaryButton'
          disabled={false}
          machine={machines[props.machineIndex]}
          workspace={workspace}
        />
      ) : (
        <>
          <CopyDisplayField
            style={{ width: '450px' }}
            onRenderLabel={(props, defaultRender) =>
              onRenderLabel(
                props,
                defaultRender,
                `infoButton-${machine.ID}-ssh-connection`,
                'Run this command in the command line (either PowerShell or bash).',
                'SSH Instructions (Command Line)'
              )
            }
            label='SSH Connection'
            value={`ssh ${machine.AdministratorName}@${
              machine.RDPAddress
            } -p ${machine.SSHPort?.toString()}`}
          />
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <CopyDisplayField
              style={{ width: '320px' }}
              onRenderLabel={(props, defaultRender) =>
                onRenderLabel(
                  props,
                  defaultRender,
                  `infoButton-${machine.ID}-ssh-address`,
                  `If using PuTTY, enter the SSH address into the 'Host Name (or IP Address)' field and the SSH port in the 'Port' field.`,
                  'SSH Instructions (PuTTY)'
                )
              }
              label='SSH Address'
              value={machine.RDPAddress}
            />
            <CopyDisplayField
              style={{ width: '80px' }}
              label='SSH Port'
              value={machine.SSHPort?.toString()}
            />
          </Stack>
          {featureFlagLinuxRdp &&
            workspace.HubNetworkInfo.Location != 'placeholder' && (
              <>
                <Separator />
                <Toggle
                  id='linuxRdp'
                  label={
                    <div>
                      Request RDP Port
                      <TooltipHost content='You will need to install your preferred RDP service on this machine through SSH before the requested RDP port can be used.'>
                        <DefaultButton
                          aria-label={'Request RDP Port Info Tooltip'}
                          aria-describedby={`infoButton-${machine.ID}-linux-rdp`}
                          onClick={() => setShowTooltip(!showTooltip)}
                          styles={buttonStyles}
                          iconProps={{ iconName: 'Info' }}
                        />
                      </TooltipHost>
                    </div>
                  }
                  inlineLabel
                  onText='On'
                  offText='Off'
                  ariaLabel='linux rdp port switch'
                  disabled={linuxRDPID === machine.ID}
                  checked={
                    machine.RDPPort !== null && machine.RDPPort !== undefined
                  }
                  onChange={linuxRequestOrRevokeRdpPort}
                />

                {linuxRDPID === machine.ID && (
                  <Spinner size={SpinnerSize.medium} />
                )}
                {machine.RDPPort !== null &&
                  machine.RDPPort !== undefined &&
                  linuxRDPID !== machine.ID && (
                    <Stack
                      horizontal
                      tokens={{ childrenGap: '8px' }}
                      verticalAlign='end'
                    >
                      <LinuxMachineDownloadRdpButton
                        variant='PrimaryButton'
                        disabled={false}
                        machine={machines[props.machineIndex]}
                        workspace={workspace}
                      />
                      <CopyDisplayField
                        style={{ width: '80px' }}
                        label='RDP Port'
                        value={machine.RDPPort?.toString()}
                      />
                    </Stack>
                  )}
              </>
            )}
        </>
      )}
    </Stack>
  );
};
