import * as React from 'react';
import { Stack, PrimaryButton, useTheme } from '@fluentui/react';
import unknownErrorImage from '../../assets/GenericError.svg';
import { useHistory } from 'react-router-dom';
import { getCommonStyles } from '../GeneralComponents/CommonStyles';

interface IProps {
  title?: string;
  message?: string;
  helpLink?: string;
  linkMessage?: string;
  showButton?: boolean;
  buttonMessage?: string;
}

export const ErrorPage = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const history = useHistory();
  const { title, message, helpLink, linkMessage, showButton, buttonMessage } =
    props;

  return (
    <Stack
      className={commonStyles.kittyRoot}
      horizontalAlign='center'
      verticalAlign='center'
    >
      <Stack horizontalAlign='center'>
        <img
          src={unknownErrorImage}
          alt=''
          className={commonStyles.kittyWidthHeight}
        />
        <h3>{title ? title : 'Something went wrong :('}</h3>
        <p>{message ? message : ''}</p>
        {showButton ? (
          <PrimaryButton
            onClick={() => history.push('/')}
            text={buttonMessage}
          />
        ) : (
          ''
        )}
        <a href={helpLink}>{linkMessage ? linkMessage : ''}</a>
      </Stack>
    </Stack>
  );
};
