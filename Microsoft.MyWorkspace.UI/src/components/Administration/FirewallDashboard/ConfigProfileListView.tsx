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
  Announced,
  IIconProps,
  SearchBox,
  useTheme,
} from '@fluentui/react';
import {
  getAdminConfigProfiles,
  getAdminConfigProfilesLoading,
} from '../../../store/selectors/adminFirewallSelectors';

import { getAdminViewStyles } from '../AdministrationViews.styles';
import { ConfigProfileDto } from '../../../types/FirewallManager/ConfigProfileDto.types';
import { ConfigProfileActionsButton } from './FirewallActionButtons';
import { ConfigProfilePropertiesPanel } from './ConfigProfilePropertiesPanel';
import { NewConfigProfileButton } from './NewConfigProfileButton';
import clsx from 'clsx';

const filterIcon: IIconProps = { iconName: 'Filter' };

export const ConfigProfileListView = (): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getAdminViewStyles(theme);
  const [columns, setColumns] = React.useState<IColumn[]>([]);
  const [sortKey, setSortKey] = React.useState<keyof ConfigProfileDto>('Name');
  const [sortAscending, setSortAscending] = React.useState(true);
  const [sortedProfiles, setSortedProfiles] = React.useState<
    ConfigProfileDto[]
  >([]);
  const [filter, setFilter] = React.useState('');

  const profilesLoading: boolean = useSelector(getAdminConfigProfilesLoading);
  const profiles: ConfigProfileDto[] = useSelector(getAdminConfigProfiles);

  const columnsMap: Record<string, IColumn> = {
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
      onRender: (profile: ConfigProfileDto) => {
        return (
          <Stack>
            <Text variant='small'>{profile.Name}</Text>
          </Stack>
        );
      },
    },
    description: {
      key: 'description',
      name: 'Description',
      ariaLabel: 'description column',
      minWidth: 120,
      maxWidth: 360,
      isResizable: true,
      onColumnClick: () => handleColumnClick('Description'),
      isSorted: sortKey === 'Description',
      isSortedDescending: sortKey === 'Description' && !sortAscending,
      onRender: (profile: ConfigProfileDto) => {
        return (
          <Stack>
            <Text variant='small'>{profile.Description}</Text>
          </Stack>
        );
      },
    },
    id: {
      key: 'id',
      name: 'ID',
      ariaLabel: 'id column',
      minWidth: 120,
      maxWidth: 360,
      isResizable: true,
      onColumnClick: () => handleColumnClick('ID'),
      isSorted: sortKey === 'ID',
      isSortedDescending: sortKey === 'ID' && !sortAscending,
      onRender: (profile: ConfigProfileDto) => {
        return (
          <Stack>
            <Text variant='small'>{profile.ID}</Text>
          </Stack>
        );
      },
    },
    actions: {
      key: 'Actions',
      isIconOnly: true,
      name: '',
      ariaLabel: 'actions column',
      minWidth: 40,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (profile: ConfigProfileDto) => (
        <Stack horizontalAlign='end'>
          <ConfigProfileActionsButton configProfile={profile} />
        </Stack>
      ),
    },
  };

  const sortProfiles = () => {
    const key = sortKey as keyof ConfigProfileDto;
    setSortedProfiles(
      [...profiles]
        .filter(filterProfiles)
        .sort((a, b) =>
          a[key]
            ? (sortAscending ? a[key] > b[key] : a[key] < b[key])
              ? 1
              : -1
            : (sortAscending ? a[key] > b[key] : a[key] < b[key])
            ? 1
            : -1
        )
    );
    buildColumnsObject();
  };

  const handleColumnClick = (key: keyof ConfigProfileDto) => {
    if (key === sortKey) {
      setSortAscending(!sortAscending);
    } else {
      setSortKey(key);
      setSortAscending(true);
    }
  };

  const buildColumnsObject = () => {
    const newColumns: IColumn[] = [];
    newColumns.push(columnsMap.name);
    newColumns.push(columnsMap.description);
    newColumns.push(columnsMap.id);
    newColumns.push(columnsMap.actions);

    setColumns(newColumns);
  };

  const filterProfiles = (profile: ConfigProfileDto) => {
    return filter.length > 0
      ? `
        ${profile.ID}
        ${profile.Name}
        ${profile.Description}
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

  React.useEffect(() => {
    buildColumnsObject();
  }, []);

  React.useEffect(() => {
    if (profiles) {
      sortProfiles();
    }
  }, [profiles, sortKey, sortAscending, filter]);

  return (
    <div>
      <Stack>
        {profilesLoading ? (
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
                        placeholder='Filter by Name, ID, or Description'
                        onChange={onFilterChange}
                        iconProps={filterIcon}
                      />
                      <Announced
                        message={`Number of configurations after filter applied: ${sortedProfiles.length}.`}
                      />
                    </Stack>
                    <Stack
                      grow={2}
                      horizontalAlign='end'
                      verticalAlign='center'
                    >
                      <NewConfigProfileButton />
                    </Stack>
                  </Stack>
                </>
              }
            </Stack>

            {profiles.length > 0 ? (
              <DetailsList
                items={sortedProfiles}
                columns={columns}
                selectionMode={SelectionMode.none}
                layoutMode={DetailsListLayoutMode.justified}
                isHeaderVisible={true}
              />
            ) : (
              <Stack
                className={commonStyles.fullHeight}
                horizontalAlign='start'
              >
                <Text className={commonStyles.margin20} variant='xLarge'>
                  No Configuration Profiles
                </Text>
              </Stack>
            )}
          </Stack>
        )}
      </Stack>
      <ConfigProfilePropertiesPanel />
    </div>
  );
};
