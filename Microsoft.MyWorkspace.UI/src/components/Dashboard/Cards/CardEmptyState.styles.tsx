import { mergeStyleSets } from '@fluentui/react';

export const styles = mergeStyleSets({
  cardEmptyStateContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexFlow: 'column nowrap',
    padding: '10px',
    textAlign: 'center',
    height: '100%',
  },
  smallHeaderText: {
    fontSize: '18px',
  },
});
