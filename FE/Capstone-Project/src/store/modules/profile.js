import profileService from '../../services/profileService'

export default {
  namespaced: true,
  state: {
    profiles: [],
    currentProfile: null,
    suggestedProfiles: [],
    loading: false,
    error: null
  },
  getters: {
    allProfiles: state => state.profiles,
    currentProfile: state => state.currentProfile,
    suggestedProfiles: state => state.suggestedProfiles,
    isLoading: state => state.loading,
    hasError: state => !!state.error
  },
  mutations: {
    SET_PROFILES(state, profiles) {
      state.profiles = profiles
    },
    SET_CURRENT_PROFILE(state, profile) {
      state.currentProfile = profile
    },
    SET_SUGGESTED_PROFILES(state, profiles) {
      state.suggestedProfiles = profiles
    },
    ADD_PROFILE(state, profile) {
      state.profiles.unshift(profile)
    },
    UPDATE_PROFILE(state, updatedProfile) {
      const index = state.profiles.findIndex(p => p.id === updatedProfile.id)
      if (index !== -1) {
        state.profiles.splice(index, 1, updatedProfile)
      }
      if (state.currentProfile && state.currentProfile.id === updatedProfile.id) {
        state.currentProfile = updatedProfile
      }
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  actions: {
    async fetchProfiles({ commit }, filters = {}) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        const profiles = await profileService.getProfiles(filters)
        commit('SET_PROFILES', profiles)
        return profiles
      } catch (error) {
        commit('SET_ERROR', error.message || 'Không thể tải danh sách hồ sơ')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async fetchProfileById({ commit }, id) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        const profile = await profileService.getProfileById(id)
        commit('SET_CURRENT_PROFILE', profile)
        return profile
      } catch (error) {
        commit('SET_ERROR', error.message || 'Không thể tải thông tin hồ sơ')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async createProfile({ commit }, profileData) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        const newProfile = await profileService.createProfile(profileData)
        commit('ADD_PROFILE', newProfile)
        return newProfile
      } catch (error) {
        commit('SET_ERROR', error.message || 'Không thể tạo hồ sơ')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async updateProfile({ commit }, { id, profileData }) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        const updatedProfile = await profileService.updateProfile(id, profileData)
        commit('UPDATE_PROFILE', updatedProfile)
        return updatedProfile
      } catch (error) {
        commit('SET_ERROR', error.message || 'Không thể cập nhật hồ sơ')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async fetchSuggestedProfiles({ commit }, profileId) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        const suggestedProfiles = await profileService.getSuggestedProfiles(profileId)
        commit('SET_SUGGESTED_PROFILES', suggestedProfiles)
        return suggestedProfiles
      } catch (error) {
        commit('SET_ERROR', error.message || 'Không thể tải gợi ý hồ sơ')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
}