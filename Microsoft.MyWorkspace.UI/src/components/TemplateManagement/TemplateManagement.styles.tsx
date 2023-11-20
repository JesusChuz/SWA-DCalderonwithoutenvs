import { memoizeFunction, mergeStyleSets, Theme } from '@fluentui/react';

export const getTemplateManagementStyles = memoizeFunction((theme: Theme) => {
  return mergeStyleSets({
    searchBar: {
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
      maxWidth: 2000,
    },
    stickyNavBar: {
      background: theme.semanticColors.bodyBackground,
      marginTop: '0px',
      position: 'sticky',
      top: '0',
    },
    panelWidth: {
      maxWidth: '50%',
      position: 'absolute',
      right: '0',
    },
  });
});
