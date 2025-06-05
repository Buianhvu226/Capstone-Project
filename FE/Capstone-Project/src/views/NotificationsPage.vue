<template>
  <div class="pt-20 pb-12">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-between">
          <h1 class="text-xl font-bold text-white flex items-center">
            <i class="fa fa-bell mr-3"></i>
            Thông báo
          </h1>
          <button 
            v-if="hasUnreadNotifications"
            @click="markAllAsRead" 
            class="text-sm bg-blue-400 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors">
            <i class="fa fa-check-circle mr-1"></i> Đánh dấu đã đọc tất cả
          </button>
        </div>

        <!-- Loading state with improved UI -->
        <div v-if="loading" class="p-12 text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-500"></div>
          <p class="mt-4 text-gray-600 text-lg">Đang tải thông báo...</p>
        </div>

        <!-- Empty state with illustration -->
        <div v-else-if="allNotifications.length === 0" class="p-16 text-center">
          <div class="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-5">
            <i class="fa fa-bell-slash text-gray-400 text-2xl"></i>
          </div>
          <p class="text-xl font-medium text-gray-700 mb-2">Chưa có thông báo nào</p>
          <p class="text-gray-500 max-w-sm mx-auto">
            Thông báo mới về các hồ sơ phù hợp và cập nhật sẽ xuất hiện ở đây
          </p>
        </div>

        <!-- Notification list with improved card design -->
        <div v-else class="divide-y divide-gray-100">
          <div v-for="notification in allNotifications" :key="notification.id"
            :class="{ 'bg-blue-50': !notification.is_read }"
            class="p-5 transition-all duration-200 hover:bg-gray-50 cursor-pointer"
            @click="handleNotificationClick(notification)">
            
            <div class="flex">
              <!-- Left side - Icon based on notification type -->
              <div class="mr-4 flex-shrink-0">
                <div class="w-12 h-12 rounded-full flex items-center justify-center"
                  :class="getNotificationIconClass(notification.type)">
                  <i :class="getNotificationIcon(notification.type) + ' text-lg'"></i>
                </div>
              </div>

              <!-- Right side - Content -->
              <div class="flex-1">
                <!-- Status indicator and timestamp -->
                <div class="flex justify-between items-center mb-1.5">
                  <div class="flex items-center">
                    <span 
                      :class="`px-2 py-0.5 rounded-full text-xs font-medium ${getNotificationTagClass(notification.type)}`">
                      {{ getNotificationTagText(notification.type) }}
                    </span>
                    <span v-if="!notification.is_read" class="ml-2 w-2 h-2 bg-blue-400 rounded-full"></span>
                  </div>
                  <p class="text-xs text-gray-500 flex items-center">
                    <i class="fa fa-clock-o mr-1"></i>
                    {{ formatDate(notification.created_at) }}
                  </p>
                </div>
                
                <!-- Enhanced content display -->
                <div v-if="notification.type === 'new_match'" class="text-sm mb-3 leading-relaxed">
                  <p class="font-medium text-gray-800">
                    Có hồ sơ mới phù hợp với hồ sơ của bạn
                  </p>
                  <div class="mt-2 flex items-start space-x-2">
                    <div class="w-1 h-full flex-shrink-0 bg-blue-500 rounded-full mt-1.5"></div>
                    <div>
                      <p class="text-gray-700">Hồ sơ mới: <span class="font-medium text-blue-400">{{ getProfileTitle(notification, 'matching_profile_title') }}</span></p>
                      <p class="text-gray-700">Hồ sơ của bạn: <span class="font-medium text-green-600">{{ getProfileTitle(notification, 'your_profile_title') }}</span></p>
                    </div>
                  </div>
                </div>
                
                <div v-else-if="notification.type === 'profile_created_with_matches'" class="text-sm mb-3 leading-relaxed">
                  <p class="font-medium text-gray-800">
                    Hồ sơ <span class="text-blue-400">"{{ getRelatedProfileTitle(notification) }}"</span> 
                    đã được tạo thành công
                  </p>
                  
                  <div class="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div class="flex items-center mb-2">
                      <i class="fa fa-check-circle text-green-500 mr-2"></i>
                      <span class="text-gray-700 font-medium">{{ getMatchCount(notification) }} hồ sơ phù hợp</span>
                    </div>
                    
                    <div v-if="notification.additional_data && notification.additional_data.matching_profiles" 
                         class="space-y-2">
                      <div v-for="(profile, idx) in notification.additional_data.matching_profiles.slice(0, 3)" :key="idx"
                           class="pl-3 border-l-2 border-gray-200 py-1 text-gray-600 flex items-center">
                        <i class="fa fa-user-circle-o text-gray-400 mr-2"></i>
                        {{ profile.title }}
                      </div>
                      
                      <div v-if="notification.additional_data.matching_profiles.length > 3" 
                           class="text-blue-500 pl-3 text-xs mt-1">
                        + {{ notification.additional_data.matching_profiles.length - 3 }} hồ sơ khác
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-else class="text-sm text-gray-800 mb-3">
                  {{ notification.content }}
                </div>
                
                <!-- Action button -->
                <div class="mt-3">
                  <button class="text-xs text-blue-400 hover:text-blue-800 font-medium flex items-center">
                    <span>{{ getActionText(notification.type) }}</span>
                    <i class="fa fa-chevron-right ml-1"></i>
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

export default {
  name: 'NotificationsPage',
  
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
    
    // Format date
    const formatDate = (dateString) => {
      if (!dateString) return ''

      try {
        const date = new Date(dateString)

        // Kiểm tra xem date có hợp lệ không
        if (isNaN(date.getTime())) {
          return ''
        }

        const now = new Date()

        // Check if date is today
        if (date.toDateString() === now.toDateString()) {
          return `Hôm nay, ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
        }

        // Check if date is yesterday
        const yesterday = new Date(now)
        yesterday.setDate(now.getDate() - 1)
        if (date.toDateString() === yesterday.toDateString()) {
          return `Hôm qua, ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
        }

        // Otherwise return formatted date
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}, ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
      } catch (error) {
        console.error('Lỗi khi format ngày tháng:', error)
        return dateString || ''
      }
    }
    
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
          return 'bg-green-100 text-green-600'
        case 'profile_created_with_matches':
          return 'bg-green-100 text-green-600'
        case 'new_match':
          return 'bg-blue-100 text-blue-400'
        default:
          return 'bg-gray-100 text-gray-600'
      }
    }
    
    // Get icon based on notification type
    const getNotificationIcon = (type) => {
      switch (type) {
        case 'profile_created':
          return 'fa fa-check-circle'
        case 'profile_created_with_matches':
          return 'fa fa-user-plus'
        case 'new_match':
          return 'fa fa-handshake-o'
        default:
          return 'fa fa-bell'
      }
    }
    
    // Get tag class based on notification type
    const getNotificationTagClass = (type) => {
      switch (type) {
        case 'profile_created':
        case 'profile_created_with_matches':
          return 'bg-green-100 text-green-800'
        case 'new_match':
          return 'bg-blue-100 text-blue-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
    
    // Get tag text based on notification type
    const getNotificationTagText = (type) => {
      switch (type) {
        case 'profile_created':
          return 'Hồ sơ mới'
        case 'profile_created_with_matches':
          return 'Hồ sơ mới có khớp'
        case 'new_match':
          return 'Hồ sơ khớp'
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
      getMatchCount
    }
  }
}
</script>

<style scoped>
/* Add some animations for page transitions */
.pt-20 {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>