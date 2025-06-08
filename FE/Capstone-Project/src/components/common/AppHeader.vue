<template>
  <header class="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
    <div class="container mx-auto flex items-center justify-between px-4 py-2">
      <!-- Logo -->
      <router-link to="/" class="font-semibold text-blue-400">
        <div class="flex items-center">
          <img src="@/assets/images/logo1.png" alt="Logo"
            class="w-[6rem] h-[2.5rem] xl:w-[8rem] xl:h-[3rem] object-contain mr-2 xl:mr-3" />
        </div>
      </router-link>

      <!-- Mobile Menu Button (Small screens only) -->
      <button @click="toggleMobileMenu" class="md:hidden text-gray-600 focus:outline-none">
        <i class="fa fa-bars text-xl"></i>
      </button>

      <!-- Navigation Links - Desktop & Tablet -->
      <nav class="hidden md:flex flex-1 items-center justify-center space-x-2 lg:space-x-4 xl:space-x-6 mx-4">
        <!-- Large screens: Show text -->
        <router-link v-for="link in navLinks" :key="link.path" :to="link.path"
          class="transition-colors duration-200 px-2 py-1 rounded-md text-sm lg:text-base whitespace-nowrap"
          :class="[route.path === link.path ? 'font-semibold text-blue-400 bg-blue-50' : 'text-gray-600 hover:text-blue-400 hover:bg-gray-50']"
          :title="link.name">

          <!-- XL screens: Show full text -->
          <span class="hidden xl:inline">{{ link.name }}</span>

          <!-- Medium to Large screens: Show icons only -->
          <span class="xl:hidden flex items-center justify-center">
            <i :class="link.icon" class="text-lg"></i>
          </span>
        </router-link>
      </nav>

      <!-- Actions - Desktop & Tablet -->
      <div class="hidden md:flex items-center space-x-2 lg:space-x-3">
        <template v-if="isLoggedIn">
          <!-- Notification Icon -->
          <div class="relative">
            <button @click="toggleNotifications" data-notification-toggle
              class="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
              title="Thông báo">
              <i class="fa fa-bell text-lg lg:text-xl" :class="{ 'bell-animation': hasUnreadNotifications }"></i>
              <span v-if="hasUnreadNotifications"
                class="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center notification-badge-pulse">
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </button>

            <!-- Notification dropdown -->
            <div v-if="showNotificationsPanel"
              class="notification-dropdown absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-md shadow-lg overflow-hidden z-50"
              style="max-height: 400px; overflow-y: auto;">
              <div class="py-2 px-3 bg-gray-100 flex justify-between items-center">
                <h3 class="text-sm font-semibold text-gray-700">Thông báo</h3>
                <button v-if="hasUnreadNotifications" @click="markAllAsRead"
                  class="text-xs text-blue-400 hover:text-blue-800">
                  Đánh dấu đã đọc tất cả
                </button>
              </div>

              <div v-if="loading" class="p-4 text-center">
                <i class="fa fa-spinner fa-spin"></i> Đang tải...
              </div>
              <div v-else-if="allNotifications.length === 0" class="p-4 text-center text-gray-500">
                Không có thông báo nào
              </div>
              <div v-else>
                <div v-for="notification in recentNotifications" :key="notification.id"
                  class="border-b border-gray-200 last:border-b-0" :class="{ 'bg-blue-50': !notification.is_read }">
                  <div class="p-3 hover:bg-gray-50 cursor-pointer" @click="handleNotificationClick(notification)">
                    <div class="flex justify-between items-start">
                      <p class="text-sm text-gray-800 leading-relaxed" v-html="formatNotificationContent(notification)">
                      </p>
                      <span v-if="!notification.is_read"
                        class="w-2 h-2 bg-blue-400 rounded-full ml-2 flex-shrink-0 mt-1"></span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">{{ formatDate(notification.created_at) }}</p>
                  </div>
                </div>
                <div class="p-2 text-center border-t border-gray-200">
                  <router-link to="/notifications" class="text-sm text-blue-400 hover:text-blue-800"
                    @click="showNotificationsPanel = false">
                    Xem tất cả thông báo
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- User Account -->
          <router-link to="/account"
            class="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
            title="Tài khoản">
            <i class="fa fa-user text-lg lg:text-xl"></i>
          </router-link>

          <!-- Logout Button -->
          <button @click="logout"
            class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg font-semibold transition text-sm lg:text-base">
            <!-- XL screens: Show text -->
            <span class="hidden xl:inline">Đăng xuất</span>
            <!-- Medium to Large screens: Show icon only -->
            <i class="fa fa-sign-out-alt xl:hidden"></i>
          </button>
        </template>
        <template v-else>
          <router-link to="/auth"
            class="bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg font-semibold transition text-sm lg:text-base">
            <!-- XL screens: Show text -->
            <span class="hidden xl:inline">Đăng nhập</span>
            <!-- Medium to Large screens: Show icon only -->
            <i class="fa fa-sign-in-alt xl:hidden"></i>
          </router-link>
        </template>
      </div>
    </div>

    <!-- Mobile Menu - Slide Down Panel (Small screens only) -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-200 shadow-md animate-slide-down">
      <nav class="container mx-auto py-4 px-4 flex flex-col space-y-3">
        <router-link v-for="link in navLinks" :key="link.path" :to="link.path" @click="mobileMenuOpen = false"
          class="py-2 transition-colors duration-200"
          :class="[route.path === link.path ? 'font-semibold text-blue-400' : 'text-gray-600']">
          <i :class="link.icon" class="mr-2"></i>
          {{ link.name }}
        </router-link>

        <!-- Mobile Actions -->
        <div v-if="isLoggedIn" class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div class="flex items-center space-x-4">
            <router-link to="/notifications" @click="mobileMenuOpen = false"
              class="flex items-center space-x-2 text-gray-600">
              <i class="fa fa-bell"></i>
              <span>Thông báo</span>
              <span v-if="hasUnreadNotifications"
                class="w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </router-link>

            <router-link to="/account" @click="mobileMenuOpen = false"
              class="flex items-center space-x-2 text-gray-600">
              <i class="fa fa-user"></i>
              <span>Tài khoản</span>
            </router-link>
          </div>

          <button @click="logout"
            class="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-medium transition text-sm">
            Đăng xuất
          </button>
        </div>
        <div v-else class="mt-4 pt-4 border-t border-gray-100">
          <router-link to="/auth" @click="mobileMenuOpen = false"
            class="block w-full text-center bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition">
            Đăng nhập
          </router-link>
        </div>
      </nav>
    </div>
  </header>

  <!-- Admin Header -->
  <header v-if="isAdmin" class="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm py-2 px-4">
    <div class="container mx-auto flex items-center justify-between">
      <!-- Logo và nút điều hướng về trang chính admin -->
      <router-link to="/admin" class="flex items-center hover:opacity-80 transition-opacity">
        <img src="@/assets/images/logo1.png" alt="Logo"
          class="w-[6rem] h-[2.5rem] xl:w-[8rem] xl:h-[3rem] object-contain" />
        <span class="ml-2 font-semibold text-blue-600 text-lg">Admin</span>
      </router-link>

      <!-- Navigation Links cho Admin -->
      <nav class="hidden md:flex items-center space-x-4">
        <router-link to="/search"
          class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200"
          :class="[route.path === '/search' ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100']">
          <i class="fas fa-search"></i>
          <span class="hidden lg:inline">Tìm kiếm</span>
        </router-link>

        <router-link to="/" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200"
          :class="[route.path === '/' ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100']">
          <i class="fa-solid fa-newspaper"></i>
          <span class="hidden lg:inline">Hồ sơ thất lạc lâu năm</span>
        </router-link>

        <router-link to="/recently-missing"
          class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200"
          :class="[route.path === '/recently-missing' ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100']">
          <i class="fas fa-clock"></i>
          <span class="hidden lg:inline">Báo cáo thất lạc gần đây</span>
        </router-link>
      </nav>

      <!-- Mobile Menu Button cho Admin -->
      <button @click="toggleAdminMobileMenu" class="md:hidden text-gray-600 focus:outline-none">
        <i class="fa fa-bars text-xl"></i>
      </button>

      <!-- Phần bên phải -->
      <div class="flex items-center">
        <!-- Nút đăng xuất -->
        <button @click="logout"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition text-sm">
          <i class="fa fa-sign-out-alt mr-1"></i>
          <span class="hidden sm:inline">Đăng xuất</span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu cho Admin -->
    <div v-if="adminMobileMenuOpen" class="md:hidden bg-white border-t border-gray-200 shadow-md animate-slide-down">
      <nav class="container mx-auto py-4 px-4 flex flex-col space-y-3">
        <router-link to="/search" @click="adminMobileMenuOpen = false"
          class="flex items-center space-x-2 py-2 transition-colors duration-200"
          :class="[route.path === '/search' ? 'font-semibold text-blue-600' : 'text-gray-600']">
          <i class="fas fa-search"></i>
          <span>Tìm kiếm</span>
        </router-link>

        <router-link to="/" @click="adminMobileMenuOpen = false"
          class="flex items-center space-x-2 py-2 transition-colors duration-200"
          :class="[route.path === '/' ? 'font-semibold text-blue-600' : 'text-gray-600']">
          <i class="fa-solid fa-newspaper"></i>
          <span>Hồ sơ thất lạc lâu năm</span>
        </router-link>

        <router-link to="/recently-missing" @click="adminMobileMenuOpen = false"
          class="flex items-center space-x-2 py-2 transition-colors duration-200"
          :class="[route.path === '/recently-missing' ? 'font-semibold text-blue-600' : 'text-gray-600']">
          <i class="fas fa-clock"></i>
          <span>Báo cáo thất lạc gần đây</span>
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'AppHeader',
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const isAdmin = ref(false)
    const adminMobileMenuOpen = ref(false)

    onMounted(() => {
      // Kiểm tra thông tin người dùng trong localStorage
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const userData = JSON.parse(userStr)
          isAdmin.value = userData.id === 1;
        } catch (error) {
          console.error('Lỗi khi phân tích dữ liệu người dùng:', error)
        }
      }
    })

    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);

    // Mobile menu state
    const mobileMenuOpen = ref(false)

    // Navigation links with icons
    const navLinks = computed(() => {
      const links = [
        { path: '/', name: 'Hồ sơ thất lạc lâu năm', icon: 'fa-solid fa-newspaper' },
        { path: '/search', name: 'Tìm kiếm', icon: 'fas fa-search' },
        { path: '/profile/create', name: 'Đăng ký hồ sơ', icon: 'fa-solid fa-people-group' },
        { path: '/recently-missing', name: 'Báo cáo thất lạc gần đây', icon: 'fas fa-clock' },
      ];
      if (isLoggedIn.value) {
        links.push(
          { path: '/my-profile', name: 'Hồ sơ của tôi', icon: 'fas fa-user-circle' },
          { path: '/messages', name: 'Nhắn tin', icon: 'fas fa-comments' },
        );
      }
      return links;
    });

    // Notifications
    const showNotificationsPanel = ref(false)
    const isLoggedIn = computed(() => !!localStorage.getItem('token'))
    const allNotifications = computed(() => store.getters['notifications/allNotifications'] || [])
    const hasUnreadNotifications = computed(() => store.getters['notifications/hasUnreadNotifications'])
    const unreadCount = computed(() => store.state.notifications.unreadCount || 0)
    const loading = computed(() => store.state.notifications.loading)
    // Trong computed property recentNotifications, thêm điều kiện lọc
    const recentNotifications = computed(() => {
      const notifications = allNotifications.value || [];
      if (!Array.isArray(notifications)) return [];

      // Lọc tin nhắn trùng lặp, chỉ giữ lại tin nhắn mới nhất từ mỗi người gửi
      const latestMessageNotifications = new Map();
      const nonMessageNotifications = [];

      // Phân loại và lọc thông báo
      notifications.forEach(notification => {
        // Bỏ qua thông báo loại profile_creating
        if (notification.type === 'profile_creating') {
          return;
        }

        // Kiểm tra thông báo tin nhắn bằng nội dung hoặc type
        if (notification.type === 'new_message' || notification.content?.includes('Tin nhắn mới từ')) {
          // Lấy ra ID người gửi từ additional_data hoặc phân tích từ nội dung
          const senderInfo = notification.additional_data?.sender_id ||
            notification.content.match(/Tin nhắn mới từ ([^\s]+)/)?.[1];

          if (senderInfo) {
            // Nếu chưa có thông báo nào từ người gửi này hoặc thông báo này mới hơn
            if (!latestMessageNotifications.has(senderInfo) ||
              new Date(notification.created_at) > new Date(latestMessageNotifications.get(senderInfo).created_at)) {
              latestMessageNotifications.set(senderInfo, notification);
            }
          } else {
            // Trường hợp không xác định được người gửi, vẫn giữ lại thông báo
            nonMessageNotifications.push(notification);
          }
        } else {
          // Thông báo không phải tin nhắn
          nonMessageNotifications.push(notification);
        }
      });

      // Kết hợp danh sách thông báo tin nhắn mới nhất và các thông báo khác
      const filteredNotifications = [...latestMessageNotifications.values(), ...nonMessageNotifications];

      // Sắp xếp lại theo thời gian mới nhất
      filteredNotifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      // Chỉ lấy 5 thông báo gần nhất
      return filteredNotifications.slice(0, 5);
    })

    // Hàm định dạng nội dung thông báo
    const formatNotificationContent = (notification) => {
      // Sanitize HTML để tránh XSS
      const escapeHtml = (text) => {
        if (!text) return '';
        return text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      };

      let formattedContent = '';
      const ad = notification.additional_data || {};
      const profileColor = "text-blue-400 font-medium";

      if (notification.type === 'new_message' || notification.content?.includes('Tin nhắn mới từ')) {
        // Xử lý thông báo tin nhắn
        let senderName = ad.sender_name || (notification.content.match(/Tin nhắn mới từ ([^\s]+)/) || [])[1] || 'Ai đó';

        // Nếu có tin nhiều nhắn đang chờ, hiển thị số lượng
        if (notification.message_count > 1) {
          formattedContent = `<i class="fas fa-comment-dots text-blue-500 mr-1"></i> <span class="font-medium">Có ${notification.message_count} tin nhắn</span> đang chờ từ <span class="${profileColor}">${escapeHtml(senderName)}</span>`;
        } else {
          // Nếu chỉ có 1 tin nhắn
          const messagePreview = ad.message_preview || 'Đã gửi một tin nhắn mới';
          formattedContent = `<i class="fas fa-comment-dots text-blue-500 mr-1"></i> <span class="${profileColor}">${escapeHtml(senderName)}</span>: ${escapeHtml(messagePreview)}`;
        }
      } else {
        formattedContent = escapeHtml(notification.content).replace(/"([^"]+)"/g, `"<strong>$1</strong>"`);
      }

      return formattedContent;
    };

    onMounted(() => {
      if (isLoggedIn.value) {
        store.dispatch('notifications/fetchNotifications')
        if (!store.state.notifications.subscribed) {
          store.dispatch('notifications/subscribeToNotifications')
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('mousedown', handleClickOutside)
    })

    watch(isLoggedIn, (newValue, oldValue) => {
      if (newValue && !oldValue) {
        store.dispatch('notifications/fetchNotifications')
        if (!store.state.notifications.subscribed) {
          store.dispatch('notifications/subscribeToNotifications')
        }
      } else if (!newValue && oldValue) {
        if (store.state.notifications.subscribed) {
          store.dispatch('notifications/unsubscribeFromNotifications');
        }
      }
    }, { immediate: false })

    const logout = async () => {
      try {
        if (store.state.notifications.subscribed) {
          await store.dispatch('notifications/unsubscribeFromNotifications');
        }

        if (store.state.message.realtime.subscribed) {
          await store.dispatch('message/unsubscribeFromMessages');
        }

        await store.dispatch('auth/logout');
      } catch (error) {
        console.error('Lỗi khi đăng xuất:', error);
      }

      router.push('/auth');
      mobileMenuOpen.value = false;
      adminMobileMenuOpen.value = false;
      showNotificationsPanel.value = false;

      router.push('/auth').then(() => {
        // Force reload page để clear tất cả state
        window.location.reload();
      });
    }

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }

    const toggleAdminMobileMenu = () => {
      adminMobileMenuOpen.value = !adminMobileMenuOpen.value
    }

    const toggleNotifications = async () => {
      showNotificationsPanel.value = !showNotificationsPanel.value
      if (showNotificationsPanel.value && isLoggedIn.value) {
        try {
          await store.dispatch('notifications/fetchNotifications')
        } catch (error) {
          console.error('Lỗi khi lấy thông báo:', error)
        }
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) {
          return ''
        }
        const now = new Date()
        if (date.getFullYear() === now.getFullYear() &&
          date.getMonth() === now.getMonth() &&
          date.getDate() === now.getDate()) {
          return `Hôm nay, ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
        }
        const yesterday = new Date(now)
        yesterday.setDate(now.getDate() - 1)
        if (date.getFullYear() === yesterday.getFullYear() &&
          date.getMonth() === yesterday.getMonth() &&
          date.getDate() === yesterday.getDate()) {
          return `Hôm qua, ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
        }
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}, ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
      } catch (error) {
        console.error('Lỗi khi format ngày tháng:', error)
        return dateString || ''
      }
    }

    const handleNotificationClick = (notification) => {
      if (!notification) return;

      // Đánh dấu đã đọc
      if (notification.id && !notification.is_read || notification.type === "profile_creating") {
        store.dispatch('notifications/markAsRead', notification.id);
      }

      try {
        const additionalData = notification.additional_data || {};

        // Xử lý thông báo tin nhắn
        if (notification.type === 'new_message' || notification.content?.includes('Tin nhắn mới từ')) {
          // Lấy ID phiên chat từ dữ liệu bổ sung
          const chatSessionId = additionalData.chat_session_id || additionalData.session_id;

          if (chatSessionId) {
            // Điều hướng đến trang messages với ID phiên chat
            router.push({
              path: '/messages',
              query: { session: chatSessionId }
            });

            // Xóa thông báo này sau khi đã điều hướng
            if (notification.id) {
              store.dispatch('notifications/removeNotification', notification.id);
            }
          } else {
            // Nếu không có session ID, chỉ chuyển đến trang messages
            router.push('/messages');
          }
        }
        // Xử lý thông báo khớp kết quả (match_found)
        else if (notification.type === 'match_found') {
          const matchingReportId = additionalData.matching_report_id;

          if (matchingReportId) {
            router.push(`/recently-missing/${matchingReportId}`);
          }
        }
        // Xử lý thông báo khớp khuôn mặt cao (high_face_match)
        else if (notification.type === 'high_face_match') {
          const matchingReportId = additionalData.matching_report_id;

          if (matchingReportId) {
            router.push(`/recently-missing/${matchingReportId}`);
          }
        }
        // Xử lý các loại thông báo khác
        else if (notification.type === 'new_match' ||
          notification.type === 'profile_created_with_matches' ||
          notification.type === 'profile_created') {
          const targetId = notification.related_entity_id || additionalData.profile_id || additionalData.matching_profile_id;
          if (targetId) {
            router.push(`/profile/${targetId}`);
          }
        }
        // Xử lý thông báo báo cáo được tạo (report_created)
        else if (notification.type === 'report_created') {
          const reportId = notification.related_entity_id || additionalData.report_id;
          if (reportId) {
            router.push(`/report/${reportId}`);
          }
        }
        // Xử lý thông báo cập nhật báo cáo (report_updated)
        else if (notification.type === 'report_updated') {
          const reportId = notification.related_entity_id || additionalData.report_id;
          if (reportId) {
            router.push(`/report/${reportId}`);
          }
        }
        // Xử lý thông báo chung với related_entity_id
        else if (notification.related_entity_id) {
          // Thử điều hướng đến profile trước
          router.push(`/profile/${notification.related_entity_id}`);
        }
      } catch (error) {
        console.error('Lỗi khi xử lý click thông báo:', error);
      }

      showNotificationsPanel.value = false;
    }

    const markAllAsRead = () => {
      store.dispatch('notifications/markAllAsRead')
    }

    const handleClickOutside = (event) => {
      const notificationPanel = document.querySelector('.notification-dropdown')
      const notificationToggle = event.target.closest('[data-notification-toggle]')

      if (showNotificationsPanel.value && notificationPanel &&
        !notificationPanel.contains(event.target) &&
        !notificationToggle) {
        showNotificationsPanel.value = false
      }
    }

    return {
      logout,
      isLoggedIn,
      navLinks,
      mobileMenuOpen,
      toggleMobileMenu,
      adminMobileMenuOpen,
      toggleAdminMobileMenu,
      showNotificationsPanel,
      toggleNotifications,
      hasUnreadNotifications,
      allNotifications,
      recentNotifications,
      unreadCount,
      loading,
      formatDate,
      handleNotificationClick,
      markAllAsRead,
      formatNotificationContent,
      route,
      isAdmin,
      isAuthenticated,
    }
  }
}
</script>

<style scoped>
.animate-slide-down {
  animation: slideDown 0.3s ease-out forwards;
}

@keyframes slideDown {
  from {
    max-height: 0;
    opacity: 0;
  }

  to {
    max-height: 500px;
    opacity: 1;
  }
}

/* Thêm hiệu ứng cho chuông thông báo */
.bell-animation {
  animation: bellRing 0.5s ease-in-out infinite;
}

@keyframes bellRing {

  0%,
  100% {
    transform: rotate(0);
  }

  25% {
    transform: rotate(15deg);
  }

  75% {
    transform: rotate(-15deg);
  }
}

.notification-badge-pulse {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }

  70% {
    box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

/* Custom responsive classes */
@media (min-width: 768px) and (max-width: 1279px) {
  .nav-icon-only {
    min-width: 40px;
    justify-content: center;
  }
}
</style>