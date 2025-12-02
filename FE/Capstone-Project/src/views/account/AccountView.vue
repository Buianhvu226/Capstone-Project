<template>
  <div class="min-h-screen bg-slate-50 pt-16 pb-6 sm:pt-20 sm:pb-8">
    <div class="max-w-7xl mx-auto px-3 sm:px-4">
      
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-20">
        <AppLoader />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="max-w-2xl mx-auto">
        <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div class="inline-block p-4 bg-red-100 rounded-full mb-4">
            <i class="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
          </div>
          <h3 class="text-lg font-semibold text-red-800 mb-2">Có lỗi xảy ra</h3>
          <p class="text-sm text-red-600 mb-6">{{ error }}</p>
          <button @click="fetchAccountInfo" 
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <i class="fas fa-redo mr-2"></i>
            Thử lại
          </button>
        </div>
      </div>

      <!-- Account Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-5">
        
        <!-- Profile Card -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
            <!-- Profile Header -->
            <div class="h-20 bg-gradient-to-r from-blue-500 to-blue-600 relative">
              <div class="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                <div class="relative">
                  <div class="w-24 h-24 bg-white rounded-full p-1 shadow-md">
                    <div class="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-semibold relative overflow-hidden">
                      <img v-if="accountData.avatar_url" 
                        :src="accountData.avatar_url" 
                        :alt="accountData.full_name"
                        class="w-full h-full rounded-full object-cover"
                        @error="handleAvatarError">
                      <span v-else class="select-none">{{ getInitials(accountData.full_name) }}</span>
                    </div>
                  </div>
                  <!-- Upload Avatar Button -->
                  <button class="absolute bottom-0 right-0 w-7 h-7 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110"
                    title="Đổi ảnh đại diện">
                    <i class="fas fa-camera text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Profile Info -->
            <div class="pt-14 pb-4 px-4 text-center">
              <h2 class="text-lg font-semibold text-slate-900 mb-1">{{ accountData.full_name || 'Chưa cập nhật' }}</h2>
              <p class="text-sm text-slate-600 mb-0.5">{{ accountData.email }}</p>
              <p class="text-xs text-slate-500">{{ accountData.username }}</p>
              
              <!-- Status Badge -->
              <div class="mt-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></div>
                Tài khoản hoạt động
              </div>
            </div>

            <!-- Contact Info -->
            <div class="px-4 pb-4 space-y-2">
              <div class="flex items-center text-xs text-slate-600 bg-slate-50 rounded-lg p-2.5">
                <i class="fas fa-phone text-blue-500 w-4 mr-2.5 flex-shrink-0"></i>
                <span class="truncate">{{ accountData.phone || 'Chưa cập nhật số điện thoại' }}</span>
              </div>
              <div class="flex items-start text-xs text-slate-600 bg-slate-50 rounded-lg p-2.5">
                <i class="fas fa-map-marker-alt text-red-500 w-4 mr-2.5 mt-0.5 flex-shrink-0"></i>
                <span class="flex-1">{{ accountData.address || 'Chưa cập nhật địa chỉ' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Details -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
            <!-- Tabs -->
            <div class="border-b border-slate-200/80 bg-slate-50/50">
              <nav class="flex">
                <button @click="activeTab = 'info'" 
                  :class="[
                    activeTab === 'info' 
                      ? 'border-blue-500 text-blue-600 bg-white' 
                      : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-white/50'
                  ]"
                  class="py-3 px-4 sm:px-6 border-b-2 font-semibold text-sm transition-colors">
                  <i class="fas fa-user mr-2"></i>
                  Thông tin cá nhân
                </button>
                <button @click="activeTab = 'security'" 
                  :class="[
                    activeTab === 'security' 
                      ? 'border-blue-500 text-blue-600 bg-white' 
                      : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-white/50'
                  ]"
                  class="py-3 px-4 sm:px-6 border-b-2 font-semibold text-sm transition-colors">
                  <i class="fas fa-shield-alt mr-2"></i>
                  Bảo mật
                </button>
              </nav>
            </div>

            <!-- Tab Content -->
            <div class="p-4 sm:p-6">
              
              <!-- Personal Info Tab -->
              <div v-if="activeTab === 'info'">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <div>
                    <h3 class="text-lg font-semibold text-slate-900">Thông tin cá nhân</h3>
                    <p class="text-xs text-slate-600 mt-1">Quản lý thông tin cá nhân của bạn</p>
                  </div>
                  <button v-if="!isEditing" @click="startEditing"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md">
                    <i class="fas fa-edit text-xs"></i>
                    Chỉnh sửa thông tin
                  </button>
                </div>

                <!-- Success Message -->
                <div v-if="updateSuccess" class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-6">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i class="fas fa-check text-emerald-600 text-sm"></i>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-semibold text-emerald-800">Cập nhật thành công!</p>
                      <p class="text-xs text-emerald-700 mt-0.5">Thông tin của bạn đã được cập nhật.</p>
                    </div>
                  </div>
                </div>

                <!-- Edit Form -->
                <form v-if="isEditing" @submit.prevent="updateAccount" class="space-y-4">
                  <!-- Full Name -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-2">
                      <i class="fas fa-user text-blue-500 mr-1.5 text-xs"></i>
                      Họ và tên <span class="text-red-500">*</span>
                    </label>
                    <input v-model="editForm.full_name" type="text" required
                      :class="[
                        'w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-slate-50 focus:bg-white',
                        validationErrors.full_name 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-slate-300 focus:border-blue-500'
                      ]"
                      placeholder="Nhập họ và tên đầy đủ">
                    <p v-if="validationErrors.full_name" class="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <i class="fas fa-exclamation-circle text-xs"></i>
                      {{ validationErrors.full_name }}
                    </p>
                  </div>

                  <!-- Email (readonly) -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-2">
                      <i class="fas fa-envelope text-blue-500 mr-1.5 text-xs"></i>
                      Email
                    </label>
                    <input :value="accountData.email" type="email" readonly
                      class="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed text-sm">
                    <p class="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                      <i class="fas fa-lock text-xs"></i>
                      Email không thể thay đổi
                    </p>
                  </div>

                  <!-- Phone -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-2">
                      <i class="fas fa-phone text-blue-500 mr-1.5 text-xs"></i>
                      Số điện thoại
                    </label>
                    <input v-model="editForm.phone" type="tel"
                      :class="[
                        'w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-slate-50 focus:bg-white',
                        validationErrors.phone 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-slate-300 focus:border-blue-500'
                      ]"
                      placeholder="Nhập số điện thoại">
                    <p v-if="validationErrors.phone" class="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <i class="fas fa-exclamation-circle text-xs"></i>
                      {{ validationErrors.phone }}
                    </p>
                  </div>

                  <!-- Address -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-2">
                      <i class="fas fa-map-marker-alt text-blue-500 mr-1.5 text-xs"></i>
                      Địa chỉ
                    </label>
                    <textarea v-model="editForm.address" rows="3"
                      :class="[
                        'w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500/20 transition-all text-sm bg-slate-50 focus:bg-white resize-none',
                        validationErrors.address 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-slate-300 focus:border-blue-500'
                      ]"
                      placeholder="Nhập địa chỉ chi tiết"></textarea>
                    <p v-if="validationErrors.address" class="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <i class="fas fa-exclamation-circle text-xs"></i>
                      {{ validationErrors.address }}
                    </p>
                  </div>

                  <!-- General Error -->
                  <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-exclamation-triangle text-red-600 text-sm"></i>
                      </div>
                      <p class="text-sm text-red-700 font-medium">{{ error }}</p>
                    </div>
                  </div>

                  <!-- Form Actions -->
                  <div class="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <button type="button" @click="cancelEditing"
                      class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                      <i class="fas fa-times mr-1.5 text-xs"></i>
                      Hủy bỏ
                    </button>
                    <button type="submit" :disabled="updating"
                      class="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                      <i v-if="updating" class="fas fa-spinner fa-spin mr-1.5 text-xs"></i>
                      <i v-else class="fas fa-save mr-1.5 text-xs"></i>
                      {{ updating ? 'Đang cập nhật...' : 'Lưu thay đổi' }}
                    </button>
                  </div>
                </form>

                <!-- View Mode -->
                <div v-else class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <label class="block text-xs font-semibold text-slate-700 mb-2">
                        <i class="fas fa-user text-blue-500 mr-1.5 text-xs"></i>
                        Họ và tên
                      </label>
                      <p class="text-slate-900 font-semibold text-sm">{{ accountData.full_name || 'Chưa cập nhật' }}</p>
                    </div>
                    <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <label class="block text-xs font-semibold text-slate-700 mb-2">
                        <i class="fas fa-envelope text-blue-500 mr-1.5 text-xs"></i>
                        Email
                      </label>
                      <p class="text-slate-900 font-semibold text-sm">{{ accountData.email }}</p>
                    </div>
                    <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <label class="block text-xs font-semibold text-slate-700 mb-2">
                        <i class="fas fa-phone text-blue-500 mr-1.5 text-xs"></i>
                        Số điện thoại
                      </label>
                      <p class="text-slate-900 font-semibold text-sm">{{ accountData.phone || 'Chưa cập nhật' }}</p>
                    </div>
                    <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <label class="block text-xs font-semibold text-slate-700 mb-2">
                        <i class="fas fa-id-card text-blue-500 mr-1.5 text-xs"></i>
                        Tên đăng nhập
                      </label>
                      <p class="text-slate-900 font-semibold text-sm">{{ accountData.username }}</p>
                    </div>
                  </div>
                  <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <label class="block text-xs font-semibold text-slate-700 mb-2">
                      <i class="fas fa-map-marker-alt text-blue-500 mr-1.5 text-xs"></i>
                      Địa chỉ
                    </label>
                    <p class="text-slate-900 font-semibold text-sm">{{ accountData.address || 'Chưa cập nhật' }}</p>
                  </div>
                </div>
              </div>

              <!-- Security Tab -->
              <div v-else-if="activeTab === 'security'">
                <div class="mb-6">
                  <h3 class="text-lg font-semibold text-slate-900">Bảo mật tài khoản</h3>
                  <p class="text-xs text-slate-600 mt-1">Cài đặt bảo mật và quyền riêng tư</p>
                </div>
                
                <div class="space-y-3">
                  <!-- Change Password -->
                  <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-all">
                    <div class="flex items-start gap-3">
                      <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-key text-white text-sm"></i>
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-semibold text-slate-900 mb-1">Đổi mật khẩu</h4>
                        <p class="text-xs text-slate-600 mb-3">Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
                        <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors shadow-sm hover:shadow-md">
                          <i class="fas fa-edit mr-1.5 text-xs"></i>
                          Đổi mật khẩu
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Two Factor Authentication -->
                  <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-all">
                    <div class="flex items-start gap-3">
                      <div class="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-shield-alt text-white text-sm"></i>
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-semibold text-slate-900 mb-1">Xác thực hai lớp</h4>
                        <p class="text-xs text-slate-600 mb-3">Thêm lớp bảo mật cho tài khoản của bạn</p>
                        <button class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors shadow-sm hover:shadow-md">
                          <i class="fas fa-plus mr-1.5 text-xs"></i>
                          Kích hoạt 2FA
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Login Sessions -->
                  <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-all">
                    <div class="flex items-start gap-3">
                      <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-devices text-white text-sm"></i>
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-semibold text-slate-900 mb-1">Phiên đăng nhập</h4>
                        <p class="text-xs text-slate-600 mb-3">Quản lý các thiết bị đã đăng nhập</p>
                        <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors shadow-sm hover:shadow-md">
                          <i class="fas fa-eye mr-1.5 text-xs"></i>
                          Xem phiên đăng nhập
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import authService from '@/services/authService'
import AppLoader from '@/components/common/AppLoader.vue'

