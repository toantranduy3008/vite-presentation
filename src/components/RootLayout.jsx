import { useDisclosure } from '@mantine/hooks';
import { AppShell, Burger, Group, ScrollArea } from '@mantine/core';
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
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Header />
                </Group>
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