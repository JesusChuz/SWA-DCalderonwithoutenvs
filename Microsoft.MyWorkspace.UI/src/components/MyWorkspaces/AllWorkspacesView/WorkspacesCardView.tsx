import * as React from 'react';
import { Text, Stack, TooltipHost, useTheme } from '@fluentui/react';

import { useSelector } from 'react-redux';
import { getAllWorkspacesStyles } from './AllWorkspacesView.styles';
import { WorkspaceActionsButton } from '../WorkspaceMachineProperties/WorkspaceProperties/WorkspaceActionButtons/WorkspaceActionButtons';
import { WorkspaceWarnings } from '../WorkspaceWarnings';
import {
  ResourceStateDotIcon,
  getResourceStateText,
} from '../WorkspaceStatusIcons';
import { getAzureWorkspaces } from '../../../store/selectors/azureWorkspaceSelectors';
import { AzureWorkspaceDto } from '../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { AzureVirtualMachineDto } from '../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
interface IProps {
  openJit: (open: boolean, id?: string) => void;
}

export const WorkspacesCardView = (props: IProps): JSX.Element => {
  const allWorkspaces = useSelector(getAzureWorkspaces);
  const theme = useTheme();
  const styles = getAllWorkspacesStyles(theme);

  return (
    <Stack wrap horizontal tokens={{ childrenGap: 45 }}>
      {allWorkspaces &&
        allWorkspaces.length > 0 &&
        allWorkspaces.map((ws: AzureWorkspaceDto) => (
          <Stack key={ws.ID} className={styles.card}>
            <Stack
              className={styles.machineHeader}
              horizontal
              horizontalAlign='space-between'
              verticalAlign='center'
            >
              <Stack
                horizontal
                verticalAlign='center'
                tokens={{ childrenGap: 8, padding: '0px 8px', maxWidth: 300 }}
              >
                <TooltipHost content={getResourceStateText(ws.State)}>
                  <ResourceStateDotIcon resourceState={ws.State} />
                </TooltipHost>
                <Text block nowrap variant='xxLarge'>
                  {ws.Name}
                </Text>
              </Stack>

              <WorkspaceWarnings workspace={ws} openJit={props.openJit} />
              <WorkspaceActionsButton
                aria-label='workspace actions'
                className={styles.cardActionButton}
                workspace={ws}
                horizontal={true}
              />
            </Stack>
            <Stack className={styles.machineContainer}>
              {ws.VirtualMachines?.map((machine: AzureVirtualMachineDto) => (
                <Stack
                  key={machine.ID}
                  className={styles.machineItem}
                  horizontal
                  verticalAlign='center'
                  horizontalAlign='space-between'
                >
                  <Stack
                    horizontal
                    verticalAlign='center'
                    tokens={{ childrenGap: 8 }}
                  >
                    <TooltipHost content={getResourceStateText(machine.State)}>
                      <ResourceStateDotIcon resourceState={machine.State} />
                    </TooltipHost>
                    <Stack>
                      <Text block nowrap>
                        {machine.InternalName}
                      </Text>
                      <Text block nowrap variant='small'>
                        {machine.Name}
                      </Text>
                    </Stack>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Stack>
        ))}
    </Stack>
  );
};
