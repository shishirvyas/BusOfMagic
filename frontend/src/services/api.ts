// API Service stub - will be connected to backend
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

export default apiClient
