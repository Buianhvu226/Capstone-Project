<template>
    <div class="space-y-6">
        <div v-for="profile in profiles" :key="profile.id" :class="{
            'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200': isOwnProfile(profile),
            'bg-white border border-gray-200': !isOwnProfile(profile)
        }" class="rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">

            <!-- Own Profile Badge -->
            <div v-if="isOwnProfile(profile)" class="bg-blue-400 text-white px-4 py-2 text-sm font-medium">
                <i class="fa fa-user-check mr-2"></i> Báo cáo của bạn
            </div>

            <!-- Main Content -->
            <div class="p-6">
                <div class="flex flex-col lg:flex-row gap-6">
                    <!-- Profile Image -->
                    <div class="flex-shrink-0">
                        <div class="relative">
                            <!-- Ảnh đại diện -->
                            <div
                                class="w-64 h-64 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                <img v-if="profile.image_url" :src="profile.image_url + '?t=' + Date.now()"
                                    :alt="profile.title" class="w-full h-full object-contain"
                                    @error="handleImageError" />
                                <div v-else class="text-center">
                                    <i class="fas fa-user text-gray-300 text-5xl mb-2"></i>
                                    <p class="text-gray-400 text-sm">Chưa có ảnh</p>
                                </div>
                            </div>

                            <!-- Upload button for own profiles -->
                            <div v-if="isOwnProfile(profile) && !profile.image_url"
                                class="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <router-link :to="`/recently-missing/${profile.id}/upload-image`"
                                    class="bg-white text-gray-800 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">
                                    <i class="fas fa-camera mr-1"></i> Thêm ảnh
                                </router-link>
                            </div>

                            <!-- Update image button for own profiles with image -->
                            <div v-if="isOwnProfile(profile) && profile.image_url" class="absolute top-2 right-2">
                                <router-link :to="`/recently-missing/${profile.id}/upload-image`"
                                    class="bg-black bg-opacity-70 text-white p-2 rounded-full text-sm hover:bg-opacity-90 transition-all">
                                    <i class="fas fa-camera"></i>
                                </router-link>
                            </div>
                        </div>
                    </div>

                    <!-- Profile Information -->
                    <div class="flex-1">
                        <!-- Header -->
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex-1">
                                <div class="flex items-center gap-3 mb-2 flex-wrap">
                                    <!-- Profile Type Badge -->
                                    <span :class="{
                                        'bg-blue-400 text-white': profile.profile_type === 'seeker',
                                        'bg-green-600 text-white': profile.profile_type === 'finder'
                                    }" class="px-3 py-1 rounded-full text-sm font-medium">
                                        <i :class="{
                                            'fas fa-search': profile.profile_type === 'seeker',
                                            'fas fa-eye': profile.profile_type === 'finder'
                                        }" class="mr-1"></i>
                                        {{ profile.profile_type === 'seeker' ? 'Người đi tìm' : 'Người cung cấp thông tin' }}
                                    </span>

                                    <!-- Status Badge -->
                                    <span :class="{
                                        'bg-green-100 text-green-800': profile.status === 'active',
                                        'bg-blue-100 text-blue-800': profile.status === 'found',
                                        'bg-gray-100 text-gray-800': profile.status === 'closed'
                                    }" class="px-2 py-1 rounded-full text-xs font-medium">
                                        {{ getStatusText(profile.status) }}
                                    </span>
                                </div>

                                <router-link :to="`/recently-missing/${profile.id}`" class="block">
                                    <h3
                                        class="text-xl font-bold text-gray-800 hover:text-blue-400 transition-colors mb-1">
                                        {{ profile.title }}
                                    </h3>
                                </router-link>

                                <!-- Posted by -->
                                <div class="flex items-center text-sm text-gray-600 mb-2 flex-wrap gap-2">
                                    <div class="flex items-center">
                                        <i class="fas fa-user-circle mr-2"></i>
                                        <span>Đăng bởi: <strong>{{ profile.username }}</strong></span>
                                    </div>
                                    <span class="hidden sm:inline">•</span>
                                    <span>{{ formatTimeAgo(profile.created_at) }}</span>
                                    <!-- Own profile indicator -->
                                    <div v-if="isOwnProfile(profile)" class="flex items-center text-blue-400">
                                        <span class="hidden sm:inline">•</span>
                                        <i class="fas fa-user-check mr-1"></i>
                                        <span class="text-xs">Của bạn</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="flex items-center gap-2 ml-4">
                                <router-link :to="`/recently-missing/${profile.id}`"
                                    class="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    <i class="fas fa-eye mr-1"></i>
                                    <span class="hidden sm:inline">Chi tiết</span>
                                </router-link>
                            </div>
                        </div>

                        <!-- Profile Details -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <!-- Tên người thất lạc -->
                            <div v-if="profile.name" class="flex items-center">
                                <div
                                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                    <i class="fas fa-user text-blue-400"></i>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-sm text-gray-500">Tên người thất lạc</p>
                                    <p class="font-semibold text-gray-800 truncate">{{ profile.name }}</p>
                                </div>
                            </div>

                            <!-- Tuổi -->
                            <div v-if="profile.age" class="flex items-center">
                                <div
                                    class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                    <i class="fa-solid fa-table"></i>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500">Tuổi</p>
                                    <p class="font-semibold text-gray-800">{{ profile.age }} tuổi</p>
                                </div>
                            </div>

                            <!-- Địa điểm -->
                            <div v-if="profile.location" class="flex items-center">
                                <div
                                    class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                    <i class="fas fa-map-marker-alt text-red-600"></i>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-sm text-gray-500">Địa điểm</p>
                                    <p class="font-semibold text-gray-800 truncate">{{ profile.location }}</p>
                                </div>
                            </div>

                            <!-- Ngày mất tích/gặp -->
                            <div v-if="profile.missing_date" class="flex items-center">
                                <div
                                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                    <i class="fas fa-calendar-alt text-blue-400"></i>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500">
                                        {{ profile.profile_type === 'seeker' ? 'Ngày mất tích' : 'Ngày gặp' }}
                                    </p>
                                    <p class="font-semibold text-gray-800">{{ formatDate(profile.missing_date) }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Description -->
                        <div v-if="profile.description" class="bg-gray-50 rounded-lg p-4 mb-4">
                            <h4 class="font-medium text-gray-800 mb-2">
                                <i class="fas fa-align-left mr-2"></i>Mô tả chi tiết
                            </h4>
                            <p class="text-gray-700 leading-relaxed line-clamp-3">
                                {{ profile.description }}
                            </p>
                        </div>

                        <!-- Footer Actions -->
                        <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                            <div class="flex items-center text-sm text-gray-500">
                                <i class="fas fa-clock mr-1"></i>
                                <span class="hidden sm:inline">Cập nhật: </span>{{ formatDate(profile.updated_at ||
                                profile.created_at) }}
                            </div>

                            <div class="flex items-center gap-3">
                                <!-- Contact button (if not own profile and user is logged in) -->
                                <button v-if="!isOwnProfile(profile) && currentUser" @click="openContactModal(profile)"
                                    class="bg-blue-400 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    <i class="fas fa-envelope mr-1"></i>
                                    <span class="hidden sm:inline">Liên hệ</span>
                                </button>

                                <!-- Login prompt for non-logged in users -->
                                <router-link v-else-if="!isOwnProfile(profile) && !currentUser" to="/auth"
                                    class="bg-gray-600 text-white hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    <i class="fas fa-sign-in-alt mr-1"></i>
                                    <span class="hidden sm:inline">Đăng nhập để liên hệ</span>
                                </router-link>

                                <!-- Share button -->
                                <button @click="shareProfile(profile)"
                                    class="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    <i class="fas fa-share-alt mr-1"></i>
                                    <span class="hidden sm:inline">Chia sẻ</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, watch } from 'vue';
