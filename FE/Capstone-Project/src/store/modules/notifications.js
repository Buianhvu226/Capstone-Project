import supabase from "@/utils/supabase";
import axiosInstance from "@/utils/axios";

export default {
  namespaced: true,

  state: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    subscribed: false,
    subscription: null, // Thêm biến để lưu trữ tham chiếu đến subscription
  },

  mutations: {
    SET_NOTIFICATIONS(state, notifications) {
      // Đảm bảo notifications là mảng
      state.notifications = Array.isArray(notifications) ? notifications : [];
    },
    ADD_NOTIFICATION(state, notification) {
      state.notifications.unshift(notification);
      state.unreadCount += 1;
    },
    SET_UNREAD_COUNT(state, count) {
      state.unreadCount = count;
    },
    MARK_AS_READ(state, notificationId) {
      const notification = state.notifications.find(
        (n) => n.id === notificationId
      );
      if (notification && !notification.is_read) {
        notification.is_read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    MARK_ALL_AS_READ(state) {
      state.notifications.forEach((notification) => {
        notification.is_read = true;
      });
      state.unreadCount = 0;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_SUBSCRIBED(state, subscribed) {
      state.subscribed = subscribed;
    },
    SET_SUBSCRIPTION(state, subscription) {
      state.subscription = subscription;
    },
    REMOVE_NOTIFICATION(state, notificationId) {
      state.notifications = state.notifications.filter(
        (n) => n.id !== notificationId
      );
      // Cập nhật lại số lượng thông báo chưa đọc
      state.unreadCount = state.notifications.filter((n) => !n.is_read).length;
    },
  },

  actions: {
    // Lấy thông báo từ API
    async fetchNotifications({ commit }) {
      commit("SET_LOADING", true);
      try {
        const response = await axiosInstance.get("/api/notifications/");

        // Xử lý nhiều loại cấu trúc phản hồi có thể có
        let notifications = [];

        if (response.data) {
          // Kiểm tra nếu response.data là mảng
          if (Array.isArray(response.data)) {
            notifications = response.data;
          }
          // Kiểm tra nếu response.data có thuộc tính results (Django REST Framework pagination)
          else if (
            response.data.results &&
            Array.isArray(response.data.results)
          ) {
            notifications = response.data.results;
          }
          // Kiểm tra nếu response.data có thuộc tính data (một số API sẽ bọc dữ liệu bên trong thuộc tính data)
          else if (response.data.data && Array.isArray(response.data.data)) {
            notifications = response.data.data;
          }
        }

        // Cập nhật state với dữ liệu thông báo
        commit("SET_NOTIFICATIONS", notifications);

        // Đếm số thông báo chưa đọc
        const unreadCount = notifications.filter((n) => !n.is_read).length;
        commit("SET_UNREAD_COUNT", unreadCount);
      } catch (error) {
        console.error("Không thể lấy thông báo:", error);
        // Đặt mảng rỗng khi có lỗi
        commit("SET_NOTIFICATIONS", []);
        commit("SET_UNREAD_COUNT", 0);
      } finally {
        commit("SET_LOADING", false);
      }
    },

    // Đánh dấu thông báo đã đọc
    async markAsRead({ commit }, notificationId) {
      try {
        await axiosInstance.put(
          `/api/notifications/${notificationId}/mark_read/`
        );
        commit("MARK_AS_READ", notificationId);
      } catch (error) {
        console.error("Không thể đánh dấu đã đọc:", error);
      }
    },

    // Đánh dấu tất cả thông báo đã đọc
    async markAllAsRead({ commit }) {
      try {
        await axiosInstance.put("/api/notifications/mark_all_read/");
        commit("MARK_ALL_AS_READ");
      } catch (error) {
        console.error("Không thể đánh dấu tất cả đã đọc:", error);
      }
    },

    // Hủy đăng ký nhận thông báo thời gian thực
    unsubscribeFromNotifications({ state, commit }) {
      try {
        if (state.subscription) {
          supabase.removeChannel(state.subscription);
          commit("SET_SUBSCRIPTION", null);
          commit("SET_SUBSCRIBED", false);
          console.log("Đã hủy đăng ký nhận thông báo thời gian thực");
        }
      } catch (error) {
        console.error("Lỗi khi hủy đăng ký thông báo:", error);
      }
    },

    // Theo dõi thông báo mới qua Supabase Realtime
    subscribeToNotifications({ state, commit, dispatch }) {
      // Hủy subscription trước đó nếu có
      if (state.subscription) {
        dispatch("unsubscribeFromNotifications");
      }

      // Lấy userId từ localStorage hoặc state
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Không tìm thấy token, không thể đăng ký thông báo");
        return;
      }

      // Parse JWT token để lấy user_id
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(window.atob(base64));
        const userId = payload.user_id || payload.sub || payload.id;

        if (!userId) {
          console.error("Không tìm thấy user_id trong token");
          return;
        }

        console.log("Đăng ký nhận thông báo cho user:", userId);

        try {
          // SỬA Ở ĐÂY (tên channel có thể giữ nguyên hoặc đổi, tùy bạn):
          const channel = supabase
            .channel("notifications_notification-channel")
            .on(
              "postgres_changes",
              {
                event: "INSERT",
                schema: "public",
                // SỬA Ở ĐÂY:
                table: "notifications_notification",
                filter: `user_id=eq.${userId}`,
              },
              (payload) => {
                console.log("Nhận thông báo mới:", payload);
                if (payload.new) {
                  commit("ADD_NOTIFICATION", payload.new);
                  displayBrowserNotification(payload.new);
                  showToast(payload.new);
                }
              }
            )
            .subscribe((status) => {
              console.log("Supabase channel status:", status);
              if (status === "SUBSCRIBED") {
                commit("SET_SUBSCRIBED", true);
                console.log(
                  "Đã đăng ký nhận thông báo thời gian thực thành công"
                );
              } else if (status === "CHANNEL_ERROR") {
                console.error("Lỗi kênh Supabase");
              } else if (status === "TIMED_OUT") {
                console.error("Kết nối Supabase bị timeout");
                // Thử kết nối lại sau 5 giây
                setTimeout(() => {
                  dispatch("subscribeToNotifications");
                }, 5000);
              }
            });

          commit("SET_SUBSCRIPTION", channel);
        } catch (error) {
          console.error("Lỗi khi đăng ký kênh thông báo:", error);
          // Thử lại sau 3 giây nếu có lỗi
          setTimeout(() => {
            dispatch("subscribeToNotifications");
          }, 3000);
        }
      } catch (error) {
        console.error("Lỗi khi đăng ký nhận thông báo:", error);
      }
    },

    // Thêm action để xóa thông báo
    async removeNotification({ commit }, notificationId) {
      try {
        // Gọi API xóa thông báo (nếu có)
        await notificationsService.deleteNotification(notificationId);

        // Cập nhật trạng thái local
        commit("REMOVE_NOTIFICATION", notificationId);
      } catch (error) {
        console.error("Lỗi khi xóa thông báo:", error);
        // Xóa khỏi state ngay cả khi API lỗi để cải thiện UX
        commit("REMOVE_NOTIFICATION", notificationId);
      }
    },
  },

  getters: {
    hasUnreadNotifications: (state) => state.unreadCount > 0,
    allNotifications: (state) => state.notifications || [], // Đảm bảo luôn trả về mảng
    unreadNotifications: (state) =>
      (state.notifications || []).filter((n) => !n.is_read),
    // Thêm getter mới để lấy thông báo profile_creating
    profileCreatingNotifications: (state) =>
      (state.notifications || []).filter((n) => n.type === 'profile_creating')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
  },
};

