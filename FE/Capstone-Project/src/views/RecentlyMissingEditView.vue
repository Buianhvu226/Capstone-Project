<template>
    <div class="bg-gray-50 min-h-screen pt-16 pb-10">
        <!-- Loading indicator -->
        <div v-if="loading" class="container mx-auto px-4 py-12 flex justify-center">
            <AppLoader />
        </div>

        <div v-else class="container mx-auto px-4">
            <!-- Breadcrumb -->
            <nav class="flex py-4" aria-label="Breadcrumb">
                <ol class="inline-flex items-center space-x-1 md:space-x-3">
                    <li class="inline-flex items-center">
                        <router-link to="/" class="text-gray-700 hover:text-blue-600">
                            <i class="fas fa-home mr-2"></i> Trang chủ
                        </router-link>
                    </li>
                    <li>
                        <div class="flex items-center">
                            <i class="fas fa-chevron-right text-gray-400 mx-2 text-sm"></i>
                            <router-link to="/recently-missing" class="text-gray-700 hover:text-blue-600">
                                Người mất tích gần đây
                            </router-link>
                        </div>
                    </li>
                    <li>
                        <div class="flex items-center">
                            <i class="fas fa-chevron-right text-gray-400 mx-2 text-sm"></i>
                            <router-link :to="`/recently-missing/${id}`" class="text-gray-700 hover:text-blue-600">
                                Chi tiết
                            </router-link>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div class="flex items-center">
                            <i class="fas fa-chevron-right text-gray-400 mx-2 text-sm"></i>
                            <span class="text-gray-500">Chỉnh sửa</span>
                        </div>
                    </li>
                </ol>
            </nav>

            <!-- Hero section -->
            <section class="bg-gradient-to-r from-blue-600 to-indigo-700 py-10 px-4 mb-8 rounded-xl">
                <div class="container mx-auto max-w-4xl text-center text-white">
                    <h1 class="text-3xl font-bold mb-4">Chỉnh sửa hồ sơ</h1>
                    <p class="text-lg opacity-90 max-w-2xl mx-auto">
                        Cập nhật thông tin về người thất lạc hoặc thông tin bạn đã cung cấp
                    </p>
                </div>
            </section>

            <!-- Form -->
            <div class="max-w-3xl mx-auto">
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <form @submit.prevent="updateProfile" class="space-y-6">
                        <!-- Title -->
                        <div>
                            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Tiêu đề hồ sơ <span
                                    class="text-red-500">*</span></label>
                            <input v-model="formData.title" type="text" id="title" required
                                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nhập tiêu đề ngắn gọn..." />
                        </div>

                        <!-- Name -->
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                                Tên người thất lạc
                                <span v-if="formData.profile_type === 'seeker'" class="text-red-500">*</span>
                                <span v-else class="text-gray-400 font-normal">(nếu biết)</span>
                            </label>
                            <input v-model="formData.name" type="text" id="name"
                                :required="formData.profile_type === 'seeker'"
                                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nhập họ tên đầy đủ..." />
                        </div>

                        <!-- Age -->
                        <div>
                            <label for="age" class="block text-sm font-medium text-gray-700 mb-1">
                                Tuổi
                                <span class="text-gray-400 font-normal">(ước tính)</span>
                            </label>
                            <input v-model.number="formData.age" type="number" id="age" min="0" max="120"
                                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nhập tuổi..." />
                        </div>

                        <!-- Missing Date -->
                        <div>
                            <label for="missing_date" class="block text-sm font-medium text-gray-700 mb-1">
                                Ngày mất tích/gặp
                            </label>
                            <input v-model="formData.missing_date" type="date" id="missing_date"
                                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        <!-- Location -->
                        <div>
                            <label for="location" class="block text-sm font-medium text-gray-700 mb-1">
                                Địa điểm mất tích/gặp
                            </label>
                            <input v-model="formData.location" type="text" id="location"
                                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Địa điểm cụ thể..." />
                        </div>

                        <!-- Status -->
                        <div>
                            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
                                Trạng thái
                            </label>
                            <select v-model="formData.status" id="status"
                                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option value="active">Đang tìm kiếm</option>
                                <option value="found">Đã tìm thấy</option>
                                <option value="closed">Đã đóng</option>
                            </select>
                        </div>

                        <!-- Description -->
                        <div>
                            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                                Mô tả chi tiết <span class="text-red-500">*</span>
                            </label>
                            <textarea v-model="formData.description" id="description" rows="5" required
                                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                :placeholder="formData.profile_type === 'seeker' ?
                                    'Mô tả chi tiết về người thân, hoàn cảnh mất tích, đặc điểm nhận dạng...' :
                                    'Mô tả chi tiết về người bạn gặp, hoàn cảnh gặp, đặc điểm nhận dạng...'"></textarea>
                        </div>

                        <!-- Buttons -->
                        <div class="flex justify-end space-x-3 pt-4">
                            <router-link :to="`/recently-missing/${id}`"
                                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                                Hủy
                            </router-link>
                            <button type="submit" :disabled="submitting"
                                class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                <i class="fas fa-spinner fa-spin mr-2" v-if="submitting"></i>
                                <i class="fas fa-save mr-2" v-else></i>
                                {{ submitting ? 'Đang lưu...' : 'Lưu thay đổi' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import AppLoader from '@/components/common/AppLoader.vue';
import recentlyMissingService from '@/services/recentlyMissingService';

export default {
    name: 'RecentlyMissingEditView',

    components: {
        AppLoader
    },

    setup() {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();
        const id = route.params.id;

        // State
        const loading = ref(true);
        const submitting = ref(false);
        const formData = ref({
            title: '',
            name: '',
            age: null,
            missing_date: '',
            location: '',
            description: '',
            profile_type: 'seeker',
            status: 'active'
        });

        // Load profile data
        const fetchProfile = async () => {
            try {
                loading.value = true;
                const response = await recentlyMissingService.getProfileById(id);

                // Format date for input field (YYYY-MM-DD)
                const formatDate = response.missing_date ? new Date(response.missing_date).toISOString().split('T')[0] : '';

                formData.value = {
                    ...response,
                    missing_date: formatDate
                };
            } catch (error) {
                console.error('Error fetching profile:', error);
                alert('Không thể tải thông tin hồ sơ');
                router.push('/recently-missing');
            } finally {
                loading.value = false;
            }
        };

        // Update profile
        const updateProfile = async () => {
            try {
                submitting.value = true;

                // Validate required fields based on profile type
                if (formData.value.profile_type === 'seeker' && !formData.value.name) {
                    throw new Error('Vui lòng nhập tên người thất lạc');
                }

                // Update profile using the correct service
                await recentlyMissingService.updateProfile(id, formData.value);

                // Success notification
                alert('Đã cập nhật hồ sơ thành công');

                // Redirect back to detail
                router.push(`/recently-missing/${id}`);
            } catch (error) {
                console.error('Error updating profile:', error);

                // Show error message
                const errorMessage = error.message || 'Không thể cập nhật hồ sơ. Vui lòng thử lại sau.';
                alert(errorMessage);
            } finally {
                submitting.value = false;
            }
        };

        // Load data on mount
        onMounted(() => {
            fetchProfile();
        });

        return {
            id,
            loading,
            submitting,
            formData,
            updateProfile
        };
    }
}
</script>