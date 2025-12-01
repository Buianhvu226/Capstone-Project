<template>
  <div class="min-h-screen bg-slate-50">
    <AppHeader />

    <!-- Hero Section - Tinh tế và Full Viewport -->
    <section id="rm-hero" class="relative h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
      <!-- Background Image với Overlay đơn giản -->
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
          alt="Family background" class="w-full h-full object-cover" />
        <!-- Gradient overlay tinh tế -->
        <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
      </div>

      <!-- Content Container -->
      <div id="rm-hero-content" class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div class="max-w-4xl mx-auto text-center">
          <!-- Main heading -->
          <h1
            class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight tracking-wide animate-fadeIn">
            Tìm kiếm <span class="font-normal text-blue-200">người thân thất lạc</span> gần đây
          </h1>

          <!-- Subtitle -->
          <p
            class="text-base sm:text-lg md:text-xl text-white/95 max-w-2xl mx-auto leading-relaxed mb-8 font-light animate-slideUp">
            Sử dụng công nghệ nhận diện khuôn mặt để tìm kiếm người thân đặc biệt như trẻ em, người già lẫn, hoặc người
            có vấn đề về tâm thần.
          </p>

          <!-- Action buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slideUp delay-300">
            <router-link to="/recently-missing/create"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 bg-white/95 hover:bg-white text-blue-500 hover:text-blue-600 font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base">
              <i class="fas fa-plus-circle"></i>
              <span>Đăng hồ sơ mới</span>
            </router-link>

            <button @click="scrollToSearch"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-full hover:bg-white/20 transition-all duration-300 font-medium text-sm sm:text-base shadow-lg hover:shadow-xl">
              <i class="fas fa-search"></i>
              <span>Tìm kiếm hồ sơ</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Bottom Wave Transition -->
      <div class="absolute bottom-0 left-0 right-0 z-10">
        <svg class="w-full h-16 sm:h-20 text-slate-50" viewBox="0 0 1200 120" preserveAspectRatio="none"
          fill="currentColor">
          <path d="M0,0 C300,100 600,0 900,50 C1050,75 1150,25 1200,50 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-3 sm:px-4 pb-8 relative z-20 bg-slate-50">

      <!-- Tab Navigation -->
      <section id="rm-tabs" class="mb-4">
        <div
          class="bg-white border border-slate-200/80 shadow-[0_15px_35px_-25px_rgba(15,23,42,0.65)] rounded-2xl p-2.5 sm:p-3">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button id="rm-tab-seeker" @click="setActiveTab('seeker')"
              class="group relative flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              :class="activeTab === 'seeker'
                ? 'bg-gradient-to-br from-blue-50 to-white text-blue-600 shadow-lg shadow-blue-100'
                : 'text-slate-600 hover:text-blue-500 hover:bg-slate-50'">
              <div class="flex items-center gap-3">
                <span
                  class="h-10 w-10 rounded-xl border border-blue-100 flex items-center justify-center text-blue-500 bg-blue-50/70">
                  <i class="fas fa-search text-sm"></i>
                </span>
                <div class="text-left">
                  <p class="text-sm font-semibold leading-tight">Người đi tìm</p>
                  <span class="text-xs text-slate-500 hidden md:block">Các hồ sơ cần hỗ trợ khẩn</span>
                </div>
              </div>
              <span class="px-2 py-0.5 text-[10px] font-bold rounded-full"
                :class="activeTab === 'seeker' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'">
                {{ seekerCount }}
              </span>
              <span
                class="pointer-events-none absolute inset-x-4 bottom-1 h-0.5 rounded-full bg-gradient-to-r from-transparent via-blue-400/60 to-transparent transition-opacity duration-300"
                :class="activeTab === 'seeker' ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'"></span>
            </button>

            <button id="rm-tab-finder" @click="setActiveTab('finder')"
              class="group relative flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              :class="activeTab === 'finder'
                ? 'bg-gradient-to-br from-blue-50 to-white text-blue-600 shadow-lg shadow-blue-100'
                : 'text-slate-600 hover:text-blue-500 hover:bg-slate-50'">
              <div class="flex items-center gap-3">
                <span
                  class="h-10 w-10 rounded-xl border border-blue-100 flex items-center justify-center text-blue-500 bg-blue-50/70">
                  <i class="fas fa-eye text-sm"></i>
                </span>
                <div class="text-left">
                  <p class="text-sm font-semibold leading-tight">Người cung cấp</p>
                  <span class="text-xs text-slate-500 hidden md:block">Các nguồn tin mới nhất</span>
                </div>
              </div>
              <span class="px-2 py-0.5 text-[10px] font-bold rounded-full"
                :class="activeTab === 'finder' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'">
                {{ finderCount }}
              </span>
              <span
                class="pointer-events-none absolute inset-x-4 bottom-1 h-0.5 rounded-full bg-gradient-to-r from-transparent via-blue-400/60 to-transparent transition-opacity duration-300"
                :class="activeTab === 'finder' ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'"></span>
            </button>

            <button id="rm-tab-my-report" @click="setActiveTab('my-report')"
              class="group relative flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              :class="activeTab === 'my-report'
                ? 'bg-gradient-to-br from-blue-50 to-white text-blue-600 shadow-lg shadow-blue-100'
                : 'text-slate-600 hover:text-blue-500 hover:bg-slate-50'">
              <div class="flex items-center gap-3">
                <span
                  class="h-10 w-10 rounded-xl border border-blue-100 flex items-center justify-center text-blue-500 bg-blue-50/70">
                  <i class="fas fa-user-edit text-sm"></i>
                </span>
                <div class="text-left">
                  <p class="text-sm font-semibold leading-tight">Báo cáo của tôi</p>
                  <span class="text-xs text-slate-500 hidden md:block">Theo dõi trạng thái thông báo</span>
                </div>
              </div>
              <span class="px-2 py-0.5 text-[10px] font-bold rounded-full"
                :class="activeTab === 'my-report' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'">
                {{ myReportCount }}
              </span>
              <span
                class="pointer-events-none absolute inset-x-4 bottom-1 h-0.5 rounded-full bg-gradient-to-r from-transparent via-blue-400/60 to-transparent transition-opacity duration-300"
                :class="activeTab === 'my-report' ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'"></span>
            </button>
          </div>
        </div>
      </section>

      <!-- Mobile: Filter Button -->
      <div id="rm-filter-mobile-btn" class="md:hidden fixed bottom-24 right-4 z-40">
        <button @click="showFilterModal = true"
          class="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-blue-500 border border-blue-300 shadow-md hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-all duration-200">
          <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-500 text-sm">
            <i class="fas fa-filter"></i>
          </span>
          <span class="text-xs font-semibold">Bộ lọc</span>
          <span
            class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4.5 h-4.5 flex items-center justify-center"
            v-if="hasActiveFilters">!</span>
        </button>
      </div>

      <!-- Mobile: Filter Modal -->
      <transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="showFilterModal" class="md:hidden fixed inset-0 z-50 overflow-y-auto"
          @click.self="showFilterModal = false">
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="showFilterModal = false"></div>
          <div class="relative bg-white rounded-t-2xl shadow-2xl mt-auto min-h-[80vh] max-h-[90vh] overflow-hidden">
            <div
              class="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
              <h3 class="text-lg font-semibold text-gray-900">Bộ lọc tìm kiếm</h3>
              <button @click="showFilterModal = false"
                class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <i class="fas fa-times text-lg"></i>
              </button>
            </div>
            <div class="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
              <form @submit.prevent="applyFilters" class="space-y-4">
                <div class="space-y-2">
                  <label class="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                    <i class="fas fa-user text-blue-400 text-xs"></i> Tên người thất lạc
                  </label>
                  <input v-model="filters.name" type="text"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-gray-50 focus:bg-white"
                    placeholder="Nhập tên người thất lạc..." />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                    <i class="fas fa-map-marker-alt text-blue-400 text-xs"></i> Địa điểm
                  </label>
                  <input v-model="filters.location" type="text"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-gray-50 focus:bg-white"
                    placeholder="Địa điểm mất tích hoặc gặp thấy..." />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-medium text-gray-700 flex items-center gap-1.5 mb-2">
                    <i class="fas fa-flag text-blue-400 text-xs"></i> Trạng thái
                  </label>
                  <div class="grid grid-cols-2 gap-2">
                    <label
                      class="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="radio" v-model="filters.status" value=""
                        class="text-blue-400 focus:ring-blue-400 h-3.5 w-3.5 cursor-pointer" />
                      <span class="ml-2 text-xs text-gray-700">Tất cả</span>
                    </label>
                    <label
                      class="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="radio" v-model="filters.status" value="active"
                        class="text-blue-400 focus:ring-blue-400 h-3.5 w-3.5 cursor-pointer" />
                      <span class="ml-2 text-xs text-gray-700">Đang tìm</span>
                    </label>
                    <label
                      class="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="radio" v-model="filters.status" value="found"
                        class="text-blue-400 focus:ring-blue-400 h-3.5 w-3.5 cursor-pointer" />
                      <span class="ml-2 text-xs text-gray-700">Đã tìm thấy</span>
                    </label>
                    <label
                      class="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="radio" v-model="filters.status" value="closed"
                        class="text-blue-400 focus:ring-blue-400 h-3.5 w-3.5 cursor-pointer" />
                      <span class="ml-2 text-xs text-gray-700">Đã đóng</span>
                    </label>
                  </div>
                </div>

                <div class="flex gap-3 pt-4 border-t border-gray-100 sticky bottom-0 bg-white -mx-4 px-4 pb-4">
                  <button type="button" @click="resetFilters"
                    class="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                    Đặt lại
                  </button>
                  <button type="submit"
                    class="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow transition-all">
                    Tìm kiếm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </transition>

      <!-- Results Section -->
      <section id="rm-results-header" ref="searchSection">
        <div
          class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.65)]">
          <div class="flex items-center gap-3 min-w-0">
            <div
              class="h-11 w-11 rounded-2xl border border-blue-100 bg-blue-50/80 text-blue-500 flex items-center justify-center">
              <i :class="{
                'fas fa-search text-base': activeTab === 'seeker',
                'fas fa-eye text-base': activeTab === 'finder',
                'fas fa-user-edit text-base': activeTab === 'my-report'
              }"></i>
            </div>
            <div class="min-w-0">
              <p class="text-base sm:text-sm md:text-base font-semibold text-gray-900 leading-tight truncate">
                {{ activeTab === 'seeker' ? 'Danh sách người đi tìm' :
                  activeTab === 'finder' ? 'Danh sách người cung cấp thông tin' :
                    'Báo cáo của tôi' }}
              </p>
              <p class="text-xs sm:text-sm text-slate-500">{{ filteredProfiles.length }} hồ sơ được tìm thấy</p>
            </div>
          </div>

          <div class="hidden md:flex items-center gap-2">
            <div class="relative" ref="filterDropdownRef">
              <button id="rm-filter-desktop" @click="showFilterDropdown = !showFilterDropdown"
                class="inline-flex items-center gap-2 rounded-full border border-blue-200 px-4 py-2 text-xs font-semibold text-blue-500 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                <i class="fas fa-sliders-h text-sm"></i>
                <span>Bộ lọc</span>
                <i class="fas fa-chevron-down text-[10px] transition-transform"
                  :class="{ 'rotate-180': showFilterDropdown }"></i>
                <span v-if="hasActiveFilters"
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  !
                </span>
              </button>

              <transition enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 translate-y-2 scale-95" enter-to-class="opacity-100 translate-y-0 scale-100"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 translate-y-0 scale-100"
                leave-to-class="opacity-0 translate-y-2 scale-95">
                <div v-if="showFilterDropdown"
                  class="absolute right-0 mt-3 w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                  @click.stop>
                  <form @submit.prevent="applyFilters" class="p-5 space-y-4">
                    <div class="flex items-center justify-between pb-3 border-b border-gray-100">
                      <h3 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <i class="fas fa-filter text-blue-500"></i>
                        Bộ lọc tìm kiếm
                      </h3>
                      <button type="button" @click="showFilterDropdown = false"
                        class="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <i class="fas fa-times text-xs"></i>
                      </button>
                    </div>

                    <div class="space-y-3">
                      <div class="space-y-2">
                        <label class="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                          <i class="fas fa-user text-blue-400 text-xs"></i> Tên người thất lạc
                        </label>
                        <input v-model="filters.name" type="text"
                          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-gray-50 focus:bg-white"
                          placeholder="Nhập tên người thất lạc..." />
                      </div>
                      <div class="space-y-2">
                        <label class="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                          <i class="fas fa-map-marker-alt text-blue-400 text-xs"></i> Địa điểm
                        </label>
                        <input v-model="filters.location" type="text"
                          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-gray-50 focus:bg-white"
                          placeholder="Địa điểm mất tích hoặc gặp thấy..." />
                      </div>
                      <div class="space-y-2">
                        <label class="text-xs font-medium text-gray-700 flex items-center gap-1.5 mb-2">
                          <i class="fas fa-flag text-blue-400 text-xs"></i> Trạng thái
                        </label>
                        <div class="grid grid-cols-2 gap-2">
                          <label
                            class="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input type="radio" v-model="filters.status" value=""
                              class="text-blue-400 focus:ring-blue-400 h-3.5 w-3.5 cursor-pointer" />
                            <span class="ml-2 text-xs text-gray-700">Tất cả</span>
                          </label>
                          <label
                            class="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input type="radio" v-model="filters.status" value="active"
                              class="text-blue-400 focus:ring-blue-400 h-3.5 w-3.5 cursor-pointer" />
                            <span class="ml-2 text-xs text-gray-700">Đang tìm</span>
                          </label>
                          <label
                            class="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input type="radio" v-model="filters.status" value="found"
                              class="text-blue-400 focus:ring-blue-400 h-3.5 w-3.5 cursor-pointer" />
                            <span class="ml-2 text-xs text-gray-700">Đã tìm thấy</span>
                          </label>
                          <label
                            class="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input type="radio" v-model="filters.status" value="closed"
                              class="text-blue-400 focus:ring-blue-400 h-3.5 w-3.5 cursor-pointer" />
                            <span class="ml-2 text-xs text-gray-700">Đã đóng</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div class="flex gap-3 pt-4 border-t border-gray-100">
                      <button type="button" @click="resetFilters"
                        class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                        Đặt lại
                      </button>
                      <button type="submit"
                        class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow transition-all">
                        Tìm kiếm
                      </button>
                    </div>
                  </form>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-lg border border-gray-200/80 shadow-sm p-6 flex justify-center">
          <div class="flex flex-col items-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p class="mt-3 text-xs text-slate-600">Đang tải dữ liệu...</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!loading && filteredProfiles.length === 0"
          class="bg-white rounded-lg border border-gray-200/80 shadow-sm p-6 text-center">
          <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <i class="fas fa-search text-blue-500 text-lg"></i>
          </div>
          <h3 class="text-sm font-semibold text-slate-800 mb-1">Không tìm thấy kết quả</h3>
          <p class="text-xs text-slate-600 mb-4 max-w-md mx-auto">
            Không có hồ sơ {{
              activeTab === 'seeker' ? 'người đi tìm' :
                activeTab === 'finder' ? 'người cung cấp thông tin' :
                  'của bạn'
            }} nào phù hợp với tiêu chí tìm kiếm của bạn
          </p>
          <router-link to="/recently-missing/create"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors">
            <i class="fas fa-plus-circle text-xs"></i>
            <span>Đăng hồ sơ mới</span>
          </router-link>
        </div>

        <!-- Results List -->
        <template v-else>
          <RecentlyMissingList :profiles="paginatedProfiles" :current-user="currentUser" />

          <!-- Pagination -->
          <div id="rm-pagination" class="mt-4" v-if="totalPages > 1">
            <AppPagination :current-page="currentPage" :total-pages="totalPages" @page-change="changePage" />
            <div class="text-center text-xs text-slate-500 mt-2">
              Hiển thị {{ paginatedProfiles.length }} hồ sơ trong tổng số {{ filteredProfiles.length }} hồ sơ
            </div>
          </div>
        </template>
      </section>

      <!-- Nút mở guide tour -->
      <button
        class="fixed left-4 bottom-6 z-40 inline-flex items-center gap-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-3.5 py-2 shadow-lg hover:shadow-xl transition-all"
        @click="openGuideTour">
        <i class="fas fa-question-circle text-sm"></i>
        <span class="hidden sm:inline">Hướng dẫn</span>
      </button>

      <RecentlyMissingGuideTour :is-active="showGuideTour" @close="closeGuideTour" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import AppLoader from '@/components/common/AppLoader.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import RecentlyMissingList from '@/components/recentlyMissing/RecentlyMissingList.vue'
