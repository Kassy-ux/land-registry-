import { useState, useEffect } from 'react'
import api from '../services/api'
import toast, { Toaster } from 'react-hot-toast'

type Parcel = { id: number; titleNumber: string; location: string; size: number; status: string }
type Tab = 'registry' | 'transfers' | 'verify'

export default function OfficerDashboard() {
  const [tab, setTab] = useState<Tab>('registry')
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [registryTab, setRegistryTab] = useState<'pending' | 'history'>('pending')
  const [transferTab, setTransferTab] = useState<'all' | 'new'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState<any>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [newTransfer, setNewTransfer] = useState({ titleId: '', newOwnerAddress: '' })
  const [transferLoading, setTransferLoading] = useState(false)

  const fetchParcels = () => {
    api.get('/parcels/all').then(r => setParcels(r.data)).catch(() => {})
  }

  useEffect(() => { fetchParcels() }, [])

  const pending = parcels.filter(p => p.status === 'pending')
  const history = parcels.filter(p => p.status !== 'pending')
  const approved = parcels.filter(p => p.status === 'approved')

  const handleApprove = async (id: number) => {
    try {
      await api.patch(`/parcels/${id}/approve`)
      toast.success('Parcel approved')
      fetchParcels()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to approve')
    }
  }

  const handleReject = async (id: number) => {
    try {
      await api.patch(`/parcels/${id}/reject`)
      toast.success('Parcel rejected')
      fetchParcels()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to reject')
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSearchLoading(true)
      const res = await api.get(`/verify/${encodeURIComponent(searchQuery)}`)
      setSearchResult(res.data)
    } catch {
      toast.error('Parcel not found')
      setSearchResult(null)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setTransferLoading(true)
      await api.post('/transfers', {
        landId: Number(newTransfer.titleId),
        newOwnerAddress: newTransfer.newOwnerAddress
      })
      toast.success('Transfer initiated successfully')
      setNewTransfer({ titleId: '', newOwnerAddress: '' })
      setTransferTab('all')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to initiate transfer')
    } finally {
      setTransferLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('jwt_token')
    window.location.href = '/'
  }

  const statusColor = (s: string) => {
    if (s === 'approved') return 'bg-green-100 text-green-700'
    if (s === 'rejected') return 'bg-red-100 text-red-600'
    return 'bg-yellow-100 text-yellow-700'
  }

  const navItems = [
    { key: 'registry' as Tab, label: 'Registry', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { key: 'transfers' as Tab, label: 'Transfers', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
    { key: 'verify' as Tab, label: 'Verify Title', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Toaster />

      {/* Topbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 rounded-lg p-1">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          </div>
          <span className="font-bold text-gray-900">Blockchain Land Registry</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Registry Officer</span>
          <button onClick={logout} className="text-sm text-red-500 hover:text-red-700 font-medium">Logout</button>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 min-h-screen bg-white border-r border-gray-100 p-4 hidden md:block">
          <nav className="space-y-1 mt-2">
            {navItems.map(item => (
              <button key={item.key} onClick={() => setTab(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${tab === item.key ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 max-w-4xl">

          {/* Registry Tab */}
          {tab === 'registry' && (
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Registry Administration</h1>
              <p className="text-gray-500 text-sm mb-6">Review and approve pending land registrations and transfers.</p>

              {/* Sub tabs */}
              <div className="flex border border-gray-200 rounded-xl p-1 bg-white mb-6 w-fit">
                <button onClick={() => setRegistryTab('pending')}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition ${registryTab === 'pending' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                  Pending Lands {pending.length > 0 && <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pending.length}</span>}
                </button>
                <button onClick={() => setRegistryTab('history')}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition ${registryTab === 'history' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                  History
                </button>
              </div>

              {registryTab === 'pending' && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  {pending.length === 0 ? (
                    <div className="text-center py-16">
                      <svg className="w-12 h-12 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="font-medium text-gray-400">Inbox Zero</p>
                      <p className="text-sm text-gray-400 mt-1">There are no pending land registrations to review.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pending.map(p => (
                        <div key={p.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{p.titleNumber}</p>
                            <p className="text-xs text-gray-500">{p.location} · {p.size} acres</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleApprove(p.id)} className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700">Approve</button>
                            <button onClick={() => handleReject(p.id)} className="bg-red-100 text-red-600 px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-red-200">Reject</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {registryTab === 'history' && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  {history.length === 0 ? (
                    <p className="text-center text-gray-400 py-8 text-sm">No history yet</p>
                  ) : (
                    <div className="space-y-3">
                      {history.map(p => (
                        <div key={p.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{p.titleNumber}</p>
                            <p className="text-xs text-gray-500">{p.location} · {p.size} acres</p>
                          </div>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(p.status)}`}>
                            {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Transfers Tab */}
          {tab === 'transfers' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 mb-1">Transfers</h1>
                  <p className="text-gray-500 text-sm">Manage and initiate land ownership transfers.</p>
                </div>
                <button onClick={() => setTransferTab('new')}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 flex items-center gap-2">
                  + New Transfer
                </button>
              </div>

              <div className="flex border border-gray-200 rounded-xl p-1 bg-white mb-6 w-fit">
                {(['all', 'new'] as const).map(t => (
                  <button key={t} onClick={() => setTransferTab(t)}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition capitalize ${transferTab === t ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                    {t === 'new' ? 'New Transfer' : 'All Transfers'}
                  </button>
                ))}
              </div>

              {transferTab === 'all' && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="text-center py-16">
                    <svg className="w-12 h-12 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <p className="font-medium text-gray-400">No transfers yet</p>
                    <p className="text-sm text-gray-400 mt-1">Initiated transfers will appear here.</p>
                  </div>
                </div>
              )}

              {transferTab === 'new' && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-semibold text-gray-900 mb-1">Transfer Land Ownership</h2>
                  <p className="text-gray-500 text-sm mb-6">Execute a secure blockchain-based ownership transfer on behalf of a user.</p>
                  <form onSubmit={handleTransfer} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Title Deed *</label>
                      <select value={newTransfer.titleId} onChange={e => setNewTransfer({...newTransfer, titleId: e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                        <option value="">-- Select a title deed --</option>
                        {approved.map(p => (
                          <option key={p.id} value={p.id}>{p.titleNumber} — {p.location}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-center">
                      <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Owner Wallet Address *</label>
                      <input placeholder="0x..." value={newTransfer.newOwnerAddress}
                        onChange={e => setNewTransfer({...newTransfer, newOwnerAddress: e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                      <p className="text-xs text-gray-400 mt-1">Wallet address of the new land owner</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-sm font-semibold text-blue-700 mb-2">Smart Contract Transfer Process</p>
                      <p className="text-xs text-blue-600 mb-2">The transfer will be executed automatically via smart contract:</p>
                      <ul className="text-xs text-blue-600 space-y-1">
                        <li>• Verify current ownership on blockchain</li>
                        <li>• Create new block with transfer record</li>
                        <li>• Update ownership immutably</li>
                        <li>• Generate transaction hash for audit trail</li>
                      </ul>
                    </div>
                    <button type="submit" disabled={transferLoading}
                      className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition">
                      {transferLoading ? 'Processing...' : 'Execute Transfer on Blockchain'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Verify Tab */}
          {tab === 'verify' && (
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Verify Land Ownership</h1>
              <p className="text-gray-500 text-sm mb-6">Search and verify land records on the blockchain</p>
              <form onSubmit={handleVerify} className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input placeholder="Enter title deed number (e.g., LR/2024/001)" value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <button type="submit" disabled={searchLoading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                    {searchLoading ? '...' : 'Verify'}
                  </button>
                </div>
              </form>
              {searchResult && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-gray-900">{searchResult.titleNumber}</h2>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(searchResult.status)}`}>
                      {searchResult.status.charAt(0).toUpperCase() + searchResult.status.slice(1)}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                    <div className="flex justify-between"><span className="text-gray-500">Location</span><span className="font-medium">{searchResult.location}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Size</span><span className="font-medium">{searchResult.size} acres</span></div>
                    {searchResult.onChain ? (
                      <>
                        <div className="flex justify-between"><span className="text-gray-500">On-chain Owner</span>
                          <span className="font-mono text-xs">{searchResult.onChain.currentOwner?.slice(0,10)}...</span>
                        </div>
                        <div className="mt-3 bg-green-50 rounded-xl p-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs text-green-700 font-medium">Verified on blockchain</span>
                        </div>
                      </>
                    ) : (
                      <div className="mt-3 bg-yellow-50 rounded-xl p-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="text-xs text-yellow-700 font-medium">Not yet recorded on-chain</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
