<template>
  <div>
    <div class="space-y-6">
      <div v-for="profile in profiles" :key="profile.id"
        class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300 flex flex-col md:flex-row">
        <!-- Phần ảnh đơn (đã loại bỏ carousel) -->
        <div class="w-full md:w-1/3 relative h-64 md:h-auto overflow-hidden flex-shrink-0">
          <!-- Hiển thị ảnh từ URL hoặc ảnh mặc định -->
          <div class="h-full">
            <img v-if="profile.images" :src="profile.images" :alt="`Ảnh của hồ sơ ${profile.title}`"
              class="w-full h-80 object-contain bg-gray-300" @error="handleImageError" />
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
              <div class="flex flex-col items-center justify-center p-4">
                <img :src="noImage" alt="Không có hình ảnh" class="w-32 h-32 object-contain opacity-80" />
                <p class="text-gray-500 mt-2 text-sm">Không có hình ảnh</p>
              </div>
            </div>
          </div>

          <!-- Hiển thị trạng thái hồ sơ -->
          <div class="absolute top-4 left-4">
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm" :class="{
              'bg-green-100 text-green-800': profile.status === 'active',
              'bg-blue-100 text-blue-800': profile.status === 'found',
              'bg-gray-100 text-gray-800': profile.status === 'closed'
            }">
              {{ getStatusText(profile.status) }}
            </span>
          </div>
        </div>

        <!-- Phần thông tin sẽ mở rộng để lấp đầy không gian còn lại -->
        <div class="p-6 flex-1 flex flex-col md:w-2/3">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-2xl font-bold text-blue-700 hover:text-blue-800 transition-colors">{{ profile.title }}
            </h3>
            <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">ID: {{ profile.id
              }}</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            <div class="flex items-center">
              <span class="text-gray-600 font-medium mr-2">Họ tên:</span>
              <span class="text-gray-900">{{ profile.full_name || 'Chưa xác định' }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-600 font-medium mr-2">Năm sinh:</span>
              <span class="text-gray-900">{{ profile.born_year || 'Chưa xác định' }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-600 font-medium mr-2">Năm thất lạc:</span>
              <span class="text-gray-900">{{ profile.losing_year || 'Chưa xác định' }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-600 font-medium mr-2">Người đăng:</span>
              <span class="text-gray-900">{{ profile.username }}</span>
            </div>
          </div>

          <p class="text-gray-700 line-clamp-3 mb-4">{{ profile.description }}</p>

          <div class="mt-auto flex justify-between items-center">
            <span class="text-sm font-bold text-gray-500">Thời gian đăng: {{ formatDate(profile.created_at) }}</span>
            <router-link :to="`/profile/${profile.id}`"
              class="inline-flex items-center bg-gradient-to-r from-blue-400 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow transition-all duration-300 hover:shadow-lg">
              Xem chi tiết
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Phân trang -->
    <div v-if="totalPages > 1" class="flex justify-center mt-10">
      <div class="inline-flex rounded-md shadow-sm">
        <button :disabled="currentPage === 1" @click="$emit('changePage', currentPage - 1)"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <span class="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border-t border-b border-gray-300">
          Trang {{ currentPage }} / {{ totalPages }}
        </span>

        <button :disabled="currentPage === totalPages" @click="$emit('changePage', currentPage + 1)"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>