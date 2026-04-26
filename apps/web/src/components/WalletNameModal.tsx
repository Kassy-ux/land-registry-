import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function WalletNameModal() {
  const { needsName, completeWalletSetup, walletAddress } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  if (!needsName) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await completeWalletSetup(name)
      toast.success(`Welcome, ${name}!`)
      navigate('/landowner')
    } catch {
      toast.error('Setup failed, please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">👋</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Welcome!</h2>
          <p className="text-gray-500 text-sm mt-1">First time here. What's your name?</p>
          <p className="text-xs text-gray-400 font-mono mt-2">{walletAddress?.slice(0,6)}...{walletAddress?.slice(-4)}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="e.g. John Kamau"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Setting up...' : 'Get Started'}
          </button>
        </form>
      </div>
    </div>
  )
}
