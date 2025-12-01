<template>
  <Transition name="fade-slide">
    <button v-if="showButton" @click="scrollToTop"
      class="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group">
      <i class="fas fa-arrow-up text-lg group-hover:scale-110 transition-transform"></i>
    </button>
  </Transition>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'ScrollToTop',
  setup() {
    const showButton = ref(false);

    // Handle scroll to show/hide button
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      // Hiển thị nút khi scroll xuống hơn 300px
      showButton.value = scrollY > 300;
    };

    // Scroll to top function
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    onMounted(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    return {
      showButton,
      scrollToTop,
    };
  },
};
</script>

<style scoped>
/* Scroll to Top Button Transitions */
.fade-slide-enter-active {
  transition: all 0.3s ease-out;
}

.fade-slide-leave-active {
  transition: all 0.3s ease-in;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}
</style>

