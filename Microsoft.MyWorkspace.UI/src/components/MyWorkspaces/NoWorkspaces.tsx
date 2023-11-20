import * as React from 'react';
import { Stack, Text, useTheme } from '@fluentui/react';

// eslint-disable-next-line import/no-unresolved
import kitty from '../../assets/kittyEmptyPage.svg';
import { getCommonStyles } from '../GeneralComponents/CommonStyles';

export const NoWorkspaces = (): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);

  return (
    <Stack
      className={commonStyles.kittyRoot}
      horizontalAlign='center'
      verticalAlign='center'
    >
      <Stack horizontalAlign='center'>
        <img
          src={kitty}
          className={commonStyles.kittyWidthHeight}
          alt='Animated Cat'
        />
        <Text variant='xxLarge'>No Workspaces</Text>
        <Text variant='xLarge'>
          You do not have any Workspaces. Select New Workspace from the side
          menu to get started.
        </Text>
      </Stack>
    </Stack>
  );
};
