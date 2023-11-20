import {
  mergeStyleSets,
  IIconProps,
  IStackProps,
  IStackTokens,
  memoizeFunction,
  Theme,
} from '@fluentui/react';

export const cancelIcon: IIconProps = { iconName: 'Cancel' };

export const getContentStyles = memoizeFunction((theme: Theme) => {
  return mergeStyleSets({
    tourContainer: {
      display: 'flex',
      flexFlow: 'column nowrap',
      alignItems: 'stretch',
      width: '75%',
      maxWidth: '1000px',
    },
    featureContainer: {
      display: 'flex',
      flexFlow: 'column nowrap',
      alignItems: 'stretch',
      width: '600px',
    },
    header: {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      display: 'flex',
      alignItems: 'center',
      padding: '12px 12px 14px 24px',
    },
    body: {
      flex: '4 4 auto',
      padding: '0 24px 24px 24px',
      overflowY: 'hidden',
      selectors: {
        p: { margin: '14px 0' },
        'p:first-child': { marginTop: 0 },
        'p:last-child': { marginBottom: 0 },
      },
    },
    image: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    featureImage: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: '500px',
    },
  });
});

export const stackProps: Partial<IStackProps> = {
  horizontal: true,
  tokens: { childrenGap: 40 },
  styles: { root: { marginBottom: 20 } },
};

export const getIconButtonStyles = memoizeFunction((theme: Theme) => {
  return mergeStyleSets({
    root: {
      color: theme.palette.neutralPrimary,
      marginLeft: 'auto',
      marginTop: '4px',
      marginRight: '2px',
    },
    rootHovered: {
      color: theme.palette.neutralDark,
    },
  });
});

export const stackTokens: IStackTokens = { childrenGap: 20 };
