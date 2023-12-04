{/* Mantine packages */ }
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

{/* React router */ }
import { Route, Routes } from 'react-router-dom';

{/* pages */ }
import ProtectedRoute from './components/ProtectedRoute';
import RootLayout from './components/RootLayout';
import Home from './pages/home/Home';
// import Login from './pages/login/Login';
import Settings from './pages/settings/Settings';
import SubMenu from './pages/submenu/SubMenu';
import SubMenu2 from './pages/submenu2/SubMenu2';
import Inquiry from './pages/ibft/inquiry/Inquiry';
import NewLogin from './pages/login/NewLogin';
import Transfer from './pages/ibft/transfer/Transfer';
import BatchTransfer from './pages/ibft/batchTransfer/BatchTransfer';
import QRCode from './pages/ibft/qrCode/QRCode';
import IbftInquiry from './pages/ibft/ibftInquiry/IbftInquiry';
function App() {
  return (
    <MantineProvider>
      <Notifications />
      <Routes>
        <Route path='/bankdemo/login' element={<NewLogin />} />
        <Route element={<ProtectedRoute><RootLayout /></ProtectedRoute>}>
          <Route path='/bankdemo/' element={<Home />} />
          <Route path='/bankdemo/home' element={<Home />} />
          <Route path='/bankdemo/settings' element={<Settings />} />
          <Route path='/bankdemo/menu/submenu' element={<SubMenu />} />
          <Route path='/bankdemo/menu/submenu2' element={<SubMenu2 />} />
          <Route path='/bankdemo/inquiry' element={<Inquiry />} />
          <Route path='/bankdemo/ibft/inquiry' element={<IbftInquiry />} />
          <Route path='/bankdemo/ibft/transfer' element={<Transfer />} />
          <Route path='/bankdemo/ibft/batch-transfer' element={<BatchTransfer />} />
          <Route path='/bankdemo/ibft/qr-code' element={<QRCode />} />
        </Route>
      </Routes>
    </MantineProvider>
  )
}

export default App
