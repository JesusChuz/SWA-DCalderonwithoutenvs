import * as React from 'react';
import { icons } from './Notification.styles';
import { Link, MessageBar, MessageBarType } from '@fluentui/react';
import { setOpenedPanel } from '../../../store/actions';
import { useDispatch } from 'react-redux';
import sanitizeHtml from 'sanitize-html';
import { bannerMessageClassName } from 'src/shared/Constants';

interface IProps {
  messageText: string;
  linkText?: string;
  panelToOpen?: string;
  messageVariant: keyof typeof icons;
  isMultiline?: boolean;
  truncated?: boolean;
  open?: boolean;
  role?: 'alert' | 'status' | 'none';
  className?: string;
  onClose(): void;
  position?:
    | 'relative'
    | 'static'
    | 'absolute'
    | 'fixed'
    | 'sticky'
    | 'relative'
    | 'initial'
    | 'inherit';
}

export const Notification = (props: IProps): JSX.Element => {
  const [messageVariant, setMessageVariant] = React.useState(
    null as MessageBarType
  );
  let notificationInterval: NodeJS.Timeout = null;
  const dispatch = useDispatch();

  React.useEffect(() => {
    setSuccessTimer();

    return () => {
      clearSuccessTimer();
    };
  }, []);

  const setSuccessTimer = () => {
    if (props.messageVariant === 'success') {
      notificationInterval = setInterval(() => {
        props.onClose();
      }, 5000);
    }
  };

  const clearSuccessTimer = () => {
    clearInterval(notificationInterval);
  };

  if (messageVariant === null) {
    switch (props.messageVariant) {
      case 'error':
        setMessageVariant(MessageBarType.error);
        break;
      case 'blocked':
        setMessageVariant(MessageBarType.blocked);
        break;
      case 'severeWarning':
        setMessageVariant(MessageBarType.severeWarning);
        break;
      case 'success':
        setMessageVariant(MessageBarType.success);
        break;
      case 'warning':
        setMessageVariant(MessageBarType.warning);
        break;
      default:
        setMessageVariant(MessageBarType.info);
        break;
    }
  }
  return (
    <div>
      <MessageBar
        messageBarType={messageVariant}
        isMultiline={props.isMultiline}
        truncated={props.truncated}
        onDismiss={props.onClose}
        dismissButtonAriaLabel='Close'
        className={`${props.className} ${bannerMessageClassName}`}
        onMouseEnter={clearSuccessTimer}
        onMouseLeave={setSuccessTimer}
        delayedRender={false}
        role={props.role ?? undefined}
        styles={{
          root: {
            width: '100%',
          },
        }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(props.messageText) }}
        ></div>
        {props.linkText ? (
          <Link
            underline
            onClick={() => dispatch(setOpenedPanel(props.panelToOpen))}
          >
            {props.linkText}
          </Link>
        ) : null}
      </MessageBar>
    </div>
  );
};
