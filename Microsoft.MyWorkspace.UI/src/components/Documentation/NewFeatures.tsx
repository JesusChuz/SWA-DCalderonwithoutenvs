/* eslint-disable jsx-a11y/media-has-caption */
import * as React from 'react';
import { Stack, useTheme, Text } from '@fluentui/react';
import { getDocumentationStyles } from './DocumentationStyles';
import sanitizeHtml from 'sanitize-html';

interface IProps {
  title: string;
  body: string;
  imageUrl?: string;
}

const NewFeatures = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const documentationStyles = getDocumentationStyles(theme);

  return (
    <Stack className={documentationStyles.bottomCard}>
      <Text as='h2' variant='xLarge'>
        {props.title}
      </Text>
      <div
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(props.body),
        }}
      />
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

export { NewFeatures as default };
