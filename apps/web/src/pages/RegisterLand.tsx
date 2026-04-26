import { useState } from 'react'
import { toast } from 'sonner'
import { FileText, MapPin, Ruler, Calendar, User as UserIcon, Loader2, Send } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

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
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Register New Land</h2>
        <p className="text-gray-500 text-sm mt-1">Add a new land parcel to the blockchain registry</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field
            icon={FileText}
            label="Title Deed Number"
            required
            hint="Unique identifier for the land parcel"
          >
            <input
              placeholder="e.g., LR/2024/003"
              value={form.titleNumber}
              onChange={e => setForm({ ...form, titleNumber: e.target.value })}
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </Field>

          <Field icon={UserIcon} label="Land Owner Name" required hint="Registering as yourself">
            <input
              value={user?.name || (walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect wallet')}
              readOnly
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm bg-gray-50 text-gray-500"
            />
          </Field>

          <Field icon={MapPin} label="Location" required>
            <input
              placeholder="e.g., Nairobi, Karen"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </Field>

          <Field icon={Ruler} label="Land Size (acres)" required>
            <input
              placeholder="e.g., 3.5"
              type="number"
              step="0.1"
              value={form.size}
              onChange={e => setForm({ ...form, size: e.target.value })}
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </Field>

          <Field icon={Calendar} label="Registration Date" required>
            <input
              value={form.registrationDate}
              readOnly
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm bg-gray-50 text-gray-500"
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? 'Submitting to blockchain...' : 'Register Land Parcel'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({
  icon: Icon,
  label,
  required,
  hint,
  children,
}: {
  icon: any
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <Icon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        {children}
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}
