import * as React from 'react';

import { IFontStyles, useTheme } from '@fluentui/react';
import { getFormattedHoursAndMinutesRemaining } from '../../../shared/DateTimeHelpers';
import { AzureWorkspaceDto } from '../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { RemainingTime } from '../../../types/RemainingTime.types';
import { styles } from './TimeRemaining.styles';
import { useSelector } from 'react-redux';
import { getWorkspaceScheduledJobs } from '../../../store/selectors/scheduleSelectors';
import { TimeRemaining } from './TimeRemaining';
import { getCommonStyles } from '../CommonStyles';

interface IProps {
  workspace: AzureWorkspaceDto;
  suffix?: string;
  variant?: keyof IFontStyles;
}

export const WorkspaceShutdownTimeRemaining = (props: IProps): JSX.Element => {
  const scheduledWorkspaceJobs = useSelector(getWorkspaceScheduledJobs);
  const updateIntervalInSeconds = 10;
  const [timeRemaining, setTimeRemaining] = React.useState<RemainingTime>({
    longFormattedString: '',
    shortFormattedString: '',
    isExpired: false,
  });
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);

  const scheduledWorkspaceJob = React.useMemo(() => {
    return (
      scheduledWorkspaceJobs.find(
        (job) => job.WorkspaceID === props.workspace.ID
      ) ?? null
    );
  }, [scheduledWorkspaceJobs, props.workspace]);

  const updateTimeRemaining = () => {
    const scheduledWorkspaceAutoStopTime =
      scheduledWorkspaceJob?.NextAutoStopTime;
    const endRunTime = new Date(props.workspace.EndRunTime);

    const minimumTimeRemaining =
      scheduledWorkspaceAutoStopTime === undefined ||
      endRunTime < new Date(scheduledWorkspaceAutoStopTime)
        ? endRunTime
        : new Date(scheduledWorkspaceAutoStopTime);
    const time = getFormattedHoursAndMinutesRemaining(
      minimumTimeRemaining.toISOString()
    );
    setTimeRemaining(time);
  };

  React.useEffect(() => {
    const interval = setInterval(
      updateTimeRemaining,
      updateIntervalInSeconds * 1000
    );
    updateTimeRemaining();
    return () => clearInterval(interval);
  }, [props.workspace, scheduledWorkspaceJob]);

  const getClassName = (timeRemaining: RemainingTime) => {
    if (!timeRemaining) {
      return '';
    }
    if (timeRemaining.isExpired || timeRemaining.hours < 1) {
      return styles.severeWarning;
    } else if (timeRemaining.hours < 2) {
      return styles.warning;
    }
    return commonStyles.whiteBackground;
  };

  const getTooltipContent = (timeRemaining: RemainingTime) => {
    return timeRemaining.isExpired
      ? 'Workspace is expired and will shutdown shortly.'
      : 'Time Remaining Until Shutdown';
  };

  const getAriaLabel = (timeRemaining: RemainingTime) => {
    return timeRemaining.isExpired
      ? 'Workspace is expired and will shutdown shortly.'
      : `${timeRemaining.longFormattedString} until shutdown`;
  };

  return (
    <TimeRemaining
      timeRemaining={timeRemaining}
      variant={props.variant}
      suffix={props.suffix}
      iconName={'PowerButton'}
      tooltipContent={getTooltipContent(timeRemaining)}
      ariaLabel={getAriaLabel(timeRemaining)}
      className={getClassName(timeRemaining)}
      expiredMessage={'Expired'}
    />
  );
};
