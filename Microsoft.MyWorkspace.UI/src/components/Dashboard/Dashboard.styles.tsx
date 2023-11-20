import {
  mergeStyleSets,
  Theme,
  normalize,
  memoizeFunction,
} from '@fluentui/react';

export const getDashboardStyles = memoizeFunction((theme: Theme) => {
  return mergeStyleSets({
    container: {
      margin: 'auto',
      width: '94%',
    },
    listViewCell: {
      fontSize: theme.fonts.small.fontSize,
      normalize,
      boxSizing: 'border-box',
      borderBottom: '1px solid #CCC',
      display: 'flex',
      flexWrap: 'wrap',
      overflow: 'auto',
      padding: 8,
      justifyContent: 'space-between',
      selectors: {
        '&:hover': { background: theme.palette.neutralLight },
      },
    },
    mediumCardTextEllipsis: {
      textOverflow: 'ellipsis',
      maxWidth: '300px',
      overflow: 'hidden',
      paddingBottom: '8px',
    },
    listViewContainer: {
      maxHeight: 400,
      marginLeft: 10,
    },
    listViewExpiredColor: {
      color: theme.semanticColors.errorText,
    },
    listViewRegularColor: {
      color: theme.semanticColors.bodyText,
    },
    muuriItemDragging: {
      zIndex: 3,
    },
    muuriItemReleasing: {
      zIndex: 2,
    },
    muuriItemHidden: {
      zIndex: 0,
    },
    grid: {
      position: 'relative',
    },
    item: {
      display: 'block',
      position: 'absolute',
      width: '100px',
      height: '100px',
      margin: '5px',
      zIndex: 1,
      background: '#000',
      color: '#fff',
    },
    itemContent: {
      position: 'relative',
      width: '100%',
      height: '100%',
    },
    listViewCellText: {
      marginTop: 'auto',
      marginBottom: 'auto',
    },
    dashBoardContainer: {
      padding: '8px',
      background: theme.palette.neutralLighterAlt,
      minHeight: '250px',
      boxShadow:
        'rgb(0 0 0 / 11%) 0px 0.3px 0.9px, rgb(0 0 0 / 13%) 0px 1.6px 3.6px',
    },
    smDashboardCard: {
      width: '170px',
      height: '170px',
      margin: '8px',
      background: theme.semanticColors.bodyBackground,
    },
    medDashboardCard: {
      width: '355px',
      height: '355px',
      margin: '8px',
      background: theme.semanticColors.bodyBackground,
    },
    lgDashboardCard: {
      width: '725px',
      height: '725px',
      margin: '8px',
      background: theme.semanticColors.bodyBackground,
    },
    wideDashboardCard: {
      width: '1500px',
      height: '355',
      margin: '8px',
      background: theme.semanticColors.bodyBackground,
    },
    dashboardPanelButton: {
      margin: '25px',
    },
    dashboardPanelCheckBox: {
      margin: '2px',
    },
  });
});
