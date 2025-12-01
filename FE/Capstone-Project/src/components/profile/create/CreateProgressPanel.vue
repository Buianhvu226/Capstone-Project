<template>
  <section class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="h-11 w-11 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
          <i class="fas fa-cogs text-lg" :class="{ 'animate-spin': loading }"></i>
        </div>
        <div>
          <p class="text-sm font-semibold text-slate-800">Đang xử lý hồ sơ</p>
          <p class="text-xs text-slate-500">Theo dõi tiến trình từng bước</p>
        </div>
      </div>
      <button
        v-if="progressLogs.length"
        class="text-xs text-slate-500 hover:text-red-500 flex items-center gap-1"
        @click="$emit('clear-logs')"
      >
        <i class="fas fa-trash-alt text-sm"></i>
        Xóa log
      </button>
    </div>

    <div v-if="totalSteps > 0 && progressLogs.length" class="mb-4">
      <div class="flex justify-between items-center text-xs text-slate-500 mb-1.5">
        <span>Tiến độ tổng</span>
        <span class="font-semibold text-blue-600">
          {{ Math.round((progressStep / totalSteps) * 100) }}%
        </span>
      </div>
      <div class="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          class="h-full bg-blue-500 transition-all duration-500"
          :style="{ width: (progressStep / totalSteps) * 100 + '%' }"
        ></div>
      </div>
    </div>

    <div class="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
      <div
        v-for="(log, index) in progressLogs"
        :key="`${log.timestamp}-${index}`"
        class="rounded-lg border border-slate-200 p-3"
        :class="index === progressLogs.length - 1 ? 'bg-blue-50/80 border-blue-200' : 'bg-slate-50'"
      >
        <div class="flex items-center justify-between gap-2">
          <p class="text-sm font-semibold" :class="index === progressLogs.length - 1 ? 'text-blue-700' : 'text-slate-700'">
            {{ log.message }}
          </p>
          <span class="text-xs text-slate-500">{{ log.timestamp }}</span>
        </div>
        <div v-if="index === progressLogs.length - 1 && log.subProgress" class="mt-2">
          <div class="h-1 rounded-full bg-blue-200">
            <div class="h-full bg-blue-500 rounded-full transition-all duration-300" :style="{ width: log.subProgress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentMessage" class="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
      <p class="text-sm text-blue-700 font-medium flex items-center gap-2">
        <span class="h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
        {{ currentMessage }}
      </p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CreateProgressPanel',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    progressLogs: {
      type: Array,
      default: () => [],
    },
    currentMessage: {
      type: String,
      default: '',
    },
    progressStep: {
      type: Number,
      default: 0,
    },
    totalSteps: {
      type: Number,
      default: 0,
    },
  },
  emits: ['clear-logs'],
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5f5;
  border-radius: 10px;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5f5 #f8fafc;
}
</style>

