<template>
  <section class="bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
    <div class="flex items-center gap-3">
      <div class="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
        <i class="fas fa-user-plus text-base"></i>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="min-w-0">
            <p class="text-[11px] uppercase tracking-wide text-blue-500 font-semibold">Bước {{ step }} / 3</p>
            <h1 class="text-lg font-semibold text-slate-800 truncate">Đăng ký hồ sơ</h1>
            <p class="text-xs text-slate-500 truncate">Nhập nhanh – kiểm tra – hoàn tất chia sẻ</p>
          </div>
          <button
            :disabled="guideActive"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-blue-600 border border-blue-200 hover:border-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            @click="$emit('open-guide')"
          >
            <i class="fas fa-map-signs text-xs"></i>
            Hướng dẫn
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CreateHero',
  props: {
    step: {
      type: Number,
      required: true,
    },
    guideActive: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['open-guide'],
};
</script>

