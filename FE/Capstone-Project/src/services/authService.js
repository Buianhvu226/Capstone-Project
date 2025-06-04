import api from "./api";

export default {
  async login(credentials) {
    return api.post("/auth/login/", credentials);
  },

  async register(userData) {
    return api.post("/auth/register/", userData);
  },

  async getCurrentUser() {
    return api.get("/auth/account/");
  },

  // ✅ Cập nhật method updateAccount để gửi đầy đủ required fields
  async updateAccount(userData, currentAccountData) {
    try {
      console.log("📤 Sending update data:", userData);
      console.log("📤 Current account data:", currentAccountData);

      // ✅ Gửi đầy đủ thông tin, bao gồm cả username và email từ current data
      const updateData = {
        // Required fields từ current data
        username: currentAccountData.username,
        email: currentAccountData.email,

        // Updated fields từ form
        full_name: userData.full_name
          ? userData.full_name.trim()
          : currentAccountData.full_name,
        phone: userData.phone
          ? userData.phone.trim()
          : currentAccountData.phone || "",
        address: userData.address
          ? userData.address.trim()
          : currentAccountData.address || "",

        // Keep avatar_url if exists
        avatar_url: currentAccountData.avatar_url || null,
      };

      console.log("📤 Complete data being sent:", updateData);

      const response = await api.put("/auth/account/", updateData);
      console.log("✅ Update response:", response.data);

      return response;
    } catch (error) {
      console.error("❌ Update error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },
};
