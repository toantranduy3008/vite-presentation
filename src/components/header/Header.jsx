import { useEffect, useState } from "react";
import { Menu, rem, Tooltip } from "@mantine/core"
import { useNavigate } from "react-router-dom";
import { getTheme } from "../../services/Utilities";
import {
    IconLogout,
    IconUserCircle,
    IconMoon,
    IconSun,
    IconDeviceDesktop
} from '@tabler/icons-react';
import { getCurrentUser } from "../../services/AuthServices";
import { truncateString } from "../../services/Utilities";

const Header = () => {
    const navigate = useNavigate()
    const { fullName } = getCurrentUser()
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
        navigate('/bankdemo/app/login')
    }
    return (
        <div className="flex flex-row w-full h-full justify-between items-center p-2">
            <div className="flex basis-1/6 h-full justify-start items-center">
                <img src='/bankdemo/napas-logo.svg' className=" w-auto xs:w-24 h-12 xs:h-auto align-middle border-none " />
            </div>

            <div className="flex basis-1/6 h-full justify-end items-center gap-2">
                <div className="flex xs:w-fit md:w-full h-full justify-between items-center rounded-full xs:bg-none md:bg-indigo-400 px-2">
                    <Tooltip label={`Xin chào, ${fullName} 😄`}>
                        <div className="xs:hidden md:flex w-full h-full justify-start items-center">
                            <p className="pl-2 text-white">Xin chào, </p>
                            <p className="font-semibold text-white"> {` ${truncateString(fullName, 10)}`}</p>
                        </div>
                    </Tooltip>
                    <Menu shadow="md" width={200} position="bottom-end" className="hidden">
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
                        <Menu.Target className="bg-teal-400 hover:cursor-pointer hover:shadow-md rounded-full p-1 transition ease-linear duration-200">
                            <IconUserCircle className=" w-7 h-7 text-white  hover:bg-orange-500" />
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
        </div >
    )
}

export default Header