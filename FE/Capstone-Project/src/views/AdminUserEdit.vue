<template>
    <div class="container mx-auto p-6">
        <!-- Breadcrumb Navigation -->
        <div class="flex items-center text-sm text-gray-500 mb-6">
            <router-link to="/admin" class="hover:text-blue-400">
                <i class="fas fa-home mr-1"></i> Trang quản trị
            </router-link>
            <span class="mx-2">/</span>
            <router-link to="/admin" class="hover:text-blue-400">Quản lý người dùng</router-link>
            <span class="mx-2">/</span>
            <span class="text-gray-700 font-medium">Chỉnh sửa người dùng</span>
        </div>

        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">
                <i class="fas fa-user-edit mr-2 text-blue-400"></i>Chỉnh sửa người dùng
            </h1>
            <router-link to="/admin"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition duration-200 flex items-center">
                <i class="fas fa-arrow-left mr-2"></i> Quay lại
            </router-link>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-lg shadow-md p-8 text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3">
            </div>
            <p class="text-gray-600">Đang tải thông tin người dùng...</p>
        </div>

        <!-- Error State -->
        <div v-if="error" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-md mb-6 flex items-start">
            <i class="fas fa-exclamation-circle mr-3 mt-0.5 text-red-500"></i>
            <div>
                <h3 class="font-bold">Đã xảy ra lỗi</h3>
                <p>{{ error }}</p>
            </div>
        </div>

        <!-- Edit Form -->
        <div v-else-if="user" class="bg-white shadow-md rounded-lg overflow-hidden">
            <!-- Form Header -->
            <div class="bg-gradient-to-r from-blue-500 to-blue-400 p-6 text-white">
                <div class="flex items-center">
                    <div class="bg-white rounded-full h-16 w-16 flex items-center justify-center shadow-md">
                        <span class="text-blue-400 text-2xl font-bold">{{ form.username?.charAt(0).toUpperCase() || 'U'
                            }}</span>
                    </div>
                    <div class="ml-6">
                        <h2 class="text-xl font-bold">{{ form.username }}</h2>
                        <p class="opacity-90">Cập nhật thông tin người dùng</p>
                    </div>
                </div>
            </div>

            <!-- Form Content -->
            <div class="p-6">
                <form @submit.prevent="updateUser" class="space-y-6">
                    <!-- Account Information -->
                    <div class="bg-gray-50 p-5 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <i class="fas fa-user-shield mr-2 text-blue-400"></i> Thông tin tài khoản
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="fas fa-user text-gray-400"></i>
                                    </div>
                                    <input v-model="form.username" type="text"
                                        class="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                                        readonly />
                                </div>
                                <p class="mt-1 text-xs text-gray-500">Username không thể thay đổi</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="fas fa-envelope text-gray-400"></i>
                                    </div>
                                    <input v-model="form.email" type="email"
                                        class="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Personal Information -->
                    <div class="bg-gray-50 p-5 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <i class="fas fa-address-card mr-2 text-blue-400"></i> Thông tin cá nhân
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="fas fa-user-tag text-gray-400"></i>
                                    </div>
                                    <input v-model="form.full_name" type="text"
                                        class="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="fas fa-phone text-gray-400"></i>
                                    </div>
                                    <input v-model="form.phone" type="text"
                                        class="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="fas fa-map-marker-alt text-gray-400"></i>
                                    </div>
                                    <input v-model="form.address" type="text"
                                        class="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <router-link to="/admin"
                            class="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition duration-200 flex items-center">
                            <i class="fas fa-times mr-2"></i> Hủy
                        </router-link>
                        <button type="submit"
                            class="px-5 py-2 bg-blue-400 hover:bg-blue-700 text-white rounded-lg transition duration-200 flex items-center"
                            :disabled="loading">
                            <i class="fas fa-save mr-2"></i> Lưu thay đổi
                            <span v-if="loading" class="ml-2">
                                <i class="fas fa-spinner animate-spin"></i>
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- No Data State -->
        <div v-else class="bg-white shadow-md rounded-lg p-8 text-center">
            <div class="inline-block rounded-full h-16 w-16 bg-gray-100 flex items-center justify-center mb-4">
                <i class="fas fa-user-slash text-gray-400 text-2xl"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-700 mb-2">Không tìm thấy thông tin người dùng</h3>
            <p class="text-gray-500 mb-4">Người dùng này có thể đã bị xóa hoặc không tồn tại.</p>
            <router-link to="/admin"
                class="bg-blue-400 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 inline-flex items-center">
                <i class="fas fa-arrow-left mr-2"></i> Quay lại danh sách
            </router-link>
        </div>
    </div>
</template>

<script>
import { computed, onMounted, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

export default {
    setup() {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();

        const user = computed(() => store.state.admin?.currentUser || null);
        const loading = computed(() => store.state.admin?.loading || false);
        const error = computed(() => store.state.admin?.error || null);

        const form = reactive({
            username: '',
            email: '',
            full_name: '',
            address: '',
            phone: '',
        });

        const fetchUser = async () => {
            try {
                store.commit('admin/SET_LOADING', true);
                await store.dispatch('admin/fetchUser', route.params.id);
                const userData = store.state.admin.currentUser;
                if (userData) {
                    form.username = userData.username;
                    form.email = userData.email;
                    form.full_name = userData.full_name || '';
                    form.address = userData.address || '';
                    form.phone = userData.phone || '';
                }
            } catch (err) {
                store.commit('admin/SET_ERROR', 'Không thể tải thông tin người dùng');
            } finally {
                store.commit('admin/SET_LOADING', false);
            }
        };

        const updateUser = async () => {
            try {
                store.commit('admin/SET_LOADING', true);
                await store.dispatch('admin/updateUser', {
                    id: route.params.id,
                    data: {
                        email: form.email,
                        full_name: form.full_name,
                        address: form.address,
                        phone: form.phone,
                    },
                });
                router.push('/admin');
            } catch (err) {
                store.commit('admin/SET_ERROR', 'Không thể cập nhật người dùng');
            } finally {
                store.commit('admin/SET_LOADING', false);
            }
        };

        onMounted(() => {
            fetchUser();
        });

        return {
            user,
            loading,
            error,
            form,
            updateUser,
        };
    },
};
</script>

<style scoped>
/* Hiệu ứng input focus */
input:focus {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

/* Hiệu ứng hover cho các phần tử */
.bg-gray-50:hover {
    background-color: rgba(249, 250, 251, 0.8);
}

/* Hiệu ứng chuyển đổi cho các nút */
button,
a {
    transition: all 0.2s ease;
}

/* Hiệu ứng shadow khi hover vào card */
.bg-white.shadow-md:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Hiệu ứng cho input readonly */
input[readonly] {
    background-color: #f3f4f6;
    cursor: not-allowed;
}
</style>