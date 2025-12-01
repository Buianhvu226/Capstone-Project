<template>
  <header
    class="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200/60 shadow-sm transition-all duration-300 overflow-x-hidden">
    <div
      class="w-full max-w-full flex items-center justify-between px-2 sm:px-3 md:px-4 lg:px-6 py-1.5 sm:py-2 md:py-2.5 min-w-0">
      <!-- Logo -->
      <router-link to="/" class="group flex items-center gap-1.5 flex-shrink-0">
        <div class="relative overflow-hidden rounded-lg">
          <img src="@/assets/images/logo1.png" alt="Logo"
            class="h-7 w-auto sm:h-8 md:h-9 object-contain transition-transform duration-300 group-hover:scale-105" />
        </div>
      </router-link>

      <!-- Mobile Menu Button -->
      <button @click="toggleMobileMenu"
        class="md:hidden p-2 -mr-1 text-gray-600 hover:text-blue-500 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 touch-manipulation flex-shrink-0">
        <Menu v-if="!mobileMenuOpen" class="w-5 h-5" />
        <X v-else class="w-5 h-5" />
      </button>

      <!-- Navigation Links - Desktop -->
      <nav
        class="hidden md:flex flex-1 items-center justify-start space-x-0.5 lg:space-x-1 xl:space-x-1.5 ml-3 lg:ml-4 xl:ml-6 min-w-0 overflow-hidden">
        <router-link v-for="link in navLinks" :key="link.path" :to="link.path"
          class="flex items-center gap-1 lg:gap-1.5 px-2 lg:px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0"
          :class="[route.path === link.path ? 'text-blue-400 bg-blue-50 shadow-sm' : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50 active:bg-gray-100']">
          <component :is="link.icon" class="w-3.5 h-3.5 flex-shrink-0" />
          <span class="hidden lg:inline">{{ link.name }}</span>
        </router-link>
      </nav>

      <!-- Actions - Desktop -->
      <div class="hidden md:flex items-center space-x-1.5 lg:space-x-2 flex-shrink-0 min-w-0">
        <template v-if="isLoggedIn">
          <!-- Notification Icon -->
          <div class="relative z-[100]" ref="notificationContainer">
            <button @click.stop="toggleNotifications"
              class="relative p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 flex-shrink-0"
              title="Thông báo" aria-label="Thông báo">
              <Bell class="w-4 h-4" :class="{ 'animate-swing': hasUnreadNotifications }" />
              <span v-if="hasUnreadNotifications"
                class="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse">
              </span>
              <span v-if="unreadCount > 0 && unreadCount <= 99"
                class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {{ unreadCount > 99 ? '99+' : unreadCount }}
              </span>
            </button>

            <!-- Notification dropdown -->
            <teleport to="body">
              <transition enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 translate-y-2 scale-95" enter-to-class="opacity-100 translate-y-0 scale-100"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 translate-y-0 scale-100" leave-to-class="opacity-0 translate-y-2 scale-95">
                <div v-if="showNotificationsPanel"
                  class="fixed bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[9999] ring-1 ring-black/5"
                  :style="notificationDropdownStyle"
                  @click.stop>
                <div
                  class="px-4 py-3 bg-gradient-to-r from-blue-50/80 to-blue-50/50 border-b border-gray-200 flex justify-between items-center backdrop-blur-sm">
                  <h3 class="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <Bell class="w-4 h-4 text-blue-500" />
                    <span>Thông báo</span>
                    <span v-if="unreadCount > 0"
                      class="ml-1 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                      {{ unreadCount > 99 ? '99+' : unreadCount }}
                    </span>
                  </h3>
                  <button v-if="hasUnreadNotifications" @click.stop="markAllAsRead"
                    class="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline active:opacity-80 transition-opacity px-2 py-1 rounded">
                    Đánh dấu đã đọc
                  </button>
                </div>

                <div class="max-h-[60vh] sm:max-h-[400px] overflow-y-auto custom-scrollbar">
                  <div v-if="loading" class="p-8 text-center text-gray-400">
                    <Loader2 class="w-6 h-6 mx-auto animate-spin mb-2" />
                    <span class="text-xs">Đang tải...</span>
                  </div>
                  <div v-else-if="allNotifications.length === 0"
                    class="p-8 text-center text-gray-500 flex flex-col items-center">
                    <BellOff class="w-10 h-10 text-gray-300 mb-3" />
                    <p class="text-sm font-medium text-gray-600">Không có thông báo nào</p>
                    <p class="text-xs text-gray-400 mt-1">Bạn sẽ nhận được thông báo khi có hoạt động mới</p>
                  </div>
                  <div v-else>
                    <div v-for="notification in recentNotifications" :key="notification.id"
                      class="group border-b border-gray-100 last:border-b-0 transition-all duration-150 hover:bg-blue-50/50 active:bg-blue-100/50 cursor-pointer touch-manipulation"
                      :class="{ 'bg-blue-50/60': !notification.is_read }"
                      @click="handleNotificationClick(notification)">
                      <div class="p-3 sm:p-4 flex gap-3">
                        <div class="flex-shrink-0 mt-0.5">
                          <div
                            class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm ring-2 ring-blue-50">
                            <component :is="getNotificationIcon(notification.type)" class="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm text-gray-800 leading-snug mb-1.5 break-words font-medium"
                            v-html="formatNotificationContent(notification)"></p>
                          <p class="text-xs text-gray-400 flex items-center gap-1.5">
                            <Clock class="w-3 h-3 flex-shrink-0" />
                            <span class="truncate">{{ formatDate(notification.created_at) }}</span>
                          </p>
                        </div>
                        <div v-if="!notification.is_read" class="flex-shrink-0 mt-2">
                          <div class="w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-white shadow-sm"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="p-2.5 border-t border-gray-200 bg-gray-50/50">
                  <router-link to="/notifications"
                    class="block w-full py-2.5 text-center text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-white active:bg-gray-50 rounded-lg transition-all duration-200"
                    @click="showNotificationsPanel = false">
                    Xem tất cả thông báo
                  </router-link>
                </div>
              </div>
            </transition>
            </teleport>
          </div>

          <!-- User Account -->
          <router-link to="/account"
            class="w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 flex-shrink-0"
            title="Tài khoản" aria-label="Tài khoản">
            <User class="w-4 h-4" />
          </router-link>

          <!-- Logout Button -->
          <button @click="logout"
            class="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 px-2.5 lg:px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 flex-shrink-0">
            <LogOut class="w-3.5 h-3.5 flex-shrink-0" />
            <span class="hidden xl:inline">Đăng xuất</span>
          </button>
        </template>

        <template v-else>
          <router-link to="/auth"
            class="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-3 lg:px-4 py-1.5 rounded-full text-xs font-medium shadow-sm hover:shadow-md active:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 flex-shrink-0">
            <LogIn class="w-3.5 h-3.5 flex-shrink-0" />
            <span>Đăng nhập</span>
          </router-link>
        </template>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0" enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in" leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0">
      <div v-if="mobileMenuOpen"
        class="md:hidden bg-white border-t border-gray-200 shadow-xl max-h-[85vh] overflow-y-auto custom-scrollbar">
        <nav class="p-4 sm:p-5 space-y-1.5">
          <router-link v-for="link in navLinks" :key="link.path" :to="link.path" @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 touch-manipulation active:scale-[0.98]"
            :class="[route.path === link.path ? 'bg-blue-50 text-blue-400 font-semibold shadow-sm' : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100']">
            <component :is="link.icon" class="w-4 h-4 flex-shrink-0" />
            <span class="text-sm font-medium">{{ link.name }}</span>
          </router-link>

          <div class="border-t border-gray-200 my-3"></div>

          <template v-if="isLoggedIn">
            <router-link to="/notifications" @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 touch-manipulation active:scale-[0.98]">
              <div class="relative flex-shrink-0">
                <Bell class="w-5 h-5" />
                <span v-if="hasUnreadNotifications"
                  class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </div>
              <span class="text-sm font-medium">Thông báo</span>
            </router-link>

            <router-link to="/account" @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 touch-manipulation active:scale-[0.98]">
              <User class="w-5 h-5 flex-shrink-0" />
              <span class="text-sm font-medium">Tài khoản</span>
            </router-link>

            <button @click="logout"
              class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-600 hover:bg-red-50 active:bg-red-100 transition-all duration-200 touch-manipulation active:scale-[0.98]">
              <LogOut class="w-5 h-5 flex-shrink-0" />
              <span class="text-sm font-medium">Đăng xuất</span>
            </button>
          </template>

          <template v-else>
            <router-link to="/auth" @click="mobileMenuOpen = false"
              class="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-4 py-3.5 rounded-xl font-semibold shadow-md active:shadow-lg active:scale-[0.98] transition-all duration-200 touch-manipulation">
              <LogIn class="w-5 h-5 flex-shrink-0" />
              <span class="text-sm">Đăng nhập</span>
            </router-link>
          </template>
        </nav>
      </div>
    </transition>
  </header>

  <!-- Admin Header -->
  <header v-if="isAdmin"
    class="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200/60 shadow-sm transition-all duration-300 overflow-x-hidden">
    <div
      class="w-full max-w-full flex items-center justify-between px-2 sm:px-3 md:px-4 lg:px-6 py-1.5 sm:py-2 md:py-2.5 min-w-0">
      <router-link to="/admin" class="flex items-center gap-1.5 hover:opacity-80 transition-opacity flex-shrink-0">
        <img src="@/assets/images/logo1.png" alt="Logo" class="h-7 w-auto sm:h-8 md:h-9 object-contain" />
        <span class="ml-1 sm:ml-1.5 font-semibold text-blue-600 text-sm sm:text-base">Admin</span>
      </router-link>

      <nav
        class="hidden md:flex items-center justify-start space-x-0.5 lg:space-x-1 xl:space-x-1.5 ml-3 lg:ml-4 xl:ml-6 min-w-0 overflow-hidden">
        <router-link to="/search"
          class="flex items-center gap-1 lg:gap-1.5 px-2 lg:px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0"
          :class="[route.path === '/search' ? 'bg-blue-50 text-blue-400 shadow-sm' : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50 active:bg-gray-100']">
          <Search class="w-3.5 h-3.5 flex-shrink-0" />
          <span class="hidden lg:inline">Tìm kiếm</span>
        </router-link>

        <router-link to="/"
          class="flex items-center gap-1 lg:gap-1.5 px-2 lg:px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0"
          :class="[route.path === '/' ? 'bg-blue-50 text-blue-400 shadow-sm' : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50 active:bg-gray-100']">
          <Newspaper class="w-3.5 h-3.5 flex-shrink-0" />
          <span class="hidden lg:inline">Hồ sơ lâu năm</span>
        </router-link>

        <router-link to="/recently-missing"
          class="flex items-center gap-1 lg:gap-1.5 px-2 lg:px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0"
          :class="[route.path === '/recently-missing' ? 'bg-blue-50 text-blue-400 shadow-sm' : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50 active:bg-gray-100']">
          <Clock class="w-3.5 h-3.5 flex-shrink-0" />
          <span class="hidden lg:inline">Thất lạc gần đây</span>
        </router-link>
      </nav>

      <div class="flex items-center gap-1.5 md:gap-2 flex-shrink-0 min-w-0">
        <button @click="toggleAdminMobileMenu"
          class="md:hidden p-2 -mr-1 text-gray-600 hover:text-blue-500 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 touch-manipulation flex-shrink-0">
          <Menu v-if="!adminMobileMenuOpen" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>

        <div class="hidden md:flex items-center">
          <button @click="logout"
            class="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 px-2.5 lg:px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 flex-shrink-0">
            <LogOut class="w-3.5 h-3.5 flex-shrink-0" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Admin Mobile Menu -->
    <transition enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0" enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in" leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0">
      <div v-if="adminMobileMenuOpen"
        class="md:hidden bg-white border-t border-gray-200 shadow-xl max-h-[85vh] overflow-y-auto custom-scrollbar">
        <nav class="w-full max-w-full py-4 px-4 sm:px-5 flex flex-col space-y-1.5">
          <router-link to="/search" @click="adminMobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 touch-manipulation active:scale-[0.98]"
            :class="[route.path === '/search' ? 'bg-blue-50 text-blue-400 font-semibold shadow-sm' : '']">
            <Search class="w-4 h-4 flex-shrink-0" />
            <span class="text-sm font-medium">Tìm kiếm</span>
          </router-link>
          <router-link to="/" @click="adminMobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 touch-manipulation active:scale-[0.98]"
            :class="[route.path === '/' ? 'bg-blue-50 text-blue-400 font-semibold shadow-sm' : '']">
            <Newspaper class="w-4 h-4 flex-shrink-0" />
            <span class="text-sm font-medium">Hồ sơ lâu năm</span>
          </router-link>
          <router-link to="/recently-missing" @click="adminMobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 touch-manipulation active:scale-[0.98]"
            :class="[route.path === '/recently-missing' ? 'bg-blue-50 text-blue-400 font-semibold shadow-sm' : '']">
            <Clock class="w-4 h-4 flex-shrink-0" />
            <span class="text-sm font-medium">Thất lạc gần đây</span>
          </router-link>
          <div class="border-t border-gray-200 my-3"></div>
          <button @click="logout"
            class="flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-600 hover:bg-red-50 active:bg-red-100 transition-all duration-200 touch-manipulation active:scale-[0.98] w-full text-left">
            <LogOut class="w-5 h-5 flex-shrink-0" />
            <span class="text-sm font-medium">Đăng xuất</span>
          </button>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import {
  Menu, X, Bell, BellOff, User, LogOut, LogIn,
  Search, Newspaper, Users, Clock, MessageCircle,
  Loader2, CheckCircle, AlertCircle, Info
} from 'lucide-vue-next'

