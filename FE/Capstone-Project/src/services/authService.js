import api from './api'

export default {
  async login(credentials) {
    return api.post('/auth/login/', credentials) // <-- add trailing slash
  },
  
  async register(userData) {
    return api.post('/auth/register/', userData) // <-- add trailing slash
  },
  
  async getCurrentUser() {
    return api.get('/auth/me/') // <-- add trailing slash
  }
}