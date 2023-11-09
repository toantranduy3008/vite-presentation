{/* Mantine packages */ }
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

{/* React router */ }
import { Route, Routes } from 'react-router-dom';

{/* pages */ }
import RootLayout from './components/RootLayout';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Settings from './pages/settings/Settings';
import SubMenu from './pages/submenu/SubMenu';
import SubMenu2 from './pages/submenu2/SubMenu2';
function App() {
  return (
    <MantineProvider>
      <Notifications />
      <Routes>
        <Route path='/bankdemo/login' element={<Login />} />
        <Route element={<RootLayout />}>
          <Route path='/bankdemo/' element={<Home />} />
          <Route path='/bankdemo/home' element={<Home />} />
          <Route path='/bankdemo/settings' element={<Settings />} />
          <Route path='/bankdemo/menu/submenu' element={<SubMenu />} />
          <Route path='/bankdemo/menu/submenu2' element={<SubMenu2 />} />
        </Route>
      </Routes>
    </MantineProvider>
  )
}

export default App
