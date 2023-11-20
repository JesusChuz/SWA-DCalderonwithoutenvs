import * as React from 'react';
import {
  CommandBarButton,
  DetailsList,
  IColumn,
  SelectionMode,
  Stack,
  Text,
  PrimaryButton,
  TooltipHost,
  useTheme,
} from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEditableWorkspace,
  getEditableWorkspaceEditType,
  getEditableWorkspaceOriginalWorkspace,
} from '../../../../../store/selectors/editableWorkspaceSelectors';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import {
  CheckSharedOwner,
  EditsDisabled,
  IsTransitioningState,
} from '../../../../../shared/helpers/WorkspaceHelper';
import {
  getCatalogUserProfile,
  getUserRoleAssignmentConstraint,
} from '../../../../../store/selectors';
import { AzureVirtualMachineSnapshotDto } from '../../../../../types/AzureWorkspace/AzureVirtualMachineSnapshotDto.types';
import { styles } from './AzureMachinePropertyTab.styles';
import {
  deleteSnapshot,
  restoreSnapshot,
} from '../../../../../store/actions/editableWorkspaceActions/editableWorkspaceVirtualMachineActions';
import { AzureVirtualMachineDto } from '../../../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { AzureWorkspaceDto } from '../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { getFormattedDateTime } from '../../../../../shared/DateTimeHelpers';
import { showUserConfirmationDialog } from '../../../../../store/actions';
import {
  ResourceStateDotIcon,
  getSnapshotResourceStateText,
} from '../../../WorkspaceStatusIcons';
import { ResourceState } from '../../../../../types/AzureWorkspace/enums/ResourceState';
import { AzureMachineSnapshotsPanel } from './AzureMachineSnapshotsComponents/AzureMachineSnapshotsPanel';
import { GetSnapshotResourceState } from '../../../../../shared/helpers/SnapshotHelpers';
import { EditsAreDisabled } from '../../../../../store/validators/ErrorConstants';
import { InfoButton } from '../../../../GeneralComponents/InfoButton';

interface IProps {
  machineIndex: number;
}

