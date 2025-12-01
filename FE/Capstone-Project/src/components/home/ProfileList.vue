<template>
  <div class="w-full">
    <div class="space-y-3 md:space-y-4">
      <div v-for="profile in profiles" :key="profile.id"
        class="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-lg border border-gray-200/80 hover:border-blue-300/60 transition-all duration-300 overflow-hidden group cursor-pointer relative">
        <!-- Accent line on hover -->
        <div
          class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        </div>

        <div class="flex flex-col md:flex-row">
          <!-- Phần ảnh -->
          <div
            class="w-full md:w-[180px] lg:w-[200px] relative aspect-[4/3] md:aspect-square overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100">
            <div class="absolute inset-0">
              <img v-if="profile.images" :src="profile.images" :alt="`Ảnh của hồ sơ ${profile.title}`"
                class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                @error="handleImageError" />
              <div v-else
                class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-gray-50 to-gray-100">
                <img :src="noImage" alt="Không có hình ảnh"
                  class="w-16 h-16 md:w-20 md:h-20 object-contain opacity-25" />
              </div>
            </div>

            <!-- Status badge với glow effect -->
            <div class="absolute top-2.5 left-2.5 z-10">
              <span class="px-2.5 py-1 rounded-full text-xs font-semibold shadow-md backdrop-blur-sm" :class="{
                'bg-blue-400 text-white': profile.status === 'active',
                'bg-green-500 text-white': profile.status === 'found',
                'bg-gray-500 text-white': profile.status === 'closed'
              }">
                {{ getStatusText(profile.status) }}
              </span>
            </div>
          </div>

          <!-- Phần thông tin -->
          <div class="flex-1 p-4 md:p-5 flex flex-col">
            <!-- Header: Title và ID -->
            <div class="flex items-start justify-between gap-3 mb-3">
              <h3
                class="text-base md:text-lg font-bold text-gray-900 group-hover:text-blue-400 transition-colors line-clamp-2 flex-1 leading-snug">
                {{ profile.title }}
              </h3>
              <span
                class="bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-400 text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0 whitespace-nowrap shadow-sm">
                #{{ profile.id }}
              </span>
            </div>

            <!-- Thông tin chi tiết - Với icon và highlight không border -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-400 flex-shrink-0" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span class="text-xs text-gray-600 font-medium whitespace-nowrap">Họ và tên:</span>
                <span
                  class="text-sm font-semibold text-gray-900 bg-gradient-to-r from-blue-50 to-blue-50/80 px-2.5 py-1 rounded-md">
                  {{ profile.full_name || 'Chưa xác định' }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-400 flex-shrink-0" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-xs text-gray-600 font-medium whitespace-nowrap">Năm sinh:</span>
                <span
                  class="text-sm font-semibold text-gray-900 bg-gradient-to-r from-blue-50 to-blue-50/80 px-2.5 py-1 rounded-md">
                  {{ profile.born_year || 'Chưa xác định' }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-400 flex-shrink-0" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-xs text-gray-600 font-medium whitespace-nowrap">Năm thất lạc:</span>
                <span
                  class="text-sm font-semibold text-gray-900 bg-gradient-to-r from-blue-50 to-blue-50/80 px-2.5 py-1 rounded-md">
                  {{ profile.losing_year || 'Chưa xác định' }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-400 flex-shrink-0" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span class="text-xs text-gray-600 font-medium whitespace-nowrap">Tên cha:</span>
                <span
                  class="text-sm font-semibold text-gray-900 bg-gradient-to-r from-blue-50 to-blue-50/80 px-2.5 py-1 rounded-md">
                  {{ profile.name_of_father || 'Chưa xác định' }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-400 flex-shrink-0" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span class="text-xs text-gray-600 font-medium whitespace-nowrap">Tên mẹ:</span>
                <span
                  class="text-sm font-semibold text-gray-900 bg-gradient-to-r from-blue-50 to-blue-50/80 px-2.5 py-1 rounded-md">
                  {{ profile.name_of_mother || 'Chưa xác định' }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-400 flex-shrink-0" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span class="text-xs text-gray-600 font-medium whitespace-nowrap">Anh chị em:</span>
                <span
                  class="text-sm font-semibold text-gray-900 bg-gradient-to-r from-blue-50 to-blue-50/80 px-2.5 py-1 rounded-md line-clamp-1">
                  {{ profile.siblings || 'Chưa xác định' }}
                </span>
              </div>
            </div>

            <!-- Mô tả -->
            <div class="mb-3 flex-1">
              <p class="text-xs md:text-sm text-gray-700 line-clamp-2 leading-relaxed">
                {{ profile.description || 'Chưa có mô tả' }}
              </p>
            </div>

            <!-- Footer: Thời gian, người đăng, hồ sơ liên quan và nút hành động -->
            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-gray-100/80">
              <div class="flex items-center gap-2 flex-wrap">
                <div class="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-400" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ formatDate(profile.created_at) }}</span>
                </div>
                <span v-if="profile.username"
                  class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-500" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{{ profile.username }}</span>
                </span>
                <span v-if="profile.match_count !== undefined && profile.match_count !== null"
                  class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-blue-500" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>{{ profile.match_count }} liên quan</span>
                </span>
              </div>
              <router-link :to="`/profile/${profile.id}`"
                class="inline-flex items-center gap-1.5 bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs md:text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 group/btn whitespace-nowrap">
                <span>Xem chi tiết</span>
                <svg xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5 md:h-4 md:w-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Phân trang -->
    <div v-if="totalPages > 1" class="flex justify-center mt-6 md:mt-8">
      <div class="inline-flex rounded-lg shadow-sm border border-gray-200 overflow-hidden bg-white">
        <button :disabled="currentPage === 1" @click="$emit('changePage', currentPage - 1)"
          class="px-3 py-2 text-xs md:text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 focus:z-10 focus:ring-2 focus:ring-blue-400 focus:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 border-r border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <span
          class="px-4 py-2 text-xs md:text-sm font-medium text-blue-400 bg-gradient-to-r from-blue-50 to-blue-50/80 border-x border-gray-200">
          Trang {{ currentPage }} / {{ totalPages }}
        </span>

        <button :disabled="currentPage === totalPages" @click="$emit('changePage', currentPage + 1)"
          class="px-3 py-2 text-xs md:text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 focus:z-10 focus:ring-2 focus:ring-blue-400 focus:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import noImage from '@/assets/images/no_image.png'

export default {
  name: 'ProfileList',
  props: {
    profiles: {
      type: Array,
      required: true
    },
    currentPage: {
      type: Number,
      default: 1
    },
    totalPages: {
      type: Number,
      default: 1
    }
  },
  setup() {
    // Format date
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date)
    }

    // Hiển thị trạng thái
    const getStatusText = (status) => {
      const statusMap = {
        'active': 'Đang tìm kiếm',
        'found': 'Đã tìm thấy',
        'closed': 'Đã đóng'
      }
      return statusMap[status] || status
    }

    // Xử lý khi ảnh không tải được
    const handleImageError = (event) => {
      event.target.src = noImage;
    }

    return {
      formatDate,
      getStatusText,
      noImage,
      handleImageError
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img {
  transition: opacity 0.3s ease-in-out;
}

/* Subtle card hover effect */
.group:hover {
  transform: translateY(-2px);
}

/* Highlight glow effect on hover */
.group:hover .bg-gradient-to-r.from-blue-50 {
  background: linear-gradient(to right, rgb(239 246 255), rgb(219 234 254));
  box-shadow: 0 1px 3px 0 rgba(59, 130, 246, 0.1);
}
</style>
