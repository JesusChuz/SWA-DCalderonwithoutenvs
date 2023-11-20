import * as React from 'react';
import { Stack, Text, useTheme } from '@fluentui/react';

import image from '../../assets/kittyAccessDenied.svg';
import { getCommonStyles } from '../GeneralComponents/CommonStyles';

export const AccessDenied = (): JSX.Element => {
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
          src={image}
          alt='access denied cat'
          className={commonStyles.kittyWidthHeight}
        />
        <Text variant='mega'>Access Denied</Text>
      </Stack>
    </Stack>
  );
};
