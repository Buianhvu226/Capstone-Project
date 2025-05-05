import authService from '../../services/authService'

export default {
  namespaced: true,
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  },
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    authError: state => state.error,
    isLoading: state => state.loading
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    CLEAR_AUTH(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    }
  },
  actions: {
    async login({ commit }, credentials) {
      commit('setLoading', true)
      commit('setAuthError', null)
      try {
        const response = await authService.login(credentials)
        // Save tokens/user info to state if needed
        commit('setUser', response.user)
        commit('setToken', response.access)
        // Return the response so the component can use it
        return response
      } catch (error) {
        commit('setAuthError', error.detail || 'Đăng nhập thất bại')
        throw error
      } finally {
        commit('setLoading', false)
      }
    },
    async register({ commit }, userData) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        const { user, token } = await authService.register(userData)
        commit('SET_USER', user)
        commit('SET_TOKEN', token)
        return user
      } catch (error) {
        commit('SET_ERROR', error.message || 'Đăng ký thất bại')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async fetchCurrentUser({ commit }) {
      try {
        commit('SET_LOADING', true)
        const user = await authService.getCurrentUser()
        commit('SET_USER', user)
        return user
      } catch (error) {
        commit('SET_ERROR', error.message)
        commit('CLEAR_AUTH')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    logout({ commit }) {
      commit('CLEAR_AUTH')
    }
  }
}