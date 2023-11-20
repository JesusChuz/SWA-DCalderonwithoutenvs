import * as React from 'react';
import {
  Stack,
  Text,
  IconButton,
  Callout,
  DirectionalHint,
} from '@fluentui/react';

export interface InfoButtonProps {
  buttonId: string;
  calloutTitle: string;
  calloutBody: React.ReactChild;
  directionalHint?: DirectionalHint;
  className?: string;
}

export const InfoButton = (props: InfoButtonProps): JSX.Element => {
  const [isCalloutVisible, setIsCalloutVisible] = React.useState(false);
  return (
    <>
      <IconButton
        id={props.buttonId}
        title='Info'
        ariaLabel='Info'
        iconProps={{ iconName: 'Info' }}
        onClick={(event) => {
          setIsCalloutVisible(!isCalloutVisible);
          event.stopPropagation();
        }}
        className={props?.className}
      />
      {isCalloutVisible && (
        <Callout
          target={`#${props.buttonId}`}
          setInitialFocus
          onDismiss={(event) => {
            setIsCalloutVisible(false);
            event.stopPropagation();
          }}
          role='alertdialog'
          directionalHint={props.directionalHint}
        >
          <Stack
            tokens={{
              maxWidth: 400,
              childrenGap: 8,
            }}
            horizontalAlign='start'
            style={{ padding: 24 }}
          >
            <Text variant='xLarge'>{props.calloutTitle}</Text>
            {typeof props.calloutBody === 'string' ? (
              <Text>{props.calloutBody}</Text>
            ) : (
              props.calloutBody
            )}
          </Stack>
        </Callout>
      )}
    </>
  );
};
