import PinataClient from '@pinata/sdk'

let _pinata: PinataClient | null = null

function getPinata(): PinataClient {
  if (_pinata) return _pinata
  const key = process.env.PINATA_API_KEY
  const secret = process.env.PINATA_SECRET_KEY
  if (!key || !secret) {
    throw new Error('Pinata credentials are not configured. Set PINATA_API_KEY and PINATA_SECRET_KEY.')
  }
  _pinata = new PinataClient(key, secret)
  return _pinata
}

const pinata = new Proxy({} as PinataClient, {
  get(_target, prop: string | symbol) {
    const client = getPinata() as unknown as Record<string | symbol, unknown>
    const value = client[prop]
    return typeof value === 'function' ? (value as Function).bind(client) : value
  },
})

export default pinata
