<template>
    <div class="bg-gray-50 min-h-screen pt-16 pb-10">
        <!-- Hero section -->
        <section class="bg-gradient-to-r from-blue-600 to-indigo-700 py-12 px-4 mb-8">
            <div class="container mx-auto max-w-4xl text-center text-white">
                <h1 class="text-3xl font-bold mb-4">Đăng hồ sơ người thất lạc gần đây</h1>
                <p class="text-lg opacity-90 max-w-2xl mx-auto">
                    Đăng thông tin người thất lạc hoặc thông tin về người bạn gặp để hỗ trợ tìm kiếm và đoàn tụ gia đình
                </p>
            </div>
        </section>

        <!-- Form section -->
        <div class="container mx-auto px-4">
            <div class="max-w-8xl mx-auto">
                <!-- Profile Type Selection -->
                <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h2 class="text-xl font-semibold text-gray-800 mb-4">Chọn loại hồ sơ</h2>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md"
                            :class="{ 'border-blue-500 bg-blue-50': profileType === 'seeker' }"
                            @click="profileType = 'seeker'">
                            <div class="flex items-center">
                                <div class="w-6 h-6 border-2 rounded-full flex items-center justify-center mr-3"
                                    :class="{ 'border-blue-500': profileType === 'seeker' }">
                                    <div v-if="profileType === 'seeker'" class="w-3 h-3 bg-blue-500 rounded-full"></div>
                                </div>
                                <div>
                                    <h3 class="font-medium text-gray-800">Người đi tìm</h3>
                                    <p class="text-sm text-gray-600">Tôi đang tìm kiếm người thân thất lạc</p>
                                </div>
                            </div>
                        </div>

                        <div class="border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md"
                            :class="{ 'border-blue-500 bg-blue-50': profileType === 'finder' }"
                            @click="profileType = 'finder'">
                            <div class="flex items-center">
                                <div class="w-6 h-6 border-2 rounded-full flex items-center justify-center mr-3"
                                    :class="{ 'border-blue-500': profileType === 'finder' }">
                                    <div v-if="profileType === 'finder'" class="w-3 h-3 bg-blue-500 rounded-full"></div>
                                </div>
                                <div>
                                    <h3 class="font-medium text-gray-800">Người cung cấp thông tin</h3>
                                    <p class="text-sm text-gray-600">Tôi gặp người có thể đang thất lạc</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Profile Form -->
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h2 class="text-xl font-semibold text-gray-800 mb-6">Thông tin hồ sơ</h2>

                    <form @submit.prevent="createProfile" class="space-y-6">
                        <!-- Title -->
                        <div>
                            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                                Tiêu đề hồ sơ <span class="text-red-500">*</span>
                            </label>
                            <input v-model="formData.title" type="text" id="title" required
                                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nhập tiêu đề ngắn gọn..." />
                        </div>

                        <!-- Name -->
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                                Tên người thất lạc
                                <span v-if="profileType === 'seeker'" class="text-red-500">*</span>
                                <span v-else class="text-gray-400 font-normal">(nếu biết)</span>
                            </label>
                            <input v-model="formData.name" type="text" id="name" :required="profileType === 'seeker'"
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
                                {{ profileType === 'seeker' ? 'Ngày mất tích' : 'Ngày gặp' }}
                            </label>
                            <input v-model="formData.missing_date" type="date" id="missing_date"
                                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        <!-- Location -->
                        <div>
                            <label for="location" class="block text-sm font-medium text-gray-700 mb-1">
                                {{ profileType === 'seeker' ? 'Địa điểm mất tích' : 'Địa điểm gặp' }}
                            </label>
                            <input v-model="formData.location" type="text" id="location"
                                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Địa điểm cụ thể..." />
                        </div>

                        <!-- Contact Persons - JSON Format -->
                        <ContactPersonsForm v-model="formData.contact_persons" class="border-t pt-6" />

                        <!-- Description -->
                        <div>
                            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                                Mô tả chi tiết <span class="text-red-500">*</span>
                            </label>
                            <textarea v-model="formData.description" id="description" rows="5" required
                                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                :placeholder="getDescriptionPlaceholder()"></textarea>
                            <p class="mt-1 text-sm text-gray-500">
                                {{ profileType === 'seeker' ?
                                    'Mô tả chi tiết về người thân, hoàn cảnh mất tích, đặc điểm nhận dạng, tình huống cuối cùng...' :
                                'Mô tả chi tiết về người bạn gặp, hoàn cảnh gặp, đặc điểm nhận dạng, trạng thái của người đó...'
                                }}
                            </p>
                        </div>

                        <!-- Status (optional - auto set to active) -->
                        <input type="hidden" v-model="formData.status" />

                        <!-- Submit Buttons -->
                        <div class="flex justify-end space-x-3 pt-6 border-t">
                            <router-link to="/recently-missing"
                                class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                                <i class="fas fa-times mr-2"></i>
                                Hủy
                            </router-link>
                            <button type="submit" :disabled="submitting"
                                class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                <i class="fas fa-spinner fa-spin mr-2" v-if="submitting"></i>
                                <i class="fas fa-save mr-2" v-else></i>
                                {{ submitting ? 'Đang tạo...' : 'Tạo hồ sơ' }}
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Help text -->
                <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-start">
                        <i class="fas fa-info-circle text-blue-500 mt-0.5 mr-3"></i>
                        <div class="text-sm text-blue-800">
                            <h4 class="font-medium mb-2">Lưu ý quan trọng:</h4>
                            <ul class="space-y-1 list-disc list-inside">
                                <li>Sau khi tạo hồ sơ thành công, bạn sẽ được chuyển đến trang tải ảnh</li>
                                <li>Ảnh khuôn mặt giúp hệ thống AI nhận diện và khớp với các hồ sơ khác</li>
                                <li>Thông tin người thân giúp các bên liên hệ khi có thông tin hữu ích</li>
                                <li>Mô tả chi tiết càng rõ ràng càng giúp việc tìm kiếm hiệu quả</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import ContactPersonsForm from '@/components/recentlyMissing/ContactPersonsForm.vue';

