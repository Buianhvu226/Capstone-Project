<template>
  <div class="pt-12">
    <AppHeader />

    <div class="flex flex-col justify-center gap-12 md:gap-16 lg:gap-20">
      <!-- Hero Section với Slider - Tinh tế và nhẹ nhàng -->
      <section class="relative h-[70vh] md:h-[80vh] lg:h-[85vh] overflow-hidden">
        <!-- Carousel slides -->
        <div class="relative h-full w-full">
          <div v-for="(slide, index) in slides" :key="slide.id" v-show="currentSlide === index"
            class="absolute inset-0 w-full h-full">
            <img :src="slide.image" :alt="slide.alt"
              class="w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out"
              :class="currentSlide === index ? 'opacity-100' : 'opacity-0'" />
            <!-- Overlay gradient nhẹ nhàng -->
            <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>

            <!-- Content -->
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8">
              <div class="max-w-4xl space-y-6 md:space-y-8">
                <h1
                  class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight tracking-wide animate-fadeIn">
                  {{ slide.title }}
                </h1>
                <p
                  class="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-light italic animate-slideUp">
                  {{ slide.description }}
                </p>
                <div class="pt-4 animate-slideUp delay-300">
                  <router-link to="/profile/create"
                    class="inline-block bg-white/95 hover:bg-white text-blue-400 hover:text-blue-500 font-medium px-8 py-3.5 md:px-10 md:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-sm md:text-base">
                    Đăng tin tìm kiếm ngay
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Slide indicators - Tinh tế hơn -->
        <div class="absolute bottom-6 md:bottom-8 left-0 right-0 flex justify-center space-x-2.5 z-10">
          <button v-for="(slide, index) in slides" :key="`dot-${slide.id}`" @click="currentSlide = index"
            class="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-500 ease-out backdrop-blur-sm" :class="currentSlide === index
              ? 'bg-white scale-125 shadow-lg'
              : 'bg-white/40 hover:bg-white/60'">
          </button>
        </div>
      </section>

      <!-- Mobile: Filter Button -->
      <div class="md:hidden fixed bottom-24 right-4 z-40">
        <button @click="showFilterModal = true"
          class="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-blue-500 border border-blue-300 shadow-md hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-all duration-200">
          <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-500 text-sm">
            <i class="fas fa-filter"></i>
          </span>
          <span class="text-xs font-semibold">Bộ lọc</span>
          <span
            class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4.5 h-4.5 flex items-center justify-center"
            v-if="Object.values(filters).some(v => v && v !== 'active')">!</span>
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
              <form @submit.prevent="handleFilter" class="space-y-4">
                <div class="space-y-2">
                  <label class="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                    <i class="fas fa-user text-blue-400 text-xs"></i> Họ tên
                  </label>
                  <input v-model="filters.full_name" type="text"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-gray-50 focus:bg-white"
                    placeholder="Nhập họ tên..." />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-2">
                    <label class="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                      <i class="fas fa-birthday-cake text-blue-400 text-xs"></i> Năm sinh
                    </label>
                    <select v-model="filters.born_year"
                      class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-gray-50 focus:bg-white">
                      <option value="">Tất cả</option>
                      <option v-for="year in yearOptions" :key="`born-${year}`" :value="year">{{ year }}</option>
                    </select>
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                      <i class="fas fa-calendar-minus text-blue-400 text-xs"></i> Năm thất lạc
                    </label>
                    <select v-model="filters.losing_year"
                      class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-gray-50 focus:bg-white">
                      <option value="">Tất cả</option>
                      <option v-for="year in yearOptions" :key="`losing-${year}`" :value="year">{{ year }}</option>
                    </select>
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                    <i class="fas fa-male text-blue-400 text-xs"></i> Tên cha
                  </label>
                  <input v-model="filters.name_of_father" type="text"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-gray-50 focus:bg-white"
                    placeholder="Nhập tên cha..." />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                    <i class="fas fa-female text-blue-400 text-xs"></i> Tên mẹ
                  </label>
                  <input v-model="filters.name_of_mother" type="text"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-gray-50 focus:bg-white"
                    placeholder="Nhập tên mẹ..." />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                    <i class="fas fa-users text-blue-400 text-xs"></i> Anh chị em
                  </label>
                  <input v-model="filters.siblings" type="text"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-gray-50 focus:bg-white"
                    placeholder="Nhập tên anh chị em..." />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-medium text-gray-700 flex items-center gap-1.5 mb-2">
                    <i class="fas fa-flag text-blue-400 text-xs"></i> Trạng thái
                  </label>
                  <div class="grid grid-cols-2 gap-2">
                    <label
                      class="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="radio" v-model="filters.status" value="all"
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

                <!-- Sort Section -->
                <div class="pt-4 border-t border-gray-100">
                  <label class="block text-xs font-semibold text-gray-700 mb-2">
                    <i class="fas fa-sort-amount-down text-blue-400 mr-1.5"></i>
                    Sắp xếp theo
                  </label>
                  <div class="grid grid-cols-2 gap-2">
                    <button v-for="option in sortOptions" :key="option.value" type="button"
                      @click="handleSortChange(option.value)"
                      class="flex items-center gap-2 px-3 py-2 text-xs rounded-lg border transition-colors" :class="currentSort === option.value
                        ? 'bg-blue-50 border-blue-300 text-blue-600 font-semibold'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'">
                      <i :class="`fas ${option.icon} text-xs`"></i>
                      <span class="flex-1 text-left">{{ option.label }}</span>
                      <i v-if="currentSort === option.value" class="fas fa-check text-blue-500 text-xs"></i>
                    </button>
                  </div>
                </div>

                <div class="flex gap-3 pt-4 border-t border-gray-100 sticky bottom-0 bg-white -mx-4 px-4 pb-4">
                  <button type="button" @click="resetFilters"
                    class="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                    Đặt lại
                  </button>
                  <button type="submit"
                    class="flex-1 px-4 py-2.5 bg-blue-400 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow transition-all">
                    Tìm kiếm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </transition>

      <!-- Profile List Section - Tối ưu và đẹp mắt -->
      <section class="w-full mb-12 md:mb-16">
        <div class="w-full sm:max-w-7xl sm:mx-auto sm:px-4 md:px-6 lg:px-8">
          <!-- Header -->
          <div
            class="mb-4 md:mb-5 px-4 sm:px-0 py-3 md:py-0 bg-white/60 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none rounded-xl md:rounded-none border border-gray-100/50 md:border-0 shadow-sm md:shadow-none">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-2">
              <div class="flex items-center gap-2.5 sm:gap-2 w-full sm:w-auto">
                <div class="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-2 sm:p-1.5 flex-shrink-0">
                  <i class="fas fa-user-circle text-blue-400 text-sm sm:text-xs md:text-sm"></i>
                </div>
                <div class="flex items-center gap-2 flex-wrap min-w-0 flex-1">
                  <h2 class="text-base sm:text-sm md:text-base font-semibold text-gray-900 leading-tight">
                    Danh sách các hồ sơ
                  </h2>
                  <span
                    class="inline-flex items-center px-2 py-1 sm:px-1.5 sm:py-0.5 rounded-lg sm:rounded-md text-xs sm:text-[10px] md:text-xs font-semibold bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-400 whitespace-nowrap flex-shrink-0">
                    {{ totalProfiles }} hồ sơ
                  </span>
                </div>
              </div>
              <div class="hidden md:flex items-center gap-2">
                <!-- Filter Button -->
                <div class="relative" ref="filterDropdownRef">
                  <button @click="showFilterDropdown = !showFilterDropdown"
                    class="relative text-xs text-blue-400 hover:text-blue-500 transition-colors flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 border border-blue-200">
                    <i class="fas fa-filter text-xs"></i>
                    <span>Bộ lọc</span>
                    <i class="fas fa-chevron-down text-[10px] transition-transform"
                      :class="{ 'rotate-180': showFilterDropdown }"></i>
                    <span v-if="Object.values(filters).some(v => v && v !== 'active')"
                      class="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] rounded-full w-3.5 h-3.5 flex items-center justify-center">
                      !
                    </span>
                  </button>

                  <!-- Filter Dropdown -->
                  <transition enter-active-class="transition ease-out duration-200"
                    enter-from-class="opacity-0 translate-y-2 scale-95"
                    enter-to-class="opacity-100 translate-y-0 scale-100"
                    leave-active-class="transition ease-in duration-150"
                    leave-from-class="opacity-100 translate-y-0 scale-100"
                    leave-to-class="opacity-0 translate-y-2 scale-95">
                    <div v-if="showFilterDropdown"
                      class="absolute right-0 mt-2 w-[420px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                      @click.stop>
                      <form @submit.prevent="handleFilter" class="p-4 space-y-4">
                        <!-- Header -->
                        <div class="flex items-center justify-between pb-3 border-b border-gray-100">
                          <h3 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <i class="fas fa-filter text-blue-400"></i>
                            Bộ lọc tìm kiếm
                          </h3>
                          <button type="button" @click="showFilterDropdown = false"
                            class="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                            <i class="fas fa-times text-xs"></i>
                          </button>
                        </div>

                        <!-- Basic Filters -->
                        <div class="grid grid-cols-2 gap-3">
                          <div class="space-y-1.5">
                            <label class="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                              <i class="fas fa-user text-blue-400 text-xs"></i> Họ tên
                            </label>
                            <input v-model="filters.full_name" type="text"
                              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-gray-50 focus:bg-white"
                              placeholder="Nhập họ tên..." />
                          </div>
                          <div class="space-y-1.5">
                            <label class="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                              <i class="fas fa-birthday-cake text-blue-400 text-xs"></i> Năm sinh
                            </label>
                            <select v-model="filters.born_year"
                              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-gray-50 focus:bg-white">
                              <option value="">Tất cả</option>
                              <option v-for="year in yearOptions" :key="`born-${year}`" :value="year">{{ year }}
                              </option>
                            </select>
                          </div>
                          <div class="space-y-1.5">
                            <label class="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                              <i class="fas fa-calendar-minus text-blue-400 text-xs"></i> Năm thất lạc
                            </label>
                            <select v-model="filters.losing_year"
                              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-gray-50 focus:bg-white">
                              <option value="">Tất cả</option>
                              <option v-for="year in yearOptions" :key="`losing-${year}`" :value="year">{{ year }}
                              </option>
                            </select>
                          </div>
                          <div class="space-y-1.5">
                            <label class="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                              <i class="fas fa-flag text-blue-400 text-xs"></i> Trạng thái
                            </label>
                            <select v-model="filters.status"
                              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-gray-50 focus:bg-white">
                              <option value="all">Tất cả</option>
                              <option value="active">Đang tìm kiếm</option>
                              <option value="found">Đã tìm thấy</option>
                              <option value="closed">Đã đóng</option>
                            </select>
                          </div>
                        </div>

                        <!-- Advanced Filters -->
                        <div class="pt-2 border-t border-gray-100">
                          <button type="button" @click="showAdvancedSearch = !showAdvancedSearch"
                            class="w-full flex items-center justify-between text-xs text-gray-600 hover:text-gray-900 py-2 transition-colors">
                            <span class="flex items-center gap-1.5">
                              <i class="fas fa-sliders-h text-blue-400"></i>
                              Lọc nâng cao
                            </span>
                            <i class="fas fa-chevron-down text-[10px] transition-transform"
                              :class="{ 'rotate-180': showAdvancedSearch }"></i>
                          </button>
                          <transition enter-active-class="transition-all duration-300 ease-out"
                            enter-from-class="opacity-0 max-h-0" enter-to-class="opacity-100 max-h-[200px]"
                            leave-active-class="transition-all duration-300 ease-in"
                            leave-from-class="opacity-100 max-h-[200px]" leave-to-class="opacity-0 max-h-0">
                            <div v-show="showAdvancedSearch" class="grid grid-cols-3 gap-3 pt-3 overflow-hidden">
                              <div class="space-y-1.5">
                                <label class="text-xs text-gray-600">Tên cha</label>
                                <input v-model="filters.name_of_father" type="text"
                                  class="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-gray-50 focus:bg-white"
                                  placeholder="Tên cha..." />
                              </div>
                              <div class="space-y-1.5">
                                <label class="text-xs text-gray-600">Tên mẹ</label>
                                <input v-model="filters.name_of_mother" type="text"
                                  class="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-gray-50 focus:bg-white"
                                  placeholder="Tên mẹ..." />
                              </div>
                              <div class="space-y-1.5">
                                <label class="text-xs text-gray-600">Anh chị em</label>
                                <input v-model="filters.siblings" type="text"
                                  class="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-gray-50 focus:bg-white"
                                  placeholder="Anh chị em..." />
                              </div>
                            </div>
                          </transition>
                        </div>

                        <!-- Actions -->
                        <div class="flex gap-2 pt-3 border-t border-gray-100">
                          <button type="button" @click="resetFilters"
                            class="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors">
                            Đặt lại
                          </button>
                          <button type="submit"
                            class="flex-1 px-3 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow transition-all">
                            Áp dụng
                          </button>
                        </div>
                      </form>
                    </div>
                  </transition>
                </div>

                <!-- Sort Button -->
                <div class="relative" ref="sortDropdownRef">
                  <button @click="showSortDropdown = !showSortDropdown"
                    class="text-xs text-blue-400 hover:text-blue-500 transition-colors flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 border border-blue-200">
                    <i class="fas fa-sort-amount-down text-xs"></i>
                    <span>{{ getCurrentSortLabel() }}</span>
                    <i class="fas fa-chevron-down text-[10px] transition-transform"
                      :class="{ 'rotate-180': showSortDropdown }"></i>
                  </button>

                  <!-- Sort Dropdown -->
                  <transition enter-active-class="transition ease-out duration-200"
                    enter-from-class="opacity-0 translate-y-2 scale-95"
                    enter-to-class="opacity-100 translate-y-0 scale-100"
                    leave-active-class="transition ease-in duration-150"
                    leave-from-class="opacity-100 translate-y-0 scale-100"
                    leave-to-class="opacity-0 translate-y-2 scale-95">
                    <div v-if="showSortDropdown"
                      class="absolute right-0 mt-2 w-[220px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                      @click.stop>
                      <div class="p-2">
                        <div class="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100 mb-1">
                          Sắp xếp theo
                        </div>
                        <div class="space-y-0.5">
                          <button v-for="option in sortOptions" :key="option.value"
                            @click="handleSortChange(option.value)"
                            class="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                            :class="{ 'bg-blue-50 text-blue-600 font-semibold': currentSort === option.value, 'text-gray-700': currentSort !== option.value }">
                            <i :class="`fas ${option.icon} text-xs`"></i>
                            <span>{{ option.label }}</span>
                            <i v-if="currentSort === option.value"
                              class="fas fa-check text-blue-500 ml-auto text-xs"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>

          <div v-if="loading" class="flex justify-center py-16 md:py-20 px-4 sm:px-0">
            <AppLoader />
          </div>
          <div v-else-if="profiles.length === 0"
            class="bg-white rounded-none sm:rounded-2xl p-6 md:p-10 lg:p-12 flex flex-col items-center overflow-hidden shadow-sm border-0 sm:border border-gray-100 mx-0 sm:mx-0">
            <div
              class="relative w-full max-w-sm md:max-w-md mx-auto mb-6 md:mb-8 overflow-hidden rounded-xl transform transition-transform duration-500 hover:scale-[1.02]">
              <img src="@/assets/images/no_profile.jpg" alt="Không có hồ sơ"
                class="w-full h-auto object-cover rounded-xl" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
            </div>
            <div class="text-center space-y-3">
              <h3 class="text-lg md:text-xl font-semibold text-gray-800 flex items-center justify-center">
                <i class="fas fa-info-circle text-blue-400 mr-2"></i>
                Không tìm thấy hồ sơ nào
              </h3>
              <p class="text-gray-600 max-w-md mx-auto text-sm md:text-base leading-relaxed">
                Không có hồ sơ nào khớp với tiêu chí tìm kiếm của bạn. Vui lòng thử lại với các bộ lọc khác nhau.
              </p>
            </div>
          </div>
          <div v-else class="space-y-6 px-4 sm:px-0">
            <ProfileList :profiles="profiles" />
            <!-- Thêm phân trang -->
            <div class="pt-4">
              <AppPagination :current-page="currentPage" :total-pages="totalPages" @page-change="changePage" />
              <div class="text-center text-xs md:text-sm text-gray-500 mt-4">
                Hiển thị {{ profiles.length }} hồ sơ trong tổng số {{ totalProfiles }} hồ sơ
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ProfileList from '@/components/home/ProfileList.vue'
import AppLoader from '@/components/common/AppLoader.vue'
import AppHeader from '@/components/common/AppHeader.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import slide1 from '@/assets/images/slide_1.jpg'
import slide2 from '@/assets/images/slide_2.jpg'
import slide3 from '@/assets/images/slide_3.jpg'
import slide4 from '@/assets/images/slide_4.jpg'
import slide5 from '@/assets/images/slide_5.jpg'
import profileService from '@/services/profileService'
import cacheService from '@/services/cacheService'

