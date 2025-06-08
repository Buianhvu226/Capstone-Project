<template>
  <div class="pt-10 pb-16 bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4"> <!-- Header Section -->
      <div class="relative z-10 p-6">
        <div class="flex items-center gap-4">
          <div class="bg-blue-500 p-3 rounded-lg shadow-sm flex-shrink-0">
            <i class="fas fa-user-circle text-white text-2xl"></i>
          </div>
          <div class="flex flex-col">
            <h1 class="text-3xl font-bold text-gray-800 mb-1">Hồ sơ của tôi</h1>
            <p class="text-gray-600 text-lg">Quản lý các hồ sơ tìm kiếm người thân của bạn</p>
          </div>
        </div>
      </div>

      <!-- Edit Success Message -->
      <div v-if="editSuccess"
        class="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg animate__animated animate__fadeIn">
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="fas fa-check-circle text-green-600"></i>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">Cập nhật thành công</h3>
            <div class="mt-2 text-sm text-green-700">
              <p>Hồ sơ đã được cập nhật thành công. Hồ sơ cũ đã được xóa và thay thế bằng hồ sơ mới.</p>
            </div>
            <div class="mt-2">
              <router-link :to="`/profile/${newProfileId}`"
                class="text-green-700 hover:text-green-900 font-medium text-sm flex items-center">
                <span>Xem hồ sơ mới</span>
                <i class="fas fa-arrow-right ml-1"></i>
              </router-link>
            </div>
          </div>
          <button @click="dismissEditSuccess" class="ml-auto flex-shrink-0 text-green-500 hover:text-green-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="bg-white rounded-xl shadow-sm mb-8">
        <div class="flex overflow-x-auto scrollbar-hide border-b border-gray-100">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" class="flex-shrink-0" :class="[
            'px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors flex items-center gap-2',
            activeTab === tab.id
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-600 hover:text-gray-900'
          ]">
            <i :class="tab.icon"></i>
            {{ tab.name }}
            <span class="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-0.5">
              {{ tab.count }}
            </span>
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <TabMyProfiles v-if="activeTab === 'my_profiles'" @update-count="updateTabCount('my_profiles', $event)" />
      <TabSuggestedProfiles v-else-if="activeTab === 'suggested'" @update-count="updateTabCount('suggested', $event)" />
      <TabReferencedProfiles v-else-if="activeTab === 'referenced'"
        @update-count="updateTabCount('referenced', $event)" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TabMyProfiles from '../components/profile/TabMyProfiles.vue'
import TabSuggestedProfiles from '../components/profile/TabSuggestedProfiles.vue'
import TabReferencedProfiles from '../components/profile/TabReferencedProfiles.vue'

export default {
  name: 'MyProfileView',

  components: {
    TabMyProfiles,
    TabSuggestedProfiles,
    TabReferencedProfiles
  },

  setup() {
    // Router và Route
    const router = useRouter()
    const route = useRoute()

    // Edit Success Message
    const editSuccess = ref(route.query.action === 'edit-success')
    const newProfileId = ref(route.query.newId)

    const dismissEditSuccess = () => {
      editSuccess.value = false
      router.replace({ path: route.path, query: {} })
    }

    // State
    const tabs = ref([
      { id: 'my_profiles', name: 'Hồ sơ của tôi', icon: 'fas fa-folder', count: 0 },
      { id: 'suggested', name: 'Gợi ý cho tôi', icon: 'fas fa-lightbulb', count: 0 },
      { id: 'referenced', name: 'Hồ sơ tham chiếu', icon: 'fas fa-link', count: 0 }
    ])
    const activeTab = ref('my_profiles')

    // Cập nhật số lượng cho tab
    const updateTabCount = (tabId, count) => {
      const tabIndex = tabs.value.findIndex(tab => tab.id === tabId)
      if (tabIndex !== -1) {
        tabs.value[tabIndex].count = count
      }
    }

    onMounted(() => {
      // Xóa thông báo thành công sau 5 giây
      if (editSuccess.value) {
        setTimeout(() => {
          dismissEditSuccess()
        }, 5000)
      }
    })

    return {
      tabs,
      activeTab,
      editSuccess,
      newProfileId,
      dismissEditSuccess,
      updateTabCount
    }
  }
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>