<template>
  <div id="rm-list" class="space-y-3 md:space-y-4">
    <div v-for="(profile, index) in profiles" :key="profile.id"
      class="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-lg border border-gray-200/80 hover:border-blue-300/60 transition-all duration-300 overflow-hidden group cursor-pointer relative"
      :class="[
        { 'bg-blue-50/40': isOwnProfile(profile) },
        index === 0 ? 'rm-first-card' : ''
      ]">
      
      <!-- Accent line on hover -->
      <div
        class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      </div>

      <!-- Own Profile Badge -->
      <div v-if="isOwnProfile(profile)" class="absolute top-2.5 right-2.5 z-10">
        <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white shadow-md backdrop-blur-sm">
          <i class="fas fa-user-check text-[10px] mr-1"></i>
          Của bạn
        </span>
      </div>

      <div class="flex flex-col md:flex-row">
        <!-- Phần ảnh -->
        <div
          class="w-full md:w-[180px] lg:w-[200px] relative aspect-[4/3] md:aspect-square overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100">
          <div class="absolute inset-0">
            <img v-if="profile.image_url" 
              :src="profile.image_url + '?t=' + Date.now()"
              :alt="profile.title || profile.name"
              class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              @error="handleImageError" />
            <div v-else
              class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-gray-50 to-gray-100">
              <img :src="noImage" alt="Không có hình ảnh"
                class="w-16 h-16 md:w-20 md:h-20 object-contain opacity-25" />
            </div>
          </div>

          <!-- Profile Type Badge -->
          <div class="absolute top-2.5 left-2.5 z-10">
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold shadow-md backdrop-blur-sm" :class="{
              'bg-blue-500 text-white': profile.profile_type === 'seeker',
              'bg-green-500 text-white': profile.profile_type === 'finder'
            }">
              <i :class="{
                'fas fa-search text-[10px]': profile.profile_type === 'seeker',
                'fas fa-eye text-[10px]': profile.profile_type === 'finder'
              }" class="mr-1"></i>
              {{ profile.profile_type === 'seeker' ? 'Người đi tìm' : 'Người cung cấp' }}
            </span>
          </div>

          <!-- Status Badge -->
          <div class="absolute bottom-2.5 left-2.5 z-10" v-if="profile.status">
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold shadow-md backdrop-blur-sm" :class="{
              'bg-green-500 text-white': profile.status === 'active',
              'bg-blue-500 text-white': profile.status === 'found',
              'bg-gray-500 text-white': profile.status === 'closed'
            }">
              {{ getStatusText(profile.status) }}
            </span>
          </div>
        </div>

        <!-- Phần thông tin -->
        <div class="flex-1 p-4 md:p-5 flex flex-col">
          <!-- Header: Title -->
          <div class="mb-3">
            <router-link :to="`/recently-missing/${profile.id}`" class="block">
              <h3
                class="text-base md:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-2">
                {{ profile.title || profile.name || 'Không có tiêu đề' }}
              </h3>
            </router-link>
            
            <!-- Posted by và time -->
            <div class="flex items-center gap-2 flex-wrap text-xs text-gray-500">
              <div class="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{{ profile.username || 'Ẩn danh' }}</span>
              </div>
              <span>•</span>
              <div class="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ formatTimeAgo(profile.created_at) }}</span>
              </div>
            </div>
          </div>

          <!-- Thông tin chi tiết -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
            <!-- Tên người thất lạc -->
            <div v-if="profile.name" class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-400 flex-shrink-0" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="text-xs text-gray-600 font-medium whitespace-nowrap">Tên:</span>
              <span
                class="text-sm font-semibold text-gray-900 bg-gradient-to-r from-blue-50 to-blue-50/80 px-2.5 py-1 rounded-md truncate">
                {{ profile.name }}
              </span>
            </div>

            <!-- Tuổi -->
            <div v-if="profile.age" class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-400 flex-shrink-0" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-xs text-gray-600 font-medium whitespace-nowrap">Tuổi:</span>
              <span
                class="text-sm font-semibold text-gray-900 bg-gradient-to-r from-blue-50 to-blue-50/80 px-2.5 py-1 rounded-md">
                {{ profile.age }} tuổi
              </span>
            </div>

            <!-- Địa điểm -->
            <div v-if="profile.location" class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-400 flex-shrink-0" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="text-xs text-gray-600 font-medium whitespace-nowrap">Địa điểm:</span>
              <span
                class="text-sm font-semibold text-gray-900 bg-gradient-to-r from-blue-50 to-blue-50/80 px-2.5 py-1 rounded-md truncate">
                {{ profile.location }}
              </span>
            </div>

            <!-- Ngày mất tích/gặp -->
            <div v-if="profile.missing_date" class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-400 flex-shrink-0" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-xs text-gray-600 font-medium whitespace-nowrap">
                {{ profile.profile_type === 'seeker' ? 'Ngày mất tích:' : 'Ngày gặp:' }}
              </span>
              <span
                class="text-sm font-semibold text-gray-900 bg-gradient-to-r from-blue-50 to-blue-50/80 px-2.5 py-1 rounded-md">
                {{ formatDate(profile.missing_date) }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <div v-if="profile.description" class="mb-3">
            <p class="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {{ profile.description }}
            </p>
          </div>

          <!-- Footer: Actions -->
          <div class="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2"
            :class="index === 0 ? 'rm-first-card-actions' : ''">
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Cập nhật: {{ formatDate(profile.updated_at || profile.created_at) }}</span>
            </div>

            <div class="flex items-center gap-2">
              <!-- Contact button (if not own profile and user is logged in) -->
              <button v-if="!isOwnProfile(profile) && currentUser" 
                @click.stop="openContactModal(profile)"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors">
                <i class="fas fa-envelope text-[10px] mr-1.5"></i>
                <span class="hidden sm:inline">Liên hệ</span>
              </button>

              <!-- Login prompt for non-logged in users -->
              <router-link v-else-if="!isOwnProfile(profile) && !currentUser" 
                to="/auth"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gray-600 hover:bg-gray-700 transition-colors">
                <i class="fas fa-sign-in-alt text-[10px] mr-1.5"></i>
                <span class="hidden sm:inline">Đăng nhập</span>
              </router-link>

              <!-- Share button -->
              <button @click.stop="shareProfile(profile)"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                <i class="fas fa-share-alt text-[10px] mr-1.5"></i>
                <span class="hidden sm:inline">Chia sẻ</span>
              </button>

              <!-- View detail button -->
              <router-link :to="`/recently-missing/${profile.id}`"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <i class="fas fa-eye text-[10px] mr-1.5"></i>
                <span class="hidden sm:inline">Chi tiết</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { watch } from 'vue';
import { format } from 'date-fns';
import { formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale';
import noImage from '@/assets/images/no_image.png';

export default {
  name: 'RecentlyMissingList',

  props: {
    profiles: {
      type: Array,
      required: true
    },
    currentUser: {
      type: Object,
      default: null
    }
  },

  emits: ['contact-profile', 'share-profile'],

  setup(props, { emit }) {
    // Debug: Log currentUser để kiểm tra
    watch(() => props.currentUser, (newValue) => {
      console.log('🔍 RecentlyMissingList currentUser changed:', newValue);
    }, { immediate: true });

    // Check if profile belongs to current user
    const isOwnProfile = (profile) => {
      if (!profile || !props.currentUser) {
        return false;
      }

      const isOwn = (
        profile.username === props.currentUser.username ||
        profile.username === props.currentUser.email ||
        (props.currentUser.email && profile.username === props.currentUser.email)
      );

      return isOwn;
    };

    // Format date to DD/MM/YYYY
    const formatDate = (dateString) => {
      if (!dateString) return '';
      try {
        return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
      } catch (error) {
        return dateString;
      }
    };

    // Format relative time (e.g., "2 ngày trước")
    const formatTimeAgo = (dateString) => {
      if (!dateString) return '';
      try {
        const result = formatDistance(new Date(dateString), new Date(), {
          addSuffix: true,
          locale: vi
        });
        return result;
      } catch (error) {
        return formatDate(dateString);
      }
    };

    // Get status text
    const getStatusText = (status) => {
      switch (status) {
        case 'active': return 'Đang tìm kiếm';
        case 'found': return 'Đã tìm thấy';
        case 'closed': return 'Đã đóng';
        default: return status;
      }
    };

    // Handle image error
    const handleImageError = (event) => {
      event.target.src = noImage;
    };

    // Open contact modal
    const openContactModal = (profile) => {
      emit('contact-profile', profile);
    };

    // Share profile
    const shareProfile = (profile) => {
      const url = `${window.location.origin}/recently-missing/${profile.id}`;

      if (navigator.share) {
        navigator.share({
          title: profile.title || profile.name,
          text: `${profile.title || profile.name} - ${profile.name || 'Thông tin tìm kiếm'}`,
          url: url
        }).catch(err => {
          console.log('Error sharing:', err);
          copyToClipboard(url);
        });
      } else {
        copyToClipboard(url);
      }

      emit('share-profile', profile);
    };

    // Copy to clipboard fallback
    const copyToClipboard = (text) => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          alert('Đã sao chép liên kết vào clipboard!');
        });
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          alert('Đã sao chép liên kết vào clipboard!');
        } catch (err) {
          console.error('Unable to copy to clipboard:', err);
          alert('Không thể sao chép. Vui lòng copy thủ công: ' + text);
        }
        document.body.removeChild(textArea);
      }
    };

    return {
      isOwnProfile,
      formatDate,
      formatTimeAgo,
      getStatusText,
      handleImageError,
      openContactModal,
      shareProfile,
      noImage
    };
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.min-w-0 {
  min-width: 0;
}

.flex-shrink-0 {
  flex-shrink: 0;
}
</style>