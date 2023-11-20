import * as React from 'react';
import {
  Dialog,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
  DialogType,
  Stack,
  Checkbox,
  Spinner,
  SpinnerSize,
} from '@fluentui/react';
import { AgreementDto } from '../../types/Catalog/AgreementDto.types';
import { useSelector } from 'react-redux';
import { getUserProfileLoaded } from '../../store/selectors';
import sanitizeHtml from 'sanitize-html';

interface IProps {
  agreement: AgreementDto;
  acceptAction: () => void;
  declineAction: () => void;
}

export const UserAgreementDialog = (props: IProps): JSX.Element => {
  const [checked, setChecked] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const userLoaded = useSelector(getUserProfileLoaded);

  return (
    <Dialog
      hidden={false}
      onDismiss={props.declineAction}
      modalProps={{ isBlocking: true }}
      minWidth={500}
      maxWidth={500}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: 'User Agreement',
      }}
    >
      <Stack tokens={{ childrenGap: '12px' }}>
        {(loading || !userLoaded) && <Spinner size={SpinnerSize.large} />}
        {!(loading || !userLoaded) && (
          <>
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(props.agreement.AgreementText),
              }}
            ></div>
            <Checkbox
              label='I accept this User Agreement'
              checked={checked}
              onChange={(
                ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
                checked?: boolean
              ) => setChecked(checked)}
            />
          </>
        )}
      </Stack>

      <DialogFooter>
        <PrimaryButton
          disabled={!checked || loading}
          onClick={async () => {
            setLoading(true);
            await props.acceptAction();
            setChecked(false);
            setLoading(false);
          }}
          text='Accept'
        />
        <DefaultButton
          onClick={props.declineAction}
          disabled={loading || !userLoaded}
          text='Decline'
        />
      </DialogFooter>
    </Dialog>
  );
};
