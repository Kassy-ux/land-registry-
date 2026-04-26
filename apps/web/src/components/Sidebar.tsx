import { NavLink } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Landmark, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface SidebarItem {
  path: string
  label: string
  icon: LucideIcon
  end?: boolean
  badge?: number
}

interface Props {
  items: SidebarItem[]
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
  brand?: string
  subtitle?: string
  accent?: 'indigo' | 'purple' | 'blue'
  footer?: React.ReactNode
}

const accentMap = {
  indigo: { bg: 'bg-indigo-600', active: 'bg-indigo-50 text-indigo-700' },
  purple: { bg: 'bg-purple-600', active: 'bg-purple-50 text-purple-700' },
  blue: { bg: 'bg-blue-600', active: 'bg-blue-50 text-blue-700' },
}

export default function Sidebar({
  items,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  brand = 'Land Registry',
  subtitle = 'Blockchain',
  accent = 'indigo',
  footer,
}: Props) {
  const a = accentMap[accent]

  const content = (
    <>
      <div className={`flex items-center gap-3 p-4 border-b border-gray-100 ${collapsed ? 'justify-center' : ''}`}>
        <div className={`${a.bg} w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Landmark className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">{brand}</p>
            <p className="text-gray-400 text-xs truncate">{subtitle}</p>
          </div>
        )}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden ml-auto text-gray-400 hover:text-gray-700"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition group ${
                  isActive ? `${a.active} font-medium` : 'text-gray-600 hover:bg-gray-50'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {footer && !collapsed && <div className="p-4 border-t border-gray-100">{footer}</div>}

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex items-center justify-center w-full p-3 border-t border-gray-100 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </>
  )

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 flex flex-col transition-transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </aside>

      {/* Desktop static */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-60'
        } sticky top-0 h-screen`}
      >
        {content}
      </aside>
    </>
  )
}
