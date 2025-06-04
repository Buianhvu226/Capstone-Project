import messageService from "@/services/messageService";
import { supabase } from "@/utils/supabase";

export default {
  namespaced: true,

  state: {
    conversations: [],
    currentConversation: null,
    messages: [],
    loading: false,
    error: null,
    realtime: {
      subscription: null,
      subscribed: false,
    },
  },

  getters: {
    allConversations: (state) => state.conversations,
    allMessages: (state) => state.messages,
    currentConversation: (state) => state.currentConversation,
  },

  mutations: {
    SET_LOADING(state, status) {
      state.loading = status;
    },

    SET_ERROR(state, error) {
      state.error = error;
    },

    SET_CONVERSATIONS(state, conversations) {
      state.conversations = conversations;
    },

    SET_CURRENT_CONVERSATION(state, conversation) {
      state.currentConversation = conversation;
    },

    SET_MESSAGES(state, messages) {
      state.messages = messages;
    },

    ADD_MESSAGE(state, message) {
      // Kiểm tra xem tin nhắn đã tồn tại chưa để tránh duplicate
      const exists = state.messages.some((m) => m.id === message.id);
      if (!exists) {
        state.messages.push(message);
      }
    },

    UPDATE_CONVERSATION_LAST_MESSAGE(state, { conversationId, message }) {
      const conversation = state.conversations.find(
        (c) => c.id === conversationId
      );
      if (conversation) {
        conversation.last_message = {
          id: message.id,
          content: message.content,
          sender_id: message.sender, // Sửa từ sender thành sender_id để phù hợp với API
          created_at: message.created_at,
        };
        conversation.updated_at = message.created_at;

        // Sắp xếp lại để cuộc trò chuyện mới nhất lên đầu
        state.conversations.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
      }
    },

    INCREMENT_UNREAD_COUNT(state, conversationId) {
      const conversation = state.conversations.find(
        (c) => c.id === conversationId
      );
      if (conversation && conversation.id !== state.currentConversation?.id) {
        conversation.unread_count = (conversation.unread_count || 0) + 1;
      }
    },

    RESET_UNREAD_COUNT(state, conversationId) {
      const conversation = state.conversations.find(
        (c) => c.id === conversationId
      );
      if (conversation) {
        conversation.unread_count = 0;
      }
    },

    SET_REALTIME_SUBSCRIPTION(state, subscription) {
      state.realtime.subscription = subscription;
      state.realtime.subscribed = !!subscription;
    },

    // Thêm mutation để xóa cuộc trò chuyện
    REMOVE_CONVERSATION(state, conversationId) {
      state.conversations = state.conversations.filter(
        (conv) => conv.id !== conversationId
      );
    },
  },

  actions: {
    async fetchConversations({ commit }) {
      try {
        commit("SET_LOADING", true);
        commit("SET_ERROR", null);
        const response = await messageService.getConversations();
        const conversations = response.data.results || [];
        commit("SET_CONVERSATIONS", conversations);
        return conversations;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.message || "Không thể tải danh sách cuộc trò chuyện"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchMessages({ commit }, conversationId) {
      try {
        commit("SET_LOADING", true);
        commit("SET_ERROR", null);
        const response = await messageService.getMessages(conversationId);
        const messages = Array.isArray(response.data) ? response.data : [];

        // Chuẩn hóa định dạng tin nhắn
        const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;
        const formattedMessages = messages.map((msg) => ({
          id: msg.id,
          content: msg.content,
          created_at: msg.created_at,
          is_read: msg.is_read,
          is_mine: msg.sender === currentUserId,
          sender: msg.sender,
        }));

        commit("SET_MESSAGES", formattedMessages);

        // Đánh dấu đã đọc tất cả tin nhắn
        commit("RESET_UNREAD_COUNT", conversationId);

        return formattedMessages;
      } catch (error) {
        commit("SET_ERROR", error.message || "Không thể tải tin nhắn");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async sendMessage({ commit, state }, { conversationId, content }) {
      try {
        commit("SET_ERROR", null);
        const response = await messageService.sendMessage(
          conversationId,
          content
        );

        // Thêm tin nhắn mới vào danh sách
        const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;
        const newMessage = {
          id: response.data.id || Date.now(),
          content: content,
          created_at: response.data.created_at || new Date().toISOString(),
          is_read: true,
          is_mine: true,
          sender: currentUserId,
        };

        commit("ADD_MESSAGE", newMessage);
        commit("UPDATE_CONVERSATION_LAST_MESSAGE", {
          conversationId,
          message: newMessage,
        });

        return newMessage;
      } catch (error) {
        commit("SET_ERROR", error.message || "Không thể gửi tin nhắn");
        throw error;
      }
    },

    async startConversation({ commit }, userId) {
      try {
        commit("SET_LOADING", true);
        commit("SET_ERROR", null);
        const response = await messageService.startConversation(userId);
        const conversation = response.data;
        commit("SET_CURRENT_CONVERSATION", conversation);
        return conversation;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.message || "Không thể bắt đầu cuộc trò chuyện"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async setCurrentConversation({ commit, dispatch }, conversation) {
      commit("SET_CURRENT_CONVERSATION", conversation);
      if (conversation) {
        await dispatch("fetchMessages", conversation.id);
      }
    },

    // Đăng ký lắng nghe tin nhắn mới
    subscribeToMessages({ commit, state, dispatch }) {
      // Nếu đã đăng ký rồi thì không đăng ký nữa
      if (state.realtime.subscribed) {
        console.log("Đã đăng ký lắng nghe tin nhắn rồi");
        return;
      }

      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          console.error("Không tìm thấy thông tin người dùng");
          return;
        }

        console.log("Đăng ký lắng nghe tin nhắn mới...");

        // Đăng ký theo dõi bảng messages với sự kiện INSERT
        const subscription = supabase
          .channel("messages-changes")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "chats_message",
            },
            (payload) => {
              console.log("Có tin nhắn mới:", payload);
              handleNewMessage(payload, commit, state, user.id);
            }
          )
          .subscribe((status) => {
            console.log("Trạng thái đăng ký tin nhắn:", status);

            // Kiểm tra trạng thái kết nối
            if (status === "CLOSED" || status === "CHANNEL_ERROR") {
              // Xử lý khi kết nối bị đóng hoặc lỗi
            }
          });

        commit("SET_REALTIME_SUBSCRIPTION", subscription);
        console.log("Đã đăng ký lắng nghe tin nhắn thành công");
      } catch (error) {
        console.error("Lỗi khi đăng ký lắng nghe tin nhắn:", error);
      }
    },

    // Hủy đăng ký lắng nghe tin nhắn
    unsubscribeFromMessages({ commit, state }) {
      if (state.realtime.subscription) {
        try {
          console.log("Hủy đăng ký lắng nghe tin nhắn...");
          supabase.removeChannel(state.realtime.subscription);
          commit("SET_REALTIME_SUBSCRIPTION", null);
          console.log("Đã hủy đăng ký lắng nghe tin nhắn");
        } catch (error) {
          console.error("Lỗi khi hủy đăng ký lắng nghe tin nhắn:", error);
        }
      }
    },

    // Thêm action mới trong Vuex Store

    // Action
    async deleteConversation({ commit, dispatch }, conversationId) {
      try {
        // Gọi API để xóa cuộc trò chuyện
        await messageService.deleteConversation(conversationId);

        // Xóa cuộc trò chuyện khỏi state
        commit("REMOVE_CONVERSATION", conversationId);

        // Reset cuộc trò chuyện hiện tại
        commit("SET_CURRENT_CONVERSATION", null);
        commit("SET_MESSAGES", []);

        return true;
      } catch (error) {
        console.error("Error deleting conversation:", error);
        throw error;
      }
    },
  },
};

// Helper function to handle new message events
function handleNewMessage(payload, commit, state, currentUserId) {
  try {
    const newMessageData = payload.new;
    console.log("Tin nhắn mới nhận từ Supabase:", newMessageData);

    // Kiểm tra dữ liệu tin nhắn
    if (!newMessageData || !newMessageData.id) {
      console.warn("Dữ liệu tin nhắn không hợp lệ:", newMessageData);
      return;
    }

    // Lấy ID phiên chat - sử dụng đúng tên trường trong dữ liệu thực tế
    const conversationId = newMessageData.session_id; // Thay vì chat_session_id
    if (!conversationId) {
      console.warn(
        "Không tìm thấy ID phiên chat trong tin nhắn:",
        newMessageData
      );
      return;
    }

    // Lấy ID người gửi - sử dụng đúng tên trường trong dữ liệu thực tế
    const senderId = newMessageData.sender_id; // Thay vì sender

    // Chuyển đổi dữ liệu tin nhắn
    const message = {
      id: newMessageData.id,
      content: newMessageData.content,
      created_at: newMessageData.created_at,
      is_read: newMessageData.is_read || false,
      is_mine: senderId === currentUserId, // So sánh với ID người dùng hiện tại
      sender: senderId, // Lưu ID người gửi
    };

    console.log("Đã chuẩn hóa tin nhắn mới:", message);

    // Thêm tin nhắn vào danh sách nếu đang trong cùng cuộc trò chuyện
    if (
      state.currentConversation &&
      state.currentConversation.id === conversationId
    ) {
      commit("ADD_MESSAGE", message);

      // Đánh dấu đã đọc nếu không phải tin nhắn của mình
      if (!message.is_mine) {
        messageService.markAsRead(message.id).catch((err) => {
          console.error("Lỗi khi đánh dấu đã đọc:", err);
        });
      }
    } else {
      // Tăng số tin nhắn chưa đọc
      commit("INCREMENT_UNREAD_COUNT", conversationId);
    }

    // Cập nhật tin nhắn cuối cùng của cuộc trò chuyện
    commit("UPDATE_CONVERSATION_LAST_MESSAGE", {
      conversationId,
      message,
    });
  } catch (error) {
    console.error("Lỗi khi xử lý tin nhắn mới:", error);
  }
}