import RecentlyMissingGuideTour from '@/components/recentlyMissing/RecentlyMissingGuideTour.vue'

export default {
  name: 'RecentlyMissingListView',

  components: {
    AppHeader,
    AppLoader,
    AppPagination,
    RecentlyMissingList,
    RecentlyMissingGuideTour
  },

  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const searchSection = ref(null)
    const showGuideTour = ref(false)

    // ✅ Safe computed with fallback
    const allProfiles = computed(() => {
      const profiles = store.getters['recentlyMissing/getProfiles'] ||
        store.getters['recentlyMissing/publicMissingReports'] ||
        [];
      console.log('📋 All profiles from store:', profiles);
      return profiles;
    })

    const myReports = computed(() => {
      const reports = store.getters['recentlyMissing/myReports'] || [];
      console.log('📋 My reports from store:', reports);
      return reports;
    })

    const loading = computed(() => {
      const isLoading = store.getters['recentlyMissing/isLoading'] ||
        store.getters['recentlyMissing/loading'] ||
        false;
      console.log('⏳ Loading state:', isLoading);
      return isLoading;
    })

    const error = computed(() => {
      const errorState = store.getters['recentlyMissing/getError'] ||
        store.getters['recentlyMissing/error'] ||
        null;
      console.log('❌ Error state:', errorState);
      return errorState;
    })

    // ✅ Current user với fallback về localStorage - KHÔNG ép buộc authentication
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

      console.log('🔍 No current user found - but that\'s OK for public page');
      return null; // ✅ Trả về null là bình thường cho trang public
    });

    // ✅ Kiểm tra trạng thái đăng nhập với fallback - OPTIONAL cho trang này
    const isAuthenticated = computed(() => {
      const authStatus = store.getters['auth/isAuthenticated'];
      const hasToken = localStorage.getItem('token');
      const result = authStatus || !!hasToken;
      console.log('🔐 Is authenticated:', result, { authStatus, hasToken: !!hasToken });
      return result;
    })

    const activeTab = ref('seeker')
    const showFilterModal = ref(false)
    const showFilterDropdown = ref(false)
    const filterDropdownRef = ref(null)
    const currentPage = ref(1)
    const itemsPerPage = 5

    // Cache trạng thái theo từng tab (bộ lọc + trang hiện tại)
    const tabState = ref({
      seeker: {
        filters: {
          name: '',
          status: '',
          location: ''
        },
        page: 1
      },
      finder: {
        filters: {
          name: '',
          status: '',
          location: ''
        },
        page: 1
      },
      'my-report': {
        filters: {
          name: '',
          status: '',
          location: ''
        },
        page: 1
      }
    })

    const filters = ref({
      name: '',
      status: '',
      location: ''
    })

    // Check if there are active filters
    const hasActiveFilters = computed(() => {
      return Object.values(filters.value).some(v => v && v !== '')
    })

    // ✅ Safe filter với additional checks và improved user matching
    const filteredProfiles = computed(() => {
      // Nếu đang ở tab "Báo cáo của tôi", sử dụng myReports
      if (activeTab.value === 'my-report') {
        if (!Array.isArray(myReports.value)) {
          console.warn('⚠️ myReports is not an array:', myReports.value);
          return [];
        }

        let reports = myReports.value;

        // Apply search filters với safe checking
        if (filters.value.name && filters.value.name.trim()) {
          reports = reports.filter(report => {
            const name = report.name || '';
            const title = report.title || '';
            const searchTerm = filters.value.name.toLowerCase();

            return name.toLowerCase().includes(searchTerm) ||
              title.toLowerCase().includes(searchTerm);
          });
        }

        if (filters.value.status && filters.value.status.trim()) {
          reports = reports.filter(report => report.status === filters.value.status);
        }

        if (filters.value.location && filters.value.location.trim()) {
          reports = reports.filter(report => {
            const location = report.location || '';
            return location.toLowerCase().includes(filters.value.location.toLowerCase());
          });
        }

        // Sort by created date (newest first)
        return reports.sort((a, b) => {
          const aDate = new Date(a.created_at || 0);
          const bDate = new Date(b.created_at || 0);
          return bDate - aDate;
        });
      }

      // ✅ Early return nếu allProfiles không phải array
      if (!Array.isArray(allProfiles.value)) {
        console.warn('⚠️ allProfiles is not an array:', allProfiles.value);
        return [];
      }

      let profiles = allProfiles.value.filter(profile => {
        return profile && profile.profile_type === activeTab.value;
      });

      // Apply search filters với safe checking
      if (filters.value.name && filters.value.name.trim()) {
        profiles = profiles.filter(profile => {
          const name = profile.name || '';
          const title = profile.title || '';
          const searchTerm = filters.value.name.toLowerCase();

          return name.toLowerCase().includes(searchTerm) ||
            title.toLowerCase().includes(searchTerm);
        });
      }

      if (filters.value.status && filters.value.status.trim()) {
        profiles = profiles.filter(profile => profile.status === filters.value.status);
      }

      if (filters.value.location && filters.value.location.trim()) {
        profiles = profiles.filter(profile => {
          const location = profile.location || '';
          return location.toLowerCase().includes(filters.value.location.toLowerCase());
        });
      }

      // ✅ Sort: own profiles first (if user is logged in), then by created date
      return profiles.sort((a, b) => {
        // Own profiles first - CHỈ khi user đã đăng nhập
        if (currentUser.value) {
          const currentUsername = currentUser.value.username || currentUser.value.email;
          const currentId = currentUser.value.id;

          const aIsOwn = (a.username === currentUsername) ||
            (a.username === currentUser.value.email) ||
            (a.user_id === currentId) ||
            (a.created_by === currentId);

          const bIsOwn = (b.username === currentUsername) ||
            (b.username === currentUser.value.email) ||
            (b.user_id === currentId) ||
            (b.created_by === currentId);

          if (aIsOwn && !bIsOwn) return -1;
          if (!aIsOwn && bIsOwn) return 1;
        }

        // Then by created date (newest first)
        const aDate = new Date(a.created_at || 0);
        const bDate = new Date(b.created_at || 0);
        return bDate - aDate;
      });
    })

    // Pagination
    const totalPages = computed(() => Math.ceil(filteredProfiles.value.length / itemsPerPage))

    const paginatedProfiles = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredProfiles.value.slice(start, end)
    })

    // Counts for tabs với safe checking
    const seekerCount = computed(() => {
      if (!Array.isArray(allProfiles.value)) return 0;
      return allProfiles.value.filter(p => p && p.profile_type === 'seeker').length;
    })

    const finderCount = computed(() => {
      if (!Array.isArray(allProfiles.value)) return 0;
      return allProfiles.value.filter(p => p && p.profile_type === 'finder').length;
    })

    const myReportCount = computed(() => {
      if (!Array.isArray(myReports.value)) return 0;
      return myReports.value.length;
    })

    // Methods
    const setActiveTab = async (tab) => {
      if (tab === activeTab.value) return

      // Lưu lại trạng thái tab hiện tại
      const currentTabKey = activeTab.value
      if (tabState.value[currentTabKey]) {
        tabState.value[currentTabKey].filters = { ...filters.value }
        tabState.value[currentTabKey].page = currentPage.value
      }

      // Chuyển tab
      activeTab.value = tab

      // Khôi phục trạng thái tab mới (nếu có)
      const nextState = tabState.value[tab]
      if (nextState) {
        filters.value = { ...nextState.filters }
        currentPage.value = nextState.page || 1
      } else {
        currentPage.value = 1
      }

      // Lần đầu vào tab "Báo cáo của tôi" mới gọi API, sau đó dùng cache trong Vuex
      if (tab === 'my-report' && (!Array.isArray(myReports.value) || myReports.value.length === 0)) {
        await store.dispatch('recentlyMissing/fetchMyReports')
      }
    }

    // ✅ Fetch function - KHÔNG cần authentication
    const fetchProfiles = async () => {
      try {
        // Nếu đã có dữ liệu publicMissingReports trong Vuex thì dùng cache, không gọi lại API
        if (Array.isArray(allProfiles.value) && allProfiles.value.length > 0) {
          console.log('📦 Using cached public missing reports from store')
          return
        }

        console.log('📤 Fetching public missing reports from API...');

        await store.dispatch('recentlyMissing/fetchPublicMissingReports', {
          page_size: 100 // Get all profiles to handle filtering and pagination on frontend
        });

        console.log('✅ Fetch completed');
      } catch (err) {
        console.error('❌ Failed to fetch missing reports:', err);
        // KHÔNG throw error - trang vẫn có thể hiển thị được
      }
    }

    const applyFilters = () => {
      currentPage.value = 1 // Reset to first page when applying filters
      showFilterDropdown.value = false
      showFilterModal.value = false
    }

    const resetFilters = () => {
      filters.value = {
        name: '',
        status: '',
        location: ''
      }
      currentPage.value = 1
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (filterDropdownRef.value && !filterDropdownRef.value.contains(event.target)) {
        showFilterDropdown.value = false
      }
    }

    const changePage = (page) => {
      currentPage.value = page

      // Scroll to search section
      if (searchSection.value) {
        window.scrollTo({
          top: searchSection.value.offsetTop - 100,
          behavior: 'smooth'
        })
      }
    }

    const scrollToSearch = () => {
      if (searchSection.value) {
        window.scrollTo({
          top: searchSection.value.offsetTop - 100,
          behavior: 'smooth'
        })
        // Open filter after scroll
        setTimeout(() => {
          if (window.innerWidth >= 768) {
            showFilterDropdown.value = true
          } else {
            showFilterModal.value = true
          }
        }, 500)
      }
    }

    const openGuideTour = () => {
      showGuideTour.value = true
      localStorage.setItem('recentlyMissingGuideSeen', '1')
    }

    const closeGuideTour = () => {
      showGuideTour.value = false
    }

    // ✅ Load user nếu có token - OPTIONAL, không ép buộc
    const loadUserIfNeeded = async () => {
      const hasToken = localStorage.getItem('token');
      const storeUser = store.getters['auth/currentUser'];

      if (hasToken && !storeUser) {
        try {
          console.log('🔄 Loading user from server (optional)...');
          await store.dispatch('auth/initializeAuth');
        } catch (error) {
          console.warn('⚠️ Failed to load user - continuing as anonymous:', error);
          // KHÔNG throw error - user có thể xem trang như anonymous
        }
      } else {
        console.log('ℹ️ No token or user already loaded - continuing...');
      }
    }

    // ✅ Fetch initial data - KHÔNG depend vào authentication
    onMounted(async () => {
      console.log('🚀 Component mounted, loading data...');

      // Load data song song, không depend vào nhau
      await Promise.allSettled([
        loadUserIfNeeded(), // Optional
        fetchProfiles()     // Required
      ]);

      // Add click outside listener
      document.addEventListener('click', handleClickOutside);

      const seen = localStorage.getItem('recentlyMissingGuideSeen')
      if (!seen) {
        setTimeout(() => {
          openGuideTour()
        }, 800)
      }

      console.log('✅ Page initialization completed');
    })

    // Cleanup
    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
    })

    return {
      allProfiles,
      filteredProfiles,
      paginatedProfiles,
      myReports,
      myReportCount,
      loading,
      error,
      currentUser,
      isAuthenticated,
      activeTab,
      showFilterModal,
      showFilterDropdown,
      filterDropdownRef,
      hasActiveFilters,
      currentPage,
      totalPages,
      seekerCount,
      finderCount,
      filters,
      searchSection,
      showGuideTour,
      setActiveTab,
      fetchProfiles,
      applyFilters,
      resetFilters,
      changePage,
      scrollToSearch,
      openGuideTour,
      closeGuideTour
    }
  }
}
</script>
<style scoped>
/* Smooth transitions */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Gentle animations for hero content */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(15px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 1.2s ease-out;
}

.animate-slideUp {
  animation: slideUp 1.2s ease-out;
}

.animate-slideUp.delay-300 {
  animation-delay: 0.3s;
  animation-fill-mode: both;
}
</style>