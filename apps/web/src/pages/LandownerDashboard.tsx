import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import {
  HiOutlinePlus,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlineMapPin,
  HiOutlineSquaresPlus,
  HiOutlineArrowRight,
  HiOutlineXMark,
} from 'react-icons/hi2'
import DashboardLayout from '../components/DashboardLayout'
import StatCard from '../components/StatCard'
import ParcelRow from '../components/ParcelRow'
import EmptyState from '../components/EmptyState'
import emptyData from '../assets/illustrations/empty-data.svg'
import type { Parcel } from '../types/parcel'

export default function LandownerDashboard() {
  const { walletAddress, logout } = useAuth()
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ titleNumber: '', location: '', size: '' })

  const fetchParcels = () => {
    api.get('/parcels').then(r => setParcels(r.data)).catch(() => {})
  }

  useEffect(() => {
    fetchParcels()
  }, [])

  const mine = useMemo(() => {
    if (!walletAddress) return []
    const wa = walletAddress.toLowerCase()
    return parcels.filter(p =>
      p.ownerships?.some(o => o.user.walletAddress?.toLowerCase() === wa)
    )
  }, [parcels, walletAddress])

  const recent = mine.slice(0, 5)

  const stats = {
    total: mine.length,
    approved: mine.filter(p => p.status === 'approved').length,
    pending: mine.filter(p => p.status === 'pending').length,
    rejected: mine.filter(p => p.status === 'rejected').length,
  }

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

  const userLabel = walletAddress
    ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
    : 'Landowner'

  return (
    <DashboardLayout
      role="landowner"
      user={{ label: 'Landowner', sub: userLabel }}
      onLogout={logout}
      title="Welcome back"
      subtitle="Manage your registered parcels and submit new ones."
      rightContent={
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1.5 sm:gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-200 transition-all"
        >
          <HiOutlinePlus className="w-4 h-4" />
          <span className="hidden sm:inline">Register parcel</span>
          <span className="sm:hidden">Register</span>
        </button>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard label="Total parcels" value={stats.total} Icon={HiOutlineDocumentText} tint="bg-blue-50" text="text-blue-600" />
        <StatCard label="Approved" value={stats.approved} Icon={HiOutlineCheckCircle} tint="bg-emerald-50" text="text-emerald-600" />
        <StatCard label="Pending" value={stats.pending} Icon={HiOutlineClock} tint="bg-amber-50" text="text-amber-600" />
        <StatCard label="Rejected" value={stats.rejected} Icon={HiOutlineXCircle} tint="bg-rose-50" text="text-rose-600" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900">Recent parcels</h2>
            <p className="text-sm text-slate-500">Your most recent registrations.</p>
          </div>
          {mine.length > 0 && (
            <Link
              to="/landowner/parcels"
              className="inline-flex items-center gap-1 text-sm text-blue-600 font-semibold hover:gap-2 transition-all"
            >
              View all
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {recent.length === 0 ? (
          <EmptyState
            illustration={emptyData}
            title="No parcels registered yet"
            description="Submit your first land parcel to get it reviewed and recorded on-chain."
            action={
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-200"
              >
                <HiOutlinePlus className="w-4 h-4" />
                Register your first parcel
              </button>
            }
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {recent.map(p => (
              <ParcelRow key={p.id} parcel={p} linkTo={`/parcels/${p.id}`} />
            ))}
          </ul>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />
          <div className="ml-auto h-full w-full max-w-md bg-white shadow-2xl relative flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Register a new parcel</h3>
                <p className="text-sm text-slate-500">Submit details for officer review.</p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6 space-y-4">
              <Field label="Title number" hint="Unique identifier (e.g. KSM/001)" Icon={HiOutlineDocumentText}>
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
                Once submitted, the parcel is marked <strong>pending</strong> until an officer reviews
                and approves it.
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
    </DashboardLayout>
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
