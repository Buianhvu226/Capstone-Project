<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <transition name="fade">
      <div v-if="error"
        class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm flex items-center">
        <i class="fa-solid fa-circle-exclamation w-5 h-5 mr-2 flex-shrink-0"></i>
        <span>{{ error }}</span>
      </div>
    </transition>

    <div class="group">
      <label for="email"
        class="block text-sm font-medium text-gray-700 mb-1 transition-all group-focus-within:text-primary-600">Email</label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <i class="fa-solid fa-envelope w-5 h-5"></i>
        </div>
        <input id="email" v-model="form.email" type="email"
          class="input pl-10 transition-all border-gray-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
          required />
      </div>
    </div>

    <div class="group">
      <label for="password"
        class="block text-sm font-medium text-gray-700 mb-1 transition-all group-focus-within:text-primary-600">Mật
        khẩu</label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <i class="fa-solid fa-lock w-5 h-5"></i>
        </div>
        <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
          class="input pl-10 pr-10 transition-all border-gray-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
          required />
        <button type="button" @click="showPassword = !showPassword"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
          <i v-if="showPassword" class="fa-solid fa-eye-slash w-5 h-5"></i>
          <i v-else class="fa-solid fa-eye w-5 h-5"></i>
        </button>
      </div>
    </div>

    <div class="flex items-center justify-end">
      <div class="text-sm">
        <a href="#" class="text-primary-600 hover:text-primary-500 font-medium transition-colors">
          Quên mật khẩu?
        </a>
      </div>
    </div>

    <div>
      <button type="submit" class="w-full py-3 flex justify-center items-center transition-all duration-300 transform hover:translate-y-[-2px] 
  bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800
  text-white bg-blue-400 font-medium rounded-lg shadow-md hover:shadow-lg focus:ring-4 focus:ring-primary-300" :disabled="loading">
        <i v-if="loading" class="fa-solid fa-spinner animate-spin -ml-1 mr-2 h-5 w-5 text-white"></i>
        <span v-if="loading" class="text-white">Đang xử lý...</span>
        <span class="flex items-center justify-center" v-else>
          <i class="fas fa-sign-in-alt mr-2"></i>
          <span>Đăng nhập</span>
        </span>
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
