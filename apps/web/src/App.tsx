import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import LandownerDashboard from './pages/LandownerDashboard'
import OfficerDashboard from './pages/OfficerDashboard'
import VerifyPage from './pages/VerifyPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/landowner" element={
            <ProtectedRoute requires="wallet">
              <LandownerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/officer" element={
            <ProtectedRoute requires="jwt">
              <OfficerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/verify" element={<VerifyPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
