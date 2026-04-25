import { Toaster } from 'react-hot-toast'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

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
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Toaster position="top-right" />
      <Sidebar role={role} user={user} onLogout={onLogout} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={title} subtitle={subtitle} rightContent={rightContent} />
        <main className="flex-1 p-6 lg:p-10 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
