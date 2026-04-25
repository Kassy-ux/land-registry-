import { ethers } from 'ethers'
import LandRegistryABI from '../abis/LandRegistry.json'
import OwnershipABI from '../abis/Ownership.json'
import VerificationABI from '../abis/Verification.json'
import dotenv from 'dotenv'
dotenv.config()

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '', provider)

export const landRegistryContract = new ethers.Contract(
  process.env.LAND_REGISTRY_ADDRESS || '',
  LandRegistryABI.abi,
  wallet
)

export const ownershipContract = new ethers.Contract(
  process.env.OWNERSHIP_ADDRESS || '',
  OwnershipABI.abi,
  wallet
)

export const verificationContract = new ethers.Contract(
  process.env.VERIFICATION_ADDRESS || '',
  VerificationABI.abi,
  provider
)
