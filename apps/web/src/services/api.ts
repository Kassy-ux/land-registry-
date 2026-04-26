import axios from 'axios'
import { tokenRef } from '../context/AuthContext'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
})

api.interceptors.request.use((config) => {
  if (tokenRef.current) {
    config.headers.Authorization = `Bearer ${tokenRef.current}`
  }
  return config
})

export default api
