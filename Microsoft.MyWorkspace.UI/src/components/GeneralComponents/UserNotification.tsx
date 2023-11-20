import React from 'react';
import { MessageBar, Stack } from '@fluentui/react';
import { useSelector } from 'react-redux';
import { getPublishedBanners } from '../../store/selectors';
import sanitizeHtml from 'sanitize-html';
import { setUserMessageRead, useUserMessages } from 'src/shared/UserMessages';
import { bannerMessageClassName } from 'src/shared/Constants';

export const UserNotification = (): JSX.Element => {
  const publishedBanners = useSelector(getPublishedBanners);
  const readMessages = useUserMessages();
  const bannersToShow = React.useMemo(() => {
    return publishedBanners.filter((b) => readMessages.indexOf(b.Id) === -1);
  }, [publishedBanners, readMessages]);

  return (
    <Stack styles={{ root: { width: '100%' } }}>
      {bannersToShow.map((b) => {
        return (
          <MessageBar
            className={bannerMessageClassName}
            key={`banner-${b.Id}`}
            messageBarType={b.Type}
            isMultiline={b.Multiline}
            truncated={b.Truncated}
            onDismiss={() => setUserMessageRead(b.Id)}
            dismissButtonAriaLabel='Close'
          >
            <div
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(b.Text) }}
            ></div>
          </MessageBar>
        );
      })}
    </Stack>
  );
};
