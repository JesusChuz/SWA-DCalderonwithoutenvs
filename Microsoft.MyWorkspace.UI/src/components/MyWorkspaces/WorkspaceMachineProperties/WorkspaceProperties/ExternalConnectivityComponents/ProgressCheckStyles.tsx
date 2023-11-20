import { Theme, memoizeFunction, mergeStyleSets } from '@fluentui/react';

export const getProgressCheckStyles = memoizeFunction((theme: Theme) => {
  return mergeStyleSets({
    text: {
      display: 'block',
      cursor: 'default',
      marginTop: '8px',
    },
    icon: {
      fontSize: '18px',
      alignSelf: 'start',
      marginRight: '12px',
      marginTop: '8px',
      cursor: 'default',
    },
    red: {
      color: theme.semanticColors.errorText,
    },
    green: {
      color: theme.semanticColors.successIcon,
    },
    blue: {
      color: theme.semanticColors.infoIcon,
    },
  });
});
