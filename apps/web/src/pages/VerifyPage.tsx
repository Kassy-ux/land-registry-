import { useState } from 'react'
import api from '../services/api'
import toast, { Toaster } from 'react-hot-toast'

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
    } catch {
      toast.error('Parcel not found')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const statusColor = (status: string) => {
    if (status === 'approved') return 'bg-green-100 text-green-700'
    if (status === 'rejected') return 'bg-red-100 text-red-700'
    return 'bg-yellow-100 text-yellow-700'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Toaster />
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Verify Land Parcel</h1>
          <p className="text-gray-500 text-sm mt-1">Public on-chain ownership lookup</p>
        </div>
        <form onSubmit={handleVerify} className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
          <div className="flex gap-3">
            <input
              placeholder="Enter Title Number or Parcel ID"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
              {loading ? '...' : 'Verify'}
            </button>
          </div>
        </form>
        {result && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-gray-900">{result.titleNumber}</h2>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(result.status)}`}>
                {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Location</span>
                <span className="text-gray-900">{result.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Size</span>
                <span className="text-gray-900">{result.size} acres</span>
              </div>
              {result.onChain && (
                <div className="flex justify-between">
                  <span className="text-gray-500">On-chain Owner</span>
                  <span className="text-gray-900 font-mono text-xs">{result.onChain.currentOwner?.slice(0,10)}...</span>
                </div>
              )}
              {!result.onChain && (
                <div className="text-xs text-yellow-600 bg-yellow-50 rounded-xl p-3">
                  ⚠ Not yet recorded on-chain
                </div>
              )}
            </div>
            {result.onChain?.transferHistory?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Transfer History</p>
                <div className="space-y-2">
                  {result.onChain.transferHistory.map((t: any, i: number) => (
                    <div key={i} className="text-xs bg-gray-50 rounded-xl p-3">
                      <span className="font-mono text-gray-500">{t.from?.slice(0,8)}...</span>
                      <span className="mx-2 text-gray-400">→</span>
                      <span className="font-mono text-gray-500">{t.to?.slice(0,8)}...</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <p className="text-center text-sm text-gray-400 mt-4">
          <a href="/login" className="hover:text-indigo-600">Back to login</a>
        </p>
      </div>
    </div>
  )
}
