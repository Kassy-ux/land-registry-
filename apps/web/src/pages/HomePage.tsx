import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 rounded-lg p-1.5">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          </div>
          <span className="font-bold text-gray-900">Land Registry</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/verify')} className="text-sm text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-100 font-medium">Verify Land</button>
          <button onClick={() => navigate('/login')} className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">Sign In</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center text-center px-6 py-16">
        <div className="bg-blue-600 rounded-2xl p-4 mb-6 shadow-lg shadow-blue-100">
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 max-w-2xl leading-tight">Blockchain Land Registry</h1>
        <p className="text-base text-gray-500 max-w-xl mb-8 leading-relaxed">
          Secure, transparent, and trustworthy land registration powered by blockchain. Eliminating fraud, ensuring data integrity, and automating ownership transfers for Kenya.
        </p>
        <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-md shadow-blue-100">
          Get Started →
        </button>
      </div>

      {/* Why */}
      <div className="bg-gray-50 px-6 py-14">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Why Blockchain Land Registry?</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { bg: 'bg-blue-50', iconBg: 'bg-blue-100', color: 'text-blue-600', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Fraud Prevention', desc: 'Eliminate double titling and unauthorized changes with immutable blockchain records.' },
            { bg: 'bg-green-50', iconBg: 'bg-green-100', color: 'text-green-600', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', title: 'Data Integrity', desc: 'Tamper-proof records ensure your land information is always accurate and secure.' },
            { bg: 'bg-purple-50', iconBg: 'bg-purple-100', color: 'text-purple-600', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', title: 'Transparency', desc: 'Complete visibility of land records and transaction history builds public trust.' },
            { bg: 'bg-orange-50', iconBg: 'bg-orange-100', color: 'text-orange-600', icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Smart Automation', desc: 'Automated ownership transfers reduce bureaucracy and minimize human error.' },
          ].map(f => (
            <div key={f.title} className={`${f.bg} rounded-2xl p-6`}>
              <div className={`${f.iconBg} w-11 h-11 rounded-xl flex items-center justify-center mb-4`}>
                <svg className={`w-6 h-6 ${f.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="px-6 py-14 bg-white">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">How It Works</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { num: 1, title: 'Register Your Land', desc: 'Land owners submit registration applications with title deed details and documentation.' },
            { num: 2, title: 'Officer Verification', desc: 'Registry officers review and verify the authenticity of land records before approval.' },
            { num: 3, title: 'Blockchain Recorded', desc: 'Approved records are permanently stored on the blockchain, creating an immutable audit trail.' },
          ].map(s => (
            <div key={s.num} className="flex flex-col items-center text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-4 shadow-md shadow-blue-100">{s.num}</div>
              <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mx-6 mb-10 rounded-3xl px-8 py-14 text-center" style={{background: 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 100%)'}}>
        <h2 className="text-2xl font-bold text-white mb-3">Ready to Secure Your Land Records?</h2>
        <p className="text-blue-100 mb-8 text-sm">Join the future of land administration with our blockchain-enabled registry system.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate('/login')} className="bg-white text-blue-700 px-7 py-3 rounded-xl text-sm font-semibold hover:bg-blue-50 transition shadow">
            Access the Platform →
          </button>
          <button onClick={() => navigate('/verify')} className="border-2 border-white text-white px-7 py-3 rounded-xl text-sm font-semibold hover:bg-white hover:text-blue-700 transition">
            Verify Land Ownership →
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-gray-400 text-xs border-t border-gray-100">
        © 2026 Blockchain Land Registry. Enhancing transparency, security, and trust in land administration.
      </div>
    </div>
  )
}
