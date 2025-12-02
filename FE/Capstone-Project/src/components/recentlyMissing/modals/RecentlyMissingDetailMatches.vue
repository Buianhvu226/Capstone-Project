<template>
  <div v-if="matches.length > 0"
    class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden mt-2 sm:mt-3">
    <!-- Header Section -->
    <div class="bg-blue-500 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-blue-500/70">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 sm:gap-3 min-w-0">
          <div
            class="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/30">
            <i class="fas fa-search-plus text-white text-sm"></i>
          </div>
          <div class="min-w-0">
            <h3 class="text-sm sm:text-base font-semibold text-white truncate">
              Kết quả tìm kiếm AI
            </h3>
            <p class="text-[11px] sm:text-xs text-blue-50/90 truncate">
              {{ matches.length }} báo cáo có khả năng trùng khớp với hồ sơ hiện tại
            </p>
          </div>
        </div>
        <div class="flex items-center gap-1.5">
          <span
            class="inline-flex items-center gap-1 rounded-full bg-white/15 text-blue-50 text-[10px] sm:text-xs px-2 py-0.5 border border-white/30">
            <i class="fas fa-robot text-[11px]"></i>
            <span>AI phân tích</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Reports List -->
    <div class="space-y-3 sm:space-y-3.5 px-2 sm:px-3 pb-3 sm:pb-4">
      <div v-for="(match, index) in sortedMatches" :key="match.id">
        <div :id="index === 0 ? 'ai-modal-first-card' : undefined"
          class="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <div class="px-3 sm:px-4 py-3 sm:py-3.5">
            <div class="space-y-3 sm:space-y-3.5">
              <!-- Top Section -->
              <div class="flex flex-col lg:flex-row gap-3.5 lg:gap-5">
                <!-- Image & Score -->
                <div :id="index === 0 ? 'ai-modal-match-image' : undefined" class="flex-shrink-0">
                  <div class="relative">
                    <div
                      class="w-36 sm:w-40 lg:w-40 xl:w-44 h-36 sm:h-40 lg:h-32 xl:h-40 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                      <img :src="getSuggestedReportImage(match)" :alt="getSuggestedReportTitle(match)"
                        class="w-full h-full object-cover" />
                    </div>
                    <div
                      class="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white rounded-full px-1.5 py-0.5 shadow-sm border border-slate-200">
                      <div
                        class="flex items-center justify-center px-2 h-6 rounded-full text-[10px] font-semibold text-white bg-blue-500">
                        {{ match.face_match_score }}%
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0 pt-1">
                  <div class="flex flex-col h-full">
                    <!-- Header Info -->
                    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div class="flex-1 min-w-0">
                        <h4 class="text-sm sm:text-[15px] font-semibold text-slate-900 mb-1 line-clamp-2">
                          {{ getSuggestedReportTitle(match) }}
                        </h4>
                        <div class="flex flex-wrap items-center gap-1.5">
                          <span :class="{
                            'bg-blue-50 text-blue-700 ring-1 ring-blue-100':
                              getSuggestedReportProfileType(match) === 'Người đi tìm',
                            'bg-sky-50 text-sky-700 ring-1 ring-sky-100':
                              getSuggestedReportProfileType(match) === 'Người cung cấp thông tin',
                          }"
                            class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium">
                            <i :class="{
                              'fas fa-search':
                                getSuggestedReportProfileType(match) === 'Người đi tìm',
                              'fas fa-eye':
                                getSuggestedReportProfileType(match) === 'Người cung cấp thông tin',
                            }" class="mr-1"></i>
                            {{ getSuggestedReportProfileType(match) }}
                          </span>

                          <span :class="{
                            'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100':
                              getSuggestedReportStatus(match) === 'active',
                            'bg-blue-50 text-blue-700 ring-1 ring-blue-100':
                              getSuggestedReportStatus(match) === 'found',
                            'bg-slate-50 text-slate-700 ring-1 ring-slate-200':
                              getSuggestedReportStatus(match) === 'closed',
                          }"
                            class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium">
                            {{ getSuggestedReportStatusLabel(match) }}
                          </span>
                        </div>
                      </div>

                      <!-- Confidence -->
                      <div class="flex-shrink-0">
                        <div class="text-right">
                          <div :class="{
                            'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100':
                              match.llm_confidence === 'highly_confident',
                            'bg-blue-50 text-blue-700 ring-1 ring-blue-100':
                              match.llm_confidence === 'confident',
                            'bg-amber-50 text-amber-700 ring-1 ring-amber-100':
                              match.llm_confidence === 'fairly_confident',
                            'bg-orange-50 text-orange-700 ring-1 ring-orange-100':
                              match.llm_confidence === 'moderate',
                            'bg-rose-50 text-rose-700 ring-1 ring-rose-100':
                              match.llm_confidence === 'uncertain',
                            'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100':
                              match.llm_confidence === 'match',
                            'bg-amber-50 text-amber-700 ring-1 ring-amber-100':
                              match.llm_confidence === 'partial',
                            'bg-rose-50 text-rose-700 ring-1 ring-rose-100':
                              match.llm_confidence === 'no_match',
                          }"
                            class="inline-flex items-center px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium mb-0.5">
                            <i class="fas fa-shield-alt mr-1 text-[11px]"></i>
                            {{ getConfidenceLabel(match.llm_confidence) }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Meta grid -->
                    <div :id="index === 0 ? 'ai-modal-match-meta' : undefined"
                      class="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-2.5">
                      <div class="bg-slate-50 rounded-md px-2.5 py-2.5">
                        <div class="flex items-center gap-2">
                          <i class="fas fa-user text-slate-400 text-xs"></i>
                          <div class="min-w-0 flex-1">
                            <p class="text-[10px] text-slate-500 mb-0.5 uppercase tracking-wide">
                              Người đăng
                            </p>
                            <p class="text-xs font-medium text-slate-800 truncate">
                              {{ getSuggestedReportUsername(match) || 'Ẩn danh' }}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="bg-slate-50 rounded-md px-2.5 py-2.5">
                        <div class="flex items-center gap-2">
                          <i class="fas fa-clock text-slate-400 text-xs"></i>
                          <div class="min-w-0 flex-1">
                            <p class="text-[10px] text-slate-500 mb-0.5 uppercase tracking-wide">
                              Thời gian
                            </p>
                            <p class="text-xs font-medium text-slate-800">
                              {{ formatTime(getSuggestedReportCreatedAt(match)) }}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="bg-slate-50 rounded-md px-2.5 py-2.5">
                        <div class="flex items-center gap-2">
                          <i class="fas fa-percentage text-slate-400 text-xs"></i>
                          <div class="min-w-0 flex-1">
                            <p class="text-[10px] text-slate-500 mb-0.5 uppercase tracking-wide">
                              Độ khớp khuôn mặt
                            </p>
                            <p class="text-xs font-bold" :class="getMatchScoreColor(match.face_match_score)">
                              {{ match.face_match_score }}%
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="bg-slate-50 rounded-md px-2.5 py-2.5">
                        <div class="flex items-center gap-2">
                          <i class="fas fa-brain text-slate-400 text-xs"></i>
                          <div class="min-w-0 flex-1">
                            <p class="text-[10px] text-slate-500 mb-0.5 uppercase tracking-wide">
                              Kết luận từ AI
                            </p>
                            <p v-if="match.llm_analysis?.summary?.conclusion" class="text-xs font-medium" :class="{
                              'text-emerald-600': match.llm_analysis?.summary?.conclusion === 'match',
                              'text-amber-600': match.llm_analysis?.summary?.conclusion === 'partial',
                              'text-rose-600': match.llm_analysis?.summary?.conclusion === 'no_match',
                            }">
                              {{ getVietnameseConclusion(match.llm_analysis?.summary?.conclusion) }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Match progress -->
                    <div class="mb-1.5">
                      <div class="flex items-center justify-between mb-1">
                        <span class="text-xs font-medium text-slate-700">Độ khớp khuôn mặt</span>
                        <span class="text-xs font-bold" :class="getMatchScoreColor(match.face_match_score)">
                          {{ match.face_match_score }}%
                        </span>
                      </div>
                      <div class="w-full bg-slate-100 rounded-full h-[6px] overflow-hidden">
                        <div
                          class="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden bg-blue-500"
                          :style="{ width: `${match.face_match_score}%` }"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- AI analysis - full width under content & image -->
              <div :id="index === 0 ? 'ai-modal-analysis' : undefined" v-if="match.llm_analysis"
                class="mt-2.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-3">
                <div class="flex items-center justify-between mb-2">
                  <h5 class="text-xs sm:text-sm font-semibold text-slate-800 flex items-center">
                    <i class="fas fa-brain text-blue-400 mr-2"></i>
                    Phân tích AI chi tiết
                  </h5>
                  <button class="text-[11px] sm:text-xs text-blue-500 hover:text-blue-700 font-medium"
                    @click="toggleAnalysisDetail(match.id)">
                    <span v-if="!showAnalysisDetail[match.id]">
                      <i class="fas fa-chevron-down mr-1"></i>Xem chi tiết
                    </span>
                    <span v-else>
                      <i class="fas fa-chevron-up mr-1"></i>Thu gọn
                    </span>
                  </button>
                </div>

                <!-- Quick summary -->
                <div class="mb-2.5">
                  <div class="flex items-start gap-2.5">
                    <div class="flex-shrink-0 w-2 h-2 rounded-full mt-2" :class="{
                      'bg-emerald-500': match.llm_confidence === 'highly_confident',
                      'bg-blue-500': match.llm_confidence === 'confident',
                      'bg-amber-500': match.llm_confidence === 'fairly_confident',
                      'bg-orange-500': match.llm_confidence === 'moderate',
                      'bg-rose-500': match.llm_confidence === 'uncertain',
                    }"></div>
                    <div class="flex-1">
                      <p class="text-xs font-medium text-slate-700 mb-0.5">Kết luận nhanh</p>
                      <p class="text-xs text-slate-600 leading-relaxed">
                        {{ match.llm_analysis?.summary?.conclusion_text || 'Đang xử lý phân tích...' }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Detailed analysis -->
                <div v-if="showAnalysisDetail[match.id]" class="space-y-3 border-t border-blue-100 pt-3">
                  <template v-for="(analysisValue, analysisKey) in match.llm_analysis" :key="analysisKey">
                    <div v-if="analysisKey !== 'summary' && analysisValue">
                      <div class="bg-white/80 rounded-md px-3 py-2.5 border border-blue-50">
                        <h6 class="text-xs font-semibold text-slate-800 mb-1.5 capitalize flex items-center">
                          <i class="fas fa-info-circle text-blue-500 mr-2 text-xs"></i>
                          {{ formatKey(analysisKey) }}
                        </h6>
                        <div class="space-y-1.5">
                          <p v-if="typeof analysisValue === 'string'" class="text-xs text-slate-600">
                            <i class="fas fa-comment text-slate-400 mr-1"></i>
                            {{ analysisValue }}
                          </p>
                          <div v-else>
                            <p v-if="analysisValue.note" class="text-xs text-slate-600">
                              <i class="fas fa-comment text-slate-400 mr-1"></i>
                              {{ analysisValue.note }}
                            </p>
                            <p v-if="analysisValue.similarity" class="text-xs text-slate-600">
                              <i class="fas fa-chart-line text-emerald-500 mr-1"></i>
                              Mức độ tương đồng:
                              <span class="font-medium" :class="{
                                'text-emerald-600': analysisValue.similarity.includes('cao'),
                                'text-amber-600':
                                  analysisValue.similarity.includes('trung bình'),
                                'text-rose-600': analysisValue.similarity.includes('thấp'),
                              }">
                                {{ analysisValue.similarity }}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>

              <!-- Actions (footer of card) -->
              <div :id="index === 0 ? 'ai-modal-actions' : undefined"
                class="mt-2.5 pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row gap-2 sm:gap-2.5">
                <router-link :to="`/recently-missing/${getSuggestedReportId(match)}`" class="flex-1 inline-flex items-center justify-center px-4 py-2.5 
                       bg-blue-500 text-white 
                       rounded-lg hover:bg-blue-600 
                       transition-all duration-200 font-medium shadow-sm 
                       hover:shadow-md transform hover:-translate-y-0.5 group text-sm">
                  <i class="fas fa-eye mr-2 group-hover:scale-110 transition-transform"></i>
                  <span>Xem chi tiết</span>
                  <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </router-link>

                <button v-if="!isReportOwner(match)" @click="startConversationWithReportOwner(match)" class="flex-shrink-0 inline-flex items-center justify-center px-4 py-2.5 
                       bg-white border border-slate-200 text-slate-700 
                       rounded-lg hover:border-slate-300 hover:bg-slate-50
                       transition-all duration-200 font-medium group text-sm">
                  <i class="fas fa-comments mr-2 group-hover:scale-110 transition-transform"></i>
                  <span class="hidden sm:inline">Liên hệ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecentlyMissingDetailMatches',
  props: {
    matches: {
      type: Array,
      required: true,
    },
    sortedMatches: {
      type: Array,
      required: true,
    },
    showAnalysisDetail: {
      type: Object,
      required: true,
    },
    getSuggestedReportImage: {
      type: Function,
      required: true,
    },
    getSuggestedReportTitle: {
      type: Function,
      required: true,
    },
    getSuggestedReportProfileType: {
      type: Function,
      required: true,
    },
    getSuggestedReportStatus: {
      type: Function,
      required: true,
    },
    getSuggestedReportStatusLabel: {
      type: Function,
      required: true,
    },
    getSuggestedReportUsername: {
      type: Function,
      required: true,
    },
    getSuggestedReportCreatedAt: {
      type: Function,
      required: true,
    },
    formatTime: {
      type: Function,
      required: true,
    },
    getMatchScoreColor: {
      type: Function,
      required: true,
    },
    getMatchScoreBgColor: {
      type: Function,
      required: true,
    },
    getConfidenceLabel: {
      type: Function,
      required: true,
    },
    getVietnameseConclusion: {
      type: Function,
      required: true,
    },
    formatKey: {
      type: Function,
      required: true,
    },
    getSuggestedReportId: {
      type: Function,
      required: true,
    },
    isReportOwner: {
      type: Function,
      required: true,
    },
    startConversationWithReportOwner: {
      type: Function,
      required: true,
    },
    toggleAnalysisDetail: {
      type: Function,
      required: true,
    },
  },
};
</script>
