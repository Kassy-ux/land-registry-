import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { HiOutlineMagnifyingGlass, HiOutlineFunnel } from 'react-icons/hi2'
import DashboardLayout from '../components/DashboardLayout'
import ParcelRow from '../components/ParcelRow'
import EmptyState from '../components/EmptyState'
import emptyTasks from '../assets/illustrations/empty-tasks.svg'
import type { Parcel } from '../types/parcel'

type Filter = 'all' | 'approved' | 'rejected'

export default function HistoryPage() {
  const { logout } = useAuth()
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/parcels').then(r => setParcels(r.data)).catch(() => {})
  }, [])

  const history = useMemo(() => {
    return parcels
      .filter(p => p.status !== 'pending')
      .filter(p => (filter === 'all' ? true : p.status === filter))
      .filter(p =>
        search
          ? `${p.titleNumber} ${p.location}`.toLowerCase().includes(search.toLowerCase())
          : true
      )
  }, [parcels, filter, search])

  return (
    <DashboardLayout
      role="officer"
      user={{ label: 'Registry Officer', sub: 'officer@land.ke' }}
      onLogout={logout}
      title="Decision history"
      subtitle={`${history.length} record${history.length === 1 ? '' : 's'}`}
    >
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search history..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl">
            <HiOutlineFunnel className="w-4 h-4 text-slate-400 ml-2" />
            {(['all', 'approved', 'rejected'] as Filter[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  filter === f
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {history.length === 0 ? (
          <EmptyState
            illustration={emptyTasks}
            title="No history yet"
            description="Approved and rejected parcels will show up here."
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {history.map(p => (
              <ParcelRow key={p.id} parcel={p} linkTo={`/parcels/${p.id}`} />
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  )
}
