import { notifications } from '@mantine/notifications';
import classes from './Notification.module.css';
import { IconCircleCheck, IconAlertTriangle, IconExclamationCircle, IconBell } from '@tabler/icons-react';

class NotificationServices {
    static info(message) {
        notifications.show({
            title: 'Thông báo',
            message: message,
            classNames: classes,
            autoClose: 5000,
            icon: <IconBell />
        })
    }

    static success(message) {
        notifications.show({
            color: 'green',
            title: 'Thành công',
            message: message,
            classNames: classes,
            autoClose: 5000,
            icon: <IconCircleCheck />
        })
    }

    static warning(message) {
        notifications.show({
            color: 'yellow',
            title: 'Cảnh báo',
            message: message,
            classNames: classes,
            autoClose: 5000,
            icon: <IconAlertTriangle />
        })
    }

    static error(message) {
        notifications.show({
            color: 'red',
            title: 'Lỗi',
            message: message,
            classNames: classes,
            autoClose: 5000,
            icon: <IconExclamationCircle />
        })
    }
}

export default NotificationServices