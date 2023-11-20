import * as React from 'react';
import { useDispatch } from 'react-redux';
import {
  TextField,
  TooltipHost,
  IconButton,
  ITextFieldProps,
  Stack,
} from '@fluentui/react';

import { copyToClipboard } from '../../shared/Utilities';
import { showDefaultNotification } from '../../store/actions/notificationActions';

interface IProps extends ITextFieldProps {
  label: string;
  value: string;
}

export const CopyDisplayField = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();

  const copyValue = () => {
    copyToClipboard(props.value);
    dispatch(showDefaultNotification('Copied to clipboard'));
  };

  const { className, ...rest } = props;

  return (
    <Stack horizontal verticalAlign='end'>
      <TextField
        className={className}
        value={props.value}
        label={props.label}
        readOnly
        ariaLabel={`${props.label} field`}
        {...rest}
      />
      <TooltipHost content='Copy' id={`${props.label}-copy-tooltip-id`}>
        <IconButton
          aria-describedby={`${props.label}-copy-tooltip-id`}
          iconProps={{ iconName: 'Copy' }}
          ariaLabel={`copy ${props.label} value`}
          onClick={copyValue}
        />
      </TooltipHost>
    </Stack>
  );
};
