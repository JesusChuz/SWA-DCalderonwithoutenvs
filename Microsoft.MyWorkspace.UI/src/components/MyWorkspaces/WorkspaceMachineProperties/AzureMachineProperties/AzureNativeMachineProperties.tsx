import * as React from 'react';
import { Separator, Text, Stack, TooltipHost, useTheme } from '@fluentui/react';
import { useSelector } from 'react-redux';

import { getWorkspacePropertiesStyles } from '../WorkspaceProperties/WorkspaceProperties.styles';
import { AzureMachinePropertiesTabs } from './AzureNativeMachinePropertiesTabs';
import { formatDateString } from '../../../../shared/DateTimeHelpers';
import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import { ResourceStateStatusIcon } from '../../WorkspaceStatusIcons';
import { JitRDPButton } from './MachineActionButtons/JitRDPButton';
import { StartMachineButton } from './MachineActionButtons/StartMachineButton';
import { StopMachineButton } from './MachineActionButtons/StopMachineButton';
import { DeleteMachineButton } from './MachineActionButtons/DeleteMachineButton';
import { ResetPasswordButton } from './MachineActionButtons/ResetPasswordButton';
import { AzureWorkspaceDto } from '../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { JitProps } from '../../JitRDP/JitRDP.utils';
import { JitRDPDetailsPanel } from '../../JitRDP/JitRDPDetailsPanel';
import {
  getFeatureFlagPasswordRotation,
  getJitEnabled,
} from '../../../../store/selectors';
import { getEditableWorkspace } from '../../../../store/selectors/editableWorkspaceSelectors';

interface IProps {
  machineIndex: number;
}

export const AzureNativeMachineProperties = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getWorkspacePropertiesStyles(theme);

  const workspace = useSelector(getEditableWorkspace) as AzureWorkspaceDto;

  const jitEnabled = useSelector(getJitEnabled);
  const passwordRotationEnabled = useSelector(getFeatureFlagPasswordRotation);

  const [jitProps, setJitProps] = React.useState<JitProps>({
    open: false,
    workspaceID: null,
  });

  const openJit = (workspaceID: string, id?: string) => {
    setJitProps({ open: true, workspaceID, highlightID: id });
  };

  const closeJit = (id?: string) => {
    setJitProps({ open: false, workspaceID: null, highlightID: id });
  };

  const show = workspace.VirtualMachines.length > props.machineIndex;

  const machine = React.useMemo(
    () => workspace.VirtualMachines[props.machineIndex],
    [workspace, props.machineIndex]
  );

  return show ? (
    <Stack className={styles.root}>
      <Stack horizontal verticalAlign='start'>
        <ResourceStateStatusIcon resourceState={machine.State} />
        <Stack style={{ overflowX: 'hidden' }}>
          <Stack tokens={{ childrenGap: 4 }} horizontal verticalAlign='center'>
            <TooltipHost content={machine.Name}>
              <Text
                className={commonStyles.workspaceMachineTitle}
                variant='xxLarge'
                nowrap
                block
              >
                {machine.Name}
              </Text>
            </TooltipHost>
            <Text
              className={commonStyles.workspaceMachineTitle}
              variant='xxLarge'
              nowrap
              block
            >
              {' '}
              — Machine Properties
            </Text>
          </Stack>
          <Stack
            horizontal
            verticalAlign='center'
            horizontalAlign='space-between'
          >
            <TooltipHost content='Creation Date'>
              <Text variant='large' nowrap block>
                {workspace.Created ? formatDateString(workspace.Created) : ''}
              </Text>
            </TooltipHost>
          </Stack>
          <Stack
            horizontal
            className={styles.actionsRow}
            horizontalAlign='space-between'
          >
            <div>
              <StartMachineButton
                variant='CommandBarButton'
                workspace={workspace}
                machine={machine}
              />
              <StopMachineButton
                variant='CommandBarButton'
                workspace={workspace}
                machine={machine}
              />
              <DeleteMachineButton
                variant='CommandBarButton'
                workspace={workspace}
                machine={machine}
              />
              {jitEnabled && (
                <JitRDPButton
                  variant='CommandBarButton'
                  workspace={workspace}
                  machine={machine}
                  openJit={openJit}
                />
              )}
              {passwordRotationEnabled && (
                <ResetPasswordButton
                  variant='CommandBarButton'
                  workspace={workspace}
                  machine={machine}
                />
              )}
            </div>
          </Stack>
        </Stack>
      </Stack>
      <Separator />
      <AzureMachinePropertiesTabs machineIndex={props.machineIndex} />
      {jitEnabled && (
        <JitRDPDetailsPanel
          open={jitProps.open}
          workspaceID={jitProps.workspaceID}
          closeJit={closeJit}
          highlightID={jitProps.highlightID}
        />
      )}
    </Stack>
  ) : (
    <></>
  );
};
