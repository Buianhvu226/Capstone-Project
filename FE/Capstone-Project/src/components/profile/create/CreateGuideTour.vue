<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="isActive" class="fixed inset-0 z-[9999]">
        <div class="absolute inset-0 bg-black/45" @click="close"></div>
        <div class="absolute rounded-xl border-2 border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.7)] pointer-events-none"
:style="spotlightStyle">
        </div>

        <div class="absolute max-w-xs bg-white rounded-xl shadow-lg p-4 text-sm text-slate-700" :style="tooltipStyle">
          <p class="text-[11px] uppercase font-semibold text-blue-500 mb-1">
            Bước {{ activeStep + 1 }} / {{ steps.length }}
          </p>
          <p>{{ steps[activeStep].message }}</p>
          <ul v-if="steps[activeStep].tips" class="mt-2 text-xs text-slate-500 list-disc pl-4 space-y-0.5">
            <li v-for="tip in steps[activeStep].tips" :key="tip">{{ tip }}</li>
          </ul>
          <div class="flex justify-between items-center mt-3 text-xs font-semibold">
            <button class="text-slate-400 disabled:opacity-40" @click.stop="prevStep" :disabled="activeStep === 0">Trước</button>
            <div class="flex gap-2">
              <button class="text-slate-500" @click.stop="close">Đóng</button>
              <button class="text-blue-600" @click.stop="nextStep">{{ activeStep === steps.length - 1 ? 'Xong' : 'Tiếp' }}</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  name: 'CreateGuideTour',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  data() {
    return {
      activeStep: 0,
      spotlightStyle: {},
      tooltipStyle: {},
      steps: [
        {
          selector: '#create-hero',
          message: 'Khu vực điều hướng chính: xem bạn đang ở bước nào và mở hướng dẫn bất cứ lúc nào.',
          tips: ['Giữ quy trình trong 3 bước rõ ràng', 'Nút Hướng dẫn mở lại tour này']
        },
        {
          selector: '#create-tabs',
          message: 'Chọn phương thức nhập phù hợp: điền từng trường hoặc mô tả để hệ thống gợi ý nhanh.',
          tips: ['“Nhập từng trường” để kiểm soát dữ liệu', '“Tạo từ mô tả” nếu bạn có câu chuyện chi tiết']
        },
        {
          selector: '#create-form',
          message: 'Tính năng tạo nhanh: chuyển sang tab “Tạo từ mô tả” và cung cấp câu chuyện chi tiết, hệ thống sẽ tự điền các trường giúp bạn.',
          tips: ['Ưu tiên mô tả đầy đủ họ tên, năm sinh, địa điểm', 'Càng nhiều chi tiết, kết quả gợi ý càng chính xác']
        },
        {
          selector: '#create-form',
          message: 'Biểu mẫu và tiến trình được gom trong một trang để bạn không phải cuộn quá nhiều.',
          tips: ['Điền thông tin ở cột phải', 'Theo dõi log xử lý ở thẻ Tiến trình']
        },
      ],
    };
  },
  watch: {
    isActive(value) {
      if (value) {
        this.activeStep = 0;
        this.$nextTick(() => {
          this.updateSpotlight();
          this.lockScroll();
        });
      } else {
        this.unlockScroll();
      }
    },
    activeStep() {
      this.updateSpotlight();
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
    nextStep() {
      if (this.activeStep === this.steps.length - 1) {
        this.close();
      } else {
        this.activeStep += 1;
      }
    },
    prevStep() {
      if (this.activeStep > 0) {
        this.activeStep -= 1;
      }
    },
    updateSpotlight() {
      const step = this.steps[this.activeStep];
      if (!step) return;
      const element = document.querySelector(step.selector);
      if (!element) return;
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const rect = element.getBoundingClientRect();
      const padding = 8;
      this.spotlightStyle = {
        top: `${rect.top - padding}px`,
        left: `${rect.left - padding}px`,
        width: `${rect.width + padding * 2}px`,
        height: `${rect.height + padding * 2}px`,
      };
      this.tooltipStyle = {
        top: `${Math.min(rect.bottom + 12, window.innerHeight - 160)}px`,
        left: `${Math.min(rect.left, window.innerWidth - 280)}px`,
      };
    },
    lockScroll() {
      this.originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    },
    unlockScroll() {
      document.body.style.overflow = this.originalOverflow || '';
    },
  },
  beforeUnmount() {
    this.unlockScroll();
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

