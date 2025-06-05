<template>
  <!-- Thêm pt-16 để tránh header che khuất và bg-gradient-to-br để tạo hiệu ứng -->
  <div class="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen pt-16 pb-12">
    <!-- Hero section với hiệu ứng hover -->
    <div class="container mx-auto px-4 py-6">
      <div
        class="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl p-6 mb-8 border border-blue-100">
        <div class="flex flex-col md:flex-row items-start md:items-center">
          <div class="flex-shrink-0 bg-blue-400 rounded-full p-3 mr-5 mb-4 md:mb-0 shadow-md">
            <i class="fas fa-user-friends text-white text-2xl"></i>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2 flex items-center">
              Đăng ký hồ sơ tìm kiếm
              <span class="animate-pulse inline-flex ml-3 h-3 w-3 rounded-full bg-blue-500"></span>
            </h1>
            <p class="text-gray-600">Hãy cung cấp thông tin chi tiết để tăng khả năng tìm kiếm người thân của bạn.</p>
          </div>
        </div>
      </div>

      <!-- Tab Selection - với hiệu ứng transition -->
      <div v-if="step === 1" class="mb-6">
        <div class="bg-white rounded-lg shadow-md p-2 flex border border-gray-100">
          <button @click="activeTab = 'manual'" :class="[
            'flex-1 py-3 px-6 font-medium text-sm rounded-md transition-all duration-300 ease-in-out flex items-center justify-center',
            activeTab === 'manual'
              ? 'bg-blue-400 text-white shadow-md transform scale-105'
              : 'bg-transparent text-gray-600 hover:bg-gray-100'
          ]">
            <i class="fas fa-list-ul mr-2"></i>
            Nhập từng trường thông tin
          </button>
          <button @click="activeTab = 'auto'" :class="[
            'flex-1 py-3 px-6 font-medium text-sm rounded-md transition-all duration-300 ease-in-out flex items-center justify-center',
            activeTab === 'auto'
              ? 'bg-indigo-600 text-white shadow-md transform scale-105'
              : 'bg-transparent text-gray-600 hover:bg-gray-100'
          ]">
            <i class="fas fa-magic mr-2"></i>
            Tạo hồ sơ với mô tả
          </button>
        </div>
      </div>

      <!-- Breadcrumb / Progress indicator - với hiệu ứng -->
      <div class="mb-8">
        <div class="relative">
          <!-- Progress bar background -->
          <div class="absolute top-1/2 transform -translate-y-1/2 h-1 bg-gray-200 w-full"></div>

          <!-- Active progress bar -->
          <div class="absolute top-1/2 transform -translate-y-1/2 h-1 bg-blue-500"
            :style="{ width: (step - 1) * 50 + '%' }" :class="{ 'transition-all duration-500 ease-in-out': true }">
          </div>

          <!-- Steps -->
          <div class="relative flex justify-between">
            <!-- Step 1 -->
            <div class="flex flex-col items-center">
              <div :class="[
                'flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ease-in-out',
                step >= 1
                  ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md'
                  : 'bg-gray-200 text-gray-500'
              ]">
                <i class="fas fa-keyboard"></i>
              </div>
              <span class="mt-2 font-medium text-sm" :class="step >= 1 ? 'text-blue-400' : 'text-gray-500'">Nhập thông
                tin</span>
            </div>

            <!-- Step 2 -->
            <div class="flex flex-col items-center">
              <div :class="[
                'flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ease-in-out',
                step >= 2
                  ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md transform scale-110'
                  : 'bg-gray-200 text-gray-500'
              ]">
                <i class="fas fa-edit"></i>
              </div>
              <span class="mt-2 font-medium text-sm" :class="step >= 2 ? 'text-blue-400' : 'text-gray-500'">Xem lại &
                chỉnh sửa</span>
            </div>

            <!-- Step 3 -->
            <div class="flex flex-col items-center">
              <div :class="[
                'flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ease-in-out',
                step >= 3
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md transform scale-110'
                  : 'bg-gray-200 text-gray-500'
              ]">
                <i class="fas fa-check"></i>
              </div>
              <span class="mt-2 font-medium text-sm" :class="step >= 3 ? 'text-green-600' : 'text-gray-500'">Hoàn
                thành</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Manual Entry Form - Step 1 -->
      <div v-if="step === 1 && activeTab === 'manual'"
        class="bg-white rounded-xl shadow-lg p-6 border border-blue-100 transition-all duration-500 transform">
        <div v-if="showAutoSuggestion"
          class="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 mb-5 rounded-r-lg animate__animated animate__fadeIn">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-lightbulb text-yellow-500 text-lg"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-blue-700">
                <span class="font-medium">Mẹo:</span> Bạn có thể tạo hồ sơ nhanh chóng bằng cách chỉ nhập một mô tả chi
                tiết!
              </p>
              <div class="mt-2 flex">
                <button @click="activeTab = 'auto'; showAutoSuggestion = false"
                  class="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-200 cursor-pointer transition-colors flex items-center">
                  <i class="fas fa-bolt mr-1"></i> Tạo với mô tả
                </button>
                <button @click="showAutoSuggestion = false"
                  class="ml-2 text-red-500 px-3 py-1 rounded-md text-sm hover:underline cursor-pointer flex items-center">
                  <i class="fas fa-times-circle mr-1"></i> Tắt gợi ý
                </button>
              </div>
            </div>
          </div>
        </div>

        <ProfileForm :loading="loading" :error="error" :initialData="profileData" submitButtonText="Tiếp tục để xem lại"
          @submit="handleManualSubmit" />
      </div>

      <!-- Preview & Confirm - Step 2 - với hiệu ứng fade in -->
      <div v-if="step === 2"
        class="bg-white rounded-xl shadow-lg p-6 border border-blue-100 transition-all duration-500 transform">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 mb-5 rounded-r-lg">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-info-circle text-blue-500 text-lg"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-blue-700">
                <span class="font-medium">Vui lòng xem lại thông tin:</span> Kiểm tra và chỉnh sửa thông tin trước khi
                hoàn tất đăng hồ sơ.
              </p>
            </div>
          </div>
        </div>

        <ProfileForm :loading="loading" :error="error" :initialData="profileData" submitButtonText="Hoàn tất đăng hồ sơ"
          @submit="handleFinalSubmit" />

        <div class="flex justify-between mt-6 pt-4 border-t border-gray-200">
          <button @click="step = 1"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center shadow-sm hover:shadow">
            <i class="fas fa-arrow-left mr-2"></i> Quay lại chỉnh sửa
          </button>
          <button @click="cancelProfile"
            class="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex items-center shadow-sm hover:shadow">
            <i class="fas fa-times mr-2"></i> Hủy tạo hồ sơ
          </button>
        </div>
      </div>

      <!-- AI Description Form - Step 1 - với hiệu ứng fade in -->
      <div v-if="step === 1 && activeTab === 'auto'"
        class="bg-white rounded-xl shadow-lg p-6 border border-indigo-100 transition-all duration-500 transform">
        <div class="flex items-center mb-4">
          <div class="bg-indigo-100 p-2 rounded-lg mr-3">
            <i class="fas fa-robot text-indigo-600 text-xl"></i>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-800">Nhập mô tả chi tiết về trường hợp thất lạc</h2>
            <p class="text-gray-500 text-sm">Công nghệ AI sẽ phân tích và tạo hồ sơ tự động cho bạn</p>
          </div>
        </div>

        <p class="text-gray-600 mb-6 bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-300">
          Hãy cung cấp càng nhiều thông tin càng tốt, bao gồm tên người thất lạc, năm sinh,
          năm thất lạc, tên cha mẹ, anh chị em, địa điểm thất lạc và các chi tiết khác.
        </p>

        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Tiêu đề hồ sơ <span
              class="text-red-500">*</span></label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-heading text-indigo-400"></i>
            </div>
            <input type="text" id="title" v-model="autoProfileData.title"
              class="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="VD: Nguyễn Văn A tìm mẹ Trần Thị B" required />
          </div>
          <p class="mt-1 text-xs text-gray-500">Tiêu đề nên bao gồm tên người tìm kiếm và tên người thất lạc</p>
        </div>

        <div class="mb-6">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết <span
              class="text-red-500">*</span></label>
          <textarea id="description" v-model="autoProfileData.description" rows="10"
            class="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            placeholder="Hãy cung cấp càng nhiều thông tin càng tốt về người thất lạc..." required></textarea>
          <p class="mt-1 text-xs text-gray-500 flex items-center">
            <i class="fas fa-info-circle mr-1 text-indigo-400"></i>
            Mô tả càng chi tiết, cơ hội tìm thấy càng cao.
          </p>
        </div>

        <div class="flex justify-end">
          <button @click="handleAutoSubmit"
            :disabled="loading || !autoProfileData.title || !autoProfileData.description"
            class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-400 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 hover:shadow-lg flex items-center">
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-brain mr-2"></i>
            <span>{{ loading ? 'Đang xử lý...' : 'Phân tích mô tả' }}</span>
          </button>
        </div>
      </div>

      <!-- Success Page - Step 3 -->
      <div v-if="step === 3"
        class="bg-white rounded-xl shadow-xl p-8 border border-green-100 transition-all duration-500 transform">
        <div class="text-center">
          <div class="inline-block p-4 bg-green-100 rounded-full mb-6">
            <i class="fas fa-check-circle text-green-500 text-6xl"></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Đăng ký hồ sơ thành công!</h2>
          <p class="text-gray-600 mb-8">Hồ sơ tìm kiếm của bạn đã được đăng thành công và sẵn sàng để chia sẻ.</p>

          <div class="flex justify-center space-x-4">
            <router-link :to="{ name: 'profile-detail', params: { id: createdProfileId } }"
              class="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all transform hover:scale-105 hover:shadow-lg flex items-center">
              <i class="fas fa-eye mr-2"></i> Xem hồ sơ
            </router-link>
            <button @click="resetForm"
              class="px-6 py-3 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all hover:shadow flex items-center">
              <i class="fas fa-plus mr-2 text-blue-400"></i> Tạo hồ sơ mới
            </button>
          </div>
        </div>

        <!-- Suggested profiles section -->
        <div v-if="suggestedProfiles && suggestedProfiles.length > 0" class="mt-16">
          <h3 class="text-xl font-semibold mb-8 text-center relative">
            <span class="absolute inset-0 flex items-center">
              <span class="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></span>
            </span>
            <span class="relative px-4 bg-white text-gray-700 flex items-center justify-center">
              <i class="fas fa-link mr-2 text-blue-500"></i>
              Hồ sơ liên quan có thể bạn quan tâm
            </span>
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="profile in suggestedProfiles" :key="profile.id"
              class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div class="h-48 bg-gray-100 relative">
                <img v-if="profile.images && profile.images.length" :src="profile.images[0]" :alt="profile.title"
                  class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="absolute top-2 right-2">
                  <span class="px-3 py-1 text-xs font-bold rounded-full shadow-sm" :class="{
                    'bg-green-100 text-green-800': profile.status === 'active',
                    'bg-blue-100 text-blue-800': profile.status === 'found',
                    'bg-gray-100 text-gray-800': profile.status === 'closed'
                  }">
                    {{ getStatusText(profile.status) }}
                  </span>
                </div>
              </div>
              <div class="p-5">
                <h4 class="font-semibold text-blue-700 text-lg line-clamp-2 mb-2 hover:text-blue-800 transition-colors">
                  {{ profile.title }}</h4>
                <p class="text-gray-600 line-clamp-3 mb-4 text-sm">{{ profile.description }}</p>
                <div class="flex justify-between items-center">
                  <span class="text-xs text-gray-500">
                    <i class="far fa-calendar-alt mr-1"></i>
                    {{ formatDate(profile.created_at || new Date()) }}
                  </span>
                  <router-link :to="{ name: 'profile-detail', params: { id: profile.id } }"
                    class="text-sm font-medium text-blue-400 hover:text-blue-800 transition-colors flex items-center group">
                    Xem chi tiết
                    <i class="fas fa-arrow-right ml-1 group-hover:translate-x-1 transition-transform duration-300"></i>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Confirm cancel modal - với hiệu ứng fade + scale -->
      <div v-if="showCancelModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate__animated animate__fadeIn">
        <div
          class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate__animated animate__fadeInUp animate__faster">
          <div class="flex items-center text-red-600 mb-4">
            <div class="bg-red-100 p-2 rounded-full mr-3">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-900">Xác nhận hủy</h3>
          </div>
          <p class="text-gray-600 mb-6">Bạn có chắc muốn hủy tạo hồ sơ? Tất cả thông tin đã nhập sẽ bị mất.</p>
          <div class="flex justify-end space-x-4">
            <button @click="showCancelModal = false"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
              <i class="fas fa-arrow-left mr-2"></i> Tiếp tục chỉnh sửa
            </button>
            <button @click="confirmCancel"
              class="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-colors flex items-center">
              <i class="fas fa-trash mr-2"></i> Xác nhận hủy
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Progress indicator cho quá trình xử lý -->
<div v-if="showProgress && loading" ref="progressSection"
        class="bg-white rounded-xl shadow-lg p-6 mb-8 border border-blue-100">
        <div class="flex items-center mb-6">
          <div class="bg-gradient-to-r from-blue-100 to-indigo-100 p-3 rounded-lg mr-4">
            <i class="fas fa-cogs text-blue-400 text-2xl animate-spin"></i>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-gray-800">Đang xử lý hồ sơ</h3>
            <p class="text-sm text-gray-600">AI đang phân tích và tạo hồ sơ cho bạn</p>
          </div>
        </div>

        <!-- Overall Progress bar -->
        <div v-if="totalSteps > 0" class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-gray-700">Tiến độ tổng thể</span>
            <span class="text-sm font-semibold text-blue-400">{{ Math.round((progressStep / totalSteps) * 100)
              }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              class="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 h-3 rounded-full transition-all duration-1000 ease-out"
              :style="{ width: (progressStep / totalSteps) * 100 + '%' }">
              <div class="w-full h-full bg-gradient-to-r from-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>

        <!-- Progress Steps Log -->
        <div class="space-y-3 max-h-80 overflow-y-auto">
          <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <i class="fas fa-list-ul mr-2 text-indigo-500"></i>
            Quá trình xử lý
          </h4>

          <div class="space-y-2">
            <div v-for="(log, index) in progressLogs" :key="index"
              class="flex items-start p-3 rounded-lg transition-all duration-500" :class="[
                index === progressLogs.length - 1
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 transform scale-105'
                  : 'bg-gray-50 border-l-4 border-gray-300'
              ]">

              <!-- Status Icon -->
              <div class="flex-shrink-0 mt-0.5">
                <div class="w-6 h-6 rounded-full flex items-center justify-center" :class="[
                  index === progressLogs.length - 1
                    ? 'bg-blue-500 animate-pulse'
                    : log.completed
                      ? 'bg-green-500'
                      : 'bg-gray-400'
                ]">
                  <i v-if="index === progressLogs.length - 1 && !log.completed"
                    class="fas fa-spinner fa-spin text-white text-xs"></i>
                  <i v-else-if="log.completed" class="fas fa-check text-white text-xs"></i>
                  <i v-else class="fas fa-circle text-white text-xs"></i>
                </div>
              </div>

              <!-- Content -->
              <div class="ml-3 flex-1">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium"
                    :class="index === progressLogs.length - 1 ? 'text-blue-700' : 'text-gray-700'">
                    {{ log.message }}
                  </p>
                  <span class="text-xs text-gray-500">{{ log.timestamp }}</span>
                </div>

                <!-- Sub-progress for current step -->
                <div v-if="index === progressLogs.length - 1 && log.subProgress" class="mt-2">
                  <div class="w-full bg-blue-200 rounded-full h-1">
                    <div class="bg-blue-500 h-1 rounded-full transition-all duration-500"
                      :style="{ width: log.subProgress + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Current Status Message -->
        <div class="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-lg">
          <div class="flex items-center">
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-ping mr-3"></div>
            <p class="text-blue-700 text-sm font-medium flex items-center">
              <i class="fas fa-info-circle mr-2"></i>
              {{ currentProgressMessage }}
            </p>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ProfileForm from '../components/profile/ProfileForm.vue'
