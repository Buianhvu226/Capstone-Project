import api from './api';

const commentService = {
  // Lấy danh sách bình luận của hồ sơ
  async getComments(profileId, page = 1) {
    const res = await api.get(`/profiles/${profileId}/comments/`, { params: { page } });
    return res.data;
  },

  // Thêm bình luận mới cho hồ sơ
  async postComment(profileId, content) {
    const res = await api.post(`/profiles/${profileId}/comments/`, { content });
    return res.data;
  },

  // (Có thể bổ sung các hàm khác như xóa, sửa, like comment...)
};

export default commentService;