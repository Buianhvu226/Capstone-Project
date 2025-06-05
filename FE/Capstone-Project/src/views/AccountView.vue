<template>
  <div class="min-h-screen py-8 mt-10">
    <!-- Header with breadcrumb -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <nav class="flex mb-4" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li class="inline-flex items-center">
              <router-link to="/" class="text-gray-500 hover:text-blue-400 text-sm transition-colors">
                <i class="fas fa-home mr-1"></i>
                Trang chủ
              </router-link>
            </li>
            <li>
              <div class="flex items-center">
                <i class="fas fa-chevron-right text-gray-400 text-xs mx-2"></i>
                <span class="text-gray-900 text-sm font-medium">Tài khoản của tôi</span>
              </div>
            </li>
          </ol>
        </nav>
        
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl flex items-center justify-center">
            <i class="fas fa-user-circle text-white text-2xl"></i>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Tài khoản của tôi</h1>
            <p class="mt-1 text-gray-600">Quản lý thông tin cá nhân và cài đặt tài khoản</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="text-center">
          <div class="relative">
            <div class="w-20 h-20 border-4 border-blue-200 border-t-blue-400 rounded-full animate-spin mb-4 mx-auto"></div>
            <div class="absolute inset-0 w-20 h-20 border-4 border-blue-200 border-b-blue-400 rounded-full animate-spin mx-auto" style="animation-direction: reverse; animation-duration: 1.5s;"></div>
          </div>
          <p class="text-gray-600 font-medium">Đang tải thông tin tài khoản...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="max-w-md mx-auto">
        <div class="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <i class="fas fa-exclamation-triangle text-red-500 text-xl"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-red-800 font-semibold text-lg">Lỗi tải thông tin</h3>
              <p class="text-red-700 text-sm mt-1">{{ error }}</p>
            </div>
          </div>
          <button @click="fetchAccountInfo" 
            class="mt-4 w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <i class="fas fa-redo mr-2"></i>
            Thử lại
          </button>
        </div>
      </div>

      <!-- Account Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Profile Card -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <!-- Profile Header with Gradient -->
            <div class="h-24 bg-gradient-to-r from-blue-500 via-blue-500 to-pink-500 relative">
              <div class="absolute inset-0 bg-black bg-opacity-10"></div>
              <div class="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                <div class="relative">
                  <div class="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                    <div class="w-full h-full bg-gradient-to-br from-blue-500 to-blue-400 rounded-full flex items-center justify-center text-white text-2xl font-bold relative overflow-hidden">
                      <img v-if="accountData.avatar_url" 
                        :src="accountData.avatar_url" 
                        :alt="accountData.full_name"
                        class="w-full h-full rounded-full object-cover"
                        @error="handleAvatarError">
                      <span v-else class="select-none">{{ getInitials(accountData.full_name) }}</span>
                    </div>
                  </div>
                  <!-- Upload Avatar Button -->
                  <button class="absolute bottom-1 right-1 w-7 h-7 bg-blue-500 hover:bg-blue-400 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 group"
                    title="Đổi ảnh đại diện">
                    <i class="fas fa-camera text-xs group-hover:scale-110 transition-transform"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Profile Info -->
            <div class="pt-16 pb-6 px-6 text-center">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ accountData.full_name || 'Chưa cập nhật' }}</h2>
              <p class="text-gray-600 mb-1">{{ accountData.email }}</p>
              <p class="text-sm text-gray-500">{{ accountData.username }}</p>
              
              <!-- Status Badge -->
              <div class="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <div class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Tài khoản hoạt động
              </div>
            </div>

            <!-- Contact Info -->
            <div class="px-6 pb-6 space-y-3">
              <div class="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                <i class="fas fa-phone text-blue-500 w-5 mr-3"></i>
                <span>{{ accountData.phone || 'Chưa cập nhật số điện thoại' }}</span>
              </div>
              <div class="flex items-start text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                <i class="fas fa-map-marker-alt text-red-500 w-5 mr-3 mt-0.5"></i>
                <span class="flex-1">{{ accountData.address || 'Chưa cập nhật địa chỉ' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Details -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <!-- Modern Tabs -->
            <div class="border-b border-gray-100 bg-gray-50">
              <nav class="flex">
                <button @click="activeTab = 'info'" 
                  :class=" [
                    activeTab === 'info' 
                      ? 'border-blue-500 text-blue-400 bg-white' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-white/50'
                  ]"
                  class="py-4 px-8 border-b-2 font-semibold text-sm transition-all relative">
                  <i class="fas fa-user mr-2"></i>
                  Thông tin cá nhân
                  <div v-if="activeTab === 'info'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-500"></div>
                </button>
                <button @click="activeTab = 'security'" 
                  :class=" [
                    activeTab === 'security' 
                      ? 'border-blue-500 text-blue-400 bg-white' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-white/50'
                  ]"
                  class="py-4 px-8 border-b-2 font-semibold text-sm transition-all relative">
                  <i class="fas fa-shield-alt mr-2"></i>
                  Bảo mật
                  <div v-if="activeTab === 'security'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-500"></div>
                </button>
              </nav>
            </div>

            <!-- Tab Content -->
            <div class="p-8">
              
              <!-- Personal Info Tab -->
              <div v-if="activeTab === 'info'">
                <div class="flex justify-between items-center mb-8">
                  <div>
                    <h3 class="text-2xl font-bold text-gray-900">Thông tin cá nhân</h3>
                    <p class="text-gray-600 mt-1">Quản lý thông tin cá nhân của bạn</p>
                  </div>
                  <button v-if="!isEditing" @click="startEditing"
                    class="bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    <i class="fas fa-edit mr-2"></i>
                    Chỉnh sửa thông tin
                  </button>
                </div>

                <!-- Success Message -->
                <div v-if="updateSuccess" class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-8 animate-fade-in">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <i class="fas fa-check text-green-600"></i>
                    </div>
                    <div>
                      <p class="text-green-800 font-semibold">Cập nhật thành công!</p>
                      <p class="text-green-700 text-sm">Thông tin của bạn đã được cập nhật.</p>
                    </div>
                  </div>
                </div>

                <!-- Edit Form -->
                <form v-if="isEditing" @submit.prevent="updateAccount" class="space-y-6">
                  <!-- Full Name -->
                  <div class="group">
                    <label class="block text-sm font-semibold text-gray-700 mb-3">
                      <i class="fas fa-user text-blue-500 mr-2"></i>
                      Họ và tên <span class="text-red-500">*</span>
                    </label>
                    <input v-model="editForm.full_name" type="text" required
                      :class=" [
                        'w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-gray-50 focus:bg-white',
                        validationErrors.full_name 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-blue-500 group-hover:border-gray-300'
                      ]"
                      placeholder="Nhập họ và tên đầy đủ">
                    <p v-if="validationErrors.full_name" class="text-red-500 text-sm mt-2 flex items-center">
                      <i class="fas fa-exclamation-circle mr-1"></i>
                      {{ validationErrors.full_name }}
                    </p>
                  </div>

                  <!-- Email (readonly) -->
                  <div class="group">
                    <label class="block text-sm font-semibold text-gray-700 mb-3">
                      <i class="fas fa-envelope text-blue-500 mr-2"></i>
                      Email
                    </label>
                    <input :value="accountData.email" type="email" readonly
                      class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed">
                    <p class="text-xs text-gray-500 mt-2 flex items-center">
                      <i class="fas fa-lock mr-1"></i>
                      Email không thể thay đổi
                    </p>
                  </div>

                  <!-- Phone -->
                  <div class="group">
                    <label class="block text-sm font-semibold text-gray-700 mb-3">
                      <i class="fas fa-phone text-blue-500 mr-2"></i>
                      Số điện thoại
                    </label>
                    <input v-model="editForm.phone" type="tel"
                      :class=" [
                        'w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-gray-50 focus:bg-white',
                        validationErrors.phone 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-blue-500 group-hover:border-gray-300'
                      ]"
                      placeholder="Nhập số điện thoại">
                    <p v-if="validationErrors.phone" class="text-red-500 text-sm mt-2 flex items-center">
                      <i class="fas fa-exclamation-circle mr-1"></i>
                      {{ validationErrors.phone }}
                    </p>
                  </div>

                  <!-- Address -->
                  <div class="group">
                    <label class="block text-sm font-semibold text-gray-700 mb-3">
                      <i class="fas fa-map-marker-alt text-blue-500 mr-2"></i>
                      Địa chỉ
                    </label>
                    <textarea v-model="editForm.address" rows="4"
                      :class=" [
                        'w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-gray-50 focus:bg-white resize-none',
                        validationErrors.address 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-blue-500 group-hover:border-gray-300'
                      ]"
                      placeholder="Nhập địa chỉ chi tiết"></textarea>
                    <p v-if="validationErrors.address" class="text-red-500 text-sm mt-2 flex items-center">
                      <i class="fas fa-exclamation-circle mr-1"></i>
                      {{ validationErrors.address }}
                    </p>
                  </div>

                  <!-- General Error -->
                  <div v-if="error" class="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <i class="fas fa-exclamation-triangle text-red-600"></i>
                      </div>
                      <p class="text-red-700 font-medium">{{ error }}</p>
                    </div>
                  </div>

                  <!-- Form Actions -->
                  <div class="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                    <button type="button" @click="cancelEditing"
                      class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold">
                      <i class="fas fa-times mr-2"></i>
                      Hủy bỏ
                    </button>
                    <button type="submit" :disabled="updating"
                      class="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                      <i v-if="updating" class="fas fa-spinner fa-spin mr-2"></i>
                      <i v-else class="fas fa-save mr-2"></i>
                      {{ updating ? 'Đang cập nhật...' : 'Lưu thay đổi' }}
                    </button>
                  </div>
                </form>

                <!-- View Mode -->
                <div v-else class="space-y-8">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                      <label class="block text-sm font-semibold text-gray-700 mb-3">
                        <i class="fas fa-user text-blue-500 mr-2"></i>
                        Họ và tên
                      </label>
                      <p class="text-gray-900 font-semibold text-lg">{{ accountData.full_name || 'Chưa cập nhật' }}</p>
                    </div>
                    <div class="bg-gradient-to-r from-blue-50 to-pink-50 rounded-xl p-6 border border-blue-100">
                      <label class="block text-sm font-semibold text-gray-700 mb-3">
                        <i class="fas fa-envelope text-blue-500 mr-2"></i>
                        Email
                      </label>
                      <p class="text-gray-900 font-semibold">{{ accountData.email }}</p>
                    </div>
                    <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                      <label class="block text-sm font-semibold text-gray-700 mb-3">
                        <i class="fas fa-phone text-green-500 mr-2"></i>
                        Số điện thoại
                      </label>
                      <p class="text-gray-900 font-semibold">{{ accountData.phone || 'Chưa cập nhật' }}</p>
                    </div>
                    <div class="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-100">
                      <label class="block text-sm font-semibold text-gray-700 mb-3">
                        <i class="fas fa-id-card text-orange-500 mr-2"></i>
                        Tên đăng nhập
                      </label>
                      <p class="text-gray-900 font-semibold">{{ accountData.username }}</p>
                    </div>
                  </div>
                  <div class="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-100">
                    <label class="block text-sm font-semibold text-gray-700 mb-3">
                      <i class="fas fa-map-marker-alt text-red-500 mr-2"></i>
                      Địa chỉ
                    </label>
                    <p class="text-gray-900 font-semibold">{{ accountData.address || 'Chưa cập nhật' }}</p>
                  </div>
                </div>
              </div>

              <!-- Security Tab -->
              <div v-else-if="activeTab === 'security'">
                <div class="mb-8">
                  <h3 class="text-2xl font-bold text-gray-900">Bảo mật tài khoản</h3>
                  <p class="text-gray-600 mt-1">Cài đặt bảo mật và quyền riêng tư</p>
                </div>
                
                <div class="space-y-6">
                  <!-- Change Password -->
                  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 hover:shadow-lg transition-all">
                    <div class="flex items-start">
                      <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                        <i class="fas fa-key text-white text-xl"></i>
                      </div>
                      <div class="flex-1">
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">Đổi mật khẩu</h4>
                        <p class="text-gray-600 text-sm mb-4">Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
                        <button class="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all shadow hover:shadow-lg">
                          <i class="fas fa-edit mr-2"></i>
                          Đổi mật khẩu
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Two Factor Authentication -->
                  <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl p-6 hover:shadow-lg transition-all">
                    <div class="flex items-start">
                      <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4">
                        <i class="fas fa-shield-alt text-white text-xl"></i>
                      </div>
                      <div class="flex-1">
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">Xác thực hai lớp</h4>
                        <p class="text-gray-600 text-sm mb-4">Thêm lớp bảo mật cho tài khoản của bạn</p>
                        <button class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all shadow hover:shadow-lg">
                          <i class="fas fa-plus mr-2"></i>
                          Kích hoạt 2FA
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Login Sessions -->
                  <div class="bg-gradient-to-r from-blue-50 to-pink-50 border border-blue-100 rounded-xl p-6 hover:shadow-lg transition-all">
                    <div class="flex items-start">
                      <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                        <i class="fas fa-devices text-white text-xl"></i>
                      </div>
                      <div class="flex-1">
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">Phiên đăng nhập</h4>
                        <p class="text-gray-600 text-sm mb-4">Quản lý các thiết bị đã đăng nhập</p>
                        <button class="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all shadow hover:shadow-lg">
                          <i class="fas fa-eye mr-2"></i>
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

export default {
  name: 'AccountView',
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
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
}
</style>