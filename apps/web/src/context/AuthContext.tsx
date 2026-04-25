import React, { createContext, useContext, useEffect, useState } from 'react'
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

  const persistSession = (address: string | null, token: string | null) => {
    setWalletAddress(address)
    setJwtToken(token)
    if (address) localStorage.setItem('wallet_address', address)
    else localStorage.removeItem('wallet_address')
    if (token) localStorage.setItem('jwt_token', token)
    else localStorage.removeItem('jwt_token')
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error(
        'MetaMask is not installed. Install it from metamask.io and refresh the page.'
      )
    }
    const provider = new ethers.BrowserProvider(window.ethereum)
    const accounts = (await provider.send('eth_requestAccounts', [])) as string[]
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts returned from MetaMask')
    }
    const signer = await provider.getSigner()
    const address = await signer.getAddress()
    const message = `Login to Land Registry: ${address}`
    const signature = await signer.signMessage(message)
    const res = await api.post('/auth/wallet', { address, message, signature })
    persistSession(address, res.data.token)
  }

  const login = (token: string) => {
    setJwtToken(token)
    localStorage.setItem('jwt_token', token)
  }

  const logout = () => {
    persistSession(null, null)
  }

  // React to MetaMask account / chain changes so the app never holds a session
  // for an account the user has switched away from.
  useEffect(() => {
    const eth = window.ethereum
    if (!eth || typeof eth.on !== 'function') return

    const onAccountsChanged = (...args: unknown[]) => {
      if (!walletAddress) return
      const accounts = (args[0] as string[] | undefined) ?? []
      const next = accounts[0]?.toLowerCase()
      if (!next || next !== walletAddress.toLowerCase()) {
        // Wallet disconnected or switched to another account -> clear our session.
        persistSession(null, null)
      }
    }

    const onChainChanged = () => {
      // Chain change is a hard reload per MetaMask's docs.
      window.location.reload()
    }

    eth.on('accountsChanged', onAccountsChanged)
    eth.on('chainChanged', onChainChanged)
    return () => {
      eth.removeListener?.('accountsChanged', onAccountsChanged)
      eth.removeListener?.('chainChanged', onChainChanged)
    }
  }, [walletAddress])

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
