import api from "./api";

const recentlyMissingService = {
  /**
   * Lấy danh sách báo cáo missing gần đây với các filter
   */
  async getMissingReports(params = {}) {
    try {
      const response = await api.get("/recently-missing/reports/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching missing reports:", error);
      throw error;
    }
  },

  /**
   * Lấy danh sách báo cáo missing công khai
   */
  async getPublicMissingReports(params = {}) {
    try {
      console.log("🌐 API call: getPublicMissingReports with params:", params);

      const response = await api.get("/recently-missing/reports/public/", {
        params,
      });

      console.log("🌐 API response:", response.data);

      // ✅ Đảm bảo luôn trả về array
      if (!response.data) {
        console.warn("⚠️ API returned no data");
        return [];
      }

      // Handle pagination response
      if (response.data.results && Array.isArray(response.data.results)) {
        return response.data; // Return full pagination object
      }

      // Handle direct array response
      if (Array.isArray(response.data)) {
        return response.data;
      }

      console.warn("⚠️ API response is not an array:", response.data);
      return [];
    } catch (error) {
      console.error("❌ Error fetching public missing reports:", error);
      throw error;
    }
  },

  async getMyReports(params = {}) {
    try {
      const response = await api.get("/recently-missing/my-reports/", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching my reports:", error);
      throw error;
    }
  },

  // Create missing report
  async createMissingReport(reportData) {
    try {
      console.log("🌐 API call: createMissingReport with data:", reportData);

      const response = await api.post("/recently-missing/reports/", reportData);

      console.log("🌐 API response:", response.data);

      // Check if ID exists (accept 0 as valid ID)
      if (response.data.id === undefined || response.data.id === null) {
        console.error("❌ Missing ID in response:", response.data);
        throw new Error("Invalid response from server - missing report ID");
      }

      console.log("✅ Valid response with ID:", response.data.id);
      return response.data;
    } catch (error) {
      console.error("❌ API Error in createMissingReport:", error);

      // Log chi tiết error
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }

      throw error;
    }
  },

  /**
   * Upload ảnh cho báo cáo missing
   */
  async uploadMissingReportImage(reportId, imageUrl) {
    try {
      console.log("🌐 API call: uploadMissingReportImage", {
        reportId,
        imageUrl,
      });

      const response = await api.post(
        `/recently-missing/reports/${reportId}/upload_image/`,
        {
          image_url: imageUrl,
        }
      );

      console.log("🌐 Upload response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error uploading missing report image:", error);
      throw error;
    }
  },

  /**
   * Lấy chi tiết báo cáo missing theo ID
   */
  async getMissingReportById(reportId) {
    try {
      console.log("🌐 API call: getMissingReportById", reportId);

      const response = await api.get(`/recently-missing/reports/${reportId}/`);

      console.log("🌐 Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching missing report by ID:", error);
      throw error;
    }
  },

  async deleteMissingReport(reportId) {
    try {
      console.log("🌐 API call: deleteMissingReport", reportId);
      const response = await api.delete(
        `/recently-missing/reports/${reportId}/`
      );
      console.log("🌐 Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error deleting missing report:", error);
      throw error;
    }
  },

  /**
   * Lấy kết quả khớp của báo cáo missing
   */
  async getMissingReportMatches(reportId) {
    try {
      const response = await api.get(
        `/recently-missing/reports/${reportId}/matches/`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching missing report matches:", error);
      throw error;
    }
  },

  /**
   * Cập nhật trạng thái kết quả khớp
   */
  async updateMatchStatus(matchId, status) {
    try {
      const response = await api.post(
        `/recently-missing/matches/${matchId}/update_status/`,
        {
          status,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating match status:", error);
      throw error;
    }
  },

  // services/recentlyMissingService.js
  async findFaceMatches(reportId) {
    try {
      console.log("🌐 API call: findFaceMatches", reportId);
      const response = await api.get(
        `/recently-missing/reports/${reportId}/find_matches/`
      );
      console.log("🌐 Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching face matches:", error);
      throw error;
    }
  },

  async analyzeMatchesWithLLM(currentReportId, otherReportIds) {
    try {
      console.log("🌐 API call: analyzeMatchesWithLLM", {
        currentReportId,
        otherReportIds,
      });
      const response = await api.post(
        "/recently-missing/reports/analyze-matches/",
        {
          current_report_id: currentReportId,
          other_report_ids: otherReportIds,
        }
      );
      console.log("🌐 LLM Analysis response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error analyzing matches with LLM:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
      throw error;
    }
  },
};

export default recentlyMissingService;
