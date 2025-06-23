<template>
    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow p-12 flex justify-center">
        <div class="flex flex-col items-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <p class="mt-4 text-gray-600">Đang tải hồ sơ gợi ý...</p>
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
            class="px-5 py-2 bg-blue-400 hover:bg-blue-700 text-white rounded-lg font-medium transition">
            <i class="fas fa-sync-alt mr-2"></i> Thử lại
        </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="profiles.length === 0" class="bg-white rounded-xl shadow p-12 text-center">
        <div class="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-lightbulb text-yellow-500 text-2xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Chưa có gợi ý hồ sơ</h3>
        <p class="text-gray-600 max-w-lg mx-auto mb-6">
            Hệ thống chưa tìm thấy hồ sơ nào phù hợp với các hồ sơ bạn đang tìm kiếm.
            Hãy thử tạo thêm hồ sơ hoặc cập nhật thông tin chi tiết hơn để tăng khả năng tìm kiếm.
        </p>
        <button @click="fetchProfiles(1)"
            class="px-6 py-3 bg-blue-400 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center gap-2 mx-auto">
            <i class="fas fa-sync-alt"></i>
            <span>Làm mới gợi ý</span>
        </button>
    </div>

    <!-- Suggested Profiles List -->
    <div v-else>
        <div class="flex flex-col md:flex-row justify-between items-center mb-5 gap-4">
            <h2 class="text-xl font-bold text-gray-800">Hồ sơ gợi ý ({{ totalItems }})</h2>
            <button @click="fetchProfiles(1)"
                class="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg flex items-center gap-2">
                <i class="fas fa-sync-alt"></i>
                <span>Làm mới</span>
            </button>
        </div>

        <!-- Suggested Profiles Cards -->
        <div class="space-y-6">
            <div v-for="profile in profiles" :key="profile.id"
                class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                <!-- Source Profile Banner -->
                <div class="bg-blue-50 px-5 py-4 border-b border-blue-100 flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="h-9 w-9 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                            <i class="fas fa-lightbulb text-yellow-500"></i>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-gray-700 block">Gợi ý từ hồ sơ:</span>
                            <router-link :to="`/profile/${profile.suggested_from_profile.id}`"
                                class="text-blue-400 hover:text-blue-800 hover:underline font-semibold">
                                {{ profile.suggested_from_profile.title }}
                            </router-link>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="text-xs text-gray-500 block">Ngày gợi ý:</span>
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
                            class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                            <div class="text-center">
                                <div
                                    class="h-20 w-20 bg-white/80 rounded-full mx-auto mb-2 flex items-center justify-center">
                                    <i class="fas fa-image text-blue-300 text-4xl"></i>
                                </div>
                                <p class="text-blue-400 text-sm mt-2">Không có hình ảnh</p>
                            </div>
                        </div>

                        <!-- Status Badge -->
                        <div class="absolute top-3 left-3">
                            <span
                                :class="`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusClass(profile.status)}`">
                                {{ getStatusLabel(profile.status) }}
                            </span>
                        </div>
                    </div>

                    <!-- Profile Info -->
                    <div class="p-6 flex-1 flex flex-col">
                        <div class="flex justify-between items-start mb-3">
                            <h3 class="text-xl font-bold text-blue-700 line-clamp-2 mr-2">{{ profile.title }}</h3>
                            <span
                                class="bg-blue-100 text-blue-700 text-xs px-2.5 py-1.5 rounded-full whitespace-nowrap">
                                ID: {{ profile.id }}
                            </span>
                        </div>

                        <!-- Quick Info -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-5">
                            <div class="flex items-center">
                                <i class="fas fa-user text-blue-500 mr-2 w-5 text-center"></i>
                                <span class="text-gray-700 mr-1">Họ và tên:</span>
                                <span class="text-gray-900 font-medium">{{ profile.full_name || 'Chưa xác định'
                                }}</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-birthday-cake text-blue-500 mr-2 w-5 text-center"></i>
                                <span class="text-gray-700 mr-1">Năm sinh:</span>
                                <span class="text-gray-900 font-medium">{{ profile.born_year || 'Chưa xác định'
                                }}</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-calendar-day text-blue-500 mr-2 w-5 text-center"></i>
                                <span class="text-gray-700 mr-1">Năm thất lạc:</span>
                                <span class="text-gray-900 font-medium">{{ profile.losing_year || 'Chưa xác định'
                                }}</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-male text-blue-500 mr-2 w-5 text-center"></i>
                                <span class="text-gray-700 mr-1">Tên cha:</span>
                                <span class="text-gray-900 font-medium">{{ profile.name_of_father || 'Chưa xác định'
                                }}</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-female text-blue-500 mr-2 w-5 text-center"></i>
                                <span class="text-gray-700 mr-1">Tên mẹ:</span>
                                <span class="text-gray-900 font-medium">{{ profile.name_of_mother || 'Chưa xác định'
                                }}</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-users text-blue-500 mr-2 w-5 text-center"></i>
                                <span class="text-gray-700 mr-1">Anh chị em:</span>
                                <span class="text-gray-900 font-medium line-clamp-1">{{ profile.siblings || 'Chưa xác định' }}</span>
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
                                class="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-400 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all">
                                Xem chi tiết
                                <i class="fas fa-arrow-right ml-2"></i>
                            </router-link>
                        </div>
                    </div>
                </div>

                <!-- Footer with Match Status and Actions -->
                <div class="px-5 py-4 bg-gray-50 border-t border-gray-100">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <!-- Current Status Display -->
                        <div class="flex items-center gap-3">
                            <span class="text-gray-600 font-medium">Trạng thái gợi ý:</span>
                            <span
                                :class="`px-3 py-1.5 rounded-full text-sm font-medium ${getMatchStatusClass(profile.suggestion_info.match_status)}`">
                                <i :class="getMatchStatusIcon(profile.suggestion_info.match_status)" class="mr-1"></i>
                                {{ getMatchStatusLabel(profile.suggestion_info.match_status) }}
                            </span>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex flex-wrap gap-2">
                            <!-- Chờ xác nhận button -->
                            <button :class="`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${profile.suggestion_info.match_status === 'pending'
                                    ? 'bg-blue-500 text-white shadow-md cursor-not-allowed'
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:shadow-sm'
                                }`"
                                :disabled="profile.suggestion_info.match_status === 'pending' || updatingStatus[profile.suggestion_info.id]"
                                @click="updateMatchStatus(profile, 'pending')">
                                <i class="fas fa-clock text-xs"></i>
                                <span>Chờ xác nhận</span>
                            </button>

                            <!-- Xác nhận khớp button -->
                            <button :class="`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${profile.suggestion_info.match_status === 'accepted'
                                    ? 'bg-green-500 text-white shadow-md cursor-not-allowed'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200 hover:shadow-sm'
                                }`"
                                :disabled="profile.suggestion_info.match_status === 'accepted' || updatingStatus[profile.suggestion_info.id]"
                                @click="updateMatchStatus(profile, 'accepted')">
                                <i class="fas fa-check text-xs"></i>
                                <span>Xác nhận khớp</span>
                            </button>

                            <!-- Không khớp button -->
                            <button :class="`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${profile.suggestion_info.match_status === 'rejected'
                                    ? 'bg-red-500 text-white shadow-md cursor-not-allowed'
                                    : 'bg-red-100 text-red-700 hover:bg-red-200 hover:shadow-sm'
                                }`"
                                :disabled="profile.suggestion_info.match_status === 'rejected' || updatingStatus[profile.suggestion_info.id]"
                                @click="updateMatchStatus(profile, 'rejected')">
                                <i class="fas fa-times text-xs"></i>
                                <span>Không khớp</span>
                            </button>
                        </div>
                    </div>

                    <!-- Loading indicator when updating -->
                    <div v-if="updatingStatus[profile.suggestion_info.id]"
                        class="flex items-center justify-center mt-3 text-blue-600">
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        <span class="text-sm">Đang cập nhật trạng thái...</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="profiles.length > 0" class="mt-8">
            <div class="flex justify-between items-center flex-col sm:flex-row gap-4">
                <p class="text-sm text-gray-600">
                    Hiển thị {{ profiles.length }} trong tổng số {{ totalItems }} hồ sơ gợi ý
                </p>

                <div class="inline-flex rounded-md shadow-sm">
                    <button :disabled="currentPage === 1" @click="currentPage > 1 && fetchProfiles(currentPage - 1)"
                        :class="[
                            'px-4 py-2 text-sm font-medium border border-gray-300 rounded-l-lg',
                            currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-blue-400 hover:bg-blue-50'
                        ]">
                        <i class="fas fa-chevron-left"></i>
                    </button>

                    <span
                        class="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border-t border-b border-gray-300">
                        Trang {{ currentPage }} / {{ totalPages }}
                    </span>

                    <button :disabled="currentPage === totalPages"
                        @click="currentPage < totalPages && fetchProfiles(currentPage + 1)" :class="[
                            'px-4 py-2 text-sm font-medium border border-gray-300 rounded-r-lg',
                            currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-blue-400 hover:bg-blue-50'
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
    name: 'TabSuggestedProfiles',

    emits: ['update-count'],

    setup(props, { emit }) {
        const profiles = ref([])
        const loading = ref(true)
        const error = ref('')
        const currentPage = ref(1)
        const totalPages = ref(1)
        const totalItems = ref(0)
        const updatingStatus = ref({}) // Track updating status for each suggestion

        // Fetch suggested profiles
        const fetchProfiles = async (page = 1) => {
            loading.value = true
            error.value = ''

            try {
                const response = await profileService.getAllSuggestedProfiles(page)

                profiles.value = response.data.results || []
                totalItems.value = response.data.count || 0
                currentPage.value = page

                // Calculate total pages
                const pageSize = 9
                totalPages.value = Math.ceil(totalItems.value / pageSize)

                // Emit count update
                emit('update-count', totalItems.value)
            } catch (err) {
                console.error('Failed to fetch suggested profiles:', err)
                error.value = 'Không thể tải hồ sơ gợi ý. Vui lòng thử lại sau.'
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

        // Get match status label
        const getMatchStatusLabel = (status) => {
            switch (status) {
                case 'accepted': return 'Đã xác nhận khớp'
                case 'rejected': return 'Đã từ chối'
                case 'pending': return 'Chờ xác nhận'
                default: return 'Chưa xác định'
            }
        }

        // Get match status class
        const getMatchStatusClass = (status) => {
            switch (status) {
                case 'accepted': return 'bg-green-100 text-green-700 border border-green-200'
                case 'rejected': return 'bg-red-100 text-red-700 border border-red-200'
                case 'pending': return 'bg-blue-100 text-blue-700 border border-blue-200'
                default: return 'bg-gray-100 text-gray-700 border border-gray-200'
            }
        }

        // Get match status icon
        const getMatchStatusIcon = (status) => {
            switch (status) {
                case 'accepted': return 'fas fa-check-circle'
                case 'rejected': return 'fas fa-times-circle'
                case 'pending': return 'fas fa-clock'
                default: return 'fas fa-question-circle'
            }
        }

        // Handle image error
        const handleImageError = (event) => {
            event.target.src = noImage
        }

        const updateMatchStatus = async (profile, status) => {
            // Prevent update if already in the same status
            if (profile.suggestion_info.match_status === status) {
                return
            }

            const suggestionId = profile.suggestion_info.id

            // Set loading state for this specific suggestion
            updatingStatus.value[suggestionId] = true

            try {
                await profileService.updateSuggestionMatchStatus(suggestionId, status)
                // Update UI state
                profile.suggestion_info.match_status = status

                // Show success message
                const statusText = getMatchStatusLabel(status)
                // You can replace this with a toast notification if you have one
                console.log(`✅ Đã cập nhật trạng thái thành: ${statusText}`)

            } catch (err) {
                console.error('Failed to update match status:', err)
                // Show error message
                alert('Cập nhật trạng thái thất bại! Vui lòng thử lại.')
            } finally {
                // Clear loading state
                updatingStatus.value[suggestionId] = false
            }
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
            updatingStatus,
            fetchProfiles,
            formatDate,
            getStatusLabel,
            getStatusClass,
            getMatchStatusLabel,
            getMatchStatusClass,
            getMatchStatusIcon,
            handleImageError,
            updateMatchStatus
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

/* Animation for buttons */
button:disabled {
    cursor: not-allowed;
    opacity: 0.7;
}

button:not(:disabled):hover {
    transform: translateY(-1px);
}

/* Loading animation */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}
</style>