import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import {
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineCalendar,
} from 'react-icons/hi2'
import DashboardLayout from '../components/DashboardLayout'
import EmptyState from '../components/EmptyState'
import emptyTasks from '../assets/illustrations/empty-tasks.svg'
import type { Parcel } from '../types/parcel'

export default function PendingReviewsPage() {
  const { logout } = useAuth()
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [actioningId, setActioningId] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  const fetchParcels = () => {
    api.get('/parcels').then(r => setParcels(r.data)).catch(() => {})
  }

  useEffect(() => {
    fetchParcels()
  }, [])

  const pending = useMemo(
    () =>
      parcels
        .filter(p => p.status === 'pending')
        .filter(p =>
          search
            ? `${p.titleNumber} ${p.location}`.toLowerCase().includes(search.toLowerCase())
            : true
        ),
    [parcels, search]
  )

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

  return (
    <DashboardLayout
      role="officer"
      user={{ label: 'Registry Officer', sub: 'officer@land.ke' }}
      onLogout={logout}
      title="Pending reviews"
      subtitle={`${pending.length} submission${pending.length === 1 ? '' : 's'} awaiting your decision`}
    >
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="relative max-w-md">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search pending parcels..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {pending.length === 0 ? (
          <EmptyState
            illustration={emptyTasks}
            title="All caught up"
            description="No pending registrations are waiting for your review."
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {pending.map(p => (
              <li key={p.id} className="p-6 flex flex-col md:flex-row md:items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shrink-0">
                  <HiOutlineClock className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate font-mono">{p.titleNumber}</p>
                  <p className="text-sm text-slate-500 truncate flex items-center gap-1 mt-0.5">
                    <HiOutlineMapPin className="w-4 h-4 text-slate-400" />
                    {p.location}
                    <span className="mx-1 text-slate-300">·</span>
                    {p.size} acres
                  </p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <HiOutlineCalendar className="w-3.5 h-3.5" />
                    Submitted {new Date(p.createdAt).toLocaleDateString()}
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
      </div>
    </DashboardLayout>
  )
}
