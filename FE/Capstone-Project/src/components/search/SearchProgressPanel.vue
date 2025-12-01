<template>
  <div v-if="show" class="bg-white rounded-lg p-3 mb-3">
    <div class="flex items-start justify-between mb-2">
      <div class="flex items-center">
        <div class="bg-blue-100 p-2 rounded-lg mr-2.5">
          <i class="fas fa-cogs text-blue-500 text-sm" :class="{ 'animate-spin': loading }"></i>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-slate-800">
            {{ progressCompleted && !loading ? 'Tiến trình tìm kiếm' : 'Đang xử lý tìm kiếm' }}
          </h3>
          <p class="text-xs text-slate-600 hidden sm:block">
            Ghi lại toàn bộ quá trình để bạn tiện kiểm tra
          </p>
        </div>
      </div>
      <button
        v-if="progressLogs.length > 0"
        @click="$emit('clear-logs')"
        class="text-xs text-slate-500 hover:text-red-500 transition-colors"
      >
        <i class="fas fa-trash-alt mr-1"></i>
        Xóa log
      </button>
    </div>

    <div v-if="totalSteps > 0 && progressLogs.length > 0" class="mb-2.5">
      <div class="flex justify-between items-center mb-1.5">
        <span class="text-xs font-medium text-slate-700">Tiến độ</span>
        <span class="text-xs font-semibold text-blue-500">
          {{ Math.round((progressStep / totalSteps) * 100) }}%
        </span>
      </div>
      <div class="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
        <div
          class="bg-blue-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
          :style="{ width: (progressStep / totalSteps) * 100 + '%' }"
        ></div>
      </div>
    </div>

    <div
      v-if="progressLogs.length > 0"
      class="space-y-1.5 max-h-28 sm:max-h-36 overflow-y-auto pr-1 custom-scrollbar"
    >
      <h4 class="text-xs font-medium text-slate-700 mb-1.5 flex items-center">
        <i class="fas fa-list-ul mr-1.5 text-blue-500 text-xs"></i>
        Quá trình xử lý
      </h4>

      <div class="space-y-1.5">
        <div
          v-for="(log, index) in progressLogs"
          :key="`${log.timestamp}-${index}`"
          class="flex items-start p-2 rounded-lg transition-all"
          :class="[index === progressLogs.length - 1 ? 'bg-blue-50' : 'bg-slate-50']"
        >
          <div class="flex-shrink-0 mt-0.5">
            <div
              class="w-4 h-4 rounded-full flex items-center justify-center"
              :class="[
                index === progressLogs.length - 1
                  ? 'bg-blue-500 animate-pulse'
                  : log.completed
                    ? 'bg-green-500'
                    : 'bg-slate-400'
              ]"
            >
              <i
                v-if="index === progressLogs.length - 1 && !log.completed"
                class="fas fa-spinner fa-spin text-white text-[8px]"
              ></i>
              <i v-else-if="log.completed" class="fas fa-check text-white text-[8px]"></i>
              <i v-else class="fas fa-circle text-white text-[8px]"></i>
            </div>
          </div>

          <div class="ml-2 flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <p
                class="text-xs font-medium truncate"
                :class="index === progressLogs.length - 1 ? 'text-blue-700' : 'text-slate-700'"
              >
                {{ log.message }}
              </p>
              <span class="text-xs text-slate-500 flex-shrink-0">{{ log.timestamp }}</span>
            </div>

            <div v-if="index === progressLogs.length - 1 && log.subProgress" class="mt-1.5">
              <div class="w-full bg-blue-200 rounded-full h-0.5">
                <div
                  class="bg-blue-500 h-0.5 rounded-full transition-all duration-500"
                  :style="{ width: log.subProgress + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="progressLogs.length > 0 || currentMessage" class="mt-2.5 bg-blue-50 p-2 rounded-lg">
      <div class="flex items-center">
        <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping mr-2"></div>
        <p class="text-blue-700 text-xs font-medium flex items-center truncate">
          <i class="fas fa-info-circle mr-1.5 text-xs"></i>
          {{ currentMessage || 'Đang ghi lại tiến trình...' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchProgressPanel',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
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
    progressCompleted: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['clear-logs'],
};
</script>

