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
              <!-- Reduce overlay opacity from 40% to 20% -->
              <div class="absolute"></div>
              <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <h1 class="text-4xl md:text-5xl font-bold mb-4 text-white animate-fadeIn">
                  {{ slide.title }}
                </h1>
                <p class="text-lg md:text-xl text-white mb-8 max-w-2xl animate-slideUp">
                  {{ slide.description }}
                </p>
                <router-link to="/profile/create"
                  class="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105 animate-pulse">
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

      <!-- Advanced Search Section - Redesigned -->
      <section class="container mx-auto px-4 -mt-10 relative z-10">
        <div class="bg-white rounded-xl shadow-xl p-8 mb-12 transform transition hover:shadow-2xl">
          <h2 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Tìm kiếm nâng cao</h2>
          <form class="grid grid-cols-1 md:grid-cols-3 gap-6" @submit.prevent="handleFilter">
            <div class="space-y-2">
              <label for="name" class="block text-sm font-medium text-gray-700">Tên người thất lạc</label>
              <input id="name" v-model="filters.name" type="text"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="Nhập tên người thất lạc..." />
            </div>

            <div class="space-y-2">
              <label for="losingYear" class="block text-sm font-medium text-gray-700">Năm thất lạc</label>
              <select id="losingYear" v-model="filters.losingYear"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
                <option value="">Tất cả các năm</option>
                <option v-for="year in yearOptions" :key="`losing-${year}`" :value="year">{{ year }}</option>
              </select>
            </div>

            <div class="space-y-2">
              <label for="bornYear" class="block text-sm font-medium text-gray-700">Năm sinh</label>
              <select id="bornYear" v-model="filters.bornYear"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
                <option value="">Tất cả các năm</option>
                <option v-for="year in yearOptions" :key="`born-${year}`" :value="year">{{ year }}</option>
              </select>
            </div>

            <div class="md:col-span-3 flex justify-end mt-4">
              <button type="submit"
                class="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg shadow transition transform hover:scale-105">
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- Profile List Section - Enhanced -->
      <section class="container mx-auto px-4 mb-16">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-bold text-gray-800">Hồ sơ tìm kiếm gần đây</h2>
          <router-link to="/search" class="text-purple-600 hover:text-purple-800 font-medium">
            Xem tất cả →
          </router-link>
        </div>

        <div v-if="loading" class="flex justify-center py-12">
          <AppLoader />
        </div>
        <div v-else-if="profiles.length === 0" class="bg-white rounded-lg p-8 text-center shadow-md">
          <p class="text-gray-600 mb-4">Chưa có hồ sơ tìm kiếm nào.</p>
          <router-link to="/profile/create"
            class="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition">
            Tạo hồ sơ tìm kiếm đầu tiên
          </router-link>
        </div>
        <ProfileList v-else :profiles="profiles" />
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ProfileList from '../components/home/ProfileList.vue'
import AppLoader from '../components/common/AppLoader.vue'
import AppHeader from '../components/common/AppHeader.vue'
import slide1 from '@/assets/images/slide_1.jpg'
import slide2 from '@/assets/images/slide_2.jpg'
import profileService from '../services/profileService'

export default {
  name: 'HomeView',
  components: {
    AppHeader,
    ProfileList,
    AppLoader
  },
  setup() {
    const filters = ref({
      name: '',
      losingYear: '',
      bornYear: ''
    })

    const profiles = ref([])
    const loading = ref(false)

    const currentYear = new Date().getFullYear()
    const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i)

    const slides = [
      {
        id: 1,
        image: slide1,
        alt: 'Tìm kiếm người thân',
        title: 'Tìm Kiếm Người Thân Thất Lạc',
        description: 'Cùng chung tay kết nối, mang người thân trở về với gia đình'
      },
      {
        id: 2,
        image: slide2,
        alt: 'Kết nối gia đình',
        title: 'Kết Nối Những Mảnh Đời Thất Lạc',
        description: 'Hàng ngàn gia đình đã đoàn tụ nhờ sự hỗ trợ của cộng đồng'
      }
    ]

    const currentSlide = ref(0)
    let slideInterval = null

    const nextSlide = () => {
      currentSlide.value = (currentSlide.value + 1) % slides.length
    }

    const prevSlide = () => {
      currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
    }

    onMounted(() => {
      fetchProfiles()
      slideInterval = setInterval(nextSlide, 5000)
    })

    onBeforeUnmount(() => {
      if (slideInterval) clearInterval(slideInterval)
    })

    const fetchProfiles = async () => {
      loading.value = true
      try {
        // Build params object for service
        const params = {
          page: 1,
        }
        if (filters.value.name) params.name = filters.value.name
        if (filters.value.losingYear) params.losing_year = filters.value.losingYear
        if (filters.value.bornYear) params.born_year = filters.value.bornYear

        const data = await profileService.getProfiles(params)
        profiles.value = data.results || []
      } catch (error) {
        console.error('Failed to fetch profiles:', error)
        profiles.value = []
      } finally {
        loading.value = false
      }
    }

    const handleFilter = () => {
      fetchProfiles()
    }

    return {
      profiles,
      loading,
      filters,
      yearOptions,
      handleFilter,
      slides,
      currentSlide,
      nextSlide,
      prevSlide
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
