import recentlyMissingService from "@/services/recentlyMissingService";

const state = {
  missingReports: [],
  currentMissingReport: null,
  publicMissingReports: [],
  myReports: [],
  matches: [],
  loading: false,
  error: null,

  // Pagination
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  },

  // Filters
  filters: {
    profile_type: "",
    location: "",
    name: "",
    status: "active",
  },
};

const mutations = {
  SET_LOADING(state, loading) {
    state.loading = loading;
  },

  SET_ERROR(state, error) {
    state.error = error;
  },

  SET_MISSING_REPORTS(state, reports) {
    state.missingReports = reports; // ✅ Đổi tên
  },

  SET_CURRENT_MISSING_REPORT(state, report) {
    state.currentMissingReport = report; // ✅ Đổi tên
  },

  SET_PUBLIC_MISSING_REPORTS(state, reports) {
    state.publicMissingReports = reports; // ✅ Đổi tên
  },

  SET_MY_REPORTS(state, reports) {
    state.myReports = reports;
  },

  ADD_MISSING_REPORT(state, report) {
    state.missingReports.unshift(report); // ✅ Đổi tên
  },

  UPDATE_MISSING_REPORT(state, updatedReport) {
    const index = state.missingReports.findIndex(
      (r) => r.id === updatedReport.id
    ); // ✅ Đổi tên
    if (index !== -1) {
      state.missingReports.splice(index, 1, updatedReport); // ✅ Đổi tên
    }
  },

  REMOVE_MISSING_REPORT(state, reportId) {
    state.missingReports = state.missingReports.filter(
      (r) => r.id !== reportId
    ); // ✅ Đổi tên
  },

  SET_MATCHES(state, matches) {
    state.matches = matches;
  },

  SET_PAGINATION(state, pagination) {
    state.pagination = { ...state.pagination, ...pagination };
  },

  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters };
  },
};

