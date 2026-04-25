type LandParcel = { id: number; titleNumber: string; location: string; size: number; status: string; createdAt: string }
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast, { Toaster } from 'react-hot-toast'

export default function LandownerDashboard() {
  const { walletAddress, logout } = useAuth()
  const [parcels, setParcels] = useState<LandParcel[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ titleNumber: '', location: '', size: '' })

  const fetchParcels = () => {
    api.get('/parcels').then(r => setParcels(r.data)).catch(() => {})
  }

  useEffect(() => { fetchParcels() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await api.post('/parcels', { ...form, size: Number(form.size), ownerAddress: walletAddress, ipfsHash: '' })
      toast.success('Parcel submitted for approval')
      setShowForm(false)
      setForm({ titleNumber: '', location: '', size: '' })
      fetchParcels()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to submit')
    } finally {
      setLoading(false)
    }
  }

  const statusStyle = (status: string) => {
    if (status === 'approved') return 'bg-green-100 text-green-700'
    if (status === 'rejected') return 'bg-red-100 text-red-600'
    return 'bg-yellow-100 text-yellow-700'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="font-semibold text-gray-900">Land Registry — Landowner</h1>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500 font-mono">{walletAddress?.slice(0,6)}...{walletAddress?.slice(-4)}</span>
          <button onClick={logout} className="text-sm text-red-500 hover:text-red-700">Disconnect</button>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">My Parcels</h2>
          <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700">
            + Register Parcel
          </button>
        </div>
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 space-y-4">
            <h3 className="font-medium text-gray-900">New Land Parcel</h3>
            <input placeholder="Title Number (e.g. KSM/001)" value={form.titleNumber} onChange={e => setForm({...form, titleNumber: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            <input placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            <input placeholder="Size (acres)" type="number" value={form.size} onChange={e => setForm({...form, size: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit for Approval'}
            </button>
          </form>
        )}
        <div className="space-y-3">
          {parcels.length === 0 && <div className="text-center text-gray-400 py-12">No parcels registered yet</div>}
          {parcels.map(p => (
            <div key={p.id} className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{p.titleNumber}</p>
                  <p className="text-sm text-gray-500">{p.location} · {p.size} acres</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusStyle(p.status)}`}>
                  {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
