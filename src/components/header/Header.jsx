import { Menu, rem, useMantineColorScheme } from "@mantine/core"

import {
    IconSettings,
    IconLogout,
    IconBuildingBank,
    IconDiscount,
    IconUserCircle,
    IconMoon,
    IconSun,
    IconDeviceDesktop
} from '@tabler/icons-react';

const Header = () => {
    const { colorScheme, setColorScheme } = useMantineColorScheme()
    const handleChangeDarkMode = () => {
        setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')
    }

    return (
        <div className="flex flex-wrap h-full w-full ">
            {/* logo */}
            <div className="basis-1/6 bg-cyan-500 ">
                div
            </div>
            {/* text */}
            <div className="flex flex-grow">

            </div>
            {/* user area */}
            <div className="flex basis-1/6 justify-end items-center bg-red-500">
                {/* light/dark mode */}
                <IconSun className="text-white hover:cursor-pointer" onClick={handleChangeDarkMode} />
                {/* user */}
                <Menu shadow="md" width={200} position="bottom-end">
                    <Menu.Target>
                        <IconUserCircle className=" w-7 h-7 text-white hover:text-yellow-700 cursor-pointer" />
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>Ứng dụng</Menu.Label>
                        <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
                            Cài đặt
                        </Menu.Item>
                        <Menu.Item leftSection={<IconBuildingBank style={{ width: rem(14), height: rem(14) }} />}>
                            Danh sách ngân hàng
                        </Menu.Item>
                        <Menu.Item leftSection={<IconDiscount style={{ width: rem(14), height: rem(14) }} />}>
                            Danh sách KM
                        </Menu.Item>
                        <Menu.Divider />

                        <Menu.Label>Người dùng</Menu.Label>
                        <Menu.Item
                            color="red"
                            leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                        //onClick={handleLogout}
                        >
                            Đăng xuất
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </div>
        </div>
    )
}

export default Header