// Hiển thị thông báo trên trình duyệt
function displayBrowserNotification(notification) {
  // Bỏ qua thông báo loại profile_creating
  if (!window.Notification || Notification.permission !== "granted" || notification.type === 'profile_creating') {
    return;
  }

  let title = "Thông báo mới";
  let body = notification.content || "Bạn có thông báo mới";
  let icon = "/favicon.ico"; // Thay đổi đường dẫn tới favicon của bạn

  // Tùy chỉnh title dựa vào loại thông báo
  switch (notification.type) {
    case "profile_created":
      title = "Hồ sơ đã được tạo";
      break;
    case "profile_created_with_matches":
      title = "Tìm thấy hồ sơ phù hợp";
      break;
    case "new_match":
      title = "Có hồ sơ mới phù hợp";
      break;
  }

  // Tạo và hiển thị thông báo
  const browserNotification = new Notification(title, { body, icon });

  // Xử lý khi người dùng nhấp vào thông báo
  browserNotification.onclick = () => {
    window.focus();
    // Điều hướng dựa vào loại thông báo
    if (window._vueRouter) {
      if (
        notification.type === "new_match" &&
        notification.additional_data?.matching_profile_id
      ) {
        window._vueRouter.push(
          `/profile/${notification.additional_data.matching_profile_id}`
        );
      } else if (notification.related_entity_id) {
        window._vueRouter.push(`/profile/${notification.related_entity_id}`);
      } else {
        window._vueRouter.push("/notifications");
      }
    }
  };
}

