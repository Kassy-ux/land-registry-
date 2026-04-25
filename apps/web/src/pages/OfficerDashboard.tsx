import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import {
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineClipboardDocumentCheck,
  HiOutlineArrowRight,
  HiOutlineMapPin,
} from 'react-icons/hi2'
import DashboardLayout from '../components/DashboardLayout'
import StatCard from '../components/StatCard'
import ParcelRow from '../components/ParcelRow'
import EmptyState from '../components/EmptyState'
import emptyTasks from '../assets/illustrations/empty-tasks.svg'
import type { Parcel } from '../types/parcel'

export default function OfficerDashboard() {
  const { logout } = useAuth()
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [actioningId, setActioningId] = useState<number | null>(null)

  const fetchParcels = () => {
    api.get('/parcels').then(r => setParcels(r.data)).catch(() => {})
  }

  useEffect(() => {
    fetchParcels()
  }, [])

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      setActioningId(id)
      await api.patch(`/parcels/${id}/${action}`)
      toast.success(`Parcel ${action}d`)
      fetchParcels()
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : null
      toast.error(message || `Failed to ${action}`)
    } finally {
      setActioningId(null)
    }
  }

  const pending = parcels.filter(p => p.status === 'pending')
  const recentHistory = parcels.filter(p => p.status !== 'pending').slice(0, 4)

  const stats = {
    total: parcels.length,
    approved: parcels.filter(p => p.status === 'approved').length,
    pending: pending.length,
    rejected: parcels.filter(p => p.status === 'rejected').length,
  }

  return (
    <DashboardLayout
      role="officer"
      user={{ label: 'Registry Officer', sub: 'officer@land.ke' }}
      onLogout={logout}
      title="Officer dashboard"
      subtitle="Review pending submissions and maintain registry integrity."
      rightContent={
        <span className="hidden lg:inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl text-xs font-semibold ring-1 ring-emerald-100">
          <HiOutlineClipboardDocumentCheck className="w-4 h-4" />
          {pending.length} pending
        </span>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total parcels" value={stats.total} Icon={HiOutlineDocumentText} tint="bg-blue-50" text="text-blue-600" />
        <StatCard label="Pending review" value={stats.pending} Icon={HiOutlineClock} tint="bg-amber-50" text="text-amber-600" />
        <StatCard label="Approved" value={stats.approved} Icon={HiOutlineCheckCircle} tint="bg-emerald-50" text="text-emerald-600" />
        <StatCard label="Rejected" value={stats.rejected} Icon={HiOutlineXCircle} tint="bg-rose-50" text="text-rose-600" />
      </div>

      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-8">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900">Pending registrations</h2>
            <p className="text-sm text-slate-500">These parcels are awaiting your review.</p>
          </div>
          {pending.length > 3 && (
            <Link
              to="/officer/pending"
              className="inline-flex items-center gap-1 text-sm text-emerald-600 font-semibold hover:gap-2 transition-all"
            >
              View all
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {pending.length === 0 ? (
          <EmptyState
            illustration={emptyTasks}
            title="All caught up"
            description="Great work — there are no pending parcels to review right now."
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {pending.slice(0, 5).map(p => (
              <li key={p.id} className="px-6 py-5 flex items-center gap-5 hover:bg-slate-50/60 transition">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shrink-0">
                  <HiOutlineClock className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate font-mono">{p.titleNumber}</p>
                  <p className="text-sm text-slate-500 truncate flex items-center gap-1">
                    <HiOutlineMapPin className="w-4 h-4 text-slate-400" />
                    {p.location}
                    <span className="mx-1 text-slate-300">·</span>
                    {p.size} acres
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleAction(p.id, 'approve')}
                    disabled={actioningId === p.id}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 shadow-md shadow-emerald-200"
                  >
                    <HiOutlineCheck className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(p.id, 'reject')}
                    disabled={actioningId === p.id}
                    className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-rose-100 disabled:opacity-50 ring-1 ring-rose-200"
                  >
                    <HiOutlineXMark className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900">Recent activity</h2>
            <p className="text-sm text-slate-500">Your latest decisions.</p>
          </div>
          {recentHistory.length > 0 && (
            <Link
              to="/officer/history"
              className="inline-flex items-center gap-1 text-sm text-emerald-600 font-semibold hover:gap-2 transition-all"
            >
              Full history
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {recentHistory.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-slate-400">No history yet</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentHistory.map(p => (
              <ParcelRow key={p.id} parcel={p} linkTo={`/parcels/${p.id}`} />
            ))}
          </ul>
        )}
      </section>
    </DashboardLayout>
  )
}
