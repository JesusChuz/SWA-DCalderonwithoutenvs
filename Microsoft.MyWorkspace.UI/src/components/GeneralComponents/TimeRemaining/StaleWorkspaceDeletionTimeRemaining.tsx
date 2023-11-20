import * as React from 'react';

import { IFontStyles, useTheme } from '@fluentui/react';
import { AzureWorkspaceDto } from '../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { RemainingTime } from '../../../types/RemainingTime.types';
import { styles } from './TimeRemaining.styles';
import { useSelector } from 'react-redux';
import { getUserRoleAssignmentConstraint } from '../../../store/selectors';
import { getFormattedDaysRemaining } from '../../../shared/DateTimeHelpers';
import { TimeRemaining } from './TimeRemaining';
import { getCommonStyles } from '../CommonStyles';

interface IProps {
  workspace: AzureWorkspaceDto;
  suffix?: string;
  variant?: keyof IFontStyles;
}

export const StaleWorkspaceDeletionTimeRemaining = (
  props: IProps
): JSX.Element => {
  const userRoleAssignmentConstraint = useSelector(
    getUserRoleAssignmentConstraint
  );
  const updateIntervalInSeconds = 5 * 60;
  const [timeRemaining, setTimeRemaining] = React.useState<RemainingTime>({
    longFormattedString: '',
    shortFormattedString: '',
    isExpired: false,
  });
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);

  const updateTimeRemaining = () => {
    const lastJitActivationDateTime =
      props.workspace.LastJitActivationDateTime ?? props.workspace.Created;
    const staleWorkspaceDeletionDays =
      userRoleAssignmentConstraint?.StaleWorkspaceDeletionDays;
    if (lastJitActivationDateTime && staleWorkspaceDeletionDays) {
      const minimumTimeRemaining = new Date(lastJitActivationDateTime);
      minimumTimeRemaining.setDate(
        minimumTimeRemaining.getDate() + staleWorkspaceDeletionDays
      );
      const time = getFormattedDaysRemaining(
        minimumTimeRemaining.toISOString()
      );
      setTimeRemaining(time);
    }
  };

  React.useEffect(() => {
    const interval = setInterval(
      updateTimeRemaining,
      updateIntervalInSeconds * 1000
    );
    updateTimeRemaining();
    return () => clearInterval(interval);
  }, [
    props.workspace.ID,
    props.workspace.LastJitActivationDateTime,
    userRoleAssignmentConstraint.StaleWorkspaceDeletionDays,
  ]);

  const getClassName = (timeRemaining: RemainingTime) => {
    if (!timeRemaining) {
      return '';
    }
    if (timeRemaining.isExpired || timeRemaining.days < 1) {
      return styles.severeWarning;
    } else if (timeRemaining.days < 5) {
      return styles.warning;
    }
    return commonStyles.whiteBackground;
  };

  const getTooltipContent = (timeRemaining: RemainingTime) => {
    return timeRemaining.isExpired
      ? 'This Workspace Will Be Deleted Due To Inactivity. JIT Activate To Prevent Deletion.'
      : `${timeRemaining.longFormattedString} Until This Workspace Is Deleted Due To Inactivity. JIT Activate To Prevent Deletion.`;
  };

  const getAriaLabel = (timeRemaining: RemainingTime) => {
    return timeRemaining.isExpired
      ? 'This Workspace Will Be Deleted Due To Inactivity. JIT Activate To Prevent Deletion.'
      : `${timeRemaining.longFormattedString} Until This Workspace Is Deleted Due To Inactivity. JIT Activate To Prevent Deletion.`;
  };

  return (
    <TimeRemaining
      timeRemaining={timeRemaining}
      variant={props.variant}
      suffix={props.suffix}
      iconName={'Delete'}
      tooltipContent={getTooltipContent(timeRemaining)}
      ariaLabel={getAriaLabel(timeRemaining)}
      className={getClassName(timeRemaining)}
      expiredMessage={'Deletion Pending'}
      tooltipWidth={'340px'}
    />
  );
};
