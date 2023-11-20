import * as React from 'react';
import {
  Text,
  Stack,
  SelectionMode,
  DetailsListLayoutMode,
  ColumnActionsMode,
  IColumn,
  Link,
  TooltipHost,
  Icon,
  useTheme,
  ShimmeredDetailsList,
} from '@fluentui/react';
import { useHistory } from 'react-router';

import { useSelector } from 'react-redux';
import useDashboardSettings, {
  DashboardSettings,
} from '../../../shared/DashboardSettings';
import { WorkspaceActionsButton } from '../WorkspaceMachineProperties/WorkspaceProperties/WorkspaceActionButtons/WorkspaceActionButtons';
import { AzureWorkspaceDto } from '../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { getAzureWorkspaces } from '../../../store/selectors/azureWorkspaceSelectors';
import {
  ResourceStateDotIcon,
  getResourceStateText,
} from '../WorkspaceStatusIcons';
import { WorkspaceShutdownTimeRemaining } from '../../GeneralComponents/TimeRemaining/WorkspaceShutdownTimeRemaining';
import {
  IsOn,
  ShouldDisplayStaleWorkspaceWarning,
} from '../../../shared/helpers/WorkspaceHelper';
import { formatDateString } from '../../../shared/DateTimeHelpers';
import { JitRDPAccessButton } from '../JitRDP/JitRDPAccessButton';
import {
  getFeatureFlagComplianceMonitoring,
  getFeatureFlagExtendWorkspaceRuntime,
  getFeatureFlagStaleWorkspaceDeletion,
  getJitEnabled,
  getStaleWorkspaceDeletionWarningThreshold,
  getUserRoleAssignmentConstraint,
} from '../../../store/selectors';
import { ResourceState } from '../../../types/AzureWorkspace/enums/ResourceState';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import { StaleWorkspaceDeletionTimeRemaining } from '../../GeneralComponents/TimeRemaining/StaleWorkspaceDeletionTimeRemaining';
import { ComplianceStatus } from './ComplianceStatus';

interface IProps {
  openJit: (workspaceID: string, id?: string) => void;
}

