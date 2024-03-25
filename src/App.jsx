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
import InvestigateMessage from './pages/ibft20/search/InvestigateMessage';
import ErrorPage from './pages/ErrorPage';
function App() {
  return (
    <MantineProvider>
      <Notifications />
      <Routes>
        <Route path='/bankdemo/app/login' element={<NewLogin />} />
        <Route path='*' element={<ErrorPage />} />
        <Route element={<ProtectedRoute><RootLayout /></ProtectedRoute>}>
          <Route path='/bankdemo/' element={<SearchOutGoing />} />
          <Route path='/bankdemo/app/' element={<SearchOutGoing />} />
          <Route path='/bankdemo/app/ibft/batch-transfer' element={<BatchTransfer />} />
          <Route path='/bankdemo/app/ibft/qr-code' element={<QRCode />} />
          <Route path='/bankdemo/app/new-ibft/transfer' element={<NewTransfer />} />
          <Route path='/bankdemo/app/new-ibft/search-outgoing' element={<SearchOutGoing />} />
          <Route path='/bankdemo/app/new-ibft/search-incoming' element={<SearchInComing />} />
          <Route path='/bankdemo/app/new-ibft/invest-message' element={<InvestigateMessage />} />
        </Route>
      </Routes>
    </MantineProvider>
  )
}

export default App
