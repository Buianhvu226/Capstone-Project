<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Đăng ký hồ sơ tìm kiếm</h1>
      <p class="text-gray-600">Nhập thông tin chi tiết về người thân bạn đang tìm kiếm.</p>
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-6">
      <ProfileForm 
        :loading="loading" 
        :error="error" 
        @submit="handleSubmit" 
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ProfileForm from '../components/profile/ProfileForm.vue'

export default {
  name: 'ProfileCreateView',
  components: {
    ProfileForm
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const loading = computed(() => store.getters['profile/isLoading'])
    const error = computed(() => store.getters['profile/hasError'])
    
    const handleSubmit = async (profileData) => {
      try {
        const newProfile = await store.dispatch('profile/createProfile', profileData)
        router.push({ name: 'profile-detail', params: { id: newProfile.id } })
      } catch (error) {
        console.error('Failed to create profile:', error)
      }
    }
    
    return {
      loading,
      error,
      handleSubmit
    }
  }
}
</script>