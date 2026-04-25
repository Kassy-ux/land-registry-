import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiArrowRight,
} from 'react-icons/hi2'
import { FaWallet } from 'react-icons/fa6'
import Logo from '../components/Logo'
import secureLogin from '../assets/illustrations/secure-login.svg'

type Mode = 'landowner' | 'officer'

export default function LoginPage() {
  const { connectWallet, login } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('landowner')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleWallet = async () => {
    try {
      setLoading(true)
      await connectWallet()
      navigate('/landowner')
    } catch (err) {
      // Error already handled in connectWallet with toast
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
      toast.success('Welcome back!')
      navigate('/officer')
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Left visual panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col p-10 xl:p-14">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(135deg, #eff6ff 0%, #ede9fe 60%, #fdf4ff 100%)',
          }}
        />
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-40 -z-10"
          style={{ background: 'radial-gradient(circle, #93c5fd 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-30 -z-10"
          style={{ background: 'radial-gradient(circle, #c4b5fd 0%, transparent 70%)' }}
        />

        <Link to="/" className="self-start">
          <Logo size="md" />
        </Link>

        <div className="flex-1 flex flex-col justify-center max-w-lg">
          <h2 className="text-3xl xl:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
            Your land. <br />
            Secured on-chain.
          </h2>
          <p className="text-slate-600 mb-10 text-lg">
            Sign in to manage your registered parcels, submit new titles, or review
            applications — all backed by an immutable ledger.
          </p>

          <img
            src={secureLogin}
            alt="Secure access"
            className="w-full max-w-md mx-auto h-auto max-h-80 object-contain mb-10"
          />

          <ul className="space-y-3">
            {[
              'Cryptographically signed records',
              'Public verification, private control',
              'Approved by registered officers',
            ].map(item => (
              <li key={item} className="flex items-center gap-3 text-slate-700">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <HiOutlineCheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex lg:hidden items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-6"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back home
          </Link>

          <div className="lg:hidden mb-6">
            <Logo size="md" />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-500 mb-8">
            Pick how you'd like to sign in to LandLedger.
          </p>

          {/* Mode tabs */}
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 mb-8">
            <button
              onClick={() => setMode('landowner')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                mode === 'landowner'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Landowner
            </button>
            <button
              onClick={() => setMode('officer')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                mode === 'officer'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Registry Officer
            </button>
          </div>

          {mode === 'landowner' ? (
            <div className="space-y-5">
              <button
                onClick={handleWallet}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-3 bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-200"
              >
                <FaWallet className="w-5 h-5" />
                {loading ? 'Connecting...' : 'Connect MetaMask'}
              </button>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-900">
                <p className="font-semibold mb-1">New here?</p>
                <p className="text-blue-700">
                  We'll create your landowner profile automatically when you sign your
                  first wallet message.
                </p>
              </div>

              <p className="text-center text-xs text-slate-400">
                Don't have MetaMask?{' '}
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Install it here
                </a>
              </p>
            </div>
          ) : (
            <form onSubmit={handleOfficerLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <HiOutlineEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="officer@land.ke"
                    className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    required
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-emerald-600 hover:underline font-medium"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full border border-slate-200 rounded-xl pl-11 pr-11 py-3.5 text-sm bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <HiOutlineEyeSlash className="w-5 h-5" />
                    ) : (
                      <HiOutlineEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-50 shadow-lg shadow-emerald-200"
              >
                {loading ? 'Signing in...' : 'Sign in as Officer'}
                {!loading && <HiArrowRight className="w-4 h-4" />}
              </button>

              <p className="text-xs text-center text-slate-400 pt-2">
                Default credentials in dev:{' '}
                <span className="font-mono text-slate-600">officer@land.ke / officer123</span>
              </p>
            </form>
          )}

          <div className="text-center mt-8 text-sm text-slate-500">
            <Link to="/verify" className="hover:text-blue-600 font-medium">
              Verify a parcel publicly
            </Link>
            <span className="mx-2 text-slate-300">·</span>
            <Link to="/" className="hover:text-blue-600 font-medium">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
