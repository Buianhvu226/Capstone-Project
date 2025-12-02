<template>
  <div class="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
    <div class="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/40 px-3 sm:px-4 py-2.5">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <h1 class="text-base sm:text-lg md:text-xl font-semibold text-slate-900 mb-0.5 line-clamp-2">
            {{ missingReport.title }}
          </h1>
          <p class="text-xs text-slate-500">
            Mã báo cáo: <span class="font-mono">{{ missingReport.id }}</span>
          </p>
        </div>
        <div v-if="isOwner || isAdmin" class="flex-shrink-0 flex items-start space-x-2">
          <button
            @click="onDelete"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-100 text-xs font-semibold hover:bg-red-100 hover:border-red-200 transition-colors">
            <i class="fas fa-trash text-[11px]"></i>
            <span>Xóa báo cáo</span>
          </button>
        </div>
      </div>
    </div>
    <div class="p-3 sm:p-4">
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <div class="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs text-slate-600">
            <span
              :class="{
                'bg-green-100 text-green-800': missingReport.status === 'active',
                'bg-blue-100 text-blue-800': missingReport.status === 'found',
                'bg-gray-100 text-gray-800': missingReport.status === 'closed',
              }"
              class="inline-flex items-center px-2.5 py-1 rounded-full font-medium shadow-sm"
            >
              <i
                :class="{
                  'fas fa-search': missingReport.status === 'active',
                  'fas fa-check-circle': missingReport.status === 'found',
                  'fas fa-times-circle': missingReport.status === 'closed',
                }"
                class="mr-1"
              ></i>
              {{
                missingReport.status === 'active'
                  ? 'Đang tìm kiếm'
                  : missingReport.status === 'found'
                    ? 'Đã tìm thấy'
                    : 'Đã đóng'
              }}
            </span>
            <span
              :class="{
                'bg-blue-100 text-blue-800': missingReport.profile_type === 'seeker',
                'bg-green-100 text-green-800': missingReport.profile_type === 'finder',
              }"
              class="inline-flex items-center px-2.5 py-1 rounded-full font-medium shadow-sm"
            >
              <i
                :class="{
                  'fas fa-search': missingReport.profile_type === 'seeker',
                  'fas fa-eye': missingReport.profile_type === 'finder',
                }"
                class="mr-1"
              ></i>
              {{ missingReport.profile_type === 'seeker' ? 'Người đi tìm' : 'Người cung cấp thông tin' }}
            </span>
            <span
              v-if="matchesLength > 0"
              class="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 font-medium">
              <i class="fas fa-brain mr-1 text-[10px]"></i>
              {{ matchesLength }} gợi ý AI
            </span>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mt-3">
        <div class="space-y-3">
          <div v-if="missingReport.name" class="flex items-center">
            <i class="fas fa-user text-gray-400 w-5 mr-3"></i>
            <div>
              <span class="text-xs text-gray-500">Tên:</span>
              <p class="text-sm font-medium text-gray-800">{{ missingReport.name }}</p>
            </div>
          </div>
          <div v-if="missingReport.age" class="flex items-center">
            <i class="fas fa-birthday-cake text-gray-400 w-5 mr-3"></i>
            <div>
              <span class="text-xs text-gray-500">Tuổi:</span>
              <p class="text-sm font-medium text-gray-800">{{ missingReport.age }} tuổi</p>
            </div>
          </div>
          <div class="flex items-center">
            <i class="fas fa-clock text-gray-400 w-5 mr-3"></i>
            <div>
              <span class="text-xs text-gray-500">Đăng:</span>
              <p class="text-sm font-medium text-gray-800">{{ timeAgo }}</p>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <div v-if="formattedMissingDate" class="flex items-center">
            <i class="fas fa-calendar text-gray-400 w-5 mr-3"></i>
            <div>
              <span class="text-xs text-gray-500">
                {{ missingReport.profile_type === 'seeker' ? 'Ngày mất tích:' : 'Ngày gặp:' }}
              </span>
              <p class="text-sm font-medium text-gray-800">{{ formattedMissingDate }}</p>
            </div>
          </div>
          <div v-if="missingReport.location" class="flex items-center">
            <i class="fas fa-map-marker-alt text-gray-400 w-5 mr-3"></i>
            <div>
              <span class="text-xs text-gray-500">
                {{ missingReport.profile_type === 'seeker' ? 'Địa điểm mất tích:' : 'Địa điểm gặp:' }}
              </span>
              <p class="text-sm font-medium text-gray-800">{{ missingReport.location }}</p>
            </div>
          </div>
          <div class="flex items-center">
            <i class="fas fa-user-circle text-gray-400 w-5 mr-3"></i>
            <div>
              <span class="text-xs text-gray-500">Người đăng:</span>
              <p class="text-sm font-medium text-gray-800">{{ missingReport.username || 'Ẩn danh' }}</p>
            </div>
          </div>
        </div>

        <div
          v-if="missingReport.contact_persons_list && missingReport.contact_persons_list.length > 0"
          class="lg:col-span-1 border border-slate-100 rounded-lg px-3 py-2.5 bg-slate-50 h-full flex flex-col"
        >
          <div class="flex items-center text-xs sm:text-sm font-semibold text-gray-800 mb-2">
            <i class="fas fa-address-book text-green-500 mr-2"></i>
            <span>Thông tin liên hệ</span>
          </div>
          <div class="flex-1 overflow-y-auto space-y-2 pr-1">
            <div
              v-for="(contact, index) in missingReport.contact_persons_list"
              :key="index"
              class="flex items-center gap-2 rounded-md bg-white px-2.5 py-1.5 shadow-sm border border-slate-100"
            >
              <i class="fas fa-user-friends text-gray-400 text-sm"></i>
              <div class="min-w-0">
                <p class="text-xs sm:text-sm font-semibold text-gray-800">
                  {{ contact.name }}
                </p>
                <p class="text-[11px] text-gray-600">
                  {{ contact.relationship }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecentlyMissingDetailHeaderCard',
  props: {
    missingReport: {
      type: Object,
      required: true,
    },
    formattedMissingDate: {
      type: String,
      default: null,
    },
    timeAgo: {
      type: String,
      default: '',
    },
    matchesLength: {
      type: Number,
      default: 0,
    },
    isOwner: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    onDelete: {
      type: Function,
      required: true,
    },
  },
};
</script>


