<template>
  <div class="bg-white rounded-lg p-2.5 sm:p-3 mb-3">
    <div class="flex items-center justify-between gap-2 sm:gap-3">
      <div class="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
        <div class="flex-shrink-0 p-1.5 sm:p-2">
          <i class="fas fa-search text-blue-500 text-xs sm:text-sm"></i>
        </div>
        <div class="flex-1 min-w-0">
          <h1 class="text-sm sm:text-base font-bold text-slate-800 truncate">
            Tìm kiếm hồ sơ nâng cao
          </h1>
          <p class="text-xs text-slate-600 truncate hidden sm:block">
            Nhập mô tả chi tiết của người thân bạn muốn tìm kiếm bằng ngôn ngữ tự nhiên
          </p>
        </div>
      </div>
      <button v-if="!showGuideTour" @click="$emit('open-guide')"
        class="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-semibold transition-colors">
        <i class="fas fa-question-circle text-xs"></i>
        <span class="hidden sm:inline">Hướng dẫn</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchHero',
  props: {
    showGuideTour: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['open-guide'],
};
</script>

