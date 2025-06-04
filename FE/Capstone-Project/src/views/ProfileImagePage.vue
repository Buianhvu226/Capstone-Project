<template>
    <div class="profile-image-page mt-15">
        <div class="container">
            <div class="header">
                <h1>Thêm ảnh cho hồ sơ</h1>
                <p>Hình ảnh giúp tăng khả năng nhận diện và kết nối</p>
            </div>

            <div v-if="loading" class="loading-section">
                <div class="spinner"></div>
                <p>Đang tải thông tin...</p>
            </div>

            <div v-else-if="error" class="card">
                <div class="error-message">{{ error }}</div>
                <button @click="$router.push('/profiles')" class="btn btn-primary mt-4">
                    Quay về danh sách hồ sơ
                </button>
            </div>

            <div v-else class="card">
                <ProfileImageUpload :profileId="profileId" :initialProfile="profile"
                    @upload-success="handleUploadSuccess" />
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import ProfileImageUpload from '@/components/profile/ProfileImageUpload.vue'

export default {
    components: {
        ProfileImageUpload
    },
    setup() {
        const route = useRoute()
        const router = useRouter()
        const profileId = ref(route.params.id)
        const profile = ref(null)
        const loading = ref(true)
        const error = ref(null)

        const getStatusClass = (status) => {
            const statusClassMap = {
                'active': 'status-active',
                'found': 'status-found',
                'closed': 'status-closed'
            }
            return statusClassMap[status] || ''
        }

        onMounted(async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/profiles/${profileId.value}/`,
                    {
                        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                    }
                )
                profile.value = response.data
            } catch (err) {
                console.error('Error fetching profile:', err)
                error.value = 'Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.'
            } finally {
                loading.value = false
            }
        })

        const handleUploadSuccess = ({ imageUrl, message }) => {
            // Cập nhật URL ảnh trong profile object
            if (profile.value) {
                profile.value.image_url = imageUrl;
            }

            // Hiển thị thông báo thành công (tùy chọn)
            console.log('Upload thành công:', message);

            // Chuyển hướng người dùng về trang chi tiết hồ sơ
            setTimeout(() => {
                router.push({
                    path: `/profile/${profileId.value}`,
                    query: { upload: 'success' }
                });
            }, 1500);
        }

        return {
            profileId,
            profile,
            loading,
            error,
            handleUploadSuccess,
            getStatusClass
        }
    }
}
</script>

<style scoped>
.profile-image-page {
    min-height: calc(100vh - 80px);
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%);
    padding: 3rem 1rem;
    display: flex;
    align-items: center;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
}

.header {
    text-align: center;
    margin-bottom: 2.5rem;
    animation: fadeInDown 0.5s ease-out;
}

.header h1 {
    font-size: 2.25rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 0.75rem;
    line-height: 1.2;
}

.header p {
    font-size: 1.125rem;
    color: #4a5568;
    max-width: 600px;
    margin: 0 auto;
}

.card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 2rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
}

.loading-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 0;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    animation: fadeIn 0.5s ease-out;
}

.spinner {
    border: 5px solid #e2e8f0;
    border-top: 5px solid #3b82f6;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    animation: spin 1s linear infinite;
    margin-bottom: 1.5rem;
}

.loading-section p {
    font-size: 1.125rem;
    color: #4a5568;
}

.error-section {
    text-align: center;
    padding: 2.5rem;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    animation: fadeIn 0.5s ease-out;
}

.error-icon {
    font-size: 2.5rem;
    color: #ef4444;
    margin-bottom: 1rem;
}

.error-section p {
    font-size: 1.125rem;
    color: #ef4444;
    margin-bottom: 1.5rem;
}

.btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    border: none;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-primary {
    background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
    color: #ffffff;
}

.btn-primary:hover {
    background: linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-primary:active {
    transform: translateY(0);
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 640px) {
    .profile-image-page {
        padding: 2rem 0.5rem;
    }

    .header h1 {
        font-size: 1.75rem;
    }

    .header p {
        font-size: 1rem;
    }

    .card {
        padding: 1.5rem;
    }

    .loading-section,
    .error-section {
        padding: 2rem;
    }
}

@media (max-width: 768px) {
    .container {
        padding: 0 1rem;
    }
}

.profile-summary {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eaeaea;
}

.profile-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.profile-info h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
}

.status-badge {
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 500;
}

.status-active {
    background-color: #d1e7dd;
    color: #0f5132;
}

.status-found {
    background-color: #cfe2ff;
    color: #084298;
}

.status-closed {
    background-color: #e2e3e5;
    color: #41464b;
}

.current-image {
    margin-top: 15px;
}

.current-image h4 {
    margin-bottom: 10px;
    font-size: 0.9rem;
    color: #555;
}

.preview-image {
    max-height: 150px;
    border-radius: 6px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>