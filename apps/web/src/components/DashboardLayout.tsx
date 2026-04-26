import { useState, useEffect } from 'react'
import Sidebar, { type SidebarItem } from './Sidebar'
import TopNav from './TopNav'

interface Props {
  items: SidebarItem[]
  brand: string
  subtitle: string
  accent?: 'indigo' | 'purple' | 'blue'
  title: string
  rightSlot?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
}

export default function DashboardLayout({
  items,
  brand,
  subtitle,
  accent = 'indigo',
  title,
  rightSlot,
  footer,
  children,
}: Props) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('sidebar:collapsed') === '1'
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('sidebar:collapsed', collapsed ? '1' : '0')
  }, [collapsed])

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        items={items}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        brand={brand}
        subtitle={subtitle}
        accent={accent}
        footer={footer}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav title={title} onMenuClick={() => setMobileOpen(true)} rightSlot={rightSlot} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
