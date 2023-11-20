import * as React from 'react';
import {
  Icon,
  IconButton,
  PrimaryButton,
  Stack,
  Text,
  useTheme,
} from '@fluentui/react';
import image from '../../assets/kittyAccessDenied.svg';
import { getCommonStyles } from '../GeneralComponents/CommonStyles';

export const Unauthorized = (): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const sharePointLink =
    'https://microsoft.sharepoint.com/teams/MyWorkspaceInfo/SitePages/Onboarding-to-MyWorkspace.aspx?source=https%3A%2F%2Fmicrosoft.sharepoint.com%2Fteams%2FMyWorkspaceInfo%2FSitePages%2FForms%2FByAuthor.aspx';

  return (
    <Stack
      horizontalAlign='center'
      verticalAlign='center'
      className={commonStyles.fullBodyHeight}
    >
      <Stack
        className=''
        horizontalAlign='center'
        verticalAlign='center'
        tokens={{ childrenGap: 16 }}
      >
        <Text variant='mega'>Access Denied</Text>
        <img
          src={image}
          alt='access denied cat'
          className={commonStyles.kittyWidthHeight}
        />
        <Text variant='mediumPlus'>
          You do not currently have access to MyWorkspace
        </Text>
        <PrimaryButton href={sharePointLink} target='_blank' rel='noreferrer'>
          How to Onboard to MyWorkspace
        </PrimaryButton>
      </Stack>
    </Stack>
  );
};
