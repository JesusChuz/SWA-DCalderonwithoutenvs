import * as React from 'react';
import { Link, Text } from '@fluentui/react';
import { EMAIL_REGEX, URL_REGEX } from 'src/shared/Constants';

export interface HandleLinksProps {
  textToParse: string;
}

export const HandleLinks = (props: HandleLinksProps): JSX.Element => {
  return (
    <Text>
      {props.textToParse
        .replace(/\n/g, ' ')
        .split(' ')
        .map((substring) =>
          EMAIL_REGEX.test(substring) ? (
            <Link key={substring} href={`mailto:${substring}`}>
              {substring}{' '}
            </Link>
          ) : URL_REGEX.test(substring) ? (
            <Link key={substring} href={substring} target='_blank'>
              {substring}{' '}
            </Link>
          ) : (
            substring + ' '
          )
        )}
    </Text>
  );
};
