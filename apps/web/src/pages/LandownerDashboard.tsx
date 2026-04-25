import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast, { Toaster } from 'react-hot-toast'
import {
  HiOutlinePlus,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlineMapPin,
  HiOutlineSquaresPlus,
  HiOutlineArrowTrendingUp,
  HiOutlineXMark,
} from 'react-icons/hi2'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import emptyData from '../assets/illustrations/empty-data.svg'

interface LandParcel {
  id: number
  titleNumber: string
  location: string
  size: number
  status: string
  createdAt: string
}

export default function LandownerDashboard() {
  const { walletAddress, logout } = useAuth()
  const [parcels, setParcels] = useState<LandParcel[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ titleNumber: '', location: '', size: '' })

  const fetchParcels = () => {
    api.get('/parcels').then(r => setParcels(r.data)).catch(() => {})
  }

  useEffect(() => {
    fetchParcels()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await api.post('/parcels', {
        ...form,
        size: Number(form.size),
        ownerAddress: walletAddress,
        ipfsHash: '',
      })
      toast.success('Parcel submitted for approval')
      setShowForm(false)
      setForm({ titleNumber: '', location: '', size: '' })
      fetchParcels()
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : null
      toast.error(message || 'Failed to submit')
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: parcels.length,
    approved: parcels.filter(p => p.status === 'approved').length,
    pending: parcels.filter(p => p.status === 'pending').length,
    rejected: parcels.filter(p => p.status === 'rejected').length,
  }

  const userLabel = walletAddress
    ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
    : 'Landowner'

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Toaster position="top-right" />
      <Sidebar
        role="landowner"
        user={{ label: 'Landowner', sub: userLabel }}
        onLogout={logout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          title="Welcome back"
          subtitle="Manage your registered parcels and submit new ones."
          rightContent={
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-200"
            >
              <HiOutlinePlus className="w-4 h-4" />
              Register parcel
            </button>
          }
        />

        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total parcels"
              value={stats.total}
              Icon={HiOutlineDocumentText}
              tint="bg-blue-50"
              text="text-blue-600"
            />
            <StatCard
              label="Approved"
              value={stats.approved}
              Icon={HiOutlineCheckCircle}
              tint="bg-emerald-50"
              text="text-emerald-600"
            />
            <StatCard
              label="Pending"
              value={stats.pending}
              Icon={HiOutlineClock}
              tint="bg-amber-50"
              text="text-amber-600"
            />
            <StatCard
              label="Rejected"
              value={stats.rejected}
              Icon={HiOutlineXCircle}
              tint="bg-rose-50"
              text="text-rose-600"
            />
          </div>

          {/* Parcels */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">My parcels</h2>
                <p className="text-sm text-slate-500">
                  Track each registration and its on-chain status.
                </p>
              </div>
              <span className="text-xs text-slate-400 inline-flex items-center gap-1">
                <HiOutlineArrowTrendingUp className="w-4 h-4" />
                Live updates
              </span>
            </div>

            {parcels.length === 0 ? (
              <div className="text-center py-14 px-6">
                <img
                  src={emptyData}
                  alt="No parcels yet"
                  className="mx-auto h-48 w-auto object-contain mb-6"
                />
                <h3 className="font-bold text-slate-900 mb-1">No parcels registered yet</h3>
                <p className="text-sm text-slate-500 mb-5">
                  Submit your first land parcel to get it reviewed and recorded on-chain.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-200"
                >
                  <HiOutlinePlus className="w-4 h-4" />
                  Register your first parcel
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {parcels.map(p => (
                  <ParcelRow key={p.id} parcel={p} />
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>

      {/* Slide-over form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />
          <div className="ml-auto h-full w-full max-w-md bg-white shadow-2xl relative flex flex-col animate-in slide-in-from-right">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Register a new parcel</h3>
                <p className="text-sm text-slate-500">
                  Submit details for officer review.
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6 space-y-4">
              <Field
                label="Title number"
                hint="Unique identifier (e.g. KSM/001)"
                Icon={HiOutlineDocumentText}
              >
                <input
                  placeholder="KSM/001"
                  value={form.titleNumber}
                  onChange={e => setForm({ ...form, titleNumber: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </Field>
              <Field label="Location" Icon={HiOutlineMapPin}>
                <input
                  placeholder="Kisumu County"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </Field>
              <Field label="Size (acres)" Icon={HiOutlineSquaresPlus}>
                <input
                  placeholder="2.5"
                  type="number"
                  step="0.01"
                  value={form.size}
                  onChange={e => setForm({ ...form, size: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </Field>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-900">
                Once submitted, the parcel will be marked <strong>pending</strong> until an
                officer reviews and approves it.
              </div>
            </form>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 shadow-md shadow-blue-200"
              >
                {loading ? 'Submitting...' : 'Submit for approval'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  Icon,
  tint,
  text,
}: {
  label: string
  value: number
  Icon: React.ComponentType<{ className?: string }>
  tint: string
  text: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-500">{label}</span>
        <div className={`${tint} w-9 h-9 rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${text}`} />
        </div>
      </div>
      <p className="text-3xl font-extrabold text-slate-900">{value}</p>
    </div>
  )
}

function ParcelRow({ parcel }: { parcel: LandParcel }) {
  const cfg =
    parcel.status === 'approved'
      ? {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          ring: 'ring-emerald-200',
          Icon: HiOutlineCheckCircle,
        }
      : parcel.status === 'rejected'
      ? {
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          ring: 'ring-rose-200',
          Icon: HiOutlineXCircle,
        }
      : {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          ring: 'ring-amber-200',
          Icon: HiOutlineClock,
        }

  return (
    <li className="px-6 py-5 flex items-center gap-5 hover:bg-slate-50/60 transition">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0">
        <HiOutlineDocumentText className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-900 truncate font-mono">{parcel.titleNumber}</p>
        <p className="text-sm text-slate-500 truncate flex items-center gap-1">
          <HiOutlineMapPin className="w-4 h-4 text-slate-400" />
          {parcel.location}
          <span className="mx-1 text-slate-300">·</span>
          {parcel.size} acres
        </p>
      </div>
      <span
        className={`inline-flex items-center gap-1.5 ${cfg.bg} ${cfg.text} px-3 py-1.5 rounded-full text-xs font-bold ring-1 ${cfg.ring}`}
      >
        <cfg.Icon className="w-3.5 h-3.5" />
        {parcel.status.charAt(0).toUpperCase() + parcel.status.slice(1)}
      </span>
    </li>
  )
}

function Field({
  label,
  hint,
  Icon,
  children,
}: {
  label: string
  hint?: string
  Icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
        {children}
      </div>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
