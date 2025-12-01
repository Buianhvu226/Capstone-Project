import api from "./api";
import cacheService from "./cacheService";

const profileService = {
  // Các phương thức hiện có
  async getProfiles(params = {}) {
    // Kiểm tra cache trước
    const cachedData = cacheService.getCache(params);
    if (cachedData) {
      return { data: cachedData };
    }
    
    // Nếu không có cache, gọi API
    const response = await api.get("/profiles/", { params });
    
    // Lưu vào cache
    cacheService.setCache(params, response.data);
    
    return response;
  },

  async createProfile(profileData) {
    const response = await api.post("/profiles/", profileData);
    // Xóa cache khi tạo profile mới
    cacheService.clearAllCache();
    return response;
  },

  getProfileById(id) {
    return api.get(`/profiles/${id}/`);
  },

  async updateProfile(id, profileData) {
    const { id: _, ...dataToSend } = profileData;
    const response = await api.put(`/profiles/${id}/`, dataToSend);
    // Xóa cache khi cập nhật profile
    cacheService.clearAllCache();
    return response;
  },

  // Thêm các phương thức mới

  // Lấy tất cả hồ sơ của người dùng hiện tại
  async getMyProfiles(page = 1, ordering = '-created_at') {
    const params = { page, ordering };
    
    // Kiểm tra cache trước
    const cacheKey = { endpoint: 'my_all_profiles', ...params };
    const cachedData = cacheService.getCache(cacheKey);
    if (cachedData) {
      return { data: cachedData };
    }
    
    // Nếu không có cache, gọi API
    const response = await api.get(`/profiles/my_all_profiles/`, { params });
    
    // Lưu vào cache
    cacheService.setCache(cacheKey, response.data);
    
    return response;
  },

  // Xóa hồ sơ
  async deleteProfile(id) {
    const response = await api.delete(`/profiles/${id}/`);
    // Xóa cache khi xóa profile
    cacheService.clearAllCache();
    return response;
  },

  // Lấy tất cả hồ sơ được gợi ý
  async getAllSuggestedProfiles(page = 1, ordering = '-created_at') {
    const params = { page, ordering };
    
    // Kiểm tra cache trước
    const cacheKey = { endpoint: 'all_suggested_profiles', ...params };
    const cachedData = cacheService.getCache(cacheKey);
    if (cachedData) {
      return { data: cachedData };
    }
    
    // Nếu không có cache, gọi API
    const response = await api.get(`/profiles/all_suggested_profiles/`, { params });
    
    // Lưu vào cache
    cacheService.setCache(cacheKey, response.data);
    
    return response;
  },

  // Lấy tất cả hồ sơ tham chiếu
  async getAllReferencedProfiles(page = 1, ordering = '-created_at') {
    const params = { page, ordering };
    
    // Kiểm tra cache trước
    const cacheKey = { endpoint: 'all_referenced_profiles', ...params };
    const cachedData = cacheService.getCache(cacheKey);
    if (cachedData) {
      return { data: cachedData };
    }
    
    // Nếu không có cache, gọi API
    const response = await api.get(`/profiles/all_referenced_profiles/`, { params });
    
    // Lưu vào cache
    cacheService.setCache(cacheKey, response.data);
    
    return response;
  },

  // Lấy hồ sơ được gợi ý cho một hồ sơ cụ thể
  getSuggestedProfiles(profileId) {
    return api.get(`/profiles/${profileId}/suggested_profiles/`);
  },

  // Cập nhật trạng thái hồ sơ
  async updateProfileStatus(profileId, status) {
    const response = await api.patch(`/profiles/${profileId}/`, { status });
    // Xóa cache khi cập nhật trạng thái
    cacheService.clearAllCache();
    return response;
  },

  // Cập nhật trạng thái xác nhận gợi ý
  updateSuggestionMatchStatus(suggestionId, status) {
    return api.post(`/profile-match-suggestion/${suggestionId}/update_status/`, { match_status: status });
  },
};

export default profileService;
