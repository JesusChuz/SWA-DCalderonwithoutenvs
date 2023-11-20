import * as React from 'react';
import { Stack, Text, useTheme } from '@fluentui/react';

import image from '../../assets/kitty404.svg';
import { getCommonStyles } from '../GeneralComponents/CommonStyles';

export const WorkspaceQuotaExceeded = (): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);

  return (
    <Stack
      className={commonStyles.quotaErrorRoot}
      horizontalAlign='center'
      verticalAlign='center'
    >
      <Stack horizontalAlign='center'>
        <img
          src={image}
          alt='access denied cat'
          className={commonStyles.quotaErrorImage}
        />
      </Stack>
      <Text as='h1' variant='xxLarge'>
        Workspace Quota Exceeded
      </Text>
      <Text as='h4' variant='medium' className={commonStyles.quotaErrorText}>
        You have reached your maximum number of allowed workspaces. To create a
        new workspace, delete one of your existing workspaces or contact your
        Tenant Segment Administrator to have the quota increased.
      </Text>
    </Stack>
  );
};
