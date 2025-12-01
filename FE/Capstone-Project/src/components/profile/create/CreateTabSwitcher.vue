<template>
  <div class="bg-white rounded-xl border border-slate-200 px-2 py-1 flex gap-1 shadow-sm">
    <button
      class="flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
      :class="activeTab === 'manual' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-50'"
      @click="$emit('change', 'manual')"
    >
      <i class="fas fa-list-ul text-xs"></i>
      Nhập từng trường
    </button>
    <button
      class="flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
      :class="activeTab === 'auto' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-50'"
      @click="$emit('change', 'auto')"
    >
      <i class="fas fa-robot text-xs"></i>
      Tạo từ mô tả
    </button>
  </div>
</template>

<script>
export default {
  name: 'CreateTabSwitcher',
  props: {
    activeTab: {
      type: String,
      required: true,
    },
  },
  emits: ['change'],
};
</script>

