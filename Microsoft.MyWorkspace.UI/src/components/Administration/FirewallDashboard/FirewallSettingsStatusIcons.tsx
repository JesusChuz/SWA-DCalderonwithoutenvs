import * as React from 'react';
import clsx from 'clsx';
import { SyncStatus } from '../../../types/enums/SyncStatus';
import { FontIcon, mergeStyleSets, useTheme } from '@fluentui/react';

interface IProps {
  syncStatus: SyncStatus;
}

export const FirewallStatusDotIcon = (props: IProps) => {
  const theme = useTheme();

  const styles = React.useMemo(() => {
    return mergeStyleSets({
      dotIcon: {
        fontSize: '12px',
        display: 'block',
        cursor: 'default',
      },
      icon: {
        fontSize: '24px',
        alignSelf: 'start',
        marginRight: '16px',
        marginTop: '20px',
        cursor: 'default',
      },
      redIcon: {
        color: theme.semanticColors.errorText,
      },
      greyIcon: {
        color: theme.palette.neutralLight,
      },
      orangeIcon: {
        color: theme.semanticColors.warningIcon,
      },
      greenIcon: {
        color: theme.semanticColors.successIcon,
      },
      blueIcon: {
        color: theme.semanticColors.infoIcon,
      },
    });
  }, [theme]);

  if (props.syncStatus === SyncStatus.Active) {
    return (
      <FontIcon
        className={clsx(styles.greenIcon, styles.dotIcon)}
        iconName='CircleFill'
      />
    );
  }

  if (
    props.syncStatus === SyncStatus.Creating ||
    props.syncStatus === SyncStatus.CreatePending ||
    props.syncStatus === SyncStatus.Deleting ||
    props.syncStatus === SyncStatus.DeletePending ||
    props.syncStatus === SyncStatus.Updating ||
    props.syncStatus === SyncStatus.UpdatePending
  ) {
    return (
      <FontIcon
        className={clsx(styles.orangeIcon, styles.dotIcon)}
        iconName='CircleFill'
      />
    );
  }

  if (
    props.syncStatus === SyncStatus.Inactive ||
    props.syncStatus === SyncStatus.Unknown
  ) {
    return (
      <FontIcon
        className={clsx(styles.greyIcon, styles.dotIcon)}
        iconName='CircleFill'
      />
    );
  }

  return (
    <FontIcon
      className={clsx(styles.redIcon, styles.dotIcon)}
      iconName='CircleFill'
    />
  );
};

export const getFirewallStatusString = (status: SyncStatus) => {
  if (status == SyncStatus.CreatePending) return 'Creation in Progress';
  if (status == SyncStatus.DeletePending) return 'Deletion in Progress';
  if (status == SyncStatus.UpdatePending) return 'Update in Progress';
  return SyncStatus[status];
};
