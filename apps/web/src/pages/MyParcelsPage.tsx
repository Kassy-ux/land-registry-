import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import {
  HiOutlineDocumentText,
  HiOutlineFunnel,
  HiOutlineMagnifyingGlass,
} from 'react-icons/hi2'
import DashboardLayout from '../components/DashboardLayout'
import ParcelRow from '../components/ParcelRow'
import EmptyState from '../components/EmptyState'
import emptyData from '../assets/illustrations/empty-data.svg'
import type { Parcel } from '../types/parcel'

type Filter = 'all' | 'pending' | 'approved' | 'rejected'

export default function MyParcelsPage() {
  const { walletAddress, logout } = useAuth()
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/parcels').then(r => setParcels(r.data)).catch(() => {})
  }, [])

  const mine = useMemo(() => {
    if (!walletAddress) return []
    const wa = walletAddress.toLowerCase()
    return parcels.filter(p =>
      p.ownerships?.some(o => o.user.walletAddress?.toLowerCase() === wa)
    )
  }, [parcels, walletAddress])

  const filtered = useMemo(() => {
    return mine.filter(p => {
      if (filter !== 'all' && p.status !== filter) return false
      if (search && !`${p.titleNumber} ${p.location}`.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [mine, filter, search])

  const userLabel = walletAddress
    ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
    : 'Landowner'

  return (
    <DashboardLayout
      role="landowner"
      user={{ label: 'Landowner', sub: userLabel }}
      onLogout={logout}
      title="My parcels"
      subtitle={`${mine.length} parcel${mine.length === 1 ? '' : 's'} registered to your wallet`}
    >
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search title number or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl overflow-x-auto">
            <HiOutlineFunnel className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
            {(['all', 'pending', 'approved', 'rejected'] as Filter[]).map(f => (
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

        {filtered.length === 0 ? (
          <EmptyState
            illustration={emptyData}
            title={mine.length === 0 ? 'No parcels yet' : 'No matches'}
            description={
              mine.length === 0
                ? 'Head back to your overview to register your first parcel.'
                : 'Try a different filter or search term.'
            }
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map(p => (
              <ParcelRow key={p.id} parcel={p} linkTo={`/parcels/${p.id}`} />
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 sm:mt-6 bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 flex items-start sm:items-center gap-3 sm:gap-4">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <HiOutlineDocumentText className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-slate-900 text-xs sm:text-sm">Click any parcel for details</p>
          <p className="text-xs sm:text-sm text-slate-500">
            View its on-chain record, attached documents, and full transfer history.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
