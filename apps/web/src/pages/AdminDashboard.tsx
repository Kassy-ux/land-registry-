import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast, { Toaster } from 'react-hot-toast'

type Tab = 'overview' | 'users' | 'parcels' | 'transactions' | 'blockchain' | 'settings'

type Stats = {
  totalUsers: number; totalParcels: number; totalTransactions: number
  totalDocuments: number; pendingParcels: number; approvedParcels: number
  rejectedParcels: number; completedTransactions: number
}

type User = { id: number; name: string; email: string; role: string; createdAt: string }
type Parcel = { id: number; titleNumber: string; location: string; size: number; status: string; createdAt: string; ownerships: any[]; blockchainRecords: any[] }
type Transaction = { id: number; status: string; transactionDate: string; land: { titleNumber: string; location: string }; seller: { name: string }; buyer: { name: string } }
type BlockchainRecord = { id: number; blockHash: string; timestamp: string; land: { titleNumber: string; location: string }; transaction: any }

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-lg`}>{icon}</div>
      </div>
    </div>
  )
}

function Overview({ stats }: { stats: Stats | null }) {
  if (!stats) return <div className="p-6 text-gray-400">Loading...</div>
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">System Overview</h2>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={stats.totalUsers} color="bg-blue-50" icon="👥" />
        <StatCard label="Total Parcels" value={stats.totalParcels} color="bg-indigo-50" icon="📋" />
        <StatCard label="Total Transactions" value={stats.totalTransactions} color="bg-purple-50" icon="🔄" />
        <StatCard label="Documents" value={stats.totalDocuments} color="bg-green-50" icon="📄" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Pending Parcels" value={stats.pendingParcels} color="bg-yellow-50" icon="⏳" />
        <StatCard label="Approved Parcels" value={stats.approvedParcels} color="bg-green-50" icon="✅" />
        <StatCard label="Rejected Parcels" value={stats.rejectedParcels} color="bg-red-50" icon="❌" />
        <StatCard label="Completed Transfers" value={stats.completedTransactions} color="bg-teal-50" icon="✓" />
      </div>
    </div>
  )
}

function Users({ token }: { token: string }) {
  const [users, setUsers] = useState<User[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const fetchUsers = () => {
    api.get('/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setUsers(r.data)).catch(() => {})
  }

  useEffect(() => { fetchUsers() }, [])

  const handleRoleChange = async (id: number, role: string) => {
    try {
      await api.patch(`/admin/users/${id}/role`, { role }, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Role updated')
      fetchUsers()
    } catch { toast.error('Failed to update role') }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete user ${name}?`)) return
    try {
      await api.delete(`/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('User deleted')
      fetchUsers()
    } catch { toast.error('Failed to delete user') }
  }

  const handleCreateOfficer = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await api.post('/admin/officers', form, { headers: { Authorization: `Bearer ${token}` } })
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
    landowner: 'bg-green-100 text-green-700'
  }[role] || 'bg-gray-100 text-gray-600')

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">User Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700">
          + Create Officer
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateOfficer} className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 space-y-4">
          <h3 className="font-medium text-gray-900">New Officer Account</h3>
          <input placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Officer'}
          </button>
        </form>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
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
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${roleColor(u.role)}`}>{u.role}</span>
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
                    <button onClick={() => handleDelete(u.id, u.name)}
                      className="text-xs text-red-500 hover:text-red-700 px-2 py-1 border border-red-200 rounded-lg">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Parcels({ token }: { token: string }) {
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/admin/parcels', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setParcels(r.data)).catch(() => {})
  }, [])

  const filtered = filter === 'all' ? parcels : parcels.filter(p => p.status === filter)

  const statusColor = (s: string) => ({
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700'
  }[s] || 'bg-gray-100 text-gray-600')

  const handleExport = () => {
    window.open(`${import.meta.env.VITE_API_URL}/admin/export/parcels?token=${token}`)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Land Parcels</h2>
        <div className="flex gap-2">
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700">
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Title Number</th>
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
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(p.status)}`}>{p.status}</span>
                </td>
                <td className="px-4 py-3">
                  {p.blockchainRecords.length > 0
                    ? <span className="text-xs text-green-600 font-mono">{p.blockchainRecords[0].blockHash.slice(0,10)}...</span>
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
  )
}

function Transactions({ token }: { token: string }) {
  const [txs, setTxs] = useState<Transaction[]>([])

  useEffect(() => {
    api.get('/admin/transactions', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setTxs(r.data)).catch(() => {})
  }, [])

  const statusColor = (s: string) => ({
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700'
  }[s] || 'bg-gray-100 text-gray-600')

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">All Transactions</h2>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
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
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(t.status)}`}>{t.status}</span>
                </td>
                <td className="px-4 py-3 text-gray-400">{new Date(t.transactionDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Blockchain({ token }: { token: string }) {
  const [records, setRecords] = useState<BlockchainRecord[]>([])

  useEffect(() => {
    api.get('/admin/blockchain', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setRecords(r.data)).catch(() => {})
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Blockchain Monitor</h2>
      <p className="text-gray-400 text-sm mb-6">Last 50 on-chain records</p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'LandRegistry', addr: import.meta.env.VITE_LAND_REGISTRY_ADDRESS },
          { label: 'Ownership', addr: import.meta.env.VITE_OWNERSHIP_ADDRESS },
          { label: 'Verification', addr: import.meta.env.VITE_VERIFICATION_ADDRESS },
        ].map(c => (
          <div key={c.label} className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-1">{c.label}</p>
            <p className="text-xs font-mono text-gray-700 break-all">{c.addr}</p>
            <a href={`https://sepolia.etherscan.io/address/${c.addr}`} target="_blank" rel="noreferrer"
              className="text-xs text-indigo-500 hover:underline mt-1 inline-block">
              View on Etherscan →
            </a>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
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
                    className="font-mono text-xs text-indigo-600 hover:underline">
                    {r.blockHash.slice(0,18)}...
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
  )
}

function Settings({ token }: { token: string }) {
  const contracts = [
    { label: 'LandRegistry Contract', addr: import.meta.env.VITE_LAND_REGISTRY_ADDRESS },
    { label: 'Ownership Contract', addr: import.meta.env.VITE_OWNERSHIP_ADDRESS },
    { label: 'Verification Contract', addr: import.meta.env.VITE_VERIFICATION_ADDRESS },
  ]

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900 mb-6">System Settings</h2>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Deployed Contracts — Sepolia</h3>
        <div className="space-y-3">
          {contracts.map(c => (
            <div key={c.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-700">{c.label}</p>
                <p className="text-xs font-mono text-gray-500">{c.addr}</p>
              </div>
              <a href={`https://sepolia.etherscan.io/address/${c.addr}`} target="_blank" rel="noreferrer"
                className="text-xs text-indigo-500 hover:underline">
                Etherscan →
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Network Info</h3>
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
            <span className="font-medium text-green-600">Neon Postgres ✓</span>
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

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: '⊞' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'parcels', label: 'Parcels', icon: '📋' },
  { id: 'transactions', label: 'Transactions', icon: '🔄' },
  { id: 'blockchain', label: 'Blockchain', icon: '⛓' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
]

export default function AdminDashboard() {
  const { jwtToken, user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    api.get('/admin/stats', { headers: { Authorization: `Bearer ${jwtToken}` } })
      .then(r => setStats(r.data)).catch(() => {})
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster />
      <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-bold">AD</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Admin Panel</p>
              <p className="text-gray-400 text-xs">Land Registry</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition text-left ${
                activeTab === tab.id
                  ? 'bg-purple-50 text-purple-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
            <button onClick={logout} className="text-xs text-red-400 hover:text-red-600">Logout</button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          <h1 className="font-semibold text-gray-900">
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>
        </header>
        <div className="flex-1 overflow-auto">
          {activeTab === 'overview' && <Overview stats={stats} />}
          {activeTab === 'users' && <Users token={jwtToken!} />}
          {activeTab === 'parcels' && <Parcels token={jwtToken!} />}
          {activeTab === 'transactions' && <Transactions token={jwtToken!} />}
          {activeTab === 'blockchain' && <Blockchain token={jwtToken!} />}
          {activeTab === 'settings' && <Settings token={jwtToken!} />}
        </div>
      </div>
    </div>
  )
}
