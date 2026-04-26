import { useNavigate } from 'react-router-dom'
import {
  Shield,
  ShieldCheck,
  Database,
  Eye,
  Zap,
  ArrowRight,
  Landmark,
  Search,
  FileText,
  Users,
  ChevronRight,
} from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 backdrop-blur bg-white/80 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-2">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-base">Land Registry</span>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => navigate('/verify')}
              className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-100 font-medium"
            >
              <Search className="w-4 h-4" />
              Verify Land
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Powered by Ethereum
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-5 leading-tight">
            Blockchain Land
            <br />
            Registry for{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              everyone
            </span>
          </h1>
          <p className="text-base text-gray-500 mb-8 leading-relaxed max-w-md">
            Secure, transparent and tamper-proof land titles. Eliminate fraud, ensure data integrity and
            automate ownership transfers — all on a public blockchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-200 transition flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/verify')}
              className="border border-gray-200 text-gray-700 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Verify a Title
            </button>
          </div>
          <div className="mt-8 flex items-center gap-6 text-xs text-gray-400">
            <div>
              <p className="text-2xl font-bold text-gray-900">99.9%</p>
              <p>Uptime</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">5k+</p>
              <p>Titles</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">100%</p>
              <p>Auditable</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-transparent rounded-3xl blur-2xl opacity-60" />
          <img
            src="/illustrations/blockchain.svg"
            alt="Blockchain land registry"
            className="relative w-full max-w-lg mx-auto"
          />
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 px-4 sm:px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why blockchain?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              We rebuild trust in land administration with the properties of distributed ledgers.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: 'Fraud Prevention', desc: 'Immutable records eliminate double-titling and unauthorized changes.', accent: 'bg-indigo-100 text-indigo-600' },
              { icon: Database, title: 'Data Integrity', desc: 'Tamper-proof records ensure your land information is always accurate.', accent: 'bg-green-100 text-green-600' },
              { icon: Eye, title: 'Transparency', desc: 'Complete visibility of land records and transaction history.', accent: 'bg-purple-100 text-purple-600' },
              { icon: Zap, title: 'Smart Automation', desc: 'Automated transfers via smart contracts reduce bureaucracy.', accent: 'bg-orange-100 text-orange-600' },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.accent}`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 sm:px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <img
              src="/illustrations/handshake.svg"
              alt="Trust and collaboration"
              className="w-full max-w-md mx-auto"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">How it works</h2>
            <div className="space-y-6">
              {[
                { num: 1, icon: FileText, title: 'Register your land', desc: 'Submit registration with title deed details and supporting documents.' },
                { num: 2, icon: Users, title: 'Officer verification', desc: 'Registry officers review and approve the authenticity of land records.' },
                { num: 3, icon: ShieldCheck, title: 'Recorded on-chain', desc: 'Approved records are permanently stored on Ethereum, creating an immutable audit trail.' },
              ].map((s) => (
                <div key={s.num} className="flex gap-4">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
                      Step {s.num}
                    </p>
                    <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="max-w-6xl mx-auto rounded-3xl px-8 py-14 text-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white mb-3">Ready to secure your land records?</h2>
            <p className="text-indigo-100 mb-8 text-sm max-w-md mx-auto">
              Join the future of land administration with our blockchain-enabled registry system.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-indigo-700 px-7 py-3 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition shadow-lg flex items-center justify-center gap-2"
              >
                Access the platform
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/verify')}
                className="border border-white/40 text-white px-7 py-3 rounded-xl text-sm font-semibold hover:bg-white/10 transition flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Verify ownership
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-xs border-t border-gray-100 px-4">
        © {new Date().getFullYear()} Blockchain Land Registry. Enhancing transparency, security and trust.
      </footer>
    </div>
  )
}