export default {
  name: 'HomeView',
  components: {
    AppHeader,
    ProfileList,
    AppLoader,
    AppPagination
  },
  setup() {
    // Trạng thái mở rộng của bộ lọc
    const showAdvancedSearch = ref(false)
    // Trạng thái modal filter trên mobile
    const showFilterModal = ref(false)
    // Trạng thái dropdown filter trên desktop
    const showFilterDropdown = ref(false)
    const filterDropdownRef = ref(null)
    // Trạng thái dropdown sort trên desktop
    const showSortDropdown = ref(false)
    const sortDropdownRef = ref(null)

    // Cấu hình các filter hiện tại
    const filters = ref({
      full_name: '',           // thay thế name -> full_name
      born_year: '',           // thay thế bornYear -> born_year
      losing_year: '',         // thay thế losingYear -> losing_year
      name_of_father: '',      // Thêm mới
      name_of_mother: '',      // Thêm mới
      siblings: '',            // Thêm mới
      status: 'active'         // Thêm trạng thái mặc định
    })

    // Cấu hình sắp xếp
    const sortOptions = [
      { value: '-created_at', label: 'Mới nhất', icon: 'fa-clock' },
      { value: 'created_at', label: 'Cũ nhất', icon: 'fa-history' },
      { value: '-updated_at', label: 'Mới cập nhật', icon: 'fa-sync-alt' },
      { value: 'updated_at', label: 'Cũ cập nhật', icon: 'fa-calendar' },
      { value: '-match_count', label: 'Nhiều liên quan nhất', icon: 'fa-link' },
      { value: 'match_count', label: 'Ít liên quan nhất', icon: 'fa-unlink' }
    ]
    const currentSort = ref('-created_at') // Mặc định: mới nhất

    const profiles = ref([])
    const loading = ref(false)
    const currentPage = ref(1)
    const totalPages = ref(1)
    const totalProfiles = ref(0)
    const pageSize = 30 // Phù hợp với server pagination mặc định

    const currentYear = new Date().getFullYear()
    const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i)

    const slides = [
      {
        id: 1,
        image: slide1,
        alt: 'Tìm kiếm người thân',
        title: 'Như chưa hề có cuộc chia ly',
        description: '"Mỗi manh mối, mỗi hành động đều là một bước gần hơn để đoàn tụ. Hãy cùng chúng tôi thắp sáng hy vọng."'
      },
      {
        id: 2,
        image: slide2,
        alt: 'Kết nối gia đình',
        title: 'Nối Lại Những Yêu Thương Dang Dở',
        description: '"Hàng ngàn trái tim đã tìm thấy nhau nhờ tình người và lòng kiên trì. Bạn sẽ là mảnh ghép tiếp theo?"'
      },
      {
        id: 3,
        image: slide3,
        alt: 'Hành trình đoàn tụ',
        title: 'Hành Trình Tái Hợp Những Giấc Mơ',
        description: '"Mỗi câu chuyện đoàn tụ là một minh chứng cho sức mạnh của cộng đồng. Hãy cùng viết tiếp những chương mới."'
      },
      {
        id: 4,
        image: slide4,
        alt: 'Hy vọng đoàn tụ',
        title: 'Giữ Lửa Hy Vọng Cho Mọi Gia Đình',
        description: '"Dù thời gian có trôi qua, chúng tôi tin rằng yêu thương luôn tìm được đường về. Bắt đầu hành trình ngay hôm nay."'
      },
      {
        id: 5,
        image: slide5,
        alt: 'Cộng đồng đoàn tụ',
        title: 'Cùng Nhau, Chúng Ta Tái Hợp Gia Đình',
        description: '"Một chia sẻ, một thông tin nhỏ có thể thay đổi cả một cuộc đời. Hãy là ngọn đuốc soi sáng cho ai đó."'
      }
    ];

    const currentSlide = ref(0)
    let slideInterval = null

    const nextSlide = () => {
      currentSlide.value = (currentSlide.value + 1) % slides.length
    }

    const prevSlide = () => {
      currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
    }

    // Toggle hiển thị phần tìm kiếm nâng cao
    const toggleAdvancedSearch = () => {
      showAdvancedSearch.value = !showAdvancedSearch.value
    }

    // Làm mới lại các filter
    const resetFilters = () => {
      filters.value = {
        full_name: '',
        born_year: '',
        losing_year: '',
        name_of_father: '',
        name_of_mother: '',
        siblings: '',
        status: 'active'
      }
    }

    // Combined fetchProfiles function với hỗ trợ phân trang và lọc
    const fetchProfiles = async (page = 1) => {
      loading.value = true
      try {
        // Build params object cho service
        const params = {
          page: page,
          page_size: pageSize,
          ordering: currentSort.value // Thêm ordering parameter
        }

        // Thêm các filter nếu chúng tồn tại
        if (filters.value.full_name) params.full_name = filters.value.full_name
        if (filters.value.born_year) params.born_year = filters.value.born_year
        if (filters.value.losing_year) params.losing_year = filters.value.losing_year
        if (filters.value.name_of_father) params.name_of_father = filters.value.name_of_father
        if (filters.value.name_of_mother) params.name_of_mother = filters.value.name_of_mother
        if (filters.value.siblings) params.siblings = filters.value.siblings

        // Chỉ thêm status nếu không phải là 'all'
        if (filters.value.status !== 'all') {
          params.status = filters.value.status
        }

        const response = await profileService.getProfiles(params)

        // Xử lý pagination response: { count, next, previous, results } hoặc array (backward compatibility)
        if (Array.isArray(response.data)) {
          // Format cũ: response.data là array trực tiếp
          profiles.value = response.data
          totalProfiles.value = response.data.length
          totalPages.value = 1
        } else {
          // Format mới: response.data là object pagination
          profiles.value = response.data.results || []
          totalProfiles.value = response.data.count || 0
          // Tính totalPages dựa trên count và pageSize từ params
          const currentPageSize = params.page_size || pageSize
          totalPages.value = Math.ceil(totalProfiles.value / currentPageSize)
        }
        currentPage.value = page
      } catch (error) {
        console.error('Failed to fetch profiles:', error)
        profiles.value = []
      } finally {
        loading.value = false
      }
    }

    const changePage = (page) => {
      fetchProfiles(page)
      // Scroll lên đầu danh sách
      const container = document.querySelector('section.container')
      if (container) {
        window.scrollTo({
          top: container.offsetTop - 100,
          behavior: 'smooth'
        })
      }
    }

    const handleFilter = () => {
      // Xóa cache khi filter thay đổi để đảm bảo dữ liệu mới nhất
      cacheService.clearAllCache()
      fetchProfiles(1) // Reset về trang đầu tiên khi lọc
      showFilterModal.value = false // Đóng modal trên mobile
      showFilterDropdown.value = false // Đóng dropdown trên desktop
    }

    // Xử lý thay đổi sắp xếp
    const handleSortChange = (sortValue) => {
      currentSort.value = sortValue
      showSortDropdown.value = false
      // Xóa cache và fetch lại với ordering mới
      cacheService.clearAllCache()
      fetchProfiles(1) // Reset về trang đầu tiên
    }

    // Lấy label của sort option hiện tại
    const getCurrentSortLabel = () => {
      const option = sortOptions.find(opt => opt.value === currentSort.value)
      return option ? option.label : 'Mới nhất'
    }


    // Đóng dropdown khi click outside
    const handleClickOutside = (event) => {
      if (filterDropdownRef.value && !filterDropdownRef.value.contains(event.target)) {
        showFilterDropdown.value = false
      }
      if (sortDropdownRef.value && !sortDropdownRef.value.contains(event.target)) {
        showSortDropdown.value = false
      }
    }


    onMounted(() => {
      fetchProfiles()
      slideInterval = setInterval(nextSlide, 7000)
      document.addEventListener('click', handleClickOutside)
    })

    onBeforeUnmount(() => {
      if (slideInterval) clearInterval(slideInterval)
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      profiles,
      loading,
      filters,
      yearOptions,
      showAdvancedSearch,
      showFilterModal,
      showFilterDropdown,
      filterDropdownRef,
      showSortDropdown,
      sortDropdownRef,
      sortOptions,
      currentSort,
      toggleAdvancedSearch,
      handleFilter,
      resetFilters,
      handleSortChange,
      getCurrentSortLabel,
      slides,
      currentSlide,
      nextSlide,
      prevSlide,
      currentPage,
      totalPages,
      totalProfiles,
      changePage
    }
  }
}
</script>

<style scoped>
/* Smooth fade transitions for carousel */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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

/* Smooth transitions for all interactive elements */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom scrollbar for better aesthetics */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
  transition: background 0.2s;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
