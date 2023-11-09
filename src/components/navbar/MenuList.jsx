import { IconHome2, IconSearch, IconSettings } from '@tabler/icons-react'

export const MenuList = [
    {
        label: 'Trang chủ',
        href: '/bankdemo/home',
        icon: <IconHome2 size={16} />
    },
    {
        label: 'Cài đặt',
        href: '/bankdemo/settings',
        icon: <IconSettings size={16} />
    },
    {
        label: 'Menu',
        href: '/bankdemo/menu',
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
    },
    {
        label: 'Tra cứu giao dịch',
        href: '/bankdemo/inquiry',
        icon: <IconSearch size={16} />
    },
]