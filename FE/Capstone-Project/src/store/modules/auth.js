import authService from "../../services/authService";

export default {
  namespaced: true,
  state: {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    authError: (state) => state.error,
    isLoading: (state) => state.loading,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      // Lưu thêm vào localStorage để dự phòng
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    },
    SET_TOKEN(state, token) {
      state.token = token;
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_AUTH(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  actions: {
    // ✅ Thêm action initializeAuth
    async initializeAuth({ commit, state }) {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      console.log("🔄 Initializing auth...", {
        hasToken: !!token,
        hasSavedUser: !!savedUser,
      });

      if (token) {
        try {
          // Set token first
          commit("SET_TOKEN", token);

          // Nếu có user trong localStorage, dùng nó trước
          if (savedUser && !state.user) {
            try {
              const user = JSON.parse(savedUser);
              commit("SET_USER", user);
              console.log("✅ Restored user from localStorage:", user);
            } catch (e) {
              console.error("❌ Error parsing saved user:", e);
              localStorage.removeItem("user");
            }
          }

          // Sau đó fetch user mới nhất từ server (optional, không throw error nếu fail)
          try {
            const freshUser = await authService.getCurrentUser();
            if (freshUser.data) {
              commit("SET_USER", freshUser.data);
              console.log("✅ Refreshed user from server:", freshUser.data);
            }
          } catch (serverError) {
            console.warn(
              "⚠️ Could not refresh user from server:",
              serverError.message
            );
            // Không throw error, vẫn dùng cached user
          }

          console.log("✅ Auth initialized successfully");
        } catch (error) {
          console.error("❌ Auth initialization failed:", error);
          // Token không hợp lệ, clear auth
          commit("CLEAR_AUTH");
          throw error;
        }
      } else {
        console.log("ℹ️ No token found, user not authenticated");
      }
    },

    async login({ commit }, credentials) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const response = await authService.login(credentials);
        const data = response.data;
        commit("SET_USER", data.user);
        commit("SET_TOKEN", data.access);
        console.log("✅ Login successful:", data.user);
        return data;
      } catch (error) {
        const errorMessage =
          error.response?.data?.detail || "Đăng nhập thất bại";
        commit("SET_ERROR", errorMessage);
        console.error("❌ Login failed:", errorMessage);
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async register({ commit }, userData) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const response = await authService.register(userData);
        const data = response.data;
        commit("SET_USER", data.user);
        commit("SET_TOKEN", data.token);
        console.log("✅ Register successful:", data.user);
        return data.user;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Đăng ký thất bại";
        commit("SET_ERROR", errorMessage);
        console.error("❌ Register failed:", errorMessage);
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchCurrentUser({ commit }) {
      commit("SET_LOADING", true);
      try {
        const response = await authService.getCurrentUser();
        const user = response.data;
        commit("SET_USER", user);
        console.log("✅ Fetched current user:", user);
        return user;
      } catch (error) {
        console.error("❌ Failed to fetch current user:", error);
        commit("SET_ERROR", error.response?.data?.message || error.message);
        commit("CLEAR_AUTH");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    logout({ commit }) {
      commit("CLEAR_AUTH");
      console.log("✅ Logout successful");
    },
  },
};
