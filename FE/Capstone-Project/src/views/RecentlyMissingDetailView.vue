<template>
  <div class="bg-gray-50 min-h-screen pt-16 pb-10">
    <!-- Breadcrumb -->
    <div class="container mx-auto px-4">
      <nav class="flex py-4" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <router-link to="/" class="text-gray-700 hover:text-blue-400">
              <i class="fas fa-home mr-2"></i> Trang chủ
            </router-link>
          </li>
          <li>
            <div class="flex items-center">
              <i class="fas fa-chevron-right text-gray-400 mx-2 text-sm"></i>
              <router-link to="/recently-missing" class="text-gray-700 hover:text-blue-400">
                Người mất tích gần đây
              </router-link>
            </div>
          </li>
          <li aria-current="page">
            <div class="flex items-center">
              <i class="fas fa-chevron-right text-gray-400 mx-2 text-sm"></i>
              <span class="text-gray-500">Chi tiết báo cáo</span>
            </div>
          </li>
        </ol>
      </nav>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-20">
      <AppLoader />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <div class="inline-block p-4 bg-red-100 rounded-full mb-4">
          <i class="fas fa-exclamation-triangle text-red-500 text-3xl"></i>
        </div>
        <h3 class="text-xl font-medium text-red-800 mb-2">Có lỗi xảy ra</h3>
        <p class="text-red-600 mb-6">{{ error }}</p>
        <div class="space-x-3">
          <button @click="fetchMissingReport"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
            <i class="fas fa-redo mr-2"></i> Thử lại
          </button>
          <router-link to="/recently-missing"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg inline-block transition-colors">
            <i class="fas fa-arrow-left mr-2"></i> Quay lại
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="missingReport" class="container mx-auto px-4">
      <div class="max-w-8xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column - Missing Report Info -->
          <div class="space-y-6 responsive-sticky">
            <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i class="fas fa-image text-blue-500 mr-2"></i> Ảnh khuôn mặt
                </h3>
                <div class="relative">
                  <img :src="(missingReport.image_url ? missingReport.image_url + '?t=' + Date.now() : noImage)"
                    :alt="missingReport.title" @error="handleImageError"
                    class="w-100 h-100 object-contain rounded-lg shadow-sm" />
                  <div v-if="isOwner && !missingReport.image_url"
                    class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <button @click="goToUploadImage"
                      class="bg-blue-400 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                      <i class="fas fa-cloud-upload-alt mr-2"></i> Tải lên ảnh
                    </button>
                  </div>
                </div>
                <button v-if="isOwner && missingReport.image_url" @click="goToUploadImage"
                  class="w-full mt-4 bg-blue-400 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <i class="fas fa-camera mr-2"></i> Cập nhật ảnh
                </button>
              </div>
            </div>
            <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i class="fas fa-brain text-blue-500 mr-2"></i> Tìm kiếm AI
              </h3>
              <div class="space-y-4">
                <div class="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                  <i class="fas fa-info-circle mr-2"></i> Hệ thống AI sẽ tìm kiếm và so sánh các báo cáo có khuôn mặt tương đồng từ 78% trở lên và phân tích mức độ khớp với báo cáo hiện tại.
                </div>
                <div class="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div>
                    <span class="text-sm text-gray-600">Báo cáo có độ khớp cao:</span>
                    <span class="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                      {{ matches.length > 0 ? matches.length : 'Chưa có' }}
                    </span>
                  </div>
                  <div class="flex-shrink-0">
                    <i class="fas fa-percentage text-blue-500"></i>
                  </div>
                </div>
                <button @click="viewAIMatches"
                  class="w-full bg-gradient-to-r from-blue-400 to-blue-400 hover:from-blue-700 hover:to-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center shadow-md hover:shadow-lg">
                  <i class="fas fa-search-plus mr-2"></i> Tìm kiếm và phân tích độ khớp
                </button>
              </div>
            </div>

          </div>
          <div class="lg:col-span-2 space-y-6">
            <!-- Header Card -->
            <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ missingReport.title }}</h1>
                    <div class="flex items-center space-x-4 text-sm text-gray-600">
                      <span :class="{
                        'bg-green-100 text-green-800': missingReport.status === 'active',
                        'bg-blue-100 text-blue-800': missingReport.status === 'found',
                        'bg-gray-100 text-gray-800': missingReport.status === 'closed'
                      }" class="inline-block px-3 py-1 text-xs font-medium rounded-full">
                        <i :class="{
                          'fas fa-search': missingReport.status === 'active',
                          'fas fa-check-circle': missingReport.status === 'found',
                          'fas fa-times-circle': missingReport.status === 'closed'
                        }" class="mr-1"></i>
                        {{ missingReport.status === 'active' ? 'Đang tìm kiếm' : missingReport.status === 'found' ? 'Đã tìm thấy' : 'Đã đóng' }}
                      </span>
                      <span :class="{
                        'bg-blue-100 text-blue-800': missingReport.profile_type === 'seeker',
                        'bg-green-100 text-green-800': missingReport.profile_type === 'finder'
                      }" class="inline-block px-3 py-1 text-xs font-medium rounded-full">
                        <i :class="{
                          'fas fa-search': missingReport.profile_type === 'seeker',
                          'fas fa-eye': missingReport.profile_type === 'finder'
                        }" class="mr-1"></i>
                        {{ missingReport.profile_type === 'seeker' ? 'Người đi tìm' : 'Người cung cấp thông tin' }}
                      </span>
                    </div>
                  </div>
                  <div v-if="isOwner || isAdmin" class="flex space-x-2">
                    <button @click="confirmDelete"
                      class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                      <i class="fas fa-trash mr-1"></i> Xóa báo cáo
                    </button>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div v-if="missingReport.name" class="flex items-center">
                    <i class="fas fa-user text-gray-400 w-5 mr-3"></i>
                    <div>
                      <span class="text-sm text-gray-500">Tên:</span>
                      <p class="font-medium text-gray-800">{{ missingReport.name }}</p>
                    </div>
                  </div>
                  <div v-if="missingReport.age" class="flex items-center">
                    <i class="fas fa-birthday-cake text-gray-400 w-5 mr-3"></i>
                    <div>
                      <span class="text-sm text-gray-500">Tuổi:</span>
                      <p class="font-medium text-gray-800">{{ missingReport.age }} tuổi</p>
                    </div>
                  </div>
                  <div v-if="formattedMissingDate" class="flex items-center">
                    <i class="fas fa-calendar text-gray-400 w-5 mr-3"></i>
                    <div>
                      <span class="text-sm text-gray-500">
                        {{ missingReport.profile_type === 'seeker' ? 'Ngày mất tích:' : 'Ngày gặp:' }}
                      </span>
                      <p class="font-medium text-gray-800">{{ formattedMissingDate }}</p>
                    </div>
                  </div>
                  <div v-if="missingReport.location" class="flex items-center">
                    <i class="fas fa-map-marker-alt text-gray-400 w-5 mr-3"></i>
                    <div>
                      <span class="text-sm text-gray-500">
                        {{ missingReport.profile_type === 'seeker' ? 'Địa điểm mất tích:' : 'Địa điểm gặp:' }}
                      </span>
                      <p class="font-medium text-gray-800">{{ missingReport.location }}</p>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-clock text-gray-400 w-5 mr-3"></i>
                    <div>
                      <span class="text-sm text-gray-500">Đăng:</span>
                      <p class="font-medium text-gray-800">{{ timeAgo }}</p>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-user-circle text-gray-400 w-5 mr-3"></i>
                    <div>
                      <span class="text-sm text-gray-500">Người đăng:</span>
                      <p class="font-medium text-gray-800">{{ missingReport.username || 'Ẩn danh' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="missingReport.description" class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i class="fas fa-file-alt text-blue-500 mr-2"></i> Mô tả chi tiết
              </h3>
              <div class="prose prose-sm max-w-none">
                <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ missingReport.description }}</p>
              </div>
            </div>
            <div v-if="missingReport.contact_persons_list && missingReport.contact_persons_list.length > 0"
              class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i class="fas fa-address-book text-green-500 mr-2"></i> Thông tin liên hệ
              </h3>
              <div class="space-y-3">
                <div v-for="contact in missingReport.contact_persons_list" :key="contact.relationship"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center">
                    <i class="fas fa-user-friends text-gray-400 mr-3"></i>
                    <div>
                      <p class="font-medium text-gray-800">{{ contact.name }}</p>
                      <p class="text-sm text-gray-600">{{ contact.relationship }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Phần cải thiện cho "Danh sách báo cáo được đề xuất" -->
            <div v-if="matches.length > 0"
              class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mt-8">

              <!-- Header Section -->
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-4 border-b border-gray-100">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="bg-blue-100 p-2 rounded-full">
                      <i class="fas fa-search-plus text-blue-400 text-lg"></i>
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-gray-900">Kết quả tìm kiếm AI</h3>
                      <p class="text-sm text-gray-600">{{ matches.length }} báo cáo có khả năng trùng khớp</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                      <i class="fas fa-robot mr-1"></i>AI Phân tích
                    </span>
                  </div>
                </div>
              </div>

              <!-- Reports List -->
              <div class="divide-y divide-gray-100">
                <div v-for="match in sortedMatches" :key="match.id"
                  class="hover:bg-gray-50 transition-colors duration-200 border-blue-500 border-solid">

                  <div class="p-4 sm:p-6">
                    <!-- Main Content Container -->
                    <div class="space-y-6">

                      <!-- Top Section: Image + Content (2 columns) -->
                      <div class="flex flex-col lg:flex-row gap-4 lg:gap-6">

                        <!-- Image & Match Score Section -->
                        <div class="flex-shrink-0">
                          <div class="relative">
                            <!-- Image Container -->
                            <div
                              class="w-full sm:w-48 lg:w-40 xl:w-48 h-48 sm:h-40 lg:h-32 xl:h-40 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                              <img :src="getSuggestedReportImage(match)" :alt="getSuggestedReportTitle(match)"
                                class="w-full h-full object-cover" />
                            </div>

                            <!-- Match Score Badge -->
                            <div
                              class="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg border border-gray-200">
                              <div
                                class="flex items-center justify-center w-12 h-12 rounded-full text-xs font-bold text-white"
                                :class="{
                                  'bg-gradient-to-br from-green-400 to-green-600': match.face_match_score >= 90,
                                  'bg-gradient-to-br from-blue-400 to-blue-400': match.face_match_score >= 85 && match.face_match_score < 90,
                                  'bg-gradient-to-br from-yellow-400 to-yellow-600': match.face_match_score >= 80 && match.face_match_score < 85,
                                  'bg-gradient-to-br from-orange-400 to-orange-600': match.face_match_score >= 75 && match.face_match_score < 80,
                                  'bg-gradient-to-br from-red-400 to-red-600': match.face_match_score < 75
                                }">
                                {{ match.face_match_score }}%
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Content Section -->
                        <div class="flex-1 min-w-0">
                          <div class="flex flex-col h-full">

                            <!-- Header Info -->
                            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                              <div class="flex-1 min-w-0">
                                <h4 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                  {{ getSuggestedReportTitle(match) }}
                                </h4>

                                <!-- Quick Stats -->
                                <div class="flex flex-wrap items-center gap-2 mb-3">
                                  <span :class="{
                                    'bg-blue-100 text-blue-800': getSuggestedReportProfileType(match) === 'seeker',
                                    'bg-orange-100 text-orange-800': getSuggestedReportProfileType(match) === 'finder'
                                  }" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                                    <i :class="{
                                      'fas fa-search': getSuggestedReportProfileType(match) === 'seeker',
                                      'fas fa-eye': getSuggestedReportProfileType(match) === 'finder'
                                    }" class="mr-1"></i>
                                    {{ getSuggestedReportProfileType(match) === 'seeker' ? 'Người tìm' : 'Người cung cấp'
                                    }}
                                  </span>

                                  <span :class="{
                                    'bg-green-100 text-green-800': getSuggestedReportStatus(match) === 'active',
                                    'bg-blue-100 text-blue-800': getSuggestedReportStatus(match) === 'found',
                                    'bg-gray-100 text-gray-800': getSuggestedReportStatus(match) === 'closed'
                                  }" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                                    {{ getSuggestedReportStatusLabel(match) }}
                                  </span>
                                </div>
                              </div>

                              <!-- Confidence Level -->
                              <div class="flex-shrink-0">
                                <div class="text-right">
                                  <div :class="{
                                    'bg-green-100 text-green-800': match.llm_confidence === 'highly_confident',
                                    'bg-blue-100 text-blue-800': match.llm_confidence === 'confident',
                                    'bg-yellow-100 text-yellow-800': match.llm_confidence === 'fairly_confident',
                                    'bg-orange-100 text-orange-800': match.llm_confidence === 'moderate',
                                    'bg-red-100 text-red-800': match.llm_confidence === 'uncertain',
                                    'bg-green-50 text-green-600': match.llm_confidence === 'match',
                                    'bg-yellow-50 text-yellow-600': match.llm_confidence === 'partial',
                                    'bg-red-50 text-red-600': match.llm_confidence === 'no_match',
                                  }" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-1">
                                    <i class="fas fa-shield-alt mr-1"></i>
                                    {{ getConfidenceLabel(match.llm_confidence) }}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <!-- Meta Information Grid -->
                            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                              <div class="bg-gray-50 rounded-lg p-3">
                                <div class="flex items-center space-x-2">
                                  <i class="fas fa-user text-gray-400 text-sm"></i>
                                  <div class="min-w-0 flex-1">
                                    <p class="text-xs text-gray-500 mb-1">Người đăng</p>
                                    <p class="text-sm font-medium text-gray-800 truncate">
                                      {{ getSuggestedReportUsername(match) || 'Ẩn danh' }}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div class="bg-gray-50 rounded-lg p-3">
                                <div class="flex items-center space-x-2">
                                  <i class="fas fa-clock text-gray-400 text-sm"></i>
                                  <div class="min-w-0 flex-1">
                                    <p class="text-xs text-gray-500 mb-1">Thời gian</p>
                                    <p class="text-sm font-medium text-gray-800">
                                      {{ formatTime(getSuggestedReportCreatedAt(match)) }}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div class="bg-gray-50 rounded-lg p-3">
                                <div class="flex items-center space-x-2">
                                  <i class="fas fa-percentage text-gray-400 text-sm"></i>
                                  <div class="min-w-0 flex-1">
                                    <p class="text-xs text-gray-500 mb-1">Độ khớp khuôn mặt</p>
                                    <p class="text-sm font-bold" :class="{
                                      'text-green-600': match.face_match_score >= 90,
                                      'text-blue-400': match.face_match_score >= 85 && match.face_match_score < 90,
                                      'text-yellow-600': match.face_match_score >= 80 && match.face_match_score < 85,
                                      'text-orange-600': match.face_match_score >= 75 && match.face_match_score < 80,
                                      'text-red-600': match.face_match_score < 75
                                    }">{{ match.face_match_score }}%</p>
                                  </div>
                                </div>
                              </div>

                              <div class="bg-gray-50 rounded-lg p-3">
                                <div class="flex items-center space-x-2">
                                  <i class="fas fa-brain text-gray-400 text-sm"></i>
                                  <div class="min-w-0 flex-1">
                                    <p class="text-xs text-gray-500 mb-1">Kết luận từ AI</p>
                                    <div>
                                      <!-- Hiển thị trạng thái kết luận -->
                                      <p v-if="match.llm_analysis?.summary?.conclusion" class="text-sm font-medium"
                                        :class="{
                                          'text-green-600': match.llm_analysis?.summary?.conclusion === 'match',
                                          'text-yellow-600': match.llm_analysis?.summary?.conclusion === 'partial',
                                          'text-red-600': match.llm_analysis?.summary?.conclusion === 'no_match'
                                        }">
                                        {{ getVietnameseConclusion(match.llm_analysis?.summary?.conclusion) }}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <!-- Match Score Progress Bar -->
                            <div class="mb-4">
                              <div class="flex items-center justify-between mb-2">
                                <span class="text-sm font-medium text-gray-700">Độ khớp khuôn mặt</span>
                                <span class="text-sm font-bold" :class="{
                                  'text-green-600': match.face_match_score >= 90,
                                  'text-blue-400': match.face_match_score >= 85 && match.face_match_score < 90,
                                  'text-yellow-600': match.face_match_score >= 80 && match.face_match_score < 85,
                                  'text-orange-600': match.face_match_score >= 75 && match.face_match_score < 80,
                                  'text-red-600': match.face_match_score < 75
                                }">{{ match.face_match_score }}%</span>
                              </div>
                              <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                                <div
                                  class="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                                  :class="{
                                    'bg-gradient-to-r from-green-400 to-green-600': match.face_match_score >= 90,
                                    'bg-gradient-to-r from-blue-400 to-blue-400': match.face_match_score >= 85 && match.face_match_score < 90,
                                    'bg-gradient-to-r from-yellow-400 to-yellow-600': match.face_match_score >= 80 && match.face_match_score < 85,
                                    'bg-gradient-to-r from-orange-400 to-orange-600': match.face_match_score >= 75 && match.face_match_score < 80,
                                    'bg-gradient-to-r from-red-400 to-red-600': match.face_match_score < 75
                                  }" :style="{ width: `${match.face_match_score}%` }">
                                  <!-- Animated shine effect -->
                                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                 animate-pulse"></div>
                                </div>
                              </div>
                            </div>


                          </div>
                        </div>
                      </div>

                      <!-- Bottom Section: AI Analysis (Full Width) -->
                      <div v-if="match.llm_analysis" class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                        <div class="flex items-center justify-between mb-3">
                          <h5 class="font-semibold text-gray-800 flex items-center">
                            <i class="fas fa-brain text-blue-400 mr-2"></i>
                            Phân tích AI chi tiết
                          </h5>
                          <button class="text-blue-400 hover:text-blue-800 text-sm font-medium"
                            @click="toggleAnalysisDetail(match.id)">
                            <span v-if="!showAnalysisDetail[match.id]">
                              <i class="fas fa-chevron-down mr-1"></i>Xem chi tiết
                            </span>
                            <span v-else>
                              <i class="fas fa-chevron-up mr-1"></i>Thu gọn
                            </span>
                          </button>
                        </div>

                        <!-- Quick Summary -->
                        <div class="mb-3">
                          <div class="flex items-start space-x-3">
                            <div class="flex-shrink-0 w-2 h-2 rounded-full mt-2" :class="{
                              'bg-green-500': match.llm_confidence === 'highly_confident',
                              'bg-blue-500': match.llm_confidence === 'confident',
                              'bg-yellow-500': match.llm_confidence === 'fairly_confident',
                              'bg-orange-500': match.llm_confidence === 'moderate',
                              'bg-red-500': match.llm_confidence === 'uncertain'
                            }"></div>
                            <div class="flex-1">
                              <p class="text-sm text-gray-700 font-medium mb-1">Kết luận:</p>
                              <p class="text-sm text-gray-600 leading-relaxed">
                                {{ match.llm_analysis?.summary?.conclusion_text || 'Đang xử lý phân tích...' }}
                              </p>
                            </div>
                          </div>
                        </div>

                        <!-- Detailed Analysis (Collapsible) -->
                        <div v-if="showAnalysisDetail[match.id]" class="space-y-4 border-t border-blue-200 pt-6">
                          <template v-for="(analysisValue, analysisKey) in match.llm_analysis" :key="analysisKey">
                            <div v-if="analysisKey !== 'summary' && analysisValue">
                              <div class="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
                                <h6 class="text-sm font-medium text-gray-800 mb-3 capitalize flex items-center">
                                  <i class="fas fa-info-circle text-blue-500 mr-2"></i>
                                  {{ formatKey(analysisKey) }}
                                </h6>
                                <div class="space-y-2">
                                  <!-- Nếu value là chuỗi -->
                                  <p v-if="typeof analysisValue === 'string'" class="text-sm text-gray-600">
                                    <i class="fas fa-comment text-gray-400 mr-1"></i>
                                    {{ analysisValue }}
                                  </p>
                                  <!-- Nếu value là đối tượng -->
                                  <div v-else>
                                    <p v-if="analysisValue.note" class="text-sm text-gray-600">
                                      <i class="fas fa-comment text-gray-400 mr-1"></i>
                                      {{ analysisValue.note }}
                                    </p>
                                    <p v-if="analysisValue.similarity" class="text-sm text-gray-600">
                                      <i class="fas fa-chart-line text-green-500 mr-1"></i>
                                      Mức độ tương đồng:
                                      <span class="font-medium" :class="{
                                        'text-green-600': analysisValue.similarity.includes('cao'),
                                        'text-yellow-600': analysisValue.similarity.includes('trung bình'),
                                        'text-red-600': analysisValue.similarity.includes('thấp')
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
                      <!-- Action Buttons -->
                      <div class="flex flex-col sm:flex-row gap-3 mt-auto">
                        <router-link :to="`/recently-missing/${getSuggestedReportId(match)}`" class="flex-1 inline-flex items-center justify-center px-4 py-2.5 
     bg-gradient-to-r from-blue-400 to-blue-700 text-white 
     rounded-lg hover:from-blue-700 hover:to-blue-800 
     transition-all duration-200 font-medium shadow-md 
     hover:shadow-lg transform hover:-translate-y-0.5 group">
                          <i class="fas fa-eye mr-2 group-hover:scale-110 transition-transform"></i>
                          <span>Xem chi tiết</span>
                          <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                        </router-link>

                        <button v-if="!isReportOwner(match)" @click="startConversationWithReportOwner(match)" class="flex-shrink-0 inline-flex items-center justify-center px-4 py-2.5 
           bg-white border-2 border-gray-300 text-gray-700 
           rounded-lg hover:border-gray-400 hover:bg-gray-50
           transition-all duration-200 font-medium group">
                          <i class="fas fa-comments mr-2 group-hover:scale-110 transition-transform"></i>
                          <span class="hidden sm:inline">Liên hệ</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="matches.length === 0" class="p-8 sm:p-12 text-center">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="fas fa-search text-gray-400 text-2xl"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-600 mb-2">Chưa có kết quả khớp</h3>
                <p class="text-gray-500 mb-4">Hệ thống AI chưa tìm thấy báo cáo nào có khả năng trùng khớp</p>
                <button @click="viewAIMatches"
                  class="inline-flex items-center px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <i class="fas fa-sync-alt mr-2"></i>
                  Tìm kiếm lại
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
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { format, formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale';
import AppLoader from '@/components/common/AppLoader.vue';
import noImage from '@/assets/images/no_image.png';
import messageService from '../services/messageService';

export default {
  name: 'RecentlyMissingDetailView',
  components: { AppLoader },

  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const reportId = route.params.id;
    const missingReport = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const matches = ref([]);
    const showAnalysisDetail = ref({});
    const isLoading = ref(false);
    const isAdmin = ref(false)

    const formatKey = (key) => {
      // Thay thế dấu gạch dưới bằng khoảng trắng và viết hoa chữ cái đầu mỗi từ
      return key.replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };
    const currentUser = computed(() => {
      const storeUser = store.getters['auth/currentUser'];
      if (storeUser) {
        console.log('🔍 Current user from store:', storeUser);
        return storeUser;
      }
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const localUser = JSON.parse(userStr);
          console.log('🔍 Current user from localStorage:', localUser);
          return localUser;
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
      console.log('🔍 No current user found');
      return null;
    });

    const isAuthenticated = computed(() => {
      const authStatus = store.getters['auth/isAuthenticated'];
      const hasToken = localStorage.getItem('token');
      const result = authStatus || !!hasToken;
      console.log('🔐 Is authenticated:', result, { authStatus, hasToken: !!hasToken });
      return result;
    });

    const isOwner = computed(() => {
      if (!currentUser.value || !missingReport.value) return false;
      const currentUsername = currentUser.value.username || currentUser.value.email;
      const currentId = currentUser.value.id;
      const isOwn = (missingReport.value.username === currentUsername) ||
        (missingReport.value.username === currentUser.value.email) ||
        (missingReport.value.user_id === currentId) ||
        (missingReport.value.created_by === currentId);
      console.log('🔍 Is owner check:', {
        reportUsername: missingReport.value.username,
        reportUserId: missingReport.value.user_id,
        reportCreatedBy: missingReport.value.created_by,
        currentUsername,
        currentEmail: currentUser.value.email,
        currentId,
        isOwn
      });
      return isOwn;
    });

    const sortedMatches = computed(() => {
      // Thứ tự ưu tiên cho llm_confidence cũ
      const confidenceOrder = {
        'highly_confident': 5,
        'confident': 4,
        'fairly_confident': 3,
        'moderate': 2,
        'uncertain': 1
      };

      // Thứ tự ưu tiên cho llm_confidence mới (match, partial, no_match)
      const matchOrder = {
        'match': 3,
        'partial': 2,
        'no_match': 1
      };

      return [...matches.value].sort((a, b) => {
        // Kiểm tra xem có phải là giá trị match, partial, no_match không
        const aHasMatchValue = a.llm_confidence && (a.llm_confidence === 'match' || a.llm_confidence === 'partial' || a.llm_confidence === 'no_match');
        const bHasMatchValue = b.llm_confidence && (b.llm_confidence === 'match' || b.llm_confidence === 'partial' || b.llm_confidence === 'no_match');

        // Nếu cả hai đều có giá trị match, partial, no_match
        if (aHasMatchValue && bHasMatchValue) {
          // Sắp xếp theo thứ tự match, partial, no_match
          const matchDiff = matchOrder[b.llm_confidence] - matchOrder[a.llm_confidence];
          // Nếu cùng giá trị match/partial/no_match, sắp xếp theo face_match_score
          return matchDiff !== 0 ? matchDiff : b.face_match_score - a.face_match_score;
        }

        // Nếu chỉ một trong hai có giá trị match/partial/no_match, ưu tiên cái có giá trị đó
        if (aHasMatchValue && !bHasMatchValue) return -1;
        if (!aHasMatchValue && bHasMatchValue) return 1;

        // Nếu không có giá trị match/partial/no_match, sử dụng logic sắp xếp cũ
        return confidenceOrder[b.llm_confidence] - confidenceOrder[a.llm_confidence] || b.face_match_score - a.face_match_score;
      });
    });

    const formattedMissingDate = computed(() => {
      if (!missingReport.value?.missing_date) return null;
      try {
        return format(new Date(missingReport.value.missing_date), 'dd/MM/yyyy', { locale: vi });
      } catch {
        return missingReport.value.missing_date;
      }
    });

    const timeAgo = computed(() => {
      if (!missingReport.value?.created_at) return '';
      try {
        return formatDistance(new Date(missingReport.value.created_at), new Date(), {
          addSuffix: true,
          locale: vi
        });
      } catch {
        return '';
      }
    });

    const fetchMissingReport = async () => {
      try {
        loading.value = true;
        error.value = null;
        console.log('📤 Fetching missing report with ID:', reportId);
        const response = await store.dispatch('recentlyMissing/fetchMissingReportById', reportId);
        console.log('📄 Fetched missing report:', response);
        missingReport.value = response;
      } catch (err) {
        console.error('❌ Error fetching missing report:', err);
        error.value = err.message || 'Không thể tải thông tin báo cáo missing';
        if (err.response?.status === 404) {
          error.value = 'Không tìm thấy báo cáo missing này';
        } else if (err.response?.status === 403) {
          error.value = 'Bạn không có quyền xem báo cáo này';
        }
      } finally {
        loading.value = false;
      }
    };

    const fetchMatches = async () => {
      try {
        console.log('📤 Fetching matches for missing report:', reportId);
        const response = await store.dispatch('recentlyMissing/fetchMissingReportMatches', reportId);
        matches.value = response || [];
        console.log('📄 Fetched matches:', matches.value);
      } catch (err) {
        console.error('❌ Error fetching matches:', err);
      }
    };

    const viewAIMatches = async () => {
      try {
        loading.value = true;
        console.log('📤 Preparing to analyze matches with AI for report:', reportId);
        // Trích xuất danh sách report_id từ matches
        const otherReportIds = matches.value.map(match =>
          match.report1_id === parseInt(reportId) ? match.report2_id : match.report1_id
        );
        console.log('📤 Sending report IDs to analyze:', otherReportIds);
        const response = await store.dispatch('recentlyMissing/analyzeMatchesWithLLM', {
          current_report_id: reportId,
          other_report_ids: otherReportIds
        });
        console.log('📄 AI analysis response:', response);
        await fetchMatches(); // Cập nhật lại danh sách matches
      } catch (err) {
        console.error('❌ Error analyzing matches with AI:', err);
        error.value = err.message || 'Không thể phân tích kết quả khớp AI';
      } finally {
        loading.value = false;
      }
    };

    // Function để toggle chi tiết phân tích AI
    const toggleAnalysisDetail = (matchId) => {
      showAnalysisDetail.value[matchId] = !showAnalysisDetail.value[matchId];
    };

    // Function để lấy trạng thái màu cho match score
    const getMatchScoreColor = (score) => {
      if (score >= 90) return 'text-green-600';
      if (score >= 85) return 'text-blue-400';
      if (score >= 80) return 'text-yellow-600';
      if (score >= 75) return 'text-orange-600';
      return 'text-red-600';
    };

    // Function để lấy background color cho match score
    const getMatchScoreBgColor = (score) => {
      if (score >= 90) return 'bg-gradient-to-br from-green-400 to-green-600';
      if (score >= 85) return 'bg-gradient-to-br from-blue-400 to-blue-400';
      if (score >= 80) return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
      if (score >= 75) return 'bg-gradient-to-br from-orange-400 to-orange-600';
      return 'bg-gradient-to-br from-red-400 to-red-600';
    };

    const confirmDelete = () => {
      if (confirm('Bạn có chắc chắn muốn xóa báo cáo này? Hành động này không thể hoàn tác.')) {
        deleteMissingReport();
      }
    };

    const deleteMissingReport = async () => {
      try {
        console.log('📤 Deleting missing report:', reportId);
        await store.dispatch('recentlyMissing/deleteMissingReport', reportId);
        alert('Xóa báo cáo thành công!');
        router.push('/recently-missing');
      } catch (err) {
        console.error('❌ Error deleting missing report:', err);
        alert('Lỗi khi xóa báo cáo: ' + (err.message || 'Không thể xóa báo cáo'));
      }
    };

    const goToUploadImage = () => {
      router.push(`/recently-missing/${reportId}/upload-image`);
    };

    const goToMatches = () => {
      router.push(`/recently-missing/${reportId}/matches`);
    };

    const handleImageError = (event) => {
      event.target.src = noImage;
    };

    // Matches
    const getSuggestedReportId = (match) => {
      return match.report1_id === parseInt(reportId) ? match.report2_id : match.report1_id;
    };

    const getSuggestedReportTitle = (match) => {
      return match.report1_id === parseInt(reportId) ? match.report2_title : match.report1_title;
    };

    const getSuggestedReportImage = (match) => {
      const baseUrl = match.report1_id === parseInt(reportId)
        ? match.report2_image_url
        : match.report1_image_url;
      return baseUrl ? `${baseUrl}?t=${Date.now()}` : noImage;
    };

    const getSuggestedReportProfileType = (match) => {
      const profileType = match.report1_id === parseInt(reportId) ? match.report2_profile_type : match.report1_profile_type;
      return profileType === 'seeker' ? 'Người đi tìm' : 'Người cung cấp thông tin';
    };

    const getConfidenceLabel = (confidence) => {
      const labels = {
        uncertain: 'Chưa chắc chắn về độ giống trên khuôn mặt',
        moderate: 'Độ giống nhau trên khuôn mặt ở mức trung bình',
        fairly_confident: 'Độ giống nhau trên khuôn mặt ở mức khá tin cậy',
        confident: 'Độ giống nhau trên khuôn mặt ở mức tin cậy',
        highly_confident: 'Độ giống nhau trên khuôn mặt ở mức rất tin cậy',
        no_match: 'Báo cáo về người này không khớp',
        partial: 'Báo cáo về người này chỉ có một phần khớp',
        match: 'Báo cáo về người này hoàn toàn khớp'
      };
      return labels[confidence] || 'Đang đánh giá';
    };

    const getSuggestedReportUsername = (match) => {
      return match.report1_id === parseInt(reportId) ? match.report2_username : match.report1_username;
    };

    const getSuggestedReportCreatedAt = (match) => {
      return match.report1_id === parseInt(reportId) ? match.report2_created_at : match.report1_created_at;
    };

    const getSuggestedReportStatus = (match) => {
      return match.report1_id === parseInt(reportId) ? match.report2_status : match.report1_status;
    };

    const getSuggestedReportStatusLabel = (match) => {
      const status = getSuggestedReportStatus(match);
      const statusLabels = {
        active: 'Đang tìm kiếm',
        found: 'Đã tìm thấy',
        closed: 'Đã đóng'
      };
      return statusLabels[status] || status || 'Không xác định';
    };

    const formatTime = (date) => {
      try {
        return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: vi });
      } catch {
        return date || 'Không xác định';
      }
    };

    const getVietnameseConclusion = (conclusion) => {
      const translations = {
        'match': 'Khớp hoàn toàn',
        'partial': 'Khớp một phần',
        'no_match': 'Không khớp'
      };
      return translations[conclusion] || conclusion || 'Chưa có kết luận';
    };

    const loadUserIfNeeded = async () => {
      const hasToken = localStorage.getItem('token');
      const storeUser = store.getters['auth/currentUser'];
      if (hasToken && !storeUser) {
        try {
          console.log('🔄 Loading user from server...');
          await store.dispatch('auth/fetchCurrentUser');
        } catch (error) {
          console.error('Failed to load user:', error);
        }
      }
    };

    // Hàm kiểm tra xem người dùng hiện tại có phải là chủ sở hữu của báo cáo hay không
    const isReportOwner = (match) => {
      if (!currentUser.value) return false;

      // Lấy ID của báo cáo được đề xuất
      const reportId = getSuggestedReportId(match);

      // Lấy tên người dùng của chủ sở hữu báo cáo
      const reportUsername = match.report1_id === parseInt(reportId)
        ? match.report1_username
        : match.report2_username;

      // Lấy ID người dùng của báo cáo
      const reportUserId = match.report1_id === parseInt(reportId)
        ? match.report1_user_id
        : match.report2_user_id;

      // Kiểm tra xem người dùng hiện tại có phải là chủ sở hữu không
      return (
        reportUserId === currentUser.value.id ||
        (reportUsername && currentUser.value.username && reportUsername === currentUser.value.username) ||
        (reportUsername && currentUser.value.email && reportUsername === currentUser.value.email)
      );
    };

    const startConversationWithReportOwner = async (match) => {
      // Kiểm tra đăng nhập
      if (!currentUser.value) {
        // Chuyển hướng đến trang đăng nhập và lưu đường dẫn hiện tại để quay lại sau khi đăng nhập
        const reportId = getSuggestedReportId(match);
        router.push({
          path: '/auth',
          query: { redirect: `/recently-missing/${reportId}` },
        });
        return;
      }

      try {
        isLoading.value = true;

        // Lấy thông tin báo cáo
        const reportId = getSuggestedReportId(match);

        // Xác định ID của chủ sở hữu báo cáo
        const ownerId = match.report1_id === parseInt(reportId)
          ? match.report1_user_id
          : match.report2_user_id;

        // Kiểm tra xem có xác định được ID chủ sở hữu không
        if (!ownerId) {
          throw new Error('Không thể xác định ID chủ sở hữu báo cáo');
        }

        // Kiểm tra xem người dùng có đang cố gắng nhắn tin với chính mình không
        if (ownerId === currentUser.value.id) {
          alert('Bạn không thể nhắn tin với chính mình');
          return;
        }

        // Gọi API để bắt đầu cuộc trò chuyện, chỉ định entityType là 'report'
        const response = await messageService.startConversation(ownerId, reportId, 'report');

        // Chuyển hướng đến trang tin nhắn với ID phiên trò chuyện
        router.push({
          path: '/messages',
          query: { session: response.data.id },
        });
      } catch (err) {
        console.error('Không thể bắt đầu cuộc trò chuyện:', err);
        alert('Không thể bắt đầu cuộc trò chuyện. Vui lòng thử lại sau.');
      } finally {
        isLoading.value = false;
      }
    };

    watch(currentUser, (newUser) => {
      console.log('🔍 User changed in detail view:', newUser);
    });

    // Xem sử thay đổi của id trên url thì reload trang lại 1 lần
    watch(() => route.params.id, async (newId) => {
      console.log('🔄 Route changed to:', newId);
      location.reload();
    });



    onMounted(async () => {
      console.log('🚀 Detail view mounted for missing report:', reportId);
      await loadUserIfNeeded();
      await fetchMissingReport();
      if (isAuthenticated.value) {
        await fetchMatches();
      }

      // Kiểm tra thông tin người dùng trong localStorage
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const userData = JSON.parse(userStr)
          isAdmin.value = userData.id === 1;
        } catch (error) {
          console.error('Lỗi khi phân tích dữ liệu người dùng:', error)
        }
      }
      console.log('Là Admin:', isAdmin.value);
    });

    return {
      reportId,
      missingReport,
      loading,
      error,
      matches,
      sortedMatches,
      currentUser,
      isAuthenticated,
      isOwner,
      isAdmin,
      formattedMissingDate,
      timeAgo,
      fetchMissingReport,
      confirmDelete,
      deleteMissingReport,
      goToUploadImage,
      goToMatches,
      handleImageError,
      noImage,
      getSuggestedReportImage,
      getSuggestedReportTitle,
      getSuggestedReportProfileType,
      getSuggestedReportId,
      getConfidenceLabel,
      getSuggestedReportUsername,
      getSuggestedReportCreatedAt,
      getSuggestedReportStatus,
      getSuggestedReportStatusLabel,
      formatTime,
      viewAIMatches,
      showAnalysisDetail,
      toggleAnalysisDetail,
      getMatchScoreColor,
      getMatchScoreBgColor,
      formatKey,
      getVietnameseConclusion,
      isReportOwner,
      startConversationWithReportOwner,
      isLoading
    };
  }
}
</script>

