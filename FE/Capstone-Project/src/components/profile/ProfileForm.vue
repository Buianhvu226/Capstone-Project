<template>
  <form @submit.prevent="submitForm" class="space-y-6">
    <!-- Form fields -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Tiêu đề -->
      <div class="col-span-1 md:col-span-2">
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
          Tiêu đề hồ sơ <span class="text-red-500">*</span>
        </label>
        <input id="title" v-model="formData.title" type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ví dụ: Nguyễn Văn A tìm con gái thất lạc năm 1975" />
      </div>

      <!-- Họ và tên -->
      <div>
        <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">
          Họ và tên <span class="text-red-500">*</span>
        </label>
        <input id="fullName" v-model="formData.full_name" type="text" required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Họ và tên người cần tìm" />
      </div>

      <!-- Năm sinh -->
      <div>
        <label for="bornYear" class="block text-sm font-medium text-gray-700 mb-1">
          Năm sinh
        </label>
        <input id="bornYear" v-model="formData.born_year" type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Năm sinh (nếu biết)" />
      </div>

      <!-- Năm thất lạc -->
      <div>
        <label for="losingYear" class="block text-sm font-medium text-gray-700 mb-1">
          Năm thất lạc
        </label>
        <input id="losingYear" v-model="formData.losing_year" type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Năm thất lạc (nếu biết)" />
      </div>

      <!-- Tên cha -->
      <div>
        <label for="fatherName" class="block text-sm font-medium text-gray-700 mb-1">
          Tên cha
        </label>
        <input id="fatherName" v-model="formData.name_of_father" type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Tên cha (nếu biết)" />
      </div>

      <!-- Tên mẹ -->
      <div>
        <label for="motherName" class="block text-sm font-medium text-gray-700 mb-1">
          Tên mẹ
        </label>
        <input id="motherName" v-model="formData.name_of_mother" type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Tên mẹ (nếu biết)" />
      </div>

      <!-- Anh chị em -->
      <div>
        <label for="siblings" class="block text-sm font-medium text-gray-700 mb-1">
          Anh chị em
        </label>
        <input id="siblings" v-model="formData.siblings" type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Tên anh chị em (nếu có)" />
      </div>

      <!-- Trạng thái -->
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
          Trạng thái
        </label>
        <select id="status" v-model="formData.status"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
          <option value="active">Đang tìm kiếm</option>
          <option value="found">Đã tìm thấy</option>
          <option value="closed">Đã đóng</option>
        </select>
      </div>
    </div>

    <!-- Phần upload hình ảnh đã được loại bỏ -->

    <!-- Mô tả chi tiết -->
    <div>
      <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
        Chi tiết <span class="text-red-500">*</span>
      </label>
      <textarea id="description" v-model="formData.description" rows="5" required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        placeholder="Mô tả chi tiết về hoàn cảnh thất lạc, đặc điểm nhận dạng, và các thông tin liên quan khác"></textarea>
    </div>

    <!-- Thông báo lỗi -->
    <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="fas fa-exclamation-circle text-red-500"></i>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Nút gửi form -->
    <div class="flex justify-end space-x-4">
      <button v-if="isEditing" type="button" @click="cancelEdit"
        class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center">
        <i class="fas fa-times mr-2"></i> Hủy
      </button>
      <button type="submit" :disabled="loading"
        class="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all transform hover:scale-105 hover:shadow-lg flex items-center">
        <i class="fas fa-save mr-2"></i>
        <span v-if="loading">
          <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          Đang lưu...
        </span>
        <span v-else>{{ submitButtonText || (isEditing ? 'Cập nhật hồ sơ' : 'Tạo hồ sơ') }}</span>
      </button>
    </div>
  </form>
</template>

<script>
import { ref, reactive, watch } from 'vue';

export default {
  name: 'ProfileForm',
  props: {
    initialData: {
      type: Object,
      default: () => ({
        title: '',
        full_name: '',
        born_year: '',
        losing_year: '',
        name_of_father: '',
        name_of_mother: '',
        siblings: '',
        description: '',
        status: 'active'
      })
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    submitButtonText: {
      type: String,
      default: ''
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const formData = reactive({ ...props.initialData });

    // Watch for changes in initialData
    watch(() => props.initialData, (newValue) => {
      Object.assign(formData, newValue);
    }, { deep: true });

    // Submit form
    const submitForm = () => {
      emit('submit', { ...formData });
    };

    // Cancel editing
    const cancelEdit = () => {
      emit('cancel');
    };

    return {
      formData,
      submitForm,
      cancelEdit
    };
  }
}
</script>