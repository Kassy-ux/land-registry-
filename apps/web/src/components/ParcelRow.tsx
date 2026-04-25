import { Link } from 'react-router-dom'
import {
  HiOutlineDocumentText,
  HiOutlineMapPin,
  HiOutlineChevronRight,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from 'react-icons/hi2'
import StatusBadge from './StatusBadge'

interface Parcel {
  id: number
  titleNumber: string
  location: string
  size: number
  status: string
}

interface Props {
  parcel: Parcel
  rightSlot?: React.ReactNode
  showStatus?: boolean
  linkTo?: string
}

const ICON_BY_STATUS: Record<string, { Icon: React.ComponentType<{ className?: string }>; gradient: string }> = {
  approved: {
    Icon: HiOutlineCheckCircle,
    gradient: 'from-emerald-500 to-teal-600',
  },
  rejected: {
    Icon: HiOutlineXCircle,
    gradient: 'from-rose-500 to-pink-600',
  },
  pending: {
    Icon: HiOutlineClock,
    gradient: 'from-amber-400 to-orange-500',
  },
}

export default function ParcelRow({ parcel, rightSlot, showStatus = true, linkTo }: Props) {
  const cfg = ICON_BY_STATUS[parcel.status] ?? {
    Icon: HiOutlineDocumentText,
    gradient: 'from-blue-500 to-indigo-600',
  }
  const content = (
    <>
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white shrink-0`}
      >
        <cfg.Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm sm:text-base font-bold text-slate-900 truncate font-mono">{parcel.titleNumber}</p>
        <p className="text-xs sm:text-sm text-slate-500 truncate flex items-center gap-1">
          <HiOutlineMapPin className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
          {parcel.location}
          <span className="hidden sm:inline mx-1 text-slate-300">·</span>
          <span className="hidden sm:inline">{parcel.size} acres</span>
        </p>
      </div>
      {rightSlot}
      {showStatus && <StatusBadge status={parcel.status} size="md" />}
      {linkTo && <HiOutlineChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />}
    </>
  )

  if (linkTo) {
    return (
      <Link
        to={linkTo}
        className="px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-3 sm:gap-5 hover:bg-slate-50/60 transition"
      >
        {content}
      </Link>
    )
  }
  return <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-3 sm:gap-5 hover:bg-slate-50/60 transition">{content}</div>
}
