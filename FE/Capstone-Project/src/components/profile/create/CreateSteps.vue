<template>
  <div class="bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
    <div class="flex flex-col gap-3">
      <div class="relative h-1 bg-slate-100 rounded-full overflow-hidden">
        <div class="h-full bg-blue-500 transition-all duration-500" :style="{ width: progressWidth }"></div>
      </div>
      <div class="grid grid-cols-3 text-center gap-2">
        <div class="space-y-1">
          <div
            class="w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-semibold"
            :class="step >= 1 ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'"
          >
            1
          </div>
          <p class="text-[11px] font-semibold" :class="step >= 1 ? 'text-blue-600' : 'text-slate-500'">Nhập</p>
        </div>
        <div class="space-y-1">
          <div
            class="w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-semibold"
            :class="step >= 2 ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'"
          >
            2
          </div>
          <p class="text-[11px] font-semibold" :class="step >= 2 ? 'text-blue-600' : 'text-slate-500'">Xem lại</p>
        </div>
        <div class="space-y-1">
          <div
            class="w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-semibold"
            :class="step >= 3 ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-500'"
          >
            3
          </div>
          <p class="text-[11px] font-semibold" :class="step >= 3 ? 'text-green-600' : 'text-slate-500'">Hoàn tất</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateSteps',
  props: {
    step: {
      type: Number,
      required: true,
    },
  },
  computed: {
    progressWidth() {
      const value = Math.min(Math.max(this.step - 1, 0), 2);
      return `${(value / 2) * 100}%`;
    },
  },
};
</script>

