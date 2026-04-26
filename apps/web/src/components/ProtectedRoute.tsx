import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Props {
  requires: 'wallet' | 'jwt'
  children: React.ReactNode
}

export default function ProtectedRoute({ requires, children }: Props) {
  const { walletAddress, jwtToken, needsName } = useAuth()
  if (requires === 'wallet' && !walletAddress && !needsName) return <Navigate to="/" />
  if (requires === 'jwt' && !jwtToken) return <Navigate to="/" />
  return <>{children}</>
}
