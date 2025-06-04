import api from "./api"; // Hoặc import axiosInstance từ '@/utils/axios' tùy vào cấu trúc project

const notificationService = {
  // Các phương thức hiện tại
  getNotifications() {
    return api.get("/api/notifications/");
  },

  markAsRead(notificationId) {
    return api.put(`/api/notifications/${notificationId}/mark_read/`);
  },

  markAllAsRead() {
    return api.put("/api/notifications/mark_all_read/");
  },

  // Thêm phương thức xóa thông báo
  deleteNotification(notificationId) {
    return api.delete(`/notifications/${notificationId}/`);
  },

  // Thêm phương thức mới
  getMessageSessionId(notification) {
    if (!notification) return null;

    // Kiểm tra trong additional_data
    const additionalData = notification.additional_data || {};
    let sessionId =
      additionalData.chat_session_id ||
      additionalData.session_id ||
      notification.chat_session_id;

    // Chuyển đổi thành số nếu là chuỗi
    if (sessionId && typeof sessionId === "string") {
      sessionId = parseInt(sessionId, 10);
    }

    return isNaN(sessionId) ? null : sessionId;
  },
};

export default notificationService;
