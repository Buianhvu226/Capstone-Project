<template>
  <div class="min-h-screen bg-slate-50">
    <AppHeader />
    <div class="max-w-7xl mx-auto px-3 sm:px-4 pt-20 pb-8">
      <MyProfileGuideTour v-if="showGuideTour" :is-active="showGuideTour" @close="closeGuideTour" />

      <!-- Hero Section -->
      <section id="my-profile-hero" class="bg-white rounded-lg p-3 mb-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <i class="fas fa-user-circle text-base"></i>
            </div>
            <div>
              <h1 class="text-base font-bold text-slate-800">Hồ sơ của tôi</h1>
              <p class="text-xs text-slate-500">Quản lý các hồ sơ tìm kiếm người thân của bạn</p>
            </div>
          </div>
          <button
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 border border-blue-200 hover:border-blue-400 transition-colors disabled:opacity-50"
            :disabled="showGuideTour" @click="startGuideTour">
            <i class="fas fa-question-circle text-xs"></i>
            Hướng dẫn
          </button>
        </div>
      </section>

      <!-- Edit Success Message -->
      <div v-if="editSuccess" class="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0">
            <i class="fas fa-check-circle text-green-600 text-sm"></i>
          </div>
          <div class="flex-1">
            <h3 class="text-xs font-semibold text-green-800 mb-1">Cập nhật thành công</h3>
            <p class="text-xs text-green-700 mb-2">
              Hồ sơ đã được cập nhật thành công. Hồ sơ cũ đã được xóa và thay thế bằng hồ sơ mới.
            </p>
            <router-link :to="`/profile/${newProfileId}`"
              class="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-800">
              <span>Xem hồ sơ mới</span>
              <i class="fas fa-arrow-right text-[10px]"></i>
            </router-link>
          </div>
          <button @click="dismissEditSuccess" class="flex-shrink-0 text-green-500 hover:text-green-700 p-1">
            <i class="fas fa-times text-xs"></i>
          </button>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="bg-white rounded-lg border border-slate-200 mb-3">
        <div class="flex overflow-x-auto scrollbar-hide">
          <button v-for="tab in tabs" :key="tab.id" @click="handleTabChange(tab.id)"
            :id="`tab-${tab.id}`"
            class="flex-shrink-0 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 border-b-2"
            :class="activeTab === tab.id
              ? 'text-blue-500 border-blue-500 bg-blue-50/50'
              : 'text-slate-600 hover:text-slate-800 border-transparent hover:border-slate-200'">
            <i :class="`${tab.icon} text-xs`"></i>
            <span>{{ tab.name }}</span>
            <span class="bg-slate-100 text-slate-600 text-[10px] rounded-full px-1.5 py-0.5 font-semibold">
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
import AppHeader from '@/components/common/AppHeader.vue'
import TabMyProfiles from '@/components/profile/tabs/TabMyProfiles.vue'
import TabSuggestedProfiles from '@/components/profile/tabs/TabSuggestedProfiles.vue'
import TabReferencedProfiles from '@/components/profile/tabs/TabReferencedProfiles.vue'
import MyProfileGuideTour from '@/components/profile/guides/MyProfileGuideTour.vue'

export default {
  name: 'MyProfileView',

  components: {
    AppHeader,
    TabMyProfiles,
    TabSuggestedProfiles,
    TabReferencedProfiles,
    MyProfileGuideTour
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
      const query = { ...route.query }
      delete query.action
      delete query.newId
      router.replace({ path: route.path, query })
    }

    // State
    const tabs = ref([
      { id: 'my_profiles', name: 'Hồ sơ của tôi', icon: 'fas fa-folder', count: 0 },
      { id: 'suggested', name: 'Gợi ý cho tôi', icon: 'fas fa-lightbulb', count: 0 },
      { id: 'referenced', name: 'Hồ sơ tham chiếu', icon: 'fas fa-link', count: 0 }
    ])
    
    // Khôi phục tab từ URL query params, mặc định là 'my_profiles'
    const activeTab = ref(route.query.tab || 'my_profiles')
    
    // Cập nhật URL khi tab thay đổi
    const handleTabChange = (tabId) => {
      activeTab.value = tabId
      const query = { ...route.query, tab: tabId }
      router.replace({ path: route.path, query })
    }

    // Cập nhật số lượng cho tab
    const updateTabCount = (tabId, count) => {
      const tabIndex = tabs.value.findIndex(tab => tab.id === tabId)
      if (tabIndex !== -1) {
        tabs.value[tabIndex].count = count
      }
    }

    // Guide Tour
    const showGuideTour = ref(false)
    const MY_PROFILE_GUIDE_KEY = 'hasSeenMyProfileGuide'

    const startGuideTour = () => {
      showGuideTour.value = true
    }

    const closeGuideTour = () => {
      showGuideTour.value = false
      localStorage.setItem(MY_PROFILE_GUIDE_KEY, 'true')
    }

    onMounted(() => {
      // Xóa thông báo thành công sau 5 giây
      if (editSuccess.value) {
        setTimeout(() => {
          dismissEditSuccess()
        }, 5000)
      }
      
      // Tự động hiển thị guide tour lần đầu
      if (!localStorage.getItem(MY_PROFILE_GUIDE_KEY)) {
        setTimeout(() => {
          showGuideTour.value = true
        }, 500)
      }
    })

    return {
      tabs,
      activeTab,
      editSuccess,
      newProfileId,
      dismissEditSuccess,
      updateTabCount,
      handleTabChange,
      showGuideTour,
      startGuideTour,
      closeGuideTour
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