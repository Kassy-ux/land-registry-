import { useState } from 'react'
import { toast } from 'sonner'
import {
  Search as SearchIcon,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Database,
  ExternalLink,
} from 'lucide-react'
import api from '../services/api'

export default function SearchRecords() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await api.get(`/verify/${encodeURIComponent(query)}`)
      setResult(res.data)
    } catch {
      toast.error('Record not found')
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
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Search Records</h2>
        <p className="text-gray-500 text-sm mt-1">Search and verify land records on the blockchain</p>
      </div>

      <form onSubmit={handleSearch} className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
        <div className="flex gap-3">
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
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <SearchIcon className="w-4 h-4" />}
            Verify
          </button>
        </div>
      </form>

      {result && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{result.titleNumber}</h3>
              <p className="text-sm text-gray-500">Land Parcel Details</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColor(result.status)}`}>
              {result.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-4">
            <div>
              <p className="text-gray-400 text-xs mb-1">Location</p>
              <p className="font-medium text-gray-900">{result.location}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Size</p>
              <p className="font-medium text-gray-900">{result.size} acres</p>
            </div>
            {result.onChain && (
              <div className="col-span-2">
                <p className="text-gray-400 text-xs mb-1">Current Owner (On-chain)</p>
                <p className="font-mono text-xs text-gray-700 break-all">{result.onChain.currentOwner}</p>
              </div>
            )}
          </div>

          {result.onChain ? (
            <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-700 font-medium">Verified on blockchain</span>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-xs text-yellow-700 font-medium">Not yet recorded on-chain</span>
            </div>
          )}

          {result.onChain?.transferHistory?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-gray-500" />
                <p className="text-sm font-medium text-gray-700">Transfer History</p>
              </div>
              <div className="space-y-2">
                {result.onChain.transferHistory.map((t: any, i: number) => (
                  <div key={i} className="text-xs bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                    <span className="font-mono text-gray-500">{t.from?.slice(0, 10)}…</span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                    <span className="font-mono text-gray-500">{t.to?.slice(0, 10)}…</span>
                    {t.txHash && (
                      <a
                        href={`https://sepolia.etherscan.io/tx/${t.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto text-indigo-500 hover:underline flex items-center gap-1"
                      >
                        Etherscan <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
