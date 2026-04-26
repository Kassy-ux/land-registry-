type LandParcel = { id: number; titleNumber: string; location: string; size: number; createdAt: string; status: string }
import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopNav from '../components/TopNav'
import api from '../services/api'
import RegisterLand from './RegisterLand'
import PendingTransfers from '../components/PendingTransfers'
import TransferOwnership from './TransferOwnership'
import SearchRecords from './SearchRecords'

function statusBadge(status: string) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }
  return map[status?.toLowerCase()] || 'bg-gray-100 text-gray-600'
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  }
  return map[status?.toLowerCase()] || status
}

function Dashboard() {
  const [parcels, setParcels] = useState<LandParcel[]>([])

  useEffect(() => {
    api.get('/parcels').then(r => setParcels(r.data)).catch(() => {})
  }, [])

  const approved = parcels.filter(p => p.status?.toLowerCase() === 'approved').length
  const pending = parcels.filter(p => p.status?.toLowerCase() === 'pending').length

  return (
    <main className="flex-1 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Welcome back</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Land Records', value: parcels.length, color: 'bg-blue-50', icon: '📋' },
          { label: 'My Properties', value: parcels.length, color: 'bg-green-50', icon: '✅' },
          { label: 'Pending Approval', value: pending, color: 'bg-yellow-50', icon: '⏳' },
          { label: 'Approved Records', value: approved, color: 'bg-green-50', icon: '✓' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-sm text-gray-500 mb-1">{s.label}</p>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">{s.value}</span>
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-lg`}>
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <PendingTransfers />
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Blockchain Transactions</h3>
        <p className="text-gray-400 text-sm">No transactions yet</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">My Land Properties</h3>
        <div className="space-y-3">
          {parcels.length === 0 && <p className="text-gray-400 text-sm">No properties registered yet</p>}
          {parcels.map(p => (
            <div key={p.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
              <div>
                <p className="font-medium text-gray-900">{p.titleNumber}</p>
                <p className="text-sm text-gray-500">{p.location}</p>
                <p className="text-xs text-gray-400">Size: {p.size} acres · ID: {p.id}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center text-xs px-3 py-1 rounded-full font-medium ${statusBadge(p.status)}`}>
                  {statusLabel(p.status)}
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  Registered: {new Date(p.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default function LandownerDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNav title="Blockchain Land Registry" />
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="register" element={<RegisterLand />} />
          <Route path="transfer" element={<TransferOwnership />} />
          <Route path="search" element={<SearchRecords />} />
        </Routes>
      </div>
    </div>
  )
}
