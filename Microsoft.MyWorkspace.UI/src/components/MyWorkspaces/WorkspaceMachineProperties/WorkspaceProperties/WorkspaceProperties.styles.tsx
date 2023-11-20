import { memoizeFunction, mergeStyleSets, Theme } from '@fluentui/react';

export const getWorkspacePropertiesStyles = memoizeFunction((theme: Theme) => {
  return mergeStyleSets({
    actionsRow: {
      height: '44px',
    },
    caseButton: {
      marginLeft: '50% !important',
    },
    root: {
      padding: '16px',
      minWidth: '535px',
      maxWidth: '900px',
      flexGrow: 1,
    },
    padRight16: {
      paddingRight: '16px',
    },
    propertiesContent: {
      width: '100%',
    },
    listItem: {
      margin: '8px',
    },
    tabErrorIcon: {
      color: theme.semanticColors.errorText,
      fontWeight: '600 !important',
      marginRight: '4px',
    },
    addSharedOwnerButton: {
      marginTop: '20px',
      marginBottom: '20px',
    },
    leftMargin0: {
      marginLeft: '0 !important',
    },
    listGridExample: {
      overflow: 'hidden',
      fontSize: 0,
      position: 'relative',
    },
    listGridExampleTile: {
      textAlign: 'center',
      outline: 'none',
      position: 'relative',
      float: 'left',
      selectors: {
        'focus:after': {
          content: '',
          position: 'absolute',
          left: 2,
          right: 2,
          top: 2,
          bottom: 2,
          boxSizing: 'border-box',
        },
      },
    },
    listGridExampleSizer: {
      paddingBottom: '100%',
    },
    listGridExamplePadder: {
      position: 'absolute',
      left: 2,
      top: 2,
      right: 2,
      bottom: 2,
    },
    listGridExampleLabel: {
      background: 'rgba(0, 0, 0, 0.3)',
      color: '#FFFFFF',
      position: 'absolute',
      padding: 10,
      bottom: 0,
      left: 0,
      width: '100%',
      boxSizing: 'border-box',
    },
    listGridExampleImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
    },
    externalConnectivityWarning: {
      fontWeight: '600',
      color: theme.semanticColors.errorText,
    },
    hourDropdown: {
      width: 54,
    },
    minuteDropdown: {
      width: 54,
    },
    ampmDropdown: {
      width: 60,
    },
    daysOfWeekDropdown: {
      width: 500,
    },
    timezoneDropdown: {
      width: 500,
    },
    paddingTop20: {
      paddingTop: 20,
    },
    paddingTop30: {
      paddingTop: 30,
    },
  });
});
