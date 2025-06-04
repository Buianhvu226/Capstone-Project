<template>
    <div class="face-upload">
        <div class="card">
            <div v-if="loading" class="loading-container">
                <div class="progress-bar-container">
                    <div class="progress-bar" :style="{ width: `${uploadProgress}%` }"></div>
                </div>
                <div class="progress-text">Đang tải lên... {{ uploadProgress }}%</div>
            </div>

            <div v-else-if="imageUrl" class="success-container">
                <img :src="imageUrl" alt="Ảnh khuôn mặt" class="preview-image object-cover" />
                <div class="mt-4 space-y-4">
                    <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <i class="fas fa-check-circle text-green-600"></i>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-green-700">{{ successMessage }}</p>
                            </div>
                        </div>
                    </div>
                    <p class="text-gray-600 text-sm">
                        Ảnh khuôn mặt của bạn sẽ được sử dụng để tìm kiếm sự trùng khớp. Hệ thống có thể mất vài phút để
                        xử lý.
                    </p>
                </div>
                <div class="button-group mt-6">
                    <button @click="resetForm" class="btn btn-secondary">
                        <i class="fas fa-upload mr-2"></i> Tải ảnh khác
                    </button>
                    <button @click="goToProfile" class="btn btn-primary">
                        <i class="fas fa-eye mr-2"></i> Xem hồ sơ
                    </button>
                </div>
            </div>

            <div v-else class="upload-form">
                <div class="space-y-4 mb-6">
                    <h3 class="text-lg font-semibold text-gray-800">Tải lên ảnh khuôn mặt</h3>
                    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <i class="fas fa-info-circle text-blue-600"></i>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-blue-700">
                                    Để đạt hiệu quả tốt nhất, vui lòng tải lên ảnh rõ nét, không bị che khuất mặt
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="image-upload" class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-image text-blue-500 mr-1.5"></i> Chọn ảnh từ máy tính:
                    </label>
                    <div class="file-input-container">
                        <input type="file" id="image-upload" @change="handleFileSelect" accept="image/*"
                            class="file-input" />
                        <div class="file-input-label">
                            <span v-if="selectedFile">{{ selectedFile.name }}</span>
                            <span v-else>Chọn ảnh khuôn mặt...</span>
                        </div>
                    </div>
                    <div v-if="fileError" class="error-message mt-2">{{ fileError }}</div>
                </div>

                <div class="form-group mt-4">
                    <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-align-left text-blue-500 mr-1.5"></i> Mô tả ảnh (tùy chọn):
                    </label>
                    <textarea id="description" v-model="description" placeholder="Mô tả ngắn về bức ảnh này..."
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="3"></textarea>
                </div>

                <div class="flex justify-between mt-6">
                    <button @click="goToProfile" class="btn btn-secondary">
                        <i class="fas fa-arrow-left mr-2"></i> Quay lại
                    </button>
                    <button @click="uploadImage" :disabled="!selectedFile || loading" class="btn btn-primary">
                        <i class="fas fa-cloud-upload-alt mr-2"></i> Tải lên
                    </button>
                </div>
            </div>

            <div v-if="error" class="mt-6">
                <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <i class="fas fa-exclamation-circle text-red-600"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-red-700">{{ error }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { supabase } from '@/utils/supabase.js'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useStore } from 'vuex'
import recentlyMissingService from '@/services/recentlyMissingService'

export default {
    name: 'FaceUpload',
    props: {
        profileId: {
            type: [Number, String],
            required: true
        }
    },
    setup(props) {
        const router = useRouter()
        const store = useStore()
        const selectedFile = ref(null)
        const description = ref('')
        const imageUrl = ref(null)
        const loading = ref(false)
        const uploadProgress = ref(0)
        const error = ref(null)
        const fileError = ref(null)
        const successMessage = ref('')

        // Handle file select
        const handleFileSelect = (event) => {
            const file = event.target.files[0]
            fileError.value = null

            // Validate file type
            if (file && !file.type.startsWith('image/')) {
                fileError.value = 'Vui lòng chọn tệp hình ảnh'
                return
            }

            // Validate file size (5MB max)
            if (file && file.size > 5 * 1024 * 1024) {
                fileError.value = 'Kích thước ảnh không được vượt quá 5MB'
                return
            }

            selectedFile.value = file
        }

        // Upload image to Supabase and save URL to backend
        const uploadImage = async () => {
            if (!selectedFile.value) return

            loading.value = true
            error.value = null
            uploadProgress.value = 0

            try {
                // Create filename with profile ID
                const fileExt = selectedFile.value.name.split('.').pop()
                const fileName = `recently_missing_profile_${props.profileId}.${fileExt}`
                const filePath = `recently_missing/${fileName}`

                // Upload image to Supabase
                const { error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(filePath, selectedFile.value, {
                        cacheControl: '3600',
                        upsert: true, // Allow overwrite
                        onUploadProgress: progress => {
                            uploadProgress.value = Math.round((progress.loaded / progress.total) * 80)
                        }
                    })

                if (uploadError) throw uploadError

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('images')
                    .getPublicUrl(filePath)

                if (!publicUrl) throw new Error('Không thể lấy URL công khai của ảnh')

                uploadProgress.value = 90

                // Save URL to backend using recentlyMissingService
                await recentlyMissingService.saveImageUrl(props.profileId, publicUrl, description.value)

                uploadProgress.value = 100
                imageUrl.value = publicUrl
                successMessage.value = 'Tải ảnh lên thành công!'

            } catch (err) {
                console.error('Upload error:', err)
                error.value = err.message || 'Đã xảy ra lỗi khi tải ảnh lên'
            } finally {
                loading.value = false
            }
        }

        // Reset form
        const resetForm = () => {
            selectedFile.value = null
            description.value = ''
            imageUrl.value = null
            error.value = null
            fileError.value = null
        }

        // Navigate back to profile
        const goToProfile = () => {
            router.push(`/recently-missing/${props.profileId}`)
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
.card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 25px;
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

.btn {
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    border: none;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-primary {
    background: #4e73df;
    color: white;
}

.btn-primary:hover {
    background: #3a64d8;
}

.btn-secondary {
    background: #f8f9fc;
    border: 1px solid #e3e6f0;
    color: #6e707e;
}

.btn-secondary:hover {
    background: #eaecf4;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.progress-bar-container {
    height: 8px;
    background: #eee;
    border-radius: 4px;
    margin: 20px 0;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #4e73df, #2e59d9);
    transition: width 0.3s;
}

.progress-text {
    text-align: center;
    margin-bottom: 20px;
    color: #4e73df;
    font-weight: 500;
}

.preview-image {
    max-width: 100%;
    max-height: 300px;
    margin: 0 auto;
    display: block;
    border-radius: 4px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.error-message {
    color: #e74a3b;
}

.button-group {
    display: flex;
    gap: 12px;
}
</style>