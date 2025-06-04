<template>
  <section v-if="profiles && profiles.length > 0" 
    class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6 mt-8">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
          <i class="fas fa-link text-blue-600"></i>
        </div>
        <h2 class="text-xl font-bold text-gray-800">Hồ sơ có thể liên quan</h2>
      </div>
      
      <div v-if="profiles.length > 3" class="text-sm">
        <button @click="showAllProfiles = !showAllProfiles" 
          class="text-blue-600 hover:text-blue-800 font-medium flex items-center">
          <span>{{ showAllProfiles ? 'Thu gọn' : `Xem tất cả (${profiles.length})` }}</span>
          <i class="fas" :class="showAllProfiles ? 'fa-chevron-up ml-1' : 'fa-chevron-right ml-1'"></i>
        </button>
      </div>
    </div>

    <!-- Reason for suggestion -->
    <div v-if="profiles[0]?.suggestion_info?.match_summary" 
      class="mb-6 bg-white/70 p-4 rounded-lg border border-blue-100">
      <div class="flex">
        <div class="flex-shrink-0 mr-3">
          <i class="fas fa-lightbulb text-yellow-500 mt-1"></i>
        </div>
        <div>
          <h3 class="font-medium text-gray-800 mb-1">Lý do gợi ý</h3>
          <p class="text-sm text-gray-600">{{ profiles[0].suggestion_info.match_summary }}</p>
        </div>
      </div>
    </div>

    <!-- Grid layout for cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <template v-for="(profile, index) in displayedProfiles" :key="profile.id">
        <SuggestedProfileCard 
          :profile="profile" 
          @image-error="handleImageError"
        />
      </template>
    </div>

    <!-- Show more/less button for mobile -->
    <div v-if="profiles.length > 3" class="mt-6 text-center md:hidden">
      <button @click="showAllProfiles = !showAllProfiles" 
        class="w-full py-2 bg-white text-blue-600 rounded-md border border-blue-200 hover:bg-blue-50 transition-colors">
        <i class="fas" :class="showAllProfiles ? 'fa-chevron-up mr-1' : 'fa-chevron-down mr-1'"></i>
        {{ showAllProfiles ? 'Thu gọn' : `Xem tất cả ${profiles.length} hồ sơ` }}
      </button>
    </div>
  </section>
</template>

<script>
import SuggestedProfileCard from './SuggestedProfileCard.vue';
import noImage from '@/assets/images/no_image.png';

export default {
  name: 'SuggestedProfilesSection',
  components: {
    SuggestedProfileCard
  },
  props: {
    profiles: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showAllProfiles: false,
      noImage
    };
  },
  computed: {
    displayedProfiles() {
      if (this.showAllProfiles || this.profiles.length <= 3) {
        return this.profiles;
      }
      return this.profiles.slice(0, 3);
    }
  },
  methods: {
    handleImageError(event) {
      event.target.src = this.noImage;
    }
  }
};
</script>