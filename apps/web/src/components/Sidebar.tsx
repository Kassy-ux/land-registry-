import { NavLink, useNavigate } from 'react-router-dom'
import {
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlineArrowRightOnRectangle,
  HiOutlineQuestionMarkCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineClipboardDocumentCheck,
  HiOutlineClock,
} from 'react-icons/hi2'
import Logo from './Logo'

export interface SidebarItem {
  to: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}

interface Props {
  role: 'landowner' | 'officer'
  user: { label: string; sub: string }
  onLogout: () => void
}

const ITEMS: Record<'landowner' | 'officer', SidebarItem[]> = {
  landowner: [
    { to: '/landowner', icon: HiOutlineHome, label: 'Overview' },
    { to: '/landowner/parcels', icon: HiOutlineDocumentText, label: 'My Parcels' },
    { to: '/verify', icon: HiOutlineMagnifyingGlass, label: 'Verify Parcel' },
  ],
  officer: [
    { to: '/officer', icon: HiOutlineHome, label: 'Overview' },
    { to: '/officer/pending', icon: HiOutlineClipboardDocumentCheck, label: 'Pending Reviews' },
    { to: '/officer/history', icon: HiOutlineClock, label: 'History' },
    { to: '/verify', icon: HiOutlineMagnifyingGlass, label: 'Verify Parcel' },
  ],
}

export default function Sidebar({ role, user, onLogout }: Props) {
  const navigate = useNavigate()
  const items = ITEMS[role]

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="p-5 border-b border-slate-100">
        <button onClick={() => navigate('/')} className="cursor-pointer">
          <Logo size="md" />
        </button>
      </div>

      <div className="flex-1 px-3 py-5">
        <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
          Main Menu
        </p>
        <nav className="space-y-1">
          {items.map(item => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase mt-8 mb-2">
          Support
        </p>
        <nav className="space-y-1">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <HiOutlineQuestionMarkCircle className="w-5 h-5" />
            Help & Support
          </button>
        </nav>
      </div>

      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
            {user.label.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user.label}</p>
            <p className="text-xs text-slate-500 truncate font-mono">{user.sub}</p>
          </div>
          <button
            onClick={onLogout}
            title="Logout"
            className="text-slate-400 hover:text-rose-500 transition"
          >
            <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