import { format, formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale';
import noImage from '@/assets/images/no_image.png';

export default {
    name: 'RecentlyMissingList',

    props: {
        profiles: {
            type: Array,
            required: true
        },
        currentUser: {
            type: Object,
            default: null
        }
    },

    emits: ['contact-profile', 'share-profile'],

    setup(props, { emit }) {
        // Debug: Log currentUser để kiểm tra
        watch(() => props.currentUser, (newValue) => {
            console.log('🔍 RecentlyMissingList currentUser changed:', newValue);
        }, { immediate: true });

        // Check if profile belongs to current user - sửa logic dựa trên API response
        const isOwnProfile = (profile) => {
            if (!profile || !props.currentUser) {
                console.log('❌ No profile or currentUser:', {
                    hasProfile: !!profile,
                    hasCurrentUser: !!props.currentUser
                });
                return false;
            }

            // API trả về username trong profile, so sánh với currentUser
            const isOwn = (
                profile.username === props.currentUser.username ||
                profile.username === props.currentUser.email ||
                // Fallback: nếu currentUser có email làm username
                (props.currentUser.email && profile.username === props.currentUser.email)
            );

            console.log('👤 Checking ownership:', {
                profile_id: profile.id,
                profile_username: profile.username,
                currentUser_username: props.currentUser.username,
                currentUser_email: props.currentUser.email,
                isOwn: isOwn
            });

            return isOwn;
        };

        // Format date to DD/MM/YYYY
        const formatDate = (dateString) => {
            if (!dateString) return '';
            try {
                return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
            } catch (error) {
                return dateString;
            }
        };

        // Format relative time (e.g., "2 ngày trước")
        const formatTimeAgo = (dateString) => {
            if (!dateString) return '';
            try {
                return formatDistance(new Date(dateString), new Date(), {
                    addSuffix: true,
                    locale: vi
                });
            } catch (error) {
                return formatDate(dateString);
            }
        };

        // Get status text
        const getStatusText = (status) => {
            switch (status) {
                case 'active': return 'Đang tìm kiếm';
                case 'found': return 'Đã tìm thấy';
                case 'closed': return 'Đã đóng';
                default: return status;
            }
        };

        // Handle image error
        const handleImageError = (event) => {
            event.target.src = noImage;
        };

        // Open contact modal
        const openContactModal = (profile) => {
            emit('contact-profile', profile);
        };

        // Share profile
        const shareProfile = (profile) => {
            const url = `${window.location.origin}/recently-missing/${profile.id}`;

            if (navigator.share) {
                navigator.share({
                    title: profile.title,
                    text: `${profile.title} - ${profile.name || 'Thông tin tìm kiếm'}`,
                    url: url
                }).catch(err => {
                    console.log('Error sharing:', err);
                    copyToClipboard(url);
                });
            } else {
                copyToClipboard(url);
            }

            emit('share-profile', profile);
        };

        // Copy to clipboard fallback
        const copyToClipboard = (text) => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    alert('Đã sao chép liên kết vào clipboard!');
                });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    alert('Đã sao chép liên kết vào clipboard!');
                } catch (err) {
                    console.error('Unable to copy to clipboard:', err);
                    alert('Không thể sao chép. Vui lòng copy thủ công: ' + text);
                }
                document.body.removeChild(textArea);
            }
        };

        return {
            isOwnProfile,
            formatDate,
            formatTimeAgo,
            getStatusText,
            handleImageError,
            openContactModal,
            shareProfile
        };
    }
}
</script>

<style scoped>
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.min-w-0 {
    min-width: 0;
}

.flex-shrink-0 {
    flex-shrink: 0;
}

/* Responsive design adjustments */
@media (max-width: 640px) {
    .hidden.sm\:inline {
        display: none;
    }

    .gap-2 {
        gap: 0.25rem;
    }

    .px-3 {
        padding-left: 0.5rem;
        padding-right: 0.5rem;
    }
}

/* Hover effects */
.hover\:opacity-100:hover {
    opacity: 1;
}

.hover\:bg-opacity-90:hover {
    background-color: rgba(0, 0, 0, 0.9);
}

/* Transitions */
.transition-opacity {
    transition-property: opacity;
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-all {
    transition-property: all;
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-colors {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>