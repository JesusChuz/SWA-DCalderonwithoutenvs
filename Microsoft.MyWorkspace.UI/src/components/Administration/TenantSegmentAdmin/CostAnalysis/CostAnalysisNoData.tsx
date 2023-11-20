import { Stack, Text } from '@fluentui/react';
import * as React from 'react';
import kitty from 'src/assets/kittyEmptyPage.svg';
import { useCommonStyles } from 'src/hooks/useCommonStyles';

export const CostAnalysisNoData = (): JSX.Element => {
  const commonStyles = useCommonStyles();
  return (
    <Stack
      className={commonStyles.kittyRoot}
      horizontalAlign='center'
      verticalAlign='center'
    >
      <img
        src={kitty}
        alt='no results found'
        className={commonStyles.kittyWidthHeight}
      />
      <h2>No Cost Data Found</h2>
      <Text>We couldn&apos;t find any cost data for this segment.</Text>
      <Text>
        Please wait for more data to populate, as there is a 72 hour delay.
      </Text>
    </Stack>
  );
};
