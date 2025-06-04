import api from "./api";

const messageService = {
  // Lấy danh sách phiên chat
  getConversations() {
    return api.get("/chats/chatsessions/");
  },

  // Lấy tin nhắn của một phiên chat
  getMessages(conversationId) {
    return api.get(`/chats/chatsessions/${conversationId}/messages/`);
  },

  // Gửi tin nhắn trong phiên chat
  sendMessage(conversationId, content) {
    return api.post(`/chats/chatsessions/${conversationId}/send_message/`, {
      content,
    });
  },

  // Tạo phiên chat mới
  startConversation(userId, entityId, entityType = "profile") {
    // Chuyển đổi userId và entityId thành số nguyên
    userId = parseInt(userId, 10);
    entityId = parseInt(entityId, 10);

    // Tạo payload dựa trên loại entity
    const payload = {
      participant_id: userId,
    };

    // Thêm trường tương ứng dựa vào loại entity
    if (entityType === "profile") {
      payload.related_profile_id = entityId;
    } else if (entityType === "report") {
      payload.related_report_id = entityId;
    } else {
      console.error("Loại entity không hợp lệ:", entityType);
      throw new Error(
        'Loại entity không hợp lệ. Chỉ hỗ trợ "profile" hoặc "report".'
      );
    }

    return api.post("/chats/chatsessions/", payload);
  },

  // Đánh dấu tin nhắn đã đọc
  markAsRead(messageId) {
    return api.post(`/chats/messages/${messageId}/mark_as_read/`);
  },

  // Cập nhật phương thức xóa cuộc trò chuyện với endpoint chính xác
  async deleteConversation(conversationId) {
    try {
      // Sử dụng endpoint chính xác cho việc xóa chat session
      const response = await api.delete(
        `/chats/chatsessions/${conversationId}/`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting conversation:", error);
      throw error;
    }
  },
};

export default messageService;
