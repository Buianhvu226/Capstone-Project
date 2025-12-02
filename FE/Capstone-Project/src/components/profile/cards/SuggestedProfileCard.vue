<template>
    <router-link
        :to="`/profile/${profile.id}`"
        class="group h-full flex flex-col rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-lg transition">
        <div class="relative h-36 bg-slate-100 overflow-hidden">
            <img v-if="profile.images" :src="profile.images" :alt="profile.title"
                class="w-full h-full object-cover transition scale-100 group-hover:scale-105"
                @error="$emit('image-error', $event)" />
            <div v-else class="w-full h-full flex flex-col items-center justify-center text-slate-300">
                <i class="fas fa-user-circle text-4xl mb-1"></i>
                <span class="text-xs">Chưa có ảnh</span>
            </div>
            <div class="absolute top-2 left-2 text-[9px] uppercase font-semibold text-slate-400">
                Gợi ý từ cộng đồng
            </div>
            <div class="absolute top-2 right-2">
                <span class="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium"
                    :class="statusChipClass">
                    <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass"></span>
                    {{ getStatusText(profile.status) }}
                </span>
            </div>
        </div>
        <div class="flex flex-col gap-3 p-3 flex-1">
            <div>
                <p class="text-[11px] uppercase tracking-wider text-slate-400 mb-1">{{ profile.full_name || 'Không rõ tên' }}
                </p>
                <h3 class="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">{{ profile.title }}</h3>
            </div>
            <div class="flex flex-wrap gap-2 text-[11px] text-slate-500">
                <span v-if="profile.born_year" class="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full">
                    <i class="fas fa-birthday-cake text-slate-400"></i>{{ profile.born_year }}
                </span>
                <span v-if="profile.losing_year"
                    class="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full">
                    <i class="fas fa-calendar-day text-slate-400"></i>{{ profile.losing_year }}
                </span>
                <span class="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full">
                    <i class="far fa-clock text-slate-400"></i>{{ formatDate(profile.created_at) }}
                </span>
            </div>
            <p class="text-[13px] text-slate-600 line-clamp-2 flex-1">
                {{ profile.description || 'Mô tả đang được cập nhật...' }}
            </p>
            <span
                class="inline-flex items-center justify-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 text-blue-500 font-semibold text-xs py-1.5 px-2.5 transition group-hover:bg-blue-500 group-hover:text-white">
                <i class="fas fa-arrow-right text-[11px]"></i>
                Xem hồ sơ
            </span>
        </div>
    </router-link>
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
    computed: {
        statusChipClass() {
            const base = 'border';
            switch (this.profile.status) {
                case 'active':
                    return `${base} border-green-200 text-green-700 bg-green-50`;
                case 'found':
                    return `${base} border-blue-200 text-blue-600 bg-blue-50`;
                case 'closed':
                    return `${base} border-slate-200 text-slate-500 bg-slate-50`;
                default:
                    return `${base} border-slate-200 text-slate-500 bg-slate-50`;
            }
        },
        statusDotClass() {
            switch (this.profile.status) {
                case 'active':
                    return 'bg-green-500';
                case 'found':
                    return 'bg-blue-500';
                case 'closed':
                    return 'bg-slate-400';
                default:
                    return 'bg-slate-400';
            }
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