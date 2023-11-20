import * as React from 'react';
import { useDispatch } from 'react-redux';
import {
  Stack,
  PrimaryButton,
  DefaultButton,
  Spinner,
  SpinnerSize,
  TextField,
  Dialog,
  DialogType,
  DialogFooter,
  Label,
  useTheme,
} from '@fluentui/react';

import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import { styles } from './addSharedOwnerDialogStyles';
import { validateAlias } from '../../../workspaceService';
import { AxiosResponse } from 'axios';

interface IProps {
  workspaceSharedOwners: string[];
  workspaceOwner: string;
  workspaceSharedOwnerEmails: string[];
  workspaceOwnerEmail: string;
  showDialog: boolean;
  className?: string;
  onDismiss?: () => void;
  onAdd?: (isSharedOwnerValid: string, value: string) => void;
}

export const AddSharedOwnerDialog = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);

  const [value, setValue] = React.useState<string>();
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const [isSharedOwnerValid, setIsSharedOwnerValid] = React.useState<
    string | null
  >(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [timeoutInstance, setTimeoutInstance] = React.useState(undefined);

  const modalProps = React.useMemo(
    () => ({
      isBlocking: true,
      styles: undefined,
      dragOptions: undefined,
    }),
    [false]
  );

  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Add Shared Owner',
  };

  const handleSharedOwnerChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const alias = event.target.value;
    setValue(alias);

    if (timeoutInstance) {
      clearTimeout(timeoutInstance);
    }

    if (alias.length === 0) {
      setLoading(false);
      return;
    }
    setTimeoutInstance(
      setTimeout(() => {
        validateOwner(alias);
      }, 1000)
    );
  };

  const validateOwner = async (alias: string) => {
    setIsSharedOwnerValid(null);

    if (props.workspaceSharedOwnerEmails.includes(alias)) {
      setErrorMessage('Alias is already a shared workspace owner.');
      setIsSharedOwnerValid(null);
      setLoading(false);
      return;
    }

    if (
      props.workspaceOwnerEmail.toLocaleLowerCase() ===
      alias.toLocaleLowerCase()
    ) {
      setErrorMessage('Alias is the workspace owner.');
      setIsSharedOwnerValid(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const validateRes: AxiosResponse = await validateAlias(dispatch, alias);
    if (validateRes.data) {
      setErrorMessage(null);
      setIsSharedOwnerValid(validateRes.data);
    } else {
      setErrorMessage('Alias does not have permission to access MyWorkspace.');
      setIsSharedOwnerValid(null);
    }

    setLoading(false);
  };

  const addSharedOwner = () => {
    props.onAdd(isSharedOwnerValid, value);
    setValue(null);
    setIsSharedOwnerValid(null);
    setErrorMessage(null);
  };

  const cancelSharedOwner = () => {
    props.onDismiss();
    setValue(null);
    setIsSharedOwnerValid(null);
    setErrorMessage(null);
  };

  return (
    <div>
      <Dialog
        hidden={!props.showDialog}
        onDismiss={props.onDismiss}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
        minWidth={'400px'}
      >
        <form className={styles.dialogContent}>
          <Label>Email Address</Label>
          <Stack
            horizontal
            verticalAlign='start'
            className={commonStyles.flexItem}
          >
            <TextField
              id='sharedOwnerAddInput'
              className={styles.textField}
              onChange={handleSharedOwnerChange}
              value={value}
              ariaLabel='Email Address'
              placeholder='username@domain.com'
              errorMessage={
                !isSharedOwnerValid && value && !loading ? errorMessage : ''
              }
            />
            {loading && (
              <Spinner className={styles.spinner} size={SpinnerSize.medium} />
            )}
          </Stack>
        </form>

        <DialogFooter>
          <PrimaryButton
            onClick={addSharedOwner}
            text='Add'
            disabled={!isSharedOwnerValid}
          />
          <DefaultButton onClick={cancelSharedOwner} text='Cancel' />
        </DialogFooter>
      </Dialog>
    </div>
  );
};
