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
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-500">{label}</span>
        <div className={`${tint} w-9 h-9 rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${text}`} />
        </div>
      </div>
      <p className="text-3xl font-extrabold text-slate-900">{value}</p>
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
  )
}
