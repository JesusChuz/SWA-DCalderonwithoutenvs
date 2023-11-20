import {
  memoizeFunction,
  mergeStyleSets,
  Theme,
  useTheme,
} from '@fluentui/react';

const getCounterBadgeStyles = memoizeFunction((theme: Theme) => {
  return mergeStyleSets({
    counterBadge: {
      backgroundColor: theme.palette.red,
      color: 'white',
      fontSize: 10,
      minWidth: 10,
      paddingLeft: 3,
      paddingRight: 3,
      height: 16,
      fontWeight: 600,
      textAlign: 'center',
      display: 'inline',
      borderRadius: '100%',
      lineHeight: 'normal',
    },
    sideNavCounterBadgeStyle: {
      position: 'absolute',
      left: '28px',
      top: '2px',
    },
    sideNavCounterBadgeStyleWide: {
      left: '22px',
    },
    pivotCounterBadgeStyle: {
      position: 'relative',
      right: '0px',
      top: '-2px',
    },
  });
});

export const useCounterBadgeStyles = () => {
  const theme = useTheme();
  return getCounterBadgeStyles(theme);
};
