/* eslint-disable react/prop-types */
import { NavLink } from '@mantine/core';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { MenuList } from './MenuList'
import { IconFolder } from '@tabler/icons-react';

const NavBar = ({ toggle }) => {
    const { pathname } = useLocation()
    return (
        <>
            {
                MenuList.map(item =>
                    <NavLink
                        key={item.label}
                        label={item.label}
                        leftSection={item.icon ? item.icon : <IconFolder size={16} />}
                        stroke={1.5}
                        className={`font-semibold ${pathname.includes(item.href) ? 'text-sky-500 border-l-2 border-solid border-indigo-400' : ''} hover:bg-navbarHoverBgColor hover:text-navbarHoverTextColor`}
                        component={RouterLink}
                        to={item.href}
                        onClick={toggle}
                        active={item.subMenu && item.subMenu.length > 0 ? pathname.includes(item.href) : pathname === item.href}
                        defaultOpened
                    >
                        {
                            item.subMenu && item.subMenu.length > 0 &&
                            item.subMenu.map(subItem => (
                                <NavLink
                                    key={subItem.label}
                                    label={subItem.label}
                                    component={RouterLink}
                                    to={`${item.href}${subItem.href}`}
                                    onClick={toggle}
                                    active={pathname === `${item.href}${subItem.href}`}
                                    className={`${pathname === `${item.href}${subItem.href}` ? 'text-sky-500 border-l-2 border-solid border-indigo-400' : 'border-l-2 border-solid border-slate-200'} hover:bg-navbarHoverBgColor hover:text-navbarHoverTextColor`}
                                />
                            ))
                        }
                    </NavLink>
                )
            }
        </>

    )
}

export default NavBar