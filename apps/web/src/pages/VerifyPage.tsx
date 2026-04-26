import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import toast, { Toaster } from 'react-hot-toast'

export default function VerifyPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await api.get(`/verify/${encodeURIComponent(query)}`)
      setResult(res.data)
      toast.success('Parcel found!')
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
    <div className="min-h-screen bg-gray-50 flex">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 rounded-lg p-2">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-lg">Blockchain Land Registry</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <a 
            href="/" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition mb-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-sm font-medium">Dashboard</span>
          </a>
          
          <a 
            href="/landowner" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition mb-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-medium">Register Land</span>
          </a>
          
          <a 
            href="/landowner" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition mb-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="text-sm font-medium">Transfer Ownership</span>
          </a>
          
          <button 
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-50 text-indigo-600 w-full transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm font-medium">Search Records</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Blockchain Land Registry</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">John Kamau</span>
            <button 
              onClick={() => navigate('/login')}
              className="text-sm text-gray-500 hover:text-gray-700 transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8">
          <div className="max-w-3xl">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Verify Land Ownership</h2>
              <p className="text-gray-600">Search and verify land records on the blockchain</p>
            </div>

            <form onSubmit={handleVerify} className="mb-6">
              <div className="flex gap-3">
                <input
                  placeholder="Enter title deed number (e.g., LR/2024/001)"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Searching...' : 'Verify'}
                </button>
              </div>
            </form>

            {result && (
              <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{result.titleNumber}</h3>
                    <p className="text-sm text-gray-500">Land Parcel Details</p>
                  </div>
                  <span className={`text-xs px-4 py-2 rounded-full font-medium ${statusColor(result.status)}`}>
                    {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Location</p>
                    <p className="text-base font-medium text-gray-900">{result.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Land Size</p>
                    <p className="text-base font-medium text-gray-900">{result.size} acres</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Registration Date</p>
                    <p className="text-base font-medium text-gray-900">
                      {new Date(result.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  {result.onChain && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Current Owner (On-chain)</p>
                      <p className="text-sm font-mono text-gray-900 break-all">
                        {result.onChain.currentOwner}
                      </p>
                    </div>
                  )}
                </div>

                {!result.onChain && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Not yet recorded on blockchain</p>
                      <p className="text-xs text-yellow-700 mt-1">This parcel is pending blockchain registration</p>
                    </div>
                  </div>
                )}

                {result.onChain?.transferHistory && result.onChain.transferHistory.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Transfer History</h4>
                    <div className="space-y-3">
                      {result.onChain.transferHistory.map((t: any, i: number) => (
                        <div key={i} className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">From</p>
                            <p className="text-sm font-mono text-gray-700">{t.from}</p>
                          </div>
                          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">To</p>
                            <p className="text-sm font-mono text-gray-700">{t.to}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
