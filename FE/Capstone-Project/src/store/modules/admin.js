// Thêm import api
import api from "../../services/api";

const state = {
  users: {
    results: [],
    count: 0,
    next: null,
    previous: null,
  },
  currentUser: null, // Thêm state để lưu thông tin người dùng hiện tại
  loading: false,
  error: null,
};

const mutations = {
  SET_USERS(state, users) {
    state.users = users;
  },
  SET_CURRENT_USER(state, user) {
    // Thêm mutation để cập nhật currentUser
    state.currentUser = user;
  },
  SET_LOADING(state, status) {
    state.loading = status;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
};

const actions = {
  async fetchUsers({ commit }, url) {
    try {
      // Sử dụng api instance thay vì axios trực tiếp
      const response = await api.get(url);
      commit("SET_USERS", response.data);
      commit("SET_ERROR", null);
    } catch (error) {
      console.error("Error fetching users:", error);
      commit("SET_ERROR", "Không thể tải danh sách người dùng");
      throw error;
    }
  },
  // Thêm action fetchUser để lấy thông tin chi tiết người dùng
  async fetchUser({ commit }, id) {
    try {
      const response = await api.get(`/users/${id}/`);
      commit("SET_CURRENT_USER", response.data);
      commit("SET_ERROR", null);
    } catch (error) {
      console.error("Error fetching user details:", error);
      commit("SET_ERROR", "Không thể tải thông tin người dùng");
      throw error;
    }
  },
  async toggleUserStatus({ commit, dispatch }, { id, is_active }) {
    try {
      // Sử dụng api instance thay vì axios trực tiếp
      await api.patch(`/users/${id}/`, { is_active });
      // Refresh user list after toggling status
      await dispatch(
        "fetchUsers",
        `${import.meta.env.VITE_APP_API_URL}/api/users/`
      );
      commit("SET_ERROR", null);
    } catch (error) {
      console.error("Error toggling user status:", error);
      commit("SET_ERROR", "Không thể cập nhật trạng thái người dùng");
      throw error;
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
