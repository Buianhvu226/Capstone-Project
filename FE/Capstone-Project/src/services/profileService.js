import api from "./api";

const profileService = {
  // Các phương thức hiện có
  getProfiles(params = {}) {
    return api.get("/profiles/", { params });
  },

  createProfile(profileData) {
    return api.post("/profiles/", profileData);
  },

  getProfileById(id) {
    return api.get(`/profiles/${id}/`);
  },

  updateProfile(id, profileData) {
    const { id: _, ...dataToSend } = profileData;
    return api.put(`/profiles/${id}/`, dataToSend);
  },

  // Thêm các phương thức mới

  // Lấy tất cả hồ sơ của người dùng hiện tại
  getMyProfiles(page = 1) {
    return api.get(`/profiles/my_all_profiles/`, {
      params: { page },
    });
  },

  // Xóa hồ sơ
  deleteProfile(id) {
    return api.delete(`/profiles/${id}/`);
  },

  // Lấy tất cả hồ sơ được gợi ý
  getAllSuggestedProfiles(page = 1) {
    return api.get(`/profiles/all_suggested_profiles/`, {
      params: { page },
    });
  },

  // Lấy tất cả hồ sơ tham chiếu
  getAllReferencedProfiles(page = 1) {
    return api.get(`/profiles/all_referenced_profiles/`, {
      params: { page },
    });
  },

  // Lấy hồ sơ được gợi ý cho một hồ sơ cụ thể
  getSuggestedProfiles(profileId) {
    return api.get(`/profiles/${profileId}/suggested_profiles/`);
  },

  // Cập nhật trạng thái hồ sơ
  updateProfileStatus(profileId, status) {
    return api.patch(`/profiles/${profileId}/`, { status });
  },

  // Cập nhật trạng thái xác nhận gợi ý
  updateSuggestionMatchStatus(suggestionId, status) {
    return api.post(`/profile-match-suggestion/${suggestionId}/update_status/`, { match_status: status });
  },
};

export default profileService;
