<template>
  <div>
    <div v-if="loading" class="flex justify-center py-12">
      <AppLoader />
    </div>
    
    <div v-else-if="profile">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">{{ profile.fullName }}</h1>
        
        <div v-if="isOwner">
          <router-link :to="`/profile/${profile.id}/edit`" class="btn btn-secondary mr-2">
            Chỉnh sửa
          </router-link>
        </div>
        <div v-else>
          <button @click="startConversation" class="btn btn-primary">
            Liên hệ
          </button>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="md:flex">
          <div class="md:w-1/3 p-6">
            <div v-if="profile.images && profile.images.length" class="mb-6">
              <img :src="profile.images[0]" alt="Profile image" class="w-full h-auto rounded-lg" />
              
              <div v-if="profile.images.length > 1" class="grid grid-cols-3 gap-2 mt-2">
                <img 
                  v-for="(image, index) in profile.images.slice(1, 4)" 
                  :key="index" 
                  :src="image" 
                  alt="Additional image" 
                  class="w-full h-20 object-cover rounded-md"
                />
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-medium text-gray-500">Tuổi</h3>
                <p>{{ profile.age || 'Không có thông tin' }}</p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-500">Giới tính</h3>
                <p>{{ formatGender(profile.gender) }}</p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-500">Địa điểm cuối cùng gặp</h3>
                <p>{{ profile.lastSeenLocation || 'Không có thông tin' }}</p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-500">Ngày cuối cùng gặp</h3>
                <p>{{ formatDate(profile.lastSeenDate) }}</p>
              </div>
              
              <div v-if="profile.contactInfo">
                <h3 class="text-sm font-medium text-gray-500">Thông tin liên hệ</h3>
                <p>{{ profile.contactInfo }}</p>
              </div>
            </div>
          </div>
          
          <div class="md:w-2/3 border-t md:border-t-0 md:border-l border-gray-200 p-6">
            <h2 class="text-xl font-semibold mb-4">Thông tin chi tiết</h2>
            <div class="prose max-w-none">
              <p>{{ profile.description }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="isOwner && suggestedProfiles.length > 0" class="mt-12">
        <h2 class="text-xl font-semibold mb-6">Hồ sơ có thể liên quan</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="profile in suggestedProfiles" 
            :key="profile.id" 
            class="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div class="p-4">
              <h3 class="font-semibold text-lg mb-2">{{ profile.fullName }}</h3>
              <p class="text-gray-600 line-clamp-3">{{ profile.description }}</p>
              <div class="mt-4">
                <router-link :to="`/profile/${profile.id}`" class="text-primary-600 hover:underline">
                  Xem chi tiết
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="bg-white rounded-lg p-8 text-center">
      <p class="text-gray-600 mb-4">Không tìm thấy hồ sơ.</p>
      <router-link to="/" class="btn btn-primary">
        Quay lại trang chủ
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import AppLoader from '../components/common/AppLoader.vue'

export default {
  name: 'ProfileDetailView',
  components: {
    AppLoader
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    
    const profileId = computed(() => route.params.id)
    const profile = computed(() => store.getters['profile/currentProfile'])
    const suggestedProfiles = computed(() => store.getters['profile/suggestedProfiles'])
    const currentUser = computed(() => store.getters['auth/currentUser'])
    const loading = computed(() => store.getters['profile/isLoading'])
    
    const isOwner = computed(() => {
      if (!profile.value || !currentUser.value) return false
      return profile.value.userId === currentUser.value.id
    })
    
    const formatGender = (gender) => {
      if (!gender) return 'Không có thông tin'
      const genders = {
        male: 'Nam',
        female: 'Nữ',
        other: 'Khác'
      }
      return genders[gender] || gender
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return 'Không có thông tin'
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('vi-VN').format(date)
    }
    
    const startConversation = async () => {
      if (!profile.value) return
      
      try {
        const conversation = await store.dispatch('message/startConversation', profile.value.userId)
        router.push({ name: 'message-detail', params: { userId: conversation.id } })
      } catch (error) {
        console.error('Failed to start conversation:', error)
      }
    }
    
    onMounted(async () => {
      try {
        await store.dispatch('profile/fetchProfileById', profileId.value)
        if (isOwner.value) {
          await store.dispatch('profile/fetchSuggestedProfiles', profileId.value)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      }
    })
    
    return {
      profile,
      suggestedProfiles,
      isOwner,
      loading,
      formatGender,
      formatDate,
      startConversation
    }
  }
}
</script>