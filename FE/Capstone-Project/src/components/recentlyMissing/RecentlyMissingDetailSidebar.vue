<template>
  <div id="rmd-sidebar">
    <!-- Ảnh khuôn mặt -->
    <div id="rmd-face-card"
      class="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div class="p-3 sm:p-4">
        <h3 class="text-sm sm:text-base font-semibold text-gray-800 mb-3 flex items-center">
          <i class="fas fa-image text-blue-500 mr-2"></i> Ảnh khuôn mặt
        </h3>
        <div
          class="relative rounded-xl bg-slate-50 border border-slate-100 p-2.5 sm:p-3 flex items-center justify-center transition-shadow duration-200"
          :class="missingReport.image_url ? 'cursor-zoom-in hover:shadow-lg' : 'cursor-default'"
          @click="handleImageClick">
          <img :src="imageSrc" :alt="missingReport.title"
            class="max-h-[220px] sm:max-h-[260px] w-auto max-w-full object-contain rounded-lg shadow-sm bg-white mx-auto"
            @error="onImageError" />
          <div v-if="isOwner && !missingReport.image_url"
            class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <button @click="onUploadImage"
              class="bg-blue-400 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              <i class="fas fa-cloud-upload-alt mr-2"></i> Tải lên ảnh
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tìm kiếm AI -->
    <div id="rmd-ai-card"
      class="mt-3 bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 p-3 sm:p-4">
      <h3 class="text-sm sm:text-base font-semibold text-gray-800 mb-3 flex items-center">
        <i class="fas fa-brain text-blue-500 mr-2"></i> Tìm kiếm AI
      </h3>
      <div class="space-y-2">
        <p class="bg-blue-50 rounded-lg p-2 text-[11px] sm:text-xs text-blue-700 flex items-start">
          <i class="fas fa-info-circle mr-2 mt-0.5"></i>
          <span>AI tìm kiếm các báo cáo có khuôn mặt tương đồng ≥ 78% và phân tích mức độ khớp.</span>
        </p>
        <p class="text-xs sm:text-sm text-gray-600 flex items-center justify-between bg-gray-50 rounded-lg px-2 py-1.5">
          <span>Độ khớp cao</span>
          <span class="bg-blue-100 text-blue-700 text-[11px] px-2 py-0.5 rounded-full font-semibold">
            {{ matchesLength > 0 ? matchesLength : '0' }}
          </span>
        </p>
      </div>
      <div class="mt-2 flex flex-col gap-2">
        <button v-if="isOwner" id="rmd-ai-search-btn" @click="onViewAIMatches"
          class="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:from-blue-600 hover:to-blue-700 transition-colors shadow-sm">
          <i class="fas fa-search-plus mr-1.5"></i> Tìm kiếm & phân tích
        </button>
        <button v-if="matchesLength > 0" id="rmd-ai-result-btn" @click="onOpenMatchesModal"
          class="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-blue-200 text-blue-600 text-xs font-semibold hover:bg-blue-50 hover:border-blue-300 transition-colors">
          <i class="fas fa-chart-bar text-[11px]"></i>
          <span>Xem kết quả AI</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecentlyMissingDetailSidebar',
  props: {
    missingReport: {
      type: Object,
      required: true,
    },
    isOwner: {
      type: Boolean,
      default: false,
    },
    noImage: {
      type: String,
      required: true,
    },
    matchesLength: {
      type: Number,
      default: 0,
    },
    onUploadImage: {
      type: Function,
      required: true,
    },
    onImageError: {
      type: Function,
      required: true,
    },
    onViewAIMatches: {
      type: Function,
      required: true,
    },
    onOpenMatchesModal: {
      type: Function,
      required: true,
    },
    onOpenImageModal: {
      type: Function,
      required: true,
    },
  },
  computed: {
    imageSrc() {
      return this.missingReport.image_url
        ? `${this.missingReport.image_url}?t=${Date.now()}`
        : this.noImage;
    },
  },
  methods: {
    handleImageClick() {
      if (!this.missingReport.image_url) return;
      this.onOpenImageModal(this.imageSrc);
    },
  },
};
</script>
