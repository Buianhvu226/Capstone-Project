<template>
  <div class="space-y-3 sm:space-y-3.5">
    <div
      v-if="missingReport.description"
      class="bg-white rounded-xl border border-slate-200/80 shadow-sm p-3 sm:p-3.5"
    >
      <h3 class="text-sm sm:text-base font-semibold text-gray-800 mb-3 flex items-center">
        <i class="fas fa-file-alt text-blue-500 mr-2"></i> Mô tả chi tiết
      </h3>
      <div class="prose prose-xs sm:prose-sm max-w-none">
        <p class="text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
          {{ missingReport.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecentlyMissingDetailDescriptionContacts',
  props: {
    missingReport: {
      type: Object,
      required: true,
    },
  },
};
</script>


