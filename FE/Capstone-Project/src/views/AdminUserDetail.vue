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
            <span class="text-gray-700 font-medium">Chi tiết người dùng</span>
        </div>

        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">
                <i class="fas fa-user-circle mr-2 text-blue-400"></i>Chi tiết người dùng
            </h1>
            <router-link to="/admin" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition duration-200 flex items-center">
                <i class="fas fa-arrow-left mr-2"></i> Quay lại
            </router-link>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-lg shadow-md p-8 text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3"></div>
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

        <!-- User Details -->
        <div v-else-if="user" class="bg-white shadow-md rounded-lg overflow-hidden">
            <!-- User Header -->
            <div class="bg-gradient-to-r from-blue-500 to-blue-400 p-6 text-white">
                <div class="flex items-center">
                    <div class="bg-white rounded-full h-20 w-20 flex items-center justify-center shadow-md">
                        <span class="text-blue-400 text-3xl font-bold">{{ user.username?.charAt(0).toUpperCase() || 'U' }}</span>
                    </div>
                    <div class="ml-6">
                        <h2 class="text-2xl font-bold">{{ user.full_name || user.username }}</h2>
                        <p class="opacity-90 flex items-center">
                            <i class="fas fa-envelope mr-2"></i> {{ user.email }}
                        </p>
                        <div class="mt-2">
                            <span :class="{
                                'px-3 py-1 rounded-full text-xs font-medium': true,
                                'bg-green-100 text-green-800': user.is_active,
                                'bg-red-100 text-red-800': !user.is_active,
                            }">
                                <i :class="{
                                    'fas mr-1': true,
                                    'fa-check-circle': user.is_active,
                                    'fa-ban': !user.is_active
                                }"></i>
                                {{ user.is_active ? 'Đang hoạt động' : 'Đã vô hiệu hóa' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- User Information -->
            <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Account Information -->
                    <div class="bg-gray-50 p-5 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <i class="fas fa-user-shield mr-2 text-blue-400"></i> Thông tin tài khoản
                        </h3>
                        <div class="space-y-3">
                            <div class="flex border-b border-gray-200 pb-3">
                                <div class="w-1/3 text-gray-500">ID</div>
                                <div class="w-2/3 font-medium">{{ user.id }}</div>
                            </div>
                            <div class="flex border-b border-gray-200 pb-3">
                                <div class="w-1/3 text-gray-500">Username</div>
                                <div class="w-2/3 font-medium">{{ user.username }}</div>
                            </div>
                            <div class="flex border-b border-gray-200 pb-3">
                                <div class="w-1/3 text-gray-500">Email</div>
                                <div class="w-2/3 font-medium">{{ user.email }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Personal Information -->
                    <div class="bg-gray-50 p-5 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <i class="fas fa-address-card mr-2 text-blue-400"></i> Thông tin cá nhân
                        </h3>
                        <div class="space-y-3">
                            <div class="flex border-b border-gray-200 pb-3">
                                <div class="w-1/3 text-gray-500">Họ tên</div>
                                <div class="w-2/3 font-medium">{{ user.full_name || 'N/A' }}</div>
                            </div>
                            <div class="flex border-b border-gray-200 pb-3">
                                <div class="w-1/3 text-gray-500">Địa chỉ</div>
                                <div class="w-2/3 font-medium">{{ user.address || 'N/A' }}</div>
                            </div>
                            <div class="flex border-b border-gray-200 pb-3">
                                <div class="w-1/3 text-gray-500">Số điện thoại</div>
                                <div class="w-2/3 font-medium">{{ user.phone || 'N/A' }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="mt-8 flex justify-end space-x-3">
                    <router-link :to="`/admin/users/${user.id}/edit`" class="bg-blue-400 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition duration-200 flex items-center">
                        <i class="fas fa-edit mr-2"></i> Chỉnh sửa
                    </router-link>
                    <button @click="toggleUserStatus" :class="{
                        'px-5 py-2 rounded-lg transition duration-200 flex items-center': true,
                        'bg-red-600 hover:bg-red-700 text-white': user.is_active,
                        'bg-green-600 hover:bg-green-700 text-white': !user.is_active
                    }">
                        <i :class="{
                            'fas mr-2': true,
                            'fa-ban': user.is_active,
                            'fa-check-circle': !user.is_active
                        }"></i>
                        {{ user.is_active ? 'Vô hiệu hóa' : 'Kích hoạt' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- No Data State -->
        <div v-else class="bg-white shadow-md rounded-lg p-8 text-center">
            <div class="inline-block rounded-full h-16 w-16 bg-gray-100 flex items-center justify-center mb-4">
                <i class="fas fa-user-slash text-gray-400 text-2xl"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-700 mb-2">Không tìm thấy thông tin người dùng</h3>
            <p class="text-gray-500 mb-4">Người dùng này có thể đã bị xóa hoặc không tồn tại.</p>
            <router-link to="/admin" class="bg-blue-400 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 inline-flex items-center">
                <i class="fas fa-arrow-left mr-2"></i> Quay lại danh sách
            </router-link>
        </div>
    </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default {
    setup() {
        const store = useStore();
        const route = useRoute();

        const user = computed(() => store.state.admin?.currentUser || null);
        const loading = computed(() => store.state.admin?.loading || false);
        const error = computed(() => store.state.admin?.error || null);

        const fetchUser = async () => {
            try {
                store.commit('admin/SET_LOADING', true);
                await store.dispatch('admin/fetchUser', route.params.id);
            } catch (err) {
                store.commit('admin/SET_ERROR', 'Không thể tải thông tin người dùng');
            } finally {
                store.commit('admin/SET_LOADING', false);
            }
        };

        const toggleUserStatus = async () => {
            const action = user.value.is_active ? 'vô hiệu hóa' : 'kích hoạt';
            if (confirm(`Bạn có chắc muốn ${action} người dùng này?`)) {
                try {
                    store.commit('admin/SET_LOADING', true);
                    await store.dispatch('admin/toggleUserStatus', {
                        id: user.value.id,
                        is_active: !user.value.is_active,
                    });
                } catch (err) {
                    store.commit('admin/SET_ERROR', `Không thể ${action} người dùng`);
                } finally {
                    store.commit('admin/SET_LOADING', false);
                }
            }
        };

        onMounted(() => {
            fetchUser();
        });

        return {
            user,
            loading,
            error,
            toggleUserStatus,
        };
    },
};
</script>

<style scoped>
/* Thêm hiệu ứng hover cho các phần tử */
.border-b:hover {
    background-color: rgba(243, 244, 246, 0.5);
}

/* Hiệu ứng chuyển đổi cho các nút */
button, a {
    transition: all 0.2s ease;
}

/* Hiệu ứng shadow khi hover vào card */
.bg-white.shadow-md:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>