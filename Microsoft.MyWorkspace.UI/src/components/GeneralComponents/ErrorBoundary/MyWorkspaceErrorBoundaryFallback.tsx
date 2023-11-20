import { Stack, PrimaryButton } from '@fluentui/react';
import * as React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { useCommonStyles } from 'src/hooks/useCommonStyles';
import unknownErrorImage from '../../../assets/GenericError.svg';
import clsx from 'clsx';
import { useHistory } from 'react-router';

interface IProps extends FallbackProps {
  size: 'small' | 'large';
  className?: string;
}

export const MyWorkspaceErrorBoundaryFallback = (
  props: IProps
): JSX.Element => {
  const history = useHistory();
  const commonStyles = useCommonStyles();
  return (
    <Stack
      className={clsx(
        commonStyles.kittyRoot,
        commonStyles.paddingTopBottom16,
        props.className
      )}
      horizontalAlign='center'
      verticalAlign='center'
    >
      <Stack horizontalAlign='center'>
        <img
          src={unknownErrorImage}
          alt=''
          className={
            props.size === 'small'
              ? commonStyles.smallErrorWidthHeight
              : commonStyles.kittyWidthHeight
          }
        />
        <h3>{'Something went wrong :('}</h3>
        <p>{'An error has occurred.'}</p>
        <PrimaryButton onClick={() => history.go(0)} text={'Reload'} />
      </Stack>
    </Stack>
  );
};
