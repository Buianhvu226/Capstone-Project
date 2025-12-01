<template>
  <div v-if="hasSearched">
    <div v-if="error" class="bg-red-50 p-2.5 rounded-lg mb-3">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="fas fa-exclamation-circle text-red-500 text-sm"></i>
        </div>
        <div class="ml-2 flex-1">
          <p class="text-xs text-red-700">{{ error }}</p>
          <div v-if="errorCode === 401" class="mt-1.5">
            <router-link :to="{ name: 'auth' }" class="text-xs font-medium text-red-700 hover:text-red-600 underline">
              Đăng nhập để tiếp tục
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="loading && !showProgress" class="flex justify-center items-center py-8">
      <div class="flex flex-col items-center">
        <div class="rounded-full bg-blue-100 h-10 w-10 flex items-center justify-center mb-2">
          <i class="fas fa-search text-blue-500 text-lg"></i>
        </div>
        <p class="text-xs text-slate-600">Đang tìm kiếm...</p>
      </div>
    </div>

    <div v-else-if="results.length === 0" class="bg-white rounded-lg p-6 text-center">
      <div class="inline-block p-3 bg-slate-100 rounded-full mb-3">
        <i class="fas fa-search text-slate-400 text-2xl"></i>
      </div>
      <h3 class="text-base font-semibold text-slate-700 mb-1.5">Không tìm thấy kết quả nào</h3>
      <p class="text-slate-600 mb-3 text-xs sm:text-sm">Thử sử dụng các từ khóa khác hoặc điều chỉnh truy vấn của bạn</p>
      <div class="mt-4 bg-blue-50 rounded-lg p-3 text-left max-w-md mx-auto">
        <p class="text-xs text-slate-700 font-semibold mb-1.5">Gợi ý:</p>
        <ul class="list-disc pl-4 text-xs text-slate-600 space-y-0.5">
          <li>Sử dụng từ khóa cụ thể (tên, địa điểm, thời gian)</li>
          <li>Kiểm tra lỗi chính tả</li>
          <li>Thử với cách diễn đạt khác</li>
        </ul>
      </div>
    </div>

    <div v-else>
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-base sm:text-lg font-bold text-slate-800">
          Kết quả ({{ results.length }})
        </h2>
        <button @click="$emit('clear-results')" class="text-xs text-blue-500 hover:text-blue-700 flex items-center transition-colors">
          <i class="fas fa-times mr-1"></i>
          Xóa
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div v-for="profile in results" :key="profile.id" class="bg-white rounded-lg overflow-hidden transition-all duration-300">
          <div class="p-3">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-blue-600 text-sm sm:text-base line-clamp-2 hover:text-blue-700 transition-colors flex-1">
                {{ profile.title }}
              </h3>
              <span class="bg-blue-100 text-blue-700 text-xs font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap ml-2">
                #{{ profile.id }}
              </span>
            </div>

            <div class="space-y-1.5 mb-3">
              <div v-if="profile.full_name" class="flex items-start">
                <i class="fas fa-user text-slate-400 mt-0.5 w-3.5 mr-1.5 text-xs"></i>
                <span class="text-xs text-slate-700">{{ profile.full_name }}</span>
              </div>
              <div v-if="profile.born_year" class="flex items-start">
                <i class="fas fa-birthday-cake text-slate-400 mt-0.5 w-3.5 mr-1.5 text-xs"></i>
                <span class="text-xs text-slate-700">Sinh: {{ profile.born_year }}</span>
              </div>
              <div v-if="profile.losing_year" class="flex items-start">
                <i class="fas fa-calendar-minus text-slate-400 mt-0.5 w-3.5 mr-1.5 text-xs"></i>
                <span class="text-xs text-slate-700">Mất tích: {{ profile.losing_year }}</span>
              </div>
            </div>

            <div class="bg-slate-50 p-2 rounded-lg mb-3">
              <p class="text-slate-600 line-clamp-2 text-xs">
                {{ profile.detail || profile.description }}
              </p>
            </div>

            <div class="flex flex-wrap gap-1 mb-2">
              <span v-if="profile.name_of_father" class="bg-blue-50 text-blue-700 text-xs px-1.5 py-0.5 rounded">
                Cha: {{ truncateText(profile.name_of_father, 10) }}
              </span>
              <span v-if="profile.name_of_mother" class="bg-blue-50 text-blue-700 text-xs px-1.5 py-0.5 rounded">
                Mẹ: {{ truncateText(profile.name_of_mother, 10) }}
              </span>
            </div>
          </div>

          <div class="bg-slate-50 p-2.5 flex justify-between items-center">
            <span class="text-xs text-slate-500 flex items-center">
              <i class="fas fa-users text-slate-400 mr-1 text-xs"></i>
              {{ profile.siblings ? truncateText(profile.siblings, 15) : 'N/A' }}
            </span>
            <router-link
              v-if="profile.id"
              :to="{ name: 'profile-detail', params: { id: profile.id } }"
              class="text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors flex items-center"
            >
              Chi tiết
              <i class="fas fa-arrow-right ml-1 text-xs"></i>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchResults',
  props: {
    hasSearched: Boolean,
    error: String,
    errorCode: [String, Number],
    loading: Boolean,
    showProgress: Boolean,
    results: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['clear-results'],
  methods: {
    truncateText(text, maxLength) {
      if (!text) return '';
      return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    },
  },
};
</script>

