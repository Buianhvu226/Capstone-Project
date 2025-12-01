<template>
    <div class="relative overflow-hidden rounded-2xl bg-white border border-slate-100">
        <div class="relative px-3 sm:px-5 py-3 space-y-2.5">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div class="space-y-0 flex-1 min-w-[280px]">
                    <h1 class="text-[18px] sm:text-[22px] font-semibold leading-snug text-slate-900 tracking-tight">
                        {{ profile.title }}
                    </h1>
                    <div class="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 whitespace-nowrap">
                        <span
                            class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                            :class="statusPillClass">
                            <span class="relative flex h-1.5 w-1.5">
                                <span class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                                    :class="statusDotClass"></span>
                                <span class="relative inline-flex h-1.5 w-1.5 rounded-full"
                                    :class="statusDotClass"></span>
                            </span>
                            {{ getStatusText(profile.status) }}
                        </span>
                        <span class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5">
                            <i class="fas fa-user-circle text-[11px] text-blue-400"></i>
                            <span class="font-semibold text-slate-700">{{ profile.username }}</span>
                        </span>
                        <span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5">
                            <i class="fas fa-hashtag text-[9px] text-slate-400"></i>ID: {{ profile.id }}
                        </span>
                        <span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5">
                            <i class="far fa-clock text-[9px] text-slate-400"></i>{{ formatDate(profile.created_at) }}
                        </span>
                        <span v-if="profile.view_count"
                            class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5">
                            <i class="far fa-eye text-[9px] text-slate-400"></i>{{ profile.view_count }} lượt xem
                        </span>
                    </div>
                </div>

                <div
                    class="flex flex-wrap gap-2 items-center justify-start text-[13px] lg:justify-end lg:ml-6 shrink-0">
                    <template v-if="isOwner">
                        <button @click="$emit('change-status')" :disabled="isLoading"
                            class="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-white px-3 py-1.5 font-semibold text-blue-500 transition hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50">
                            <i class="fas fa-exchange-alt text-[11px]"></i>
                            Trạng thái
                        </button>
                        <router-link :to="`/profile/edit/${profile.id}`"
                            class="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600 transition hover:border-blue-200 hover:text-blue-500">
                            <i class="fas fa-edit text-[11px]"></i>
                            Chỉnh sửa
                        </router-link>
                        <button @click="$emit('open-upload-modal')"
                            class="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600 transition hover:border-blue-200 hover:text-blue-500">
                            <i class="fas fa-camera text-[11px]"></i>
                            {{ profile.images || profile.image_url ? 'Cập nhật ảnh' : 'Thêm ảnh' }}
                        </button>
                    </template>
                    <button v-else @click="$emit('contact')"
                        class="inline-flex items-center gap-1.5 rounded-full bg-blue-500 px-4 py-1.5 font-semibold text-white transition hover:bg-blue-600 justify-center min-w-[150px] max-w-[190px]">
                        <i class="fas fa-envelope text-xs"></i>
                        Liên hệ
                    </button>

                    <button v-if="!isAdmin" @click="$emit('share')"
                        class="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600 transition hover:border-blue-200 hover:text-blue-500 min-w-[120px] max-w-[160px] justify-center">
                        <i class="fas fa-share-alt text-xs"></i>
                        Chia sẻ
                    </button>

                    <button v-if="isAdmin || isOwner" @click="$emit('delete')"
                        class="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-3 py-1.5 font-medium text-red-500 transition hover:bg-red-50">
                        <i class="fas fa-trash-alt text-xs"></i>
                        Xóa
                    </button>

                    <div v-if="isLoading"
                        class="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-semibold text-blue-500">
                        <i class="fas fa-circle-notch fa-spin text-[11px]"></i>
                        Đang cập nhật...
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProfileHeader',
    props: {
        profile: {
            type: Object,
            required: true
        },
        isOwner: {
            type: Boolean,
            default: false
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        isLoading: {
            type: Boolean,
            default: false
        }
    },
    emits: ['change-status', 'contact', 'share', 'delete', 'open-upload-modal'],
    computed: {
        statusPillClass() {
            switch (this.profile?.status) {
                case 'active':
                    return 'bg-emerald-50 text-emerald-600';
                case 'found':
                    return 'bg-blue-50 text-blue-600';
                case 'closed':
                    return 'bg-slate-100 text-slate-600';
                default:
                    return 'bg-slate-100 text-slate-600';
            }
        },
        statusDotClass() {
            switch (this.profile?.status) {
                case 'active':
                    return 'bg-emerald-400';
                case 'found':
                    return 'bg-blue-400';
                case 'closed':
                    return 'bg-slate-400';
                default:
                    return 'bg-slate-400';
            }
        }
    },
    methods: {
        getStatusText(status) {
            const statusMap = {
                active: 'Đang tìm kiếm',
                found: 'Đã tìm thấy',
                closed: 'Đã đóng'
            };
            return statusMap[status] || 'Không xác định';
        },
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';
            return date.toLocaleDateString('vi-VN');
        }
    }
};
</script>

<style scoped>
@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes ping {

    75%,
    100% {
        transform: scale(2);
        opacity: 0;
    }
}

.animate-ping {
    animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
