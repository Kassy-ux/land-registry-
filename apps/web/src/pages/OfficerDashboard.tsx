import { useState, useEffect } from 'react'
import api from '../services/api'
import toast, { Toaster } from 'react-hot-toast'

type Parcel = { id: number; titleNumber: string; location: string; size: number; status: string }

export default function OfficerDashboard() {
  const [parcels, setParcels] = useState<Parcel[]>([])

  const fetchParcels = () => {
    api.get('/parcels').then(r => setParcels(r.data)).catch(() => {})
  }

  useEffect(() => { fetchParcels() }, [])

  const handleApprove = async (id: number) => {
    try {
      await api.patch(`/parcels/${id}/approve`)
      toast.success('Parcel approved')
      fetchParcels()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to approve')
    }
  }

  const handleReject = async (id: number) => {
    try {
      await api.patch(`/parcels/${id}/reject`)
      toast.success('Parcel rejected')
      fetchParcels()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to reject')
    }
  }

  const pending = parcels.filter(p => p.status === 'pending')
  const history = parcels.filter(p => p.status !== 'pending')

  const logout = () => {
    localStorage.removeItem('jwt_token')
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="font-semibold text-gray-900">Land Registry — Officer</h1>
        <button onClick={logout} className="text-sm text-red-500 hover:text-red-700">Logout</button>
      </nav>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Registrations</h2>
          {pending.length === 0 && <div className="text-center text-gray-400 py-8">No parcels to review</div>}
          <div className="space-y-3">
            {pending.map(p => (
              <div key={p.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{p.titleNumber}</p>
                  <p className="text-sm text-gray-500">{p.location} · {p.size} acres</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleApprove(p.id)} className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700">Approve</button>
                  <button onClick={() => handleReject(p.id)} className="bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-200">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">History</h2>
          {history.length === 0 && <div className="text-center text-gray-400 py-8">No history yet</div>}
          <div className="space-y-3">
            {history.map(p => (
              <div key={p.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{p.titleNumber}</p>
                  <p className="text-sm text-gray-500">{p.location} · {p.size} acres</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${p.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
