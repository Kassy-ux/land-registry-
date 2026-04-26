import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, LogOut, User as UserIcon, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface Props {
  title: string
  onMenuClick: () => void
  rightSlot?: React.ReactNode
}

export default function TopNav({ title, onMenuClick, rightSlot }: Props) {
  const { user, walletAddress, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const display = user?.name || (walletAddress ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}` : 'Guest')
  const initial = (user?.name || walletAddress || 'U').charAt(0).toUpperCase()

  return (
    <header className="sticky top-0 z-30 h-14 bg-white/80 backdrop-blur border-b border-gray-200 flex items-center px-4 gap-3">
      <button
        onClick={onMenuClick}
        className="md:hidden text-gray-600 hover:text-gray-900 p-1"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>
      <h1 className="font-semibold text-gray-900 text-base truncate">{title}</h1>
      <div className="ml-auto flex items-center gap-3">
        {rightSlot}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs font-semibold flex items-center justify-center">
              {initial}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">{display}</span>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:inline" />
          </button>
          {open && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900 truncate">{display}</p>
                <p className="text-xs text-gray-500 truncate capitalize">{user?.role || 'Landowner'}</p>
              </div>
              <button
                onClick={() => { setOpen(false); navigate('/') }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4" /> Home
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
