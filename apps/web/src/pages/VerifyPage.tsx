import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Search as SearchIcon,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Landmark,
  ArrowRight,
  Database,
  ExternalLink,
} from 'lucide-react'
import api from '../services/api'

export default function VerifyPage() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await api.get(`/verify/${encodeURIComponent(query)}`)
      setResult(res.data)
      toast.success('Parcel found')
    } catch {
      toast.error('Parcel not found')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const statusColor = (s: string) => {
    if (s === 'approved') return 'bg-green-100 text-green-700'
    if (s === 'rejected') return 'bg-red-100 text-red-700'
    return 'bg-yellow-100 text-yellow-700'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-30 backdrop-blur bg-white/80 border-b border-gray-100">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-2">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">Land Registry</span>
          </Link>
          <Link
            to="/login"
            className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 font-medium"
          >
            Sign In
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-50 rounded-2xl mb-4">
            <ShieldCheck className="w-7 h-7 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Land Ownership</h1>
          <p className="text-gray-500 text-sm">
            Public verification of land titles recorded on the Ethereum blockchain
          </p>
        </div>

        <form onSubmit={handleVerify} className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                placeholder="Enter title number (e.g. LR/2024/001)"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <SearchIcon className="w-4 h-4" />}
              {loading ? 'Searching...' : 'Verify'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Try one of: <span className="font-mono text-gray-600">LR/2024/001</span>,{' '}
            <span className="font-mono text-gray-600">LR/2024/002</span>
          </p>
        </form>

        {result && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{result.titleNumber}</h2>
                <p className="text-sm text-gray-500">Land parcel on-chain record</p>
              </div>
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize ${statusColor(result.status)}`}>
                {result.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-gray-100 pt-5">
              <div>
                <p className="text-xs text-gray-400 mb-1">Location</p>
                <p className="text-sm font-medium text-gray-900">{result.location}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Land Size</p>
                <p className="text-sm font-medium text-gray-900">{result.size} acres</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Registration Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(result.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {result.onChain?.currentOwner && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Current Owner</p>
                  <p className="text-xs font-mono text-gray-700 break-all">{result.onChain.currentOwner}</p>
                </div>
              )}
            </div>

            {result.onChain ? (
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Verified on blockchain</p>
                  <p className="text-xs text-green-700 mt-0.5">
                    This parcel is permanently recorded on Ethereum and cannot be tampered with.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Not yet recorded on blockchain</p>
                  <p className="text-xs text-yellow-700 mt-0.5">
                    This parcel is pending blockchain registration.
                  </p>
                </div>
              </div>
            )}

            {result.onChain?.transferHistory?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-900">Transfer History</h3>
                </div>
                <div className="space-y-2">
                  {result.onChain.transferHistory.map((t: any, i: number) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 text-xs">
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-400 mb-0.5">From</p>
                        <p className="font-mono text-gray-700 truncate">{t.from}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-400 mb-0.5">To</p>
                        <p className="font-mono text-gray-700 truncate">{t.to}</p>
                      </div>
                      {t.txHash && (
                        <a
                          href={`https://sepolia.etherscan.io/tx/${t.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-500 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
