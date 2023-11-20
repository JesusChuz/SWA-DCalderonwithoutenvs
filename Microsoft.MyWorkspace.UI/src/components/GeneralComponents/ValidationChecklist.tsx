import * as React from 'react';
import { FontIcon, Stack, Text, useTheme } from '@fluentui/react';
import clsx from 'clsx';
import { getProgressCheckStyles } from '../MyWorkspaces/WorkspaceMachineProperties/WorkspaceProperties/ExternalConnectivityComponents/ProgressCheckStyles';

export interface ValidationItem {
  validText: string;
  invalidText: string;
  valid: boolean;
}

interface IValidationChecklist {
  items: ValidationItem[];
}

export const ValidationChecklist = (
  props: IValidationChecklist
): JSX.Element => {
  const theme = useTheme();
  const styles = getProgressCheckStyles(theme);

  return (
    <Stack>
      {props.items.map((validationItem) => {
        return (
          <Stack
            key={validationItem.validText}
            horizontal
            verticalAlign='center'
          >
            <FontIcon
              className={clsx(
                validationItem.valid ? styles.green : styles.red,
                styles.icon
              )}
              iconName={validationItem.valid ? 'CheckMark' : 'Cancel'}
            />
            <Text
              className={clsx(
                validationItem.valid ? styles.green : styles.red,
                styles.text
              )}
            >
              {validationItem.valid
                ? validationItem.validText
                : validationItem.invalidText}
            </Text>
          </Stack>
        );
      })}
    </Stack>
  );
};
