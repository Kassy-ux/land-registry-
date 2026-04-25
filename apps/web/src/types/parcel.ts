export interface ParcelOwnership {
  id: number
  user: {
    id: number
    name: string
    email: string
    walletAddress: string | null
  }
}

export interface ParcelDocument {
  id: number
  fileHash: string
  documentType: string
}

export interface BlockchainRecord {
  id: number
  blockHash: string
  timestamp: string
}

export interface Parcel {
  id: number
  titleNumber: string
  location: string
  size: number
  status: string
  createdAt: string
  ownerships?: ParcelOwnership[]
  documents?: ParcelDocument[]
  blockchainRecords?: BlockchainRecord[]
}
