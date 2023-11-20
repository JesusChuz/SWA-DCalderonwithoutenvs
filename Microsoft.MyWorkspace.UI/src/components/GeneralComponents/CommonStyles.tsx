import {
  getTheme,
  IPivotStyleProps,
  IPivotStyles,
  IStyleFunctionOrObject,
  ITheme,
  memoizeFunction,
  mergeStyleSets,
  Theme,
} from '@fluentui/react';
import { azureCloudGreen } from '../../shared/Colors';

export const topNavHeight = 48;
const navCollapsedWidth = 48;

const theme: ITheme = getTheme();
const scrollablePaneStyles = {
  position: 'fixed',
  top: topNavHeight,
  bottom: 0,
  right: 0,
  margin: 'auto',
};

const { palette } = theme;

export const getCommonStyles = memoizeFunction((theme: Theme) => {
  return mergeStyleSets({
    errorText: {
      color: theme.semanticColors.errorText,
    },
    successText: {
      color: azureCloudGreen,
    },
    errorTextBold: {
      color: theme.semanticColors.errorText,
      fontWeight: 'bold',
    },
    boldText: {
      fontWeight: 'bold',
    },
    flexItem: {
      margin: '8px 4px',
    },
    flexGrow: {
      flexGrow: 1,
    },
    flexShrink0: {
      flexShrink: 0,
    },
    flexItemHorizontalPad: {
      margin: '0px 4px',
    },
    fontWeight600: {
      fontWeight: 600,
    },
    width5: {
      width: '5%',
    },
    width10: {
      width: '10%',
    },
    width25: {
      width: '25%',
    },
    width33: {
      width: '33%',
    },
    width40: {
      width: '40%',
    },
    halfWidth: {
      width: '50%',
    },
    width60: {
      width: '60%',
    },
    width67: {
      width: '67%',
    },
    width75: {
      width: '75%',
    },
    width80: {
      width: '80%',
    },
    width90: {
      width: '90%',
    },
    fullWidth: {
      width: '100%',
    },
    multiLineTextField: {
      maxHeight: '256px',
    },
    width100px: {
      width: '100px',
    },
    width150px: {
      width: '150px',
    },
    scrollablePaneCollapsed: {
      ...scrollablePaneStyles,
      left: navCollapsedWidth,
      width: `calc(95vw -${navCollapsedWidth} )`,
    },
    scrollablePaneExpand: {
      ...scrollablePaneStyles,
      left: 228,
      width: `calc(95vw -${228} )`,
    },
    sidePropertiesList: {
      height: '100%',
      maxWidth: '370px',
      minWidth: '370px',
      overflowY: 'auto',
      overflowX: 'hidden',
      '@media(max-width:1300px)': {
        maxWidth: '325px',
        minWidth: '325px',
      },
      '@media(max-width:1035px)': {
        maxWidth: '300px',
        minWidth: '300px',
      },
    },
    sidePropertiesMachineItem: {
      width: '100%',
      height: '42px',
      padding: '16px',
      borderBottom: `solid 1px ${theme.palette.neutralQuaternary}`,
      cursor: 'pointer',
    },
    sidePropertiesWorkspaceItem: {
      width: '100%',
      height: '42px',
      padding: '16px',
      borderBottom: `solid 1px ${theme.palette.neutralQuaternary}`,
      cursor: 'pointer',
    },
    osIcon: {
      width: '16px',
      height: '16px',
      marginRight: '16px',
    },
    verticalAlign: {
      alignItems: 'center',
    },
    columnContainer: {
      flexDirection: 'column',
    },
    subnetPadding: {
      paddingLeft: '20px',
    },
    warningText: {
      color: theme.semanticColors.severeWarningIcon,
    },
    warningTextBold: {
      color: theme.semanticColors.severeWarningIcon,
      fontWeight: 'bold',
    },
    colorRedText28: {
      color: 'red',
      fontSize: 28,
    },
    fullHeight: {
      height: '100%',
    },
    fitContentHeight: {
      height: 'fit-content',
    },
    leftAlignText: {
      textAlign: 'left',
    },
    centerAlignText: {
      textAlign: 'center',
    },
    widthFillAvailable: {
      width: 'fill-available',
    },
    widthFillAvailableMoz: {
      width: '-moz-available',
    },
    widthFillAvailableWebkit: {
      width: '-webkit-fill-available',
    },
    whiteText: {
      color: 'white',
    },
    marginAuto: {
      margin: 'auto',
    },
    flexCentered: {
      display: 'flex',
      alignItems: 'center',
    },
    flexRow: {
      flexDirection: 'row',
    },
    workspaceMachineTitle: {
      fontWeight: '600',
      maxWidth: '410px',
    },
    form: {
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
    },
    floatRight: {
      float: 'right',
    },
    margin0: {
      margin: 0,
    },
    margin20: {
      margin: '20px',
    },
    padding0: {
      padding: 0,
    },
    padding16: {
      padding: '16px',
    },
    marginLeft8: {
      marginLeft: '8px',
    },
    marginLeft20: {
      marginLeft: '20px',
    },
    marginRight8: {
      marginRight: '8px',
    },
    marginRight32: {
      marginRight: '32px',
    },
    blur: {
      filter: 'blur(4px)',
    },
    paddingTop12: {
      paddingTop: '12px',
    },
    paddingTop8: {
      paddingTop: '8px',
    },
    paddingTopBottom16: {
      paddingTop: '16px',
      paddingBottom: '16px',
    },
    paddingTopBottom64: {
      paddingTop: '64px',
      paddingBottom: '64px',
    },
    loading: {
      marginTop: '20%',
    },
    container: {
      margin: 'auto',
      width: '94%',
      paddingTop: '8px',
    },
    paddingLeft2: {
      paddingLeft: '2px',
    },
    paddingLeft8: {
      paddingLeft: '8px',
    },
    textFieldSpacing: {
      marginBottom: '12px',
    },
    nicCombo: {
      width: '100%',
    },
    marginTop6px: {
      marginTop: '6px',
    },
    marginTop16: {
      marginTop: '16px',
    },
    marginTop24: {
      marginTop: '24px',
    },
    overflowXAuto: {
      'overflow-x': 'auto',
    },
    overflowXHidden: {
      'overflow-x': 'hidden',
    },
    overflowYAuto: {
      'overflow-y': 'auto',
    },
    overflowYHidden: {
      'overflow-y': 'hidden',
    },
    autoOverflow90: {
      height: '90%',
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    autoOverflow80vh: {
      maxHeight: '80vh',
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    displayBlock: {
      display: 'block',
    },
    quotaErrorRoot: {
      width: '100%',
      height: '100%',
      padding: '64px 0',
    },
    quotaErrorText: {
      width: '70%',
      height: '100%',
      textAlign: 'center',
    },
    quotaErrorImage: {
      width: '175px',
      height: '175px',
    },
    kittyRoot: {
      width: '100%',
      height: '100%',
    },
    smallErrorWidthHeight: {
      width: '96px',
      height: '96px',
    },
    kittyWidthHeight: {
      width: '200px',
      height: '200px',
    },
    mainContainer: {
      marginTop: '50px',
      boxSizing: 'border-box',
      overflow: 'auto',
    },
    commandBarButton: {
      height: '100%',
    },
    contextMenuButton: {
      width: '100%',
      height: '36px',
      textAlign: 'left',
    },
    font12: {
      fontSize: '12px',
      color: theme.semanticColors.warningIcon,
    },
    font15: {
      fontSize: '15px',
    },
    font18: {
      fontSize: '18px',
    },
    font22: {
      fontSize: '22px',
    },
    font25: {
      fontSize: '25px',
    },
    font39: {
      fontSize: '39px',
      textAlign: 'center',
    },
    font45: {
      fontSize: '45px',
    },
    font60: {
      fontSize: '60px',
    },
    minWidth500px: {
      minWidth: '500px',
    },
    notificationPanel: {
      selectors: {
        '> .ms-Panel-main': {
          overflowY: 'hidden',
        },
      },
    },
    toastContainer: {
      top: '60px !important',
    },
    transparentBackground: {
      backgroundColor: 'transparent',
    },
    whiteBackground: {
      backgroundColor: 'white',
    },
    fullscreen: {
      position: 'absolute',
      left: 0,
      top: topNavHeight,
      height: '100vh',
      width: `100vw`,
      transition: 'width 2s, height 4s',
    },
    visibilityHidden: {
      visibility: 'hidden',
    },
    textOverflowEllipsis: {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    cursorDefault: {
      cursor: 'default',
    },
    cursorPointer: {
      cursor: 'pointer',
    },
    marginBottom0: {
      marginBottom: 0,
    },
    marginBottom4: {
      marginBottom: 4,
    },
    marginBottom8: {
      marginBottom: 8,
    },
    paddingTop20: {
      paddingTop: 20,
    },
    italicFont: {
      fontStyle: 'italic',
    },
    flexPivot: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      overflowY: 'auto',
    },
    minHeight100: {
      minHeight: 100,
    },
    minHeight150: {
      minHeight: 150,
    },
    minHeight250: {
      minHeight: 250,
    },
    maxHeight100: {
      maxHeight: 100,
    },
    basicListStyle: {
      lineHeight: '32px',
      borderBottom: `1px solid ${theme.semanticColors.bodyDivider}`,
      selectors: {
        '&:hover': { background: palette.neutralLight },
      },
    },
    borderBottom0: {
      borderBottom: 0,
    },
    whiteSpacePreLine: {
      whiteSpace: 'pre-line',
    },
    font14: {
      fontSize: 14,
    },
    font16: {
      fontSize: 16,
    },
    textFieldName: {
      width: 400,
      float: 'right',
      fontSize: 11,
      paddingTop: 5,
    },
    textField: {
      width: 220,
      float: 'right',
      fontSize: 11,
      paddingTop: 5,
    },
    maxWidth400: {
      maxWidth: 400,
    },
    maxWidth1500: {
      maxWidth: 1500,
    },
    padRight8: {
      paddingRight: '8px',
    },
    padRight20: {
      paddingRight: '20px',
    },
    severeWarningColor: {
      color: theme.semanticColors.severeWarningIcon,
    },
    warningColor: {
      color: theme.semanticColors.warningIcon,
    },
    errorColor: {
      color: theme.semanticColors.errorIcon,
    },
    left50: {
      left: '50%',
    },
    nonWrappingText: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
    fullscreenHeight: {
      height: '100vh',
    },
    fullBodyHeight: {
      height: `calc(100vh - ${topNavHeight}px)`,
    },
  });
});

export const PivotStyles: Record<
  'TabPadding' | 'ItemContainerOverflow',
  IStyleFunctionOrObject<IPivotStyleProps, IPivotStyles>
> = {
  TabPadding: {
    root: {
      paddingLeft: '1px',
      paddingRight: '1px',
      paddingTop: '1px',
    },
  },
  ItemContainerOverflow: {
    itemContainer: {
      overflowY: 'auto',
      marginBottom: 2,
      paddingRight: 2,
      selectors: {
        '& > div': {
          height: '100%',
        },
      },
    },
  },
};
