import * as React from 'react';

import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import { useSelector, useDispatch } from 'react-redux';
import {
  Stack,
  Text,
  Spinner,
  SpinnerSize,
  IColumn,
  DetailsList,
  ColumnActionsMode,
  SelectionMode,
  DetailsListLayoutMode,
  Link,
  TooltipHost,
  FontIcon,
  Announced,
  IIconProps,
  SearchBox,
  IObjectWithKey,
  Selection,
  CheckboxVisibility,
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
  ContextualMenu,
  CommandButton,
  useTheme,
} from '@fluentui/react';
import { useId, useBoolean } from '@fluentui/react-hooks';
import { FirewallHubNetworkInfoDto } from '../../../types/FirewallManager/FirewallHubNetworkInfoDto';
import { useHistory } from 'react-router';
import { FirewallSettingsDto } from '../../../types/FirewallManager/FirewallSettingsDto';
import { FirewallActionsButton } from './FirewallActionButtons';
import { FirewallPropertiesPanel } from './FirewallPropertiesPanel';
import { NewFirewallButton } from './NewFirewallButton';
import {
  getAdminFirewalls,
  getAdminFirewallsLoading,
  getSelectedFirewalls,
  getIsCreateHubNetworkDnsRecordCreationJobPending,
  getCatalogUserProfile,
  getFeatureFlagFirewallDeployments,
  getFeatureFlagFirewallSoftwareUpdates,
} from '../../../store/selectors';
import {
  createHubNetworkDnsRecordCreationJob,
  setSelectedFirewalls,
} from '../../../store/actions/adminFirewallActions';

import clsx from 'clsx';
import { getAdminViewStyles } from '../AdministrationViews.styles';
import { ConfigProfileSyncStatusIcons } from './ConfigProfileStatusIcons';
import { HubNetworkDnsRecordCreationJobDto } from '../../../types/FirewallManager/HubNetworkDnsRecordCreationJobDto';
import {
  FirewallStatusDotIcon,
  getFirewallStatusString,
} from './FirewallSettingsStatusIcons';
import { FirewallSoftwareUpdateDialog } from './FirewallSoftwareUpdateDialog';

const filterIcon: IIconProps = { iconName: 'Filter' };

interface IProps {
  includeTitle?: boolean;
}

