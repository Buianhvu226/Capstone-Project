<template>
    <div class="min-h-screen bg-slate-50 pt-16 pb-6 sm:pt-20 sm:pb-8">
        <div class="max-w-4xl mx-auto px-3 sm:px-4">

            <!-- Hero section -->
            <section
                class="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm px-4 sm:px-5 py-4 sm:py-5 mb-4 sm:mb-5">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div class="flex items-start gap-3">
                        <div
                            class="mt-0.5 h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-100">
                            <i class="fas fa-user-plus text-base"></i>
                        </div>
                        <div>
                            <h1 class="text-base sm:text-lg font-semibold text-slate-900">
                                Đăng báo cáo người thất lạc gần đây
                            </h1>
                            <p class="mt-1 text-xs sm:text-sm text-slate-600 max-w-xl">
                                Đăng thông tin người thất lạc hoặc người bạn gặp để cộng đồng và hệ thống AI hỗ trợ tìm
                                kiếm,
                                đoàn tụ gia đình.
                            </p>
                        </div>
                    </div>
                    <div class="text-xs text-slate-500">
                        <p><span class="font-semibold text-blue-600">Lưu ý:</span> Hãy nhập thông tin chính xác và đầy
                            đủ.</p>
                    </div>
                </div>
            </section>

            <!-- Profile Type Selection -->
            <section
                class="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 mb-4 sm:mb-5">
                <h2 class="text-sm sm:text-base font-semibold text-slate-900 mb-3 sm:mb-4">
                    Chọn loại báo cáo
                </h2>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <button type="button"
                        class="text-left border rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        :class="{ 'border-blue-500 bg-blue-50': profileType === 'seeker' }"
                        @click="profileType = 'seeker'">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center justify-center w-6 h-6 rounded-full border-2"
                                :class="profileType === 'seeker' ? 'border-blue-500 bg-blue-50' : 'border-slate-300'">
                                <div v-if="profileType === 'seeker'" class="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                            </div>
                            <div>
                                <h3 class="font-medium text-slate-900 text-sm sm:text-base">Người đi tìm</h3>
                                <p class="text-xs sm:text-[13px] text-slate-600">
                                    Tôi đang tìm kiếm người thân thất lạc.
                                </p>
                            </div>
                        </div>
                    </button>

                    <button type="button"
                        class="text-left border rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        :class="{ 'border-blue-500 bg-blue-50': profileType === 'finder' }"
                        @click="profileType = 'finder'">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center justify-center w-6 h-6 rounded-full border-2"
                                :class="profileType === 'finder' ? 'border-blue-500 bg-blue-50' : 'border-slate-300'">
                                <div v-if="profileType === 'finder'" class="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                            </div>
                            <div>
                                <h3 class="font-medium text-slate-900 text-sm sm:text-base">Người cung cấp thông tin
                                </h3>
                                <p class="text-xs sm:text-[13px] text-slate-600">
                                    Tôi gặp người có thể đang thất lạc.
                                </p>
                            </div>
                        </div>
                    </button>
                </div>
            </section>

            <!-- Profile Form -->
            <section class="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5">
                <h2 class="text-sm sm:text-base font-semibold text-slate-900 mb-3 sm:mb-4">
                    Thông tin báo cáo
                </h2>

                <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-5">
                    <!-- Title -->
                    <div>
                        <label for="title" class="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                            Tiêu đề báo cáo <span class="text-red-500">*</span>
                        </label>
                        <input v-model="formData.title" type="text" id="title" required
                            class="w-full border border-slate-300 rounded-lg px-3 sm:px-3.5 py-2.5 text-sm sm:text-[15px] shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
                            placeholder="Nhập tiêu đề ngắn gọn, dễ hiểu..." />
                    </div>

                    <!-- Name -->
                    <div>
                        <label for="name" class="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                            Tên người thất lạc
                            <span v-if="profileType === 'seeker'" class="text-red-500">*</span>
                            <span v-else class="text-slate-400 font-normal">(nếu biết)</span>
                        </label>
                        <input v-model="formData.name" type="text" id="name" :required="profileType === 'seeker'"
                            class="w-full border border-slate-300 rounded-lg px-3 sm:px-3.5 py-2.5 text-sm sm:text-[15px] shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
                            placeholder="Nhập họ tên đầy đủ..." />
                    </div>

                    <!-- Age and Missing Date in a grid on larger screens -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <!-- Age -->
                        <div>
                            <label for="age" class="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                                Tuổi
                                <span class="text-slate-400 font-normal">(ước tính)</span>
                            </label>
                            <input v-model.number="formData.age" type="number" id="age" min="0" max="120"
                                class="w-full border border-slate-300 rounded-lg px-3 sm:px-3.5 py-2.5 text-sm sm:text-[15px] shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
                                placeholder="Nhập tuổi (nếu biết)..." />
                        </div>

                        <!-- Missing Date -->
                        <div>
                            <label for="missing_date"
                                class="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                                {{ profileType === 'seeker' ? 'Ngày mất tích' : 'Ngày gặp' }}
                            </label>
                            <input v-model="formData.missing_date" type="date" id="missing_date" :max="todayDate"
                                class="w-full border border-slate-300 rounded-lg px-3 sm:px-3.5 py-2.5 text-sm sm:text-[15px] shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                            <p v-if="dateError" class="mt-1 text-xs sm:text-[13px] text-red-500">{{ dateError }}</p>
                        </div>
                    </div>

                    <!-- Location -->
                    <div>
                        <label for="location" class="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                            {{ profileType === 'seeker' ? 'Địa điểm mất tích' : 'Địa điểm gặp' }}
                        </label>
                        <input v-model="formData.location" type="text" id="location"
                            class="w-full border border-slate-300 rounded-lg px-3 sm:px-3.5 py-2.5 text-sm sm:text-[15px] shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
                            placeholder="Địa điểm cụ thể (đường, phường/xã, quận/huyện, tỉnh/thành)..." />
                    </div>

                    <!-- Contact Persons -->
                    <ContactPersonsForm v-model="formData.contact_persons" class="border-t pt-4 sm:pt-5" />

                    <!-- Description -->
                    <div>
                        <label for="description" class="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                            Mô tả chi tiết <span class="text-red-500">*</span>
                        </label>
                        <textarea v-model="formData.description" id="description" rows="5" required
                            class="w-full border border-slate-300 rounded-lg px-3 sm:px-3.5 py-2.5 text-sm sm:text-[15px] shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
                            :placeholder="getDescriptionPlaceholder()"></textarea>
                        <p class="mt-1 text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                            {{
                                profileType === 'seeker'
                                    ? 'Mô tả chi tiết về người thân, hoàn cảnh mất tích, đặc điểm nhận dạng, tình huống cuối cùng...'
                            : 'Mô tả chi tiết về người bạn gặp, hoàn cảnh gặp, đặc điểm nhận dạng, trạng thái của người đó...'
                            }}
                        </p>
                    </div>

                    <!-- Status (optional - auto set to active) -->
                    <input type="hidden" v-model="formData.status" />

                    <!-- Submit Buttons -->
                    <div
                        class="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4 sm:pt-5 border-t border-slate-200">
                        <router-link to="/recently-missing"
                            class="px-4 sm:px-5 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-center text-sm sm:text-[15px]">
                            <i class="fas fa-times mr-2"></i>
                            Hủy
                        </router-link>
                        <button type="submit" :disabled="submitting"
                            class="px-4 sm:px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm sm:text-[15px] font-medium transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                            <i class="fas fa-spinner fa-spin mr-2" v-if="submitting"></i>
                            <i class="fas fa-save mr-2" v-else></i>
                            {{ submitting ? 'Đang tạo...' : 'Tạo báo cáo' }}
                        </button>
                    </div>
                </form>
            </section>

            <!-- Help text -->
            <section class="mt-4 sm:mt-5 bg-blue-50 border border-blue-200 rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5">
                <div class="flex items-start gap-2.5">
                    <i class="fas fa-info-circle text-blue-500 mt-0.5 text-base sm:text-lg"></i>
                    <div class="text-xs sm:text-[13px] text-blue-900">
                        <h4 class="font-semibold mb-1 sm:mb-1.5">Lưu ý quan trọng</h4>
                        <ul class="space-y-1 list-disc list-inside">
                            <li>Sau khi tạo báo cáo, bạn sẽ được chuyển đến trang tải ảnh khuôn mặt.</li>
                            <li>Ảnh rõ nét giúp hệ thống AI nhận diện và khớp với các báo cáo khác chính xác hơn.</li>
                            <li>Thông tin liên hệ giúp các bên có thông tin hữu ích kết nối với bạn nhanh chóng.</li>
                            <li>Mô tả chi tiết, rõ ràng sẽ tăng khả năng tìm kiếm hiệu quả.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    </div>

    <!-- Long-term Missing Warning Modal -->
    <div v-if="showLongTermWarning"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-4 sm:p-6 mx-auto">
            <div class="flex items-center justify-between mb-3 sm:mb-4">
                <h3 class="text-lg sm:text-xl font-bold text-gray-800">
                    <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
                    Cảnh báo: Thất lạc lâu năm
                </h3>
                <button @click="showLongTermWarning = false" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="mb-4 sm:mb-6">
                <p class="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                    Bạn đã nhập thời gian mất tích từ <span class="font-semibold">5 năm trở lên</span>. Trong khoảng
                    thời gian dài như vậy, khuôn mặt của người thất lạc có thể đã thay đổi đáng kể.
                </p>
                <p class="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                    Điều này có thể làm giảm độ chính xác của hệ thống nhận dạng khuôn mặt AI khi tìm kiếm người
                    thất lạc.
                </p>
                <div class="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 mb-3 sm:mb-4">
                    <p class="text-sm sm:text-base text-blue-700">
                        <strong>Gợi ý:</strong> Đối với trường hợp thất lạc lâu năm, bạn có thể tạo hồ sơ thất lạc
                        lâu năm để được hỗ trợ tốt hơn.
                    </p>
                    <router-link to="/profile/create"
                        class="text-sm sm:text-base text-blue-600 hover:underline mt-1 sm:mt-2 inline-block">
                        <i class="fas fa-arrow-right mr-1"></i> Tạo hồ sơ thất lạc lâu năm
                    </router-link>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button @click="showLongTermWarning = false"
                    class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm sm:text-base">
                    Quay lại chỉnh sửa
                </button>
                <button @click="proceedWithLongTermMissing"
                    class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm sm:text-base">
                    Vẫn tiếp tục tạo báo cáo
                </button>
            </div>
        </div>
    </div>
    
