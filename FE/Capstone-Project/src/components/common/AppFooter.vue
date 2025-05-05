<template>
  <footer class="bg-white border-t mt-12 py-6">
    <div class="container mx-auto px-4">
      <div class="text-center text-gray-500 text-sm">
        <p>&copy; {{ currentYear }} Hệ thống hỗ trợ tìm kiếm người thân thất lạc lâu năm</p>
      </div>
    </div>
  </footer>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'AppFooter',
  setup() {
    const currentYear = computed(() => new Date().getFullYear())
    
    return {
      currentYear
    }
  }
}
</script>