<template>
  <form @submit.prevent="submitForm" class="space-y-4 text-sm">
    <!-- Form fields -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <!-- Tiêu đề -->
      <div class="col-span-1 md:col-span-2">
        <label for="title" class="block text-xs font-semibold text-slate-600 mb-1">
          Tiêu đề hồ sơ <span class="text-red-500">*</span>
        </label>
        <input id="title" v-model="formData.title" type="text" :class="inputClass"
          placeholder="Ví dụ: Nguyễn Văn A tìm con gái thất lạc năm 1975" />
      </div>

      <!-- Họ và tên -->
      <div>
        <label for="fullName" class="block text-xs font-semibold text-slate-600 mb-1">
          Họ và tên <span class="text-red-500">*</span>
        </label>
        <input id="fullName" v-model="formData.full_name" type="text" required :class="inputClass"
          placeholder="Họ và tên người cần tìm" />
      </div>

      <!-- Năm sinh -->
      <div>
        <label for="bornYear" class="block text-xs font-semibold text-slate-600 mb-1">
          Năm sinh
        </label>
        <input id="bornYear" v-model="formData.born_year" type="text" :class="inputClass"
          placeholder="Năm sinh (nếu biết)" />
      </div>

      <!-- Năm thất lạc -->
      <div>
        <label for="losingYear" class="block text-xs font-semibold text-slate-600 mb-1">
          Năm thất lạc
        </label>
        <input id="losingYear" v-model="formData.losing_year" type="text" :class="inputClass"
          placeholder="Năm thất lạc (nếu biết)" />
      </div>

      <!-- Tên cha -->
      <div>
        <label for="fatherName" class="block text-xs font-semibold text-slate-600 mb-1">
          Tên cha
        </label>
        <input id="fatherName" v-model="formData.name_of_father" type="text" :class="inputClass"
          placeholder="Tên cha (nếu biết)" />
      </div>

      <!-- Tên mẹ -->
      <div>
        <label for="motherName" class="block text-xs font-semibold text-slate-600 mb-1">
          Tên mẹ
        </label>
        <input id="motherName" v-model="formData.name_of_mother" type="text" :class="inputClass"
          placeholder="Tên mẹ (nếu biết)" />
      </div>

      <!-- Anh chị em -->
      <div>
        <label for="siblings" class="block text-xs font-semibold text-slate-600 mb-1">
          Anh chị em
        </label>
        <input id="siblings" v-model="formData.siblings" type="text" :class="inputClass"
          placeholder="Tên anh chị em (nếu có)" />
      </div>

      <!-- Trạng thái -->
      <div>
        <label for="status" class="block text-xs font-semibold text-slate-600 mb-1">
          Trạng thái
        </label>
        <select id="status" v-model="formData.status" :class="inputClass">
          <option value="active">Đang tìm kiếm</option>
          <option value="found">Đã tìm thấy</option>
          <option value="closed">Đã đóng</option>
        </select>
      </div>
    </div>

    <!-- Phần upload hình ảnh đã được loại bỏ -->

    <!-- Mô tả chi tiết -->
    <div>
      <label for="description" class="block text-xs font-semibold text-slate-600 mb-1">
        Chi tiết <span class="text-red-500">*</span>
      </label>
      <textarea id="description" v-model="formData.description" rows="4" required
        :class="textareaClass"
        placeholder="Mô tả hoàn cảnh thất lạc, đặc điểm nhận dạng và thông tin quan trọng khác"></textarea>
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
    <div class="flex justify-end gap-3 text-xs">
      <button v-if="isEditing" type="button" @click="cancelEdit"
        class="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition flex items-center gap-1">
        <i class="fas fa-times text-xs"></i>
        Hủy
      </button>
      <button type="submit" :disabled="loading"
        class="px-4 py-2 rounded-lg bg-blue-500 text-white flex items-center gap-2 text-xs font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50">
        <svg v-if="loading" class="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <i v-else class="fas fa-save text-xs"></i>
        <span>{{ loading ? 'Đang lưu...' : (submitButtonText || (isEditing ? 'Cập nhật hồ sơ' : 'Tạo hồ sơ')) }}</span>
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
    const inputClass = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition outline-none placeholder:text-slate-400';
    const textareaClass = `${inputClass} min-h-[140px]`;

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
      cancelEdit,
      inputClass,
      textareaClass
    };
  }
}
</script>