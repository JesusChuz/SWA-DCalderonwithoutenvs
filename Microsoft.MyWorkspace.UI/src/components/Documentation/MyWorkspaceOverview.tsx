import * as React from 'react';
import { Stack, useTheme, Text, PrimaryButton } from '@fluentui/react';
import { getDocumentationStyles } from './DocumentationStyles';
import { useHistory } from 'react-router';

const MyWorkspaceOverView = (): JSX.Element => {
  const theme = useTheme();
  const documentationStyles = getDocumentationStyles(theme);
  const history = useHistory();

  return (
    <Stack className={documentationStyles.overview}>
      <Text as='h1' variant='xxLarge'>
        Documentation
      </Text>
      <Text variant='mediumPlus'>
        Welcome to the MyWorkspace Documentation! Here you can find all
        resources related to what MyWorkspace is, how to use it, and how to get
        help if you need it.
      </Text>
      <br />
      <Text as='h2' variant='xLarge'>
        What is MyWorkspace?
      </Text>
      <Text variant='mediumPlus'>
        MyWorkspace is a self-service application that enables rapid
        provisioning of secure lab environments in the cloud. MyWorkspace
        provides a robust catalog of reference architectures built by product
        experts that can be deployed rapidly and used instantaneously.
      </Text>
      <Text variant='mediumPlus'>
        MyWorkspace was built from the ground up with security, cost efficiency
        and ease-of-use in mind.
      </Text>
      <br />
      <br />
      <br />
      <Text as='h1' variant='xxLarge'>
        {"What's New in MyWorkspace?"}
      </Text>
    </Stack>
  );
};

export { MyWorkspaceOverView as default };
