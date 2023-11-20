import { memoizeFunction, mergeStyleSets, Theme } from '@fluentui/react';

export const getNewAzureWorkspaceStyles = memoizeFunction((theme: Theme) => {
  return mergeStyleSets({
    tabError: {
      color: 'red',
      marginLeft: '10px',
    },
    tabComplete: {
      color: theme.semanticColors.successIcon,
      marginLeft: '10px',
    },
    pivotTabs: {
      margin: 'auto',
      textAlign: 'left',
      width: '94%',
      display: 'flex',
      flexDirection: 'column',
      justifyItems: 'stretch',
      height: '100%',
    },
    wrapper: {
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    wrap: {
      flexWrap: 'wrap',
    },
    paddedTextField: {
      paddingRight: '10px',
    },
    container: {
      margin: 'auto',
      width: '94%',
      marginTop: '.7%',
    },
    center: {
      paddingTop: '2%',
      paddingLeft: '150px',
    },
    image: {
      paddingLeft: '25px',
    },
    button: {
      marginTop: '10%',
      maxWidth: 300,
    },
    selectedTemplate: {
      boxShadow: '5px 10px 10px #888888',
      padding: '10px',
    },
    passwordInput: {
      width: 250,
    },
    memoryCombo: {
      width: '33%',
      paddingLeft: '20px',
    },
    machineConfigStack: {
      margin: '0 10px 10px 10px',
      flexBasis: '225px',
    },
    machineConfigStackContainer: {
      maxWidth: '1000px',
      justifySelf: 'flex-end',
    },
    nameAndDescriptionContainer: {
      maxWidth: '650px',
      width: '100%',
    },
    listPadding: {
      padding: '5px 0',
      display: 'block',
    },
    descriptionStyles: {
      wordWrap: 'break-word',
    },
    italicFont: {
      fontStyle: 'italic',
    },
    templateDetailsPanelHeader: {
      marginLeft: '36px',
      marginBottom: '12px',
    },
  });
});