// Helper function for showing toast notifications
function showToast(notification) {
  // Bỏ qua thông báo loại profile_creating
  if (notification.type === 'profile_creating') {
    return;
  }

  // Kiểm tra và tạo container nếu chưa tồn tại
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "fixed bottom-4 right-4 z-50";
    document.body.appendChild(container);
    console.log("Toast container created dynamically");
  }

  const toast = document.createElement("div");
  toast.className = `flex items-center p-4 mb-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out opacity-0 translate-y-2`;

  // Set styling based on notification type
  let iconClass = "fa-bell";
  let bgClass = "bg-gray-800";

  switch (notification.type) {
    case "profile_created":
      iconClass = "fa-check-circle";
      bgClass = "bg-green-600";
      break;
    case "profile_created_with_matches":
      iconClass = "fa-user-plus";
      bgClass = "bg-green-600";
      break;
    case "new_match":
      iconClass = "fa-handshake-o";
      bgClass = "bg-blue-600";
      break;
  }

  toast.classList.add(bgClass, "text-white");

  // Create content with icon
  toast.innerHTML = `
    <div class="mr-3 bg-white bg-opacity-20 rounded-full p-2">
      <i class="fa ${iconClass}"></i>
    </div>
    <div class="flex-1">
      <p class="font-medium">${getToastTitle(notification.type)}</p>
      <p class="text-sm text-white text-opacity-90">${notification.content.substring(
        0,
        70
      )}${notification.content.length > 70 ? "..." : ""}</p>
    </div>
    <button class="ml-3 text-white text-opacity-70 hover:text-opacity-100 focus:outline-none">
      <i class="fa fa-times"></i>
    </button>
  `;

  // Add to container
  container.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.classList.remove("opacity-0", "translate-y-2");
  }, 10);

  // Setup close button
  const closeButton = toast.querySelector("button");
  if (closeButton) {
    closeButton.addEventListener("click", (e) => {
      e.stopPropagation();
      removeToast(toast);
    });
  }

  // Make toast clickable to navigate to notification
  toast.addEventListener("click", () => {
    // Điều hướng dựa vào loại thông báo
    if (window._vueRouter) {
      if (
        notification.type === "new_match" &&
        notification.additional_data?.matching_profile_id
      ) {
        window._vueRouter.push(
          `/profile/${notification.additional_data.matching_profile_id}`
        );
      } else if (notification.related_entity_id) {
        window._vueRouter.push(`/profile/${notification.related_entity_id}`);
      } else {
        window._vueRouter.push("/notifications");
      }
    }

    removeToast(toast);
  });

  // Remove after 7 seconds
  setTimeout(() => {
    removeToast(toast);
  }, 7000);
}

// Helper function to remove toast with animation
function removeToast(toast) {
  toast.classList.add("opacity-0", "translate-y-2");
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
}

// Get toast title based on notification type
function getToastTitle(type) {
  switch (type) {
    case "profile_created":
      return "Hồ sơ đã được tạo";
    case "profile_created_with_matches":
      return "Tìm thấy hồ sơ phù hợp";
    case "new_match":
      return "Có hồ sơ mới phù hợp";
    default:
      return "Thông báo mới";
  }
}
