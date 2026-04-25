import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { HiOutlineBars3, HiOutlineXMark, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import WalletBadge from './WalletBadge'
import Logo from './Logo'
import {
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlineMagnifyingGlass,
  HiOutlineClipboardDocumentCheck,
  HiOutlineClock,
  HiOutlineQuestionMarkCircle,
} from 'react-icons/hi2'

interface MenuItem {
  to: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}

const ITEMS: Record<'landowner' | 'officer', MenuItem[]> = {
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

interface Props {
  role: 'landowner' | 'officer'
  user: { label: string; sub: string }
  onLogout: () => void
  title: string
  subtitle?: string
  rightContent?: React.ReactNode
  children: React.ReactNode
}

export default function DashboardLayout({
  role,
  user,
  onLogout,
  title,
  subtitle,
  rightContent,
  children,
}: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const items = ITEMS[role]
  
  const right = (
    <>
      {rightContent}
      {role === 'landowner' && <WalletBadge />}
    </>
  )
  
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <aside className="h-full flex flex-col bg-white border-r border-slate-200">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <button onClick={() => { navigate('/'); setMobileMenuOpen(false); }}>
              <Logo size="md" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 px-3 py-5 overflow-y-auto">
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
                    onClick={() => setMobileMenuOpen(false)}
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
                onClick={() => { navigate('/help'); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
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
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                title="Logout"
                className="text-slate-400 hover:text-rose-500 transition-colors"
              >
                <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </aside>
      </div>
      
      {/* Desktop sidebar */}
      <Sidebar role={role} user={user} onLogout={onLogout} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile menu button */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
          >
            <HiOutlineBars3 className="w-6 h-6" />
          </button>
          <span className="text-sm font-semibold text-slate-900 truncate flex-1">{title}</span>
        </div>
        
        <TopBar title={title} subtitle={subtitle} rightContent={right} />
        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
