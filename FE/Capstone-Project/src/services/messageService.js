import api from './api'

export default {
  async getConversations() {
    return api.get('/conversations')
  },
  
  async getMessages(conversationId) {
    return api.get(`/conversations/${conversationId}/messages`)
  },
  
  async sendMessage(conversationId, content) {
    return api.post(`/conversations/${conversationId}/messages`, { content })
  },
  
  async startConversation(userId) {
    return api.post('/conversations', { userId })
  }
}