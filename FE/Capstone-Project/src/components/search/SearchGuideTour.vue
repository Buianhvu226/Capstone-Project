<template>
  <Teleport to="body">
    <!-- Overlay -->
    <Transition name="fade">
      <div v-if="isActive && currentStep < steps.length" 
        class="guide-overlay" 
        @click="nextStep"
        @wheel.prevent.stop 
        @touchmove.prevent.stop 
        @scroll.prevent.stop>
        <!-- Spotlight effect -->
        <div class="spotlight-container">
          <!-- Dark overlay với cutout -->
          <div class="spotlight-dark" :style="spotlightDarkStyle"></div>
          <!-- Bright highlight -->
          <div class="spotlight-bright" :style="spotlightBrightStyle"></div>
          <!-- Glow ring -->
          <div class="spotlight-glow" :style="spotlightGlowStyle"></div>
        </div>
      </div>
    </Transition>

    <!-- Tooltip -->
    <Transition name="slide-fade">
      <div v-if="isActive && currentStep < steps.length && tooltipPosition" 
        class="guide-tooltip" 
        :style="tooltipStyle">
        <div class="tooltip-content">
          <div class="tooltip-header">
            <div class="step-number">{{ currentStep + 1 }}/{{ steps.length }}</div>
            <h3 class="tooltip-title">{{ steps[currentStep].title }}</h3>
            <button @click="closeGuide" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <p class="tooltip-text">{{ steps[currentStep].description }}</p>
          <div class="tooltip-actions">
            <button v-if="currentStep > 0" @click="prevStep" class="btn-secondary">
              <i class="fas fa-arrow-left"></i> Trước
            </button>
            <button @click="nextStep" class="btn-primary">
              {{ currentStep === steps.length - 1 ? 'Hoàn thành' : 'Tiếp theo' }}
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
          <div class="tooltip-arrow" :style="arrowStyle"></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

