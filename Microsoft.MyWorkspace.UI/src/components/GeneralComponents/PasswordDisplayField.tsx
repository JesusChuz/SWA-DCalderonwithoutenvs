import * as React from 'react';
import { useDispatch } from 'react-redux';
import {
  TextField,
  TooltipHost,
  IconButton,
  ITextFieldProps,
  Stack,
  useTheme,
} from '@fluentui/react';

import { copyToClipboard } from '../../shared/Utilities';
import { getCommonStyles } from './CommonStyles';
import { showDefaultNotification } from '../../store/actions/notificationActions';

interface IProps extends ITextFieldProps {
  label: string;
  password: string;
  showCopy?: boolean;
  fitWidth?: boolean;
}

export const PasswordDisplayField = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const copyPassword = () => {
    copyToClipboard(props.password);
    dispatch(showDefaultNotification('Password copied to clipboard'));
  };

  const { className, onChange, onGetErrorMessage, ...rest } = props;
  const readOnly = onChange === undefined;
  const change = onchange === undefined ? {} : { onChange: onChange };
  const error =
    onGetErrorMessage === undefined
      ? {}
      : { onGetErrorMessage: onGetErrorMessage };
  const fitWidth = props.fitWidth
    ? {
        className: `${commonStyles.widthFillAvailable} ${commonStyles.widthFillAvailableMoz} ${commonStyles.widthFillAvailableWebkit}`,
      }
    : {};

  return (
    <Stack horizontal>
      <TextField
        className={className}
        {...fitWidth}
        value={props.password}
        label={props.label}
        readOnly={readOnly}
        type={showPassword ? 'text' : 'password'}
        ariaLabel={`${props.label} field`}
        {...rest}
        {...change}
        {...error}
      />
      <TooltipHost
        content={showPassword ? 'Hide' : 'Show'}
        id={`${props.label}-show-tooltip-id`}
      >
        <IconButton
          aria-describedby={`${props.label}-show-tooltip-id`}
          iconProps={{ iconName: 'View' }}
          ariaLabel='Show Password Button'
          onClick={() => {
            setShowPassword(!showPassword);
          }}
          style={{ top: '29px' }}
        />
      </TooltipHost>
      {props.showCopy && (
        <TooltipHost content='Copy' id={`${props.label}-copy-tooltip-id`}>
          <IconButton
            aria-describedby={`${props.label}-copy-tooltip-id`}
            iconProps={{ iconName: 'Copy' }}
            ariaLabel='Copy Password Button'
            onClick={copyPassword}
            style={{ top: '29px' }}
          />
        </TooltipHost>
      )}
    </Stack>
  );
};
