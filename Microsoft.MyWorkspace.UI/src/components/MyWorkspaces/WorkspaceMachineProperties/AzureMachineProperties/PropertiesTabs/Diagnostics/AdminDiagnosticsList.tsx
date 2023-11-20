import * as React from 'react';
import {
  ITheme,
  useTheme,
  Text,
  Label,
  Stack,
  DefaultButton,
  PrimaryButton,
  IColumn,
  ColumnActionsMode,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from '@fluentui/react';
import { FocusZone, FocusZoneDirection } from '@fluentui/react/lib/FocusZone';
import { DiagnosticDto } from '../../../../../../types/AzureWorkspace/AdminDiagnostics/DiagnosticDto.types';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCurrentDiagnostic,
  runSelectedSolution,
} from '../../../../../../store/actions';
import { getCurrentDiagnosticCatalog } from '../../../../../../store/selectors';
import { getDiagnosticStyles } from './AdminDiagnostics.styles';
import { DiagnosticStateDotIcon } from './DiagnosticStatusIcons';
import { AdminDiagnosticsDetailsPanel } from './AdminDiagnosticsDetailsPanel';
import { RefreshButton } from '../../../../../../components/GeneralComponents/RefreshButton';
import { DiagnosticSolutionStatus } from '../../../../../../types/AzureWorkspace/enums/DiagnosticStatus';
import { InfoButton } from '../../../../../../components/GeneralComponents/InfoButton';
import { getFormattedDateTime } from '../../../../../../shared/DateTimeHelpers';

interface IProps {
  machineId: string;
}