export default {
  name: 'AppHeader',
  components: {
    Menu, X, Bell, BellOff, User, LogOut, LogIn,
    Search, Newspaper, Users, Clock, MessageCircle,
    Loader2, CheckCircle, AlertCircle, Info
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const notificationContainer = ref(null)
    const notificationDropdownStyle = ref({})

    const isAdmin = ref(false)
    const adminMobileMenuOpen = ref(false)

    onMounted(() => {
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

    // Navigation links with Lucide icons
    const navLinks = computed(() => {
      const links = [
        { path: '/', name: 'Hồ sơ thất lạc lâu năm', icon: Newspaper },
        { path: '/search', name: 'Tìm kiếm', icon: Search },
        { path: '/profile/create', name: 'Đăng ký hồ sơ', icon: Users },
        { path: '/recently-missing', name: 'Báo cáo thất lạc gần đây', icon: Clock },
      ];
      if (isLoggedIn.value) {
        links.push(
          { path: '/my-profile', name: 'Hồ sơ của tôi', icon: User },
          { path: '/messages', name: 'Nhắn tin', icon: MessageCircle },
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

    const recentNotifications = computed(() => {
      const notifications = allNotifications.value || [];
      if (!Array.isArray(notifications)) return [];

      const latestMessageNotifications = new Map();
      const nonMessageNotifications = [];

      notifications.forEach(notification => {
        if (notification.type === 'profile_creating') return;

        if (notification.type === 'new_message' || notification.content?.includes('Tin nhắn mới từ')) {
          const senderInfo = notification.additional_data?.sender_id ||
            notification.content.match(/Tin nhắn mới từ ([^\s]+)/)?.[1];

          if (senderInfo) {
            if (!latestMessageNotifications.has(senderInfo) ||
              new Date(notification.created_at) > new Date(latestMessageNotifications.get(senderInfo).created_at)) {
              latestMessageNotifications.set(senderInfo, notification);
            }
          } else {
            nonMessageNotifications.push(notification);
          }
        } else {
          nonMessageNotifications.push(notification);
        }
      });

      const filteredNotifications = [...latestMessageNotifications.values(), ...nonMessageNotifications];
      filteredNotifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return filteredNotifications.slice(0, 5);
    })

    const getNotificationIcon = (type) => {
      switch (type) {
        case 'new_message': return MessageCircle;
        case 'match_found': return CheckCircle;
        case 'high_face_match': return User;
        case 'report_created':
        case 'report_updated': return Newspaper;
        default: return Info;
      }
    }

    const formatNotificationContent = (notification) => {
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
      const profileColor = "text-blue-600 font-medium";

      if (notification.type === 'new_message' || notification.content?.includes('Tin nhắn mới từ')) {
        let senderName = ad.sender_name || (notification.content.match(/Tin nhắn mới từ ([^\s]+)/) || [])[1] || 'Ai đó';
        if (notification.message_count > 1) {
          formattedContent = `<span class="font-medium">Có ${notification.message_count} tin nhắn</span> đang chờ từ <span class="${profileColor}">${escapeHtml(senderName)}</span>`;
        } else {
          const messagePreview = ad.message_preview || 'Đã gửi một tin nhắn mới';
          formattedContent = `<span class="${profileColor}">${escapeHtml(senderName)}</span>: ${escapeHtml(messagePreview)}`;
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
      window.removeEventListener('resize', updateNotificationDropdownPosition)
      window.removeEventListener('scroll', updateNotificationDropdownPosition, true)
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
        window.location.reload();
      });
    }

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }

    const toggleAdminMobileMenu = () => {
      adminMobileMenuOpen.value = !adminMobileMenuOpen.value
    }

    const updateNotificationDropdownPosition = () => {
      if (!notificationContainer.value || !showNotificationsPanel.value) return
      
      const rect = notificationContainer.value.getBoundingClientRect()
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      
      // Tính toán width responsive
      let dropdownWidth = 384 // max-w-sm
      if (windowWidth < 640) {
        dropdownWidth = windowWidth - 32 // Mobile: full width với margin
      } else if (windowWidth < 768) {
        dropdownWidth = 320 // sm
      }
      
      // Tính toán vị trí right để dropdown không bị tràn màn hình
      const rightPosition = Math.max(16, windowWidth - rect.right)
      const leftPosition = rect.right - dropdownWidth
      
      notificationDropdownStyle.value = {
        top: `${rect.bottom + 8}px`,
        right: `${rightPosition}px`,
        width: `${dropdownWidth}px`,
        maxHeight: `${Math.min(400, windowHeight - rect.bottom - 100)}px`
      }
    }
    
    const toggleNotifications = async (e) => {
      e?.stopPropagation?.()
      showNotificationsPanel.value = !showNotificationsPanel.value
      if (showNotificationsPanel.value && isLoggedIn.value) {
        try {
          await store.dispatch('notifications/fetchNotifications')
          // Đợi DOM render xong rồi tính toán vị trí
          setTimeout(() => {
            updateNotificationDropdownPosition()
          }, 50)
        } catch (error) {
          console.error('Lỗi khi lấy thông báo:', error)
        }
      }
    }
    
    watch(showNotificationsPanel, (newVal) => {
      if (newVal) {
        updateNotificationDropdownPosition()
        window.addEventListener('resize', updateNotificationDropdownPosition)
        window.addEventListener('scroll', updateNotificationDropdownPosition, true)
      } else {
        window.removeEventListener('resize', updateNotificationDropdownPosition)
        window.removeEventListener('scroll', updateNotificationDropdownPosition, true)
      }
    })

    const formatDate = (dateString) => {
      if (!dateString) return ''
      try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return ''

        const now = new Date()
        const diff = now - date
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)

        if (minutes < 1) return 'Vừa xong'
        if (minutes < 60) return `${minutes} phút trước`
        if (hours < 24) return `${hours} giờ trước`
        if (days < 7) return `${days} ngày trước`

        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
      } catch (error) {
        return dateString || ''
      }
    }

    const handleNotificationClick = (notification) => {
      if (!notification) return;

      if (notification.id && !notification.is_read || notification.type === "profile_creating") {
        store.dispatch('notifications/markAsRead', notification.id);
      }

      try {
        const additionalData = notification.additional_data || {};

        if (notification.type === 'new_message' || notification.content?.includes('Tin nhắn mới từ')) {
          const chatSessionId = additionalData.chat_session_id || additionalData.session_id;
          if (chatSessionId) {
            router.push({ path: '/messages', query: { session: chatSessionId } });
            if (notification.id) store.dispatch('notifications/removeNotification', notification.id);
          } else {
            router.push('/messages');
          }
        }
        else if (notification.type === 'match_found' || notification.type === 'high_face_match') {
          const matchingReportId = additionalData.matching_report_id;
          if (matchingReportId) router.push(`/recently-missing/${matchingReportId}`);
        }
        else if (['new_match', 'profile_created_with_matches', 'profile_created'].includes(notification.type)) {
          const targetId = notification.related_entity_id || additionalData.profile_id || additionalData.matching_profile_id;
          if (targetId) router.push(`/profile/${targetId}`);
        }
        else if (['report_created', 'report_updated'].includes(notification.type)) {
          const reportId = notification.related_entity_id || additionalData.report_id;
          if (reportId) router.push(`/report/${reportId}`);
        }
        else if (notification.related_entity_id) {
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
      if (showNotificationsPanel.value && notificationContainer.value &&
        !notificationContainer.value.contains(event.target)) {
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
      notificationContainer,
      notificationDropdownStyle,
      getNotificationIcon
    }
  }
}
</script>

<style scoped>
.animate-swing {
  animation: swing 1s ease-in-out infinite;
  transform-origin: top center;
}

@keyframes swing {
  20% {
    transform: rotate(15deg);
  }

  40% {
    transform: rotate(-10deg);
  }

  60% {
    transform: rotate(5deg);
  }

  80% {
    transform: rotate(-5deg);
  }

  100% {
    transform: rotate(0deg);
  }
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 10px;
  transition: background-color 0.2s;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}

/* Touch manipulation for better mobile performance */
.touch-manipulation {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Smooth transitions for all interactive elements */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>