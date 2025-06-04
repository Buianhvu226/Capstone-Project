<template>
  <div class="bg-gray-50 min-h-screen pt-16 pb-10">
    <AppHeader />

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 px-4 mb-10">
      <div class="container mx-auto text-center text-white">
        <h1 class="text-4xl font-bold mb-4">Tìm kiếm người thân thất lạc gần đây</h1>
        <p class="text-xl mb-8 max-w-3xl mx-auto opacity-80">
          Tìm kiếm người thân thất lạc trong thời gian gần đây bằng công nghệ nhận diện khuôn mặt
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link to="/recently-missing/create"
            class="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg shadow hover:shadow-lg transition-all font-medium flex items-center">
            <i class="fas fa-plus-circle mr-2"></i> Đăng hồ sơ mới
          </router-link>
          <button @click="scrollToSearch"
            class="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg transition-all font-medium flex items-center">
            <i class="fas fa-search mr-2"></i> Tìm kiếm hồ sơ
          </button>
        </div>
      </div>
    </section>

    <!-- Container -->
    <div class="container mx-auto px-4">
      <!-- Tab Navigation -->
      <section class="bg-white rounded-xl shadow-lg mb-6 border border-gray-100">
        <div class="flex border-b border-gray-200">
          <button @click="setActiveTab('seeker')" :class="{
            'border-b-2 border-blue-500 text-blue-600': activeTab === 'seeker',
            'text-gray-500 hover:text-gray-700': activeTab !== 'seeker'
          }" class="flex-1 py-4 px-6 text-center font-medium transition-colors">
            <i class="fas fa-search mr-2"></i>
            Người đi tìm ({{ seekerCount }})
          </button>
          <button @click="setActiveTab('finder')" :class="{
            'border-b-2 border-green-500 text-green-600': activeTab === 'finder',
            'text-gray-500 hover:text-gray-700': activeTab !== 'finder'
          }" class="flex-1 py-4 px-6 text-center font-medium transition-colors">
            <i class="fas fa-eye mr-2"></i>
            Người cung cấp thông tin ({{ finderCount }})
          </button>
          <!-- Danh sách report của tôi -->
          <button @click="setActiveTab('my-report')" :class="{
            'border-b-2 border-yellow-500 text-yellow-600': activeTab === 'my-report',
            'text-gray-500 hover:text-gray-700': activeTab !== 'my-report'
          }" class="flex-1 py-4 px-6 text-center font-medium transition-colors">
            <i class="fas fa-search mr-2"></i>
            Báo cáo của tôi ({{ myReportCount }})
          </button>
        </div>
      </section>

      <!-- Filter Section -->
      <section ref="searchSection" class="bg-white rounded-xl shadow-lg p-6 mb-10 border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-800 flex items-center">
            <i class="fas fa-filter text-blue-500 mr-2"></i> Bộ lọc tìm kiếm
          </h2>
          <button @click="showFilters = !showFilters"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
            {{ showFilters ? 'Thu gọn' : 'Mở rộng' }}
            <i :class="showFilters ? 'fas fa-chevron-up ml-1' : 'fas fa-chevron-down ml-1'"></i>
          </button>
        </div>

        <div v-show="showFilters" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Tên người thất lạc -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Tên người thất lạc</label>
              <input v-model="filters.name" type="text" id="name"
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập tên người thất lạc..." />
            </div>

            <!-- Trạng thái -->
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select v-model="filters.status" id="status"
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="">Tất cả</option>
                <option value="active">Đang tìm kiếm</option>
                <option value="found">Đã tìm thấy</option>
                <option value="closed">Đã đóng</option>
              </select>
            </div>
          </div>

          <!-- Địa điểm -->
          <div>
            <label for="location" class="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
            <input v-model="filters.location" type="text" id="location"
              class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Địa điểm mất tích hoặc gặp thấy..." />
          </div>
        </div>

        <!-- Filter buttons -->
        <div class="flex justify-end mt-6">
          <button @click="resetFilters"
            class="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 mr-3 transition-colors">
            <i class="fas fa-redo-alt mr-2"></i> Đặt lại
          </button>
          <button @click="applyFilters"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            <i class="fas fa-search mr-2"></i> Tìm kiếm
          </button>
        </div>
      </section>

      <!-- Results Section -->
      <section>
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-start">
            <div class="bg-blue-100 p-2 rounded-full mr-3 shadow-sm">
              <i :class="{
                'fas fa-search text-blue-600': activeTab === 'seeker',
                'fas fa-eye text-green-600': activeTab === 'finder',
                'fas fa-user-edit text-yellow-600': activeTab === 'my-report'
              }"></i>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-800">
                {{ activeTab === 'seeker' ? 'Danh sách người đi tìm' : 
                   activeTab === 'finder' ? 'Danh sách người cung cấp thông tin' : 
                   'Báo cáo của tôi' }}
              </h2>
              <p class="text-gray-600 text-sm">{{ filteredProfiles.length }} hồ sơ được tìm thấy</p>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12">
          <AppLoader />
        </div>

        <!-- Empty State -->
        <div v-else-if="!loading && filteredProfiles.length === 0" class="bg-white rounded-lg p-8 text-center">
          <div class="inline-block p-4 bg-blue-50 rounded-full mb-4">
            <i class="fas fa-search text-blue-400 text-4xl"></i>
          </div>
          <h3 class="text-xl font-medium text-gray-700 mb-2">Không tìm thấy kết quả</h3>
          <p class="text-gray-500 mb-6">
            Không có hồ sơ {{ 
              activeTab === 'seeker' ? 'người đi tìm' : 
              activeTab === 'finder' ? 'người cung cấp thông tin' : 
              'của bạn' 
            }} nào phù hợp với tiêu chí tìm kiếm của bạn
          </p>
          <router-link to="/recently-missing/create"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center transition-colors">
            <i class="fas fa-plus-circle mr-2"></i> Đăng hồ sơ mới
          </router-link>
        </div>

        <!-- Results List -->
        <template v-else>
          <RecentlyMissingList :profiles="paginatedProfiles" :current-user="currentUser" />

          <!-- Pagination -->
          <div class="mt-10" v-if="totalPages > 1">
            <AppPagination :current-page="currentPage" :total-pages="totalPages" @page-change="changePage" />
            <div class="text-center text-sm text-gray-600 mt-2">
              Hiển thị {{ paginatedProfiles.length }} hồ sơ trong tổng số {{ filteredProfiles.length }} hồ sơ
            </div>
          </div>
        </template>

      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import AppLoader from '@/components/common/AppLoader.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import RecentlyMissingList from '@/components/recentlyMissing/RecentlyMissingList.vue'

