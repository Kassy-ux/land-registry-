import { useNavigate } from 'react-router-dom'
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import { FaWallet } from 'react-icons/fa6'
import { useAuth } from '../context/AuthContext'

function shorten(address: string) {
  if (address.length <= 10) return address
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export default function WalletBadge() {
  const { walletAddress, logout } = useAuth()
  const navigate = useNavigate()

  if (!walletAddress) return null

  const handleDisconnect = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex items-center gap-2 pl-3 pr-1 py-1 bg-slate-50 border border-slate-200 rounded-xl">
      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
        <FaWallet className="w-3.5 h-3.5" />
      </div>
      <span
        className="text-xs font-mono font-semibold text-slate-700"
        title={walletAddress}
      >
        {shorten(walletAddress)}
      </span>
      <button
        onClick={handleDisconnect}
        title="Disconnect wallet"
        className="ml-1 w-7 h-7 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition"
      >
        <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
      </button>
    </div>
  )
}
