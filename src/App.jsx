{/* Mantine packages */ }
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';

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
    <MantineProvider defaultColorScheme="auto">
      <Notifications />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route element={<RootLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/menu/submenu' element={<SubMenu />} />
          <Route path='/menu/submenu2' element={<SubMenu2 />} />
        </Route>
      </Routes>
    </MantineProvider>
  )
}

export default App
