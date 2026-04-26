import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  ArrowDown,
  CheckCircle2,
  FileText,
  Loader2,
  Search as SearchIcon,
  Shield,
  Wallet,
  User as UserIcon,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

type LandParcel = { id: number; titleNumber: string; location: string; size: number }

export default function TransferOwnership() {
  const { user, jwtToken } = useAuth()
  const [parcels, setParcels] = useState<LandParcel[]>([])
  const [selectedParcel, setSelectedParcel] = useState('')
  const [buyerAddress, setBuyerAddress] = useState('')
  const [buyerName, setBuyerName] = useState<string | null>(null)
  const [lookingUp, setLookingUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    api.get('/parcels').then(r => setParcels(r.data)).catch(() => {})
  }, [])

  const lookupBuyer = async () => {
    if (!buyerAddress.startsWith('0x') || buyerAddress.length < 10) {
      toast.error('Enter a valid wallet address (0x...)')
      return
    }
    try {
      setLookingUp(true)
      setBuyerName(null)
      const res = await api.get(`/auth/wallet/${buyerAddress}`)
      setBuyerName(res.data.user.name)
    } catch {
      setBuyerName(null)
      toast.error('Wallet address not registered in system')
    } finally {
      setLookingUp(false)
    }
  }

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!buyerName) {
      toast.error('Please verify the buyer wallet address first')
      return
    }
    try {
      setLoading(true)
      await api.post('/transfers/initiate', {
        landId: Number(selectedParcel),
        buyerAddress
      }, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      })
      toast.success('Transfer initiated on blockchain')
      setSuccess(true)
      setSelectedParcel('')
      setBuyerAddress('')
      setBuyerName(null)
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Transfer failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Transfer Land Ownership</h2>
        <p className="text-gray-500 text-sm mt-1">Execute a secure blockchain-based ownership transfer</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-green-800 font-medium text-sm">Transfer initiated successfully</p>
            <p className="text-green-600 text-xs">The new owner must confirm the transfer from their wallet</p>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <form onSubmit={handleTransfer} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Select Title Deed <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedParcel}
                onChange={e => setSelectedParcel(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
                required
              >
                <option value="">-- Select a title deed --</option>
                {parcels.map(p => (
                  <option key={p.id} value={p.id}>{p.titleNumber} — {p.location}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Owner</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={user?.name || ''}
                readOnly
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm bg-gray-50 text-gray-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-center py-1">
            <div className="w-9 h-9 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
              <ArrowDown className="w-4 h-4" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              New Owner Wallet Address <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Wallet className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  placeholder="0x..."
                  value={buyerAddress}
                  onChange={e => { setBuyerAddress(e.target.value); setBuyerName(null) }}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  required
                />
              </div>
              <button
                type="button"
                onClick={lookupBuyer}
                disabled={lookingUp}
                className="bg-gray-100 text-gray-700 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-200 disabled:opacity-50 flex items-center gap-2"
              >
                {lookingUp ? <Loader2 className="w-4 h-4 animate-spin" /> : <SearchIcon className="w-4 h-4" />}
                Lookup
              </button>
            </div>
            {buyerName && (
              <div className="mt-2 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified: <strong>{buyerName}</strong></span>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1">The new owner must have connected their wallet to the system</p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <p className="text-sm font-medium text-blue-800">Smart Contract Transfer Process</p>
            </div>
            <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
              <li>Verify current ownership on blockchain</li>
              <li>Create new block with transfer record</li>
              <li>Update ownership immutably</li>
              <li>Generate transaction hash for audit trail</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading || !buyerName}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Processing on blockchain...' : 'Initiate Transfer'}
          </button>
        </form>
      </div>
    </div>
  )
}
