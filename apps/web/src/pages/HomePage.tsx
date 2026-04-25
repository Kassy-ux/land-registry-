import { useNavigate } from 'react-router-dom'
import {
  HiArrowRight,
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineBoltSlash,
  HiOutlineBolt,
  HiOutlineDocumentMagnifyingGlass,
  HiOutlineCheckCircle,
  HiOutlineClipboardDocumentList,
} from 'react-icons/hi2'
import { FaEthereum } from 'react-icons/fa6'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import heroIllustration from '../assets/illustrations/hero-location.svg'
import analyzeIllustration from '../assets/illustrations/analyze.svg'
import collaborationIllustration from '../assets/illustrations/collaboration.svg'

export default function HomePage() {
  const navigate = useNavigate()
  const { walletAddress, jwtToken } = useAuth()
  const isLoggedIn = !!(walletAddress || jwtToken)

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-10 py-4">
          <Logo />
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/verify')}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-100 font-medium transition-colors"
            >
              <HiOutlineDocumentMagnifyingGlass className="w-4 h-4" />
              Verify Land
            </button>
            {isLoggedIn ? (
              <button
                onClick={() => navigate(walletAddress ? '/landowner' : '/officer')}
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold shadow-md shadow-blue-200 transition-all"
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold shadow-md shadow-blue-200 transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(circle at 20% 0%, #dbeafe 0%, transparent 40%), radial-gradient(circle at 80% 30%, #ede9fe 0%, transparent 45%)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-24 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-5">
              <FaEthereum className="w-3.5 h-3.5" />
              Powered by Ethereum
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-4 sm:mb-5">
              The future of <span className="text-blue-600">land ownership</span> is
              transparent.
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6 sm:mb-8 max-w-xl">
              LandLedger eliminates fraud and bureaucracy with immutable blockchain
              records. Register, transfer, and verify land titles in minutes — not months.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {isLoggedIn ? (
                <button
                  onClick={() => navigate(walletAddress ? '/landowner' : '/officer')}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Go to Dashboard
                  <HiArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Get Started
                  <HiArrowRight className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => navigate('/verify')}
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 px-7 py-3.5 rounded-xl font-semibold hover:bg-slate-50 transition-all"
              >
                <HiOutlineDocumentMagnifyingGlass className="w-4 h-4" />
                Verify a Title
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 sm:mt-10 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <HiOutlineCheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-500" />
                Tamper-proof records
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineCheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-500" />
                Instant verification
              </div>
            </div>
          </div>
          <div className="relative">
            <div
              className="absolute -inset-4 rounded-[2rem] sm:rounded-[3rem] -z-10"
              style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)' }}
            />
            <img
              src={heroIllustration}
              alt="Land verification on the blockchain"
              className="w-full h-auto max-h-[320px] sm:max-h-[400px] lg:max-h-[480px] object-contain"
            />
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { value: '100%', label: 'Immutable' },
            { value: '< 5s', label: 'Verification' },
            { value: '24/7', label: 'Available' },
            { value: '0', label: 'Fraud cases' },
          ].map(s => (
            <div key={s.label} className="text-center md:text-left">
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-400">
                {s.value}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-xs sm:text-sm font-semibold text-blue-600 uppercase tracking-wider">
              Why LandLedger
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mt-2">
              Built for trust. Designed for everyone.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              {
                Icon: HiOutlineShieldCheck,
                title: 'Fraud Prevention',
                desc: 'Eliminate double titling with immutable on-chain records.',
                color: 'bg-blue-500',
                tint: 'bg-blue-50',
                text: 'text-blue-600',
              },
              {
                Icon: HiOutlineLockClosed,
                title: 'Data Integrity',
                desc: 'Cryptographically secured records that nobody can alter.',
                color: 'bg-emerald-500',
                tint: 'bg-emerald-50',
                text: 'text-emerald-600',
              },
              {
                Icon: HiOutlineEye,
                title: 'Full Transparency',
                desc: 'Every transfer is publicly auditable and traceable.',
                color: 'bg-violet-500',
                tint: 'bg-violet-50',
                text: 'text-violet-600',
              },
              {
                Icon: HiOutlineBolt,
                title: 'Smart Automation',
                desc: 'Smart contracts execute transfers in seconds, not weeks.',
                color: 'bg-amber-500',
                tint: 'bg-amber-50',
                text: 'text-amber-600',
              },
            ].map(f => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100 transition"
              >
                <div className={`${f.tint} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <f.Icon className={`w-6 h-6 ${f.text}`} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1.5">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div className="order-2 lg:order-1">
            <img
              src={analyzeIllustration}
              alt="Officer reviewing land records"
              className="w-full h-auto max-h-[320px] sm:max-h-[420px] object-contain"
            />
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-xs sm:text-sm font-semibold text-blue-600 uppercase tracking-wider">
              How it works
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-6 sm:mb-8">
              Three simple steps
            </h2>
            <div className="space-y-6">
              {[
                {
                  Icon: HiOutlineClipboardDocumentList,
                  title: 'Submit your registration',
                  desc: 'Connect your wallet and submit your title deed details.',
                },
                {
                  Icon: HiOutlineDocumentMagnifyingGlass,
                  title: 'Officer verification',
                  desc: 'A registered officer reviews and approves the application.',
                },
                {
                  Icon: HiOutlineShieldCheck,
                  title: 'On-chain forever',
                  desc: 'Approved records are written to the blockchain immutably.',
                },
              ].map((s, i) => (
                <div key={s.title} className="flex gap-4">
                  <div className="shrink-0 relative">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">
                      <s.Icon className="w-6 h-6" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-blue-600 border border-blue-200 text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <div className="pt-1">
                    <h3 className="font-bold text-slate-900 mb-1">{s.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Audiences */}
      <section className="px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-xs sm:text-sm font-semibold text-blue-600 uppercase tracking-wider">
              For everyone
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mt-2">
              Whether you own land or verify it
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                  <HiOutlineShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Landowners</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Connect your crypto wallet, register your title, and prove ownership
                instantly — anywhere in the world.
              </p>
              <ul className="space-y-2.5 text-sm mb-6">
                {[
                  'Connect with MetaMask',
                  'Register parcels in minutes',
                  'Track approval in real time',
                ].map(t => (
                  <li key={t} className="flex items-center gap-2 text-slate-700">
                    <HiOutlineCheckCircle className="w-4 h-4 text-blue-600" />
                    {t}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
              >
                Connect wallet
                <HiArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                  <HiOutlineClipboardDocumentList className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Registry Officers</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Review applications, approve transfers, and maintain the integrity of the
                national registry — all from one dashboard.
              </p>
              <ul className="space-y-2.5 text-sm mb-6">
                {[
                  'Sign in with credentials',
                  'Review pending submissions',
                  'Approve or reject parcels',
                ].map(t => (
                  <li key={t} className="flex items-center gap-2 text-slate-700">
                    <HiOutlineCheckCircle className="w-4 h-4 text-emerald-600" />
                    {t}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all"
              >
                Officer login
                <HiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Public verification CTA */}
      <section className="px-6 lg:px-10 py-20 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              Public lookup
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-5">
              Verify any land title — no account needed.
            </h2>
            <p className="text-slate-600 mb-8 text-lg">
              Anyone can check the on-chain status, owner history, and authenticity of a
              land parcel using just its title number.
            </p>
            <button
              onClick={() => navigate('/verify')}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-slate-800 transition shadow-lg shadow-slate-200"
            >
              <HiOutlineDocumentMagnifyingGlass className="w-5 h-5" />
              Open public verifier
            </button>
          </div>
          <div>
            <img
              src={collaborationIllustration}
              alt="Collaboration on the registry"
              className="w-full h-auto max-h-[400px] object-contain"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-10 pb-16">
        <div
          className="max-w-7xl mx-auto rounded-3xl px-8 lg:px-14 py-14 lg:py-20 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 50%, #7c3aed 100%)' }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Ready to secure your land records?
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              Join the future of land administration with our blockchain-enabled registry
              system.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-7 py-3.5 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg"
              >
                Access the platform
                <HiArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/verify')}
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur border-2 border-white/40 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition"
              >
                Verify ownership
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-xs text-slate-400 text-center">
            © 2026 LandLedger. Enhancing transparency, security, and trust in land
            administration.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <HiOutlineBoltSlash className="w-4 h-4 text-amber-500" />
            Sepolia Testnet
          </div>
        </div>
      </footer>
    </div>
  )
}
