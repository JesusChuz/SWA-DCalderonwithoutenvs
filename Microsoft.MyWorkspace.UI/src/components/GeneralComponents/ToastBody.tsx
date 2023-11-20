import * as React from 'react';
import { Icon, Label, Stack, Text } from '@fluentui/react';
import { NotificationType } from '../../types/enums/NotificationType';
import { getNotificationSubjectIcon } from '../../shared/NotificationHelper';

interface IProps {
  notificationType: NotificationType;
  title: string;
  message: string;
}

export const ToastBody = (props: IProps): JSX.Element => {
  const iconName = getNotificationSubjectIcon(props.notificationType);
  return (
    <>
      <Stack horizontal verticalAlign='center' gap={6}>
        <Icon iconName={iconName} style={{ height: 16 }} />
        <Label>{props.title}</Label>
      </Stack>
      <Text>{props.message}</Text>
    </>
  );
};
