<template>
    <!-- Status Action Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-3 gap-3">
        <div class="flex items-center gap-2 w-full md:w-auto">
            <button id="btn-create-profile" @click="createNewProfile"
                class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 w-full md:w-auto justify-center">
                <i class="fas fa-plus-circle text-xs"></i>
                <span>Tạo hồ sơ mới</span>
            </button>
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto">
            <span class="text-xs text-slate-600">Sắp xếp:</span>
            <select v-model="currentSort" @change="handleSortChange"
                class="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
                <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </select>
        </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-lg border border-slate-200 p-6 flex justify-center">
        <div class="flex flex-col items-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p class="mt-3 text-xs text-slate-600">Đang tải hồ sơ...</p>
        </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white rounded-lg border border-slate-200 p-6 text-center">
        <div class="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <i class="fas fa-exclamation-triangle text-red-500 text-base"></i>
        </div>
        <h3 class="text-sm font-semibold text-slate-800 mb-1">Đã xảy ra lỗi</h3>
        <p class="text-xs text-slate-600 mb-4">{{ error }}</p>
        <button @click="fetchProfiles(1)"
            class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 mx-auto">
            <i class="fas fa-sync-alt text-xs"></i>
            <span>Thử lại</span>
        </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="profiles.length === 0" class="bg-white rounded-lg border border-slate-200 p-6 text-center">
        <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <i class="fas fa-folder-open text-blue-500 text-lg"></i>
        </div>
        <h3 class="text-sm font-semibold text-slate-800 mb-1">Chưa có hồ sơ nào</h3>
        <p class="text-xs text-slate-600 mb-4 max-w-md mx-auto">
            Bạn chưa tạo hồ sơ tìm kiếm người thân nào. Hãy bắt đầu hành trình kết nối bằng việc tạo hồ sơ đầu tiên.
        </p>
        <button @click="createNewProfile"
            class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 mx-auto">
            <i class="fas fa-plus-circle text-xs"></i>
            <span>Tạo hồ sơ ngay</span>
        </button>
    </div>

    <!-- Profile List -->
    <div v-else class="space-y-3 md:space-y-4">
        <div v-for="profile in profiles" :key="profile.id"
            class="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-lg border border-gray-200/80 hover:border-blue-300/60 transition-all duration-300 overflow-hidden group cursor-pointer relative">
            <!-- Accent line on hover -->
            <div
                class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            </div>

            <div class="flex flex-col md:flex-row">
                <!-- Phần ảnh -->
                <div
                    class="w-full md:w-[180px] lg:w-[200px] relative aspect-[4/3] md:aspect-square overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100">
                    <div class="absolute inset-0">
                        <img v-if="profile.images" :src="profile.images" :alt="`Ảnh của hồ sơ ${profile.title}`"
                            class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            @error="handleImageError" />
                        <div v-else
                            class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-gray-50 to-gray-100">
                            <img :src="noImage" alt="Không có hình ảnh"
                                class="w-16 h-16 md:w-20 md:h-20 object-contain opacity-25" />
                        </div>
                    </div>

                    <!-- Status badge với glow effect -->
                    <div class="absolute top-2.5 left-2.5 z-10">
                        <span class="px-2.5 py-1 rounded-full text-xs font-semibold shadow-md backdrop-blur-sm" :class="{
                            'bg-blue-400 text-white': profile.status === 'active',
                            'bg-green-500 text-white': profile.status === 'found',
                            'bg-gray-500 text-white': profile.status === 'closed'
                        }">
                            {{ getStatusLabel(profile.status) }}
                        </span>
                    </div>

                    <!-- Actions Menu -->
                    <div class="absolute top-2.5 right-2.5 z-10">
                        <div class="relative">
                            <button @click.stop="toggleDropdown(profile.id)"
                                :class="`profile-action-menu p-1.5 bg-white/90 hover:bg-white rounded-full text-gray-700 shadow-md backdrop-blur-sm transition-colors ${profile.id === profiles[0]?.id ? 'first-profile-action' : ''}`">
                                <i class="fas fa-ellipsis-v text-xs"></i>
                            </button>

                            <!-- Dropdown Menu -->
                            <div v-if="openDropdown === profile.id"
                                class="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg z-20 py-1 border border-gray-100">
                                <router-link :to="`/profile/${profile.id}`"
                                    class="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">
                                    <i class="fas fa-eye w-4 text-gray-500 mr-2"></i>
                                    <span>Xem chi tiết</span>
                                </router-link>
                                <router-link :to="`/profile/edit/${profile.id}`"
                                    class="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">
                                    <i class="fas fa-edit w-4 text-gray-500 mr-2"></i>
                                    <span>Chỉnh sửa</span>
                                </router-link>
                                <button @click.stop="confirmDeleteProfile(profile.id)"
                                    class="flex items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50 w-full text-left">
                                    <i class="fas fa-trash-alt w-4 text-red-500 mr-2"></i>
                                    <span>Xoá hồ sơ</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Phần thông tin -->
                <div class="flex-1 p-4 md:p-5 flex flex-col">
                    <!-- Header: Title và ID -->
                    <div class="flex items-start justify-between gap-3 mb-3">
                        <h3
                            class="text-base md:text-lg font-bold text-gray-900 group-hover:text-blue-400 transition-colors line-clamp-2 flex-1 leading-snug">
                            {{ profile.title }}
                        </h3>
                        <span
                            class="bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-400 text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0 whitespace-nowrap shadow-sm">
                            #{{ profile.id }}
                        </span>
                    </div>

                    <!-- Thông tin chi tiết - Với icon và highlight không border -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-400 flex-shrink-0" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span class="text-xs text-gray-600 font-medium whitespace-nowrap">Họ và tên:</span>
                            <span
                                class="text-sm font-semibold text-gray-900 bg-gradient-to-r from-blue-50 to-blue-50/80 px-2.5 py-1 rounded-md">
                                {{ profile.full_name || 'Chưa xác định' }}
                            </span>
                        </div>
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-400 flex-shrink-0" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span class="text-xs text-gray-600 font-medium whitespace-nowrap">Năm sinh:</span>
                            <span
                                class="text-sm font-semibold text-gray-900 bg-gradient-to-r from-blue-50 to-blue-50/80 px-2.5 py-1 rounded-md">
                                {{ profile.born_year || 'Chưa xác định' }}
                            </span>
                        </div>
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-400 flex-shrink-0" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span class="text-xs text-gray-600 font-medium whitespace-nowrap">Năm thất lạc:</span>
                            <span
                                class="text-sm font-semibold text-gray-900 bg-gradient-to-r from-blue-50 to-blue-50/80 px-2.5 py-1 rounded-md">
                                {{ profile.losing_year || 'Chưa xác định' }}
                            </span>
                        </div>
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-400 flex-shrink-0" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span class="text-xs text-gray-600 font-medium whitespace-nowrap">Tên cha:</span>
                            <span
                                class="text-sm font-semibold text-gray-900 bg-gradient-to-r from-blue-50 to-blue-50/80 px-2.5 py-1 rounded-md">
                                {{ profile.name_of_father || 'Chưa xác định' }}
                            </span>
                        </div>
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-400 flex-shrink-0" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span class="text-xs text-gray-600 font-medium whitespace-nowrap">Tên mẹ:</span>
                            <span
                                class="text-sm font-semibold text-gray-900 bg-gradient-to-r from-blue-50 to-blue-50/80 px-2.5 py-1 rounded-md">
                                {{ profile.name_of_mother || 'Chưa xác định' }}
                            </span>
                        </div>
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-400 flex-shrink-0" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span class="text-xs text-gray-600 font-medium whitespace-nowrap">Anh chị em:</span>
                            <span
                                class="text-sm font-semibold text-gray-900 bg-gradient-to-r from-blue-50 to-blue-50/80 px-2.5 py-1 rounded-md line-clamp-1">
                                {{ profile.siblings || 'Chưa xác định' }}
                            </span>
                        </div>
                    </div>

                    <!-- Mô tả -->
                    <div class="mb-3 flex-1">
                        <p class="text-xs md:text-sm text-gray-700 line-clamp-2 leading-relaxed">
                            {{ profile.description || 'Chưa có mô tả' }}
                        </p>
                    </div>

                    <!-- Footer: Thời gian, hồ sơ liên quan và nút hành động -->
                    <div
                        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-gray-100/80">
                        <div class="flex items-center gap-2 flex-wrap">
                            <div class="flex items-center gap-1.5 text-xs text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-400" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{{ formatDate(profile.created_at) }}</span>
                            </div>
                            <span v-if="profile.match_count !== undefined && profile.match_count !== null"
                                class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-blue-500" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <span>{{ profile.match_count }} liên quan</span>
                            </span>
                        </div>
                        <div class="flex items-center gap-2">
                            <router-link :to="`/profile/edit/${profile.id}`"
                                :class="`profile-action-edit inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap ${profile.id === profiles[0]?.id ? 'first-profile-action' : ''}`">
                                <i class="fas fa-edit text-xs"></i>
                                <span>Chỉnh sửa</span>
                            </router-link>
                            <router-link :to="`/profile/${profile.id}`"
                                :class="`profile-action-view inline-flex items-center gap-1.5 bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs md:text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 group/btn whitespace-nowrap ${profile.id === profiles[0]?.id ? 'first-profile-action' : ''}`">
                                <span>Xem chi tiết</span>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    class="h-3.5 w-3.5 md:h-4 md:w-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center mt-6 md:mt-8">
        <div class="inline-flex rounded-lg shadow-sm border border-gray-200 overflow-hidden bg-white">
            <button :disabled="currentPage === 1" @click="currentPage > 1 && fetchProfiles(currentPage - 1)"
                class="px-3 py-2 text-xs md:text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 focus:z-10 focus:ring-2 focus:ring-blue-400 focus:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 border-r border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <span
                class="px-4 py-2 text-xs md:text-sm font-medium text-blue-400 bg-gradient-to-r from-blue-50 to-blue-50/80 border-x border-gray-200">
                Trang {{ currentPage }} / {{ totalPages }}
            </span>

            <button :disabled="currentPage === totalPages"
                @click="currentPage < totalPages && fetchProfiles(currentPage + 1)"
                class="px-3 py-2 text-xs md:text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 focus:z-10 focus:ring-2 focus:ring-blue-400 focus:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import noImage from '@/assets/images/no_image.png'
