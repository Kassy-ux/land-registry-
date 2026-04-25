import React, { createContext, useContext, useState } from 'react'
import { ethers } from 'ethers'
import api from '../services/api'

interface AuthContextType {
  walletAddress: string | null
  jwtToken: string | null
  connectWallet: () => Promise<void>
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(
    localStorage.getItem('wallet_address')
  )
  const [jwtToken, setJwtToken] = useState<string | null>(
    localStorage.getItem('jwt_token')
  )

  const connectWallet = async () => {
    if (!window.ethereum) throw new Error('MetaMask not found')
    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = await provider.getSigner()
    const address = await signer.getAddress()
    const message = `Login to Land Registry: ${address}`
    const signature = await signer.signMessage(message)
    const res = await api.post('/auth/wallet', { address, message, signature })
    setWalletAddress(address)
    setJwtToken(res.data.token)
    localStorage.setItem('wallet_address', address)
    localStorage.setItem('jwt_token', res.data.token)
  }

  const login = (token: string) => {
    setJwtToken(token)
    localStorage.setItem('jwt_token', token)
  }

  const logout = () => {
    setWalletAddress(null)
    setJwtToken(null)
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('wallet_address')
  }

  return (
    <AuthContext.Provider value={{ walletAddress, jwtToken, connectWallet, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
