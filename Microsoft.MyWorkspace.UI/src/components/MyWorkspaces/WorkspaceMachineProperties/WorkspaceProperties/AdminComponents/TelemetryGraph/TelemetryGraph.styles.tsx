import { memoizeFunction, mergeStyleSets, Theme } from '@fluentui/react';
import { topNavHeight } from '../../../../../GeneralComponents/CommonStyles';

export const getTelemetryGraphStyles = memoizeFunction((theme: Theme) => {
  return mergeStyleSets({
    fullscreen: {
      backgroundColor: theme.semanticColors.bodyBackground,
      position: 'absolute',
      left: 0,
      top: topNavHeight,
      height: '100vh',
      width: `100vw`,
    },
  });
});
