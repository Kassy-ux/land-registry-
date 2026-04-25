import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast, { Toaster } from 'react-hot-toast'

export default function LoginPage() {
  const { connectWallet, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleWallet = async () => {
    try {
      setLoading(true)
      await connectWallet()
      toast.success('Wallet connected')
      navigate('/landowner')
    } catch (err: any) {
      toast.error(err.message || 'Failed to connect wallet')
    } finally {
      setLoading(false)
    }
  }

  const handleOfficerLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await api.post('/auth/login', { email, password })
      login(res.data.token)
      toast.success('Logged in as officer')
      navigate('/officer')
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Toaster />
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Land Registry</h1>
          <p className="text-gray-500 text-sm mt-1">Blockchain-powered land administration</p>
        </div>
        <div className="mb-6">
          <button
            onClick={handleWallet}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            Connect MetaMask — Landowner
          </button>
        </div>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <form onSubmit={handleOfficerLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="officer@land.ke"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            Sign in as Officer
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          <a href="/" className="hover:text-indigo-600 mr-4">← Home</a><a href="/verify" className="hover:text-indigo-600">Public verification →</a>
        </p>
      </div>
    </div>
  )
}
