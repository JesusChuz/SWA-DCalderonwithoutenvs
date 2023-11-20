import * as React from 'react';
import { Stack, PrimaryButton, useTheme } from '@fluentui/react';
import { useHistory } from 'react-router';

import kitty from '../../assets/kitty404.svg';
import { getCommonStyles } from '../GeneralComponents/CommonStyles';

export const NotFound = (): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const history = useHistory();

  return (
    <Stack
      className={commonStyles.kittyRoot}
      horizontalAlign='center'
      verticalAlign='center'
    >
      <Stack horizontalAlign='center'>
        <img src={kitty} alt='' className={commonStyles.kittyWidthHeight} />
        <h3>Doh! It&apos;s a 404</h3>
        <p>We couldn&apos;t find the page</p>
        <PrimaryButton
          onClick={() => history.push('/')}
          text='Go To Workspaces'
        />
      </Stack>
    </Stack>
  );
};
