import { useEffect, useState } from "react";
import { Menu, rem } from "@mantine/core"
import { useNavigate } from "react-router-dom";
import { getTheme } from "../../services/Utilities";
import {
    IconLogout,
    IconUserCircle,
    IconMoon,
    IconSun,
    IconDeviceDesktop
} from '@tabler/icons-react';

const Header = () => {
    const navigate = useNavigate()
    const darkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches
    const [theme, setTheme] = useState(getTheme())
    const [logoUrl, setLogoUrl] = useState('./napas-logo.svg')
    useEffect(() => {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => e.matches && setTheme('dark'));
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => e.matches && setTheme('light'));
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
            setLogoUrl('./napas-logo-white.png')
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
            setLogoUrl(mode === 'light' ? './napas-logo-white.png' : './napas-logo.svg')
        }
    }

    const handleLogout = () => {
        sessionStorage.removeItem('userSession')
        navigate('/bankdemo/login')
    }
    return (
        <div className="flex flex-row w-full h-full justify-between items-center p-2">
            <div className="flex basis-1/6 h-full justify-start items-center">
                <img src={'./napas-logo.svg'} className=" w-auto xs:w-24 h-12 xs:h-auto align-middle border-none " />
            </div>

            <div className="flex flex-grow h-full xs:hidden md:flex justify-center items-center">
                <p className="text-lg text-center font-bold md:text-xl uppercase text-indigo-700 dark:text-sky-500">Hệ thống mô phỏng giao dịch</p>
            </div>

            <div className="flex basis-1/6 h-full justify-end items-center gap-2">

                <Menu shadow="md" width={200} position="bottom-end" className="flex">
                    <Menu.Target className={`${theme === 'light' ? 'bg-yellow-400' : theme === 'dark' ? 'bg-sky-400' : 'bg-red-400'} hover:cursor-pointer hover:shadow-md rounded-md p-1 transition ease-linear duration-200`}>
                        {
                            theme === 'light' ?
                                <IconSun stroke={1.5} className="text-white h-7 w-7  hover:bg-yellow-500" /> :
                                theme === 'dark' ?
                                    <IconMoon stroke={1.5} className="text-white h-7 w-7 hover:bg-blue-500" /> :
                                    <IconDeviceDesktop stroke={1.5} className="text-white h-7 w-7 hover:bg-red-500" />
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
                <Menu shadow="md" width={200} position="bottom-end" className="flex">
                    <Menu.Target className="bg-teal-400 hover:cursor-pointer hover:shadow-md rounded-md p-1 transition ease-linear duration-200">
                        <IconUserCircle className=" w-7 h-7 text-white  hover:bg-teal-500" />
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