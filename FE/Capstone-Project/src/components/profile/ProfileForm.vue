<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      {{ error }}
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">Họ và tên người thất lạc</label>
        <input 
          id="fullName" 
          v-model="form.fullName" 
          type="text" 
          class="input" 
          required
        />
      </div>
      
      <div>
        <label for="age" class="block text-sm font-medium text-gray-700 mb-1">Tuổi (ước tính)</label>
        <input 
          id="age" 
          v-model="form.age" 
          type="number" 
          class="input"
        />
      </div>
      
      <div>
        <label for="gender" class="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
        <select 
          id="gender" 
          v-model="form.gender" 
          class="input"
        >
          <option value="">-- Chọn giới tính --</option>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
          <option value="other">Khác</option>
        </select>
      </div>
      
      <div>
        <label for="lastSeenLocation" class="block text-sm font-medium text-gray-700 mb-1">Địa điểm cuối cùng gặp</label>
        <input 
          id="lastSeenLocation" 
          v-model="form.lastSeenLocation" 
          type="text" 
          class="input"
        />
      </div>
      
      <div>
        <label for="lastSeenDate" class="block text-sm font-medium text-gray-700 mb-1">Ngày cuối cùng gặp</label>
        <input 
          id="lastSeenDate" 
          v-model="form.lastSeenDate" 
          type="date" 
          class="input"
        />
      </div>
      
      <div>
        <label for="contactInfo" class="block text-sm font-medium text-gray-700 mb-1">Thông tin liên hệ</label>
        <input 
          id="contactInfo" 
          v-model="form.contactInfo" 
          type="text" 
          class="input"
        />
      </div>
    </div>
    
    <div>
      <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
      <textarea 
        id="description" 
        v-model="form.description" 
        rows="5" 
        class="input" 
        required
      ></textarea>
      <p class="mt-1 text-sm text-gray-500">
        Mô tả chi tiết về người thân, đặc điểm nhận dạng, hoàn cảnh thất lạc...
      </p>
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
      <div class="border border-dashed border-gray-300 rounded-md p-6 text-center">
        <input 
          type="file" 
          @change="handleFileChange" 
          multiple 
          accept="image/*" 
          class="hidden" 
          ref="fileInput"
        />
        <button 
          type="button" 
          @click="$refs.fileInput.click()" 
          class="btn btn-secondary"
        >
          Chọn hình ảnh
        </button>
        <p class="mt-2 text-sm text-gray-500">
          Có thể chọn nhiều hình ảnh
        </p>
      </div>
      
      <div v-if="previewImages.length" class="mt-4 grid grid-cols-3 gap-4">
        <div v-for="(image, index) in previewImages" :key="index" class="relative">
          <img :src="image" class="w-full h-32 object-cover rounded-md" />
          <button 
            type="button" 
            @click="removeImage(index)" 
            class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
    
    <div class="flex justify-end">
      <button 
        type="submit" 
        class="btn btn-primary" 
        :disabled="loading"
      >
        <span v-if="loading">Đang xử lý...</span>
        <span v-else>Đăng ký hồ sơ</span>
      </button>
    </div>
  </form>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'ProfileForm',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: null
    },
    initialData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['submit'],
  setup(props, { emit }) {
    const fileInput = ref(null)
    const files = ref([])
    const previewImages = ref([])
    
    const form = reactive({
      fullName: props.initialData.fullName || '',
      age: props.initialData.age || '',
      gender: props.initialData.gender || '',
      lastSeenLocation: props.initialData.lastSeenLocation || '',
      lastSeenDate: props.initialData.lastSeenDate || '',
      contactInfo: props.initialData.contactInfo || '',
      description: props.initialData.description || ''
    })
    
    const handleFileChange = (event) => {
      const selectedFiles = Array.from(event.target.files)
      files.value = [...files.value, ...selectedFiles]
      
      selectedFiles.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          previewImages.value.push(e.target.result)
        }
        reader.readAsDataURL(file)
      })
    }
    
    const removeImage = (index) => {
      previewImages.value.splice(index, 1)
      files.value.splice(index, 1)
    }
    
    const handleSubmit = () => {
      const formData = {
        ...form,
        images: files.value
      }
      emit('submit', formData)
    }
    
    return {
      form,
      fileInput,
      previewImages,
      handleFileChange,
      removeImage,
      handleSubmit
    }
  }
}
</script>