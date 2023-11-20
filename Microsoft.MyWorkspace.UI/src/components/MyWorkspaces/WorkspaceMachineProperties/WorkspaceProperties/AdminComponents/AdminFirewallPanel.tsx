import * as React from 'react';
import clsx from 'clsx';
import {
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  Link,
  SelectionMode,
  Stack,
  Text,
  useTheme,
} from '@fluentui/react';
import { useSelector } from 'react-redux';
import { AzureWorkspaceDto } from '../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { getEditableWorkspace } from '../../../../../store/selectors/editableWorkspaceSelectors';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import { useHistory } from 'react-router';
import { FirewallHubNetworkInfoDto } from '../../../../../types/FirewallManager/FirewallHubNetworkInfoDto';
import { getAdminFirewalls } from '../../../../../store/selectors/adminFirewallSelectors';
import { AzureVirtualMachineDto } from '../../../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { getWorkspacePropertiesStyles } from '../../WorkspaceProperties/WorkspaceProperties.styles';

export const AdminFirewallPanel = (): JSX.Element => {
  const history = useHistory();
  const theme = useTheme();
  const styles = getWorkspacePropertiesStyles(theme);
  const commonStyles = getCommonStyles(theme);

  const editableWorkspace = useSelector(
    getEditableWorkspace
  ) as AzureWorkspaceDto;

  const firewalls: FirewallHubNetworkInfoDto[] = useSelector(getAdminFirewalls);

  const firewallID = React.useMemo(() => {
    return firewalls?.find((f) =>
      f.AssociatedHubNetworks?.find(
        (h) => h.ID == editableWorkspace.HubNetworkInfo.ID
      )
    )?.FirewallSettings.ID;
  }, [firewalls, editableWorkspace]);

  const columns: IColumn[] = [
    {
      key: 'rdpPort',
      name: 'RDP Port',
      minWidth: 100,
      maxWidth: 220,
      isResizable: true,
      onRender: (machine: AzureVirtualMachineDto) =>
        machine.RDPPort ?? 'RDP port not set.',
    },
    {
      key: 'sshPort',
      name: 'SSH Port',
      minWidth: 100,
      maxWidth: 220,
      isResizable: true,
      onRender: (machine: AzureVirtualMachineDto) =>
        machine.SSHPort ?? 'SSH port not set.',
    },
    {
      key: 'machine',
      name: 'Virtual Machine',
      minWidth: 100,
      maxWidth: 220,
      isResizable: true,
      onRender: (machine) => {
        return (
          <Stack>
            <Link
              onClick={() =>
                history.push(`/admin/${machine.WorkspaceID}/${machine.ID}`)
              }
            >
              {machine.ComputerName}
            </Link>
          </Stack>
        );
      },
    },
  ];

  return (
    <Stack className={styles.propertiesContent}>
      <Stack
        className={clsx(commonStyles.paddingTop12, commonStyles.autoOverflow90)}
      >
        <Stack.Item>
          <Text as='h3' variant='xLarge' className={commonStyles.margin0}>
            Workspace Firewall Info
          </Text>
        </Stack.Item>

        <Stack className={commonStyles.paddingTop12}>
          <Text variant='medium' className={commonStyles.boldText}>
            Hub Network
          </Text>
          <Link
            onClick={() =>
              history.push(`/admin/FirewallManagement/${firewallID}`)
            }
          >
            {editableWorkspace.HubNetworkInfo.ID}
          </Link>
        </Stack>

        <Stack className={commonStyles.halfWidth}>
          <DetailsList
            items={editableWorkspace.VirtualMachines}
            columns={columns}
            setKey='portMappings'
            selectionMode={SelectionMode.none}
            layoutMode={DetailsListLayoutMode.justified}
            selectionPreservedOnEmptyClick={true}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
