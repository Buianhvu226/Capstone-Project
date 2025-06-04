<template>
    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen pt-16 pb-12">
        <!-- Header Section -->
        <div class="container mx-auto px-4 py-6">
            <div class="bg-white rounded-xl shadow-lg overflow-hidden p-6 mb-8 border border-blue-100">
                <div class="flex flex-col md:flex-row items-start md:items-center">
                    <div class="flex-shrink-0 bg-blue-600 rounded-full p-3 mr-5 mb-4 md:mb-0 shadow-md">
                        <i class="fas fa-edit text-white text-2xl"></i>
                    </div>
                    <div>
                        <h1 class="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                            Chỉnh sửa hồ sơ
                            <span v-if="loading" class="ml-3">
                                <div class="animate-pulse inline-flex h-3 w-3 rounded-full bg-blue-500 ml-1"></div>
                                <div
                                    class="animate-pulse inline-flex h-3 w-3 rounded-full bg-blue-500 ml-1 animation-delay-200">
                                </div>
                                <div
                                    class="animate-pulse inline-flex h-3 w-3 rounded-full bg-blue-500 ml-1 animation-delay-400">
                                </div>
                            </span>
                        </h1>
                        <p class="text-gray-600">Cập nhật thông tin hồ sơ tìm kiếm của bạn</p>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="initialLoading" class="bg-white rounded-xl shadow-lg p-12 text-center">
                <div class="inline-flex items-center justify-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
                <p class="text-gray-600 mt-4">Đang tải thông tin hồ sơ...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="bg-white rounded-xl shadow-lg p-8 text-center mb-8">
                <div class="inline-block p-4 bg-red-100 rounded-full mb-4">
                    <i class="fas fa-exclamation-triangle text-red-500 text-3xl"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Đã xảy ra lỗi</h3>
                <p class="text-gray-600 mb-4">{{ error }}</p>
                <div class="flex justify-center space-x-4">
                    <button @click="fetchProfile"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        <i class="fas fa-sync-alt mr-2"></i> Thử lại
                    </button>
                    <router-link to="/my-profile"
                        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                        <i class="fas fa-arrow-left mr-2"></i> Quay lại
                    </router-link>
                </div>
            </div>

            <!-- Edit Form -->
            <div v-else class="bg-white rounded-xl shadow-lg p-6 mb-8">
                <!-- Confirmation before discarding changes -->
                <div v-if="showCancelModal"
                    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate__animated animate__fadeInUp animate__faster">
                        <div class="flex items-center text-red-600 mb-4">
                            <div class="bg-red-100 p-2 rounded-full mr-3">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <h3 class="text-lg font-medium text-gray-900">Xác nhận hủy thay đổi</h3>
                        </div>
                        <p class="text-gray-600 mb-6">Bạn có chắc muốn hủy các thay đổi đã chỉnh sửa? Tất cả thông tin
                            sẽ không được lưu.</p>
                        <div class="flex justify-end space-x-4">
                            <button @click="showCancelModal = false"
                                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                <i class="fas fa-arrow-left mr-2"></i> Tiếp tục chỉnh sửa
                            </button>
                            <button @click="confirmCancel"
                                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                <i class="fas fa-times mr-2"></i> Xác nhận hủy
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Confirmation before submission -->
                <div v-if="showSubmitModal"
                    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate__animated animate__fadeInUp animate__faster">
                        <div class="flex items-center text-blue-600 mb-4">
                            <div class="bg-blue-100 p-2 rounded-full mr-3">
                                <i class="fas fa-info-circle"></i>
                            </div>
                            <h3 class="text-lg font-medium text-gray-900">Xác nhận lưu thay đổi</h3>
                        </div>
                        <p class="text-gray-600 mb-6">Bạn có chắc muốn lưu các thay đổi đã chỉnh sửa? Hệ thống sẽ tạo
                            một hồ sơ mới và xóa hồ sơ cũ.</p>
                        <div class="flex justify-end space-x-4">
                            <button @click="showSubmitModal = false"
                                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                <i class="fas fa-arrow-left mr-2"></i> Tiếp tục chỉnh sửa
                            </button>
                            <button @click="confirmSubmit" :disabled="submitting"
                                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                                <i class="fas fa-check mr-2"></i>
                                <span v-if="submitting">Đang lưu...</span>
                                <span v-else>Xác nhận lưu</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    class="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <i class="fas fa-info-circle text-blue-500 text-lg"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-blue-700">
                                <span class="font-medium">Lưu ý về quy trình chỉnh sửa:</span> Khi bạn lưu các thay đổi,
                                hệ thống sẽ
                                tạo một hồ sơ mới dựa trên thông tin bạn vừa chỉnh sửa và xóa hồ sơ cũ. Các thông tin
                                liên kết có thể
                                bị ảnh hưởng.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Form -->
                <ProfileForm :initialData="profileData" :loading="loading" :error="formError" :isEditing="true"
                    submitButtonText="Lưu thay đổi" @submit="handleSubmit" @cancel="handleCancel" />
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import axios from 'axios';
import ProfileForm from '@/components/profile/ProfileForm.vue';

