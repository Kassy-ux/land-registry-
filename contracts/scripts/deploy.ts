import hre from 'hardhat'
import fs from 'fs'
import path from 'path'

async function main() {
  console.log('Deploying contracts to Sepolia...')

  const landRegistry = await hre.ethers.deployContract('LandRegistry')
  await landRegistry.waitForDeployment()
  const landRegistryAddress = await landRegistry.getAddress()
  console.log('LandRegistry deployed to:', landRegistryAddress)

  const ownership = await hre.ethers.deployContract('Ownership')
  await ownership.waitForDeployment()
  const ownershipAddress = await ownership.getAddress()
  console.log('Ownership deployed to:', ownershipAddress)

  const verification = await hre.ethers.deployContract('Verification', [
    landRegistryAddress,
    ownershipAddress
  ])
  await verification.waitForDeployment()
  const verificationAddress = await verification.getAddress()
  console.log('Verification deployed to:', verificationAddress)

  const deployments = {
    sepolia: {
      LandRegistry: landRegistryAddress,
      Ownership: ownershipAddress,
      Verification: verificationAddress
    }
  }

  fs.writeFileSync(
    path.join(__dirname, '../deployments.json'),
    JSON.stringify(deployments, null, 2)
  )
  console.log('Deployments saved to deployments.json')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