export const WorkspacesListView = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const staleWorkspaceDeletionWarningThreshold = useSelector(
    getStaleWorkspaceDeletionWarningThreshold
  );
  const allWorkspaces: AzureWorkspaceDto[] = useSelector(getAzureWorkspaces);
  const settings: DashboardSettings = useDashboardSettings();
  const history = useHistory();
  const jitEnabled = useSelector(getJitEnabled);
  const userRoleAssignmentConstraint = useSelector(
    getUserRoleAssignmentConstraint
  );
  const featureFlagStaleWorkspaceDeletion = useSelector(
    getFeatureFlagStaleWorkspaceDeletion
  );
  const segmentConstraint = useSelector(getUserRoleAssignmentConstraint);
  const complianceMonitoringFeatureFlag = useSelector(
    getFeatureFlagComplianceMonitoring
  );

  const [columns, setColumns] = React.useState<IColumn[]>([]);
  const [sortKey, setSortKey] = React.useState<keyof AzureWorkspaceDto>('Name');
  const [sortAscending, setSortAscending] = React.useState(true);
  const [workspaces, setWorkspaces] = React.useState<AzureWorkspaceDto[]>([]);

  const extendWorkspaceRuntimeEnabled = useSelector(
    getFeatureFlagExtendWorkspaceRuntime
  );

  const columnsList: IColumn[] = [
    {
      key: 'name',
      name: 'Name',
      ariaLabel: 'name column',
      fieldName: 'Name',
      minWidth: 120,
      maxWidth: 220,
      isResizable: true,
      onRender: (workspace: AzureWorkspaceDto) => (
        <Stack
          horizontal
          horizontalAlign='space-between'
          verticalAlign='center'
          className={commonStyles.fullHeight}
        >
          <Text
            variant='small'
            nowrap
            className={commonStyles.textOverflowEllipsis}
          >
            <Link
              className={commonStyles.fullWidth}
              onClick={() => history.push(`/${workspace.ID}`)}
            >
              {workspace.Name}
            </Link>
          </Text>
          {workspace.PrivateMode && (
            <TooltipHost content={'Private Mode Enabled'}>
              <Icon
                iconName='LockSolid'
                aria-label='Private Mode Enabled'
                className={`${commonStyles.displayBlock} ${commonStyles.cursorDefault}`}
              />
            </TooltipHost>
          )}
        </Stack>
      ),
      onColumnClick: () => handleColumnClick('Name'),
      isSorted: sortKey === 'Name',
      isSortedDescending: sortKey === 'Name' && !sortAscending,
    },
    {
      key: 'status',
      name: 'Status',
      ariaLabel: 'workspace status column',
      fieldName: 'Status',
      minWidth: 150,
      maxWidth: 170,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (workspace: AzureWorkspaceDto) => {
        const shouldStaleWorkspaceDeletionWarningDisplay =
          featureFlagStaleWorkspaceDeletion &&
          ShouldDisplayStaleWorkspaceWarning(
            workspace,
            userRoleAssignmentConstraint,
            staleWorkspaceDeletionWarningThreshold
          );
        const shouldShutdownTimerDisplay =
          !shouldStaleWorkspaceDeletionWarningDisplay &&
          IsOn(workspace) &&
          workspace.EndRunTime &&
          extendWorkspaceRuntimeEnabled;
        return (
          <Stack
            horizontal
            verticalAlign='center'
            className={commonStyles.fullHeight}
            tokens={{ childrenGap: 4 }}
          >
            <ResourceStateDotIcon resourceState={workspace.State} />
            <Text
              id={`${workspace.ID}-${getResourceStateText(workspace.State)}`}
              variant='small'
            >
              {getResourceStateText(workspace.State)}
            </Text>
            {shouldStaleWorkspaceDeletionWarningDisplay && (
              <StaleWorkspaceDeletionTimeRemaining
                workspace={workspace}
                variant='small'
              />
            )}
            {shouldShutdownTimerDisplay && (
              <WorkspaceShutdownTimeRemaining
                workspace={workspace}
                variant='small'
              />
            )}
          </Stack>
        );
      },
    },
    {
      key: 'jit',
      name: 'JIT Status',
      ariaLabel: 'jit column',
      fieldName: 'Jit',
      minWidth: 145,
      maxWidth: 155,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (workspace: AzureWorkspaceDto) => (
        <JitRDPAccessButton
          workspace={workspace}
          openJit={() => props.openJit(workspace.ID)}
          disabled={!jitEnabled}
        />
      ),
    },
    {
      key: 'description',
      name: 'Description',
      ariaLabel: 'description column',
      fieldName: 'Description',
      minWidth: 80,
      maxWidth: 360,
      isResizable: true,
      onRender: (workspace: AzureWorkspaceDto) => (
        <Stack verticalAlign='center' className={commonStyles.fullHeight}>
          <Text variant='small'>{workspace.Description}</Text>
        </Stack>
      ),
      onColumnClick: () => handleColumnClick('Description'),
      isSorted: sortKey === 'Description',
      isSortedDescending: sortKey === 'Description' && !sortAscending,
    },
    {
      key: 'geography',
      name: 'Geography',
      ariaLabel: 'azure geography column',
      fieldName: 'Geography',
      minWidth: 80,
      maxWidth: 140,
      isResizable: true,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (workspace: AzureWorkspaceDto) => {
        return (
          <Stack verticalAlign='center' className={commonStyles.fullHeight}>
            <Text variant='small'>{workspace.Geography}</Text>
          </Stack>
        );
      },
    },
    {
      key: 'region',
      name: 'Region',
      ariaLabel: 'azure region column',
      fieldName: 'Region',
      minWidth: 60,
      maxWidth: 140,
      isResizable: true,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (workspace: AzureWorkspaceDto) => {
        return (
          <Stack verticalAlign='center' className={commonStyles.fullHeight}>
            <Text variant='small'>{workspace.Location}</Text>
          </Stack>
        );
      },
    },
    {
      key: 'compliance',
      name: 'Compliance Status',
      ariaLabel: 'Compliance Status',
      fieldName: 'Compliance',
      minWidth: 145,
      maxWidth: 155,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (workspace: AzureWorkspaceDto) => {
        return <ComplianceStatus workspace={workspace}></ComplianceStatus>;
      },
    },
    {
      key: 'OwnerEmail',
      name: 'Owner',
      ariaLabel: 'owner column',
      fieldName: 'OwnerEmail',
      minWidth: 120,
      maxWidth: 240,
      isResizable: true,
      onRender: (workspace: AzureWorkspaceDto) => (
        <Stack verticalAlign='center' className={commonStyles.fullHeight}>
          <Text variant='small'>{workspace.OwnerEmail}</Text>
        </Stack>
      ),
      onColumnClick: () => handleColumnClick('OwnerEmail'),
      isSorted: sortKey === 'OwnerEmail',
      isSortedDescending: sortKey === 'OwnerEmail' && !sortAscending,
    },
    {
      key: 'workspaceID',
      name: 'Workspace ID',
      ariaLabel: 'workspace ID column',
      fieldName: 'workspaceID',
      minWidth: 60,
      maxWidth: 240,
      isResizable: true,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (workspace: AzureWorkspaceDto) => {
        return (
          <Stack verticalAlign='center' className={commonStyles.fullHeight}>
            <Text variant='small'>{workspace.ID}</Text>
          </Stack>
        );
      },
    },
    {
      key: 'sharedOwners',
      name: 'Shared Owners',
      ariaLabel: 'shared owners column',
      fieldName: 'SharedOwners',
      minWidth: 60,
      maxWidth: 240,
      isResizable: true,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (workspace: AzureWorkspaceDto) => {
        return (
          <Stack verticalAlign='center' className={commonStyles.fullHeight}>
            <Text variant='small'>
              {workspace.SharedOwnerEmails?.toString()}
            </Text>
          </Stack>
        );
      },
    },
    {
      key: 'Created',
      name: 'Created',
      ariaLabel: 'created date column',
      fieldName: 'Created',
      minWidth: 60,
      maxWidth: 140,
      isResizable: true,
      onRender: (workspace: AzureWorkspaceDto) => (
        <Stack verticalAlign='center' className={commonStyles.fullHeight}>
          <Text variant='small'>
            {workspace.Created ? formatDateString(workspace.Created) : ''}
          </Text>
        </Stack>
      ),
      onColumnClick: () => handleColumnClick('Created'),
      isSorted: sortKey === 'Created',
      isSortedDescending: sortKey === 'Created' && !sortAscending,
    },
    {
      key: 'machines',
      name: 'Machines',
      ariaLabel: 'machines column',
      fieldName: 'Machines',
      minWidth: 120,
      maxWidth: 360,
      isResizable: true,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (workspace: AzureWorkspaceDto) => {
        const virtualMachineList = workspace.VirtualMachines;
        return (
          <Stack verticalAlign='center' className={commonStyles.fullHeight}>
            <Text variant='small'>
              {`${virtualMachineList.length} ${
                workspace.State == ResourceState.Deploying
                  ? 'Deployed'
                  : virtualMachineList.length === 1
                  ? ' Machine'
                  : ' Machines'
              }`}
            </Text>
          </Stack>
        );
      },
    },
    {
      key: 'actions',
      isIconOnly: true,
      name: '',
      ariaLabel: 'actions column',
      fieldName: 'Actions',
      minWidth: 40,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (workspace: AzureWorkspaceDto) => (
        <Stack horizontalAlign='end'>
          <WorkspaceActionsButton workspace={workspace} />
        </Stack>
      ),
    },
  ].filter(
    (column) =>
      column.key !== 'compliance' ||
      (complianceMonitoringFeatureFlag &&
        segmentConstraint.EnablePatchInfoForVM)
  );

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
      [...allWorkspaces].sort((a, b) =>
        (sortAscending ? a[key] > b[key] : a[key] < b[key]) ? 1 : -1
      )
    );
    buildColumnsObject();
  };

  const buildColumnsObject = () => {
    const newColumns: IColumn[] = [];
    const persistentColumnKeys = [
      'name',
      'status',
      'jit',
      'actions',
      'compliance',
    ];

    columnsList.forEach((column) => {
      const key = column.key;
      if (
        persistentColumnKeys.includes(key) ||
        settings.listViewColumns[key] ||
        settings.listViewColumns[key] === undefined
      ) {
        newColumns.push(column);
      }
    });

    setColumns(newColumns);
  };

  React.useEffect(() => {
    buildColumnsObject();
  }, [settings]);

  React.useEffect(() => {
    sortWorkspaces();
  }, [allWorkspaces, sortKey, sortAscending]);

  return (
    <ShimmeredDetailsList
      className={commonStyles.marginBottom8}
      items={workspaces}
      columns={columns}
      selectionMode={SelectionMode.none}
      layoutMode={DetailsListLayoutMode.justified}
      isHeaderVisible={true}
    />
  );
};
