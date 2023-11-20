import { memoizeFunction, mergeStyleSets, Theme } from '@fluentui/react';

export const getAdminViewStyles = memoizeFunction((theme: Theme) => {
  return mergeStyleSets({
    searchBar: {
      margin: 'auto',
      width: '94%',
    },
    commandBarWrapper: {
      marginTop: '32px',
      width: '100%',
    },
    commandBarRow: {
      height: '44px',
      width: '100%',
    },
    maxTenantSegmentAdminTabWidth: {
      maxWidth: 1500,
    },
    maxQuotaTabWidth: {
      maxWidth: 1000,
    },
    stickyNavBar: {
      background: theme.semanticColors.bodyBackground,
      marginTop: '0px',
      position: 'sticky',
      top: '0',
      zIndex: '1',
    },
    costSummaryCard: {
      width: 245,
      height: 150,
    },
  });
});
