import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import WalletNameModal from './components/WalletNameModal'
import LoginPage from './pages/LoginPage'
import LandownerDashboard from './pages/LandownerDashboard'
import OfficerDashboard from './pages/OfficerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import VerifyPage from './pages/VerifyPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <WalletNameModal />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/landowner/*" element={
            <ProtectedRoute requires="wallet">
              <LandownerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/officer" element={
            <ProtectedRoute requires="jwt">
              <OfficerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requires="jwt">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/verify" element={<VerifyPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
