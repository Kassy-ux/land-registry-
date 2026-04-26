import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast, { Toaster } from 'react-hot-toast'

export default function RegisterLand() {
  const { walletAddress, jwtToken, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    titleNumber: '',
    location: '',
    size: '',
    registrationDate: new Date().toLocaleDateString('en-US')
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await api.post('/parcels', {
        titleNumber: form.titleNumber,
        location: form.location,
        size: Number(form.size),
        ownerAddress: walletAddress || '',
        ipfsHash: ''
      }, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      })
      toast.success('Land parcel submitted for approval')
      setForm({ titleNumber: '', location: '', size: '', registrationDate: new Date().toLocaleDateString('en-US') })
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 p-6 max-w-2xl">
      <Toaster />
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Register New Land</h2>
        <p className="text-gray-500 text-sm mt-1">Add a new land parcel to the blockchain registry</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title Deed Number <span className="text-red-500">*</span></label>
            <input
              placeholder="e.g., LR/2024/003"
              value={form.titleNumber}
              onChange={e => setForm({...form, titleNumber: e.target.value})}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Unique identifier for the land parcel</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Land Owner Name <span className="text-red-500">*</span></label>
            <input
              value={user?.name || (walletAddress ? `${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}` : 'Connect wallet')}
              readOnly
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-400 mt-1">Registering as yourself</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
            <input
              placeholder="e.g., Nairobi, Karen"
              value={form.location}
              onChange={e => setForm({...form, location: e.target.value})}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Land Size <span className="text-red-500">*</span></label>
            <input
              placeholder="e.g., 3.5 acres"
              type="number"
              step="0.1"
              value={form.size}
              onChange={e => setForm({...form, size: e.target.value})}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date <span className="text-red-500">*</span></label>
            <input
              value={form.registrationDate}
              readOnly
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Submitting to blockchain...' : 'Register Land Parcel'}
          </button>
        </form>
      </div>
    </main>
  )
}
