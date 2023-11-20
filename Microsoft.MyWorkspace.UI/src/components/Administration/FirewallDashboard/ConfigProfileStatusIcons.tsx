import * as React from 'react';
import { TooltipHost, FontIcon, useTheme } from '@fluentui/react';

import { SyncStatus } from '../../../types/enums/SyncStatus';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';

interface IProps {
  status: SyncStatus;
}

export const ConfigProfileSyncStatusIcons = (props: IProps) => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);

  const iconProps = React.useMemo(() => {
    switch (props.status) {
      case SyncStatus.Failed:
        return { name: 'Error', color: theme.semanticColors.errorText };
      case SyncStatus.Inactive:
        return { name: 'Blocked2', color: theme.semanticColors.infoIcon };
      default:
        return { name: 'Warning', color: theme.semanticColors.warningIcon };
    }
  }, [props.status, theme]);

  return (
    <>
      {props.status !== SyncStatus.Active && (
        <TooltipHost
          content={`Config Profile Status: ${SyncStatus[props.status]}`}
        >
          <FontIcon
            className={commonStyles.font18}
            iconName={iconProps.name}
            aria-label={`Config Profile Status: ${props.status}`}
            style={{ color: iconProps.color }}
          />
        </TooltipHost>
      )}
    </>
  );
};
