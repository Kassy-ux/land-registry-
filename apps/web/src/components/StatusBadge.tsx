import {
  HiOutlineCheckBadge,
  HiOutlineClock,
  HiOutlineXCircle,
} from 'react-icons/hi2'

interface Props {
  status: string
  size?: 'sm' | 'md'
}

const CONFIG: Record<string, { bg: string; text: string; ring: string; Icon: React.ComponentType<{ className?: string }> }> = {
  approved: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    ring: 'ring-emerald-200',
    Icon: HiOutlineCheckBadge,
  },
  rejected: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    ring: 'ring-rose-200',
    Icon: HiOutlineXCircle,
  },
  pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    ring: 'ring-amber-200',
    Icon: HiOutlineClock,
  },
}

export default function StatusBadge({ status, size = 'sm' }: Props) {
  const cfg = CONFIG[status] ?? CONFIG.pending
  const dims = size === 'md' ? 'px-3 py-1.5 text-xs' : 'px-2.5 py-1 text-[11px]'
  const icon = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5'
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${cfg.bg} ${cfg.text} ${dims} rounded-full font-bold ring-1 ${cfg.ring}`}
    >
      <cfg.Icon className={icon} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
