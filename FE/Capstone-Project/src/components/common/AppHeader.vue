<template>
  <header class="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
    <div class="container mx-auto flex items-center justify-between px-4 py-2">
      <!-- Logo -->
      <div class="flex items-center">
        <img src="@/assets/images/logo1.png" alt="Logo" class="w-[8rem] h-[3rem] object-contain mr-3" />
      </div>
      <!-- Navigation Links -->
      <nav class="flex-1 flex items-center space-x-6">
        <router-link to="/" class="font-semibold text-purple-600">Trang chủ</router-link>
        <router-link to="/search" class="text-gray-600 hover:text-purple-600">Tìm kiếm</router-link>
        <router-link to="/profile/create" class="text-gray-600 hover:text-purple-600">Đăng ký hồ sơ</router-link>
        <router-link to="/account" class="text-gray-600 hover:text-purple-600">Tài khoản</router-link>
        <router-link to="/support" class="text-gray-600 hover:text-purple-600">Hỗ trợ</router-link>
      </nav>
      <!-- Actions -->
      <div class="flex items-center space-x-3">
        <router-link to="/profile/create"
          class="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-semibold transition">
          Đăng tin tìm kiếm
        </router-link>
        <template v-if="isLoggedIn">
          <router-link to="/account"
            class="w-8 h-8 rounded-full flex items-center justify-center text-black text-xl hover:bg-purple-700 transition"
            title="Tài khoản">
            <i class="fa fa-user"></i>
          </router-link>
          <button @click="logout"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition">
            Đăng xuất
          </button>
        </template>
        <template v-else>
          <router-link to="/auth"
            class="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition">
            Đăng nhập
          </router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'AppHeader',
  setup() {
    const store = useStore()
    const router = useRouter()

    // Check login status by token in localStorage
    const isLoggedIn = computed(() => !!localStorage.getItem('token'))

    const logout = async () => {
      await store.dispatch('auth/logout')
      localStorage.removeItem('token')
      router.push('/auth')
    }

    return {
      logout,
      isLoggedIn
    }
  }
}
</script>