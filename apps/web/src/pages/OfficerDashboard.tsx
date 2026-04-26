import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  ClipboardList,
  ArrowRightLeft,
  Search as SearchIcon,
  CheckCircle2,
  XCircle,
  Inbox,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Plus,
  MapPin,
  Wallet,
  FileText,
} from 'lucide-react'
import api from '../services/api'
import DashboardLayout from '../components/DashboardLayout'

type Parcel = { id: number; titleNumber: string; location: string; size: number; status: string }

const statusColor = (s: string) => {
  if (s === 'approved') return 'bg-green-100 text-green-700'
  if (s === 'rejected') return 'bg-red-100 text-red-600'
  return 'bg-yellow-100 text-yellow-700'
}

function EmptyState({ Icon, title, desc }: { Icon: any; title: string; desc: string }) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 rounded-2xl mb-4">
        <Icon className="w-6 h-6 text-gray-300" />
      </div>
      <p className="font-medium text-gray-500">{title}</p>
      <p className="text-sm text-gray-400 mt-1">{desc}</p>
    </div>
  )
}

function Registry({
  parcels,
  refresh,
}: {
  parcels: Parcel[]
  refresh: () => void
}) {
  const [registryTab, setRegistryTab] = useState<'pending' | 'history'>('pending')
  const pending = parcels.filter(p => p.status === 'pending')
  const history = parcels.filter(p => p.status !== 'pending')

  const handleApprove = async (id: number) => {
    try {
      await api.patch(`/parcels/${id}/approve`)
      toast.success('Parcel approved')
      refresh()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to approve')
    }
  }

  const handleReject = async (id: number) => {
    try {
      await api.patch(`/parcels/${id}/reject`)
      toast.success('Parcel rejected')
      refresh()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to reject')
    }
  }

  return (
    <div className="p-6 max-w-5xl">
      <p className="text-gray-500 text-sm mb-6">Review and approve pending land registrations.</p>

      <div className="flex border border-gray-200 rounded-xl p-1 bg-white mb-6 w-fit">
        <button
          onClick={() => setRegistryTab('pending')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
            registryTab === 'pending' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Pending Lands
          {pending.length > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {pending.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setRegistryTab('history')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
            registryTab === 'history' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          History
        </button>
      </div>

      {registryTab === 'pending' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          {pending.length === 0 ? (
            <EmptyState Icon={Inbox} title="Inbox Zero" desc="There are no pending land registrations to review." />
          ) : (
            <div className="space-y-3">
              {pending.map(p => (
                <div
                  key={p.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-xl flex-wrap gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-yellow-100 text-yellow-700 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{p.titleNumber}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {p.location} · {p.size} acres
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(p.id)}
                      className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(p.id)}
                      className="bg-red-100 text-red-600 px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-red-200 flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </button>
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
            <EmptyState Icon={ClipboardList} title="No history yet" desc="Approved or rejected parcels will appear here." />
          ) : (
            <div className="space-y-3">
              {history.map(p => (
                <div key={p.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{p.titleNumber}</p>
                    <p className="text-xs text-gray-500">{p.location} · {p.size} acres</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColor(p.status)}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Transfers({ approved }: { approved: Parcel[] }) {
  const [transferTab, setTransferTab] = useState<'all' | 'new'>('all')
  const [newTransfer, setNewTransfer] = useState({ titleId: '', newOwnerAddress: '' })
  const [transferLoading, setTransferLoading] = useState(false)

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setTransferLoading(true)
      await api.post('/transfers', {
        landId: Number(newTransfer.titleId),
        newOwnerAddress: newTransfer.newOwnerAddress,
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

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <p className="text-gray-500 text-sm">Manage and initiate land ownership transfers.</p>
        <button
          onClick={() => setTransferTab('new')}
          className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Transfer
        </button>
      </div>

      <div className="flex border border-gray-200 rounded-xl p-1 bg-white mb-6 w-fit">
        {(['all', 'new'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTransferTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              transferTab === t ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'new' ? 'New Transfer' : 'All Transfers'}
          </button>
        ))}
      </div>

      {transferTab === 'all' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <EmptyState Icon={ArrowRightLeft} title="No transfers yet" desc="Initiated transfers will appear here." />
        </div>
      )}

      {transferTab === 'new' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Transfer Land Ownership</h2>
          <p className="text-gray-500 text-sm mb-6">
            Execute a secure blockchain-based ownership transfer on behalf of a user.
          </p>
          <form onSubmit={handleTransfer} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Title Deed *</label>
              <div className="relative">
                <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={newTransfer.titleId}
                  onChange={e => setNewTransfer({ ...newTransfer, titleId: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  required
                >
                  <option value="">-- Select a title deed --</option>
                  {approved.map(p => (
                    <option key={p.id} value={p.id}>{p.titleNumber} — {p.location}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Owner Wallet Address *</label>
              <div className="relative">
                <Wallet className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  placeholder="0x..."
                  value={newTransfer.newOwnerAddress}
                  onChange={e => setNewTransfer({ ...newTransfer, newOwnerAddress: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Wallet address of the new land owner</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <p className="text-sm font-semibold text-blue-700">Smart Contract Transfer Process</p>
              </div>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• Verify current ownership on blockchain</li>
                <li>• Create new block with transfer record</li>
                <li>• Update ownership immutably</li>
                <li>• Generate transaction hash for audit trail</li>
              </ul>
            </div>
            <button
              type="submit"
              disabled={transferLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {transferLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {transferLoading ? 'Processing...' : 'Execute Transfer on Blockchain'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

function Verify() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState<any>(null)
  const [searchLoading, setSearchLoading] = useState(false)

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

  return (
    <div className="p-6 max-w-3xl">
      <p className="text-gray-500 text-sm mb-6">Search and verify land records on the blockchain.</p>
      <form onSubmit={handleVerify} className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              placeholder="Enter title number (e.g., LR/2024/001)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={searchLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <SearchIcon className="w-4 h-4" />}
            Verify
          </button>
        </div>
      </form>
      {searchResult && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">{searchResult.titleNumber}</h2>
            <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColor(searchResult.status)}`}>
              {searchResult.status}
            </span>
          </div>
          <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
            <div className="flex justify-between"><span className="text-gray-500">Location</span><span className="font-medium">{searchResult.location}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Size</span><span className="font-medium">{searchResult.size} acres</span></div>
            {searchResult.onChain ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">On-chain Owner</span>
                  <span className="font-mono text-xs">{searchResult.onChain.currentOwner?.slice(0, 10)}...</span>
                </div>
                <div className="mt-3 bg-green-50 rounded-xl p-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-700 font-medium">Verified on blockchain</span>
                </div>
              </>
            ) : (
              <div className="mt-3 bg-yellow-50 rounded-xl p-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-xs text-yellow-700 font-medium">Not yet recorded on-chain</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const titleByPath: Record<string, string> = {
  '/officer': 'Registry Administration',
  '/officer/transfers': 'Land Transfers',
  '/officer/verify': 'Verify Title',
}

export default function OfficerDashboard() {
  const [parcels, setParcels] = useState<Parcel[]>([])
  const location = useLocation()
  const navigate = useNavigate()

  const fetchParcels = () => {
    api.get('/parcels/all').then(r => setParcels(r.data)).catch(() => {})
  }

  useEffect(() => { fetchParcels() }, [])

  const pending = parcels.filter(p => p.status === 'pending')
  const approved = parcels.filter(p => p.status === 'approved')

  const items = [
    { path: '/officer', label: 'Registry', icon: ClipboardList, end: true, badge: pending.length },
    { path: '/officer/transfers', label: 'Transfers', icon: ArrowRightLeft },
    { path: '/officer/verify', label: 'Verify Title', icon: SearchIcon },
  ]

  // Workaround: stay on the page after navigate (no flash needed)
  void navigate

  return (
    <DashboardLayout
      items={items}
      brand="Land Registry"
      subtitle="Registry Officer"
      accent="blue"
      title={titleByPath[location.pathname] || 'Officer'}
    >
      <Routes>
        <Route index element={<Registry parcels={parcels} refresh={fetchParcels} />} />
        <Route path="transfers" element={<Transfers approved={approved} />} />
        <Route path="verify" element={<Verify />} />
      </Routes>
    </DashboardLayout>
  )
}
