import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import LandownerDashboard from './pages/LandownerDashboard'
import MyParcelsPage from './pages/MyParcelsPage'
import OfficerDashboard from './pages/OfficerDashboard'
import PendingReviewsPage from './pages/PendingReviewsPage'
import HistoryPage from './pages/HistoryPage'
import VerifyPage from './pages/VerifyPage'
import ParcelDetailPage from './pages/ParcelDetailPage'
import HelpPage from './pages/HelpPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#fff',
              borderRadius: '12px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/parcels/:id" element={<ParcelDetailPage />} />

          <Route
            path="/landowner"
            element={
              <ProtectedRoute requires="wallet">
                <LandownerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/landowner/parcels"
            element={
              <ProtectedRoute requires="wallet">
                <MyParcelsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/officer"
            element={
              <ProtectedRoute requires="jwt">
                <OfficerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/pending"
            element={
              <ProtectedRoute requires="jwt">
                <PendingReviewsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/history"
            element={
              <ProtectedRoute requires="jwt">
                <HistoryPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