export default {
    name: 'ProfileEditView',
    components: {
        ProfileForm
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const profileId = ref(route.params.id);
        const profileData = ref(null);
        const originalProfile = ref(null);
        const initialLoading = ref(true);
        const loading = ref(false);
        const submitting = ref(false);
        const error = ref('');
        const formError = ref('');
        const showCancelModal = ref(false);
        const showSubmitModal = ref(false);

        // Track if form has unsaved changes
        const hasUnsavedChanges = ref(false);

        // Fetch the profile data
        const fetchProfile = async () => {
            initialLoading.value = true;
            error.value = '';

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/auth');
                    return;
                }

                const response = await axios.get(`http://127.0.0.1:8000/api/profiles/${profileId.value}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                originalProfile.value = { ...response.data };
                profileData.value = { ...response.data };

            } catch (err) {
                console.error('Error fetching profile:', err);
                error.value = err.response?.data?.detail || 'Không thể tải thông tin hồ sơ. Vui lòng thử lại.';
            } finally {
                initialLoading.value = false;
            }
        };

        // Handle form submission
        const handleSubmit = (data) => {
            // Show confirmation modal
            formError.value = '';
            showSubmitModal.value = true;
            // Store updated data temporarily
            profileData.value = { ...data };
        };

        // Confirm submission after user confirmation
        const confirmSubmit = async () => {
            // If already submitting, prevent duplicate submissions
            if (submitting.value) {
                return;
            }

            submitting.value = true;
            formError.value = '';

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/auth');
                    return;
                }

                // 1. Create a new profile with the updated data
                const createResponse = await axios.post('http://127.0.0.1:8000/api/profiles/', profileData.value, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const newProfileId = createResponse.data.id;

                // 2. Delete the old profile
                if (newProfileId) {
                    await axios.delete(`http://127.0.0.1:8000/api/profiles/${profileId.value}/`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    // Close the modal before navigating
                    showSubmitModal.value = false;
                    hasUnsavedChanges.value = false;

                    // Navigate to my-profile page instead of the new profile
                    router.push({
                        path: '/my-profile',
                        query: {
                            action: 'edit-success',
                            oldId: profileId.value,
                            newId: newProfileId
                        }
                    });
                }
            } catch (err) {
                console.error('Error updating profile:', err);
                formError.value = err.response?.data?.detail || 'Có lỗi xảy ra khi cập nhật hồ sơ. Vui lòng thử lại.';
                showSubmitModal.value = false;
            } finally {
                submitting.value = false;
            }
        };

        // Handle cancel
        const handleCancel = () => {
            // Compare current data with original data to check for changes
            const hasChanges = JSON.stringify(profileData.value) !== JSON.stringify(originalProfile.value);

            if (hasChanges) {
                showCancelModal.value = true;
            } else {
                // No changes, navigate back directly
                router.push(`/profile/${profileId.value}`);
            }
        };

        // Confirm cancel
        const confirmCancel = () => {
            showCancelModal.value = false;
            // Navigate back to profile
            router.push(`/profile/${profileId.value}`);
        };

        // Watch for changes to form data
        watch(profileData, () => {
            if (originalProfile.value && JSON.stringify(profileData.value) !== JSON.stringify(originalProfile.value)) {
                hasUnsavedChanges.value = true;
            } else {
                hasUnsavedChanges.value = false;
            }
        }, { deep: true });

        // Prevent accidental navigation away
        onBeforeRouteLeave((to, from, next) => {
            if (hasUnsavedChanges.value && !submitting.value) {
                showCancelModal.value = true;
                next(false);
            } else {
                next();
            }
        });

        // Add window beforeunload event
        onMounted(() => {
            window.addEventListener('beforeunload', (e) => {
                if (hasUnsavedChanges.value) {
                    e.preventDefault();
                    e.returnValue = '';
                }
            });

            fetchProfile();
        });

        // Clean up in onBeforeUnmount
        onBeforeUnmount(() => {
            window.removeEventListener('beforeunload', (e) => {
                if (hasUnsavedChanges.value) {
                    e.preventDefault();
                    e.returnValue = '';
                }
            });
        });

        return {
            profileData,
            initialLoading,
            loading,
            submitting,
            error,
            formError,
            showCancelModal,
            showSubmitModal,
            handleSubmit,
            handleCancel,
            confirmCancel,
            confirmSubmit,
            fetchProfile
        };
    }
}
</script>

<style scoped>
.animation-delay-200 {
    animation-delay: 0.2s;
}

.animation-delay-400 {
    animation-delay: 0.4s;
}
</style>