import profileService from '../services/profileService'

export default {
  name: 'ProfileCreateView',
  components: {
    ProfileForm
  },
  setup() {
    const store = useStore()
    const router = useRouter()

    const loading = ref(false)
    const error = ref(null)
    const activeTab = ref('manual')
    const step = ref(1)
    const showAutoSuggestion = ref(true)
    const suggestedProfiles = ref([])
    const createdProfileId = ref(null)
    const showCancelModal = ref(false)

    // Thay thế các biến progress hiện tại bằng:
    const showProgress = ref(false)
    const progressLogs = ref([])
    const currentProgressMessage = ref('')
    const progressStep = ref(0)
    const totalSteps = ref(0)
    const progressSection = ref(null)

    // Thêm computed để lấy thông báo progress từ store
    const progressNotifications = computed(() => {
      return store.getters['notifications/profileCreatingNotifications']
    })

    // Form data
    const profileData = ref({
      title: '',
      full_name: '',
      born_year: '',
      losing_year: '',
      name_of_father: '',
      name_of_mother: '',
      siblings: '',
      description: '',
      status: 'active',
      images: []
    })

    const autoProfileData = ref({
      title: '',
      description: '',
      status: 'active',
      images: []
    })

    // Lưu trữ dữ liệu gốc người dùng đã nhập
    const originalUserInput = ref({
      title: '',
      full_name: '',
      born_year: '',
      losing_year: '',
      name_of_father: '',
      name_of_mother: '',
      siblings: '',
      description: '',
    });

    // Thêm hàm helper cho timestamp
    const formatTimestamp = () => {
      return new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    // Hàm thêm log mới
    const addProgressLog = (message, completed = false, subProgress = null) => {
      progressLogs.value.push({
        message,
        completed,
        subProgress,
        timestamp: formatTimestamp()
      })

      // Auto scroll to bottom
      setTimeout(() => {
        if (progressSection.value) {
          const logContainer = progressSection.value.querySelector('.overflow-y-auto')
          if (logContainer) {
            logContainer.scrollTop = logContainer.scrollHeight
          }
        }
      }, 100)
    }

    // Hàm scroll xuống progress section
    const scrollToProgress = () => {
      setTimeout(() => {
        if (progressSection.value) {
          progressSection.value.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }, 300)
    }

    // Handle manual form submission từ Step 1
    const handleManualSubmit = async (data) => {
      try {
        loading.value = true
        error.value = null
        showProgress.value = true
        progressLogs.value = [] // Reset logs
        currentProgressMessage.value = 'Khởi tạo quá trình tạo hồ sơ...'

        addProgressLog('🚀 Bắt đầu tạo hồ sơ mới')
        scrollToProgress()

        // Lưu lại dữ liệu người dùng đã nhập
        originalUserInput.value = { ...data };
        addProgressLog('💾 Đã lưu thông tin người dùng', true)

        // Tạo hồ sơ tạm thời
        currentProgressMessage.value = 'Đang gửi thông tin lên server...'
        addProgressLog('📤 Đang gửi dữ liệu lên server...')

        const response = await profileService.createProfile(data)

        addProgressLog('✅ Tạo hồ sơ thành công', true)
        createdProfileId.value = response.data.id

        // Cập nhật dữ liệu
        currentProgressMessage.value = 'Đang xử lý dữ liệu...'
        addProgressLog('🔄 Đang xử lý và hợp nhất dữ liệu...')

        const mergedData = mergeProfileData(originalUserInput.value, response.data);
        profileData.value = mergedData;

        addProgressLog('🎉 Hoàn tất! Chuyển sang bước xem lại', true)
        currentProgressMessage.value = 'Đã hoàn thành!'

        // Chuyển sang bước xem lại
        setTimeout(() => {
          step.value = 2
          showProgress.value = false
        }, 1000)

      } catch (err) {
        addProgressLog('❌ Lỗi: ' + (err.response?.data?.detail || 'Có lỗi xảy ra'), false)
        console.error('Failed to create profile:', err)
        error.value = err.response?.data?.detail || 'Có lỗi xảy ra khi tạo hồ sơ'
        showProgress.value = false
      } finally {
        loading.value = false
      }
    }

    // Handle auto form submission (Step 1)
    const handleAutoSubmit = async () => {
      try {
        loading.value = true
        error.value = null
        showProgress.value = true
        progressLogs.value = [] // Reset logs
        currentProgressMessage.value = 'Chuẩn bị phân tích mô tả...'

        addProgressLog('🤖 Khởi động AI phân tích mô tả')
        scrollToProgress()

        // Lưu dữ liệu người dùng đã nhập
        originalUserInput.value = {
          title: autoProfileData.value.title,
          description: autoProfileData.value.description,
        };
        addProgressLog('💾 Đã lưu mô tả gốc', true)

        // Call API with description
        currentProgressMessage.value = 'AI đang phân tích nội dung...'
        addProgressLog('🧠 AI đang phân tích và trích xuất thông tin...')

        const response = await profileService.createProfile(autoProfileData.value)

        addProgressLog('🎯 AI đã phân tích xong', true)
        createdProfileId.value = response.data.id

        currentProgressMessage.value = 'Đang tạo hồ sơ từ kết quả phân tích...'
        addProgressLog('📋 Đang tạo hồ sơ từ dữ liệu đã phân tích...')

        // Merge data
        const mergedData = mergeProfileData(originalUserInput.value, response.data);
        profileData.value = {
          id: response.data.id,
          ...mergedData,
          status: 'active',
          images: response.data.images || []
        }

        addProgressLog('✨ Hoàn tất! Hồ sơ đã sẵn sàng để chỉnh sửa', true)
        currentProgressMessage.value = 'AI đã hoàn thành phân tích!'

        // Go to step 2 for editing
        setTimeout(() => {
          step.value = 2
          showProgress.value = false
        }, 1500)

      } catch (err) {
        addProgressLog('❌ Lỗi phân tích: ' + (err.response?.data?.detail || 'Có lỗi xảy ra'), false)
        console.error('Failed to analyze description:', err)
        error.value = err.response?.data?.detail || 'Có lỗi xảy ra khi phân tích mô tả'
        showProgress.value = false
      } finally {
        loading.value = false
      }
    }

    // Hàm trộn dữ liệu - Ưu tiên dữ liệu người dùng đã nhập cho các trường cơ bản,
    // và ưu tiên mô tả từ API response
    const mergeProfileData = (userInput, apiResponse) => {
      // Luôn ưu tiên mô tả từ API (nếu có)
      const description = apiResponse.description || userInput.description;

      return {
        // Ưu tiên dữ liệu người dùng đã nhập cho các trường cơ bản
        title: userInput.title || apiResponse.title || '',
        full_name: userInput.full_name || apiResponse.full_name || '',
        born_year: userInput.born_year || apiResponse.born_year || '',
        losing_year: userInput.losing_year || apiResponse.losing_year || '',
        name_of_father: userInput.name_of_father || apiResponse.name_of_father || '',
        name_of_mother: userInput.name_of_mother || apiResponse.name_of_mother || '',
        siblings: userInput.siblings || apiResponse.siblings || '',

        // Ưu tiên mô tả từ API
        description: description,

        // Các trường khác
        status: apiResponse.status || 'active',
        images: apiResponse.images || [],
        id: apiResponse.id
      };
    };

    // Handle final submission after editing (Step 2)
    const handleFinalSubmit = async (data) => {
      try {
        loading.value = true
        error.value = null
        showProgress.value = true
        currentProgressMessage.value = 'Đang hoàn tất hồ sơ và tìm kiếm...'

        // Ensure we have an ID
        if (!createdProfileId.value) {
          throw new Error('Không tìm thấy ID hồ sơ để cập nhật')
        }

        // Update profile with edited data - add ID to ensure correct endpoint
        data.id = createdProfileId.value
        const response = await profileService.updateProfile(createdProfileId.value, data)

        // Store suggested profiles if any
        if (response.data.suggested_profiles && response.data.suggested_profiles.length > 0) {
          suggestedProfiles.value = response.data.suggested_profiles
        }

        // Go to success screen
        step.value = 3

      } catch (err) {
        console.error('Failed to submit final profile:', err)
        error.value = err.response?.data?.detail || 'Có lỗi xảy ra khi cập nhật hồ sơ'
      } finally {
        loading.value = false
        showProgress.value = false
      }
    }

    // Show cancel confirmation modal
    const cancelProfile = () => {
      showCancelModal.value = true
    }

    // Handle confirmation of cancellation
    const confirmCancel = async () => {
      try {
        // Only attempt to delete if we have an ID
        if (createdProfileId.value) {
          await profileService.deleteProfile(createdProfileId.value)
        }

        // Reset everything
        resetForm()
        showCancelModal.value = false

      } catch (err) {
        console.error('Failed to delete profile:', err)
        error.value = err.response?.data?.detail || 'Có lỗi xảy ra khi xóa hồ sơ'
        showCancelModal.value = false
      }
    }

    // Reset form and go back to beginning
    const resetForm = () => {
      activeTab.value = 'manual'
      step.value = 1
      profileData.value = {
        title: '',
        full_name: '',
        born_year: '',
        losing_year: '',
        name_of_father: '',
        name_of_mother: '',
        siblings: '',
        description: '',
        status: 'active',
        images: []
      }
      autoProfileData.value = {
        title: '',
        description: '',
        status: 'active',
        images: []
      }
      error.value = null
      suggestedProfiles.value = []
      createdProfileId.value = null
      showCancelModal.value = false
    }

    const getStatusText = (status) => {
      const statusMap = {
        'active': 'Đang tìm kiếm',
        'found': 'Đã tìm thấy',
        'closed': 'Đã đóng'
      }
      return statusMap[status] || status
    }

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('vi-VN', options);
    }

    // Watch progress notifications để thêm vào logs
    watch(progressNotifications, (newNotifications) => {
      if (newNotifications && newNotifications.length > 0 && loading.value) {
        const latestNotification = newNotifications[0]

        // Thêm vào logs thay vì thay thế
        addProgressLog('📡 ' + latestNotification.content)
        currentProgressMessage.value = latestNotification.content

        // Parse additional data nếu có
        if (latestNotification.additional_data) {
          progressStep.value = latestNotification.additional_data.current_step || 0
          totalSteps.value = latestNotification.additional_data.total_steps || 0

          // Cập nhật sub-progress cho log cuối cùng
          if (progressLogs.value.length > 0) {
            const lastLog = progressLogs.value[progressLogs.value.length - 1]
            if (!lastLog.completed) {
              lastLog.subProgress = Math.round((progressStep.value / totalSteps.value) * 100)
            }
          }
        }
      }
    }, { deep: true })

    onMounted(() => {
      // Đảm bảo đã subscribe notifications để nhận progress updates
      if (!store.state.notifications.subscribed) {
        store.dispatch('notifications/subscribeToNotifications')
      }
    })

    return {
      loading,
      error,
      activeTab,
      step,
      showAutoSuggestion,
      profileData,
      autoProfileData,
      suggestedProfiles,
      createdProfileId,
      showCancelModal,
      handleManualSubmit,
      handleAutoSubmit,
      handleFinalSubmit,
      cancelProfile,
      confirmCancel,
      resetForm,
      getStatusText,
      formatDate,
      originalUserInput,
      mergeProfileData,
      showProgress,
      progressLogs,
      currentProgressMessage,
      progressStep,
      totalSteps,
      progressSection,
      addProgressLog,
      scrollToProgress,
      formatTimestamp
    }
  }
}
</script>

<style scoped>
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

/* Thêm animate.css classes tối giản */
.animate__animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}

.animate__faster {
  animation-duration: 0.5s;
}

.animate__fadeIn {
  animation-name: fadeIn;
}

.animate__fadeInUp {
  animation-name: fadeInUp;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 40px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

/* Hiệu ứng hover mượt mà */
.group-hover\:translate-x-1:hover {
  transform: translateX(4px);
}
</style>