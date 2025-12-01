<template>
  <div class="lg:col-span-4 bg-white rounded-lg p-3" id="search-history">
    <div class="flex items-center justify-between mb-2.5">
      <h3 class="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
        <i class="fas fa-history text-blue-500 text-xs"></i>
        <span>Lịch sử</span>
      </h3>
      <button
        v-if="history.length > 0"
        @click="$emit('clear')"
        class="text-xs text-red-500 hover:text-red-700 transition-colors p-1"
      >
        <i class="fas fa-trash-alt text-xs"></i>
      </button>
    </div>

    <div v-if="history.length === 0" class="text-center py-3 text-slate-400">
      <i class="fas fa-history text-xl mb-1 block"></i>
      <p class="text-xs">Chưa có lịch sử</p>
    </div>

    <div v-else class="space-y-1.5 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
      <div
        v-for="(item, index) in history"
        :key="item.timestamp || index"
        class="bg-slate-50 hover:bg-blue-50 transition-colors p-2 rounded-lg"
      >
        <p class="text-slate-800 text-xs line-clamp-2 mb-1.5">{{ item.query }}</p>
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs text-slate-500">{{ formatDate(item.timestamp) }}</span>
          <div class="flex gap-1">
            <button
              v-if="item.results && item.results.length > 0"
              @click="$emit('view-results', item)"
              class="text-xs py-0.5 px-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              title="Xem kết quả"
            >
              <i class="fas fa-eye text-xs"></i>
            </button>
            <button
              @click="$emit('search-again', item.query)"
              class="text-xs py-0.5 px-1.5 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors"
              title="Tìm lại"
            >
              <i class="fas fa-redo-alt text-xs"></i>
            </button>
            <button
              @click="$emit('remove', index)"
              class="text-xs py-0.5 px-1.5 bg-slate-200 text-slate-600 rounded hover:bg-red-100 hover:text-red-600 transition-colors"
              title="Xóa"
            >
              <i class="fas fa-times text-xs"></i>
            </button>
          </div>
        </div>
        <div v-if="item.resultCount !== undefined" class="text-xs text-blue-600">
          <i class="fas fa-check-circle mr-1 text-xs"></i>
          {{ item.resultCount }} kết quả
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  props: {
    history: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['clear', 'view-results', 'search-again', 'remove'],
  methods: {
    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    },
  },
};
</script>

