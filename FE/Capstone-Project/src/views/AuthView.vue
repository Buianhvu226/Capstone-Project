<template>
  <div class="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100">
    <!-- Left Panel with Illustration & Info -->
    <div class="relative flex-1 hidden lg:flex items-center justify-center px-10 py-12 bg-gradient-to-br from-blue-100 via-purple-100 to-blue-50">
      <div class="max-w-xl w-full text-center space-y-8">
        <img src="@/assets/images/logo1.png" alt="Logo" class="mx-auto w-32 mb-6 drop-shadow-lg" />
        <h1 class="text-4xl font-extrabold text-gray-700 mb-2 tracking-tight">
          Hệ thống tìm kiếm người thân
        </h1>
        <p class="text-lg text-gray-500 mb-6">
          Kết nối, tìm kiếm và đoàn tụ với người thân đã mất tích. Trải nghiệm công nghệ hiện đại với giao diện thân thiện, nhẹ nhàng và ấm áp.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          <div v-for="(feature, index) in features" :key="index"
            class="flex flex-col items-center bg-white bg-opacity-70 rounded-xl shadow p-5 transition hover:shadow-lg">
            <i :class="feature.icon" class="text-3xl text-purple-500 mb-3"></i>
            <h3 class="font-semibold text-base text-gray-700 mb-1">{{ feature.title }}</h3>
            <p class="text-xs text-gray-500">{{ feature.description }}</p>
          </div>
        </div>
        <p class="mt-10 text-xs text-gray-400">
          © 2025 Hệ thống tìm kiếm người thân
        </p>
      </div>
    </div>

    <!-- Right Panel for Login/Register -->
    <div class="flex flex-col items-center justify-center w-full lg:w-[480px] px-4 py-12 bg-white bg-opacity-80 shadow-2xl relative z-10">
      <div class="w-full max-w-md rounded-2xl shadow-xl p-8 bg-white bg-opacity-90">
        <div class="text-center mb-8">
          <img src="@/assets/images/logo1.png" alt="Logo" class="mx-auto w-16 mb-4" />
          <h2 class="text-2xl font-bold text-gray-700 mb-1">
            {{ isLogin ? 'Đăng nhập' : 'Đăng ký' }}
          </h2>
          <p class="text-gray-500 text-sm">
            {{ isLogin ? 'Chào mừng trở lại! Hãy kết nối với cộng đồng.' : 'Bắt đầu hành trình kết nối gia đình.' }}
          </p>
        </div>
        <transition name="fade-slide" mode="out-in">
          <LoginForm v-if="isLogin" @switch-mode="isLogin = false" />
          <RegisterForm v-else @switch-mode="isLogin = true" />
        </transition>
        <div class="mt-6 text-center">
          <p class="text-gray-500 text-sm">
            {{ isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?' }}
            <button @click="isLogin = !isLogin"
              class="ml-2 px-4 py-1 bg-gradient-to-r from-purple-400 to-blue-400 text-white rounded-full transition hover:shadow-lg">
              {{ isLogin ? 'Đăng ký ngay' : 'Đăng nhập' }}
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import LoginForm from '../components/auth/LoginForm.vue'
import RegisterForm from '../components/auth/RegisterForm.vue'
import 'animate.css'

export default {
  name: 'AuthView',
  components: {
    LoginForm,
    RegisterForm
  },
  setup() {
    const isLogin = ref(true)
    const features = [
      {
        icon: 'fa-solid fa-magnifying-glass',
        title: 'Tìm kiếm thông minh',
        description: 'Công nghệ AI giúp tìm kiếm thông tin nhanh chóng, chính xác.'
      },
      {
        icon: 'fa-solid fa-people-group',
        title: 'Kết nối cộng đồng',
        description: 'Cùng nhau chia sẻ, hỗ trợ và kết nối các gia đình.'
      },
      {
        icon: 'fa-solid fa-bell',
        title: 'Thông báo kịp thời',
        description: 'Nhận thông báo mới nhất về hồ sơ và hoạt động của bạn.'
      }
    ]
    return {
      isLogin,
      features
    }
  }
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(.4,0,.2,1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>