export const FirewallListView = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getAdminViewStyles(theme);
  const history = useHistory();

  const [columns, setColumns] = React.useState<IColumn[]>([]);
  const [sortKey, setSortKey] = React.useState<
    keyof FirewallHubNetworkInfoDto | keyof FirewallSettingsDto
  >('Name');
  const [sortAscending, setSortAscending] = React.useState(true);
  const [sortedFirewalls, setSortedFirewalls] = React.useState<
    FirewallHubNetworkInfoDto[]
  >([]);
  const [filter, setFilter] = React.useState('');

  const firewallsLoading: boolean = useSelector(getAdminFirewallsLoading);
  const firewalls: FirewallHubNetworkInfoDto[] = useSelector(getAdminFirewalls);
  const firewallDeploymentFeatureFlag: boolean = useSelector(
    getFeatureFlagFirewallDeployments
  );
  const firewallSoftwareUpdateFeatureFlag: boolean = useSelector(
    getFeatureFlagFirewallSoftwareUpdates
  );

  const columnsMap: Record<string, IColumn> = {
    warnings: {
      key: 'Warnings',
      isIconOnly: true,
      name: '',
      ariaLabel: 'warnings column',
      minWidth: 40,
      maxWidth: 80,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (firewall: FirewallHubNetworkInfoDto) => (
        <Stack horizontalAlign='center' tokens={{ childrenGap: 8 }} horizontal>
          {firewall.FirewallSettings.MaintenanceModeEnabled && (
            <TooltipHost content='Maintenance Mode Enabled'>
              <FontIcon
                iconName='Toolbox'
                aria-label='firewall maintenance mode enabled'
                className={clsx(commonStyles.warningText, commonStyles.font18)}
              />
            </TooltipHost>
          )}
          {firewall.TotalSpokeNetworkConsumed / firewall.MaxSpokeAllowed >=
            0.8 && (
            <TooltipHost content='High Spoke Usage'>
              <FontIcon
                iconName='Warning'
                aria-label='firewall has high spoke usage'
                className={clsx(commonStyles.errorText, commonStyles.font18)}
              />
            </TooltipHost>
          )}
          <ConfigProfileSyncStatusIcons
            status={firewall.FirewallSettings.ConfigStatus}
          />
        </Stack>
      ),
    },
    name: {
      key: 'name',
      name: 'Name',
      ariaLabel: 'name column',
      minWidth: 120,
      maxWidth: 360,
      isResizable: true,
      onColumnClick: () => handleColumnClick('Name'),
      isSorted: sortKey === 'Name',
      isSortedDescending: sortKey === 'Name' && !sortAscending,
      onRender: (firewall: FirewallHubNetworkInfoDto) => {
        return (
          <Stack>
            <Link
              onClick={() =>
                history.push(
                  `/admin/FirewallManagement/${firewall.FirewallSettings.ID}`
                )
              }
            >
              {firewall.FirewallSettings.Name}
            </Link>
          </Stack>
        );
      },
    },
    status: {
      key: 'status',
      name: 'Status',
      ariaLabel: 'status column',
      minWidth: 120,
      maxWidth: 360,
      isResizable: true,
      onRender: (firewall: FirewallHubNetworkInfoDto) => {
        return (
          <Stack
            horizontal
            verticalAlign='center'
            className={commonStyles.fullHeight}
            tokens={{ childrenGap: 4 }}
          >
            <FirewallStatusDotIcon
              syncStatus={firewall.FirewallSettings.SyncStatus}
            />
            <Text variant='small'>
              {getFirewallStatusString(firewall.FirewallSettings.SyncStatus)}
            </Text>
          </Stack>
        );
      },
    },
    softwareVersion: {
      key: 'softwareVersion',
      name: 'Software Version',
      ariaLabel: 'software version  column',
      minWidth: 120,
      maxWidth: 360,
      isResizable: true,
      onRender: (firewall: FirewallHubNetworkInfoDto) => {
        return (
          <Stack
            horizontal
            verticalAlign='center'
            className={commonStyles.fullHeight}
            tokens={{ childrenGap: 4 }}
          >
            {firewall.FirewallSettings.SoftwareVersion ? (
              firewall.FirewallSettings.SoftwareVersion
            ) : (
              <TooltipHost content='Missing software version. Please update.'>
                <FontIcon
                  iconName='Warning'
                  aria-label='firewall is missing software version update'
                  className={clsx(commonStyles.errorText, commonStyles.font18)}
                />
              </TooltipHost>
            )}
          </Stack>
        );
      },
    },
    spokeUsage: {
      key: 'spokeUsage',
      name: 'Spoke Usage',
      ariaLabel: 'spoke usage column',
      minWidth: 120,
      maxWidth: 360,
      isResizable: true,
      onColumnClick: () => handleColumnClick('TotalSpokeNetworkConsumed'),
      isSorted: sortKey === 'TotalSpokeNetworkConsumed',
      isSortedDescending:
        sortKey === 'TotalSpokeNetworkConsumed' && !sortAscending,
      onRender: (firewall: FirewallHubNetworkInfoDto) => {
        return (
          <Stack>
            <Text variant='small'>{`${firewall.TotalSpokeNetworkConsumed} / ${firewall.MaxSpokeAllowed}`}</Text>
          </Stack>
        );
      },
    },
    region: {
      key: 'region',
      name: 'Region',
      ariaLabel: 'region column',
      minWidth: 120,
      maxWidth: 300,
      isResizable: true,
      onColumnClick: () => handleColumnClick('Location'),
      isSorted: sortKey === 'Location',
      isSortedDescending: sortKey === 'Location' && !sortAscending,
      onRender: (firewall: FirewallHubNetworkInfoDto) => {
        return (
          <Stack>
            <Text variant='small'>{firewall.FirewallSettings.Location}</Text>
          </Stack>
        );
      },
    },
    id: {
      key: 'id',
      name: 'Firewall ID',
      ariaLabel: 'id column',
      fieldName: 'ID',
      minWidth: 240,
      maxWidth: 400,
      isResizable: true,
      onColumnClick: () => handleColumnClick('ID'),
      isSorted: sortKey === 'ID',
      isSortedDescending: sortKey === 'ID' && !sortAscending,
      onRender: (firewall: FirewallHubNetworkInfoDto) => {
        return (
          <Stack>
            <Text variant='small'>{firewall.FirewallSettings.ID}</Text>
          </Stack>
        );
      },
    },
    hubs: {
      key: 'hubs',
      name: 'Hub Networks',
      ariaLabel: 'hubs column',
      minWidth: 120,
      maxWidth: 300,
      isResizable: true,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (firewall: FirewallHubNetworkInfoDto) => {
        return <Stack>{`${firewall.TotalAssociatedHubNetworks} hubs`}</Stack>;
      },
    },
    actions: {
      key: 'Actions',
      isIconOnly: true,
      name: '',
      ariaLabel: 'actions column',
      minWidth: 40,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (firewall: FirewallHubNetworkInfoDto) => (
        <Stack horizontalAlign='end'>
          <FirewallActionsButton firewall={firewall} />
        </Stack>
      ),
    },
  };

  const sortFirewalls = () => {
    const key = sortKey as keyof (
      | FirewallHubNetworkInfoDto
      | FirewallSettingsDto
    );
    setSortedFirewalls(
      [...firewalls]
        .filter(filterFirewalls)
        .sort((a, b) =>
          a[key]
            ? (sortAscending ? a[key] > b[key] : a[key] < b[key])
              ? 1
              : -1
            : (
                sortAscending
                  ? a['FirewallSettings'][key] > b['FirewallSettings'][key]
                  : a['FirewallSettings'][key] < b['FirewallSettings'][key]
              )
            ? 1
            : -1
        )
    );
    buildColumnsObject();
  };

  const handleColumnClick = (
    key: keyof FirewallHubNetworkInfoDto | keyof FirewallSettingsDto
  ) => {
    if (key === sortKey) {
      setSortAscending(!sortAscending);
    } else {
      setSortKey(key);
      setSortAscending(true);
    }
  };

  const buildColumnsObject = () => {
    const newColumns: IColumn[] = [];
    newColumns.push(columnsMap.warnings);
    newColumns.push(columnsMap.name);
    newColumns.push(columnsMap.softwareVersion);
    newColumns.push(columnsMap.status);
    newColumns.push(columnsMap.spokeUsage);
    newColumns.push(columnsMap.region);
    newColumns.push(columnsMap.id);
    newColumns.push(columnsMap.hubs);
    newColumns.push(columnsMap.actions);

    setColumns(newColumns);
  };

  const filterFirewalls = (firewall: FirewallHubNetworkInfoDto) => {
    return filter.length > 0
      ? `
        ${firewall.FirewallSettings.ID}
        ${firewall.FirewallSettings.Name}
        ${firewall.AssociatedHubNetworks.map(
          (hub) => `${hub.ID}${hub.Name}`
        ).join('')}
      `
          .toLowerCase()
          .includes(filter.toLowerCase())
      : true;
  };

  const onFilterChange = (
    ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    text: string
  ) => {
    setFilter(text);
  };

  const firewallSelection = new Selection<FirewallHubNetworkInfoDto>({
    getKey: (item) => item?.FirewallSettings?.ID,
    onSelectionChanged: () => {
      dispatch(setSelectedFirewalls(firewallSelection.getSelection()));
    },
  });

  const itemToKey = (item: FirewallHubNetworkInfoDto) => {
    return item?.FirewallSettings.ID;
  };

  const selectedFirewalls = useSelector(getSelectedFirewalls);
  const isCreateHubNetworkDnsRecordCreationJobPending = useSelector(
    getIsCreateHubNetworkDnsRecordCreationJobPending
  );
  const [hideCreateDnsDialog, { toggle: toggleCreateDnsDialog }] =
    useBoolean(true);
  const [hideSoftwareUpdateDialog, { toggle: toggleSoftwareUpdateDialog }] =
    useBoolean(true);

  const dialogStyles = { main: { maxWidth: 450 } };
  const dragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu,
    keepInBounds: true,
  };

  const [isDraggable] = useBoolean(false);
  const labelId: string = useId('dialogLabel');
  const subTextId: string = useId('subTextLabel');

  const modalProps = React.useMemo(
    () => ({
      titleAriaId: labelId,
      subtitleAriaId: subTextId,
      isBlocking: false,
      styles: dialogStyles,
      dragOptions: isDraggable ? dragOptions : undefined,
    }),
    [isDraggable, labelId, subTextId]
  );

  const variableText =
    selectedFirewalls.length === 1
      ? 'this firewall?'
      : selectedFirewalls.length + ' firewalls?';
  const normalTitle = `Are you sure you want to create new DNS records for hub networks on ${variableText}`;
  const normalSubtext = 'This action cannot be undone.';

  const dialogContentProps = {
    type: DialogType.normal,
    title: `${normalTitle}`,
    closeButtonAriaLabel: 'Close',
    subText: `${normalSubtext}`,
  };

  const user = useSelector(getCatalogUserProfile);

  const confirmCreation = async () => {
    const selectedFirewallIds = selectedFirewalls.map(
      (f) => f?.FirewallSettings?.ID
    );
    const hubNetworkDnsRecordCreationJobDto = {
      RequestedBy: user.Mail,
      FirewallIds: selectedFirewallIds,
    } as HubNetworkDnsRecordCreationJobDto;
    toggleCreateDnsDialog();
    await createHubNetworkDnsRecordCreationJob(
      hubNetworkDnsRecordCreationJobDto
    )(dispatch);
  };

  React.useEffect(() => {
    buildColumnsObject();
  }, []);

  React.useEffect(() => {
    if (firewalls) {
      sortFirewalls();
    }
  }, [firewalls, sortKey, sortAscending, filter]);

  return (
    <div>
      <Stack>
        {props.includeTitle && (
          <Text as='h1' variant='xLarge'>
            Firewalls
          </Text>
        )}
        {firewallsLoading ? (
          <Stack className={commonStyles.fullHeight} horizontalAlign='center'>
            <Spinner size={SpinnerSize.large} />
          </Stack>
        ) : (
          <Stack className={commonStyles.autoOverflow80vh}>
            <Stack className={styles.commandBarWrapper}>
              {
                <>
                  <Stack
                    className={clsx(
                      styles.commandBarRow,
                      commonStyles.overflowXAuto
                    )}
                    horizontal
                    horizontalAlign='space-between'
                  >
                    <Stack grow={4} verticalAlign='center'>
                      <SearchBox
                        placeholder='Filter by Name, ID, Hub ID, or Hub Name'
                        onChange={onFilterChange}
                        iconProps={filterIcon}
                      />
                      <Announced
                        message={`Number of firewalls after filter applied: ${sortedFirewalls.length}.`}
                      />
                    </Stack>
                    <Stack
                      grow={2}
                      horizontalAlign='end'
                      verticalAlign='center'
                      horizontal={true}
                    >
                      <Stack.Item>
                        {firewallSoftwareUpdateFeatureFlag && (
                          <CommandButton
                            text='Software Update'
                            iconProps={{ iconName: 'SyncOccurence' }}
                            onClick={() => toggleSoftwareUpdateDialog()}
                            disabled={selectedFirewalls.length === 0}
                          />
                        )}
                      </Stack.Item>
                      <Stack.Item>
                        <CommandButton
                          text=' Create DNS records'
                          iconProps={{ iconName: 'BuildQueueNew' }}
                          onClick={() => toggleCreateDnsDialog()}
                          disabled={
                            selectedFirewalls.length === 0 ||
                            isCreateHubNetworkDnsRecordCreationJobPending
                          }
                        />
                      </Stack.Item>
                      <Stack.Item>
                        {firewallDeploymentFeatureFlag && <NewFirewallButton />}
                      </Stack.Item>
                    </Stack>
                  </Stack>
                </>
              }
            </Stack>
            <Dialog
              hidden={hideCreateDnsDialog}
              onDismiss={toggleCreateDnsDialog}
              dialogContentProps={dialogContentProps}
              modalProps={modalProps}
            >
              <DialogFooter>
                <PrimaryButton onClick={confirmCreation} text={'Create'} />
                <PrimaryButton
                  onClick={toggleCreateDnsDialog}
                  text={'Cancel'}
                />
              </DialogFooter>
            </Dialog>
            {
              <FirewallSoftwareUpdateDialog
                hideDialog={hideSoftwareUpdateDialog}
                firewalls={selectedFirewalls}
                onDismiss={toggleSoftwareUpdateDialog}
              />
            }
            <DetailsList
              items={sortedFirewalls}
              columns={columns}
              selectionMode={SelectionMode.multiple}
              layoutMode={DetailsListLayoutMode.justified}
              isHeaderVisible={true}
              selection={firewallSelection as Selection<IObjectWithKey>}
              setKey={'multiple'}
              getKey={itemToKey}
              checkboxVisibility={CheckboxVisibility.always}
              checkButtonAriaLabel={'checkbox'}
              ariaLabelForSelectAllCheckbox={'select all checkbox'}
            />
          </Stack>
        )}
      </Stack>
      <FirewallPropertiesPanel />
    </div>
  );
};

export default FirewallListView;
