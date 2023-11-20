import { mergeStyleSets } from '@fluentui/react';

export const styles = mergeStyleSets(() => ({}));

export enum icons {
  default,
  error,
  blocked,
  severeWarning,
  success,
  warning,
}
