<template>
  <div class="bg-gray-50 min-h-screen pt-16 pb-10">
    <!-- Breadcrumb -->
    <div class="container mx-auto px-4">
      <nav class="flex py-4" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <router-link to="/" class="text-gray-700 hover:text-blue-400">
              <i class="fas fa-home mr-2"></i> Trang chủ
            </router-link>
          </li>
          <li>
            <div class="flex items-center">
              <i class="fas fa-chevron-right text-gray-400 mx-2 text-sm"></i>
              <router-link to="/recently-missing" class="text-gray-700 hover:text-blue-400">
                Người mất tích gần đây
              </router-link>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <i class="fas fa-chevron-right text-gray-400 mx-2 text-sm"></i>
              <router-link :to="`/recently-missing/${reportId}`" class="text-gray-700 hover:text-blue-400">
                Chi tiết
              </router-link>
            </div>
          </li>
          <li aria-current="page">
            <div class="flex items-center">
              <i class="fas fa-chevron-right text-gray-400 mx-2 text-sm"></i>
              <span class="text-gray-500">Tải lên ảnh</span>
            </div>
          </li>
        </ol>
      </nav>
    </div>

    <!-- Main content -->
    <div class="container mx-auto px-4 mt-4">
      <div class="max-w-3xl mx-auto">
        <!-- Missing Report Info -->
        <div v-if="missingReport" class="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
          <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ missingReport.title }}</h1>
          <p class="text-gray-600">
            <span :class="{
              'bg-green-100 text-green-800': missingReport.status === 'active',
              'bg-blue-100 text-blue-800': missingReport.status === 'found',
              'bg-gray-100 text-gray-800': missingReport.status === 'closed'
            }" class="inline-block px-2 py-1 text-xs font-medium rounded-full mr-2">
              {{ missingReport.status === 'active' ? 'Đang tìm kiếm' :
                missingReport.status === 'found' ? 'Đã tìm thấy' : 'Đã đóng' }}
            </span>
            <span class="text-sm">{{ missingReport.profile_type === 'seeker' ? 'Người đi tìm' : 'Người cung cấp thông tin' }}</span>
          </p>
        </div>

        <!-- Upload component -->
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <i class="fas fa-cloud-upload-alt text-blue-500 mr-2"></i> Tải lên ảnh khuôn mặt
          </h2>

          <div class="mb-6">
            <p class="text-gray-600 text-sm mb-4">
              Tải lên ảnh khuôn mặt rõ nét nhất có thể. Ảnh sẽ được sử dụng để so khớp với các báo cáo khác.
            </p>

            <!-- File Upload Area -->
            <div
              class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors"
              :class="{ 'border-blue-400 bg-blue-50': isDragging }" @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false" @drop.prevent="handleFileDrop">

              <div v-if="!imagePreview">
                <i class="fas fa-cloud-upload-alt text-gray-400 text-4xl mb-3"></i>
                <p class="text-gray-500 mb-2">
                  Kéo và thả ảnh vào đây hoặc
                  <label for="file-upload" class="text-blue-400 hover:text-blue-800 cursor-pointer">
                    chọn từ máy tính
                  </label>
                </p>
                <p class="text-gray-400 text-xs">PNG, JPG, JPEG (tối đa 5MB)</p>
                <input type="file" id="file-upload" class="hidden" accept="image/jpeg,image/png,image/jpg"
                  @change="handleFileSelect" />
              </div>

              <div v-else class="relative">
                <img :src="imagePreview" alt="Preview" class="mx-auto max-h-64 rounded-lg shadow-sm" />
                <button @click="resetImage"
                  class="absolute top-2 right-2 bg-red-100 text-red-600 rounded-full p-2 hover:bg-red-200 transition-colors">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>

            <!-- Error message -->
            <p v-if="fileError" class="mt-2 text-red-500 text-sm">
              <i class="fas fa-exclamation-circle mr-1"></i> {{ fileError }}
            </p>
          </div>

          <!-- Description -->
          <div class="mb-6">
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
              Mô tả ảnh (tùy chọn)
            </label>
            <textarea id="description" v-model="description" rows="3"
              class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Thêm mô tả về ảnh này..."></textarea>
          </div>

          <!-- Upload progress -->
          <div v-if="uploading" class="mb-6">
            <p class="text-sm font-medium text-gray-700 mb-1">Đang tải lên... {{ Math.round(uploadProgress) }}%</p>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-blue-400 h-2.5 rounded-full" :style="{ width: `${uploadProgress}%` }"></div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end space-x-3">
            <router-link :to="`/recently-missing/${reportId}`"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              Hủy
            </router-link>
            <button @click="uploadImage" :disabled="uploading || !selectedFile"
              class="bg-blue-400 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <i class="fas fa-cloud-upload-alt mr-2" v-if="!uploading"></i>
              <i class="fas fa-spinner fa-spin mr-2" v-else></i>
              {{ uploading ? 'Đang tải lên...' : 'Tải lên' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { supabase } from '@/utils/supabase.js';
import recentlyMissingService from '@/services/recentlyMissingService';

export default {
  name: 'RecentlyMissingImageUpload',

  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const reportId = route.params.id;

    // State
    const missingReport = ref(null);
    const selectedFile = ref(null);
    const imagePreview = ref(null);
    const description = ref('');
    const uploading = ref(false);
    const uploadProgress = ref(0);
    const fileError = ref('');
    const isDragging = ref(false);

    // ✅ Current user với fallback về localStorage
    const currentUser = computed(() => {
      const storeUser = store.getters['auth/currentUser'];
      if (storeUser) {
        console.log('🔍 Current user from store:', storeUser);
        return storeUser;
      }

      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const localUser = JSON.parse(userStr);
          console.log('🔍 Current user from localStorage:', localUser);
          return localUser;
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }

      console.log('🔍 No current user found');
      return null;
    });

    const isAuthenticated = computed(() => {
      const authStatus = store.getters['auth/isAuthenticated'];
      const hasToken = localStorage.getItem('token');
      const result = authStatus || !!hasToken;
      console.log('🔐 Is authenticated:', result, { authStatus, hasToken: !!hasToken });
      return result;
    });

    // ✅ Check if user owns this report
    const isOwner = computed(() => {
      if (!currentUser.value || !missingReport.value) return false;

      const currentUsername = currentUser.value.username || currentUser.value.email;
      const currentId = currentUser.value.id;

      return (missingReport.value.username === currentUsername) ||
        (missingReport.value.username === currentUser.value.email) ||
        (missingReport.value.user_id === currentId) ||
        (missingReport.value.created_by === currentId);
    });

    // Fetch missing report info
    const fetchMissingReport = async () => {
      try {
        console.log('📤 Fetching missing report with ID:', reportId);

        const response = await store.dispatch('recentlyMissing/fetchMissingReportById', reportId);

        console.log('📥 Received missing report:', response);
        missingReport.value = response;

        // ✅ Check ownership after loading report
        if (!isOwner.value) {
          alert('Bạn không có quyền upload ảnh cho báo cáo này');
          router.push(`/recently-missing/${reportId}`);
          return;
        }

      } catch (err) {
        console.error('❌ Error fetching missing report:', err);

        let errorMessage = 'Không thể tải thông tin báo cáo missing';
        if (err.response?.status === 404) {
          errorMessage = 'Không tìm thấy báo cáo missing này';
        } else if (err.response?.status === 403) {
          errorMessage = 'Bạn không có quyền xem báo cáo này';
        }

        alert(errorMessage);
        router.push('/recently-missing');
      }
    };

    // File handling methods (giữ nguyên)
    const handleFileSelect = (event) => {
      const files = event.target.files;
      if (files.length > 0) {
        validateAndSetFile(files[0]);
      }
    };

    const handleFileDrop = (event) => {
      isDragging.value = false;
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        validateAndSetFile(files[0]);
      }
    };

    const validateAndSetFile = (file) => {
      fileError.value = '';

      // Check if file is an image
      if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/jpg')) {
        fileError.value = 'Vui lòng chọn ảnh định dạng JPG, JPEG hoặc PNG';
        return;
      }

      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        fileError.value = 'Kích thước ảnh không được vượt quá 5MB';
        return;
      }

      selectedFile.value = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.value = e.target.result;
      };
      reader.readAsDataURL(file);
    };

    const resetImage = () => {
      selectedFile.value = null;
      imagePreview.value = null;
      fileError.value = '';
    };

    // Upload to Supabase (giữ nguyên)
    const uploadToSupabase = async () => {
      if (!selectedFile.value) return null;

      const fileExt = selectedFile.value.name.split('.').pop();
      const fileName = `recently_missing_report_${reportId}.${fileExt}`;
      const filePath = `recently_missing/${fileName}`;

      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, selectedFile.value, {
          cacheControl: '3600',
          upsert: true,
          onUploadProgress: (progress) => {
            uploadProgress.value = Math.round((progress.loaded / progress.total) * 80);
          },
        });

      if (error) throw error;

      uploadProgress.value = 90;

      const { data: { publicUrl } } = supabase
        .storage
        .from('images')
        .getPublicUrl(filePath);

      return publicUrl;
    };

    // Main upload function (giữ nguyên)
    const uploadImage = async () => {
      if (!selectedFile.value) return;

      // ✅ Double check ownership before upload
      if (!isOwner.value) {
        alert('Bạn không có quyền upload ảnh cho báo cáo này');
        return;
      }

      uploading.value = true;
      uploadProgress.value = 0;
      fileError.value = '';

      try {
        console.log('📤 Uploading image to Supabase...');
        const imageUrl = await uploadToSupabase();
        if (!imageUrl) throw new Error('Không thể tải ảnh lên Supabase');

        uploadProgress.value = 95;

        console.log('📤 Saving image URL to backend...');
        await recentlyMissingService.uploadMissingReportImage(reportId, imageUrl);

        uploadProgress.value = 100;

        alert('Tải ảnh lên thành công!');
        router.push(`/recently-missing/${reportId}`);

      } catch (err) {
        console.error('❌ Error uploading image:', err);

        let errorMessage = 'Không thể tải ảnh lên. Vui lòng thử lại sau.';
        if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.message) {
          errorMessage = err.message;
        }

        fileError.value = errorMessage;
        alert('Lỗi: ' + errorMessage);
      } finally {
        uploading.value = false;
        uploadProgress.value = 0;
      }
    };

    // ✅ Load user nếu cần
    const loadUserIfNeeded = async () => {
      const hasToken = localStorage.getItem('token');
      const storeUser = store.getters['auth/currentUser'];

      if (hasToken && !storeUser) {
        try {
          console.log('🔄 Loading user from server...');
          await store.dispatch('auth/fetchCurrentUser');
        } catch (error) {
          console.error('Failed to load user:', error);
        }
      }
    };

    onMounted(async () => {
      await loadUserIfNeeded();
      await fetchMissingReport();
    });

    return {
      reportId,
      missingReport,
      selectedFile,
      imagePreview,
      description,
      uploading,
      uploadProgress,
      fileError,
      isDragging,
      currentUser,
      isAuthenticated,
      isOwner,
      handleFileSelect,
      handleFileDrop,
      resetImage,
      uploadImage
    };
  }
}
</script>

<style scoped>
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.disabled\:opacity-50:disabled {
  opacity: 0.5;
}

.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}
</style>