import { useState, useEffect } from 'react'
import api from '../services/api'
import toast, { Toaster } from 'react-hot-toast'
import {
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlineMapPin,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineClipboardDocumentCheck,
} from 'react-icons/hi2'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import emptyTasks from '../assets/illustrations/empty-tasks.svg'

interface Parcel {
  id: number
  titleNumber: string
  location: string
  size: number
  status: string
}

export default function OfficerDashboard() {
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [actioningId, setActioningId] = useState<number | null>(null)

  const fetchParcels = () => {
    api.get('/parcels').then(r => setParcels(r.data)).catch(() => {})
  }

  useEffect(() => {
    fetchParcels()
  }, [])

  const handleApprove = async (id: number) => {
    try {
      setActioningId(id)
      await api.patch(`/parcels/${id}/approve`)
      toast.success('Parcel approved')
      fetchParcels()
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : null
      toast.error(message || 'Failed to approve')
    } finally {
      setActioningId(null)
    }
  }

  const handleReject = async (id: number) => {
    try {
      setActioningId(id)
      await api.patch(`/parcels/${id}/reject`)
      toast.success('Parcel rejected')
      fetchParcels()
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : null
      toast.error(message || 'Failed to reject')
    } finally {
      setActioningId(null)
    }
  }

  const pending = parcels.filter(p => p.status === 'pending')
  const history = parcels.filter(p => p.status !== 'pending')

  const stats = {
    total: parcels.length,
    approved: parcels.filter(p => p.status === 'approved').length,
    pending: pending.length,
    rejected: parcels.filter(p => p.status === 'rejected').length,
  }

  const logout = () => {
    localStorage.removeItem('jwt_token')
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Toaster position="top-right" />
      <Sidebar
        role="officer"
        user={{ label: 'Registry Officer', sub: 'officer@land.ke' }}
        onLogout={logout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          title="Officer dashboard"
          subtitle="Review pending submissions and maintain registry integrity."
          rightContent={
            <span className="hidden lg:inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl text-xs font-semibold ring-1 ring-emerald-100">
              <HiOutlineClipboardDocumentCheck className="w-4 h-4" />
              {pending.length} pending
            </span>
          }
        />

        <main className="flex-1 p-6 lg:p-10 overflow-auto space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total parcels"
              value={stats.total}
              Icon={HiOutlineDocumentText}
              tint="bg-blue-50"
              text="text-blue-600"
            />
            <StatCard
              label="Pending review"
              value={stats.pending}
              Icon={HiOutlineClock}
              tint="bg-amber-50"
              text="text-amber-600"
            />
            <StatCard
              label="Approved"
              value={stats.approved}
              Icon={HiOutlineCheckCircle}
              tint="bg-emerald-50"
              text="text-emerald-600"
            />
            <StatCard
              label="Rejected"
              value={stats.rejected}
              Icon={HiOutlineXCircle}
              tint="bg-rose-50"
              text="text-rose-600"
            />
          </div>

          {/* Pending */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Pending registrations</h2>
              <p className="text-sm text-slate-500">
                These parcels are awaiting your review.
              </p>
            </div>

            {pending.length === 0 ? (
              <div className="text-center py-14 px-6">
                <img
                  src={emptyTasks}
                  alt="All caught up"
                  className="mx-auto h-48 w-auto object-contain mb-6"
                />
                <h3 className="font-bold text-slate-900 mb-1">All caught up</h3>
                <p className="text-sm text-slate-500">
                  Great work — there are no pending parcels to review right now.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {pending.map(p => (
                  <li
                    key={p.id}
                    className="px-6 py-5 flex items-center gap-5 hover:bg-slate-50/60 transition"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shrink-0">
                      <HiOutlineClock className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate font-mono">
                        {p.titleNumber}
                      </p>
                      <p className="text-sm text-slate-500 truncate flex items-center gap-1">
                        <HiOutlineMapPin className="w-4 h-4 text-slate-400" />
                        {p.location}
                        <span className="mx-1 text-slate-300">·</span>
                        {p.size} acres
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleApprove(p.id)}
                        disabled={actioningId === p.id}
                        className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 shadow-md shadow-emerald-200"
                      >
                        <HiOutlineCheck className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(p.id)}
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

          {/* History */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">History</h2>
              <p className="text-sm text-slate-500">
                Previously approved or rejected parcels.
              </p>
            </div>

            {history.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-slate-400">
                No history yet
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {history.map(p => {
                  const approved = p.status === 'approved'
                  const cfg = approved
                    ? {
                        bg: 'bg-emerald-50',
                        text: 'text-emerald-700',
                        ring: 'ring-emerald-200',
                        Icon: HiOutlineCheckCircle,
                      }
                    : {
                        bg: 'bg-rose-50',
                        text: 'text-rose-700',
                        ring: 'ring-rose-200',
                        Icon: HiOutlineXCircle,
                      }
                  return (
                    <li
                      key={p.id}
                      className="px-6 py-5 flex items-center gap-5 hover:bg-slate-50/60 transition"
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 ${
                          approved
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                            : 'bg-gradient-to-br from-rose-500 to-pink-600'
                        }`}
                      >
                        <cfg.Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate font-mono">
                          {p.titleNumber}
                        </p>
                        <p className="text-sm text-slate-500 truncate flex items-center gap-1">
                          <HiOutlineMapPin className="w-4 h-4 text-slate-400" />
                          {p.location}
                          <span className="mx-1 text-slate-300">·</span>
                          {p.size} acres
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 ${cfg.bg} ${cfg.text} px-3 py-1.5 rounded-full text-xs font-bold ring-1 ${cfg.ring}`}
                      >
                        <cfg.Icon className="w-3.5 h-3.5" />
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </main>
      </div>
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
