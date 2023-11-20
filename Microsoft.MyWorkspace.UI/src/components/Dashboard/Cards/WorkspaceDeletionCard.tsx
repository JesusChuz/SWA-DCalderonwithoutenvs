import * as React from 'react';
import { useTheme, Label, List, Text } from '@fluentui/react';
import { DashboardCard } from '../../GeneralComponents/DashboardCards/DashboardCard';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import {
  getStaleWorkspaceDeletionBannerThreshold,
  getUserRoleAssignmentConstraint,
  getWorkspaceCountUnshared,
} from '../../../store/selectors';
import { AzureWorkspaceDto } from '../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { useSelector } from 'react-redux';
import { getDashboardStyles } from '../Dashboard.styles';
import { ShouldDisplayStaleWorkspaceWarning } from '../../../shared/helpers/WorkspaceHelper';
import { CardEmptyState } from './CardEmptyState';
import KittyEmptyState from '../../../assets/kittyEmptyPage.svg';
import { InfoButton } from '../../GeneralComponents/InfoButton';
import dayjs from 'dayjs';

export const WorkspaceDeletionCard = (): JSX.Element => {
  const theme = useTheme();
  const styles = getDashboardStyles(theme);
  const commonStyles = getCommonStyles(theme);
  const constraint = useSelector(getUserRoleAssignmentConstraint);
  const staleWorkspaceDeletionBannerThreshold = useSelector(
    getStaleWorkspaceDeletionBannerThreshold
  );

  const allWorkspaces: AzureWorkspaceDto[] = useSelector(
    getWorkspaceCountUnshared
  );
  const staleWorkspaces = allWorkspaces.filter((ws) =>
    ShouldDisplayStaleWorkspaceWarning(
      ws,
      constraint,
      staleWorkspaceDeletionBannerThreshold
    )
  );

  const calculateExpiration = (item: AzureWorkspaceDto) => {
    if (item.LastJitActivationDateTime) {
      return (
        <Text className={styles.listViewExpiredColor}>{`${calculateTime(
          item.LastJitActivationDateTime
        )}`}</Text>
      );
    } else if (item.Deployed) {
      return (
        <Text className={styles.listViewExpiredColor}>{`${calculateTime(
          item.Deployed
        )}`}</Text>
      );
    } else if (item.Created) {
      return (
        <Text className={styles.listViewExpiredColor}>{`${calculateTime(
          item.Created
        )}`}</Text>
      );
    }
  };

  const calculateTime = (item: string) => {
    const days = dayjs().diff(dayjs(item ?? new Date()), 'days', true);
    if (constraint.StaleWorkspaceDeletionDays - days < 0) {
      return 'Expired';
    }
    if (days < 1) {
      const hours = Math.floor(
        constraint.StaleWorkspaceDeletionDays * 24 - days * 24
      );
      return hours > 1
        ? `Expiring in ${hours} hours`
        : 'Less than 1 hour remaining';
    }
    return `Expiring in ${Math.floor(
      constraint.StaleWorkspaceDeletionDays - days
    )} day${days > 1 ? 's' : ''}`;
  };

  const onRenderCell = (item: AzureWorkspaceDto): JSX.Element => {
    return (
      <div data-is-focusable>
        <div className={styles.listViewCell}>
          <Text className={styles.mediumCardTextEllipsis}>{item.Name}</Text>
          {calculateExpiration(item)}
        </div>
      </div>
    );
  };

  return (
    <DashboardCard
      title={`Workspace${
        staleWorkspaces?.length > 1 ? 's' : ''
      } Nearing Deletion (${staleWorkspaces?.length})`}
      className={styles.medDashboardCard}
      subTitle={
        <InfoButton
          buttonId='info-callout-button'
          calloutTitle='Workspace Staleness'
          calloutBody={
            <Text>
              Refers to the number of days or hours left until a workspace is
              deleted, determined by the last active date-time minus the
              segment&apos;s quota for stale workspace deletion days.
            </Text>
          }
        />
      }
    >
      {staleWorkspaces.length === 0 ? (
        <CardEmptyState
          imgSrc={KittyEmptyState}
          headerText='No Stale Workspace'
          descriptionText='You do not have any workspaces set to expire soon. Congrats!'
        />
      ) : (
        <div className={styles.listViewContainer} data-is-scrollable>
          <List items={staleWorkspaces} onRenderCell={onRenderCell} />
          <Label className={commonStyles.font12}>
            {'To prevent deletion of a workspace, you must activate JIT.'}
          </Label>
        </div>
      )}
    </DashboardCard>
  );
};
