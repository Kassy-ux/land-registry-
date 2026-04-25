import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineQuestionMarkCircle,
  HiOutlineDocumentText,
  HiOutlineShieldCheck,
  HiOutlineHome,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineChatBubbleLeftRight,
  HiChevronDown,
  HiChevronUp,
  HiOutlineArrowLeft,
} from 'react-icons/hi2'

interface FAQ {
  question: string
  answer: string
  category: 'registration' | 'verification' | 'transfer' | 'account'
}

const faqs: FAQ[] = [
  {
    question: 'How do I register a new land parcel?',
    answer: 'To register a new land parcel, log in as a landowner using your MetaMask wallet, navigate to your dashboard, and click "Register Parcel". Fill in the required details including parcel ID, location, size, and upload necessary documents. Once submitted, your registration will be reviewed by a registry officer.',
    category: 'registration',
  },
  {
    question: 'What documents do I need to register land?',
    answer: 'You typically need: 1) Proof of ownership (title deed, sale agreement), 2) Survey plan or location map, 3) Government-issued ID, 4) Tax clearance certificate. All documents should be in PDF format and clearly legible.',
    category: 'registration',
  },
  {
    question: 'How long does the verification process take?',
    answer: 'The verification process typically takes 3-5 business days. A registry officer will review your submitted documents and either approve or request additional information. You\'ll receive email notifications at each stage of the process.',
    category: 'verification',
  },
  {
    question: 'How do I verify a land parcel?',
    answer: 'Go to the "Verify Parcel" page, enter the blockchain token ID or parcel ID, and click "Verify". The system will check the blockchain records and display the ownership status, registration details, and verification history.',
    category: 'verification',
  },
  {
    question: 'Can I transfer land ownership through this platform?',
    answer: 'Yes! Once your land is registered and verified, you can initiate a transfer by going to your parcel details and clicking "Transfer Ownership". Enter the recipient\'s wallet address, and both parties will need to sign the transaction using their MetaMask wallets.',
    category: 'transfer',
  },
  {
    question: 'What is a blockchain token ID?',
    answer: 'A blockchain token ID is a unique identifier assigned to your land parcel when it\'s registered on the blockchain. It serves as permanent, immutable proof of registration and can be used to verify ownership at any time.',
    category: 'verification',
  },
  {
    question: 'How do I connect my MetaMask wallet?',
    answer: 'Click "Sign In" on the homepage, select "Landowner Login", and click "Connect MetaMask". Make sure you have the MetaMask browser extension installed and are connected to the Sepolia testnet. You\'ll be asked to sign a message to authenticate.',
    category: 'account',
  },
  {
    question: 'What if my registration is rejected?',
    answer: 'If your registration is rejected, you\'ll receive a notification with the reason. Review the feedback, address the issues (such as incomplete documents or incorrect information), and submit a new registration with the corrected information.',
    category: 'registration',
  },
  {
    question: 'Can I update parcel information after registration?',
    answer: 'Some information can be updated through your dashboard. However, critical details like parcel ID and location require a new verification process to maintain the integrity of blockchain records. Contact support for assistance with major updates.',
    category: 'registration',
  },
  {
    question: 'Is my data secure on the blockchain?',
    answer: 'Yes! The blockchain provides immutable, tamper-proof records. Document files are stored securely on IPFS (InterPlanetary File System), and only authorized parties can access sensitive information. Your wallet signature is required for all transactions.',
    category: 'account',
  },
]

const quickActions = [
  {
    icon: HiOutlineDocumentText,
    title: 'Register Land',
    description: 'Start a new land registration',
    action: 'register',
    color: 'blue',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Verify Parcel',
    description: 'Check ownership and status',
    action: 'verify',
    color: 'green',
  },
  {
    icon: HiOutlineHome,
    title: 'My Dashboard',
    description: 'View your parcels',
    action: 'dashboard',
    color: 'indigo',
  },
  {
    icon: HiOutlineChatBubbleLeftRight,
    title: 'Contact Support',
    description: 'Get personalized help',
    action: 'contact',
    color: 'purple',
  },
]

export default function HelpPage() {
  const navigate = useNavigate()
  const { walletAddress, jwtToken } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const isLoggedIn = !!(walletAddress || jwtToken)
  const userRole = walletAddress ? 'landowner' : jwtToken ? 'officer' : null

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'register':
        if (walletAddress) navigate('/landowner')
        else navigate('/login')
        break
      case 'verify':
        navigate('/verify')
        break
      case 'dashboard':
        if (walletAddress) navigate('/landowner')
        else if (jwtToken) navigate('/officer')
        else navigate('/login')
        break
      case 'contact':
        document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <HiOutlineArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
              Help & Support
            </h1>
            {isLoggedIn ? (
              <button
                onClick={() => navigate(userRole === 'landowner' ? '/landowner' : '/officer')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 mb-4 sm:mb-6">
            <HiOutlineQuestionMarkCircle className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
            How can we help you?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Find answers to common questions or contact our support team
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-slate-900 placeholder-slate-400 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <button
                key={index}
                onClick={() => handleQuickAction(action.action)}
                className={`p-6 bg-white rounded-2xl border-2 border-transparent hover:border-${action.color}-200 hover:shadow-lg transition-all text-left group`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-${action.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-6 h-6 text-${action.color}-600`} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{action.title}</h3>
                <p className="text-sm text-slate-600">{action.description}</p>
              </button>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">
            Frequently Asked Questions
          </h3>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
            {['all', 'registration', 'verification', 'transfer', 'account'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <HiOutlineQuestionMarkCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">No questions found. Try a different search or category.</p>
              </div>
            ) : (
              filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-slate-50 transition-colors"
                  >
                    <h4 className="font-semibold text-slate-900 pr-4 flex-1">{faq.question}</h4>
                    {expandedFAQ === index ? (
                      <HiChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                    ) : (
                      <HiChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                      <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div id="contact-section" className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-slate-200">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Still need help?
          </h3>
          <p className="text-slate-600 mb-8">
            Our support team is here to assist you with any questions or issues
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <HiOutlineEnvelope className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Email Support</h4>
                <p className="text-sm text-slate-600 mb-2">Get help via email</p>
                <a
                  href="mailto:support@landregistry.com"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  support@landregistry.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                <HiOutlinePhone className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Phone Support</h4>
                <p className="text-sm text-slate-600 mb-2">Mon-Fri, 9am-5pm</p>
                <a
                  href="tel:+1234567890"
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  +1 (234) 567-890
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                <HiOutlineChatBubbleLeftRight className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Live Chat</h4>
                <p className="text-sm text-slate-600 mb-2">Chat with our team</p>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  Start a conversation
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-4">Business Hours</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Monday - Friday:</span>
                <span className="font-medium text-slate-900">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Saturday:</span>
                <span className="font-medium text-slate-900">10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Sunday:</span>
                <span className="font-medium text-slate-900">Closed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Response Time:</span>
                <span className="font-medium text-slate-900">Within 24 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-slate-500">
            © 2026 Land Registry. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
