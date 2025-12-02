<template>
  <form @submit.prevent="handleSubmit" class="space-y-5">
    <transition name="fade">
      <div v-if="error"
        class="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-lg shadow-sm flex items-center gap-2">
        <i class="fa-solid fa-circle-exclamation text-red-500 flex-shrink-0"></i>
        <span class="text-sm">{{ error }}</span>
      </div>
    </transition>

    <div class="space-y-1.5">
      <label for="email" class="block text-sm font-semibold text-gray-700">
        Email
      </label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <i class="fa-solid fa-envelope text-sm"></i>
        </div>
        <input 
          id="email" 
          v-model="form.email" 
          type="email"
          placeholder="Nhập địa chỉ email của bạn"
          class="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg 
                 bg-white text-gray-900 placeholder-gray-400
                 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                 transition-all duration-200
                 hover:border-gray-400"
          required />
      </div>
    </div>

    <div class="space-y-1.5">
      <label for="password" class="block text-sm font-semibold text-gray-700">
        Mật khẩu
      </label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <i class="fa-solid fa-lock text-sm"></i>
        </div>
        <input 
          id="password" 
          v-model="form.password" 
          :type="showPassword ? 'text' : 'password'"
          placeholder="Nhập mật khẩu của bạn"
          class="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg 
                 bg-white text-gray-900 placeholder-gray-400
                 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                 transition-all duration-200
                 hover:border-gray-400"
          required />
        <button 
          type="button" 
          @click="showPassword = !showPassword"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors">
          <i v-if="showPassword" class="fa-solid fa-eye-slash text-sm"></i>
          <i v-else class="fa-solid fa-eye text-sm"></i>
        </button>
      </div>
    </div>

    <div class="flex items-center justify-end">
      <a href="#" class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
        Quên mật khẩu?
      </a>
    </div>

    <div>
      <button 
        type="submit" 
        :disabled="loading"
        class="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
               text-white font-semibold rounded-lg shadow-md hover:shadow-lg
               transition-all duration-300 transform hover:-translate-y-0.5
               focus:outline-none focus:ring-4 focus:ring-blue-500/30
               disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
               flex items-center justify-center gap-2">
        <i v-if="loading" class="fa-solid fa-spinner animate-spin"></i>
        <i v-else class="fas fa-sign-in-alt"></i>
        <span>{{ loading ? 'Đang xử lý...' : 'Đăng nhập' }}</span>
      </button>
    </div>
  </form>
</template>

<script>
import { reactive, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginForm',
  emits: ['switch-mode'],
  setup(props, { emit }) {
    const store = useStore()
    const router = useRouter()
    const showPassword = ref(false)

    const form = reactive({
      email: '',
      password: '',
      remember: false
    })

    const loading = computed(() => store.getters['auth/isLoading'])
    const error = computed(() => store.getters['auth/authError'])

    const handleSubmit = async () => {
      try {
        const response = await store.dispatch('auth/login', {
          username: form.email,
          password: form.password
        })
        if (response && response.access) {
          localStorage.setItem('token', response.access)
          // Kiểm tra nếu user id = 1 thì điều hướng đến admin
          if (response.user && response.user.id === 1) {
            router.push('/admin')
          }
          setTimeout(() => {
            window.location.reload()
          }, 1000)  
        }
      } catch (error) {
        console.error('Login failed:', error)
      }
    }

    return {
      form,
      loading,
      error,
      handleSubmit,
      showPassword
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
