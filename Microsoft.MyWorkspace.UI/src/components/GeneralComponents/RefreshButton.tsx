import * as React from 'react';
import { IconButton, Spinner, TooltipHost } from '@fluentui/react';

interface IRefreshButtonProps {
  text: string;
  isRefreshing: boolean;
  onRefreshClick: () => void;
}

export const RefreshButton = (props: IRefreshButtonProps): JSX.Element => {
  return (
    <>
      {props.isRefreshing ? (
        <Spinner style={{ width: '32px', height: '32px' }} />
      ) : (
        <TooltipHost content={props.text}>
          <IconButton
            ariaLabel={props.text}
            iconProps={{ iconName: 'Refresh' }}
            onClick={props.onRefreshClick}
          />
        </TooltipHost>
      )}
    </>
  );
};
