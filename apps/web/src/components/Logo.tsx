import { HiShieldCheck } from 'react-icons/hi2'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function Logo({ size = 'md', showText = true }: Props) {
  const dims = {
    sm: { box: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-base' },
    md: { box: 'w-9 h-9', icon: 'w-5 h-5', text: 'text-lg' },
    lg: { box: 'w-14 h-14', icon: 'w-7 h-7', text: 'text-2xl' },
  }[size]

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${dims.box} rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20`}
        style={{ background: 'linear-gradient(135deg,#2563eb 0%,#4f46e5 100%)' }}
      >
        <HiShieldCheck className={`${dims.icon} text-white`} />
      </div>
      {showText && (
        <div className="leading-tight">
          <div className={`${dims.text} font-bold text-slate-900`}>LandLedger</div>
          {size === 'lg' && (
            <div className="text-xs text-slate-500 font-medium">Blockchain Land Registry</div>
          )}
        </div>
      )}
    </div>
  )
}
