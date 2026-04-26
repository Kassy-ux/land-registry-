import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import {
  LayoutDashboard,
  Users as UsersIcon,
  FileText,
  ArrowRightLeft,
  Link2,
  Settings as SettingsIcon,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ExternalLink,
  Plus,
  Loader2,
  Trash2,
  Database,
  Download,
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import DashboardLayout from '../components/DashboardLayout'

type Stats = {
  totalUsers: number
  totalParcels: number
  totalTransactions: number
  totalDocuments: number
  pendingParcels: number
  approvedParcels: number
  rejectedParcels: number
  completedTransactions: number
}

type User = { id: number; name: string; email: string; role: string; createdAt: string }
type Parcel = {
  id: number
  titleNumber: string
  location: string
  size: number
  status: string
  createdAt: string
  ownerships: any[]
  blockchainRecords: any[]
}
type Transaction = {
  id: number
  status: string
  transactionDate: string
  land: { titleNumber: string; location: string }
  seller: { name: string }
  buyer: { name: string }
}
type BlockchainRecord = {
  id: number
  blockHash: string
  timestamp: string
  land: { titleNumber: string; location: string }
  transaction: any
}

function StatCard({ label, value, Icon, accent }: { label: string; value: number; Icon: any; accent: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}

function Overview() {
  const { jwtToken } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    api.get('/admin/stats', { headers: { Authorization: `Bearer ${jwtToken}` } })
      .then(r => setStats(r.data)).catch(() => {})
  }, [jwtToken])

  if (!stats) {
    return (
      <div className="p-6 flex items-center justify-center text-gray-400 text-sm gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading stats...
      </div>
    )
  }

  const pieData = [
    { name: 'Approved', value: stats.approvedParcels, color: '#10b981' },
    { name: 'Pending', value: stats.pendingParcels, color: '#f59e0b' },
    { name: 'Rejected', value: stats.rejectedParcels, color: '#ef4444' },
  ].filter(d => d.value > 0)

  const barData = [
    { name: 'Users', count: stats.totalUsers },
    { name: 'Parcels', count: stats.totalParcels },
    { name: 'Transfers', count: stats.totalTransactions },
    { name: 'Docs', count: stats.totalDocuments },
  ]

  return (
    <div className="p-6 max-w-6xl">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard label="Total Users" value={stats.totalUsers} Icon={UsersIcon} accent="bg-blue-50 text-blue-600" />
        <StatCard label="Total Parcels" value={stats.totalParcels} Icon={FileText} accent="bg-indigo-50 text-indigo-600" />
        <StatCard label="Transactions" value={stats.totalTransactions} Icon={ArrowRightLeft} accent="bg-purple-50 text-purple-600" />
        <StatCard label="Documents" value={stats.totalDocuments} Icon={Database} accent="bg-green-50 text-green-600" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Pending" value={stats.pendingParcels} Icon={Clock} accent="bg-yellow-50 text-yellow-600" />
        <StatCard label="Approved" value={stats.approvedParcels} Icon={CheckCircle2} accent="bg-green-50 text-green-600" />
        <StatCard label="Rejected" value={stats.rejectedParcels} Icon={XCircle} accent="bg-red-50 text-red-600" />
        <StatCard label="Transfers Done" value={stats.completedTransactions} Icon={TrendingUp} accent="bg-teal-50 text-teal-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-1">Parcel Status</h3>
          <p className="text-xs text-gray-400 mb-4">Distribution by approval state</p>
          <div className="h-64">
            {pieData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-1">System Volume</h3>
          <p className="text-xs text-gray-400 mb-4">Records across the platform</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

function Users() {
  const { jwtToken } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const headers = { Authorization: `Bearer ${jwtToken}` }

  const fetchUsers = () => {
    api.get('/admin/users', { headers }).then(r => setUsers(r.data)).catch(() => {})
  }

  useEffect(() => { fetchUsers() }, [])

  const handleRoleChange = async (id: number, role: string) => {
    try {
      await api.patch(`/admin/users/${id}/role`, { role }, { headers })
      toast.success('Role updated')
      fetchUsers()
    } catch { toast.error('Failed to update role') }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete user ${name}?`)) return
    try {
      await api.delete(`/admin/users/${id}`, { headers })
      toast.success('User deleted')
      fetchUsers()
    } catch { toast.error('Failed to delete user') }
  }

  const handleCreateOfficer = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await api.post('/admin/officers', form, { headers })
      toast.success('Officer created')
      setShowForm(false)
      setForm({ name: '', email: '', password: '' })
      fetchUsers()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed')
    } finally { setLoading(false) }
  }

  const roleColor = (role: string) => ({
    admin: 'bg-purple-100 text-purple-700',
    officer: 'bg-blue-100 text-blue-700',
    landowner: 'bg-green-100 text-green-700',
  } as Record<string, string>)[role] || 'bg-gray-100 text-gray-600'

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <p className="text-gray-500 text-sm">Manage all platform users and roles.</p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Officer
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateOfficer} className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 space-y-4">
          <h3 className="font-medium text-gray-900">New Officer Account</h3>
          <input placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" required />
          <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" required />
          <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" required />
          <button type="submit" disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Creating...' : 'Create Officer'}
          </button>
        </form>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Email</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Role</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Joined</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${roleColor(u.role)}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <select
                        value={u.role}
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
                      >
                        <option value="landowner">landowner</option>
                        <option value="officer">officer</option>
                        <option value="admin">admin</option>
                      </select>
                      <button
                        onClick={() => handleDelete(u.id, u.name)}
                        className="text-xs text-red-500 hover:text-red-700 px-2 py-1 border border-red-200 rounded-lg flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Parcels() {
  const { jwtToken } = useAuth()
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/admin/parcels', { headers: { Authorization: `Bearer ${jwtToken}` } })
      .then(r => setParcels(r.data)).catch(() => {})
  }, [jwtToken])

  const filtered = filter === 'all' ? parcels : parcels.filter(p => p.status === filter)

  const statusColor = (s: string) => ({
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  } as Record<string, string>)[s] || 'bg-gray-100 text-gray-600'

  const handleExport = () => {
    window.open(`${import.meta.env.VITE_API_URL}/admin/export/parcels?token=${jwtToken}`)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <p className="text-gray-500 text-sm">All registered land parcels.</p>
        <div className="flex gap-2">
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[840px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Title</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Location</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Size</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Owner</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">On-Chain</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.titleNumber}</td>
                  <td className="px-4 py-3 text-gray-500">{p.location}</td>
                  <td className="px-4 py-3 text-gray-500">{p.size} acres</td>
                  <td className="px-4 py-3 text-gray-500">{p.ownerships[0]?.user?.name || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColor(p.status)}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {p.blockchainRecords.length > 0
                      ? <span className="text-xs text-green-600 font-mono">{p.blockchainRecords[0].blockHash.slice(0, 10)}...</span>
                      : <span className="text-xs text-gray-400">—</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Transactions() {
  const { jwtToken } = useAuth()
  const [txs, setTxs] = useState<Transaction[]>([])

  useEffect(() => {
    api.get('/admin/transactions', { headers: { Authorization: `Bearer ${jwtToken}` } })
      .then(r => setTxs(r.data)).catch(() => {})
  }, [jwtToken])

  const statusColor = (s: string) => ({
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  } as Record<string, string>)[s] || 'bg-gray-100 text-gray-600'

  return (
    <div className="p-6">
      <p className="text-gray-500 text-sm mb-6">All ownership transactions.</p>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Parcel</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">From</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">To</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {txs.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No transactions yet</td></tr>
              )}
              {txs.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{t.land.titleNumber}</td>
                  <td className="px-4 py-3 text-gray-500">{t.seller.name}</td>
                  <td className="px-4 py-3 text-gray-500">{t.buyer.name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColor(t.status)}`}>{t.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{new Date(t.transactionDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Blockchain() {
  const { jwtToken } = useAuth()
  const [records, setRecords] = useState<BlockchainRecord[]>([])

  useEffect(() => {
    api.get('/admin/blockchain', { headers: { Authorization: `Bearer ${jwtToken}` } })
      .then(r => setRecords(r.data)).catch(() => {})
  }, [jwtToken])

  const contracts = [
    { label: 'LandRegistry', addr: import.meta.env.VITE_LAND_REGISTRY_ADDRESS },
    { label: 'Ownership', addr: import.meta.env.VITE_OWNERSHIP_ADDRESS },
    { label: 'Verification', addr: import.meta.env.VITE_VERIFICATION_ADDRESS },
  ]

  return (
    <div className="p-6">
      <p className="text-gray-500 text-sm mb-6">Last 50 on-chain records and deployed contracts.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {contracts.map(c => (
          <div key={c.label} className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-1">{c.label}</p>
            <p className="text-xs font-mono text-gray-700 break-all">{c.addr || '—'}</p>
            {c.addr && (
              <a href={`https://sepolia.etherscan.io/address/${c.addr}`} target="_blank" rel="noreferrer"
                className="text-xs text-purple-500 hover:underline mt-1 inline-flex items-center gap-1">
                Etherscan <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Block Hash</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Parcel</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Type</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No records yet</td></tr>
              )}
              {records.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <a href={`https://sepolia.etherscan.io/tx/${r.blockHash}`} target="_blank" rel="noreferrer"
                      className="font-mono text-xs text-purple-600 hover:underline inline-flex items-center gap-1">
                      {r.blockHash.slice(0, 18)}...
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{r.land.titleNumber}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${r.transaction ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {r.transaction ? 'Transfer' : 'Registration'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{new Date(r.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Settings() {
  const contracts = [
    { label: 'LandRegistry Contract', addr: import.meta.env.VITE_LAND_REGISTRY_ADDRESS },
    { label: 'Ownership Contract', addr: import.meta.env.VITE_OWNERSHIP_ADDRESS },
    { label: 'Verification Contract', addr: import.meta.env.VITE_VERIFICATION_ADDRESS },
  ]

  return (
    <div className="p-6 max-w-3xl">
      <p className="text-gray-500 text-sm mb-6">Network and contract configuration.</p>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Link2 className="w-4 h-4 text-purple-500" />
          Deployed Contracts — Sepolia
        </h3>
        <div className="space-y-3">
          {contracts.map(c => (
            <div key={c.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-700">{c.label}</p>
                <p className="text-xs font-mono text-gray-500 truncate">{c.addr || '—'}</p>
              </div>
              {c.addr && (
                <a href={`https://sepolia.etherscan.io/address/${c.addr}`} target="_blank" rel="noreferrer"
                  className="text-xs text-purple-500 hover:underline flex items-center gap-1 flex-shrink-0">
                  Etherscan <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-500" />
          Network Info
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Network</span>
            <span className="font-medium text-gray-900">Ethereum Sepolia Testnet</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Chain ID</span>
            <span className="font-medium text-gray-900">11155111</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Database</span>
            <span className="font-medium text-green-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Postgres
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">IPFS</span>
            <span className="font-medium text-gray-900">Pinata</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const titleByPath: Record<string, string> = {
  '/admin': 'System Overview',
  '/admin/users': 'Users',
  '/admin/parcels': 'Parcels',
  '/admin/transactions': 'Transactions',
  '/admin/blockchain': 'Blockchain',
  '/admin/settings': 'Settings',
}

export default function AdminDashboard() {
  const location = useLocation()

  const items = [
    { path: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { path: '/admin/users', label: 'Users', icon: UsersIcon },
    { path: '/admin/parcels', label: 'Parcels', icon: FileText },
    { path: '/admin/transactions', label: 'Transactions', icon: ArrowRightLeft },
    { path: '/admin/blockchain', label: 'Blockchain', icon: Link2 },
    { path: '/admin/settings', label: 'Settings', icon: SettingsIcon },
  ]

  return (
    <DashboardLayout
      items={items}
      brand="Admin Panel"
      subtitle="Land Registry"
      accent="purple"
      title={titleByPath[location.pathname] || 'Admin'}
    >
      <Routes>
        <Route index element={<Overview />} />
        <Route path="users" element={<Users />} />
        <Route path="parcels" element={<Parcels />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="blockchain" element={<Blockchain />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </DashboardLayout>
  )
}
