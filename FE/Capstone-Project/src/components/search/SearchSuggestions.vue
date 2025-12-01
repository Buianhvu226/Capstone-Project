<template>
  <div class="bg-white rounded-lg p-3 mb-3" id="search-suggestions">
    <div class="flex items-center justify-between mb-2.5">
      <div class="flex items-center gap-1.5">
        <i class="fas fa-lightbulb text-blue-500 text-xs"></i>
        <h2 class="text-xs sm:text-sm font-semibold text-slate-800">Gợi ý tìm kiếm</h2>
      </div>
      <button
        v-if="suggestions.length > 6"
        @click="$emit('toggle-show-all')"
        class="text-xs text-blue-500 hover:text-blue-700"
      >
        {{ showAll ? 'Thu gọn' : 'Xem tất cả' }}
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      <button
        v-for="(suggestion, index) in displayedSuggestions"
        :key="index"
        @click="$emit('use-suggestion', suggestion)"
        class="text-left bg-blue-50 hover:bg-blue-100 rounded-lg p-2 transition-all text-xs text-slate-700"
      >
        <i class="fas fa-arrow-right text-blue-500 mr-1.5 text-xs"></i>
        {{ suggestion }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchSuggestions',
  props: {
    suggestions: {
      type: Array,
      default: () => [],
    },
    displayedSuggestions: {
      type: Array,
      default: () => [],
    },
    showAll: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['toggle-show-all', 'use-suggestion'],
};
</script>

