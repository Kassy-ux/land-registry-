import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  PlusCircle,
  ArrowRightLeft,
  Search as SearchIcon,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  MapPin,
  Wallet,
} from 'lucide-react'
import api from '../services/api'
import DashboardLayout from '../components/DashboardLayout'
import RegisterLand from './RegisterLand'
import PendingTransfers from '../components/PendingTransfers'
import TransferOwnership from './TransferOwnership'
import SearchRecords from './SearchRecords'
import { useAuth } from '../context/AuthContext'

type LandParcel = {
  id: number
  titleNumber: string
  location: string
  size: number
  createdAt: string
  status: string
}

const items = [
  { path: '/landowner', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/landowner/register', label: 'Register Land', icon: PlusCircle },
  { path: '/landowner/transfer', label: 'Transfer Ownership', icon: ArrowRightLeft },
  { path: '/landowner/search', label: 'Search Records', icon: SearchIcon },
]

const titleByPath: Record<string, string> = {
  '/landowner': 'My Dashboard',
  '/landowner/register': 'Register Land',
  '/landowner/transfer': 'Transfer Ownership',
  '/landowner/search': 'Search Records',
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }
  return map[status?.toLowerCase()] || 'bg-gray-100 text-gray-600'
}

function StatCard({
  label,
  value,
  Icon,
  accent,
}: {
  label: string
  value: number | string
  Icon: any
  accent: string
}) {
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

function Dashboard() {
  const { user, walletAddress } = useAuth()
  const [parcels, setParcels] = useState<LandParcel[]>([])

  useEffect(() => {
    api.get('/parcels').then(r => setParcels(r.data)).catch(() => {})
  }, [])

  const approved = parcels.filter(p => p.status?.toLowerCase() === 'approved').length
  const pending = parcels.filter(p => p.status?.toLowerCase() === 'pending').length
  const rejected = parcels.filter(p => p.status?.toLowerCase() === 'rejected').length

  return (
    <div className="p-6 max-w-6xl">
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h2>
          <p className="text-gray-500 text-sm mt-1">Here's an overview of your land portfolio</p>
        </div>
        {walletAddress && (
          <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-medium">
            <Wallet className="w-3.5 h-3.5" />
            {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Records" value={parcels.length} Icon={FileText} accent="bg-blue-50 text-blue-600" />
        <StatCard label="Approved" value={approved} Icon={CheckCircle2} accent="bg-green-50 text-green-600" />
        <StatCard label="Pending" value={pending} Icon={Clock} accent="bg-yellow-50 text-yellow-600" />
        <StatCard label="Rejected" value={rejected} Icon={XCircle} accent="bg-red-50 text-red-600" />
      </div>

      <PendingTransfers />

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            My Land Properties
          </h3>
          <span className="text-xs text-gray-400">{parcels.length} total</span>
        </div>

        {parcels.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 rounded-2xl mb-3">
              <FileText className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm text-gray-500">No properties registered yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Use the “Register Land” page to add your first parcel
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {parcels.map(p => (
              <div
                key={p.id}
                className="flex items-start sm:items-center justify-between gap-4 p-4 border border-gray-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/30 transition"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{p.titleNumber}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{p.location}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{p.size} acres · ID #{p.id}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusBadge(p.status)}`}>
                    {p.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function LandownerDashboard() {
  const location = useLocation()
  const title = titleByPath[location.pathname] || 'Landowner'

  return (
    <DashboardLayout
      items={items}
      brand="Land Registry"
      subtitle="Landowner"
      accent="indigo"
      title={title}
    >
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="register" element={<RegisterLand />} />
        <Route path="transfer" element={<TransferOwnership />} />
        <Route path="search" element={<SearchRecords />} />
      </Routes>
    </DashboardLayout>
  )
}
