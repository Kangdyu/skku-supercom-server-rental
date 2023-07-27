import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

interface NotiOptions {
  title: string;
  message: string;
}

export function showSuccessNotification({ title, message }: NotiOptions) {
  notifications.show({
    title,
    message,
    icon: <IconCheck />,
    color: 'green',
  });
}

export function showFailNotification({ title, message }: NotiOptions) {
  notifications.show({
    title,
    message,
    icon: <IconX />,
    color: 'red',
  });
}
