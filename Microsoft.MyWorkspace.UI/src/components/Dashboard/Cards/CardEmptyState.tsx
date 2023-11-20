import { PrimaryButton, Text } from '@fluentui/react';
import * as React from 'react';
import { styles } from './CardEmptyState.styles';

interface IButtonProps {
  text: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

interface IProps {
  isSmall?: boolean;
  imgSrc?: string;
  size?: number;
  headerText?: string;
  descriptionText?: string;
  buttonProps?: IButtonProps;
}

export const CardEmptyState = (props: IProps): JSX.Element => {
  return (
    <div className={styles.cardEmptyStateContainer}>
      {props.imgSrc && (
        <img
          src={props.imgSrc}
          alt='Card Empty State'
          width={props.size || 65}
          height={props.size || 65}
        />
      )}
      <Text as='h1' className={styles.smallHeaderText}>
        {props.headerText}
      </Text>
      <Text>{props.descriptionText}</Text>
      {props.buttonProps && (
        <div style={{ margin: '10px' }}>
          <PrimaryButton {...props.buttonProps} />
        </div>
      )}
    </div>
  );
};
