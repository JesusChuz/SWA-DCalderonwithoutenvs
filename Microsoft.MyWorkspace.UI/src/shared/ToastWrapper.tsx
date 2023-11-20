import * as React from 'react';
import { Slide, toast, ToastContainer } from 'react-toastify';
import { getCommonStyles } from '../components/GeneralComponents/CommonStyles';
import { ToastBody } from '../components/GeneralComponents/ToastBody';
import 'react-toastify/dist/ReactToastify.min.css';
import { NotificationType } from '../types/enums/NotificationType';
import { Themes } from '../types/enums/Themes';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { getThemeDarkOrLight } from '../components/GeneralComponents/ThemeWrapper';
import { useTheme } from '@fluentui/react';
import { usePreferences } from 'src/hooks/usePreferences';

export const ToastWrapper = () => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const preferences = usePreferences();
  const systemThemeDark = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <ToastContainer
      position='top-right'
      transition={Slide}
      hideProgressBar
      pauseOnFocusLoss
      pauseOnHover
      className={commonStyles.toastContainer}
      theme={
        getThemeDarkOrLight(preferences?.Theme, systemThemeDark) === Themes.Dark
          ? 'dark'
          : 'light'
      }
    />
  );
};

export const displayToast = (msg: string) => {
  const [type, title, message] = msg.split('|');
  const notificationType: NotificationType = parseInt(type);
  toast(
    <ToastBody
      title={title}
      message={message}
      notificationType={notificationType}
    />,
    {
      position: 'top-right',
      style: { borderRadius: 0 },
      toastId: 'ToastNotification',
    }
  );
};
