<template>
  <footer v-if="!isAdmin" class="bg-white border-t border-gray-100 mt-12 py-8">
    <div class="container mx-auto px-4">
      <div class="text-center text-gray-600 text-sm">
        <p>&copy; {{ currentYear }} Kinnect - Hệ thống hỗ trợ tìm kiếm và nhận dạng người thân thất lạc.</p>
        <div class="mt-2 text-xs text-gray-500">
          <a href="#" class="hover:underline mx-2">Chính sách bảo mật</a>
          <span class="mx-1">|</span>
          <a href="#" class="hover:underline mx-2">Điều khoản sử dụng</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { computed, ref, onMounted } from 'vue'

export default {
  name: 'AppFooter',
  setup() {
    const currentYear = computed(() => new Date().getFullYear())
    const isAdmin = ref(false)
    
    onMounted(() => {
      // Kiểm tra thông tin người dùng trong localStorage
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const userData = JSON.parse(userStr)
          isAdmin.value = userData.is_admin === true
        } catch (error) {
          console.error('Lỗi khi phân tích dữ liệu người dùng:', error)
        }
      }
    })
    
    return {
      currentYear,
      isAdmin
    }
  }
}
</script>