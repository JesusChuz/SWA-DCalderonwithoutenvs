import * as React from 'react';

import { Text, IFontStyles, Stack, Icon, TooltipHost } from '@fluentui/react';
import { RemainingTime } from '../../../types/RemainingTime.types';
import { styles } from './TimeRemaining.styles';

interface IProps {
  timeRemaining: RemainingTime;
  className: string;
  tooltipContent: string;
  ariaLabel: string;
  expiredMessage: string;
  iconName: string;
  suffix?: string;
  variant?: keyof IFontStyles;
  tooltipWidth?: string;
}

export const TimeRemaining = (props: IProps) => {
  return (
    <TooltipHost
      tooltipProps={{ maxWidth: props.tooltipWidth }}
      content={props.tooltipContent}
    >
      <Stack
        horizontal
        verticalAlign='center'
        tokens={{ childrenGap: 4, padding: 2 }}
        className={props.className}
        style={{ color: 'black' }}
      >
        <Icon
          iconName={props.iconName}
          className={`${styles.icon} ${
            props.variant === 'large' ? styles.largeIcon : ''
          }`}
        />
        <Text
          role='timer'
          variant={props.variant ?? 'medium'}
          aria-label={props.ariaLabel}
          nowrap
          style={{ color: 'black' }}
        >
          {props.timeRemaining.isExpired
            ? props.expiredMessage
            : `${props.timeRemaining.shortFormattedString} ${
                props.suffix ?? ''
              }`}
        </Text>
      </Stack>
    </TooltipHost>
  );
};
