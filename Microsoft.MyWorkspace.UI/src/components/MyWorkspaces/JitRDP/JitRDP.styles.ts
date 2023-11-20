import { memoizeFunction, mergeStyleSets, Theme } from '@fluentui/react';

export const getJitRDPStyles = memoizeFunction((theme: Theme) => {
  return mergeStyleSets({
    jitComponent: {
      flexWrap: 'wrap',
      display: 'flex',
      paddingBottom: '16px',
    },
    paddingBottom8: {
      paddingBottom: '8px',
    },
    paddingBottom16: {
      paddingBottom: '16px',
    },
    columnReverse: {
      flexDirection: 'column-reverse',
    },
    jitHighlight: {
      border: `1px solid ${theme.palette.neutralLight}`,
      padding: '8px',
    },
    jitPanelIPAddress: {
      margin: '24px 0 12px',
    },
  });
});
