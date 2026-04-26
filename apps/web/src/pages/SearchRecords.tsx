import { useState } from 'react'
import api from '../services/api'
import toast, { Toaster } from 'react-hot-toast'

export default function SearchRecords() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await api.get(`/verify/${query}`)
      setResult(res.data)
    } catch {
      toast.error('Record not found')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const statusLabel = (s: number) => ['Pending', 'Approved', 'Rejected'][s] || 'Unknown'
  const statusColor = (s: number) => ['bg-yellow-100 text-yellow-700', 'bg-green-100 text-green-700', 'bg-red-100 text-red-700'][s] || ''

  return (
    <main className="flex-1 p-6 max-w-2xl">
      <Toaster />
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Search Records</h2>
        <p className="text-gray-500 text-sm mt-1">Search and verify land records on the blockchain</p>
      </div>

      <form onSubmit={handleSearch} className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
        <div className="flex gap-3">
          <input
            placeholder="Enter Parcel ID (e.g. 1, 2, 3)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? '...' : 'Verify'}
          </button>
        </div>
      </form>

      {result && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">{result.onChain.titleNumber}</h3>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(result.onChain.status)}`}>
              {statusLabel(result.onChain.status)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-1">Location</p>
              <p className="font-medium text-gray-900">{result.onChain.location}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Current Owner (On-chain)</p>
              <p className="font-mono text-xs text-gray-700 break-all">{result.onChain.currentOwner}</p>
            </div>
          </div>
          {result.transferHistory.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Transfer History</p>
              {result.transferHistory.map((t: any, i: number) => (
                <div key={i} className="text-xs bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                  <span className="font-mono text-gray-500">{t.from?.slice(0,10)}...</span>
                  <span className="text-gray-400">→</span>
                  <span className="font-mono text-gray-500">{t.to?.slice(0,10)}...</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
