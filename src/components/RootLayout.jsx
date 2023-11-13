import { useDisclosure } from '@mantine/hooks';
import { AppShell, Burger, ScrollArea } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import NavBar from './navbar/NavBar';
import Header from './header/Header';
export default function RootLayout() {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        // className="bg-[url('/napas-bg-white.jpg')] dark:bg-[url('/napas-bg-blue.jpg')] bg-right bg-cover bg-no-repeat"
        // className='bg-[#dcdcdc] bg-gradient-to-r from-blue-800 to-cyan-800'
        >
            <AppShell.Header className='flex '>
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" className=" h-full justify-center items-center text-white" />
                <Header />
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <AppShell.Section grow component={ScrollArea}>
                    <NavBar toggle={toggle} />
                </AppShell.Section>
            </AppShell.Navbar>
            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}