import profileService from '@/services/profileService'
import cacheService from '@/services/cacheService'

export default {
    name: 'TabMyProfiles',

    emits: ['update-count'],

    setup(props, { emit }) {
        const router = useRouter()
        const profiles = ref([])
        const loading = ref(true)
        const error = ref('')
        const currentPage = ref(1)
        const totalPages = ref(1)
        const totalItems = ref(0)
        const openDropdown = ref(null)
        
        // Cấu hình sắp xếp
        const sortOptions = [
            { value: '-created_at', label: 'Mới nhất' },
            { value: 'created_at', label: 'Cũ nhất' },
            { value: '-updated_at', label: 'Mới cập nhật' },
            { value: 'updated_at', label: 'Cũ cập nhật' },
            { value: '-match_count', label: 'Nhiều liên quan nhất' },
            { value: 'match_count', label: 'Ít liên quan nhất' }
        ]
        const currentSort = ref('-created_at') // Mặc định: mới nhất

        // Fetch profiles
        const fetchProfiles = async (page = 1) => {
            loading.value = true
            error.value = ''

            try {
                const response = await profileService.getMyProfiles(page, currentSort.value)
                profiles.value = response.data.results || []
                totalItems.value = response.data.count || 0
                currentPage.value = page

                // Calculate total pages (assuming 9 items per page)
                const pageSize = 9
                totalPages.value = Math.ceil(totalItems.value / pageSize)

                // Emit the count update
                emit('update-count', totalItems.value)
            } catch (err) {
                console.error('Failed to fetch profiles:', err)
                error.value = 'Không thể tải hồ sơ. Vui lòng đăng nhập lại hoặc thử lại sau.'
            } finally {
                loading.value = false
            }
        }
        
        // Xử lý thay đổi sắp xếp
        const handleSortChange = () => {
            // Xóa cache và fetch lại với ordering mới
            cacheService.clearCacheByPattern('my_all_profiles')
            fetchProfiles(1) // Reset về trang đầu tiên
        }

        // Create new profile
        const createNewProfile = () => {
            router.push('/profile/create')
        }

        // Delete profile
        const confirmDeleteProfile = async (profileId) => {
            if (confirm('Bạn có chắc chắn muốn xóa hồ sơ này không? Hành động này không thể hoàn tác.')) {
                try {
                    await profileService.deleteProfile(profileId)
                    // Xóa cache và reload profiles
                    cacheService.clearCacheByPattern('my_all_profiles')
                    fetchProfiles(currentPage.value)
                } catch (err) {
                    console.error('Error deleting profile:', err)
                    alert('Không thể xóa hồ sơ. Vui lòng thử lại sau.')
                }
            }
        }

        // Toggle dropdown
        const toggleDropdown = (profileId) => {
            openDropdown.value = openDropdown.value === profileId ? null : profileId
        }

        // Close dropdown when clicking outside
        const closeDropdown = (e) => {
            if (openDropdown.value !== null) {
                openDropdown.value = null
            }
        }

        // Format date
        const formatDate = (dateString) => {
            try {
                const date = new Date(dateString)
                return format(date, 'dd/MM/yyyy', { locale: vi })
            } catch (e) {
                return 'Không xác định'
            }
        }

        // Get status label
        const getStatusLabel = (status) => {
            switch (status) {
                case 'active': return 'Đang tìm kiếm'
                case 'found': return 'Đã tìm thấy'
                case 'inactive': return 'Tạm dừng'
                default: return 'Không xác định'
            }
        }

        // Get status class
        const getStatusClass = (status) => {
            switch (status) {
                case 'active': return 'bg-green-100 text-green-800'
                case 'found': return 'bg-blue-100 text-blue-800'
                case 'inactive': return 'bg-gray-100 text-gray-700'
                default: return 'bg-gray-100 text-gray-700'
            }
        }

        // Handle image error
        const handleImageError = (event) => {
            event.target.src = noImage
        }

        onMounted(() => {
            fetchProfiles(1)
            document.addEventListener('click', closeDropdown)
        })

        onBeforeUnmount(() => {
            document.removeEventListener('click', closeDropdown)
        })

        return {
            profiles,
            loading,
            error,
            currentPage,
            totalPages,
            totalItems,
            openDropdown,
            sortOptions,
            currentSort,
            handleSortChange,
            fetchProfiles,
            createNewProfile,
            confirmDeleteProfile,
            toggleDropdown,
            formatDate,
            getStatusLabel,
            getStatusClass,
            handleImageError
        }
    }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img {
  transition: opacity 0.3s ease-in-out;
}

/* Subtle card hover effect */
.group:hover {
  transform: translateY(-2px);
}

/* Highlight glow effect on hover */
.group:hover .bg-gradient-to-r.from-blue-50 {
  background: linear-gradient(to right, rgb(239 246 255), rgb(219 234 254));
  box-shadow: 0 1px 3px 0 rgba(59, 130, 246, 0.1);
}
.line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.line-clamp-3 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
}
</style>