<template>
  <div class="min-h-screen bg-slate-50">
    <AppHeader />
    <div class="max-w-7xl mx-auto px-3 sm:px-4 pt-20 pb-8">
      <CreateGuideTour v-if="showGuideTour" :is-active="showGuideTour" @close="closeGuideTour" />

      <section id="create-hero" class="bg-white rounded-lg p-3 mb-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <i class="fas fa-user-plus text-base"></i>
            </div>
            <div>
              <h1 class="text-base font-bold text-slate-800">Đăng ký hồ sơ tìm kiếm</h1>
              <p class="text-xs text-slate-500">Điền thông tin ngắn gọn, rõ ràng để cộng đồng dễ hỗ trợ.</p>
            </div>
          </div>
          <button
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 border border-blue-200 hover:border-blue-400 transition-colors disabled:opacity-50"
            :disabled="showGuideTour" @click="startGuideTour">
            <i class="fas fa-question-circle text-xs"></i>
            Hướng dẫn
          </button>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div class="lg:col-span-8 space-y-3" id="create-form">
          <section v-if="step === 1 && activeTab === 'manual'"
            class="bg-white border border-slate-200 rounded-lg p-3 space-y-3">
            <div v-if="showAutoSuggestion"
              class="rounded-lg border border-blue-200 bg-blue-50 p-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <div class="flex items-center gap-3">
                <span class="h-8 w-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <i class="fas fa-lightbulb"></i>
                </span>
                <p class="text-sm text-blue-700 font-medium">
                  Thử mô tả tự nhiên để hệ thống gợi ý thông tin nhanh hơn.
                </p>
              </div>
              <div class="flex gap-2 flex-wrap text-xs font-semibold">
                <button class="px-3 py-1 rounded-lg bg-blue-500 text-white" @click="
                  () => {
                    activeTab = 'auto';
                    showAutoSuggestion = false;
                  }
                ">
                  Dùng mô tả
                </button>
                <button class="px-3 py-1 rounded-lg text-slate-500 border border-transparent hover:border-slate-200"
                  @click="showAutoSuggestion = false">
                  Ẩn gợi ý
                </button>
              </div>
            </div>

            <div class="max-h-[420px] overflow-y-auto custom-scroll">
              <ProfileForm :loading="loading" :error="error" :initialData="profileData"
                submitButtonText="Tiếp tục xem lại" @submit="handleManualSubmit" />
            </div>
          </section>

          <section v-if="step === 1 && activeTab === 'auto'"
            class="bg-white border border-slate-200 rounded-lg p-3 space-y-3">
            <div class="flex items-start gap-3 text-sm">
              <div class="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <i class="fas fa-robot text-sm"></i>
              </div>
              <div>
                <p class="font-semibold text-slate-800">Mô tả trường hợp thất lạc</p>
                <p class="text-xs text-slate-500">AI sẽ phân tích để gợi ý nhanh các trường.</p>
              </div>
            </div>
            <div class="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-slate-600">
              Nêu rõ họ tên, năm sinh, thời điểm thất lạc, địa điểm và các mối quan hệ gia đình quan trọng.
            </div>
            <div>
              <label for="auto-description" class="block text-xs font-semibold text-slate-700 mb-1">
                Nội dung mô tả <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <textarea 
                  id="auto-description" 
                  :value="autoProfileData.description"
                  @input="handleDescriptionInput"
                  @keydown="handleDescriptionKeydown"
                  @paste="handleDescriptionPaste"
                  rows="7"
                  maxlength="2000"
                  class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                  placeholder="Ví dụ: Nguyễn Văn A, sinh năm 1985 tại Huế..." 
                  required></textarea>
                <div class="absolute bottom-2 right-2 text-xs text-slate-400 bg-white px-1 rounded">
                  {{ autoProfileData.description.length }}/2000
                </div>
              </div>
              <p class="text-[11px] text-slate-500 mt-1">
                <i class="fas fa-info-circle mr-1"></i>
                Tối thiểu 50 ký tự để AI hiểu rõ nhu cầu.
              </p>
            </div>
            <div class="flex justify-end">
              <button
                class="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="loading || !autoProfileData.description" @click="handleAutoSubmit">
                <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-paper-plane"></i>
                {{ loading ? 'Đang phân tích...' : 'Phân tích mô tả' }}
              </button>
            </div>
          </section>

          <section v-if="step === 2" class="bg-white border border-slate-200 rounded-lg p-3 space-y-3">
            <div
              class="rounded-lg border border-blue-200 bg-blue-50 p-2.5 flex items-center gap-2 text-xs text-slate-700">
              <i class="fas fa-info-circle text-blue-500 text-sm"></i>
              Kiểm tra lại nội dung và cập nhật nếu cần trước khi hoàn tất.
            </div>

            <div class="max-h-[420px] overflow-y-auto custom-scroll">
              <ProfileForm :loading="loading" :error="error" :initialData="profileData"
                submitButtonText="Hoàn tất hồ sơ" @submit="handleFinalSubmit" />
            </div>

            <div class="flex flex-col sm:flex-row justify-between gap-2 border-t border-slate-100 pt-2">
              <button class="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600"
                @click="step = 1">
                <i class="fas fa-arrow-left mr-2"></i>
                Quay lại
              </button>
              <button class="px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-600"
                @click="cancelProfile">
                <i class="fas fa-times mr-2"></i>
                Hủy hồ sơ
              </button>
            </div>
          </section>

          <section v-if="step === 3" class="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <div class="text-center space-y-2">
              <div class="mx-auto h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                <i class="fas fa-check text-lg"></i>
              </div>
              <h2 class="text-base font-semibold text-slate-800">Đăng ký hồ sơ thành công</h2>
              <p class="text-xs text-slate-600">Bạn có thể xem lại hồ sơ hoặc tạo thêm trường hợp khác.</p>
              <div class="flex flex-col sm:flex-row justify-center gap-2 mt-2">
                <router-link :to="{ name: 'profile-detail', params: { id: createdProfileId } }"
                  class="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white text-xs font-semibold">
                  <i class="fas fa-eye"></i>
                  Xem hồ sơ
                </router-link>
                <button
                  class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                  @click="resetForm">
                  <i class="fas fa-plus"></i>
                  Tạo hồ sơ mới
                </button>
              </div>
            </div>

            <CreateSuccessSuggestions :profiles="suggestedProfiles" />
          </section>

        </div>

        <div class="lg:col-span-4 space-y-3" id="create-sidebar">
          <div class="bg-white rounded-lg p-3 border border-slate-200">
            <p class="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <i class="fas fa-route text-blue-500 text-xs"></i>
              Tiến trình của bạn
            </p>
            <CreateSteps :step="step" />
          </div>
          <div v-if="step === 1" class="bg-white rounded-lg p-3 border border-slate-200" id="create-tabs">
            <p class="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <i class="fas fa-exchange-alt text-blue-500 text-xs"></i>
              Chọn chế độ nhập
            </p>
            <CreateTabSwitcher :active-tab="activeTab" @change="(val) => (activeTab = val)" />
          </div>
          <div class="bg-white rounded-lg p-3 border border-slate-200 text-xs text-slate-500">
            <p class="font-semibold text-slate-700 mb-1">Gợi ý nhanh</p>
            <p>Điền đủ họ tên, năm sinh, thời điểm/địa điểm thất lạc và người thân để tăng độ chính xác khi đối chiếu.
            </p>
          </div>
        </div>
      </div>

      <div v-if="showProgress && loading" class="mt-3" ref="progressSection">
        <CreateProgressPanel :loading="loading" :progress-logs="progressLogs" :current-message="currentProgressMessage"
          :progress-step="progressStep" :total-steps="totalSteps" @clear-logs="clearProgressLogs" />
      </div>

      <CreateCancelModal v-if="showCancelModal" @close="showCancelModal = false" @confirm="confirmCancel" />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import ProfileForm from '@/components/profile/forms/ProfileForm.vue'
