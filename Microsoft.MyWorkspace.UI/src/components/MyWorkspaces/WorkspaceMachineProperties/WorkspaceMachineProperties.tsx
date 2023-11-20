import * as React from 'react';
import {
  Text,
  Stack,
  TooltipHost,
  GroupedList,
  IGroup,
  Spinner,
  SpinnerSize,
  Icon,
  useTheme,
} from '@fluentui/react';
import { useParams, useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import {
  getResourceStateText,
  ResourceStateDotIcon,
} from '../WorkspaceStatusIcons';
import { WorkspaceProperties } from './WorkspaceProperties/WorkspaceProperties';
import { AzureNativeMachineProperties } from './AzureMachineProperties/AzureNativeMachineProperties';
import { AzureWorkspaceDto } from '../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { ErrorPage } from '../../Pages/ErrorPage';
import {
  getAdminWorkspaceIsLoading,
  getAzureWorkspaces,
  getAzureWorkspacesLoadedFirstTime,
  getSelectedAdminWorkspaces,
  getWorkspacePatchingSummary,
} from '../../../store/selectors/azureWorkspaceSelectors';
import {
  editableWorkspaceSetCurrentWorkspaceEdit,
  editableWorkspaceSetWorkspaceScheduledJob,
} from '../../../store/actions/editableWorkspaceActions';
import {
  fetchAdminAzureWorkspace,
  fetchAdminWorkspaceScheduleJob,
  fetchPatchingDetails,
  fetchPatchingSummary,
  hideSevereWarningNotification,
  showSevereWarningNotification,
} from '../../../store/actions';
import {
  getFeatureFlagComplianceMonitoring,
  getFeatureFlagSchedule,
  getFeatureFlagStaleWorkspaceDeletion,
  getStaleWorkspaceDeletionBannerThreshold,
  getUserRoleAssignmentConstraint,
} from '../../../store/selectors';
import {
  getScheduledJobsLoadedFirstTime,
  getWorkspaceScheduledJobs,
} from '../../../store/selectors/scheduleSelectors';
import { AzureVirtualMachineDto } from '../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import {
  GetDaysUntilStaleWorkspaceDeletion,
  ShouldDisplayStaleWorkspaceWarning,
} from '../../../shared/helpers/WorkspaceHelper';
import { OSIcon } from '../../../components/GeneralComponents/OSIcon';

