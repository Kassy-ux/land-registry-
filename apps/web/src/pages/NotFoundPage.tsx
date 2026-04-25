import { Link } from 'react-router-dom'
import { HiArrowRight, HiOutlineArrowLeft } from 'react-icons/hi2'
import Logo from '../components/Logo'
import notFoundIllustration from '../assets/illustrations/not-found.svg'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-violet-50/30 flex flex-col">
      <nav className="px-6 lg:px-10 py-4">
        <Link to="/">
          <Logo />
        </Link>
      </nav>
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="max-w-2xl w-full grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <p className="text-blue-600 font-bold text-sm tracking-wider uppercase mb-2">
              404 — Lost in the registry
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3">
              We couldn't find that page.
            </h1>
            <p className="text-slate-600 mb-8">
              The link may be broken, the page may have moved, or you may have mistyped the
              address.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
              >
                <HiOutlineArrowLeft className="w-4 h-4" />
                Back to home
              </Link>
              <Link
                to="/verify"
                className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition"
              >
                Verify a parcel
                <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img
              src={notFoundIllustration}
              alt="Page not found"
              className="w-full h-auto max-h-80 object-contain"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