export default {
  name: 'SearchGuideTour',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    targetSelectors: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const currentStep = ref(0);
    const tooltipPosition = ref(null);
    const spotlightDarkStyle = ref({});
    const spotlightBrightStyle = ref({});
    const spotlightGlowStyle = ref({});
    const tooltipStyle = ref({});
    const arrowStyle = ref({});

    const steps = [
      {
        title: 'Chào mừng đến Tìm kiếm nâng cao',
        description: 'Tính năng này giúp bạn tìm kiếm hồ sơ bằng ngôn ngữ tự nhiên. Hãy nhập mô tả chi tiết để có kết quả chính xác nhất.',
        selector: '#search-query',
      },
      {
        title: 'Nhập thông tin tìm kiếm',
        description: 'Nhập câu hỏi mô tả người bạn đang tìm. Ví dụ: "Tìm người tên Nguyễn Văn A, sinh năm 1975, thất lạc ở Huế". Càng chi tiết, kết quả càng chính xác.',
        selector: '#search-query',
      },
      {
        title: 'Xem lịch sử tìm kiếm',
        description: 'Bạn có thể xem lại các lần tìm kiếm trước đó và tìm lại nhanh chóng. Kết quả tìm kiếm cũng được lưu tự động.',
        selector: '#search-history',
      },
      {
        title: 'Gợi ý tìm kiếm',
        description: 'Tham khảo các gợi ý có sẵn để biết cách nhập câu hỏi hiệu quả. Click vào gợi ý để sử dụng ngay.',
        selector: '#search-suggestions',
      },
    ];

    let scrollPosition = 0;

    const updatePositions = () => {
      if (!props.isActive || currentStep.value >= steps.length) return;

      const step = steps[currentStep.value];
      const target = document.querySelector(step.selector);
      
      if (!target) {
        tooltipPosition.value = null;
        return;
      }

      const rect = target.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Spotlight
      const padding = 20;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const radius = Math.max(rect.width, rect.height) / 2 + padding;
      const glowRadius = radius + 15;

      const left = Math.max(0, rect.left - padding);
      const top = Math.max(0, rect.top - padding);
      const right = Math.min(viewportWidth, rect.right + padding);
      const bottom = Math.min(viewportHeight, rect.bottom + padding);

      spotlightDarkStyle.value = {
        clipPath: `polygon(0% 0%, 0% 100%, ${left}px 100%, ${left}px ${top}px, ${right}px ${top}px, ${right}px ${bottom}px, ${left}px ${bottom}px, ${left}px 100%, 100% 100%, 100% 0%)`,
      };

      spotlightBrightStyle.value = {
        left: `${centerX}px`,
        top: `${centerY}px`,
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        marginLeft: `-${radius}px`,
        marginTop: `-${radius}px`,
      };

      spotlightGlowStyle.value = {
        left: `${centerX}px`,
        top: `${centerY}px`,
        width: `${glowRadius * 2}px`,
        height: `${glowRadius * 2}px`,
        marginLeft: `-${glowRadius}px`,
        marginTop: `-${glowRadius}px`,
      };

      // Tooltip position
      const tooltipWidth = Math.min(360, viewportWidth - 40);
      const tooltipHeight = 200;
      const spaceAbove = rect.top;
      const spaceBelow = viewportHeight - rect.bottom;

      let tooltipTop, tooltipLeft, arrowTop, arrowLeft, arrowTransform;

      if (spaceAbove > tooltipHeight + 40) {
        tooltipTop = rect.top + scrollY - tooltipHeight - 20;
        tooltipLeft = Math.max(20, Math.min(
          rect.left + scrollX + rect.width / 2 - tooltipWidth / 2,
          viewportWidth + scrollX - tooltipWidth - 20
        ));
        arrowTop = rect.top + scrollY - 8;
        arrowLeft = rect.left + scrollX + rect.width / 2;
        arrowTransform = 'translateX(-50%)';
      } else {
        tooltipTop = rect.bottom + scrollY + 20;
        tooltipLeft = Math.max(20, Math.min(
          rect.left + scrollX + rect.width / 2 - tooltipWidth / 2,
          viewportWidth + scrollX - tooltipWidth - 20
        ));
        arrowTop = rect.bottom + scrollY + 8;
        arrowLeft = rect.left + scrollX + rect.width / 2;
        arrowTransform = 'translateX(-50%) rotate(180deg)';
      }

      tooltipPosition.value = {
        top: `${tooltipTop}px`,
        left: `${tooltipLeft}px`,
      };

      tooltipStyle.value = {
        ...tooltipPosition.value,
        width: `${tooltipWidth}px`,
        position: 'fixed',
      };

      arrowStyle.value = {
        top: `${arrowTop}px`,
        left: `${arrowLeft}px`,
        transform: arrowTransform,
      };
    };

    const nextStep = () => {
      if (currentStep.value < steps.length - 1) {
        currentStep.value++;
        setTimeout(updatePositions, 100);
      } else {
        closeGuide();
      }
    };

    const prevStep = () => {
      if (currentStep.value > 0) {
        currentStep.value--;
        setTimeout(updatePositions, 100);
      }
    };

    const closeGuide = () => {
      emit('close');
    };

    const disablePageScroll = () => {
      scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = '100%';
      document.documentElement.style.overflow = 'hidden';
    };

    const enablePageScroll = () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.documentElement.style.overflow = '';
      window.scrollTo(0, scrollPosition);
    };

    watch(() => props.isActive, (newVal) => {
      if (newVal) {
        currentStep.value = 0;
        disablePageScroll();
        setTimeout(() => {
          updatePositions();
          window.addEventListener('resize', updatePositions);
        }, 200);
      } else {
        enablePageScroll();
        window.removeEventListener('resize', updatePositions);
      }
    });

    onMounted(() => {
      if (props.isActive) {
        setTimeout(updatePositions, 100);
      }
    });

    onUnmounted(() => {
      enablePageScroll();
      window.removeEventListener('resize', updatePositions);
    });

    return {
      currentStep,
      steps,
      tooltipPosition,
      spotlightDarkStyle,
      spotlightBrightStyle,
      spotlightGlowStyle,
      tooltipStyle,
      arrowStyle,
      nextStep,
      prevStep,
      closeGuide,
    };
  },
};
</script>

<style scoped>
.guide-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 9998;
  cursor: pointer;
  overflow: hidden;
  touch-action: none;
}

.spotlight-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.spotlight-dark {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  pointer-events: none;
}

.spotlight-bright {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    transparent 0%,
    transparent 40%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 70%,
    transparent 100%
  );
  pointer-events: none;
  animation: spotlightBright 2s ease-in-out infinite;
  box-shadow: 0 0 30px rgba(96, 165, 250, 0.3);
  z-index: 1;
}

.spotlight-glow {
  position: absolute;
  border-radius: 50%;
  border: 3px solid rgba(96, 165, 250, 0.6);
  pointer-events: none;
  animation: spotlightGlow 2s ease-in-out infinite;
  z-index: 2;
}

@keyframes spotlightBright {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.08);
    opacity: 0.8;
  }
}

@keyframes spotlightGlow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

.guide-tooltip {
  position: fixed;
  z-index: 10001;
  pointer-events: auto;
}

.tooltip-content {
  background: #60a5fa;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
}

.tooltip-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.step-number {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 700;
  color: white;
}

.tooltip-title {
  color: white;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  flex: 1;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.tooltip-text {
  color: rgba(255, 255, 255, 0.95);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
}

.tooltip-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.btn-primary {
  background: white;
  color: #60a5fa;
}

.btn-primary:hover {
  background: #f0f9ff;
  transform: translateY(-1px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

.tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 12px solid #60a5fa;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

@media (max-width: 640px) {
  .tooltip-content {
    padding: 16px;
    max-width: 300px;
  }

  .tooltip-title {
    font-size: 14px;
  }

  .tooltip-text {
    font-size: 13px;
  }
}
</style>