export const AzureMachineSnapshots = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const user = useSelector(getCatalogUserProfile);
  const infoButtonId = 'infoButton-create-snapshot';
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);
  const userProfile = useSelector(getCatalogUserProfile);
  const editableWorkspace = useSelector(getEditableWorkspace);
  const originalWorkspace = useSelector(getEditableWorkspaceOriginalWorkspace);
  const workspaceEditType = useSelector(getEditableWorkspaceEditType);
  const userQuotas = useSelector(getUserRoleAssignmentConstraint);

  const machines = React.useMemo(() => {
    return editableWorkspace.VirtualMachines;
  }, [editableWorkspace.VirtualMachines, workspaceEditType]);

  const snapshots = React.useMemo(
    () => (machines[props.machineIndex] as AzureVirtualMachineDto).Snapshots,
    [machines, props.machineIndex]
  );

  const snapshotsInWorkspace = React.useMemo(() => {
    return (machines as AzureVirtualMachineDto[]).reduce(
      (prevCount, currentMachine) => {
        return prevCount + currentMachine.Snapshots.length;
      },
      0
    );
  }, [machines]);

  const disableCreateSnapshot = (): boolean => {
    return (
      EditsDisabled(
        userProfile,
        editableWorkspace as AzureWorkspaceDto,
        originalWorkspace as AzureWorkspaceDto
      ) ||
      userQuotas.MaxSnapshotsPerWorkspace === 0 ||
      snapshotsInWorkspace >= userQuotas.MaxSnapshotsPerWorkspace
    );
  };

  const getTooltipMessage = (): string => {
    if (
      EditsDisabled(
        userProfile,
        editableWorkspace as AzureWorkspaceDto,
        originalWorkspace as AzureWorkspaceDto
      )
    ) {
      return EditsAreDisabled;
    }
    if (
      userQuotas.MaxSnapshotsPerWorkspace === 0 ||
      snapshotsInWorkspace >= userQuotas.MaxSnapshotsPerWorkspace
    ) {
      return 'This workspace has reached the snapshot quota.';
    }
    return '';
  };

  const getSnapshotEditsDisabled = (
    snapshot: AzureVirtualMachineSnapshotDto
  ) => {
    const state = GetSnapshotResourceState(snapshot);
    return (
      IsTransitioningState(state) ||
      EditsDisabled(
        userProfile,
        editableWorkspace as AzureWorkspaceDto,
        originalWorkspace as AzureWorkspaceDto
      )
    );
  };

  const columns = React.useMemo(() => {
    const columns: IColumn[] = [
      {
        key: 'Name',
        name: 'Name',
        minWidth: 60,
        onRender: (snapshot: AzureVirtualMachineSnapshotDto) => {
          const snapshotResourceState = GetSnapshotResourceState(snapshot);
          return (
            <Stack
              horizontal
              verticalAlign='center'
              className={commonStyles.fullHeight}
              tokens={{ childrenGap: 4 }}
            >
              <Text>{snapshot.Name}</Text>
              <TooltipHost
                content={getSnapshotResourceStateText(snapshotResourceState)}
              >
                <ResourceStateDotIcon resourceState={snapshotResourceState} />
              </TooltipHost>
            </Stack>
          );
        },
      },
      {
        key: 'Date',
        name: 'Date',
        minWidth: 175,
        onRender: (snapshot: AzureVirtualMachineSnapshotDto) => {
          return (
            <Stack verticalAlign='center' className={commonStyles.fullHeight}>
              <Text>{getFormattedDateTime(snapshot.Created)}</Text>
            </Stack>
          );
        },
      },
      {
        key: 'Disk',
        name: 'Disk',
        minWidth: 150,
        onRender: (snapshot: AzureVirtualMachineSnapshotDto) => {
          return (
            <Stack verticalAlign='center' className={commonStyles.fullHeight}>
              <Text>
                {snapshot.DiskSnapshots.map((snap) => snap.DataDisk?.Name).join(
                  ','
                )}
              </Text>
            </Stack>
          );
        },
      },
      {
        key: 'restore',
        name: '',
        minWidth: 25,
        maxWidth: 100,
        isResizable: true,
        isPadded: true,
        onRender: (snapshot: AzureVirtualMachineSnapshotDto) => {
          const snapshotResourceState = GetSnapshotResourceState(snapshot);
          return (
            <TooltipHost content='Restore Snapshot'>
              <CommandBarButton
                disabled={
                  EditsDisabled(
                    userProfile,
                    editableWorkspace as AzureWorkspaceDto,
                    originalWorkspace as AzureWorkspaceDto,
                    false,
                    true
                  ) ||
                  (snapshotResourceState !== ResourceState.Running &&
                    snapshotResourceState !== ResourceState.Off)
                }
                ariaLabel='restore snapshot'
                iconProps={{
                  iconName: 'RevToggleKey',
                }}
                className={commonStyles.transparentBackground}
                style={{ height: '100%', float: 'right' }}
                onClick={() =>
                  dispatch(
                    showUserConfirmationDialog(
                      'Warning',
                      `This action cannot be undone. The virtual machine will ${
                        (machines[props.machineIndex] as AzureVirtualMachineDto)
                          .State === ResourceState.Running
                          ? 'restart and'
                          : ''
                      } be reverted to the state it was in when the snapshot was created.`,
                      () => dispatch(restoreSnapshot(snapshot))
                    )
                  )
                }
              />
            </TooltipHost>
          );
        },
      },
      {
        key: 'delete',
        name: '',
        minWidth: 25,
        maxWidth: 100,
        isResizable: true,
        isPadded: true,
        onRender: (snapshot: AzureVirtualMachineSnapshotDto) => {
          return (
            <TooltipHost content='Delete Snapshot'>
              <CommandBarButton
                disabled={getSnapshotEditsDisabled(snapshot)}
                ariaLabel='delete snapshot'
                iconProps={{
                  iconName: 'Delete',
                }}
                className={commonStyles.transparentBackground}
                style={{ height: '100%', float: 'right' }}
                onClick={() =>
                  dispatch(
                    showUserConfirmationDialog(
                      'Warning',
                      'This snapshot will be permanently deleted.',
                      () => dispatch(deleteSnapshot(snapshot))
                    )
                  )
                }
              />
            </TooltipHost>
          );
        },
      },
    ];
    return columns;
  }, [workspaceEditType, props.machineIndex, machines[props.machineIndex]]);

  return (
    <Stack className={styles.propertiesContent}>
      <Stack
        className={`${commonStyles.fullWidth}`}
        style={{ paddingLeft: '20px', paddingTop: '10px' }}
      >
        <Stack className={`${commonStyles.fullWidth}`}>
          <Stack
            horizontal
            horizontalAlign='end'
            verticalAlign='center'
            tokens={{
              childrenGap: 8,
            }}
          >
            <TooltipHost content={getTooltipMessage()}>
              <PrimaryButton
                disabled={disableCreateSnapshot()}
                iconProps={{ iconName: 'Add' }}
                text={'Create Snapshot'}
                onClick={() => {
                  setIsPanelOpen(true);
                }}
              />
            </TooltipHost>
            <InfoButton
              buttonId={infoButtonId}
              calloutTitle={'Snapshots'}
              calloutBody={
                <>
                  <Text>
                    Snapshots preserve the contents of the OS and data disks of
                    a virtual machine at a given point in time.
                  </Text>
                  <Text>
                    When a snapshot is created, the virtual machine can be
                    restored to the state of the snapshot.
                  </Text>
                  <Text className={commonStyles.errorTextBold}>
                    The restore operation cannot be undone.
                  </Text>
                </>
              }
            />
          </Stack>
        </Stack>
      </Stack>
      {user.ID === editableWorkspace.OwnerID &&
      userQuotas.MaxSnapshotsPerWorkspace === 0 ? (
        <Text className={commonStyles.boldText}>
          Unable to create snapshots. Please check workspace snapshot quota and
          contact your business lead.
        </Text>
      ) : snapshots.length === 0 &&
        CheckSharedOwner(
          userProfile,
          editableWorkspace as AzureWorkspaceDto
        ) ? (
        <Text className={commonStyles.boldText}>
          There are no snapshots in this workspace. Please contact workspace
          owner.
        </Text>
      ) : snapshots.length === 0 && editableWorkspace.OwnerID === user.ID ? (
        <Text className={commonStyles.boldText}>No snapshots created.</Text>
      ) : (
        <DetailsList
          items={snapshots}
          columns={columns}
          selectionMode={SelectionMode.none}
        />
      )}
      <AzureMachineSnapshotsPanel
        isPanelOpen={isPanelOpen}
        setIsPanelOpen={setIsPanelOpen}
        machines={machines as AzureVirtualMachineDto[]}
        machineIndex={props.machineIndex}
        snapshots={snapshots}
      />
    </Stack>
  );
};
