import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { toast } from 'sonner'
import { ArrowRightLeft, Loader2, Inbox } from 'lucide-react'
import OwnershipABI from '../abis/Ownership.json'

type PendingTransfer = {
  id: number
  landId: number
  status: string
  land: { titleNumber: string; location: string }
  seller: { name: string }
}

export default function PendingTransfers() {
  const { jwtToken } = useAuth()
  const [transfers, setTransfers] = useState<PendingTransfer[]>([])
  const [loading, setLoading] = useState<number | null>(null)

  const fetchTransfers = () => {
    api.get('/transfers/pending', {
      headers: { Authorization: `Bearer ${jwtToken}` }
    }).then(r => setTransfers(r.data)).catch(() => {})
  }

  useEffect(() => { fetchTransfers() }, [])

  const handleConfirm = async (transfer: PendingTransfer) => {
    let toastId: string | number | undefined
    try {
      setLoading(transfer.id)
      if (!window.ethereum) throw new Error('MetaMask not found')

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const contract = new ethers.Contract(
        import.meta.env.VITE_OWNERSHIP_ADDRESS,
        OwnershipABI.abi,
        signer
      )

      toastId = toast.loading('Confirm in MetaMask...')
      const tx = await contract.confirmTransfer(transfer.landId)
      toast.loading('Waiting for blockchain confirmation...', { id: toastId })
      await tx.wait()

      await api.post('/transfers/confirm', {
        landId: transfer.landId,
        transactionId: transfer.id
      }, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      })

      toast.success('Ownership transferred on-chain!', { id: toastId })
      fetchTransfers()
    } catch (err: any) {
      if (toastId !== undefined) toast.dismiss(toastId)
      toast.error(err.reason || err.message || 'Confirmation failed')
    } finally {
      setLoading(null)
    }
  }

  if (transfers.length === 0) return null

  return (
    <div className="bg-white border border-orange-200 rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Inbox className="w-4 h-4 text-orange-500" />
        <h3 className="font-semibold text-gray-900">Pending Transfers</h3>
      </div>
      <p className="text-xs text-gray-400 mb-4">Someone is transferring land to you — confirm to receive ownership</p>
      <div className="space-y-3">
        {transfers.map(t => (
          <div key={t.id} className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-xl">
            <div>
              <p className="font-medium text-gray-900">{t.land.titleNumber}</p>
              <p className="text-sm text-gray-500">{t.land.location}</p>
              <p className="text-xs text-gray-400">From: {t.seller.name}</p>
            </div>
            <button
              onClick={() => handleConfirm(t)}
              disabled={loading === t.id}
              className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
            >
              {loading === t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRightLeft className="w-4 h-4" />}
              {loading === t.id ? 'Confirming...' : 'Confirm Transfer'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
