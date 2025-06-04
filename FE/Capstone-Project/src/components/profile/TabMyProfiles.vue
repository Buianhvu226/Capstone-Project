<template>
    <!-- Status Action Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-5 gap-4">
        <div class="flex items-center gap-3 w-full md:w-auto">
            <button @click="createNewProfile"
                class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center gap-2 w-full md:w-auto justify-center">
                <i class="fas fa-plus-circle"></i>
                <span>Tạo hồ sơ mới</span>
            </button>
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto">
            <span class="text-sm text-gray-500">Sắp xếp theo:</span>
            <select v-model="sortBy"
                class="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="created_at">Mới nhất</option>
                <option value="full_name">Tên A-Z</option>
                <option value="status">Trạng thái</option>
            </select>
        </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow p-12 flex justify-center">
        <div class="flex flex-col items-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p class="mt-4 text-gray-600">Đang tải hồ sơ...</p>
        </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white rounded-xl shadow p-8 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-exclamation-triangle text-red-500 text-xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Đã xảy ra lỗi</h3>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button @click="fetchProfiles(1)"
            class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
            <i class="fas fa-sync-alt mr-2"></i> Thử lại
        </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="profiles.length === 0" class="bg-white rounded-xl shadow p-12 text-center">
        <div class="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-folder-open text-blue-500 text-2xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Chưa có hồ sơ nào</h3>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
            Bạn chưa tạo hồ sơ tìm kiếm người thân nào. Hãy bắt đầu hành trình kết nối bằng việc tạo hồ sơ đầu tiên.
        </p>
        <button @click="createNewProfile"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center gap-2 mx-auto">
            <i class="fas fa-plus-circle"></i>
            <span>Tạo hồ sơ ngay</span>
        </button>
    </div>

    <!-- Profile List -->
    <div v-else class="space-y-6">
        <div v-for="profile in profiles" :key="profile.id"
            class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300 flex flex-col md:flex-row">

            <!-- Phần ảnh -->
            <div class="w-full md:w-1/3 relative h-64 md:h-auto overflow-hidden flex-shrink-0">
                <div class="h-full">
                    <img v-if="profile.images" :src="profile.images" :alt="`Ảnh của hồ sơ ${profile.title}`"
                        class="w-full h-full object-cover" @error="handleImageError" />
                    <div v-else
                        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                        <div class="text-center">
                            <div
                                class="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center mx-auto mb-2">
                                <i class="fas fa-image text-blue-400 text-4xl"></i>
                            </div>
                            <p class="text-blue-500 font-medium">Chưa có hình ảnh</p>
                        </div>
                    </div>
                </div>

                <!-- Status Badge -->
                <div class="absolute top-4 left-4">
                    <span :class="`
            px-2.5 py-1 rounded-full text-xs font-medium
            ${getStatusClass(profile.status)}
          `">
                        {{ getStatusLabel(profile.status) }}
                    </span>
                </div>

                <!-- Actions Menu -->
                <div class="absolute top-3 right-3">
                    <div class="relative">
                        <button @click.stop="toggleDropdown(profile.id)"
                            class="p-2 bg-white/90 hover:bg-white rounded-full text-gray-700 shadow-sm">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>

                        <!-- Dropdown Menu -->
                        <div v-if="openDropdown === profile.id"
                            class="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg z-20 py-1 border border-gray-100">
                            <router-link :to="`/profile/${profile.id}`"
                                class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <i class="fas fa-eye w-5 text-gray-500"></i>
                                <span>Xem chi tiết</span>
                            </router-link>
                            <router-link :to="`/profile/edit/${profile.id}`"
                                class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <i class="fas fa-edit w-5 text-gray-500"></i>
                                <span>Chỉnh sửa</span>
                            </router-link>
                            <button @click.stop="confirmDeleteProfile(profile.id)"
                                class="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                                <i class="fas fa-trash-alt w-5 text-red-500"></i>
                                <span>Xoá hồ sơ</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Phần thông tin -->
            <div class="p-6 flex-1 flex flex-col">
                <!-- Tiêu đề và ID -->
                <div class="flex justify-between items-start mb-3">
                    <h3 class="text-xl font-bold text-blue-700 mb-1 line-clamp-2">{{ profile.title || 'Không có tiêu đề'
                        }}</h3>
                    <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">ID: {{
                        profile.id }}</span>
                </div>

                <!-- Tên người thất lạc -->
                <div class="flex items-center mb-4">
                    <i class="fas fa-user text-blue-500 mr-2 w-5"></i>
                    <span class="text-gray-700 mr-1 font-medium">Họ và tên:</span>
                    <span class="text-gray-900 font-semibold">{{ profile.full_name || 'Chưa cập nhật tên' }}</span>
                </div>

                <!-- Thông tin chi tiết -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div class="flex items-center">
                        <i class="fas fa-birthday-cake text-blue-500 mr-2 w-5"></i>
                        <span class="text-gray-600 mr-1 font-medium">Năm sinh:</span>
                        <span class="text-gray-900">{{ profile.born_year || 'Chưa xác định' }}</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-calendar-day text-blue-500 mr-2 w-5"></i>
                        <span class="text-gray-600 mr-1 font-medium">Năm thất lạc:</span>
                        <span class="text-gray-900">{{ profile.losing_year || 'Chưa xác định' }}</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-male text-blue-500 mr-2 w-5"></i>
                        <span class="text-gray-600 mr-1 font-medium">Tên cha:</span>
                        <span class="text-gray-900">{{ profile.name_of_father || 'Chưa xác định' }}</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-female text-blue-500 mr-2 w-5"></i>
                        <span class="text-gray-600 mr-1 font-medium">Tên mẹ:</span>
                        <span class="text-gray-900">{{ profile.name_of_mother || 'Chưa xác định' }}</span>
                    </div>
                </div>

                <!-- Mô tả chi tiết -->
                <p v-if="profile.detail || profile.description" class="text-gray-700 line-clamp-3 mb-4">
                    {{ profile.detail || profile.description }}
                </p>

                <!-- Footer -->
                <div class="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                    <span class="text-sm text-gray-500">Ngày tạo: {{ formatDate(profile.created_at) }}</span>
                    <div class="flex space-x-3">
                        <router-link :to="`/profile/edit/${profile.id}`"
                            class="inline-flex items-center text-gray-600 hover:text-gray-900 px-3 py-1.5 border border-gray-300 rounded-lg font-medium transition-all duration-200 hover:bg-gray-50">
                            <i class="fas fa-edit mr-1.5"></i>
                            Chỉnh sửa
                        </router-link>
                        <router-link :to="`/profile/${profile.id}`"
                            class="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow transition-all duration-300 hover:shadow-lg">
                            Xem chi tiết
                            <i class="fas fa-arrow-right ml-1.5"></i>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Pagination -->
    <div v-if="profiles.length > 0" class="mt-8">
        <div class="flex justify-between items-center flex-col sm:flex-row gap-4">
            <p class="text-sm text-gray-600">
                Hiển thị {{ profiles.length }} trong tổng số {{ totalItems }} hồ sơ
            </p>

            <div class="inline-flex rounded-md shadow-sm">
                <button :disabled="currentPage === 1" @click="currentPage > 1 && fetchProfiles(currentPage - 1)" :class="[
                    'px-4 py-2 text-sm font-medium border border-gray-300 rounded-l-lg',
                    currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-blue-600 hover:bg-blue-50'
                ]">
                    <i class="fas fa-chevron-left"></i>
                </button>

                <span class="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border-t border-b border-gray-300">
                    Trang {{ currentPage }} / {{ totalPages }}
                </span>

                <button :disabled="currentPage === totalPages"
                    @click="currentPage < totalPages && fetchProfiles(currentPage + 1)" :class="[
                        'px-4 py-2 text-sm font-medium border border-gray-300 rounded-r-lg',
                        currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-blue-600 hover:bg-blue-50'
                    ]">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
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
        const sortBy = ref('created_at')

        // Fetch profiles
        const fetchProfiles = async (page = 1) => {
            loading.value = true
            error.value = ''

            try {
                const response = await profileService.getMyProfiles(page)
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

        // Create new profile
        const createNewProfile = () => {
            router.push('/profile/create')
        }

        // Delete profile
        const confirmDeleteProfile = async (profileId) => {
            if (confirm('Bạn có chắc chắn muốn xóa hồ sơ này không? Hành động này không thể hoàn tác.')) {
                try {
                    await profileService.deleteProfile(profileId)
                    // Reload profiles
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
            sortBy,
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