import * as React from 'react';
import { Stack, Text, mergeStyleSets } from '@fluentui/react';

// eslint-disable-next-line import/no-unresolved

const styles = mergeStyleSets({
  root: {
    width: '100%',
    height: '100%',
  },
});

export const NoWorkspacesFound = (): JSX.Element => {
  return (
    <Stack
      className={styles.root}
      horizontalAlign='center'
      verticalAlign='center'
    >
      <Stack horizontalAlign='center'>
        <Text variant='xLarge'>No Workspaces Found</Text>
      </Stack>
    </Stack>
  );
};
