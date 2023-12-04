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
    // {
    //     label: 'Menu',
    //     href: '/bankdemo/menu',
    //     subMenu: [
    //         {
    //             label: 'Submenu 1',
    //             href: '/submenu',
    //             icon: <IconSettings size={16} />
    //         },
    //         {
    //             label: 'Submenu 2',
    //             href: '/submenu2',
    //             icon: <IconSettings size={16} />
    //         }
    //     ]
    // },
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
                label: 'Truy vấn',
                href: '/inquiry',
                icon: <IconSettings size={16} />
            },
            {
                label: 'Chuyển khoản',
                href: '/transfer',
                icon: <IconSettings size={16} />
            },
            {
                label: 'Giao dịch số tiền lớn',
                href: '/batch-transfer',
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