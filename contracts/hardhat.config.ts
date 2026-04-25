import type { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-ethers'
import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

const config: HardhatUserConfig = {
  solidity: '0.8.24',
  networks: {
    sepolia: {
      type: 'http',
      url: process.env.SEPOLIA_RPC_URL || '',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
}

export default config