<style scoped>
/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-transform {
  transition-property: transform;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom animations */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

/* Progress bar animations */
@keyframes progressFill {
  from {
    width: 0%;
  }

  to {
    width: var(--progress-width);
  }
}

.progress-animate {
  animation: progressFill 1s ease-out;
}

/* Hover effects */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Custom scrollbar for analysis details */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Responsive grid improvements */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .sm\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .lg\:grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Badge and status improvements */
.status-badge {
  position: relative;
  overflow: hidden;
}

.status-badge::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.status-badge:hover::before {
  left: 100%;
}

/* Image container improvements */
.image-container {
  position: relative;
  overflow: hidden;
}

.image-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%);
  pointer-events: none;
}

/* Loading skeleton */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

/* Compact mode for mobile */
@media (max-width: 480px) {
  .mobile-compact .grid-cols-2 {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .mobile-compact .p-3 {
    padding: 0.5rem;
  }

  .mobile-compact .text-sm {
    font-size: 0.75rem;
  }
}

/* Focus improvements for accessibility */
.focus\:ring-custom:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }

  .print-break {
    page-break-inside: avoid;
  }
}

.responsive-sticky {
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
}

/* Chỉ áp dụng position: sticky cho màn hình lớn (lg và lớn hơn) */
@media (min-width: 1024px) {

  /* 1024px là breakpoint của Tailwind cho lg */
  .responsive-sticky {
    position: sticky;
    top: 15px;
    /* Giữ nguyên giá trị top-15 từ Tailwind */
  }
}
</style>