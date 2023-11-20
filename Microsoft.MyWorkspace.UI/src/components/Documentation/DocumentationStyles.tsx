import { Theme, memoizeFunction, mergeStyleSets } from '@fluentui/react';

export const getDocumentationStyles = memoizeFunction((theme: Theme) => {
  return mergeStyleSets({
    body: {
      margin: '40px',
      maxWidth: '1600px',
    },
    navBar: {
      display: 'block',
      maxWidth: '320px',
      marginLeft: '8px',
    },
    overview: {
      marginLeft: '100px',
      marginRight: '100px',
    },
    button: {
      maxWidth: '200px',
    },
    bottomCard: {
      marginRight: '50px',
      flex: 1,
    },
    cardsContainer: {
      marginLeft: '100px',
      display: 'flex',
      flex: 1,
    },
    image: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    userGuide: {
      marginLeft: '100px',
    },
    userGuideBody: {
      marginLeft: '40px',
      maxWidth: '70%',
    },
  });
});
