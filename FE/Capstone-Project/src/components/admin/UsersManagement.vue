<template>
    <div class="bg-white rounded-lg shadow-md p-6">

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-4">
            <i class="fas fa-spinner fa-spin text-2xl text-gray-600"></i>
            <span class="ml-2">Đang tải...</span>
        </div>

        <!-- Error State -->
        <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-4">
            {{ error }}
        </div>

        <!-- User Table -->
        <div v-else-if="users.length" class="overflow-x-auto">
            <table class="min-w-full bg-white">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600">ID</th>
                        <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600">Username</th>
                        <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600">Email</th>
                        <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600">Họ tên</th>
                        <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                        <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id" class="border-b hover:bg-gray-50">
                        <td class="py-3 px-4 text-sm">{{ user.id }}</td>
                        <td class="py-3 px-4 text-sm">{{ user.username }}</td>
                        <td class="py-3 px-4 text-sm">{{ user.email }}</td>
                        <td class="py-3 px-4 text-sm">{{ user.full_name || 'N/A' }}</td>
                        <td class="py-3 px-4 text-sm">
                            <span :class="{
                                'px-2 py-1 rounded-full text-xs font-medium': true,
                                'bg-green-100 text-green-800': user.is_active,
                                'bg-red-100 text-red-800': !user.is_active,
                            }">
                                {{ user.is_active ? 'Kích hoạt' : 'Vô hiệu hóa' }}
                            </span>
                        </td>
                        <td class="py-3 px-4 text-sm">
                            <div class="flex space-x-2">
                                <button @click="viewUser(user.id)" class="p-1 text-blue-400 hover:text-blue-800"
                                    title="Xem chi tiết">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button @click="editUser(user.id)" class="p-1 text-green-600 hover:text-green-800"
                                    title="Chỉnh sửa">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button @click="toggleUserStatus(user)" :class="{
                                    'p-1': true,
                                    'text-red-600 hover:text-red-800': user.is_active,
                                    'text-green-600 hover:text-green-800': !user.is_active,
                                }" :title="user.is_active ? 'Vô hiệu hóa' : 'Kích hoạt'">
                                    <i :class="{
                                        'fas': true,
                                        'fa-ban': user.is_active,
                                        'fa-check-circle': !user.is_active
                                    }"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- No Data State -->
        <div v-else class="text-center py-4 text-gray-600">
            Không có người dùng nào để hiển thị.
        </div>

        <!-- Pagination Controls -->
        <div v-if="users.length" class="mt-6 flex justify-between items-center">
            <button @click="previousPage" :disabled="!previous"
                class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300">
                <i class="fas fa-chevron-left mr-1"></i> Trước
            </button>
            <span class="text-sm text-gray-600">Tổng: {{ count }} người dùng</span>
            <button @click="nextPage" :disabled="!next"
                class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300">
                Tiếp <i class="fas fa-chevron-right ml-1"></i>
            </button>
        </div>
    </div>
</template>

<script>
// Thêm import useRouter
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
    name: 'UsersManagement',
    setup() {
        const store = useStore();
        const router = useRouter(); // Thêm router

        // Computed properties from Vuex store
        const users = computed(() => store.state.admin?.users?.results || []);
        const next = computed(() => store.state.admin?.users?.next || null);
        const previous = computed(() => store.state.admin?.users?.previous || null);
        const count = computed(() => store.state.admin?.users?.count || 0);
        const loading = computed(() => store.state.admin?.loading || false);
        const error = computed(() => store.state.admin?.error || null);

        // Fetch users from API
        const fetchUsers = async (url = `${import.meta.env.VITE_APP_API_URL}/api/users/`) => {
            try {
                store.commit('admin/SET_LOADING', true);
                await store.dispatch('admin/fetchUsers', url);
            } catch (err) {
                store.commit('admin/SET_ERROR', 'Không thể tải danh sách người dùng');
            } finally {
                store.commit('admin/SET_LOADING', false);
            }
        };

        // Pagination handlers
        const nextPage = () => {
            if (next.value) fetchUsers(next.value);
        };

        const previousPage = () => {
            if (previous.value) fetchUsers(previous.value);
        };

        // Toggle user status
        const toggleUserStatus = async (user) => {
            const action = user.is_active ? 'vô hiệu hóa' : 'kích hoạt';
            if (confirm(`Bạn có chắc muốn ${action} người dùng này?`)) {
                try {
                    store.commit('admin/SET_LOADING', true);
                    await store.dispatch('admin/toggleUserStatus', {
                        id: user.id,
                        is_active: !user.is_active,
                    });
                } catch (err) {
                    store.commit('admin/SET_ERROR', `Không thể ${action} người dùng`);
                } finally {
                    store.commit('admin/SET_LOADING', false);
                }
            }
        };

        // Thêm các hàm xử lý sự kiện
        const viewUser = (userId) => {
            router.push(`/admin/users/${userId}`);
        };

        const editUser = (userId) => {
            router.push(`/admin/users/${userId}/edit`);
        };

        // Initial fetch
        onMounted(() => {
            fetchUsers();
        });

        return {
            users,
            next,
            previous,
            count,
            loading,
            error,
            nextPage,
            previousPage,
            toggleUserStatus,
            viewUser,
            editUser,
        };
    },
};
</script>