export default {
    name: 'RecentlyMissingCreateView',

    components: {
        ContactPersonsForm
    },

    setup() {
        const router = useRouter();
        const store = useStore();

        // State
        const profileType = ref('seeker');
        const submitting = ref(false);
        const formData = ref({
            title: '',
            name: '',
            age: null,
            missing_date: '',
            location: '',
            description: '',
            contact_persons: {},
            profile_type: 'seeker',
            status: 'active'
        });

        // Update form data when profile type changes
        watch(profileType, (newType) => {
            formData.value.profile_type = newType;
        });

        // Dynamic placeholder for description
        const getDescriptionPlaceholder = () => {
            if (profileType.value === 'seeker') {
                return 'Ví dụ: Người thân tôi cao khoảng 1m65, tóc ngắn màu đen, có nốt ruồi ở má trái. Lần cuối gặp đang mặc áo sơ mi trắng và quần jeans xanh. Người này có thói quen đi dạo buổi sáng và thường mang theo túi xách nhỏ màu nâu...';
            } else {
                return 'Ví dụ: Tôi gặp một người có vẻ đang lạc đường, cao khoảng 1m60, tóc bạc, mặc áo len đỏ và quần đen. Người này có vẻ bối rối, không nhớ được địa chỉ nhà và cứ hỏi đi về phía Bệnh viện Bach Mai. Tôi gặp vào khoảng 14h ngày hôm qua...';
            }
        };

        // Validate form data
        const validateFormData = () => {
            if (!formData.value.title?.trim()) {
                throw new Error('Vui lòng nhập tiêu đề báo cáo');  // ✅ Đổi message
            }

            if (!formData.value.description?.trim()) {
                throw new Error('Vui lòng nhập mô tả chi tiết');
            }

            if (profileType.value === 'seeker' && !formData.value.name?.trim()) {
                throw new Error('Vui lòng nhập tên người thất lạc');
            }

            if (formData.value.age !== null && formData.value.age !== undefined) {
                if (formData.value.age < 0 || formData.value.age > 120) {
                    throw new Error('Tuổi phải từ 0 đến 120');
                }
            }

            if (formData.value.contact_persons && typeof formData.value.contact_persons === 'object') {
                for (const [relationship, name] of Object.entries(formData.value.contact_persons)) {
                    if (relationship?.length > 50) {
                        throw new Error(`Tên mối quan hệ "${relationship}" quá dài (tối đa 50 ký tự)`);
                    }
                    if (name?.length > 100) {
                        throw new Error(`Tên người thân "${name}" quá dài (tối đa 100 ký tự)`);
                    }
                }
            }
        };

        // Show notification helper
        const showNotification = (message, type = 'success') => {
            if (type === 'success') {
                console.log('✅ Success:', message);
                alert(`✅ ${message}`);
            } else {
                console.error('❌ Error:', message);
                alert(`❌ ${message}`);
            }
        };

        // Create missing report  # ✅ Đổi comment
        const createMissingReport = async () => {  // ✅ Đổi tên function
            submitting.value = true;

            try {
                validateFormData();

                const cleanedData = {
                    ...formData.value,
                    title: formData.value.title?.trim(),
                    name: formData.value.name?.trim() || '',
                    location: formData.value.location?.trim() || '',
                    description: formData.value.description?.trim(),
                    contact_persons: formData.value.contact_persons || {},
                    missing_date: formData.value.missing_date || null,
                    age: formData.value.age || null
                };

                console.log('🚀 Creating missing report with data:', cleanedData);  // ✅ Đổi log

                const newReport = await store.dispatch('recentlyMissing/createMissingReport', cleanedData);  // ✅ Đổi action và tên biến

                console.log('✅ Missing report created successfully:', newReport);  // ✅ Đổi log

                if (!newReport || !newReport.id) {
                    throw new Error('Không nhận được ID báo cáo từ server');  // ✅ Đổi message
                }

                showNotification('Tạo báo cáo thành công! Bây giờ hãy tải lên ảnh khuôn mặt.');  // ✅ Đổi message

                router.push(`/recently-missing/${newReport.id}/upload-image`);

            } catch (err) {
                console.error('❌ Error creating missing report:', err);  // ✅ Đổi log

                let errorMessage = 'Không thể tạo báo cáo. Vui lòng thử lại sau.';  // ✅ Đổi message

                if (err.response?.data?.detail) {
                    errorMessage = err.response.data.detail;
                } else if (err.response?.data?.error) {
                    errorMessage = err.response.data.error;
                } else if (err.message) {
                    errorMessage = err.message;
                }

                showNotification(errorMessage, 'error');
            } finally {
                submitting.value = false;
            }
        };

        return {
            profileType,
            formData,
            submitting,
            createProfile: createMissingReport,  // ✅ Alias để không phải đổi template
            getDescriptionPlaceholder
        };
    }
}
</script>

<style scoped>
/* Custom styles for better form appearance */
.form-section {
    border-left: 4px solid #e5e7eb;
    padding-left: 1rem;
}

.form-section.active {
    border-left-color: #3b82f6;
    background-color: #f8fafc;
}

/* Smooth transitions */
.transition-all {
    transition-property: all;
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus states */
input:focus,
textarea:focus,
select:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Custom radio button styling */
.radio-option {
    position: relative;
    cursor: pointer;
}

.radio-option input[type="radio"] {
    position: absolute;
    opacity: 0;
}

.radio-option .radio-circle {
    transition: all 0.2s ease;
}

.radio-option input[type="radio"]:checked+.radio-circle {
    border-color: #3b82f6;
    background-color: #3b82f6;
}

/* Responsive design improvements */
@media (max-width: 640px) {
    .container {
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .grid-cols-2 {
        grid-template-columns: 1fr;
    }
}
</style>