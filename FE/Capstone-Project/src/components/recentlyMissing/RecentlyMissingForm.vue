<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Tiêu đề hồ sơ -->
            <div class="col-span-1 md:col-span-2">
                <label for="title" class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <i class="fas fa-heading text-blue-500 mr-1.5"></i> Tiêu đề hồ sơ <span
                        class="text-red-500">*</span>
                </label>
                <input id="title" v-model="formData.title" type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="VD: Tìm con gái Nguyễn Thị A thất lạc ở Hà Nội" required />
                <p class="mt-1 text-xs text-gray-500">Tiêu đề ngắn gọn, nêu rõ mục đích tìm kiếm</p>
            </div>

            <!-- Loại hồ sơ -->
            <div class="col-span-1">
                <label for="profile_type" class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <i class="fas fa-user-tag text-blue-500 mr-1.5"></i> Loại hồ sơ <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                    <select id="profile_type" v-model="formData.profile_type"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        required>
                        <option value="" disabled>Chọn loại hồ sơ</option>
                        <option value="seeker">Người đi tìm (tôi đang đi tìm người thân)</option>
                        <option value="finder">Người cung cấp thông tin (tôi biết thông tin về người thất lạc)</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>
            </div>

            <!-- Tên người thất lạc -->
            <div class="col-span-1">
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <i class="fas fa-user text-blue-500 mr-1.5"></i> Tên người thất lạc
                </label>
                <input id="name" v-model="formData.name" type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập tên người thất lạc" />
            </div>

            <!-- Tuổi -->
            <div class="col-span-1 md:col-span-1">
                <label for="age" class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <i class="fas fa-birthday-cake text-blue-500 mr-1.5"></i> Tuổi (ước lượng)
                </label>
                <input id="age" v-model="formData.age" type="number"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="VD: 25" />
            </div>

            <!-- Ngày mất tích -->
            <div class="col-span-1 md:col-span-1">
                <label for="missing_date" class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <i class="fas fa-calendar-minus text-blue-500 mr-1.5"></i> Ngày mất tích
                </label>
                <input id="missing_date" v-model="formData.missing_date" type="date"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <!-- Địa điểm -->
            <div class="col-span-1">
                <label for="location" class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <i class="fas fa-map-marker-alt text-blue-500 mr-1.5"></i> Địa điểm mất tích/gặp
                </label>
                <input id="location" v-model="formData.location" type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="VD: Bến xe Mỹ Đình, Hà Nội" />
            </div>

            <!-- Trạng thái -->
            <div class="col-span-1">
                <label for="status" class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <i class="fas fa-dot-circle text-blue-500 mr-1.5"></i> Trạng thái hồ sơ
                </label>
                <div class="relative">
                    <select id="status" v-model="formData.status"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                        <option value="active">Đang tìm kiếm</option>
                        <option value="closed">Tạm đóng</option>
                        <option value="found">Đã tìm thấy</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>
            </div>

            <!-- Mô tả chi tiết -->
            <div class="col-span-1 md:col-span-2">
                <label for="description" class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <i class="fas fa-align-left text-blue-500 mr-1.5"></i> Mô tả chi tiết <span
                        class="text-red-500">*</span>
                </label>
                <textarea id="description" v-model="formData.description" rows="6"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mô tả chi tiết về hoàn cảnh mất tích, đặc điểm nhận dạng, quần áo đang mặc..."
                    required></textarea>
                <p class="mt-1 text-xs text-gray-500">Chi tiết giúp tăng khả năng tìm kiếm</p>
            </div>
        </div>

        <!-- Error display -->
        <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div class="flex">
                <div class="flex-shrink-0">
                    <i class="fas fa-exclamation-circle text-red-600"></i>
                </div>
                <div class="ml-3">
                    <p class="text-sm text-red-600">{{ error }}</p>
                </div>
            </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
            <button type="submit" :disabled="loading"
                class="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
                <i v-else class="fas fa-save mr-2"></i>
                {{ submitButtonText }}
            </button>
        </div>
    </form>
</template>

<script>
import { ref, onMounted, watch } from 'vue'

export default {
    name: 'RecentlyMissingForm',

    props: {
        initialData: {
            type: Object,
            default: () => ({})
        },
        loading: {
            type: Boolean,
            default: false
        },
        error: {
            type: [String, null],
            default: null
        },
        submitButtonText: {
            type: String,
            default: 'Lưu hồ sơ'
        }
    },

    setup(props, { emit }) {
        const formData = ref({
            title: '',
            profile_type: '',
            name: '',
            age: null,
            missing_date: '',
            location: '',
            description: '',
            status: 'active'
        })

        // Fill form with initial data if provided
        onMounted(() => {
            if (props.initialData) {
                formData.value = {
                    title: props.initialData.title || '',
                    profile_type: props.initialData.profile_type || '',
                    name: props.initialData.name || '',
                    age: props.initialData.age || null,
                    missing_date: props.initialData.missing_date ? formatDateForInput(props.initialData.missing_date) : '',
                    location: props.initialData.location || '',
                    description: props.initialData.description || '',
                    status: props.initialData.status || 'active'
                }
            }
        })

        // Watch for changes in initialData
        watch(() => props.initialData, (newVal) => {
            if (newVal) {
                formData.value = {
                    title: newVal.title || '',
                    profile_type: newVal.profile_type || '',
                    name: newVal.name || '',
                    age: newVal.age || null,
                    missing_date: newVal.missing_date ? formatDateForInput(newVal.missing_date) : '',
                    location: newVal.location || '',
                    description: newVal.description || '',
                    status: newVal.status || 'active'
                }
            }
        }, { deep: true })

        // Format date string for input field (YYYY-MM-DD)
        const formatDateForInput = (dateString) => {
            try {
                const date = new Date(dateString);
                return date.toISOString().split('T')[0];
            } catch (e) {
                return '';
            }
        }

        // Handle form submission
        const handleSubmit = () => {
            emit('submit', { ...formData.value })
        }

        return {
            formData,
            handleSubmit
        }
    }
}
</script>