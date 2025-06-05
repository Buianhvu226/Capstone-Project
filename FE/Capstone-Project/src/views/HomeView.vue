<template>
  <div class="pt-16"> <!-- Thêm padding-top để tránh bị che bởi header cố định -->
    <AppHeader />

    <div class="flex flex-col justify-center gap-[5rem]">
      <!-- Hero Section với Slider -->
      <section class="relative h-[75vh] overflow-hidden">
        <!-- Carousel slides -->
        <div class="relative h-full w-full">
          <transition-group name="fade" tag="div" class="h-full">
            <div v-for="(slide, index) in slides" :key="slide.id" v-show="currentSlide === index"
              class="absolute inset-0 w-full h-full transition-opacity duration-1000">
              <img :src="slide.image" :alt="slide.alt" class="w-full h-full object-cover" />
              <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <h1 class="text-4xl md:text-5xl font-bold mb-4 text-white animate-fadeIn">
                  {{ slide.title }}
                </h1>
                <p class="text-lg md:text-xl text-white mb-8 max-w-2xl animate-slideUp italic">
                  {{ slide.description }}
                </p>
                <router-link to="/profile/create"
                  class="bg-blue-400 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105 animate-pulse">
                  Đăng tin tìm kiếm ngay
                </router-link>
              </div>
            </div>
          </transition-group>
        </div>

        <!-- Slide indicators -->
        <div class="absolute bottom-5 left-0 right-0 flex justify-center space-x-2">
          <button v-for="(slide, index) in slides" :key="`dot-${slide.id}`" @click="currentSlide = index"
            class="w-3 h-3 rounded-full transition-all duration-300"
            :class="currentSlide === index ? 'bg-white scale-125' : 'bg-white bg-opacity-50'">
          </button>
        </div>
      </section>

      <!-- Advanced Search Section - Enhanced -->
      <section class="container mx-auto px-4 -mt-10 relative z-10">
        <div
          class="bg-white rounded-xl shadow-xl p-6 md:p-8 mb-12 transform transition hover:shadow-2xl border-t-4 border-blue-400">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <div class="bg-blue-100 rounded-full p-2 mr-3">
                <i class="fas fa-filter text-blue-400 text-lg"></i>
              </div>
              <h2 class="text-2xl font-bold text-gray-800">Bộ lọc tìm kiếm</h2>
            </div>
            <button @click="toggleAdvancedSearch"
              class="text-blue-400 hover:text-blue-800 text-sm font-medium flex items-center">
              {{ showAdvancedSearch ? 'Thu gọn' : 'Mở rộng' }}
              <i :class="showAdvancedSearch ? 'fas fa-chevron-up ml-1' : 'fas fa-chevron-down ml-1'"></i>
            </button>
          </div>

          <form @submit.prevent="handleFilter" class="space-y-6">
            <!-- Hàng 1: Thông tin cơ bản -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="space-y-2">
                <label for="fullName" class="block text-sm font-medium text-gray-700 flex items-center">
                  <i class="fas fa-user text-blue-500 mr-1.5"></i> Họ tên người thất lạc
                </label>
                <div class="relative">
                  <input id="fullName" v-model="filters.full_name" type="text"
                    class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition pl-10"
                    placeholder="Nhập tên người thất lạc..." />
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-search text-gray-400"></i>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <label for="bornYear" class="block text-sm font-medium text-gray-700 flex items-center">
                  <i class="fas fa-birthday-cake text-blue-500 mr-1.5"></i> Năm sinh
                </label>
                <select id="bornYear" v-model="filters.born_year"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                  <option value="">Tất cả các năm</option>
                  <option v-for="year in yearOptions" :key="`born-${year}`" :value="year">{{ year }}</option>
                </select>
              </div>

              <div class="space-y-2">
                <label for="losingYear" class="block text-sm font-medium text-gray-700 flex items-center">
                  <i class="fas fa-calendar-minus text-blue-500 mr-1.5"></i> Năm thất lạc
                </label>
                <select id="losingYear" v-model="filters.losing_year"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                  <option value="">Tất cả các năm</option>
                  <option v-for="year in yearOptions" :key="`losing-${year}`" :value="year">{{ year }}</option>
                </select>
              </div>
            </div>

            <!-- Hàng 2: Thông tin gia đình (hiển thị khi mở rộng) -->
            <div v-show="showAdvancedSearch"
              class="grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-6 border-gray-100">
              <div class="space-y-2">
                <label for="fatherName" class="block text-sm font-medium text-gray-700 flex items-center">
                  <i class="fas fa-male text-blue-500 mr-1.5"></i> Tên cha
                </label>
                <input id="fatherName" v-model="filters.name_of_father" type="text"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Nhập tên cha..." />
              </div>

              <div class="space-y-2">
                <label for="motherName" class="block text-sm font-medium text-gray-700 flex items-center">
                  <i class="fas fa-female text-blue-500 mr-1.5"></i> Tên mẹ
                </label>
                <input id="motherName" v-model="filters.name_of_mother" type="text"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Nhập tên mẹ..." />
              </div>

              <div class="space-y-2">
                <label for="siblings" class="block text-sm font-medium text-gray-700 flex items-center">
                  <i class="fas fa-users text-blue-500 mr-1.5"></i> Tên anh chị em
                </label>
                <input id="siblings" v-model="filters.siblings" type="text"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Nhập tên anh chị em..." />
              </div>
            </div>

            <!-- Hàng 3: Trạng thái và nút tìm kiếm -->
            <div class="flex flex-col md:flex-row justify-between items-center border-t pt-6 border-gray-100">
              <div class="mb-4 md:mb-0 w-full md:w-auto">
                <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <i class="fas fa-flag text-blue-500 mr-1.5"></i> Trạng thái hồ sơ
                </label>
                <div class="flex space-x-4">
                  <label class="inline-flex items-center">
                    <input type="radio" v-model="filters.status" value="active"
                      class="text-blue-400 focus:ring-blue-500 h-4 w-4" />
                    <span class="ml-2 text-sm text-gray-700">Đang tìm kiếm</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="radio" v-model="filters.status" value="all"
                      class="text-blue-400 focus:ring-blue-500 h-4 w-4" />
                    <span class="ml-2 text-sm text-gray-700">Tất cả</span>
                  </label>
                </div>
              </div>

              <div class="flex space-x-3 w-full md:w-auto">
                <button type="button" @click="resetFilters"
                  class="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition flex items-center justify-center flex-1 md:flex-none">
                  <i class="fas fa-redo-alt mr-2"></i> Đặt lại
                </button>
                <button type="submit"
                  class="px-8 py-3 bg-gradient-to-r from-blue-400 to-blue-700 text-white font-semibold rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 flex items-center justify-center flex-1 md:flex-none">
                  <i class="fas fa-search mr-2"></i> Tìm kiếm
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <!-- Profile List Section - Enhanced -->
      <section class="container mx-auto px-4 mb-16">
        <div class="flex justify-between items-center mb-8">
          <div class="flex items-center space-x-3">
            <div class="bg-blue-100 p-2.5 rounded-full shadow-sm">
              <i class="fas fa-user-circle text-blue-400 text-xl"></i>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-800 flex items-center">
                Danh sách các hồ sơ
                <span
                  class="inline-flex ml-3 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ totalProfiles }} hồ sơ
                </span>
              </h2>
              <p class="text-gray-500 text-sm mt-0.5">Các hồ sơ đang tìm kiếm người thân thất lạc</p>
            </div>
          </div>
          <div class="hidden md:flex items-center space-x-2 text-sm text-blue-400">
            <button class="hover:text-blue-800 transition-colors flex items-center p-1.5">
              <i class="fas fa-sort-amount-down mr-1.5"></i> Mới nhất
              <i class="fas fa-chevron-down ml-1 text-xs"></i>
            </button>

          </div>
        </div>

        <div v-if="loading" class="flex justify-center py-12">
          <AppLoader />
        </div>
        <div v-else-if="profiles.length === 0"
          class="bg-white rounded-xl p-8 flex flex-col items-center overflow-hidden animate-fadeIn">
          <div
            class="relative w-full max-w-md mx-auto mb-6 overflow-hidden rounded-lg transform hover:scale-102 transition duration-500">
            <img src="@/assets/images/no_profile.jpg" alt="Không có hồ sơ"
              class="w-full h-auto object-cover rounded-lg" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
          <div class="text-center animate-slideUp">
            <div class="flex justify-center mb-4">
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center justify-center">
              <i class="fas fa-info-circle text-blue-500 mr-2"></i>
              Không tìm thấy hồ sơ nào
            </h3>
            <p class="text-gray-600 max-w-md flex items-center justify-center text-center">
              <span>Không có hồ sơ nào khớp với tiêu chí tìm kiếm của bạn. Vui lòng thử lại với các bộ lọc khác
                nhau.</span>
            </p>
          </div>
        </div>
        <div v-else>
          <ProfileList :profiles="profiles" />
          <!-- Thêm phân trang -->
          <AppPagination :current-page="currentPage" :total-pages="totalPages" @page-change="changePage" />
          <div class="text-center text-sm text-gray-600 mt-2">
            Hiển thị {{ profiles.length }} hồ sơ trong tổng số {{ totalProfiles }} hồ sơ
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ProfileList from '../components/home/ProfileList.vue'
import AppLoader from '../components/common/AppLoader.vue'
import AppHeader from '../components/common/AppHeader.vue'
import AppPagination from '../components/common/AppPagination.vue'
import slide1 from '@/assets/images/slide_1.jpg'
import slide2 from '@/assets/images/slide_2.jpg'
import slide3 from '@/assets/images/slide_3.jpg'
import slide4 from '@/assets/images/slide_4.jpg'
import slide5 from '@/assets/images/slide_5.jpg'
import profileService from '../services/profileService'

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

    const profiles = ref([])
    const loading = ref(false)
    const currentPage = ref(1)
    const totalPages = ref(1)
    const totalProfiles = ref(0)
    const pageSize = 10

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
          page_size: pageSize
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
        profiles.value = response.data.results || []
        totalProfiles.value = response.data.count || 0
        totalPages.value = Math.ceil(totalProfiles.value / pageSize)
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
      fetchProfiles(1) // Reset về trang đầu tiên khi lọc
    }

    onMounted(() => {
      fetchProfiles()
      slideInterval = setInterval(nextSlide, 5000)
    })

    onBeforeUnmount(() => {
      if (slideInterval) clearInterval(slideInterval)
    })

    return {
      profiles,
      loading,
      filters,
      yearOptions,
      showAdvancedSearch,
      toggleAdvancedSearch,
      handleFilter,
      resetFilters,
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 1.5s ease-out;
}

.animate-slideUp {
  animation: slideUp 1.5s ease-out;
}
</style>
