import {
  FontWeights,
  memoizeFunction,
  mergeStyleSets,
  Theme,
} from '@fluentui/react';

export const getCanvasStyles = memoizeFunction((theme: Theme) => {
  return mergeStyleSets({
    osName: {
      font: 'bold 18px Calibri',
    },
    vmName: {
      fontSize: '30px',
      fontWeight: 'bold',
    },
    vnetName: {
      font: 'bold 18px',
    },
    domainSection: {
      fontSize: '30px',
      fontWeight: 'bold',
    },
    noDomainMembers: {
      fontSize: '20px',
      fontWeight: 'bold',
    },
    callout: {
      width: 320,
      maxWidth: '90%',
      padding: '20px 24px',
    },
    calloutTitle: {
      marginBottom: 12,
      fontWeight: FontWeights.semilight,
    },
  });
});
