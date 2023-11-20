import {
  mergeStyleSets,
  Theme,
  memoizeFunction,
  getFocusStyle,
} from '@fluentui/react';

export const getDiagnosticStyles = memoizeFunction((theme: Theme) => {
  return mergeStyleSets({
    container: {
      overflow: 'auto',
      maxHeight: 500,
    },
    itemCell: [
      getFocusStyle(theme, { inset: -1 }),
      {
        minHeight: 20,
        padding: 10,
        boxSizing: 'border-box',
        borderBottom: `1px solid ${theme.semanticColors.bodyDivider}`,
        display: 'flex',
        selectors: {
          '&:hover': {
            backgroundColor: theme.palette.neutralQuaternaryAlt,
          },
        },
      },
    ],
    itemContent: {
      justifyContent: 'space-between',
      width: '100%',
      vertical: 'center',
    },
    itemName: [
      theme.fonts.medium,
      {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontWeight: 'bold',
        margin: 2,
      },
    ],
    itemIndex: {
      fontSize: theme.fonts.small,
    },
    itemSection: [
      theme.fonts.mediumPlus,
      {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontWeight: 'bold',
      },
    ],
    dotIcon: {
      fontSize: '12px',
      display: 'block',
      cursor: 'default',
    },
    redIcon: {
      color: theme.semanticColors.errorText,
    },
    orangeIcon: {
      color: theme.semanticColors.warningIcon,
    },
    greenIcon: {
      color: theme.semanticColors.successIcon,
    },
    blueIcon: {
      color: theme.semanticColors.infoIcon,
    },
    greyIcon: {
      color: theme.palette.neutralLight,
    },
  });
});
