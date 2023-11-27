import { IconHome2, IconQrcode, IconSearch, IconSettings } from '@tabler/icons-react'

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
        // icon: <IconSettings size={16} />,
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
    {
        label: 'IBFT',
        href: '/bankdemo/ibft',
        subMenu: [
            {
                label: 'Tra cứu',
                href: '/inquiry',
                icon: <IconSettings size={16} />
            },
            {
                label: 'Vấn tin',
                href: '/submenu2',
                icon: <IconSettings size={16} />
            },
            {
                label: 'Chuyển khoản',
                href: '/submenu2',
                icon: <IconSettings size={16} />
            },
            {
                label: 'Giao dịch số tiền lớn',
                href: '/submenu2',
                icon: <IconSettings size={16} />
            },
            {
                label: 'Dịch vụ QR',
                href: '/qr-code',
                icon: <IconQrcode size={16} />
            }
        ]
    },
]