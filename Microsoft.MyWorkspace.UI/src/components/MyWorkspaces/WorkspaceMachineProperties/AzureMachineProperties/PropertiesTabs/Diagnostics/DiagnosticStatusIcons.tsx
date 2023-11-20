import * as React from 'react';
import { FontIcon, useTheme } from '@fluentui/react';
import clsx from 'clsx';
import { getDiagnosticStyles } from './AdminDiagnostics.styles';
import { DiagnosticSolutionStatus } from '../../../../../../types/AzureWorkspace/enums/DiagnosticStatus';

interface IProps {
  status: DiagnosticSolutionStatus;
}

export const DiagnosticStateDotIcon = (props: IProps) => {
  const theme = useTheme();
  const styles = getDiagnosticStyles(theme);

  switch (props.status) {
    case DiagnosticSolutionStatus.Pending:
      return (
        <FontIcon
          className={clsx(styles.orangeIcon, styles.dotIcon)}
          iconName='CircleFill'
        />
      );
    case DiagnosticSolutionStatus.Active:
      return (
        <FontIcon
          className={clsx(styles.blueIcon, styles.dotIcon)}
          iconName='CircleFill'
        />
      );
    case DiagnosticSolutionStatus.Completed:
      return (
        <FontIcon
          className={clsx(styles.greenIcon, styles.dotIcon)}
          iconName='CircleFill'
        />
      );
    case DiagnosticSolutionStatus.Failed:
      return (
        <FontIcon
          className={clsx(styles.redIcon, styles.dotIcon)}
          iconName='CircleFill'
        />
      );
    case DiagnosticSolutionStatus.Unknown:
      return (
        <FontIcon
          className={clsx(styles.greyIcon, styles.dotIcon)}
          iconName='CircleFill'
        />
      );
    default:
      return <></>;
  }
};
