<template>
    <div class="min-h-screen bg-slate-50">
        <AppHeader />
        <div class="max-w-7xl mx-auto px-3 sm:px-4 pt-20 pb-8">
            <!-- Hero Section -->
            <section class="bg-white rounded-lg p-3 mb-3">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div class="flex items-center gap-3">
                        <div class="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            <i class="fas fa-edit text-base"></i>
                        </div>
                        <div>
                            <h1 class="text-base font-bold text-slate-800">Chỉnh sửa hồ sơ</h1>
                            <p class="text-xs text-slate-500">Cập nhật thông tin hồ sơ tìm kiếm của bạn</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Loading State -->
            <div v-if="initialLoading" class="bg-white rounded-lg border border-slate-200 p-8 text-center">
                <div class="inline-flex items-center justify-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                </div>
                <p class="text-xs text-slate-600 mt-3">Đang tải thông tin hồ sơ...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="bg-white rounded-lg border border-slate-200 p-4 text-center mb-3">
                <div class="inline-block p-3 bg-red-50 rounded-full mb-3">
                    <i class="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                </div>
                <h3 class="text-sm font-semibold text-slate-800 mb-2">Đã xảy ra lỗi</h3>
                <p class="text-xs text-slate-600 mb-3">{{ error }}</p>
                <div class="flex justify-center gap-2">
                    <button @click="fetchProfile"
                        class="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-xs font-semibold">
                        <i class="fas fa-sync-alt mr-1.5"></i> Thử lại
                    </button>
                    <router-link to="/my-profile"
                        class="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition text-xs font-semibold">
                        <i class="fas fa-arrow-left mr-1.5"></i> Quay lại
                    </router-link>
                </div>
            </div>

            <!-- Edit Form -->
            <div v-else class="bg-white rounded-lg border border-slate-200 p-3">
                <!-- Info Notice -->
                <div class="rounded-lg border border-blue-200 bg-blue-50 p-2.5 mb-3">
                    <div class="flex items-start gap-2">
                        <i class="fas fa-info-circle text-blue-500 text-sm mt-0.5"></i>
                        <p class="text-xs text-blue-700">
                            <span class="font-semibold">Lưu ý:</span> Khi lưu thay đổi, hệ thống sẽ tạo hồ sơ mới và xóa
                            hồ sơ cũ. Các thông tin liên kết có thể bị ảnh hưởng.
                        </p>
                    </div>
                </div>

                <!-- Form with scroll -->
                <div class="max-h-[calc(100vh-280px)] overflow-y-auto custom-scroll">
                    <ProfileForm :initialData="profileData" :loading="loading" :error="formError" :isEditing="true"
                        submitButtonText="Lưu thay đổi" @submit="handleSubmit" @cancel="handleCancel" />
                </div>
            </div>

            <!-- Cancel Confirmation Modal -->
            <teleport to="body">
                <div v-if="showCancelModal"
                    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-4">
                        <div class="flex items-center gap-3 mb-3">
                            <div
                                class="h-10 w-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center">
                                <i class="fas fa-exclamation-triangle text-sm"></i>
                            </div>
                            <h3 class="text-sm font-semibold text-slate-900">Xác nhận hủy thay đổi</h3>
                        </div>
                        <p class="text-xs text-slate-600 mb-4">Bạn có chắc muốn hủy các thay đổi đã chỉnh sửa? Tất cả
                            thông tin sẽ không được lưu.</p>
                        <div class="flex justify-end gap-2">
                            <button @click="showCancelModal = false"
                                class="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-xs font-semibold">
                                <i class="fas fa-arrow-left mr-1.5"></i> Tiếp tục chỉnh sửa
                            </button>
                            <button @click="confirmCancel"
                                class="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-semibold">
                                <i class="fas fa-times mr-1.5"></i> Xác nhận hủy
                            </button>
                        </div>
                    </div>
                </div>
            </teleport>

            <!-- Submit Confirmation Modal -->
            <teleport to="body">
                <div v-if="showSubmitModal"
                    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-4">
                        <div class="flex items-center gap-3 mb-3">
                            <div
                                class="h-10 w-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
                                <i class="fas fa-info-circle text-sm"></i>
                            </div>
                            <h3 class="text-sm font-semibold text-slate-900">Xác nhận lưu thay đổi</h3>
                        </div>
                        <p class="text-xs text-slate-600 mb-4">Bạn có chắc muốn lưu các thay đổi đã chỉnh sửa? Hệ thống
                            sẽ tạo một hồ sơ mới và xóa hồ sơ cũ.</p>
                        <div class="flex justify-end gap-2">
                            <button @click="showSubmitModal = false"
                                class="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-xs font-semibold">
                                <i class="fas fa-arrow-left mr-1.5"></i> Tiếp tục chỉnh sửa
                            </button>
                            <button @click="confirmSubmit" :disabled="submitting"
                                class="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                                <i v-if="submitting" class="fas fa-spinner fa-spin mr-1.5"></i>
                                <i v-else class="fas fa-check mr-1.5"></i>
                                <span>{{ submitting ? 'Đang lưu...' : 'Xác nhận lưu' }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </teleport>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import axios from 'axios';
import AppHeader from '@/components/common/AppHeader.vue';
import ProfileForm from '@/components/profile/ProfileForm.vue';

export default {
    name: 'ProfileEditView',
    components: {
        AppHeader,
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

                const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/profiles/${profileId.value}/`, {
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
                const createResponse = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/profiles/`, profileData.value, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const newProfileId = createResponse.data.id;

                // 2. Delete the old profile
                if (newProfileId) {
                    await axios.delete(`${import.meta.env.VITE_APP_API_URL}/api/profiles/${profileId.value}/`, {
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
.custom-scroll::-webkit-scrollbar {
    width: 6px;
}

.custom-scroll::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 8px;
}

.custom-scroll::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 8px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

.custom-scroll {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
}
</style>