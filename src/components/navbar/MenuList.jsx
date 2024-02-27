import { IconHome2, IconQrcode, IconSearch, IconSettings } from '@tabler/icons-react'

export const MenuList = [
    // {
    //     label: 'Trang chủ',
    //     href: '/bankdemo/home',
    //     icon: <IconHome2 size={16} />
    // },
    // {
    //     label: 'Cài đặt',
    //     href: '/bankdemo/settings',
    //     icon: <IconSettings size={16} />
    // },
    // {
    //     label: 'Tra cứu giao dịch',
    //     href: '/bankdemo/inquiry',
    //     icon: <IconSearch size={16} />
    // },
    {
        label: 'IBFT',
        href: '/bankdemo/ibft',
        subMenu: [
            {
                label: 'Tra cứu giao dịch',
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
    {
        label: 'IBFT 2.0',
        href: '/bankdemo/new-ibft',
        subMenu: [
            {
                label: 'Tra cứu giao dịch',
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
    // {
    //     label: 'Thống kê',
    //     href: '/bankdemo/analyst',
    //     subMenu: [
    //         {
    //             label: 'Giao dịch liên ngân hàng',
    //             href: '/interbank',
    //         },
    //         {
    //             label: 'Giao dịch theo ngày',
    //             href: '/bytime',
    //         },
    //         // {
    //         //     label: 'Chuyển khoản',
    //         //     href: '/transfer',
    //         // },
    //         // {
    //         //     label: 'Giao dịch số tiền lớn',
    //         //     href: '/batch-transfer',
    //         // },
    //         // {
    //         //     label: 'Dịch vụ QR',
    //         //     href: '/qr-code',
    //         // }
    //     ]
    // },
]