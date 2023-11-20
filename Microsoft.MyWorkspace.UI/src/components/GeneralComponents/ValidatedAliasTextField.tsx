import * as React from 'react';
import {
  mergeStyleSets,
  TextField,
  ITextFieldProps,
  Stack,
  Spinner,
  SpinnerSize,
} from '@fluentui/react';
import { useDispatch } from 'react-redux';
import { validateAlias } from '../MyWorkspaces/workspaceService';

interface IProps extends ITextFieldProps {
  value: string;
  onChange: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => void;
  validationStateCallback: (isValid: boolean, userId?: string) => Promise<void>;
  containerClassName?: string;
  valid: boolean;
}

const styles = mergeStyleSets({
  spinner: {
    marginTop: '34px',
    paddingLeft: '6px',
  },
});

export const ValidatedAliasTextField = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const { value, onChange, validationStateCallback, ...rest } = props;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [timeoutInstance, setTimeoutInstance] = React.useState(undefined);

  const validateOwner = async (alias: string) => {
    const validateRes = await validateAlias(dispatch, alias);
    if (validateRes.data) {
      await validationStateCallback(true, validateRes.data);
    } else {
      await validationStateCallback(false);
    }

    setLoading(false);
  };

  const handleOwnerChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    onChange(event, newValue);
    const alias = event.currentTarget.value;

    if (timeoutInstance) {
      clearTimeout(timeoutInstance);
    }

    if (alias.length === 0) {
      validationStateCallback(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setTimeoutInstance(
      setTimeout(() => {
        validateOwner(alias);
      }, 2000)
    );
  };

  return (
    <Stack
      horizontal
      verticalAlign='start'
      className={props.containerClassName}
    >
      <TextField {...rest} onChange={handleOwnerChange} value={value} />
      {loading && (
        <Spinner className={styles.spinner} size={SpinnerSize.medium} />
      )}
    </Stack>
  );
};
