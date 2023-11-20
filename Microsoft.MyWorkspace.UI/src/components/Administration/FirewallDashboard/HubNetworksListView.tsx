import * as React from 'react';

import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import { useSelector } from 'react-redux';
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
  FontIcon,
  TooltipHost,
  Announced,
  SearchBox,
  IIconProps,
  useTheme,
} from '@fluentui/react';
import { HubNetworkDto } from '../../../types/FirewallManager/HubNetworkDto';
import { HubNetworkActionsButton } from './FirewallActionButtons';
import { HubNetworkPropertiesPanel } from './HubNetworkPropertiesPanel';
import { NewHubNetworkButton } from './NewHubNetworkButton';
import clsx from 'clsx';
import {
  getAdminFirewalls,
  getAdminFirewallsLoading,
} from '../../../store/selectors/adminFirewallSelectors';
import { FirewallHubNetworkInfoDto } from '../../../types/FirewallManager/FirewallHubNetworkInfoDto';
import { getAdminViewStyles } from '../AdministrationViews.styles';

interface IProps {
  firewallID?: string;
  includeTitle?: boolean;
}

const filterIcon: IIconProps = { iconName: 'Filter' };

export const HubNetworksListView = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getAdminViewStyles(theme);
  const [columns, setColumns] = React.useState<IColumn[]>([]);
  const [sortKey, setSortKey] = React.useState<keyof HubNetworkDto>('Name');
  const [sortAscending, setSortAscending] = React.useState(true);
  const [sortedHubs, setSortedHubs] = React.useState<HubNetworkDto[]>();
  const [filter, setFilter] = React.useState('');

  const firewallsLoading: boolean = useSelector(getAdminFirewallsLoading);
  const firewalls: FirewallHubNetworkInfoDto[] = useSelector(getAdminFirewalls);

  const hubs = React.useMemo(() => {
    const hubList = props.firewallID
      ? firewalls?.find((f) => f.FirewallSettings.ID === props.firewallID)
          ?.AssociatedHubNetworks
      : firewalls?.reduce(
          (previous, fw) => previous.concat(fw.AssociatedHubNetworks),
          []
        );
    return hubList ? hubList : [];
  }, [props.firewallID, firewalls]);

  const firewall = React.useMemo(() => {
    return firewalls?.find((f) => f.FirewallSettings.ID === props.firewallID)
      ?.FirewallSettings;
  }, [props.firewallID, firewalls]);

  const columnsMap: Record<string, IColumn> = {
    warnings: {
      key: 'Warnings',
      isIconOnly: true,
      name: '',
      ariaLabel: 'warnings column',
      minWidth: 40,
      maxWidth: 80,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (hub: HubNetworkDto) => (
        <Stack horizontalAlign='center' tokens={{ childrenGap: 8 }} horizontal>
          {!hub.IsPublished && (
            <TooltipHost content='Unpublished'>
              <FontIcon
                iconName='Hide'
                aria-label='hub network is unpublished'
                className={clsx(commonStyles.warningText, commonStyles.font18)}
              />
            </TooltipHost>
          )}

          {hub.TotalSpokeNetworksConsumed / hub.MaxSpokeNetworksAllowed >=
            0.8 && (
            <TooltipHost content='High Spoke Usage'>
              <FontIcon
                iconName='Warning'
                aria-label='hub network has high spoke usage'
                className={clsx(commonStyles.errorText, commonStyles.font18)}
              />
            </TooltipHost>
          )}
        </Stack>
      ),
    },
    name: {
      key: 'name',
      name: 'Name',
      ariaLabel: 'name column',
      fieldName: 'Name',
      minWidth: 120,
      maxWidth: 360,
      isResizable: true,
      onColumnClick: () => handleColumnClick('Name'),
      isSorted: sortKey === 'Name',
      isSortedDescending: sortKey === 'Name' && !sortAscending,
    },
    spokeUsage: {
      key: 'spokeUsage',
      name: 'Spoke Usage',
      ariaLabel: 'spoke usage column',
      minWidth: 120,
      maxWidth: 360,
      isResizable: true,
      onColumnClick: () => handleColumnClick('TotalSpokeNetworksConsumed'),
      isSorted: sortKey === 'TotalSpokeNetworksConsumed',
      isSortedDescending:
        sortKey === 'TotalSpokeNetworksConsumed' && !sortAscending,
      onRender: (hub: HubNetworkDto) => {
        return (
          <Stack>
            <Text variant='small'>{`${hub.TotalSpokeNetworksConsumed} / ${hub.MaxSpokeNetworksAllowed}`}</Text>
          </Stack>
        );
      },
    },
    region: {
      key: 'region',
      name: 'Region',
      ariaLabel: 'region column',
      fieldName: 'Location',
      minWidth: 120,
      maxWidth: 300,
      isResizable: true,
      onColumnClick: () => handleColumnClick('Location'),
      isSorted: sortKey === 'Location',
      isSortedDescending: sortKey === 'Location' && !sortAscending,
    },
    firewallID: {
      key: 'firewallid',
      name: 'Firewall ID',
      ariaLabel: 'firewall id column',
      fieldName: 'FirewallID',
      minWidth: 240,
      maxWidth: 400,
      isResizable: true,
      onColumnClick: () => handleColumnClick('FirewallID'),
      isSorted: sortKey === 'FirewallID',
      isSortedDescending: sortKey === 'FirewallID' && !sortAscending,
    },
    id: {
      key: 'id',
      name: 'Hub ID',
      ariaLabel: 'id column',
      fieldName: 'ID',
      minWidth: 240,
      maxWidth: 400,
      isResizable: true,
      onColumnClick: () => handleColumnClick('ID'),
      isSorted: sortKey === 'ID',
      isSortedDescending: sortKey === 'ID' && !sortAscending,
    },
    hubAddressSpace: {
      key: 'hubAddress',
      name: 'Hub Address Space',
      ariaLabel: 'hub address space column',
      fieldName: 'HubAddressSpace',
      minWidth: 120,
      maxWidth: 300,
      isResizable: true,
      onColumnClick: () => handleColumnClick('HubAddressSpace'),
      isSorted: sortKey === 'HubAddressSpace',
      isSortedDescending: sortKey === 'HubAddressSpace' && !sortAscending,
    },
    spokeAddressSpace: {
      key: 'spokeAddress',
      name: 'Spoke Address Space',
      ariaLabel: 'spoke address space column',
      fieldName: 'SpokeAddressSpace',
      minWidth: 120,
      maxWidth: 300,
      isResizable: true,
      onColumnClick: () => handleColumnClick('SpokeAddressSpace'),
      isSorted: sortKey === 'SpokeAddressSpace',
      isSortedDescending: sortKey === 'SpokeAddressSpace' && !sortAscending,
    },
    actions: {
      key: 'Actions',
      isIconOnly: true,
      name: '',
      ariaLabel: 'actions column',
      minWidth: 40,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (hub: HubNetworkDto) => (
        <Stack horizontalAlign='end'>
          <HubNetworkActionsButton hub={hub} />
        </Stack>
      ),
    },
  };

  const sortHubs = () => {
    const key = sortKey as keyof HubNetworkDto;
    setSortedHubs(
      [...hubs]
        .filter(filterHubs)
        .sort((a, b) =>
          (sortAscending ? a[key] > b[key] : a[key] < b[key]) ? 1 : -1
        )
    );
    buildColumnsObject();
  };

  const filterHubs = (hub: HubNetworkDto) => {
    return filter.length > 0
      ? `
        ${hub.ID}
        ${hub.Name}
        ${hub.FirewallID}
      `
          .toLowerCase()
          .includes(filter.toLowerCase())
      : true;
  };

  const handleColumnClick = (key: keyof HubNetworkDto) => {
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
    newColumns.push(columnsMap.spokeUsage);
    newColumns.push(columnsMap.region);
    newColumns.push(columnsMap.firewallID);
    newColumns.push(columnsMap.id);
    newColumns.push(columnsMap.hubAddressSpace);
    newColumns.push(columnsMap.spokeAddressSpace);
    newColumns.push(columnsMap.actions);

    setColumns(newColumns);
  };

  React.useEffect(() => {
    buildColumnsObject();
  }, []);

  const onFilterChange = (
    ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    text: string
  ) => {
    setFilter(text);
  };

  React.useEffect(() => {
    if (hubs && hubs.length > 0) {
      sortHubs();
    }
  }, [hubs, sortKey, sortAscending, filter]);

  return (
    <div>
      <Stack>
        {props.includeTitle && (
          <Text as='h1' variant='xLarge'>
            Hub Networks
          </Text>
        )}
        {firewallsLoading && (
          <Stack className={commonStyles.fullHeight} horizontalAlign='center'>
            <Spinner size={SpinnerSize.large} />
          </Stack>
        )}
        {!firewallsLoading && (
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
                        placeholder='Filter by Name, ID, or Firewall ID'
                        onChange={onFilterChange}
                        iconProps={filterIcon}
                      />
                      <Announced
                        message={`Number of firewalls after filter applied: ${sortedHubs?.length}.`}
                      />
                    </Stack>
                    <Stack
                      grow={2}
                      horizontalAlign='end'
                      verticalAlign='center'
                    >
                      <NewHubNetworkButton firewall={firewall} />
                    </Stack>
                  </Stack>
                </>
              }
            </Stack>
            {sortedHubs ? (
              <DetailsList
                items={sortedHubs}
                columns={columns}
                selectionMode={SelectionMode.none}
                layoutMode={DetailsListLayoutMode.justified}
                isHeaderVisible={true}
              />
            ) : (
              <Text variant='xLarge' as='h3'>
                No Associated Hub Networks
              </Text>
            )}
          </Stack>
        )}
      </Stack>
      <HubNetworkPropertiesPanel />
    </div>
  );
};

export default HubNetworksListView;