export default {
  name: 'RecentlyMissingListView',

  components: {
    AppHeader,
    AppLoader,
    AppPagination,
    RecentlyMissingList
  },

  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const searchSection = ref(null)

    // ✅ Safe computed with fallback
    const allProfiles = computed(() => {
      const profiles = store.getters['recentlyMissing/getProfiles'] ||
        store.getters['recentlyMissing/publicMissingReports'] ||
        [];
      console.log('📋 All profiles from store:', profiles);
      return profiles;
    })

    const myReports = computed(() => {
      const reports = store.getters['recentlyMissing/myReports'] || [];
      console.log('📋 My reports from store:', reports);
      return reports;
    })

    const loading = computed(() => {
      const isLoading = store.getters['recentlyMissing/isLoading'] ||
        store.getters['recentlyMissing/loading'] ||
        false;
      console.log('⏳ Loading state:', isLoading);
      return isLoading;
    })

    const error = computed(() => {
      const errorState = store.getters['recentlyMissing/getError'] ||
        store.getters['recentlyMissing/error'] ||
        null;
      console.log('❌ Error state:', errorState);
      return errorState;
    })

    // ✅ Current user với fallback về localStorage - KHÔNG ép buộc authentication
    const currentUser = computed(() => {
      const storeUser = store.getters['auth/currentUser'];
      if (storeUser) {
        console.log('🔍 Current user from store:', storeUser);
        return storeUser;
      }

      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const localUser = JSON.parse(userStr);
          console.log('🔍 Current user from localStorage:', localUser);
          return localUser;
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }

      console.log('🔍 No current user found - but that\'s OK for public page');
      return null; // ✅ Trả về null là bình thường cho trang public
    });

    // ✅ Kiểm tra trạng thái đăng nhập với fallback - OPTIONAL cho trang này
    const isAuthenticated = computed(() => {
      const authStatus = store.getters['auth/isAuthenticated'];
      const hasToken = localStorage.getItem('token');
      const result = authStatus || !!hasToken;
      console.log('🔐 Is authenticated:', result, { authStatus, hasToken: !!hasToken });
      return result;
    })

    const activeTab = ref('seeker')
    const showFilters = ref(false)
    const currentPage = ref(1)
    const itemsPerPage = 5

    const filters = ref({
      name: '',
      status: '',
      location: ''
    })

    // ✅ Safe filter với additional checks và improved user matching
    const filteredProfiles = computed(() => {
      // Nếu đang ở tab "Báo cáo của tôi", sử dụng myReports
      if (activeTab.value === 'my-report') {
        if (!Array.isArray(myReports.value)) {
          console.warn('⚠️ myReports is not an array:', myReports.value);
          return [];
        }
        
        let reports = myReports.value;
        
        // Apply search filters với safe checking
        if (filters.value.name && filters.value.name.trim()) {
          reports = reports.filter(report => {
            const name = report.name || '';
            const title = report.title || '';
            const searchTerm = filters.value.name.toLowerCase();
    
            return name.toLowerCase().includes(searchTerm) ||
              title.toLowerCase().includes(searchTerm);
          });
        }
    
        if (filters.value.status && filters.value.status.trim()) {
          reports = reports.filter(report => report.status === filters.value.status);
        }
    
        if (filters.value.location && filters.value.location.trim()) {
          reports = reports.filter(report => {
            const location = report.location || '';
            return location.toLowerCase().includes(filters.value.location.toLowerCase());
          });
        }
        
        // Sort by created date (newest first)
        return reports.sort((a, b) => {
          const aDate = new Date(a.created_at || 0);
          const bDate = new Date(b.created_at || 0);
          return bDate - aDate;
        });
      }
      
      // ✅ Early return nếu allProfiles không phải array
      if (!Array.isArray(allProfiles.value)) {
        console.warn('⚠️ allProfiles is not an array:', allProfiles.value);
        return [];
      }

      let profiles = allProfiles.value.filter(profile => {
        return profile && profile.profile_type === activeTab.value;
      });

      // Apply search filters với safe checking
      if (filters.value.name && filters.value.name.trim()) {
        profiles = profiles.filter(profile => {
          const name = profile.name || '';
          const title = profile.title || '';
          const searchTerm = filters.value.name.toLowerCase();

          return name.toLowerCase().includes(searchTerm) ||
            title.toLowerCase().includes(searchTerm);
        });
      }

      if (filters.value.status && filters.value.status.trim()) {
        profiles = profiles.filter(profile => profile.status === filters.value.status);
      }

      if (filters.value.location && filters.value.location.trim()) {
        profiles = profiles.filter(profile => {
          const location = profile.location || '';
          return location.toLowerCase().includes(filters.value.location.toLowerCase());
        });
      }

      // ✅ Sort: own profiles first (if user is logged in), then by created date
      return profiles.sort((a, b) => {
        // Own profiles first - CHỈ khi user đã đăng nhập
        if (currentUser.value) {
          const currentUsername = currentUser.value.username || currentUser.value.email;
          const currentId = currentUser.value.id;

          const aIsOwn = (a.username === currentUsername) ||
            (a.username === currentUser.value.email) ||
            (a.user_id === currentId) ||
            (a.created_by === currentId);

          const bIsOwn = (b.username === currentUsername) ||
            (b.username === currentUser.value.email) ||
            (b.user_id === currentId) ||
            (b.created_by === currentId);

          if (aIsOwn && !bIsOwn) return -1;
          if (!aIsOwn && bIsOwn) return 1;
        }

        // Then by created date (newest first)
        const aDate = new Date(a.created_at || 0);
        const bDate = new Date(b.created_at || 0);
        return bDate - aDate;
      });
    })

    // Pagination
    const totalPages = computed(() => Math.ceil(filteredProfiles.value.length / itemsPerPage))

    const paginatedProfiles = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredProfiles.value.slice(start, end)
    })

    // Counts for tabs với safe checking
    const seekerCount = computed(() => {
      if (!Array.isArray(allProfiles.value)) return 0;
      return allProfiles.value.filter(p => p && p.profile_type === 'seeker').length;
    })

    const finderCount = computed(() => {
      if (!Array.isArray(allProfiles.value)) return 0;
      return allProfiles.value.filter(p => p && p.profile_type === 'finder').length;
    })

    const myReportCount = computed(() => {
      if (!Array.isArray(myReports.value)) return 0;
      return myReports.value.length;
    })

    // Methods
    const setActiveTab = (tab) => {
      activeTab.value = tab;
      currentPage.value = 1; // Reset về trang đầu tiên
      if (tab === 'my-report') {
        store.dispatch('recentlyMissing/fetchMyReports'); // Gọi action lấy báo cáo của tôi
      }
    }

    // ✅ Fetch function - KHÔNG cần authentication
    const fetchProfiles = async () => {
      try {
        console.log('📤 Fetching public missing reports...');

        await store.dispatch('recentlyMissing/fetchPublicMissingReports', {
          page_size: 100 // Get all profiles to handle filtering and pagination on frontend
        });

        console.log('✅ Fetch completed');
      } catch (err) {
        console.error('❌ Failed to fetch missing reports:', err);
        // KHÔNG throw error - trang vẫn có thể hiển thị được
      }
    }

    const applyFilters = () => {
      currentPage.value = 1 // Reset to first page when applying filters
    }

    const resetFilters = () => {
      filters.value = {
        name: '',
        status: '',
        location: ''
      }
      currentPage.value = 1
    }

    const changePage = (page) => {
      currentPage.value = page

      // Scroll to search section
      if (searchSection.value) {
        window.scrollTo({
          top: searchSection.value.offsetTop - 100,
          behavior: 'smooth'
        })
      }
    }

    const scrollToSearch = () => {
      if (searchSection.value) {
        window.scrollTo({
          top: searchSection.value.offsetTop - 100,
          behavior: 'smooth'
        })
      }
      showFilters.value = true
    }

    // ✅ Load user nếu có token - OPTIONAL, không ép buộc
    const loadUserIfNeeded = async () => {
      const hasToken = localStorage.getItem('token');
      const storeUser = store.getters['auth/currentUser'];

      if (hasToken && !storeUser) {
        try {
          console.log('🔄 Loading user from server (optional)...');
          await store.dispatch('auth/initializeAuth');
        } catch (error) {
          console.warn('⚠️ Failed to load user - continuing as anonymous:', error);
          // KHÔNG throw error - user có thể xem trang như anonymous
        }
      } else {
        console.log('ℹ️ No token or user already loaded - continuing...');
      }
    }

    // ✅ Fetch initial data - KHÔNG depend vào authentication
    onMounted(async () => {
      console.log('🚀 Component mounted, loading data...');

      // Load data song song, không depend vào nhau
      await Promise.allSettled([
        loadUserIfNeeded(), // Optional
        fetchProfiles()     // Required
      ]);

      console.log('✅ Page initialization completed');
    })

    return {
      allProfiles,
      filteredProfiles,
      paginatedProfiles,
      myReports,
      myReportCount,
      loading,
      error,
      currentUser,
      isAuthenticated,
      activeTab,
      showFilters,
      currentPage,
      totalPages,
      seekerCount,
      finderCount,
      filters,
      searchSection,
      setActiveTab,
      fetchProfiles,
      applyFilters,
      resetFilters,
      changePage,
      scrollToSearch
    }
  }
}
</script>
