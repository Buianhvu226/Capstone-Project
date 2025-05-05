import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // <-- Set your backend API base URL here
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token')
      window.location.href = '/auth'
    }
    return Promise.reject(error.response ? error.response.data : error)
  }
)

export default api