import CreateHero from '@/components/profile/create/CreateHero.vue'
import CreateTabSwitcher from '@/components/profile/create/CreateTabSwitcher.vue'
import CreateSteps from '@/components/profile/create/CreateSteps.vue'
import CreateProgressPanel from '@/components/profile/create/CreateProgressPanel.vue'
import CreateSuccessSuggestions from '@/components/profile/create/CreateSuccessSuggestions.vue'
import CreateCancelModal from '@/components/profile/create/CreateCancelModal.vue'
import CreateGuideTour from '@/components/profile/create/CreateGuideTour.vue'
import profileService from '@/services/profileService'

export default {
  name: 'ProfileCreateView',
  components: {
    AppHeader,
    ProfileForm,
    CreateHero,
    CreateTabSwitcher,
    CreateSteps,
    CreateProgressPanel,
    CreateSuccessSuggestions,
    CreateCancelModal,
    CreateGuideTour
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
    const showGuideTour = ref(false)
    const CREATE_GUIDE_KEY = 'hasSeenCreateGuide'

    // Thay thế các biến progress hiện tại bằng:
    const showProgress = ref(false)
    const progressLogs = ref([])
    const currentProgressMessage = ref('')
    const progressStep = ref(0)
    const totalSteps = ref(0)
    const progressSection = ref(null)

    const getProfileLogNotifications = () => {
      const list = store.getters['notifications/profileCreatingNotifications']
      return Array.isArray(list) ? list : []
    }

    const clearRemoteProgressNotifications = async () => {
      const logs = getProfileLogNotifications()
      if (!logs.length) return
      await Promise.allSettled(
        logs
          .filter((item) => item?.id)
          .map((item) => store.dispatch('notifications/removeNotification', item.id).catch(() => { }))
      )
    }

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
        }, 1000)

      } catch (err) {
        addProgressLog('❌ Lỗi: ' + (err.response?.data?.detail || 'Có lỗi xảy ra'), false)
        console.error('Failed to create profile:', err)
        error.value = err.response?.data?.detail || 'Có lỗi xảy ra khi tạo hồ sơ'
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
        }, 1500)

      } catch (err) {
        addProgressLog('❌ Lỗi phân tích: ' + (err.response?.data?.detail || 'Có lỗi xảy ra'), false)
        console.error('Failed to analyze description:', err)
        error.value = err.response?.data?.detail || 'Có lỗi xảy ra khi phân tích mô tả'
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
      }
    }

    const clearProgressLogs = async () => {
      progressLogs.value = []
      currentProgressMessage.value = ''
      progressStep.value = 0
      totalSteps.value = 0
      showProgress.value = false
      await clearRemoteProgressNotifications()
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
        description: '',
        status: 'active',
        images: []
      }
      error.value = null
      suggestedProfiles.value = []
      createdProfileId.value = null
      showCancelModal.value = false
    }

    const startGuideTour = () => {
      showGuideTour.value = true
    }

    const closeGuideTour = () => {
      showGuideTour.value = false
      localStorage.setItem(CREATE_GUIDE_KEY, 'true')
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

    const handleBeforeUnload = () => {
      clearProgressLogs()
    }

    onMounted(() => {
      // Đảm bảo đã subscribe notifications để nhận progress updates
      if (!store.state.notifications.subscribed) {
        store.dispatch('notifications/subscribeToNotifications')
      }
      if (!localStorage.getItem(CREATE_GUIDE_KEY)) {
        setTimeout(() => {
          showGuideTour.value = true
        }, 500)
      }
      window.addEventListener('beforeunload', handleBeforeUnload)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      clearProgressLogs()
    })

    // Xử lý input cho description - tự động loại bỏ xuống dòng
    const handleDescriptionInput = (event) => {
      let value = event.target.value;
      // Thay thế tất cả ký tự xuống dòng (\n, \r\n) bằng khoảng trắng
      value = value.replace(/\r?\n/g, ' ');
      // Loại bỏ nhiều khoảng trắng liên tiếp thành 1 khoảng trắng
      value = value.replace(/\s+/g, ' ').trim();
      
      // Giới hạn độ dài
      if (value.length > 2000) {
        value = value.substring(0, 2000);
      }
      
      autoProfileData.value.description = value;
    };

    // Ngăn chặn phím Enter tạo xuống dòng
    const handleDescriptionKeydown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    };

    // Xử lý paste - loại bỏ xuống dòng từ clipboard
    const handleDescriptionPaste = (event) => {
      event.preventDefault();
      const paste = (event.clipboardData || window.clipboardData).getData('text');
      // Thay thế xuống dòng bằng khoảng trắng
      let cleanText = paste.replace(/\r?\n/g, ' ');
      // Loại bỏ nhiều khoảng trắng liên tiếp
      cleanText = cleanText.replace(/\s+/g, ' ').trim();
      
      // Lấy vị trí cursor hiện tại
      const textarea = event.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentValue = autoProfileData.value.description;
      
      // Chèn text đã clean vào vị trí cursor
      const newValue = currentValue.substring(0, start) + cleanText + currentValue.substring(end);
      
      // Giới hạn độ dài
      const finalValue = newValue.length > 2000 
        ? newValue.substring(0, 2000) 
        : newValue;
      
      autoProfileData.value.description = finalValue;
      
      // Đặt lại vị trí cursor sau khi paste
      nextTick(() => {
        const newCursorPos = start + cleanText.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      });
    };

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
      formatTimestamp,
      showGuideTour,
      startGuideTour,
      closeGuideTour,
      clearProgressLogs,
      handleDescriptionInput,
      handleDescriptionKeydown,
      handleDescriptionPaste
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.custom-scroll::-webkit-scrollbar {
  width: 6px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: #eef2ff;
  border-radius: 8px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: #c7d2fe;
  border-radius: 8px;
}

.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: #c7d2fe #eef2ff;
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