import { HiOutlineBell, HiOutlineMagnifyingGlass } from 'react-icons/hi2'

interface Props {
  title: string
  subtitle?: string
  rightContent?: React.ReactNode
}

export default function TopBar({ title, subtitle, rightContent }: Props) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 lg:px-10 py-5 flex items-center gap-6">
      <div className="flex-1 min-w-0">
        <h1 className="text-xl lg:text-2xl font-bold text-slate-900 truncate">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="hidden md:flex items-center gap-3">
        <div className="relative">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 w-56 lg:w-72 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <button className="relative w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
          <HiOutlineBell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-rose-500" />
        </button>
        {rightContent}
      </div>
    </div>
  )
}
