<template>
    <div class="rounded-lg overflow-hidden shadow-md hover:shadow-xl border transition-all duration-300 h-full flex flex-col"
        :class="[
            {
                'bg-white border-gray-100': !profile.match_status,
                'bg-yellow-50 border-yellow-200': profile.match_status === 'pending',
                'bg-green-50 border-green-200': profile.match_status === 'accepted',
                'bg-red-50 border-red-200': profile.match_status === 'rejected'
            }
        ]">
        <router-link :to="`/profile/${profile.id}`" class="flex-grow flex flex-col">
            <!-- Match status banner -->
            <div v-if="profile.match_status" class="py-1.5 px-3 text-center text-sm font-medium" :class="{
                'bg-yellow-200 text-yellow-800': profile.match_status === 'pending',
                'bg-green-200 text-green-800': profile.match_status === 'accepted',
                'bg-red-200 text-red-800': profile.match_status === 'rejected'
            }">
                <div class="flex items-center justify-center">
                    <i :class="[
                        'mr-1.5',
                        { 'fas fa-clock': profile.match_status === 'pending' },
                        { 'fas fa-check-circle': profile.match_status === 'accepted' },
                        { 'fas fa-times-circle': profile.match_status === 'rejected' }
                    ]"></i>
                    {{ getMatchStatusText(profile.match_status) }}
                </div>
            </div>

            <!-- Header with status badge -->
            <div class="relative">
                <!-- Profile image -->
                <div class="h-48 bg-gray-50 overflow-hidden">
                    <img v-if="profile.images" :src="profile.images" :alt="profile.title"
                        class="w-full h-full object-contain bg-gray-100" @error="$emit('image-error', $event)" />
                    <div v-else class="w-full h-full flex flex-col items-center justify-center">
                        <i class="fas fa-user-circle text-4xl text-gray-300 mb-2"></i>
                        <span class="text-sm text-gray-400">Chưa có hình ảnh</span>
                    </div>
                </div>

                <!-- Status badge -->
                <div class="absolute top-3 right-3">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="{
                        'bg-green-100 text-green-800 border border-green-200': profile.status === 'active',
                        'bg-blue-100 text-blue-800 border border-blue-200': profile.status === 'found',
                        'bg-gray-100 text-gray-800 border border-gray-200': profile.status === 'closed',
                    }">
                        <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="{
                            'bg-green-500': profile.status === 'active',
                            'bg-blue-500': profile.status === 'found',
                            'bg-gray-500': profile.status === 'closed',
                        }"></span>
                        {{ getStatusText(profile.status) }}
                    </span>
                </div>

                <!-- Year info badges -->
                <div class="absolute top-3 left-3 flex flex-col space-y-2">
                    <span v-if="profile.born_year"
                        class="bg-blue-400 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                        <i class="fas fa-birthday-cake mr-1"></i> {{ profile.born_year }}
                    </span>
                    <span v-if="profile.losing_year"
                        class="bg-indigo-600/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                        <i class="fas fa-calendar-day mr-1"></i> {{ profile.losing_year }}
                    </span>
                </div>
            </div>

            <!-- Content -->
            <div class="p-4 flex-grow flex flex-col">
                <h3 class="font-semibold text-gray-800 mb-2 text-lg line-clamp-2 leading-tight">
                    {{ profile.title }}
                </h3>

                <div class="flex items-center text-sm text-gray-600 mb-3">
                    <i class="fas fa-user mr-2 text-blue-500"></i>
                    <span class="font-medium">{{ profile.full_name || 'Không rõ tên' }}</span>
                </div>

                <!-- Parent info if available -->
                <div v-if="profile.name_of_father || profile.name_of_mother" class="mb-3 text-xs text-gray-500">
                    <div v-if="profile.name_of_father" class="flex items-center mb-1">
                        <i class="fas fa-male mr-1 w-4 text-center"></i>
                        <span>Cha: {{ profile.name_of_father }}</span>
                    </div>
                    <div v-if="profile.name_of_mother" class="flex items-center">
                        <i class="fas fa-female mr-1 w-4 text-center"></i>
                        <span>Mẹ: {{ profile.name_of_mother }}</span>
                    </div>
                </div>

                <p class="text-sm text-gray-600 line-clamp-3 mb-3 flex-grow">
                    {{ profile.description }}
                </p>

                <div
                    class="flex justify-between items-center text-xs text-gray-400 mt-auto pt-2 border-t border-gray-100">
                    <span><i class="far fa-id-card mr-1"></i>{{ profile.id }}</span>
                    <span><i class="far fa-clock mr-1"></i>{{ formatDate(profile.created_at) }}</span>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script>
export default {
    name: 'SuggestedProfileCard',
    props: {
        profile: {
            type: Object,
            required: true
        }
    },
    methods: {
        formatDate(dateString) {
            if (!dateString) return 'N/A';

            const date = new Date(dateString);
            return new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).format(date);
        },
        getStatusText(status) {
            const statusMap = {
                'active': 'Đang tìm kiếm',
                'found': 'Đã tìm thấy',
                'closed': 'Đã đóng'
            };
            return statusMap[status] || 'Không xác định';
        },
        getMatchStatusText(matchStatus) {
            const matchStatusMap = {
                'pending': 'Đang chờ xác nhận',
                'accepted': 'Xác nhận khớp',
                'rejected': 'Không trùng khớp'
            };
            return matchStatusMap[matchStatus] || 'Không xác định';
        }
    }
};
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>