// list of current diagnostics running under a workspace
export const AdminDiagnosticsList = (props: IProps): JSX.Element => {
  const theme: ITheme = useTheme();
  const styles = getDiagnosticStyles(theme);
  const dispatch = useDispatch();
  const currentDiagnosticCatalog = useSelector(getCurrentDiagnosticCatalog);
  const [openDetailsPanel, setOpenDetailsPanel] = React.useState(false);
  const [detailsPanelItem, setDetailsPanelItem] = React.useState(null);
  const [sortKey, setSortKey] = React.useState<keyof DiagnosticDto>('Name');
  const [sortAscending, setSortAscending] = React.useState(true);
  const [diagnostics, setDiagnostics] = React.useState<DiagnosticDto[]>([]);

  const columns: IColumn[] = [
    {
      key: 'Name',
      name: 'Name',
      ariaLabel: 'name column',
      fieldName: 'Name',
      minWidth: 120,
      maxWidth: 180,
      isResizable: true,
      onColumnClick: () => handleColumnClick('Name'),
      isSorted: sortKey === 'Name',
      isSortedDescending: sortKey === 'Name' && !sortAscending,
    },
    {
      key: 'Status',
      name: 'Status',
      ariaLabel: 'diagnostic status column',
      minWidth: 120,
      maxWidth: 180,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (diagnostic: DiagnosticDto) => {
        return statusDisplay(diagnostic);
      },
    },
    {
      key: 'Created',
      name: 'Created',
      ariaLabel: 'created date column',
      minWidth: 60,
      maxWidth: 180,
      isResizable: true,
      onRender: (diagnostic: DiagnosticDto) => (
        <Stack>
          <Text variant='small'>
            {diagnostic.Created
              ? getFormattedDateTime(diagnostic.Created)
              : '-'}
          </Text>
        </Stack>
      ),
      onColumnClick: () => handleColumnClick('Created'),
      isSorted: sortKey === 'Created',
      isSortedDescending: sortKey === 'Created' && !sortAscending,
    },
    {
      key: 'Action',
      name: 'Diagnostic Action',
      ariaLabel: 'diagnostic action column',
      minWidth: 60,
      maxWidth: 140,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (diagnostic: DiagnosticDto) => {
        return actionButton(diagnostic);
      },
    },
  ];

  const handleColumnClick = (key: keyof DiagnosticDto) => {
    if (key === sortKey) {
      setSortAscending(!sortAscending);
    } else {
      setSortKey(key);
      setSortAscending(true);
    }
  };

  const sortDiagnostics = () => {
    const key = sortKey as keyof DiagnosticDto;
    setDiagnostics(
      [...currentDiagnosticCatalog].sort((a, b) =>
        (sortAscending ? a[key] > b[key] : a[key] < b[key]) ? 1 : -1
      )
    );
  };

  React.useEffect(() => {
    sortDiagnostics();
  }, [currentDiagnosticCatalog, sortKey, sortAscending]);

  const [currMachineId, setCurrMachineId] = React.useState(props.machineId);
  React.useEffect(() => {
    if (currMachineId !== props.machineId) {
      setCurrMachineId(props.machineId);
      dispatch(fetchCurrentDiagnostic(props.machineId));
    }
  }, [props.machineId]);

  React.useEffect(() => {
    dispatch(fetchCurrentDiagnostic(props.machineId));
  }, [openDetailsPanel, props.machineId]);

  const statusDisplay = (item: DiagnosticDto) => {
    if (!item.Solution) {
      const status =
        item.Status === DiagnosticSolutionStatus.Active
          ? 'Running'
          : item.Status;
      return (
        <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign='center'>
          <DiagnosticStateDotIcon status={item.Status} />
          <div className={styles.itemIndex}>{`Diagnostic ${status}`}</div>
        </Stack>
      );
    } else if (item.Solution.Status) {
      const status =
        item.Solution.Status === DiagnosticSolutionStatus.Active
          ? 'Running'
          : item.Solution.Status;
      return (
        <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign='center'>
          <DiagnosticStateDotIcon status={item.Solution.Status} />
          <div
            className={styles.itemIndex}
          >{`Solution ${status}: ${item.Solution.Name}`}</div>
        </Stack>
      );
    } else {
      const status =
        item.Status === DiagnosticSolutionStatus.Active
          ? 'Running'
          : item.Status;
      return (
        <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign='center'>
          <DiagnosticStateDotIcon status={item.Status} />
          <div
            className={styles.itemIndex}
          >{`Diagnostic ${status} - Suggested Solution: ${item.Solution.Name}`}</div>
        </Stack>
      );
    }
  };

  const openPanel = (item: DiagnosticDto) => {
    setOpenDetailsPanel(true);
    setDetailsPanelItem(item);
  };

  const actionButton = (item: DiagnosticDto) => {
    if (
      !item.Solution ||
      item?.Solution?.Status === DiagnosticSolutionStatus.Completed
    ) {
      return (
        <Stack>
          <DefaultButton
            style={{ height: '40px', minWidth: '60px', maxWidth: '140px' }}
            text='View Details'
            onClick={() => openPanel(item)}
          />
          {detailsPanelItem !== null && (
            <AdminDiagnosticsDetailsPanel
              open={openDetailsPanel}
              setOpen={setOpenDetailsPanel}
              diagnostics={detailsPanelItem}
            />
          )}
        </Stack>
      );
    } else if (!item.Solution.Status) {
      return (
        <PrimaryButton
          style={{ height: '40px', minWidth: '60px', maxWidth: '140px' }}
          text='Run Solution'
          onClick={() => dispatch(runSelectedSolution(item.Id))}
        />
      );
    }
  };

  return (
    <div>
      <Stack horizontal tokens={{ childrenGap: 10 }}>
        <Text variant='xLarge'>Current Diagnostics</Text>
        <InfoButton
          buttonId={'infoButton-admin-diagnostics-refresh'}
          calloutTitle={'Admin Diagnostics Refresh'}
          calloutBody={
            'In Admin mode, you need to manually refresh diagnostics with this button to get their current state and status.'
          }
        />
        <RefreshButton
          text='refresh diagnostics'
          isRefreshing={false}
          onRefreshClick={() =>
            dispatch(fetchCurrentDiagnostic(props.machineId))
          }
        />
      </Stack>
      <FocusZone direction={FocusZoneDirection.vertical}>
        <div className={styles.container} data-is-scrollable>
          {diagnostics.length > 0 ? (
            <DetailsList
              items={diagnostics}
              columns={columns}
              selectionMode={SelectionMode.none}
              layoutMode={DetailsListLayoutMode.justified}
              isHeaderVisible={true}
            />
          ) : (
            <Label>No diagnostics under this machine have been run.</Label>
          )}
        </div>
      </FocusZone>
    </div>
  );
};
