import { ITheme, getTheme, mergeStyleSets } from '@fluentui/react';

const theme: ITheme = getTheme();
const { palette } = theme;

export const styles = mergeStyleSets({
  container: {
    overflow: 'auto',
  },
  itemCell: {
    minHeight: 30,
    display: 'flex',
    justifyContent: 'center',
    border: 0,
  },
  wrapper: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
  },
  wrap: {
    flexWrap: 'wrap',
  },
  check: {
    fontSize: 27,
    height: 27,
    width: 27,
    margin: 'auto',
  },
  exceedsQuotaIcon: {
    fontSize: 14,
    height: 14,
    width: 14,
    marginRight: '8px',
    marginTop: '8px',
    color: theme.semanticColors.severeWarningIcon,
  },
  selected: {
    background: palette.neutralLight,
  },
  selectedTemplate: {
    boxShadow: '5px 10px 18px #888888',
    padding: '10px',
  },
  rowItem: {
    display: 'flex',
    right: '8px',
    height: '54px',
  },
  spacer: {
    height: '800px',
  },
  horizontalPadding: {
    paddingLeft: '24px',
    paddingRight: '24px',
  },
  offeringListColumn: {
    width: '60%',
    '@media(max-width:1024px)': {
      width: '100%',
    },
  },
  offeringSelectionColumn: {
    width: '40%',
  },
});
