import { useEffect, useState } from "react";
import { Menu, rem } from "@mantine/core"
import { useNavigate } from "react-router-dom";

import {
    IconLogout,
    IconUserCircle,
    IconMoon,
    IconSun,
    IconDeviceDesktop
} from '@tabler/icons-react';
import { getTheme } from "../../services/Utilities";

const Header = () => {
    const navigate = useNavigate()
    const darkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches
    const [theme, setTheme] = useState(getTheme())
    useEffect(() => {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => e.matches && setTheme('dark'));
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => e.matches && setTheme('light'));
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [theme, darkSystem])

    {/* use Tailwind darkmode */ }
    const handleChangeDarkMode = (mode) => {
        setTheme(mode)
        if (mode === 'auto') {
            localStorage.removeItem('theme')
        }
        else {
            localStorage.setItem('theme', mode)
        }
    }

    const handleLogout = () => {
        sessionStorage.removeItem('userSession')
        navigate('/login')
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
            <div className="flex basis-1/6 justify-end items-center ">
                {/* user */}
                <Menu shadow="md" width={200} position="bottom-end">
                    <Menu.Target className="hover:cursor-pointer">
                        {
                            theme === 'light' ? <IconSun stroke={1.5} className="text-sky-700 h-5 w-5" /> : theme === 'dark' ? <IconMoon stroke={1.5} className="text-sky-700 h-5 w-5" /> : <IconDeviceDesktop stroke={1.5} className="text-sky-700 h-5 w-5" />
                        }
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item
                            leftSection={<IconSun className="w-5 h-5" />}
                            onClick={() => handleChangeDarkMode('light')}
                            className={`text-sm ${theme === 'light' ? 'text-sky-500 font-semibold' : ''}`}
                        >
                            Sáng
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<IconMoon className="w-5 h-5" />}
                            onClick={() => handleChangeDarkMode('dark')}
                            className={`text-sm ${theme === 'dark' ? 'text-sky-500 font-semibold' : ''}`}
                        >
                            Tối
                        </Menu.Item>
                        <Menu.Item leftSection={<IconDeviceDesktop className="w-5 h-5" />}
                            onClick={() => handleChangeDarkMode('auto')}
                            className={`text-sm ${theme === 'auto' ? 'text-sky-500 font-semibold' : ''}`}
                        >
                            Tự động
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
                <Menu shadow="md" width={200} position="bottom-end">
                    <Menu.Target>
                        <IconUserCircle className=" w-5 h-5 text-slate-700 hover:text-yellow-700 cursor-pointer" />
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item
                            color="red"
                            leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                            onClick={handleLogout}
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