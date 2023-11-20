import { memoizeFunction, mergeStyleSets, Theme } from '@fluentui/react';

export const getAllWorkspacesStyles = memoizeFunction((theme: Theme) => {
  return mergeStyleSets({
    card: {
      width: '400px',
      height: '400px',
      background: 'white',
      boxShadow: `rgba(0, 0, 0, 0.133) 0px 1.6px 3.6px 0px, rgba(0, 0, 0, 0.11) 0px 0.3px 0.9px 0px`,
    },
    cardActionButton: {
      height: '50px',
      width: '50px',
    },
    commandBarWrapper: {
      marginTop: '32px',
      width: 'fit-content',
    },
    commandBarRow: {
      height: '44px',
    },
    hoverCardContent: {
      width: '200px',
      height: '100px',
    },
    machineContainer: {
      height: '350px',
      overflowY: 'auto',
    },
    machineHeader: {
      borderBottom: `1px solid ${theme.palette.neutralTertiary}`,
      height: '50px',
    },
    machineItem: {
      borderBottom: `1px solid ${theme.palette.neutralTertiary}`,
      padding: '6px 30px 6px 30px',
    },
    machineActionButton: {
      height: '48px',
      width: '48px',
      margin: '-6px 0px',
    },
    successIcon: {
      color: theme.semanticColors.successIcon,
      fontSize: '18px',
      cursor: 'pointer',
    },
    warningIcon: {
      color: theme.semanticColors.warningIcon,
      fontSize: '18px',
      cursor: 'pointer',
    },
    errorIcon: {
      color: theme.semanticColors.errorText,
      fontSize: '18px',
      cursor: 'pointer',
    },
    warningIconLarge: {
      color: theme.semanticColors.warningIcon,
      fontSize: '24px',
      cursor: 'pointer',
      marginTop: '4px',
    },
    container: {
      margin: 'auto',
      width: '94%',
      height: '100%',
    },
  });
});
