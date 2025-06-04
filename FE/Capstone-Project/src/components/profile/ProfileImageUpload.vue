<template>
    <div class="profile-image-upload">
        <div class="card">
            <div v-if="loading" class="loading-container">
                <div class="progress-bar-container">
                    <div class="progress-bar" :style="{ width: `${uploadProgress}%` }"></div>
                </div>
                <div class="progress-text">Đang tải lên... {{ uploadProgress }}%</div>
            </div>

            <div v-else-if="imageUrl" class="success-container">
                <img :src="imageUrl" alt="Ảnh hồ sơ" class="preview-image" />
                <p class="success-message">{{ successMessage }}</p>
                <div class="button-group">
                    <button @click="resetForm" class="btn btn-secondary">Tải ảnh khác</button>
                    <button @click="goToProfile" class="btn btn-primary">Xem hồ sơ</button>
                </div>
            </div>

            <div v-else class="upload-form">
                <div class="form-group">
                    <label for="image-upload">Chọn ảnh từ máy tính:</label>
                    <div class="file-input-container">
                        <input type="file" id="image-upload" @change="handleFileSelect" accept="image/*"
                            class="file-input" />
                        <div class="file-input-label">
                            <span v-if="selectedFile">{{ selectedFile.name }}</span>
                            <span v-else>Chọn file...</span>
                        </div>
                    </div>
                    <div v-if="fileError" class="error-message">{{ fileError }}</div>
                </div>

                <div class="form-group">
                    <label for="description">Mô tả hình ảnh (tùy chọn):</label>
                    <textarea id="description" v-model="description" placeholder="Nhập mô tả cho hình ảnh..."
                        class="form-control" rows="3"></textarea>
                </div>

                <div class="button-container">
                    <button @click="uploadImage" :disabled="!selectedFile || loading" class="btn btn-primary">
                        Tải lên
                    </button>
                    <button @click="goToProfile" class="btn btn-secondary">
                        Bỏ qua
                    </button>
                </div>
            </div>

            <div v-if="error" class="global-error">{{ error }}</div>
        </div>
    </div>
</template>

<script>
import { supabase } from '@/utils/supabase.js'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import profileImageService from '@/services/profileImageService'

export default {
    name: 'ProfileImageUpload',
    props: {
        profileId: {
            type: [Number, String],
            required: true
        }
    },
    setup(props) {
        const router = useRouter()
        const selectedFile = ref(null)
        const description = ref('')
        const imageUrl = ref(null)
        const loading = ref(false)
        const uploadProgress = ref(0)
        const error = ref(null)
        const fileError = ref(null)
        const successMessage = ref('')

        // Thêm biến để lưu URL ảnh cũ
        const oldImageUrl = ref(null);

        const handleFileSelect = (event) => {
            const file = event.target.files[0]
            fileError.value = null

            // Kiểm tra loại file
            if (file && !file.type.startsWith('image/')) {
                fileError.value = 'Vui lòng chọn tệp hình ảnh'
                return
            }

            // Kiểm tra kích thước file (giới hạn 5MB)
            if (file && file.size > 5 * 1024 * 1024) {
                fileError.value = 'Kích thước ảnh không được vượt quá 5MB'
                return
            }

            selectedFile.value = file
        }

        // Lấy thông tin ảnh hiện tại khi component được mount


        const uploadImage = async () => {
            if (!selectedFile.value) return

            loading.value = true
            error.value = null
            uploadProgress.value = 0

            try {
                // Tạo tên file duy nhất với timestamp
                const timestamp = Date.now();
                const fileExt = selectedFile.value.name.split('.').pop();
                const fileName = `profile_${props.profileId}_${timestamp}.${fileExt}`;
                const filePath = `profile_image/${fileName}`;

                // Upload ảnh mới lên Supabase
                const { data, error: uploadError } = await supabase.storage
                  .from('images')
                  .upload(filePath, selectedFile.value, {
                    cacheControl: '3600',
                    upsert: true,
                    onUploadProgress: progress => {
                      uploadProgress.value = Math.round((progress.loaded / progress.total) * 100);
                    }
                  });

                if (uploadError) throw uploadError;

                // Lấy URL công khai của file
                const { data: { publicUrl }, error: urlError } = supabase.storage
                    .from('images')
                    .getPublicUrl(filePath)

                if (urlError) throw urlError

                // Lưu URL vào database
                const result = await profileImageService.saveImageUrl(
                  props.profileId,
                  publicUrl,
                  description.value
                );

                // Xóa ảnh cũ sau khi đã lưu ảnh mới thành công
                if (oldImageUrl.value) {
                  await profileImageService.deleteOldImage(oldImageUrl.value);
                }

                imageUrl.value = publicUrl

                successMessage.value = result.message

            } catch (err) {
                console.error('Upload error:', err)

                // Xử lý lỗi từ service hoặc lỗi Supabase
                if (err.success === false) {
                    error.value = `Lỗi: ${err.message}`
                } else {
                    error.value = `Lỗi khi tải lên: ${err.message || 'Đã xảy ra lỗi không xác định'}`
                }
            } finally {
                loading.value = false
            }
        }

        const resetForm = () => {
            selectedFile.value = null
            description.value = ''
            imageUrl.value = null
            successMessage.value = ''
            error.value = null
            fileError.value = null
        }

        const goToProfile = () => {
            router.push(`/profile/${props.profileId}`)
        }

        return {
            selectedFile,
            description,
            imageUrl,
            loading,
            uploadProgress,
            error,
            fileError,
            successMessage,
            handleFileSelect,
            uploadImage,
            resetForm,
            goToProfile
        }
    }
}
</script>

<style scoped>
.profile-image-upload {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.title {
    margin-bottom: 20px;
    color: #333;
    text-align: center;
}

.card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 25px;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
}

.file-input-container {
    position: relative;
    overflow: hidden;
    display: inline-block;
    width: 100%;
}

.file-input {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
}

.file-input-label {
    display: block;
    background: #f5f5f5;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.form-control {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
}

.button-container {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.btn {
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    border: none;
    transition: background 0.3s;
}

.btn-primary {
    background: #4e73df;
    color: white;
}

.btn-primary:hover {
    background: #3a64d8;
}

.btn-secondary {
    background: #858796;
    color: white;
}

.btn-secondary:hover {
    background: #717380;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.loading-container {
    text-align: center;
}

.progress-bar-container {
    height: 10px;
    background: #eee;
    border-radius: 5px;
    margin: 20px 0;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: #4e73df;
    transition: width 0.3s;
}

.progress-text {
    margin-bottom: 20px;
}

.success-container {
    text-align: center;
}

.preview-image {
    max-width: 100%;
    max-height: 300px;
    margin: 0 auto 20px;
    display: block;
    border-radius: 4px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.success-message {
    color: #28a745;
    font-size: 18px;
    margin: 20px 0;
}

.button-group {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
}

.error-message {
    color: #dc3545;
    font-size: 14px;
    margin-top: 5px;
}

.global-error {
    margin-top: 20px;
    padding: 10px;
    background-color: #f8d7da;
    color: #721c24;
    border-radius: 4px;
    border: 1px solid #f5c6cb;
}
</style>