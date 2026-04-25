import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlineSquaresPlus,
  HiOutlineDocumentCheck,
  HiOutlineExclamationTriangle,
  HiOutlineArrowLeft,
  HiOutlineCheckBadge,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlineUser,
} from 'react-icons/hi2'
import { FaEthereum } from 'react-icons/fa6'
import Logo from '../components/Logo'
import verifiedIllustration from '../assets/illustrations/verified.svg'

interface TransferEvent {
  from?: string
  to?: string
}

interface DocumentRecord {
  id: number
  fileHash: string
  documentType: string
}

interface VerifyResult {
  parcelId: number
  titleNumber: string
  location: string
  size: number
  status: string
  documents: DocumentRecord[]
  onChain?: {
    titleNumber: string
    location: string
    ipfsHash: string
    status: number
    currentOwner: string
    transferHistory: TransferEvent[]
  } | null
}

export default function VerifyPage() {
  const navigate = useNavigate()
  const { walletAddress, jwtToken } = useAuth()
  const isLoggedIn = !!(walletAddress || jwtToken)
  
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<VerifyResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setSearched(true)
      const res = await api.get(`/verify/${encodeURIComponent(query)}`)
      setResult(res.data)
      toast.success('Parcel verified successfully')
    } catch {
      toast.error('Parcel not found')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const statusConfig = (status: string) => {
    if (status === 'approved')
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        ring: 'ring-emerald-200',
        Icon: HiOutlineCheckBadge,
      }
    if (status === 'rejected')
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        ring: 'ring-rose-200',
        Icon: HiOutlineXCircle,
      }
    return {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      ring: 'ring-amber-200',
      Icon: HiOutlineClock,
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-violet-50/30">

      <nav className="bg-white/85 backdrop-blur border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          {isLoggedIn ? (
            <button
              onClick={() => navigate(walletAddress ? '/landowner' : '/officer')}
              className="text-sm bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold shadow-md shadow-blue-200 transition-all"
            >
              Dashboard
            </button>
          ) : (
            <Link
              to="/login"
              className="text-sm bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold shadow-md shadow-blue-200 transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <FaEthereum className="w-3.5 h-3.5" />
            Public on-chain lookup
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            Verify any land parcel
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Enter a title number or parcel ID to view its current owner, status, and full
            transfer history.
          </p>
        </div>

        <form
          onSubmit={handleVerify}
          className="bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/40 p-3 mb-8 flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              placeholder="e.g. KSM/001 or 12"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full border-0 bg-transparent rounded-xl pl-12 pr-4 py-3.5 text-base focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 shadow-md shadow-blue-200 whitespace-nowrap"
          >
            {loading ? 'Verifying...' : 'Verify'}
            {!loading && <HiOutlineMagnifyingGlass className="w-4 h-4" />}
          </button>
        </form>

        {!searched && (
          <div className="text-center py-10">
            <img
              src={verifiedIllustration}
              alt="Verification illustration"
              className="mx-auto h-64 w-auto object-contain mb-6"
            />
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Search results will appear here. No account needed — every record is publicly
              verifiable.
            </p>
          </div>
        )}

        {searched && !result && !loading && (
          <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4">
              <HiOutlineExclamationTriangle className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">No parcel found</h3>
            <p className="text-sm text-slate-500">
              Double-check the title number or parcel ID and try again.
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-5">
            {/* Header card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/30 overflow-hidden">
              <div
                className="px-7 py-5 border-b border-slate-100"
                style={{
                  background:
                    'linear-gradient(135deg, #eff6ff 0%, #ede9fe 100%)',
                }}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
                      Title number
                    </p>
                    <h2 className="text-2xl font-extrabold text-slate-900 font-mono">
                      {result.titleNumber}
                    </h2>
                  </div>
                  {(() => {
                    const cfg = statusConfig(result.status)
                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 ${cfg.bg} ${cfg.text} px-3 py-1.5 rounded-full text-xs font-bold ring-1 ${cfg.ring}`}
                      >
                        <cfg.Icon className="w-4 h-4" />
                        {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                      </span>
                    )
                  })()}
                </div>
              </div>

              <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                <div className="p-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <HiOutlineMapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="font-semibold text-slate-900">{result.location}</p>
                  </div>
                </div>
                <div className="p-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 shrink-0">
                    <HiOutlineSquaresPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Size</p>
                    <p className="font-semibold text-slate-900">{result.size} acres</p>
                  </div>
                </div>
                <div className="p-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <HiOutlineDocumentCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Documents</p>
                    <p className="font-semibold text-slate-900">{result.documents.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* On-chain panel */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/30 p-7">
              <div className="flex items-center gap-2 mb-4">
                <FaEthereum className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900">Blockchain record</h3>
              </div>
              {result.onChain ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                      <HiOutlineUser className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500">Current owner</p>
                      <p className="font-mono text-sm text-slate-900 truncate">
                        {result.onChain.currentOwner}
                      </p>
                    </div>
                  </div>

                  {result.onChain.transferHistory.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-3">
                        Transfer history ({result.onChain.transferHistory.length})
                      </p>
                      <div className="space-y-2">
                        {result.onChain.transferHistory.map((t, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 text-xs font-mono"
                          >
                            <span className="text-slate-500">{t.from?.slice(0, 8)}…</span>
                            <span className="text-slate-300">→</span>
                            <span className="text-slate-900">{t.to?.slice(0, 8)}…</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
                  <HiOutlineExclamationTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 text-sm">
                      Not yet recorded on-chain
                    </p>
                    <p className="text-amber-700 text-sm mt-0.5">
                      This parcel exists in our registry but hasn't been written to the
                      blockchain yet. It will be added once the officer approves it.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {result.documents.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/30 p-7">
                <h3 className="font-bold text-slate-900 mb-4">Attached documents</h3>
                <ul className="divide-y divide-slate-100">
                  {result.documents.map(doc => (
                    <li key={doc.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <HiOutlineDocumentCheck className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 text-sm">
                            {doc.documentType}
                          </p>
                          <p className="text-xs text-slate-500 font-mono truncate">
                            {doc.fileHash}
                          </p>
                        </div>
                      </div>
                      <a
                        href={`https://gateway.pinata.cloud/ipfs/${doc.fileHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-blue-600 hover:underline shrink-0"
                      >
                        View on IPFS
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 font-medium"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </main>
    </div>
  )
}