export const WorkspaceMachineProperties = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const { id, machineID } = useParams<{ id: string; machineID: string }>();
  const history = useHistory();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [flattenedWorkspaceMachineList, setFlattenedWorkspaceMachineList] =
    React.useState<(AzureWorkspaceDto | AzureVirtualMachineDto)[]>([]);
  const [groups, setGroups] = React.useState<IGroup[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] =
    React.useState<AzureWorkspaceDto>();
  const [selectedMachine, setSelectedMachine] = React.useState<{
    index: number;
  }>({ index: -1 });
  const [selectedWorkspaceLoaded, setSelectedWorkspaceLoaded] =
    React.useState(false);
  const [workspaceListLoaded, setWorkspaceListLoaded] = React.useState(false);
  const [allWorkspaces, setAllWorkspaces] = React.useState<AzureWorkspaceDto[]>(
    []
  );
  const userWorkspaces: AzureWorkspaceDto[] = useSelector(getAzureWorkspaces);
  const adminWorkspaces: AzureWorkspaceDto[] = useSelector(
    getSelectedAdminWorkspaces
  );
  const adminWorkspacesLoading: boolean = useSelector(
    getAdminWorkspaceIsLoading
  );
  const allWorkspacesLoaded: boolean = useSelector(
    getAzureWorkspacesLoadedFirstTime
  );
  const scheduleFeatureFlag = useSelector(getFeatureFlagSchedule);
  const scheduledWorkspaceJobs = useSelector(getWorkspaceScheduledJobs);
  const scheduledJobsLoadedFirstTime = useSelector(
    getScheduledJobsLoadedFirstTime
  );
  const staleWorkspaceDeletionBannerThreshold = useSelector(
    getStaleWorkspaceDeletionBannerThreshold
  );
  const segmentConstraint = useSelector(getUserRoleAssignmentConstraint);
  const featureFlagStaleWorkspaceDeletion = useSelector(
    getFeatureFlagStaleWorkspaceDeletion
  );
  const complianceMonitoringFeatureFlag = useSelector(
    getFeatureFlagComplianceMonitoring
  );
  const workspacePatchingSummary = useSelector(getWorkspacePatchingSummary);

  const setUpWorkspaceScheduleJob = (workspaceID: string) => {
    const matchingWorkspaceJob = scheduledWorkspaceJobs.find(
      (job) => job.WorkspaceID === workspaceID
    );
    if (matchingWorkspaceJob) {
      dispatch(editableWorkspaceSetWorkspaceScheduledJob(matchingWorkspaceJob));
    } else if (isAdmin) {
      dispatch(fetchAdminWorkspaceScheduleJob(workspaceID));
    } else {
      dispatch(editableWorkspaceSetWorkspaceScheduledJob(null));
    }
  };

  const updateSelectedWorkspace = (workspace: AzureWorkspaceDto) => {
    const oldWorkspaceID = selectedWorkspace ? selectedWorkspace.ID : null;
    setSelectedWorkspace(workspace);
    setSelectedMachine({ index: -1 });
    if (oldWorkspaceID !== workspace.ID || isAdmin) {
      dispatch(editableWorkspaceSetCurrentWorkspaceEdit(workspace, isAdmin));
    }
  };

  const updateSelectedMachine = (machine: AzureVirtualMachineDto) => {
    const oldWorkspaceID = selectedWorkspace ? selectedWorkspace.ID : null;
    const workspace = allWorkspaces.find(
      (workspace) => workspace.ID === machine.WorkspaceID
    );
    setSelectedWorkspace(workspace);
    const specializedIndex = workspace.VirtualMachines.findIndex(
      (m) => m.ID === machine.ID
    );
    const machineIndex = specializedIndex;
    setSelectedMachine({ index: machineIndex });
    if (oldWorkspaceID !== workspace.ID) {
      dispatch(editableWorkspaceSetCurrentWorkspaceEdit(workspace, isAdmin));
    }
  };

  const onRenderMachineCell = (
    nestingDepth?: number,
    item?: AzureVirtualMachineDto
  ) => {
    return onRenderAzureNativeMachineCell(item);
  };

  const onRenderAzureNativeMachineCell = (machine: AzureVirtualMachineDto) => {
    const machinePatchSummary = workspacePatchingSummary.find(
      (m) => m.VirtualMachineId === machine.ID
    );
    const workspace = allWorkspaces.find(
      (workspace) => workspace.ID === machine.WorkspaceID
    );
    return (
      <Stack
        data-is-focusable={true}
        tabIndex={-1}
        aria-label={`state ${getResourceStateText(machine.State)} ${
          machine.ComputerName
        } select button`}
        role='row'
        className={commonStyles.sidePropertiesMachineItem}
        horizontal
        tokens={{ childrenGap: 8 }}
        onClick={() =>
          history.push(
            `${isAdmin ? '/admin' : ''}/${workspace.ID}/${machine.ID}`
          )
        }
        styles={{
          root:
            machine.ID === machineID
              ? { backgroundColor: theme.palette.neutralQuaternary }
              : {
                  selectors: {
                    '&:hover': {
                      backgroundColor: theme.palette.neutralQuaternaryAlt,
                    },
                  },
                },
        }}
        verticalAlign='center'
      >
        <OSIcon osVersion={machine.OSVersion} />

        <TooltipHost content={getResourceStateText(machine.State)}>
          <ResourceStateDotIcon resourceState={machine.State} />
        </TooltipHost>
        <Text
          role='cell'
          className={`${commonStyles.nonWrappingText} ${commonStyles.fullWidth}`}
        >
          {machine.ComputerName}
        </Text>
        {complianceMonitoringFeatureFlag &&
          segmentConstraint.EnablePatchInfoForVM && (
            <Stack horizontalAlign='end'>
              {machinePatchSummary &&
                machinePatchSummary.CriticalUpdatesMissing > 0 && (
                  <TooltipHost content={'Critical Updates Missing'}>
                    <Icon
                      iconName='ShieldAlert'
                      aria-label='Critical Updates Missing'
                      className={`${commonStyles.severeWarningColor} ${commonStyles.font16} ${commonStyles.padRight8} ${commonStyles.displayBlock} ${commonStyles.cursorDefault}`}
                    />
                  </TooltipHost>
                )}
              {machinePatchSummary &&
                machinePatchSummary.CriticalUpdatesMissing === 0 &&
                machinePatchSummary.SecurityUpdatesMissing > 0 && (
                  <TooltipHost content={'Security Updates Missing'}>
                    <Icon
                      iconName='Shield'
                      aria-label='Security Updates Missing'
                      className={`${commonStyles.warningColor} ${commonStyles.font16} ${commonStyles.padRight8} ${commonStyles.displayBlock} ${commonStyles.cursorDefault}`}
                    />
                  </TooltipHost>
                )}
            </Stack>
          )}
      </Stack>
    );
  };

  const onRenderWorkspaceCell = (): JSX.Element => {
    return (
      <Stack
        data-is-focusable={true}
        tabIndex={-1}
        className={commonStyles.sidePropertiesWorkspaceItem}
        horizontal
        onClick={() => {
          history.push(`${isAdmin ? '/admin' : ''}/${selectedWorkspace.ID}`);
        }}
        styles={{
          root:
            selectedMachine.index === -1
              ? { backgroundColor: theme.palette.neutralQuaternary }
              : {
                  selectors: {
                    '&:hover': {
                      backgroundColor: theme.palette.neutralQuaternaryAlt,
                    },
                  },
                },
        }}
        verticalAlign='center'
        horizontalAlign='space-between'
      >
        <Stack
          horizontal
          verticalAlign={'center'}
          tokens={{ childrenGap: 8 }}
          className={commonStyles.fullWidth}
        >
          <TooltipHost content={getResourceStateText(selectedWorkspace.State)}>
            <ResourceStateDotIcon resourceState={selectedWorkspace.State} />
          </TooltipHost>
          <Stack.Item
            className={`${commonStyles.overflowXHidden} ${commonStyles.textOverflowEllipsis}`}
            grow={1}
          >
            <Text>{selectedWorkspace.Name}</Text>
          </Stack.Item>
          {selectedWorkspace.PrivateMode && (
            <TooltipHost content={'Private Mode Enabled'}>
              <Icon
                iconName='LockSolid'
                aria-label='Private Mode Enabled'
                className={`${commonStyles.displayBlock}`}
              />
            </TooltipHost>
          )}
        </Stack>
      </Stack>
    );
  };

  const flattenWorkspaceList = () => {
    const combinedList: (AzureWorkspaceDto | AzureVirtualMachineDto)[] = [];
    const newGroups: IGroup[] = [];
    const ws: AzureWorkspaceDto = allWorkspaces.find((w) => w.ID === id);
    combinedList.push(ws);
    const virtualMachineList = ws.VirtualMachines;
    const newGroup: IGroup = {
      key: ws.ID,
      name: ws.Name,
      startIndex: combinedList.length,
      count: virtualMachineList.length,
    };
    newGroups.push(newGroup);
    combinedList.push(...virtualMachineList);
    setFlattenedWorkspaceMachineList(combinedList);
    setGroups(newGroups);
  };

  React.useEffect(() => {
    if (workspaceListLoaded && id) {
      const workspace = allWorkspaces.find((ws) => ws.ID === id);
      if (workspace) {
        if (machineID) {
          const machine = workspace.VirtualMachines.find(
            (m: AzureVirtualMachineDto) => m.ID === machineID
          );
          updateSelectedMachine(machine);
        } else {
          updateSelectedWorkspace(workspace);
        }
      }
      setSelectedWorkspaceLoaded(true);
    }
  }, [workspaceListLoaded, id, machineID, allWorkspaces]);

  React.useEffect(() => {
    if (selectedWorkspace) {
      flattenWorkspaceList();
    }
  }, [
    selectedWorkspace,
    selectedMachine,
    allWorkspaces,
    workspacePatchingSummary,
  ]);

  React.useEffect(() => {
    if (isAdmin) {
      if (adminWorkspaces && adminWorkspaces.length > 0) {
        setAllWorkspaces(adminWorkspaces);
      } else {
        dispatch(fetchAdminAzureWorkspace(id));
      }
      setWorkspaceListLoaded(!adminWorkspacesLoading);
    } else {
      setAllWorkspaces(userWorkspaces);
      setWorkspaceListLoaded(allWorkspacesLoaded);
    }
  }, [
    userWorkspaces,
    adminWorkspaces,
    isAdmin,
    adminWorkspacesLoading,
    allWorkspacesLoaded,
  ]);

  React.useEffect(() => {
    if (selectedWorkspace && selectedWorkspace.ID) {
      dispatch(fetchPatchingDetails(selectedWorkspace.ID));
      dispatch(fetchPatchingSummary(selectedWorkspace.ID));
    }
  }, [selectedWorkspace?.ID]);

  React.useEffect(() => {
    if (
      scheduleFeatureFlag &&
      scheduledJobsLoadedFirstTime &&
      selectedWorkspace?.ID
    ) {
      setUpWorkspaceScheduleJob(selectedWorkspace?.ID);
    }
  }, [
    selectedWorkspace?.ID,
    isAdmin,
    scheduledJobsLoadedFirstTime,
    scheduledWorkspaceJobs,
    scheduleFeatureFlag,
  ]);

  React.useEffect(() => {
    if (selectedWorkspace?.ID) {
      const shouldStaleWorkspaceDeletionWarningDisplay =
        featureFlagStaleWorkspaceDeletion &&
        ShouldDisplayStaleWorkspaceWarning(
          selectedWorkspace,
          segmentConstraint,
          staleWorkspaceDeletionBannerThreshold
        );
      if (shouldStaleWorkspaceDeletionWarningDisplay) {
        const daysUntilShutdown = GetDaysUntilStaleWorkspaceDeletion(
          selectedWorkspace,
          segmentConstraint,
          true
        );
        const timeRemaining =
          daysUntilShutdown > 1 ? `${daysUntilShutdown} days` : 'day';
        dispatch(
          showSevereWarningNotification(
            `This workspace will be marked for deletion within the next ${timeRemaining}. To prevent deletion, JIT must be activated.`
          )
        );
      }
    }
    return () => {
      dispatch(hideSevereWarningNotification());
    };
  }, [
    selectedWorkspace?.ID,
    staleWorkspaceDeletionBannerThreshold,
    segmentConstraint?.StaleWorkspaceDeletionDays,
    featureFlagStaleWorkspaceDeletion,
  ]);

  React.useEffect(() => {
    setIsAdmin(history.location.pathname.startsWith('/admin'));
  }, [history]);

  React.useEffect(() => {
    if (!isAdmin && userWorkspaces.findIndex((w) => w.ID === id) === -1) {
      setSelectedWorkspace(null);
      setSelectedMachine(null);
    }
  }, [userWorkspaces, id, isAdmin]);

  return (
    <>
      {selectedWorkspace ? (
        <Stack horizontal className={commonStyles.fullHeight}>
          <Stack className={commonStyles.sidePropertiesList}>
            <GroupedList
              groups={groups}
              groupProps={{
                onRenderHeader: onRenderWorkspaceCell,
                showEmptyGroups: true,
              }}
              items={flattenedWorkspaceMachineList}
              onRenderCell={onRenderMachineCell}
            />
          </Stack>

          {selectedWorkspace && selectedMachine.index === -1 && (
            <WorkspaceProperties />
          )}

          {selectedMachine.index !== -1 && (
            <AzureNativeMachineProperties
              machineIndex={selectedMachine.index}
            />
          )}
        </Stack>
      ) : workspaceListLoaded && selectedWorkspaceLoaded ? (
        <ErrorPage
          title='Workspace not found.'
          message='Please select a valid workspace from your list.'
          showButton={true}
          buttonMessage='Go to Workspaces'
        />
      ) : (
        <Spinner
          aria-label='Workspace saving spinner'
          size={SpinnerSize.large}
          className={commonStyles.loading}
        />
      )}
    </>
  );
};

export { WorkspaceMachineProperties as default };