const actions = {
  // Fetch missing reports của user hiện tại
  async fetchMissingReports({ commit, state }) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      const params = {
        page: state.pagination.page,
        page_size: state.pagination.pageSize,
        ...state.filters,
      };

      const response = await recentlyMissingService.getMissingReports(params); // ✅ Đổi tên method

      commit("SET_MISSING_REPORTS", response.results || response); // ✅ Đổi tên

      if (response.count !== undefined) {
        commit("SET_PAGINATION", {
          total: response.count,
          totalPages: Math.ceil(response.count / state.pagination.pageSize),
        });
      }
    } catch (error) {
      console.error("Error fetching missing reports:", error); // ✅ Đổi log
      commit(
        "SET_ERROR",
        error.message || "Không thể tải danh sách báo cáo missing"
      ); // ✅ Đổi message
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // Fetch public missing reports
  async fetchPublicMissingReports({ commit, state }) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      console.log("📤 Calling API to fetch public missing reports...");

      const params = {
        page: state.pagination.page,
        page_size: state.pagination.pageSize,
        ...state.filters,
      };

      const response = await recentlyMissingService.getPublicMissingReports(
        params
      ); // ✅ Đổi tên method

      console.log("📥 API response for public missing reports:", response);

      // ✅ Đảm bảo commit đúng data
      const reports = response.results || response || [];
      commit("SET_PUBLIC_MISSING_REPORTS", reports);

      if (response.count !== undefined) {
        commit("SET_PAGINATION", {
          total: response.count,
          totalPages: Math.ceil(response.count / state.pagination.pageSize),
        });
      }

      console.log("✅ Successfully loaded missing reports:", reports.length);
    } catch (error) {
      console.error("❌ Error fetching public missing reports:", error);
      commit(
        "SET_ERROR",
        error.message || "Không thể tải danh sách báo cáo missing công khai"
      ); // ✅ Đổi message

      // ✅ Set empty array on error để tránh undefined
      commit("SET_PUBLIC_MISSING_REPORTS", []);
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // Fetch missing report by ID  # ✅ Đổi comment
  async fetchMissingReportById({ commit }, reportId) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      console.log("📤 Vuex: Fetching missing report by ID:", reportId); // ✅ Đổi log

      const report = await recentlyMissingService.getMissingReportById(
        reportId
      ); // ✅ Đổi tên method và param

      console.log("📥 Vuex: Received missing report:", report); // ✅ Đổi log

      commit("SET_CURRENT_MISSING_REPORT", report); // ✅ Đổi tên

      return report;
    } catch (error) {
      console.error("❌ Vuex: Error fetching missing report:", error);
      commit("SET_ERROR", error.message || "Không thể tải báo cáo missing");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // Create missing report  # ✅ Đổi comment
  async createMissingReport({ commit }, reportData) {
    try {
      console.log("📤 Sending missing report data to API:", reportData); // ✅ Đổi log

      const response = await recentlyMissingService.createMissingReport(
        reportData
      ); // ✅ Đổi tên method và param

      console.log("📥 Received response from API:", response);

      // Đảm bảo response có đầy đủ data và ID
      if (!response || !response.id) {
        throw new Error("Server response missing report ID"); // ✅ Đổi message
      }

      // Commit to store
      commit("ADD_MISSING_REPORT", response); // ✅ Đổi tên

      // Trả về report data với ID
      return response;
    } catch (error) {
      console.error("❌ Error in createMissingReport action:", error); // ✅ Đổi log

      // Re-throw để component có thể catch
      throw error;
    }
  },

  // Upload image cho missing report  # ✅ Đổi comment
  async uploadMissingReportImage({ commit }, { reportId, imageUrl }) {
    try {
      commit("SET_LOADING", true);

      const response = await recentlyMissingService.uploadMissingReportImage(
        reportId,
        imageUrl
      ); // ✅ Đổi tên method và param

      // Update current missing report  # ✅ Đổi comment
      commit("SET_CURRENT_MISSING_REPORT", response.report); // ✅ Đổi key
      commit("UPDATE_MISSING_REPORT", response.report); // ✅ Đổi tên và key

      return response;
    } catch (error) {
      console.error("Error uploading missing report image:", error); // ✅ Đổi log
      commit(
        "SET_ERROR",
        error.message || "Không thể upload ảnh cho báo cáo missing"
      ); // ✅ Đổi message
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // Fetch matches cho missing report  # ✅ Đổi comment
  async fetchMissingReportMatches({ commit }, reportId) {
    try {
      commit("SET_LOADING", true);

      const matches = await recentlyMissingService.getMissingReportMatches(
        reportId
      ); // ✅ Đổi tên method và param

      commit("SET_MATCHES", matches);

      return matches;
    } catch (error) {
      console.error("Error fetching missing report matches:", error); // ✅ Đổi log
      commit("SET_ERROR", error.message || "Không thể tải kết quả khớp");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async fetchMyReports({ commit }) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      const response = await recentlyMissingService.getMyReports();
      commit("SET_MY_REPORTS", response.results || response || []); // Lưu response.results
    } catch (error) {
      console.error("Error fetching my reports:", error);
      commit(
        "SET_ERROR",
        error.message || "Không thể tải danh sách báo cáo của bạn"
      );
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async fetchFaceMatches({ commit }, reportId) {
    try {
      commit("SET_LOADING", true);
      const response = await recentlyMissingService.findFaceMatches(reportId);
      commit("SET_MATCHES", response.matches);
      return response;
    } catch (error) {
      console.error("❌ Error fetching face matches:", error);
      commit("SET_ERROR", error.message || "Không thể tìm kiếm khuôn mặt");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async analyzeMatchesWithLLM(
    { commit },
    { current_report_id, other_report_ids }
  ) {
    try {
      commit("SET_LOADING", true);
      const response = await recentlyMissingService.analyzeMatchesWithLLM(
        current_report_id,
        other_report_ids
      );
      return response;
    } catch (error) {
      console.error("❌ Error analyzing matches with LLM:", error);
      commit(
        "SET_ERROR",
        error.message || "Không thể phân tích kết quả khớp AI"
      );
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // Other actions...
  updateFilters({ commit }, filters) {
    commit("SET_FILTERS", filters);
  },

  updatePagination({ commit }, pagination) {
    commit("SET_PAGINATION", pagination);
  },

  clearError({ commit }) {
    commit("SET_ERROR", null);
  },

  clearCurrentMissingReport({ commit }) {
    commit("SET_CURRENT_MISSING_REPORT", null); // ✅ Đổi tên
  },

  // ✅ Action chính đã được cập nhật
  async deleteMissingReport({ commit }, reportId) {
    try {
      commit("SET_LOADING", true);
      await recentlyMissingService.deleteMissingReport(reportId);
      commit("REMOVE_MISSING_REPORT", reportId);
      commit("SET_CURRENT_MISSING_REPORT", null);
      return true;
    } catch (error) {
      console.error("❌ Error deleting missing report:", error);
      commit("SET_ERROR", error.message || "Không thể xóa báo cáo missing");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },
  
  // Fetch statistics for missing reports
  async fetchStatistics({ commit }) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      
      const response = await recentlyMissingService.getStatistics();
      return response; // Return the response directly to be used in the component
    } catch (error) {
      commit("SET_ERROR", error.message || "Failed to fetch statistics");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },
};

const getters = {
  // ❌ Có thể getter này không tồn tại hoặc sai tên
  // getProfiles: state => state.publicMissingReports,  // Nếu có getter này

  // ✅ Đảm bảo có getter đúng tên
  missingReports: (state) => state.missingReports || [], // ✅ Fallback to empty array
  currentMissingReport: (state) => state.currentMissingReport,
  publicMissingReports: (state) => state.publicMissingReports || [], // ✅ Fallback to empty array
  matches: (state) => state.matches || [],
  loading: (state) => state.loading,
  error: (state) => state.error,
  pagination: (state) => state.pagination,
  filters: (state) => state.filters,

  // ✅ Thêm getter mà component đang dùng
  getProfiles: (state) => state.publicMissingReports || [], // ✅ Thêm getter này
  isLoading: (state) => state.loading, // ✅ Alias cho loading
  getError: (state) => state.error, // ✅ Alias cho error

  myReports: (state) => state.myReports || [],

  // Computed getters
  activeMissingReports: (state) =>
    (state.missingReports || []).filter((r) => r.status === "active"),
  seekerReports: (state) =>
    (state.publicMissingReports || []).filter(
      (r) => r.profile_type === "seeker"
    ),
  finderReports: (state) =>
    (state.publicMissingReports || []).filter(
      (r) => r.profile_type === "finder"
    ),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
