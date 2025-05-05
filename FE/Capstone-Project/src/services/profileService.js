import api from './api'

export default {
  async getProfiles(filters = {}) {
    // filters can include page, name, losing_year, born_year, etc.
    return api.get('/profiles/', { params: filters })
  },

  async getProfileById(id) {
    return api.get(`/profiles/${id}`)
  },

  async createProfile(profileData) {
    const formData = new FormData()
    Object.keys(profileData).forEach(key => {
      if (key !== 'images' && profileData[key] !== undefined) {
        formData.append(key, profileData[key])
      }
    })
    if (profileData.images && profileData.images.length) {
      profileData.images.forEach(image => {
        formData.append('images', image)
      })
    }
    return api.post('/profiles/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  async updateProfile(id, profileData) {
    const formData = new FormData()
    Object.keys(profileData).forEach(key => {
      if (key !== 'images' && profileData[key] !== undefined) {
        formData.append(key, profileData[key])
      }
    })
    if (profileData.images && profileData.images.length) {
      profileData.images.forEach(image => {
        formData.append('images', image)
      })
    }
    return api.put(`/profiles/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  async getSuggestedProfiles(profileId) {
    return api.get(`/profiles/${profileId}/suggestions`)
  }
}