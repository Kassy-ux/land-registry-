import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Props {
  role: 'landowner' | 'officer' | 'admin'
  children: React.ReactNode
}

export default function ProtectedRoute({ role, children }: Props) {
  const { walletAddress, jwtToken, user, needsName } = useAuth()

  if (role === 'landowner') {
    if (needsName) return <>{children}</>
    if (walletAddress) return <>{children}</>
    if (jwtToken && user?.role === 'landowner') return <>{children}</>
    return <Navigate to="/login" replace />
  }

  if (!jwtToken || user?.role !== role) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}
