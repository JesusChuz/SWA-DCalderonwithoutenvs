import {
  DefaultButton,
  Dialog,
  DialogFooter,
  PrimaryButton,
} from '@fluentui/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideUserConfirmationDialog } from '../../store/actions';
import { getUserConfirmationDialogState } from '../../store/selectors';

export const UserConfirmationDialog = (): JSX.Element => {
  const dispatch = useDispatch();
  const { show, message, title, confirmCallback, cancelCallback } = useSelector(
    getUserConfirmationDialogState
  );
  return (
    <Dialog hidden={!show} title={title}>
      {message}
      <DialogFooter>
        <PrimaryButton
          onClick={() => {
            confirmCallback?.();
            dispatch(hideUserConfirmationDialog());
          }}
          text='OK'
        />
        <DefaultButton
          onClick={() => {
            cancelCallback?.();
            dispatch(hideUserConfirmationDialog());
          }}
          text='Cancel'
        />
      </DialogFooter>
    </Dialog>
  );
};
