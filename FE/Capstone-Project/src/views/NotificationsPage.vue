<template>
  <div class="min-h-screen bg-slate-50">
    <AppHeader />
    <div class="max-w-7xl mx-auto px-3 sm:px-4 pt-20 pb-8">
      <!-- Hero Section -->
      <section class="bg-white rounded-lg p-3 mb-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <i class="fas fa-bell text-base"></i>
            </div>
            <div>
              <h1 class="text-base font-bold text-slate-800">Thông báo</h1>
              <p class="text-xs text-slate-500">Xem tất cả thông báo và cập nhật của bạn</p>
            </div>
          </div>
          <button 
            v-if="hasUnreadNotifications"
            @click="markAllAsRead" 
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-colors">
            <i class="fas fa-check-circle text-xs"></i>
            <span>Đánh dấu đã đọc tất cả</span>
          </button>
        </div>
      </section>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg border border-slate-200 p-6 flex justify-center">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p class="mt-3 text-xs text-slate-600">Đang tải thông báo...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="allNotifications.length === 0" class="bg-white rounded-lg border border-slate-200 p-6 text-center">
        <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <i class="fas fa-bell-slash text-blue-500 text-lg"></i>
        </div>
        <h3 class="text-sm font-semibold text-slate-800 mb-1">Chưa có thông báo nào</h3>
        <p class="text-xs text-slate-600 mb-4 max-w-md mx-auto">
          Thông báo mới về các hồ sơ phù hợp và cập nhật sẽ xuất hiện ở đây
        </p>
      </div>

      <!-- Notification List -->
      <div v-else class="space-y-3">
        <div v-for="notification in allNotifications" :key="notification.id"
          class="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-lg border border-gray-200/80 hover:border-blue-300/60 transition-all duration-300 overflow-hidden group cursor-pointer relative"
          :class="{ 'bg-blue-50/40': !notification.is_read }"
          @click="handleNotificationClick(notification)">
          
          <!-- Accent line on hover -->
          <div
            class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          </div>

          <div class="p-4 md:p-5">
            <div class="flex gap-3">
              <!-- Icon -->
              <div class="flex-shrink-0">
                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-sm ring-2 ring-blue-50"
                  :class="getNotificationIconClass(notification.type)">
                  <i :class="`${getNotificationIcon(notification.type)} text-base sm:text-lg`"></i>
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <!-- Header: Tag and timestamp -->
                <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span 
                      :class="`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold ${getNotificationTagClass(notification.type)}`">
                      {{ getNotificationTagText(notification.type) }}
                    </span>
                    <span v-if="!notification.is_read" 
                      class="w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white shadow-sm"></span>
                  </div>
                  <p class="text-xs text-gray-400 flex items-center gap-1.5">
                    <i class="fas fa-clock text-[10px]"></i>
                    <span>{{ formatDate(notification.created_at) }}</span>
                  </p>
                </div>
                
                <!-- Content display -->
                <div v-if="notification.type === 'new_match'" class="text-sm mb-3 leading-relaxed">
                  <p class="font-medium text-gray-800 mb-2">
                    Có hồ sơ mới phù hợp với hồ sơ của bạn
                  </p>
                  <div class="space-y-1.5 text-xs text-gray-600">
                    <p>Hồ sơ mới: <span class="font-semibold text-blue-600">{{ getProfileTitle(notification, 'matching_profile_title') || 'Chưa xác định' }}</span></p>
                    <p>Hồ sơ của bạn: <span class="font-semibold text-green-600">{{ getProfileTitle(notification, 'your_profile_title') || 'Chưa xác định' }}</span></p>
                  </div>
                </div>
                
                <div v-else-if="notification.type === 'profile_created_with_matches'" class="text-sm mb-3 leading-relaxed">
                  <p class="font-medium text-gray-800 mb-2">
                    Hồ sơ <span class="text-blue-600">"{{ getRelatedProfileTitle(notification) || 'Chưa xác định' }}"</span> 
                    đã được tạo thành công
                  </p>
                  
                  <div class="mt-2 bg-blue-50/50 rounded-lg p-3 border border-blue-100">
                    <div class="flex items-center gap-2 mb-2">
                      <i class="fas fa-check-circle text-green-500 text-xs"></i>
                      <span class="text-xs font-semibold text-gray-700">{{ getMatchCount(notification) }} hồ sơ phù hợp</span>
                    </div>
                    
                    <div v-if="notification.additional_data && notification.additional_data.matching_profiles" 
                         class="space-y-1.5">
                      <div v-for="(profile, idx) in notification.additional_data.matching_profiles.slice(0, 3)" :key="idx"
                           class="pl-2 border-l-2 border-blue-200 py-1 text-xs text-gray-600 flex items-center">
                        <i class="fas fa-user-circle text-gray-400 mr-2 text-[10px]"></i>
                        <span class="truncate">{{ profile.title }}</span>
                      </div>
                      
                      <div v-if="notification.additional_data.matching_profiles.length > 3" 
                           class="text-blue-600 pl-2 text-[10px] mt-1 font-medium">
                        + {{ notification.additional_data.matching_profiles.length - 3 }} hồ sơ khác
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-else class="text-sm text-gray-800 mb-3 leading-relaxed">
                  <p v-html="formatNotificationContent(notification)"></p>
                </div>
                
                <!-- Action button -->
                <div class="mt-3 pt-3 border-t border-gray-100">
                  <button class="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1.5">
                    <span>{{ getActionText(notification.type) }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import AppHeader from '../components/common/AppHeader.vue'

export default {
  name: 'NotificationsPage',
  
  components: {
    AppHeader
  },
  
  setup() {
    const store = useStore()
    const router = useRouter()
    
    // Get notifications from store
    const allNotifications = computed(() => store.getters['notifications/allNotifications'])
    const hasUnreadNotifications = computed(() => store.getters['notifications/hasUnreadNotifications'])
    const loading = computed(() => store.state.notifications.loading)
    
    // Load notifications when component mounts
    onMounted(() => {
      store.dispatch('notifications/fetchNotifications')
    })
    
    // Format date - compact format
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
        console.error('Lỗi khi format ngày tháng:', error)
        return dateString || ''
      }
    }
    
    // Format notification content
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
    
    // Mark all notifications as read
    const markAllAsRead = () => {
      store.dispatch('notifications/markAllAsRead')
    }
    
    // Handle notification click
    const handleNotificationClick = (notification) => {
      if (!notification) return

      // Mark as read
      if (notification.id && !notification.is_read) {
        store.dispatch('notifications/markAsRead', notification.id)
      }

      // Handle navigation based on notification type and additional_data
      try {
        const additionalData = notification.additional_data || {}

        if (notification.type === 'new_match') {
          // Navigate to the profile that matches with user's profile
          if (additionalData.matching_profile_id) {
            router.push(`/profile/${additionalData.matching_profile_id}`)
          } else if (notification.related_entity_id) {
            router.push(`/profile/${notification.related_entity_id}`)
          }
        } else if (notification.type === 'profile_created_with_matches') {
          // Navigate to user's profile with suggestions
          if (notification.related_entity_id) {
            router.push(`/profile/${notification.related_entity_id}`)
          }
        }
      } catch (error) {
        console.error('Lỗi khi xử lý click thông báo:', error)
      }
    }
    
    // Get icon class based on notification type
    const getNotificationIconClass = (type) => {
      switch (type) {
        case 'profile_created':
        case 'profile_created_with_matches':
          return 'bg-green-100 text-green-600'
        case 'new_match':
        case 'match_found':
        case 'high_face_match':
          return 'bg-blue-100 text-blue-600'
        case 'new_message':
          return 'bg-purple-100 text-purple-600'
        default:
          return 'bg-gray-100 text-gray-600'
      }
    }
    
    // Get icon based on notification type
    const getNotificationIcon = (type) => {
      switch (type) {
        case 'profile_created':
          return 'fas fa-check-circle'
        case 'profile_created_with_matches':
          return 'fas fa-user-plus'
        case 'new_match':
        case 'match_found':
        case 'high_face_match':
          return 'fas fa-handshake'
        case 'new_message':
          return 'fas fa-comment'
        default:
          return 'fas fa-bell'
      }
    }
    
    // Get tag class based on notification type
    const getNotificationTagClass = (type) => {
      switch (type) {
        case 'profile_created':
        case 'profile_created_with_matches':
          return 'bg-green-50 text-green-700 border border-green-200'
        case 'new_match':
        case 'match_found':
        case 'high_face_match':
          return 'bg-blue-50 text-blue-700 border border-blue-200'
        case 'new_message':
          return 'bg-purple-50 text-purple-700 border border-purple-200'
        default:
          return 'bg-gray-50 text-gray-700 border border-gray-200'
      }
    }
    
    // Get tag text based on notification type
    const getNotificationTagText = (type) => {
      switch (type) {
        case 'profile_created':
          return 'Hồ sơ mới'
        case 'profile_created_with_matches':
          return 'Hồ sơ có khớp'
        case 'new_match':
        case 'match_found':
        case 'high_face_match':
          return 'Hồ sơ khớp'
        case 'new_message':
          return 'Tin nhắn'
        default:
          return 'Thông báo'
      }
    }
    
    // Get action text based on notification type
    const getActionText = (type) => {
      switch (type) {
        case 'profile_created':
          return 'Xem hồ sơ'
        case 'profile_created_with_matches':
          return 'Xem hồ sơ và gợi ý'
        case 'new_match':
          return 'Xem chi tiết hồ sơ phù hợp'
        default:
          return 'Xem chi tiết'
      }
    }
    
    // Lấy tiêu đề hồ sơ từ additional_data
    const getProfileTitle = (notification, key) => {
      if (!notification.additional_data) return '';
      return notification.additional_data[key] || '';
    };
    
    // Lấy tiêu đề hồ sơ liên quan
    const getRelatedProfileTitle = (notification) => {
      if (!notification.additional_data) return '';
      
      // Nếu có profile_id trong additional_data
      if (notification.additional_data.profile_title) {
        return notification.additional_data.profile_title;
      }
      
      // Lấy từ content nếu không có trong additional_data
      const contentMatch = notification.content.match(/"([^"]+)"/);
      return contentMatch ? contentMatch[1] : '';
    };
    
    // Đếm số lượng hồ sơ phù hợp
    const getMatchCount = (notification) => {
      if (!notification.additional_data || !notification.additional_data.matching_profiles) {
        return '0';
      }
      return notification.additional_data.matching_profiles.length;
    };
    
    return {
      allNotifications,
      hasUnreadNotifications,
      loading,
      formatDate,
      markAllAsRead,
      handleNotificationClick,
      getNotificationIconClass,
      getNotificationIcon,
      getNotificationTagClass,
      getNotificationTagText,
      getActionText,
      getProfileTitle,
      getRelatedProfileTitle,
      getMatchCount,
      formatNotificationContent
    }
  }
}
</script>

<style scoped>
/* Smooth transitions */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Subtle card hover effect */
.group:hover {
  transform: translateY(-1px);
}
</style>