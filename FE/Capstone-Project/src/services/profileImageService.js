import axios from "axios";

// Cấu hình API baseURL
const apiBaseUrl = import.meta.env.VITE_APP_API_URL;  

/**
 * ProfileImageService - Service xử lý các thao tác liên quan đến hình ảnh hồ sơ
 */
class ProfileImageService {
  /**
   * Lưu URL hình ảnh từ Supabase vào database
   *
   * @param {number|string} profileId - ID của hồ sơ
   * @param {string} imageUrl - URL hình ảnh đã upload lên Supabase
   * @param {string} description - Mô tả tùy chọn cho hình ảnh
   * @returns {Promise} Promise chứa kết quả từ API
   */
  async saveImageUrl(profileId, imageUrl, description = "") {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${apiBaseUrl}/api/profiles/${profileId}/upload_image/`,
        {
          image_url: imageUrl,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        success: true,
        data: response.data,
        message: response.data.message || "Tải ảnh hồ sơ thành công!",
      };
    } catch (error) {
      console.error("ProfileImageService - Error saving image URL:", error);

      // Tạo đối tượng lỗi có cấu trúc thống nhất
      const errorResponse = {
        success: false,
        message: "Đã xảy ra lỗi khi lưu URL ảnh",
      };

      if (error.response) {
        errorResponse.status = error.response.status;
        errorResponse.data = error.response.data;
        errorResponse.message =
          error.response.data.error || JSON.stringify(error.response.data);
      } else if (error.request) {
        errorResponse.message = "Không nhận được phản hồi từ máy chủ";
      } else {
        errorResponse.message = error.message;
      }

      throw errorResponse;
    }
  }

  /**
   * Lấy thông tin hình ảnh của hồ sơ
   *
   * @param {number|string} profileId - ID của hồ sơ
   * @returns {Promise} Promise chứa thông tin hình ảnh
   */


  /**
   * Xóa ảnh cũ từ Supabase khi thay thế bằng ảnh mới
   *
   * @param {string} oldImageUrl - URL của ảnh cũ
   * @returns {Promise} Promise chứa kết quả từ API
   */
  async deleteOldImage(oldImageUrl) {
    try {
      // Chỉ xử lý nếu là URL từ Supabase storage
      if (
        oldImageUrl &&
        oldImageUrl.includes("storage/v1/object/public/images/")
      ) {
        // Lấy đường dẫn của file từ URL
        const urlParts = oldImageUrl.split("/public/");
        if (urlParts.length < 2) return { success: true };

        const filePath = urlParts[1];

        // Xóa file từ Supabase storage
        const { error } = await supabase.storage
          .from("images")
          .remove([filePath]);

        if (error) {
          console.error("Error deleting old image:", error);
          return { success: false, error };
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Error in deleteOldImage:", error);
      return { success: false, error };
    }
  }
}

export default new ProfileImageService();
