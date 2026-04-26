import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Wallet,
  Mail,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Landmark,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const demoAccounts = [
  { role: 'Admin', email: 'admin@land.ke', password: 'admin123', accent: 'from-purple-500 to-pink-500' },
  { role: 'Officer', email: 'officer@land.ke', password: 'officer123', accent: 'from-blue-500 to-indigo-500' },
  { role: 'Landowner', email: 'landowner@land.ke', password: 'landowner123', accent: 'from-emerald-500 to-teal-500' },
]

export default function LoginPage() {
  const { connectWallet, login, needsName } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [walletLoading, setWalletLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const handleWallet = async () => {
    try {
      setWalletLoading(true)
      await connectWallet()
      if (!needsName) navigate('/landowner')
    } catch (err: any) {
      toast.error(err.message || 'Failed to connect wallet')
    } finally {
      setWalletLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await api.post('/auth/login', { email, password })
      login(res.data.token, res.data.user)
      toast.success(`Welcome back, ${res.data.user.name}`)
      const role = res.data.user.role
      if (role === 'admin') navigate('/admin')
      else if (role === 'officer') navigate('/officer')
      else navigate('/landowner')
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const useDemo = (acc: typeof demoAccounts[number]) => {
    setEmail(acc.email)
    setPassword(acc.password)
    toast.info(`Filled in ${acc.role} credentials`)
  }

  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 1200)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,white,transparent_60%)]" />
        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-2 text-white">
            <div className="bg-white/20 backdrop-blur p-2 rounded-xl">
              <Landmark className="w-5 h-5" />
            </div>
            <span className="font-bold">Land Registry</span>
          </Link>
        </div>
        <div className="relative flex flex-col items-center text-white text-center">
          <img
            src="/illustrations/login.svg"
            alt="Sign in"
            className="w-full max-w-md mb-6 drop-shadow-2xl"
          />
          <h2 className="text-3xl font-bold mb-3">Land titles, on-chain</h2>
          <p className="text-indigo-100 text-sm max-w-sm">
            Sign in to register, transfer or verify land parcels secured by Ethereum smart contracts.
          </p>
        </div>
        <div className="relative grid grid-cols-3 gap-3 text-white">
          {[
            { label: 'Records', value: '5k+' },
            { label: 'Transfers', value: '1.2k' },
            { label: 'Officers', value: '24' },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-indigo-100">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">Land Registry</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-6">
            Sign in to access your dashboard
          </p>

          {/* Wallet button */}
          <button
            onClick={handleWallet}
            disabled={walletLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-200 transition disabled:opacity-60 flex items-center justify-center gap-2 mb-6"
          >
            {walletLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wallet className="w-4 h-4" />
            )}
            Connect MetaMask — Landowner
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs">or with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Sign in
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-7 border border-dashed border-gray-200 rounded-2xl p-4 bg-white">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <p className="text-xs font-semibold text-gray-700">Demo credentials</p>
              <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-400">click to fill</span>
            </div>
            <div className="space-y-2">
              {demoAccounts.map((acc) => (
                <div
                  key={acc.email}
                  className="flex items-center gap-3 p-2 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition"
                >
                  <button
                    onClick={() => useDemo(acc)}
                    className="flex-1 flex items-center gap-3 text-left min-w-0"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${acc.accent} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                    >
                      {acc.role[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-900">{acc.role}</p>
                      <p className="text-[11px] text-gray-500 font-mono truncate">
                        {acc.email} · {acc.password}
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => copy(`${acc.email} / ${acc.password}`)}
                    className="text-gray-400 hover:text-gray-700 p-1.5"
                    title="Copy"
                  >
                    {copied === `${acc.email} / ${acc.password}` ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            <Link to="/verify" className="hover:text-indigo-600">
              Public verification →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
