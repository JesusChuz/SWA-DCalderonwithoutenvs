import * as React from 'react';
import {
  FontIcon,
  TooltipHost,
  mergeStyleSets,
  DirectionalHint,
  useTheme,
  memoizeFunction,
  Theme,
} from '@fluentui/react';
import clsx from 'clsx';

import { ResourceState } from '../../types/AzureWorkspace/enums/ResourceState';
import { TemplateRequestStatus } from 'src/types/enums/TemplateRequestStatus';

export const getClassNames = memoizeFunction((theme: Theme) => {
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
      color: theme.semanticColors.severeWarningIcon,
    },
    greenIcon: {
      color: theme.semanticColors.successIcon,
    },
    blueIcon: {
      color: theme.palette.blue,
    },
  });
});

interface IProps {
  resourceState: ResourceState;
}

export const ResourceStateDotIcon = (props: IProps) => {
  const theme = useTheme();
  const styles = getClassNames(theme);
  switch (props.resourceState) {
    case ResourceState.Running:
    case ResourceState.PartiallyRunning:
      return (
        <FontIcon
          className={clsx(styles.greenIcon, styles.dotIcon)}
          iconName='CircleFill'
        />
      );
    case ResourceState.Unknown:
    case ResourceState.Failed:
      return (
        <FontIcon
          className={clsx(styles.redIcon, styles.dotIcon)}
          iconName='CircleFill'
        />
      );
    case ResourceState.NotDeployed:
      return (
        <FontIcon
          className={clsx(styles.greyIcon, styles.dotIcon)}
          iconName='CircleFill'
        />
      );
    case ResourceState.Deploying:
    case ResourceState.Deleting:
    case ResourceState.Transitioning:
    case ResourceState.Waiting:
      return (
        <FontIcon
          className={clsx(styles.orangeIcon, styles.dotIcon)}
          iconName='CircleFill'
        />
      );
    case ResourceState.Off:
      return (
        <FontIcon
          className={clsx(styles.blueIcon, styles.dotIcon)}
          iconName='CircleFill'
        />
      );
    default:
      return <></>;
  }
};

export const ResourceStateStatusIcon = (props: IProps) => {
  const theme = useTheme();
  const styles = getClassNames(theme);
  switch (props.resourceState) {
    case ResourceState.Running:
    case ResourceState.PartiallyRunning:
      return (
        <TooltipHost
          directionalHint={DirectionalHint.bottomLeftEdge}
          content={getResourceStateText(props.resourceState)}
        >
          <FontIcon
            className={clsx(styles.greenIcon, styles.icon)}
            iconName='PlugConnected'
          />
        </TooltipHost>
      );
    case ResourceState.Unknown:
    case ResourceState.Failed:
      return (
        <TooltipHost
          directionalHint={DirectionalHint.bottomLeftEdge}
          content={getResourceStateText(props.resourceState)}
        >
          {' '}
          <FontIcon
            className={clsx(styles.redIcon, styles.icon)}
            iconName='Error'
          />
        </TooltipHost>
      );
    case ResourceState.NotDeployed:
      return (
        <TooltipHost
          directionalHint={DirectionalHint.bottomLeftEdge}
          content={getResourceStateText(props.resourceState)}
        >
          <FontIcon
            className={clsx(styles.greyIcon, styles.icon)}
            iconName='SkypeCircleMinus'
          />
        </TooltipHost>
      );
    case ResourceState.Deploying:
    case ResourceState.Transitioning:
    case ResourceState.Waiting:
      return (
        <TooltipHost
          directionalHint={DirectionalHint.bottomLeftEdge}
          content={getResourceStateText(props.resourceState)}
        >
          <FontIcon
            className={clsx('spinner', styles.orangeIcon, styles.icon)}
            iconName='SyncStatus'
          />
        </TooltipHost>
      );
    case ResourceState.Off:
      return (
        <TooltipHost
          directionalHint={DirectionalHint.bottomLeftEdge}
          content={getResourceStateText(props.resourceState)}
        >
          <FontIcon
            className={clsx(styles.blueIcon, styles.icon)}
            iconName='PlugDisconnected'
          />
        </TooltipHost>
      );
    default:
      return <></>;
  }
};

export const getResourceStateText = (
  workspaceState: ResourceState
):
  | 'Failed'
  | 'Not Deployed'
  | 'Waiting'
  | 'Deploying'
  | 'Transitioning'
  | 'Running'
  | 'Partially Running'
  | 'Stopped'
  | 'Deleting' => {
  switch (workspaceState) {
    case ResourceState.Unknown:
    case ResourceState.Failed:
      return 'Failed';
    case ResourceState.NotDeployed:
      return 'Not Deployed';
    case ResourceState.Waiting:
      return 'Waiting';
    case ResourceState.Deploying:
      return 'Deploying';
    case ResourceState.Transitioning:
      return 'Transitioning';
    case ResourceState.Running:
      return 'Running';
    case ResourceState.PartiallyRunning:
      return 'Partially Running';
    case ResourceState.Off:
      return 'Stopped';
    case ResourceState.Deleting:
      return 'Deleting';
  }
};

export const getTemplateRequestStateText = (
  workspaceState: ResourceState
): 'Failed' | 'Creating' | 'Complete' => {
  switch (workspaceState) {
    case ResourceState.Unknown:
    case ResourceState.Failed:
    case ResourceState.Off:
    case ResourceState.NotDeployed:
    case ResourceState.PartiallyRunning:
      return 'Failed';
    case ResourceState.Waiting:
    case ResourceState.Deploying:
    case ResourceState.Transitioning:
      return 'Creating';
    case ResourceState.Running:
      return 'Complete';
  }
};

export const getSnapshotResourceStateText = (
  workspaceState: ResourceState
): 'Unknown' | 'Failed' | 'Creating' | 'Ready' | 'Deleting' | 'Active' => {
  switch (workspaceState) {
    case ResourceState.Unknown:
      return 'Unknown';
    case ResourceState.NotDeployed:
    case ResourceState.PartiallyRunning:
    case ResourceState.Failed:
      return 'Failed';
    case ResourceState.Waiting:
    case ResourceState.Deploying:
    case ResourceState.Transitioning:
      return 'Creating';
    case ResourceState.Off:
      return 'Ready';
    case ResourceState.Running:
      return 'Active';
    case ResourceState.Deleting:
      return 'Deleting';
    default:
      return 'Unknown';
  }
};
