import React, { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

interface AuthUser {
  id: number
  name: string
  email: string
  role: string
}

interface AuthContextType {
  walletAddress: string | null
  jwtToken: string | null
  user: AuthUser | null
  needsName: boolean
  connectWallet: () => Promise<void>
  completeWalletSetup: (name: string) => Promise<void>
  login: (token: string, user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)
export const tokenRef = { current: '' }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [jwtToken, setJwtToken] = useState<string | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [needsName, setNeedsName] = useState(false)
  const [pendingAddress, setPendingAddress] = useState<string | null>(null)

  useEffect(() => {
    if (!window.ethereum) return
    const handleAccountChange = () => {
      window.location.href = '/'
    }
    window.ethereum.on('accountsChanged', handleAccountChange)
    return () => window.ethereum.removeListener('accountsChanged', handleAccountChange)
  }, [])

  const connectWallet = async () => {
    if (!window.ethereum) throw new Error('MetaMask not found')
    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = await provider.getSigner()
    const address = await signer.getAddress()
    setWalletAddress(address)
    try {
      const res = await axios.get(`${BASE_URL}/auth/wallet/${address}`)
      tokenRef.current = res.data.token
      setJwtToken(res.data.token)
      setUser(res.data.user)
    } catch {
      setPendingAddress(address)
      setNeedsName(true)
    }
  }

  const completeWalletSetup = async (name: string) => {
    const address = pendingAddress || walletAddress
    const res = await axios.post(`${BASE_URL}/auth/register-wallet`, { name, walletAddress: address })
    tokenRef.current = res.data.token
    setJwtToken(res.data.token)
    setUser(res.data.user)
    setNeedsName(false)
    setPendingAddress(null)
  }

  const login = (token: string, u: AuthUser) => {
    tokenRef.current = token
    setJwtToken(token)
    setUser(u)
  }

  const logout = () => {
    setWalletAddress(null)
    setJwtToken(null)
    setUser(null)
    setNeedsName(false)
    tokenRef.current = ''
  }

  return (
    <AuthContext.Provider value={{ walletAddress, jwtToken, user, needsName, connectWallet, completeWalletSetup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
