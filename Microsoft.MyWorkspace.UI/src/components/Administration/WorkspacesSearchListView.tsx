import * as React from 'react';
import {
  Text,
  Stack,
  SelectionMode,
  DetailsList,
  DetailsListLayoutMode,
  ColumnActionsMode,
  IColumn,
  Link,
} from '@fluentui/react';

import { useDispatch, useSelector } from 'react-redux';
import { WorkspaceActionsButton } from '../MyWorkspaces/WorkspaceMachineProperties/WorkspaceProperties/WorkspaceActionButtons/WorkspaceActionButtons';
import { AzureWorkspaceDto } from '../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { getAzureWorkspaceSearchResults } from '../../store/selectors/azureWorkspaceSelectors';

import {
  ResourceStateDotIcon,
  getResourceStateText,
} from '../MyWorkspaces/WorkspaceStatusIcons';
import { formatDateString } from '../../shared/DateTimeHelpers';
import { useHistory } from 'react-router-dom';
import { setSelectedAdminWorkspace } from '../../store/actions';

export const WorkspacesSearchListView = (): JSX.Element => {
  const workspaceList: AzureWorkspaceDto[] = useSelector(
    getAzureWorkspaceSearchResults
  );

  const history = useHistory();
  const dispatch = useDispatch();
  const [columns, setColumns] = React.useState<IColumn[]>([]);
  const [sortKey, setSortKey] = React.useState<keyof AzureWorkspaceDto>('Name');
  const [sortAscending, setSortAscending] = React.useState(true);
  const [workspaces, setWorkspaces] = React.useState<AzureWorkspaceDto[]>([]);

  const columnsMap: Record<string, IColumn> = {
    name: {
      key: 'name',
      name: 'Name',
      ariaLabel: 'name column',
      fieldName: 'Name',
      minWidth: 120,
      maxWidth: 240,
      isResizable: true,
      onColumnClick: () => handleColumnClick('Name'),
      isSorted: sortKey === 'Name',
      isSortedDescending: sortKey === 'Name' && !sortAscending,
    },
    status: {
      key: 'status',
      name: 'Status',
      ariaLabel: 'workspace status column',
      minWidth: 120,
      maxWidth: 120,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (workspace: AzureWorkspaceDto) => (
        <Stack horizontal verticalAlign='center' tokens={{ childrenGap: 4 }}>
          <ResourceStateDotIcon resourceState={workspace.State} />
          <Text variant='small'>{getResourceStateText(workspace.State)}</Text>
        </Stack>
      ),
    },
    owner: {
      key: 'OwnerEmail',
      name: 'Owner',
      ariaLabel: 'owner column',
      fieldName: 'OwnerEmail',
      minWidth: 120,
      maxWidth: 240,
      isResizable: true,
      onColumnClick: () => handleColumnClick('OwnerEmail'),
      isSorted: sortKey === 'OwnerEmail',
      isSortedDescending: sortKey === 'OwnerEmail' && !sortAscending,
    },
    created: {
      key: 'Created',
      name: 'Created',
      ariaLabel: 'created date column',
      minWidth: 60,
      maxWidth: 140,
      isResizable: true,
      onRender: (workspace: AzureWorkspaceDto) => (
        <Stack>
          <Text variant='small'>
            {workspace.Created ? formatDateString(workspace.Created) : ''}
          </Text>
        </Stack>
      ),
      onColumnClick: () => handleColumnClick('Created'),
      isSorted: sortKey === 'Created',
      isSortedDescending: sortKey === 'Created' && !sortAscending,
    },
    region: {
      key: 'region',
      name: 'Region',
      ariaLabel: 'azure region column',
      minWidth: 60,
      maxWidth: 240,
      isResizable: true,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (workspace: AzureWorkspaceDto) => {
        return (
          <Stack>
            <Text variant='small'>{workspace.Location}</Text>
          </Stack>
        );
      },
    },
    workspaceID: {
      key: 'workspaceID',
      name: 'Workspace ID',
      ariaLabel: 'workspace ID column',
      minWidth: 60,
      maxWidth: 240,
      isResizable: true,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (workspace: AzureWorkspaceDto) => {
        return (
          <Stack>
            <Link
              onClick={() => {
                dispatch(setSelectedAdminWorkspace(workspace));
                history.push(`/admin/${workspace.ID}`);
              }}
            >
              {workspace.ID}
            </Link>
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
      onRender: (workspace: AzureWorkspaceDto) => (
        <Stack horizontalAlign='end'>
          <WorkspaceActionsButton workspace={workspace} />
        </Stack>
      ),
    },
  };

  const handleColumnClick = (key: keyof AzureWorkspaceDto) => {
    if (key === sortKey) {
      setSortAscending(!sortAscending);
    } else {
      setSortKey(key);
      setSortAscending(true);
    }
  };

  const sortWorkspaces = () => {
    const key = sortKey as keyof AzureWorkspaceDto;
    setWorkspaces(
      [...workspaceList].sort((a, b) =>
        (sortAscending ? a[key] > b[key] : a[key] < b[key]) ? 1 : -1
      )
    );
    buildColumnsObject();
  };

  const buildColumnsObject = () => {
    const newColumns: IColumn[] = [];
    // newColumns.push(columnsMap.warnings);
    newColumns.push(columnsMap.workspaceID);
    newColumns.push(columnsMap.name);
    newColumns.push(columnsMap.status);
    newColumns.push(columnsMap.owner);
    newColumns.push(columnsMap.created);

    // newColumns.push(columnsMap.actions);

    setColumns(newColumns);
  };

  React.useEffect(() => {
    buildColumnsObject();
  }, []);

  React.useEffect(() => {
    sortWorkspaces();
  }, [workspaceList, sortKey, sortAscending]);

  return (
    <DetailsList
      items={workspaces}
      columns={columns}
      selectionMode={SelectionMode.none}
      layoutMode={DetailsListLayoutMode.justified}
      isHeaderVisible={true}
    />
  );
};
