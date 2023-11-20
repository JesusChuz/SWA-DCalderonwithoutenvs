/* eslint-disable jsx-a11y/media-has-caption */
import * as React from 'react';
import { Stack, useTheme, Text } from '@fluentui/react';
import { getDocumentationStyles } from './DocumentationStyles';
import { useHistory } from 'react-router';

interface userGuideProps {
  title: string;
  description: string;
  imageUrl?: string;
}

const UserGuides = (props: userGuideProps): JSX.Element => {
  const theme = useTheme();
  const documentationStyles = getDocumentationStyles(theme);

  return (
    <Stack className={documentationStyles.userGuide}>
      <Text as='h1' variant='xxLarge'>
        {props.title}
      </Text>
      <Text variant='mediumPlus'>{props.description}</Text>
      <br />
      {props.imageUrl && (
        <>
          {props.imageUrl.includes('.mp4') ? (
            <video autoPlay loop controls width='100%' key={props.imageUrl}>
              <source src={props.imageUrl} type='video/mp4' />
            </video>
          ) : (
            <img
              src={props.imageUrl}
              alt='sample_image'
              width='100%'
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
          )}
        </>
      )}
    </Stack>
  );
};

export { UserGuides as default };
