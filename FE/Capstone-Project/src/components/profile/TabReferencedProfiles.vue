<template>
    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow p-12 flex justify-center">
        <div class="flex flex-col items-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p class="mt-4 text-gray-600">Đang tải hồ sơ tham chiếu...</p>
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
            <i class="fas fa-link text-blue-500 text-2xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Chưa có hồ sơ tham chiếu</h3>
        <p class="text-gray-600 max-w-lg mx-auto mb-6">
            Hiện chưa có hồ sơ nào tham chiếu đến hồ sơ của bạn.
            Khi hệ thống phát hiện hồ sơ khác có liên quan đến hồ sơ của bạn, thông tin sẽ hiển thị tại đây.
        </p>
        <button @click="fetchProfiles(1)"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center gap-2 mx-auto">
            <i class="fas fa-sync-alt"></i>
            <span>Làm mới</span>
        </button>
    </div>

    <!-- Referenced Profiles List -->
    <div v-else>
        <div class="flex flex-col md:flex-row justify-between items-center mb-5 gap-4">
            <h2 class="text-xl font-bold text-gray-800">Hồ sơ tham chiếu ({{ totalItems }})</h2>
            <button @click="fetchProfiles(1)"
                class="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg flex items-center gap-2">
                <i class="fas fa-sync-alt"></i>
                <span>Làm mới</span>
            </button>
        </div>

        <!-- Referenced Profiles Cards -->
        <div class="space-y-6">
            <div v-for="profile in profiles" :key="profile.id"
                class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                <!-- Reference Banner -->
                <div class="bg-indigo-50 px-5 py-4 border-b border-indigo-100 flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="h-9 w-9 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                            <i class="fas fa-link text-indigo-500"></i>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-gray-700 block">Tham chiếu đến hồ sơ của bạn:</span>
                            <router-link :to="`/profile/${profile.referenced_to_profile.id}`"
                                class="text-blue-600 hover:text-blue-800 hover:underline font-semibold">
                                {{ profile.referenced_to_profile.title }}
                            </router-link>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="text-xs text-gray-500 block">Ngày tạo:</span>
                        <span class="text-sm font-medium text-gray-700">
                            {{ formatDate(profile.suggestion_info.created_at) }}
                        </span>
                    </div>
                </div>

                <!-- Profile Content -->
                <div class="flex flex-col lg:flex-row">
                    <!-- Profile Image -->
                    <div class="w-full lg:w-1/4 h-64 lg:h-auto relative">
                        <img v-if="profile.images" :src="profile.images" :alt="`Ảnh của ${profile.title}`"
                            class="w-full h-full object-cover" @error="handleImageError" />
                        <div v-else
                            class="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
                            <div class="text-center">
                                <div
                                    class="h-20 w-20 bg-white/80 rounded-full mx-auto mb-2 flex items-center justify-center">
                                    <i class="fas fa-image text-indigo-300 text-4xl"></i>
                                </div>
                                <p class="text-indigo-400 text-sm mt-2">Không có hình ảnh</p>
                            </div>
                        </div>

                        <!-- Status Badge -->
                        <div class="absolute top-3 left-3">
                            <span
                                :class="`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusClass(profile.status)}`">
                                {{ getStatusLabel(profile.status) }}
                            </span>
                        </div>

                        <!-- Owner info badge -->
                        <div
                            class="absolute bottom-3 left-3 bg-indigo-50 border border-indigo-200 px-2.5 py-1.5 rounded-md text-sm flex items-center">
                            <i class="fas fa-user text-indigo-600 mr-2"></i>
                            <span class="text-indigo-700 font-medium">
                                Hồ sơ của người khác
                            </span>
                        </div>
                    </div>

                    <!-- Profile Info -->
                    <div class="p-6 flex-1 flex flex-col">
                        <div class="flex justify-between items-start mb-3">
                            <h3 class="text-xl font-bold text-indigo-700 line-clamp-2 mr-2">{{ profile.title }}</h3>
                            <span
                                class="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1.5 rounded-full whitespace-nowrap">
                                ID: {{ profile.id }}
                            </span>
                        </div>

                        <!-- Quick Info -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-5">
                            <div class="flex items-center">
                                <i class="fas fa-user text-indigo-500 mr-2 w-5 text-center"></i>
                                <span class="text-gray-700 mr-1">Họ và tên:</span>
                                <span class="text-gray-900 font-medium">{{ profile.full_name || 'Chưa xác định'
                                }}</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-birthday-cake text-indigo-500 mr-2 w-5 text-center"></i>
                                <span class="text-gray-700 mr-1">Năm sinh:</span>
                                <span class="text-gray-900 font-medium">{{ profile.born_year || 'Chưa xác định'
                                }}</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-calendar-day text-indigo-500 mr-2 w-5 text-center"></i>
                                <span class="text-gray-700 mr-1">Năm thất lạc:</span>
                                <span class="text-gray-900 font-medium">{{ profile.losing_year || 'Chưa xác định'
                                }}</span>
                            </div>
                            <div class="flex items-center" v-if="profile.name_of_father">
                                <i class="fas fa-male text-indigo-500 mr-2 w-5 text-center"></i>
                                <span class="text-gray-700 mr-1">Tên cha:</span>
                                <span class="text-gray-900 font-medium">{{ profile.name_of_father }}</span>
                            </div>
                            <div class="flex items-center" v-if="profile.name_of_mother">
                                <i class="fas fa-female text-indigo-500 mr-2 w-5 text-center"></i>
                                <span class="text-gray-700 mr-1">Tên mẹ:</span>
                                <span class="text-gray-900 font-medium">{{ profile.name_of_mother }}</span>
                            </div>
                            <div class="flex items-center" v-if="profile.siblings">
                                <i class="fas fa-users text-indigo-500 mr-2 w-5 text-center"></i>
                                <span class="text-gray-700 mr-1">Anh chị em:</span>
                                <span class="text-gray-900 font-medium line-clamp-1">{{ profile.siblings }}</span>
                            </div>
                        </div>

                        <!-- Description -->
                        <div v-if="profile.description" class="bg-gray-50 p-4 rounded-lg mb-5">
                            <h4 class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <i class="fas fa-align-left text-gray-500 mr-2"></i>
                                Mô tả
                            </h4>
                            <p class="text-gray-600 line-clamp-3">{{ profile.description }}</p>
                        </div>

                        <!-- Action Button -->
                        <div class="mt-auto pt-2">
                            <router-link :to="`/profile/${profile.id}`"
                                class="inline-flex items-center justify-center w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all">
                                Xem chi tiết
                                <i class="fas fa-arrow-right ml-2"></i>
                            </router-link>
                        </div>
                    </div>
                </div>

                <!-- Footer with Match Status -->
                <div class="px-5 py-4 bg-gray-50 border-t border-gray-100">
                    <div class="flex items-center">
                        <span class="text-gray-600 mr-2">Trạng thái tham chiếu:</span>
                        <span :class="`px-2.5 py-1 rounded-full text-sm font-medium ${profile.suggestion_info.match_status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            profile.suggestion_info.match_status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'
                            }`">
                            {{ profile.suggestion_info.match_status === 'confirmed' ? 'Đã xác nhận' :
                                profile.suggestion_info.match_status === 'rejected' ? 'Đã từ chối' : 'Chưa xác nhận' }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="profiles.length > 0" class="mt-8">
            <div class="flex justify-between items-center flex-col sm:flex-row gap-4">
                <p class="text-sm text-gray-600">
                    Hiển thị {{ profiles.length }} trong tổng số {{ totalItems }} hồ sơ tham chiếu
                </p>

                <div class="inline-flex rounded-md shadow-sm">
                    <button :disabled="currentPage === 1" @click="currentPage > 1 && fetchProfiles(currentPage - 1)"
                        :class="[
                            'px-4 py-2 text-sm font-medium border border-gray-300 rounded-l-lg',
                            currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-indigo-600 hover:bg-indigo-50'
                        ]">
                        <i class="fas fa-chevron-left"></i>
                    </button>

                    <span
                        class="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border-t border-b border-gray-300">
                        Trang {{ currentPage }} / {{ totalPages }}
                    </span>

                    <button :disabled="currentPage === totalPages"
                        @click="currentPage < totalPages && fetchProfiles(currentPage + 1)" :class="[
                            'px-4 py-2 text-sm font-medium border border-gray-300 rounded-r-lg',
                            currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-indigo-600 hover:bg-indigo-50'
                        ]">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import noImage from '@/assets/images/no_image.png'
import profileService from '@/services/profileService'

export default {
    name: 'TabReferencedProfiles',

    emits: ['update-count'],

    setup(props, { emit }) {
        const profiles = ref([])
        const loading = ref(true)
        const error = ref('')
        const currentPage = ref(1)
        const totalPages = ref(1)
        const totalItems = ref(0)

        // Fetch referenced profiles
        const fetchProfiles = async (page = 1) => {
            loading.value = true
            error.value = ''

            try {
                const response = await profileService.getAllReferencedProfiles(page)

                profiles.value = response.data.results || []
                totalItems.value = response.data.count || 0
                currentPage.value = page

                // Calculate total pages
                const pageSize = 9
                totalPages.value = Math.ceil(totalItems.value / pageSize)

                // Emit count update
                emit('update-count', totalItems.value)
            } catch (err) {
                console.error('Failed to fetch referenced profiles:', err)
                error.value = 'Không thể tải hồ sơ tham chiếu. Vui lòng thử lại sau.'
            } finally {
                loading.value = false
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
        })

        return {
            profiles,
            loading,
            error,
            currentPage,
            totalPages,
            totalItems,
            fetchProfiles,
            formatDate,
            getStatusLabel,
            getStatusClass,
            handleImageError
        }
    }
}
</script>

<style scoped>
.line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
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