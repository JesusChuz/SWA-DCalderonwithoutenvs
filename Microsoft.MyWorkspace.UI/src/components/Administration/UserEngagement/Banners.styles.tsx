import { memoizeFunction, mergeStyleSets, Theme } from '@fluentui/react';

export const getBannerStyles = memoizeFunction((theme: Theme) => {
  return mergeStyleSets({
    messageBar: {
      ':hover': {
        cursor: 'pointer',
      },
    },
  });
});
