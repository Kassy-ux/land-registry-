import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Props {
  requires: 'wallet' | 'jwt'
  children: React.ReactNode
}

export default function ProtectedRoute({ requires, children }: Props) {
  const { walletAddress, jwtToken } = useAuth()
  if (requires === 'wallet' && !walletAddress) return <Navigate to="/login" replace />
  if (requires === 'jwt' && !jwtToken) return <Navigate to="/login" replace />
  return <>{children}</>
}