</template>

<script>
import { ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import ContactPersonsForm from '@/components/recentlyMissing/forms/ContactPersonsForm.vue';

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
        const dateError = ref('');
        const showLongTermWarning = ref(false);
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

        // Get today's date in YYYY-MM-DD format for max date validation
        const todayDate = computed(() => {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        });

        // Update form data when profile type changes
        watch(profileType, (newType) => {
            formData.value.profile_type = newType;
        });

        // Check if the missing date is more than 5 years ago
        const isLongTermMissing = () => {
            if (!formData.value.missing_date || profileType.value !== 'seeker') return false;

            const missingDate = new Date(formData.value.missing_date);
            const today = new Date();

            // Calculate difference in years
            const diffTime = today - missingDate;
            const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);

            return diffYears >= 5;
        };

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
            dateError.value = '';

            if (!formData.value.title?.trim()) {
                throw new Error('Vui lòng nhập tiêu đề báo cáo');
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

            // Validate missing date is not in the future
            if (formData.value.missing_date) {
                const missingDate = new Date(formData.value.missing_date);
                const today = new Date();
                // Đặt cả hai về 00:00:00 để chỉ so sánh ngày
                missingDate.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);

                if (missingDate > today) {
                    dateError.value = 'Ngày không thể là ngày trong tương lai';
                    throw new Error('Ngày không thể là ngày trong tương lai');
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

        // Handle form submission
        const handleSubmit = async () => {
            try {
                validateFormData();

                // Check if it's a long-term missing case
                if (isLongTermMissing()) {
                    showLongTermWarning.value = true;
                    return;
                }

                // If not long-term missing, proceed with normal flow
                await createMissingReport();

            } catch (err) {
                let errorMessage = err.message || 'Đã xảy ra lỗi khi xử lý biểu mẫu';
                showNotification(errorMessage, 'error');
            }
        };

        // Proceed with creating report even for long-term missing
        const proceedWithLongTermMissing = async () => {
            showLongTermWarning.value = false;
            await createMissingReport();
        };

        // Create missing report
        const createMissingReport = async () => {
            submitting.value = true;

            try {
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

                console.log('🚀 Creating missing report with data:', cleanedData);

                const newReport = await store.dispatch('recentlyMissing/createMissingReport', cleanedData);

                console.log('✅ Missing report created successfully:', newReport);

                if (!newReport || !newReport.id) {
                    throw new Error('Không nhận được ID báo cáo từ server');
                }

                showNotification('Tạo báo cáo thành công! Bây giờ hãy tải lên ảnh khuôn mặt.');

                router.push(`/recently-missing/${newReport.id}/upload-image`);

            } catch (err) {
                console.error('❌ Error creating missing report:', err);

                let errorMessage = 'Không thể tạo báo cáo. Vui lòng thử lại sau.';

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
            dateError,
            todayDate,
            showLongTermWarning,
            handleSubmit,
            createProfile: createMissingReport, // Alias để không phải đổi template
            getDescriptionPlaceholder,
            proceedWithLongTermMissing
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

/* Fix date input appearance on mobile */
input[type="date"] {
    -webkit-appearance: none;
    appearance: none;
}

/* Fix button alignment on mobile */
@media (max-width: 640px) {

    .flex-col button,
    .flex-col a {
        width: 100%;
    }
}

/* Improve touch targets on mobile */
@media (max-width: 640px) {

    input,
    select,
    textarea,
    button {
        min-height: 44px;
    }
}
</style>