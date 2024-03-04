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
import Inquiry from './pages/ibft/inquiry/Inquiry';
import NewLogin from './pages/login/NewLogin';
import Transfer from './pages/ibft/transfer/Transfer';
import BatchTransfer from './pages/ibft/batchTransfer/BatchTransfer';
import QRCode from './pages/ibft/qrCode/QRCode';
import IbftInquiry from './pages/ibft/ibftInquiry/IbftInquiry';
import InterBank from './pages/analyst/interBank/InterBank';
import AnalystByTime from './pages/analyst/bytime/AnalystByTime';
import { Transfer as NewTransfer } from './pages/ibft20/transfer/Transfer';
import Search from './pages/ibft20/search/Search';
function App() {
  return (
    <MantineProvider>
      <Notifications />
      <Routes>
        <Route path='/bankdemo/login' element={<NewLogin />} />
        <Route element={<ProtectedRoute><RootLayout /></ProtectedRoute>}>
          <Route path='/bankdemo/' element={<Home />} />
          <Route path='/bankdemo/home' element={<Home />} />
          <Route path='/bankdemo/inquiry' element={<Inquiry />} />
          <Route path='/bankdemo/ibft/inquiry' element={<IbftInquiry />} />
          <Route path='/bankdemo/ibft/transfer' element={<Transfer />} />
          <Route path='/bankdemo/ibft/batch-transfer' element={<BatchTransfer />} />
          <Route path='/bankdemo/ibft/qr-code' element={<QRCode />} />
          <Route path='/bankdemo/new-ibft/transfer' element={<NewTransfer />} />
          <Route path='/bankdemo/new-ibft/search-outgoing' element={<Search />} />
          <Route path='/bankdemo/analyst/interbank' element={<InterBank />} />
          <Route path='/bankdemo/analyst/bytime' element={<AnalystByTime />} />
        </Route>
      </Routes>
    </MantineProvider>
  )
}

export default App
