import { mergeStyleSets } from '@fluentui/react';

export const styles = mergeStyleSets({
  rotate: {
    transform: 'rotate(180deg)',
  },
  collapsed: {
    maxHeight: '40px',
  },
  smCard: {
    height: '150px',
    width: '150px',
  },
  medCard: {
    height: '300px',
    width: '300px',
  },
  lgCard: {
    height: '350px',
    width: '300px',
  },
});
