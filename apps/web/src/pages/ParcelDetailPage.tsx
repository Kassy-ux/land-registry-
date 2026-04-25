import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import {
  HiOutlineArrowLeft,
  HiOutlineMapPin,
  HiOutlineSquaresPlus,
  HiOutlineDocumentCheck,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineCubeTransparent,
} from 'react-icons/hi2'
import { FaEthereum } from 'react-icons/fa6'
import Logo from '../components/Logo'
import StatusBadge from '../components/StatusBadge'
import type { Parcel } from '../types/parcel'

export default function ParcelDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [parcel, setParcel] = useState<Parcel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    api
      .get(`/parcels/${id}`)
      .then(r => setParcel(r.data))
      .catch(() => toast.error('Parcel not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading parcel...</p>
      </div>
    )
  }

  if (!parcel) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-700 font-semibold mb-3">Parcel not found</p>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 text-sm font-semibold hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  const owner = parcel.ownerships?.[0]?.user

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-100 px-6 lg:px-10 py-4 flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 font-medium"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          Back
        </button>
      </nav>

      <main className="max-w-5xl mx-auto px-6 lg:px-10 py-10 space-y-5">
        {/* Header */}
        <div
          className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #ede9fe 100%)',
          }}
        >
          <div className="p-7 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
                Parcel #{parcel.id}
              </p>
              <h1 className="text-3xl font-extrabold text-slate-900 font-mono">
                {parcel.titleNumber}
              </h1>
              <p className="text-slate-600 mt-1.5 text-sm flex items-center gap-1.5">
                <HiOutlineCalendar className="w-4 h-4 text-slate-400" />
                Registered on {new Date(parcel.createdAt).toLocaleDateString()}
              </p>
            </div>
            <StatusBadge status={parcel.status} size="md" />
          </div>
          <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/70 bg-white/50">
            <Detail Icon={HiOutlineMapPin} label="Location" value={parcel.location} tint="bg-blue-50" text="text-blue-600" />
            <Detail Icon={HiOutlineSquaresPlus} label="Size" value={`${parcel.size} acres`} tint="bg-violet-50" text="text-violet-600" />
            <Detail
              Icon={HiOutlineDocumentCheck}
              label="Documents"
              value={`${parcel.documents?.length ?? 0}`}
              tint="bg-emerald-50"
              text="text-emerald-600"
            />
          </div>
        </div>

        {/* Owner */}
        {owner && (
          <Card title="Registered owner" icon={HiOutlineUser}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                {owner.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">{owner.name}</p>
                <p className="text-xs text-slate-500 truncate">{owner.email}</p>
                {owner.walletAddress && (
                  <p className="text-xs text-slate-500 font-mono truncate">{owner.walletAddress}</p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Documents */}
        <Card title="Attached documents" icon={HiOutlineDocumentCheck}>
          {parcel.documents && parcel.documents.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {parcel.documents.map(doc => (
                <li key={doc.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <HiOutlineDocumentCheck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 text-sm">{doc.documentType}</p>
                      <p className="text-xs text-slate-500 font-mono truncate">{doc.fileHash}</p>
                    </div>
                  </div>
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${doc.fileHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-blue-600 hover:underline shrink-0"
                  >
                    View on IPFS
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No documents have been attached to this parcel yet.</p>
          )}
        </Card>

        {/* Blockchain records */}
        <Card title="Blockchain activity" icon={FaEthereum}>
          {parcel.blockchainRecords && parcel.blockchainRecords.length > 0 ? (
            <ul className="space-y-2">
              {parcel.blockchainRecords.map(rec => (
                <li
                  key={rec.id}
                  className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3"
                >
                  <HiOutlineCubeTransparent className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-500">Block hash</p>
                    <p className="text-sm font-mono text-slate-900 truncate">{rec.blockHash}</p>
                  </div>
                  <p className="text-xs text-slate-500 shrink-0">
                    {new Date(rec.timestamp).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">
              No blockchain transactions have been recorded for this parcel yet.
            </p>
          )}
        </Card>
      </main>
    </div>
  )
}

function Detail({
  Icon,
  label,
  value,
  tint,
  text,
}: {
  Icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  tint: string
  text: string
}) {
  return (
    <div className="p-5 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl ${tint} ${text} flex items-center justify-center shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-semibold text-slate-900 truncate">{value}</p>
      </div>
    </div>
  )
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-slate-700" />
        <h2 className="font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  )
}
