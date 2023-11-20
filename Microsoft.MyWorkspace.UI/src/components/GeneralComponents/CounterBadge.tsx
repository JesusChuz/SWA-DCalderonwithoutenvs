import * as React from 'react';
import { useCounterBadgeStyles } from './CounterBadge.styles';
import clsx from 'clsx';

interface IProps {
  count: number;
  className?: string;
  ariaLabel?: string;
  id?: string;
}

export const CounterBadge = (props: IProps) => {
  const counterBadgeStyles = useCounterBadgeStyles();
  if (!props.count) {
    return <></>;
  }
  return (
    <div
      className={clsx(counterBadgeStyles.counterBadge, props.className ?? '')}
      aria-label={props.ariaLabel ?? ''}
      id={props.id ?? ''}
    >
      {props.count > 99 ? '99+' : props.count}
    </div>
  );
};
