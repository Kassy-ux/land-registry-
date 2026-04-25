interface Props {
  label: string
  value: number | string
  Icon: React.ComponentType<{ className?: string }>
  tint: string
  text: string
  hint?: string
}

export default function StatCard({ label, value, Icon, tint, text, hint }: Props) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <span className="text-xs sm:text-sm text-slate-500 truncate">{label}</span>
        <div className={`${tint} w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${text}`} />
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{value}</p>
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
  )
}
