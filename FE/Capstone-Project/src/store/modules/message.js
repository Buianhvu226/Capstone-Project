import messageService from '../../services/messageService'

export default {
  namespaced: true,
  state: {
    conversations: [],
    currentConversation: null,
    messages: [],
    loading: false,
    error: null
  },
  getters: {
    allConversations: state => state.conversations,
    currentConversation: state => state.currentConversation,
    conversationMessages: state => state.messages,
    isLoading: state => state.loading,
    hasError: state => !!state.error
  },
  mutations: {
    SET_CONVERSATIONS(state, conversations) {
      state.conversations = conversations
    },
    SET_CURRENT_CONVERSATION(state, conversation) {
      state.currentConversation = conversation
    },
    SET_MESSAGES(state, messages) {
      state.messages = messages
    },
    ADD_MESSAGE(state, message) {
      state.messages.push(message)
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  actions: {
    async fetchConversations({ commit }) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        const conversations = await messageService.getConversations()
        commit('SET_CONVERSATIONS', conversations)
        return conversations
      } catch (error) {
        commit('SET_ERROR', error.message || 'Không thể tải danh sách cuộc trò chuyện')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async fetchMessages({ commit }, conversationId) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        const messages = await messageService.getMessages(conversationId)
        commit('SET_MESSAGES', messages)
        return messages
      } catch (error) {
        commit('SET_ERROR', error.message || 'Không thể tải tin nhắn')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async sendMessage({ commit }, { conversationId, content }) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        const message = await messageService.sendMessage(conversationId, content)
        commit('ADD_MESSAGE', message)
        return message
      } catch (error) {
        commit('SET_ERROR', error.message || 'Không thể gửi tin nhắn')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async startConversation({ commit }, userId) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        const conversation = await messageService.startConversation(userId)
        commit('SET_CURRENT_CONVERSATION', conversation)
        return conversation
      } catch (error) {
        commit('SET_ERROR', error.message || 'Không thể bắt đầu cuộc trò chuyện')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
}