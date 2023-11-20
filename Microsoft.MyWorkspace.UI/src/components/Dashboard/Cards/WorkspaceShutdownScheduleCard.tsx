import * as React from 'react';
import { DashboardCard } from '../../GeneralComponents/DashboardCards/DashboardCard';
import { getAzureWorkspaces } from '../../../store/selectors/azureWorkspaceSelectors';
import { getWorkspaceScheduledJobs } from '../../../store/selectors/scheduleSelectors';
import { getFormattedHoursAndMinutesRemaining } from '../../../shared/DateTimeHelpers';
import { AzureWorkspaceDto } from '../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { WorkspaceScheduledJobDto } from '../../../types/Job/WorkspaceScheduledJobDto.types';
import { getDashboardStyles } from '../Dashboard.styles';
import { useSelector } from 'react-redux';
import { CardEmptyState } from './CardEmptyState';
import { ResourceState } from '../../../types/AzureWorkspace/enums/ResourceState';
import KittyEmptyState from '../../../assets/kittyEmptyPage.svg';
import { IsOn } from '../../../shared/helpers/WorkspaceHelper';
import { useTheme, Text, List } from '@fluentui/react';

type workspaceStatus = {
  workspace: AzureWorkspaceDto;
  timeRemaining: string;
  expiryNearing: boolean;
};

export const WorkspaceShutdownScheduleCard = (): JSX.Element => {
  const theme = useTheme();
  const styles = getDashboardStyles(theme);
  const allWorkspaces: AzureWorkspaceDto[] = useSelector(getAzureWorkspaces);
  const scheduledWorkspaceJobs: WorkspaceScheduledJobDto[] = useSelector(
    getWorkspaceScheduledJobs
  );
  const [workspaceShutdownStatus, setWorkspaceShutdownStatus] = React.useState<
    Array<workspaceStatus>
  >([]);
  const updateIntervalInSeconds = 10;
  const [haveWorkspaceShutdowns, setHaveWorkspaceShutdowns] =
    React.useState(false);
  const [haveActiveWorkspace, setHaveActiveWorkspace] = React.useState(false);

  const onRenderCell = (item: workspaceStatus): JSX.Element => {
    return (
      <div data-is-focusable>
        <div className={styles.listViewCell}>
          <Text className={styles.mediumCardTextEllipsis}>
            {item.workspace.Name}
          </Text>
          <Text
            className={
              item.expiryNearing
                ? styles.listViewExpiredColor
                : styles.listViewRegularColor
            }
          >
            {item.timeRemaining}
          </Text>
        </div>
      </div>
    );
  };

  const buildWorkspaceShutdownObject = () => {
    const workspaceStatusCounts: Array<workspaceStatus> = [];
    setHaveActiveWorkspace(false);
    allWorkspaces.forEach((val: AzureWorkspaceDto) => {
      if (IsOn(val) && val.State == ResourceState.Running && val.EndRunTime) {
        setHaveActiveWorkspace(true);
        let currShutdownStatus = 'Scheduled Shutdown';
        const scheduledWorkspaceJob = scheduledWorkspaceJobs.find(
          (job) => job.WorkspaceID === val.ID
        );
        const scheduledWorkspaceAutoStopTime =
          scheduledWorkspaceJob?.NextAutoStopTime;
        const endRunTime = new Date(val.EndRunTime);
        const minimumTimeRemaining =
          scheduledWorkspaceAutoStopTime === undefined ||
          endRunTime < new Date(scheduledWorkspaceAutoStopTime)
            ? endRunTime
            : new Date(scheduledWorkspaceAutoStopTime);
        const time = getFormattedHoursAndMinutesRemaining(
          minimumTimeRemaining.toISOString()
        );
        if (minimumTimeRemaining === endRunTime) {
          currShutdownStatus = 'Auto Shutdown';
        }
        workspaceStatusCounts.push({
          workspace: val,
          timeRemaining: time.isExpired
            ? 'Expired'
            : time.hours < 1 && time.minutes < 1
            ? `${currShutdownStatus} in less than 1 minute`
            : `${currShutdownStatus} in ${time.shortFormattedString}`,
          expiryNearing: !time.isExpired && time.hours < 1 ? true : false,
        });
      }
    });
    setHaveWorkspaceShutdowns(workspaceStatusCounts.length > 0);
    setWorkspaceShutdownStatus(workspaceStatusCounts);
  };

  React.useEffect(() => {
    const interval = setInterval(
      buildWorkspaceShutdownObject,
      updateIntervalInSeconds * 1000
    );
    buildWorkspaceShutdownObject();
    return () => clearInterval(interval);
  }, [allWorkspaces, scheduledWorkspaceJobs]);

  return (
    <>
      <DashboardCard
        title='Workspace Shutdown Schedule'
        className={styles.medDashboardCard}
      >
        {!haveWorkspaceShutdowns ? (
          <CardEmptyState
            imgSrc={KittyEmptyState}
            headerText={
              !haveActiveWorkspace
                ? 'No Active Workspaces'
                : 'Auto Shutdown Disabled'
            }
            descriptionText={
              !haveActiveWorkspace
                ? 'You do not have any workspaces that are currently running. To see the shutdown schedule, start your workspace after it has been deployed.'
                : 'Automatic shutdown may be disabled for your segment. To schedule a workspace shutdown, please do so manually.'
            }
          />
        ) : (
          <div className={styles.listViewContainer} data-is-scrollable>
            <List items={workspaceShutdownStatus} onRenderCell={onRenderCell} />
          </div>
        )}
      </DashboardCard>
    </>
  );
};
