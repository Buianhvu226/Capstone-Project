<template>
  <section v-if="profiles && profiles.length" class="mt-10 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
    <div class="flex items-center gap-2 mb-6">
      <span class="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
        <i class="fas fa-link text-lg"></i>
      </span>
      <div>
        <p class="text-sm font-semibold text-slate-800">Hồ sơ liên quan</p>
        <p class="text-xs text-slate-500">Những hồ sơ tương tự có thể hữu ích</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <article
        v-for="profile in profiles"
        :key="profile.id"
        class="border border-slate-200 rounded-xl overflow-hidden bg-white"
      >
        <div class="h-40 bg-slate-100">
          <img
            v-if="profile.images && profile.images.length"
            :src="profile.images[0]"
            :alt="profile.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="h-full flex items-center justify-center text-slate-400">
            <i class="fas fa-image text-3xl"></i>
          </div>
        </div>
        <div class="p-4 space-y-3">
          <div class="flex items-start justify-between gap-2">
            <h4 class="text-base font-semibold text-blue-600 line-clamp-2">
              {{ profile.title }}
            </h4>
            <span class="text-[11px] font-semibold px-2 py-1 rounded-full" :class="statusClass(profile.status)">
              {{ getStatusText(profile.status) }}
            </span>
          </div>
          <p class="text-sm text-slate-600 line-clamp-2">{{ profile.description }}</p>
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span>
              <i class="far fa-calendar-alt mr-1"></i>
              {{ formatDate(profile.created_at || new Date()) }}
            </span>
            <router-link
              :to="{ name: 'profile-detail', params: { id: profile.id } }"
              class="text-blue-500 font-semibold flex items-center gap-1 hover:text-blue-600"
            >
              Xem chi tiết
              <i class="fas fa-arrow-right text-[11px]"></i>
            </router-link>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CreateSuccessSuggestions',
  props: {
    profiles: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    getStatusText(status) {
      const statusMap = {
        active: 'Đang tìm kiếm',
        found: 'Đã tìm thấy',
        closed: 'Đã đóng',
      };
      return statusMap[status] || 'Đang cập nhật';
    },
    statusClass(status) {
      if (status === 'found') return 'bg-green-100 text-green-700';
      if (status === 'active') return 'bg-blue-100 text-blue-700';
      return 'bg-slate-100 text-slate-600';
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('vi-VN', options);
    },
  },
};
</script>

