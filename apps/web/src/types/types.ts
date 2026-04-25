export interface User {
  id: number
  name: string
  email: string
  role: string
}

export interface LandParcel {
  id: number
  titleNumber: string
  location: string
  size: number
  createdAt: string
}

export interface Transaction {
  id: number
  landId: number
  sellerId: number
  buyerId: number
  status: string
  transactionDate: string
}

export interface Document {
  id: number
  landId: number
  fileHash: string
  documentType: string
}
