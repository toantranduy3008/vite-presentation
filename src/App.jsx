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
import NewLogin from './pages/login/NewLogin';
import BatchTransfer from './pages/ibft/batchTransfer/BatchTransfer';
import QRCode from './pages/ibft/qrCode/QRCode';
import { Transfer as NewTransfer } from './pages/ibft20/transfer/Transfer';
import { SearchOutGoing } from './pages/ibft20/search/SearchOutGoing';
import { SearchInComing } from './pages/ibft20/search/SearchInComing';
function App() {
  return (
    <MantineProvider>
      <Notifications />
      <Routes>
        <Route path='/bankdemo/login' element={<NewLogin />} />
        <Route element={<ProtectedRoute><RootLayout /></ProtectedRoute>}>
          <Route path='/bankdemo/' element={<SearchOutGoing />} />
          <Route path='/bankdemo/ibft/batch-transfer' element={<BatchTransfer />} />
          <Route path='/bankdemo/ibft/qr-code' element={<QRCode />} />
          <Route path='/bankdemo/new-ibft/transfer' element={<NewTransfer />} />
          <Route path='/bankdemo/new-ibft/search-outgoing' element={<SearchOutGoing />} />
          <Route path='/bankdemo/new-ibft/search-incoming' element={<SearchInComing />} />
        </Route>
      </Routes>
    </MantineProvider>
  )
}

export default App
