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
  Text,
  FontIcon,
  Icon,
} from '@fluentui/react';

import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import { styles } from '../AddSharedOwnerDialog/addSharedOwnerDialogStyles';
import {
  transferWorkspaceToNewOwner,
  validateAliasForOwnershipTransfer,
} from '../../../workspaceService';
import { AxiosResponse, AxiosError } from 'axios';
import clsx from 'clsx';
import { fetchAzureWorkspaces } from 'src/store/actions';
import { useHistory } from 'react-router';

interface IProps {
  workspaceId: string;
  workspaceOwner: string;
  workspaceOwnerEmail: string;
  showDialog: boolean;
  className?: string;
  onDismiss?: () => void;
}

export const TransferOwnerDialog = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const history = useHistory();

  const [value, setValue] = React.useState<string>();
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const [isNewOwnerValid, setIsNewOwnerValid] = React.useState<string | null>(
    null
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [timeoutInstance, setTimeoutInstance] = React.useState(undefined);
  const [transferPending, setTransferPending] = React.useState(false);
  const [transferSuccess, setTransferSuccess] = React.useState(false);

  const modalProps = React.useMemo(
    () => ({
      isBlocking: true,
      styles: undefined,
      dragOptions: undefined,
    }),
    []
  );

  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Transfer Owner',
  };

  const setErrorMessageFromResponse = (error: AxiosError) => {
    let message = '';
    if (typeof error.response.data === 'string') {
      message = error.response.data;
    } else {
      message = 'Alias authorization failed.';
    }
    setErrorMessage(message);
  };

  const handleNewOwnerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    setIsNewOwnerValid(null);

    if (
      props.workspaceOwnerEmail.toLocaleLowerCase() ===
      alias.toLocaleLowerCase()
    ) {
      setErrorMessage('Alias is the workspace owner.');
      setIsNewOwnerValid(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const validateRes: AxiosResponse<string> =
        await validateAliasForOwnershipTransfer(
          dispatch,
          alias,
          props.workspaceId
        );
      setErrorMessage(null);
      setIsNewOwnerValid(validateRes.data);
    } catch (e) {
      const axiosError = e as AxiosError;
      setErrorMessageFromResponse(axiosError);
      setIsNewOwnerValid(null);
    }

    setLoading(false);
  };

  const transferOwner = async () => {
    setTransferPending(true);
    try {
      await transferWorkspaceToNewOwner(dispatch, value, props.workspaceId);
      setTransferSuccess(true);
      setTimeoutInstance(
        setTimeout(() => {
          dispatch(fetchAzureWorkspaces());
          history.push('/');
        }, 5000)
      );
    } catch (e) {
      const axiosError = e as AxiosError;
      setTransferSuccess(false);
      setErrorMessageFromResponse(axiosError);
    }

    setTransferPending(false);
    setValue(null);
    setIsNewOwnerValid(null);
    setErrorMessage(null);
  };

  const cancelTransferOwner = () => {
    props.onDismiss();
    setValue(null);
    setIsNewOwnerValid(null);
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
        {transferSuccess && (
          <Stack tokens={{ childrenGap: 15 }}>
            <Stack horizontal horizontalAlign='center'>
              <Icon
                aria-label='success icon'
                iconName='SkypeCircleCheck'
                style={{
                  color: theme.semanticColors.successIcon,
                  fontSize: 50,
                  height: 50,
                  width: 50,
                }}
              />
            </Stack>
            <b>
              <Text>
                Transfer submitted successfully. You will be redirected to the
                home page in 5 seconds.
              </Text>
            </b>
          </Stack>
        )}
        {!transferSuccess && (
          <>
            <Label>Email Address</Label>
            <Stack
              horizontal
              verticalAlign='start'
              className={commonStyles.flexItem}
            >
              <TextField
                id='sharedOwnerAddInput'
                className={styles.textField}
                onChange={handleNewOwnerChange}
                value={value}
                ariaLabel='Email Address'
                placeholder='username@domain.com'
                errorMessage={
                  !isNewOwnerValid && value && !loading ? errorMessage : ''
                }
              />
              {loading && (
                <Spinner className={styles.spinner} size={SpinnerSize.medium} />
              )}
            </Stack>
            <Stack
              horizontal
              tokens={{
                childrenGap: 8,
              }}
              className={commonStyles.flexItem}
            >
              <FontIcon
                iconName='Warning'
                aria-label='Warning Icon'
                className={clsx(
                  commonStyles.errorText,
                  commonStyles.font18,
                  commonStyles.marginTop6px
                )}
              />
              <Stack
                tokens={{
                  childrenGap: 8,
                }}
                verticalAlign='center'
              >
                <Text>
                  This action is irreversible and transfers all authority of
                  this workspace to the selected user.
                </Text>
              </Stack>
            </Stack>
          </>
        )}

        <DialogFooter>
          <PrimaryButton
            onClick={transferOwner}
            text='Transfer'
            disabled={!isNewOwnerValid || transferPending || transferSuccess}
          />
          {transferPending && (
            <Spinner
              aria-label='Workspace transfer ownership spinner'
              size={SpinnerSize.large}
            />
          )}
          <DefaultButton onClick={cancelTransferOwner} text='Cancel' />
        </DialogFooter>
      </Dialog>
    </div>
  );
};
