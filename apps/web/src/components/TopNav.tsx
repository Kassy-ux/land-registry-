import { useAuth } from '../context/AuthContext'

export default function TopNav({ title }: { title: string }) {
  const { user, walletAddress, logout } = useAuth()

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.name || `${walletAddress?.slice(0,6)}...${walletAddress?.slice(-4)}`}</span>
        <button onClick={logout} className="text-sm text-gray-500 hover:text-red-500 transition">Logout</button>
      </div>
    </header>
  )
}
