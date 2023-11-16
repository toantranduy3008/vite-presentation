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
            className='bg-gradient-to-r from-myGradientFrom to-myGradientTo text-content'
        >
            <AppShell.Header className='flex bg-gradient-to-r from-myGradientFrom to-myGradientTo border-b-myGradientFrom'>
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" className=" h-full justify-center items-center text-white" />
                <Header />
            </AppShell.Header>
            <AppShell.Navbar p="md" className=' bg-gradient-to-r from-myGradientFrom to-myGradientTo text-content border-r-myGradientFrom'>
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