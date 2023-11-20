import * as React from 'react';
import { Announced } from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAssertiveScreenReaderAnnouncement,
  setPoliteScreenReaderAnnouncement,
} from '../../store/actions';
import { getSelectedMachinesScreenReaderAnnouncement as getScreenReaderAnnouncement } from '../../store/selectors/notificationSelectors';

export const ScreenReaderAnnouncement = (): JSX.Element => {
  const dispatch = useDispatch();
  const screenReaderAnnouncement = useSelector(getScreenReaderAnnouncement);

  React.useEffect(() => {
    dispatch(setPoliteScreenReaderAnnouncement(''));
    dispatch(setAssertiveScreenReaderAnnouncement(''));
  }, []);

  return (
    <>
      <Announced
        aria-live='assertive'
        message={screenReaderAnnouncement.assertive}
      />
      <Announced message={screenReaderAnnouncement.polite} />
    </>
  );
};
