<template>
    <div class="profile-image-upload">
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
                        <label for="image-upload" class="file-input-label">
                            <span v-if="selectedFile" class="file-selected">
                                <i class="fas fa-check-circle text-green-500"></i>
                                <span class="file-name">{{ selectedFile.name }}</span>
                            </span>
                            <span v-else class="file-placeholder">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <span>Nhấn để chọn ảnh hoặc kéo thả vào đây</span>
                                <small>Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)</small>
                            </span>
                        </label>
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
        },
        initialProfile: {
            type: Object,
            default: null
        }
    },
    emits: ['upload-success'],
    setup(props, { emit }) {
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

        // Lấy URL ảnh cũ từ initialProfile nếu có
        if (props.initialProfile) {
            oldImageUrl.value = props.initialProfile.image_url || props.initialProfile.images || null;
        }

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

                // Emit event để parent component biết upload thành công
                emit('upload-success', {
                    imageUrl: publicUrl,
                    message: result.message
                })

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
    width: 100%;
}

.form-group {
    margin-bottom: 1.25rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    font-size: 0.875rem;
    color: #334155;
}

.file-input-container {
    position: relative;
    overflow: hidden;
    display: inline-block;
    width: 100%;
    border: 2px dashed #cbd5e1;
    border-radius: 12px;
    background: #f8fafc;
    transition: all 0.2s ease;
}

.file-input-container:hover {
    border-color: #60a5fa;
    background: #eff6ff;
}

.file-input {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.file-input-label {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    text-align: center;
    color: #64748b;
    font-size: 0.875rem;
    min-height: 120px;
    cursor: pointer;
}

.file-input-label .file-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
}

.file-input-label .file-placeholder i {
    font-size: 2.5rem;
    color: #94a3b8;
}

.file-input-label .file-placeholder small {
    color: #94a3b8;
    font-size: 0.75rem;
}

.file-input-label .file-selected {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #10b981;
    font-weight: 600;
}

.file-input-label .file-selected .file-name {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.form-control {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    resize: vertical;
    font-size: 0.875rem;
    transition: border-color 0.2s ease;
}

.form-control:focus {
    outline: none;
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

.button-container {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
    justify-content: flex-end;
}

.btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.875rem;
    border: none;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-primary {
    background: #60a5fa;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background: #3b82f6;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-secondary {
    background: #e2e8f0;
    color: #475569;
}

.btn-secondary:hover {
    background: #cbd5e1;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.loading-container {
    text-align: center;
    padding: 2rem 0;
}

.progress-bar-container {
    height: 8px;
    background: #e2e8f0;
    border-radius: 999px;
    margin: 1.5rem 0;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #60a5fa, #3b82f6);
    transition: width 0.3s ease;
    border-radius: 999px;
}

.progress-text {
    color: #64748b;
    font-size: 0.875rem;
    margin-top: 0.75rem;
}

.success-container {
    text-align: center;
    padding: 1.5rem 0;
}

.preview-image {
    max-width: 100%;
    max-height: 300px;
    margin: 0 auto 1.5rem;
    display: block;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.success-message {
    color: #10b981;
    font-size: 1rem;
    font-weight: 600;
    margin: 1rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.success-message::before {
    content: '✓';
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    background: #d1fae5;
    border-radius: 50%;
    font-weight: bold;
}

.button-group {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 1.5rem;
}

.error-message {
    color: #ef4444;
    font-size: 0.8125rem;
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.error-message::before {
    content: '⚠';
    font-size: 1rem;
}

.global-error {
    margin-top: 1.5rem;
    padding: 1rem;
    background-color: #fef2f2;
    color: #991b1b;
    border-radius: 8px;
    border: 1px solid #fecaca;
    font-size: 0.875rem;
}

@media (max-width: 640px) {
    .button-container,
    .button-group {
        flex-direction: column;
    }

    .btn {
        width: 100%;
        justify-content: center;
    }
}
</style>