export default {
  name: 'AccountView',
  components: {
    AppLoader
  },
  setup() {
    const store = useStore()
    
    // State
    const loading = ref(false)
    const error = ref(null)
    const accountData = ref({})
    const isEditing = ref(false)
    const updating = ref(false)
    const updateSuccess = ref(false)
    const activeTab = ref('info')
    const validationErrors = ref({})
    
    // Edit form
    const editForm = ref({
      full_name: '',
      phone: '',
      address: ''
    })

    // Get user from store
    const currentUser = computed(() => store.getters['auth/currentUser'])

    // Methods
    const fetchAccountInfo = async () => {
      try {
        loading.value = true
        error.value = null
        
        const response = await authService.getCurrentUser()
        accountData.value = response.data
        
        console.log('📋 Account data loaded:', accountData.value);
        
        // Update store với data mới
        store.commit('auth/SET_USER', response.data)
        
      } catch (err) {
        console.error('Error fetching account info:', err)
        error.value = err.response?.data?.message || 'Không thể tải thông tin tài khoản'
      } finally {
        loading.value = false
      }
    }

    const startEditing = () => {
      editForm.value = {
        full_name: accountData.value.full_name || '',
        phone: accountData.value.phone || '',
        address: accountData.value.address || ''
      }
      isEditing.value = true
      updateSuccess.value = false
      validationErrors.value = {}
      error.value = null
    }

    const cancelEditing = () => {
      isEditing.value = false
      editForm.value = {
        full_name: '',
        phone: '',
        address: ''
      }
      validationErrors.value = {}
      error.value = null
    }

    const validateForm = () => {
      const errors = {}
      
      if (!editForm.value.full_name || editForm.value.full_name.trim().length < 2) {
        errors.full_name = 'Họ và tên phải có ít nhất 2 ký tự'
      }
      
      if (editForm.value.phone && editForm.value.phone.trim()) {
        const phoneRegex = /^[0-9+\-\s()]+$/
        if (!phoneRegex.test(editForm.value.phone.trim())) {
          errors.phone = 'Số điện thoại không hợp lệ'
        }
      }
      
      validationErrors.value = errors
      return Object.keys(errors).length === 0
    }

    const updateAccount = async () => {
      if (!validateForm()) {
        return
      }
      
      try {
        updating.value = true
        error.value = null
        validationErrors.value = {}
        
        console.log('📤 Updating account with:', editForm.value);
        console.log('📤 Current account data:', accountData.value);
        
        const response = await authService.updateAccount(editForm.value, accountData.value)
        
        console.log('✅ Update successful:', response.data);
        
        // Update local data - merge với data hiện tại
        accountData.value = { 
          ...accountData.value, 
          ...response.data 
        }
        
        // Update store
        store.commit('auth/SET_USER', accountData.value)
        
        // Show success and exit edit mode
        updateSuccess.value = true
        isEditing.value = false
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          updateSuccess.value = false
        }, 5000)
        
      } catch (err) {
        console.error('❌ Error updating account:', err)
        
        if (err.response?.status === 400) {
          const errorData = err.response.data
          console.log('❌ 400 Error data:', errorData);
          
          if (typeof errorData === 'object' && errorData !== null) {
            validationErrors.value = errorData
            error.value = 'Vui lòng kiểm tra lại thông tin đã nhập'
          } else if (typeof errorData === 'string') {
            error.value = errorData
          } else {
            error.value = 'Dữ liệu không hợp lệ'
          }
        } else if (err.response?.status === 401) {
          error.value = 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại'
        } else if (err.response?.status === 403) {
          error.value = 'Bạn không có quyền thực hiện thao tác này'
        } else {
          error.value = err.response?.data?.message || err.message || 'Không thể cập nhật thông tin'
        }
      } finally {
        updating.value = false
      }
    }

    const getInitials = (name) => {
      if (!name) return 'U'
      return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
    }

    const handleAvatarError = (event) => {
      event.target.style.display = 'none'
    }

    // Initialize
    onMounted(async () => {
      if (currentUser.value) {
        accountData.value = currentUser.value
      }
      
      await fetchAccountInfo()
    })

    return {
      loading,
      error,
      accountData,
      isEditing,
      updating,
      updateSuccess,
      activeTab,
      editForm,
      validationErrors,
      fetchAccountInfo,
      startEditing,
      cancelEditing,
      updateAccount,
      getInitials,
      handleAvatarError
    }
  }
}
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
