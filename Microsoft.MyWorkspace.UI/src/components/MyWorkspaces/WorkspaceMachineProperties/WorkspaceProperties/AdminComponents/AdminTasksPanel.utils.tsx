import * as React from 'react';
import {
  FontIcon,
  memoizeFunction,
  mergeStyleSets,
  Theme,
  useTheme,
} from '@fluentui/react';
import clsx from 'clsx';

import { TaskStatus } from '../../../../../types/AzureWorkspace/enums/TaskStatus';
import { TaskOperation } from '../../../../../types/AzureWorkspace/enums/TaskOperation';
import { getFormattedDateTime } from '../../../../../shared/DateTimeHelpers';

export const getIconStyles = memoizeFunction((theme: Theme) => {
  return mergeStyleSets({
    dotIcon: {
      fontSize: '12px',
    },
    icon: {
      fontSize: '24px',
      alignSelf: 'start',
      marginRight: '16px',
      marginTop: '20px',
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
  taskStatus: TaskStatus;
}

export const TaskStatusDotIcon = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const styles = getIconStyles(theme);
  switch (props.taskStatus) {
    case TaskStatus.NotStarted:
      return (
        <FontIcon
          className={clsx(styles.greyIcon, styles.dotIcon)}
          iconName='CircleFill'
        />
      );
    case TaskStatus.InProgress:
      return (
        <FontIcon
          className={clsx(styles.orangeIcon, styles.dotIcon)}
          iconName='CircleFill'
        />
      );
    case TaskStatus.Suspended:
    case TaskStatus.Failed:
      return (
        <FontIcon
          className={clsx(styles.redIcon, styles.dotIcon)}
          iconName='CircleFill'
        />
      );
    case TaskStatus.Succeeded:
      return (
        <FontIcon
          className={clsx(styles.greenIcon, styles.dotIcon)}
          iconName='CircleFill'
        />
      );
  }
};

export const getTaskStatusText = (
  taskStatus: TaskStatus
): 'Not Started' | 'In Progress' | 'Failed' | 'Succeeded' => {
  switch (taskStatus) {
    case TaskStatus.NotStarted:
      return 'Not Started';
    case TaskStatus.InProgress:
      return 'In Progress';
    case TaskStatus.Suspended:
    case TaskStatus.Failed:
      return 'Failed';
    case TaskStatus.Succeeded:
      return 'Succeeded';
  }
};

export const getTaskOperationText = (
  taskOperation: TaskOperation
): 'Create' | 'Update' | 'Delete' | 'Orchestrate' => {
  switch (taskOperation) {
    case TaskOperation.Create:
      return 'Create';
    case TaskOperation.Update:
      return 'Update';
    case TaskOperation.Delete:
      return 'Delete';
    case TaskOperation.Orchestrate:
      return 'Orchestrate';
  }
};

export const getTaskResourceCreationDate = (
  taskResourceObject: Record<string, { Created: string }>
): string => {
  for (const key in taskResourceObject) {
    const value = taskResourceObject[key];
    if (value?.Created) {
      return getFormattedDateTime(value.Created);
    }
  }
  return 'No Date Found';
};
