import { IconHome2, IconSettings } from '@tabler/icons-react'

export const MenuList = [
    {
        label: 'Trang chủ',
        href: '/home',
        icon: <IconHome2 size={16} />
    },
    {
        label: 'Cài đặt',
        href: '/settings',
        icon: <IconSettings size={16} />
    },
    {
        label: 'Menu',
        href: '/menu',
        icon: <IconSettings size={16} />,
        subMenu: [
            {
                label: 'Submenu 1',
                href: '/submenu',
                icon: <IconSettings size={16} />
            },
            {
                label: 'Submenu 2',
                href: '/submenu2',
                icon: <IconSettings size={16} />
            }
        ]
    }
]