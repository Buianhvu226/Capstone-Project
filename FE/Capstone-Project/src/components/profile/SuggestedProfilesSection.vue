<template>
  <section v-if="profiles && profiles.length > 0" class="mt-8">
    <div class="flex flex-col gap-2 mb-4 pl-4 sm:pl-6">
      <div>
        <p class="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-semibold mb-1">Gợi ý</p>
        <h2 class="text-base sm:text-lg font-semibold text-slate-900 leading-tight">Hồ sơ có thể liên quan</h2>
        <p class="text-xs text-slate-500">Gợi ý dựa trên độ tương đồng và khu vực quan tâm</p>
      </div>
    </div>

    <div class="relative">
      <!-- Gradient fade bên trái -->
      <div
        v-if="showLeftButton"
        class="absolute left-0 top-0 bottom-4 w-16 bg-gradient-to-r from-white via-white to-transparent pointer-events-none z-[5]"></div>

      <!-- Nút điều hướng trái -->
      <button
        v-if="showLeftButton"
        @click="scrollLeft"
        class="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95"
        aria-label="Lướt sang trái">
        <i class="fas fa-chevron-left text-blue-500 text-sm"></i>
      </button>

      <!-- Container scroll -->
      <div
        ref="scrollContainer"
        @scroll="updateButtonVisibility"
        class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] pl-4 sm:pl-6 pr-4 sm:pr-6 scroll-smooth">
        <div v-for="profile in profiles" :key="profile.id" class="snap-start shrink-0 w-[260px]">
          <SuggestedProfileCard :profile="profile" @image-error="handleImageError" />
        </div>
      </div>

      <!-- Gradient fade bên phải -->
      <div
        v-if="showRightButton"
        class="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-white via-white to-transparent pointer-events-none z-[5]"></div>

      <!-- Nút điều hướng phải -->
      <button
        v-if="showRightButton"
        @click="scrollRight"
        class="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95"
        aria-label="Lướt sang phải">
        <i class="fas fa-chevron-right text-blue-500 text-sm"></i>
      </button>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import SuggestedProfileCard from '@/components/profile/cards/SuggestedProfileCard.vue';
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
  setup(props) {
    const scrollContainer = ref(null);
    const showLeftButton = ref(false);
    const showRightButton = ref(false);

    const updateButtonVisibility = () => {
      if (!scrollContainer.value) return;

      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value;
      
      // Hiển thị nút trái nếu không ở đầu
      showLeftButton.value = scrollLeft > 10;
      
      // Hiển thị nút phải nếu chưa scroll đến cuối (có khoảng cách 10px để tránh lỗi làm tròn)
      showRightButton.value = scrollLeft < scrollWidth - clientWidth - 10;
    };

    const scrollLeft = () => {
      if (!scrollContainer.value) return;
      
      // Scroll một lượng bằng chiều rộng của 1-2 card (260px + gap 16px = 276px)
      const scrollAmount = 276 * 2; // Scroll 2 cards mỗi lần
      scrollContainer.value.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    };

    const scrollRight = () => {
      if (!scrollContainer.value) return;
      
      // Scroll một lượng bằng chiều rộng của 1-2 card
      const scrollAmount = 276 * 2; // Scroll 2 cards mỗi lần
      scrollContainer.value.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    };

    const handleResize = () => {
      nextTick(() => {
        updateButtonVisibility();
      });
    };

    const handleImageError = (event) => {
      event.target.src = noImage;
    };

    onMounted(() => {
      nextTick(() => {
        updateButtonVisibility();
        window.addEventListener('resize', handleResize);
      });
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

    // Watch profiles để cập nhật lại button visibility khi danh sách thay đổi
    watch(() => props.profiles, () => {
      nextTick(() => {
        updateButtonVisibility();
      });
    }, { deep: true });

    return {
      scrollContainer,
      showLeftButton,
      showRightButton,
      updateButtonVisibility,
      scrollLeft,
      scrollRight,
      handleImageError
    };
  }
};
</script>