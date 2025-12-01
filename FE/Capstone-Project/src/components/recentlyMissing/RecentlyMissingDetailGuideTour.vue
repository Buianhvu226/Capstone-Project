<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="isActive" class="fixed inset-0 z-[9999]">
        <!-- Overlay 4 phía để tạo vùng spotlight không bị mờ -->
        <div class="absolute bg-black/45 pointer-events-auto" :style="overlayTopStyle" @click="close"></div>
        <div class="absolute bg-black/45 pointer-events-auto" :style="overlayBottomStyle" @click="close"></div>
        <div class="absolute bg-black/45 pointer-events-auto" :style="overlayLeftStyle" @click="close"></div>
        <div class="absolute bg-black/45 pointer-events-auto" :style="overlayRightStyle" @click="close"></div>

        <!-- Vùng spotlight -->
        <div
          class="absolute rounded-xl border-2 border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.7)] pointer-events-none z-[10]"
          :style="spotlightStyle"></div>

        <!-- Tooltip -->
        <div class="absolute bg-white rounded-xl shadow-lg p-4 text-sm text-slate-700 z-20 max-w-xs sm:max-w-sm"
          :style="tooltipStyle">
          <p class="text-[11px] uppercase font-semibold text-blue-500 mb-1">
            Bước {{ activeStep + 1 }} / {{ steps.length }}
          </p>
          <p class="font-medium text-slate-800 mb-1">
            {{ steps[activeStep].title }}
          </p>
          <p class="text-xs text-slate-600">
            {{ steps[activeStep].message }}
          </p>
          <ul v-if="steps[activeStep].tips" class="mt-2 text-xs text-slate-500 list-disc pl-4 space-y-0.5">
            <li v-for="tip in steps[activeStep].tips" :key="tip">{{ tip }}</li>
          </ul>
          <div class="flex justify-between items-center mt-3 text-xs font-semibold">
            <button class="text-slate-400 disabled:opacity-40" @click.stop="prevStep" :disabled="activeStep === 0">
              Trước
            </button>
            <div class="flex gap-2">
              <button class="text-slate-500" @click.stop="close">Đóng</button>
              <button class="text-blue-600" @click.stop="nextStep">
                {{ activeStep === steps.length - 1 ? 'Xong' : 'Tiếp' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  name: 'RecentlyMissingDetailGuideTour',
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
      overlayTopStyle: {},
      overlayBottomStyle: {},
      overlayLeftStyle: {},
      overlayRightStyle: {},
      steps: [
        {
          selector: '#rmd-face-card',
          title: 'Ảnh khuôn mặt báo cáo',
          message:
            'Khu vực hiển thị ảnh khuôn mặt chính của người bị thất lạc. Bạn có thể nhấp vào để xem ảnh lớn hơn trong modal.',
          tips: [
            'Nếu là chủ báo cáo, hãy tải lên ảnh rõ mặt để AI nhận diện tốt hơn',
            'Nhấp vào ảnh để phóng to, quan sát chi tiết',
          ],
        },
        {
          selector: '#rmd-ai-card',
          title: 'Khu vực tìm kiếm AI',
          message:
            'AI sẽ quét các báo cáo khác có khuôn mặt tương đồng và phân tích mức độ khớp để gợi ý cho bạn.',
          tips: [
            'Nút "Tìm kiếm & phân tích" dùng để gửi yêu cầu phân tích AI (chỉ chủ báo cáo mới thấy)',
            'Khi có kết quả, bạn có thể xem chi tiết từng gợi ý khớp',
          ],
        },
        {
          selector: '#rmd-header-card',
          title: 'Thông tin cơ bản & liên hệ',
          message:
            'Thẻ này tóm tắt đầy đủ thông tin chính: tiêu đề báo cáo, thời gian, trạng thái, thống kê AI và thông tin liên hệ.',
          tips: [
            'Kiểm tra kỹ thông tin liên hệ để thuận tiện trao đổi giữa các bên',
            'Nếu là chủ báo cáo, bạn có thể sử dụng các nút hành động (nếu được cấu hình)',
          ],
        },
        {
          selector: '#rmd-description',
          title: 'Mô tả chi tiết vụ việc',
          message:
            'Phần mô tả cung cấp bối cảnh, đặc điểm nhận dạng và các thông tin bổ sung giúp cộng đồng nhận diện chính xác hơn.',
          tips: [
            'Nên ghi chi tiết nhưng ngắn gọn, tập trung vào đặc điểm nổi bật',
            'Tránh chia sẻ thông tin nhạy cảm không cần thiết',
          ],
        },
        {
          selector: '#rmd-ai-result-btn',
          title: 'Xem kết quả tìm kiếm AI',
          message:
            'Khi đã có kết quả, bấm nút này để mở danh sách các báo cáo được AI đánh giá có khả năng trùng khớp.',
          tips: [
            'Mỗi gợi ý sẽ hiển thị điểm khớp khuôn mặt và nhận định của AI',
            'Bạn có thể mở chi tiết hồ sơ hoặc liên hệ với người đăng từ danh sách này',
          ],
        },
      ],
    };
  },
  watch: {
    isActive(value) {
      if (value) {
        this.activeStep = 0;
        this.$nextTick(() => {
          setTimeout(() => {
            this.updateSpotlight();
            this.lockScroll();
          }, 200);
        });
      } else {
        this.unlockScroll();
      }
    },
    activeStep() {
      this.$nextTick(() => {
        const delay = window.innerWidth < 768 ? 400 : 200;
        setTimeout(() => {
          this.updateSpotlight();
        }, delay);
      });
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
    lockScroll() {
      document.body.style.overflow = 'hidden';
    },
    unlockScroll() {
      document.body.style.overflow = '';
    },
    updateSpotlight() {
      const step = this.steps[this.activeStep];
      if (!step) return;
      this.findAndHighlightElement(step);
    },
    findAndHighlightElement(step) {
      const findElement = (retries = 0) => {
        let selectors = [];

        if (step.selector) {
          selectors = step.selector.split(',').map((s) => s.trim());
        }

        if (!selectors.length) {
          selectors = ['body'];
        }

        let element = null;

        for (const selector of selectors) {
          const found = document.querySelector(selector);
          if (found) {
            const rect = found.getBoundingClientRect();
            const style = window.getComputedStyle(found);
            const isVisible =
              rect.width > 0 &&
              rect.height > 0 &&
              style.display !== 'none' &&
              style.visibility !== 'hidden' &&
              style.opacity !== '0';

            if (isVisible) {
              element = found;
              break;
            }
          }
        }

        if (!element && retries < 20) {
          setTimeout(() => findElement(retries + 1), 150);
          return;
        }

        if (!element) {
          this.spotlightStyle = { display: 'none' };
          this.overlayTopStyle = { display: 'none' };
          this.overlayBottomStyle = { display: 'none' };
          this.overlayLeftStyle = { display: 'none' };
          this.overlayRightStyle = { display: 'none' };
          this.tooltipStyle = {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          };
          return;
        }

        // Scroll tới vị trí element có bù trừ chiều cao header cố định
        const headerOffset = 80;
        const initialRect = element.getBoundingClientRect();
        const targetY = Math.max(0, window.scrollY + initialRect.top - headerOffset);
        window.scrollTo({
          top: targetY,
          behavior: 'smooth',
        });

        setTimeout(() => {
          const rect = element.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) {
            return;
          }

          const padding = 8;
          const spotlightTop = Math.max(0, rect.top - padding);
          const spotlightLeft = Math.max(0, rect.left - padding);
          const spotlightWidth = rect.width + padding * 2;
          const spotlightHeight = rect.height + padding * 2;

          this.spotlightStyle = {
            top: `${spotlightTop}px`,
            left: `${spotlightLeft}px`,
            width: `${spotlightWidth}px`,
            height: `${spotlightHeight}px`,
          };

          this.overlayTopStyle = {
            top: '0',
            left: '0',
            right: '0',
            height: `${spotlightTop}px`,
          };

          this.overlayBottomStyle = {
            top: `${spotlightTop + spotlightHeight}px`,
            left: '0',
            right: '0',
            bottom: '0',
          };

          this.overlayLeftStyle = {
            top: `${spotlightTop}px`,
            left: '0',
            width: `${spotlightLeft}px`,
            height: `${spotlightHeight}px`,
          };

          this.overlayRightStyle = {
            top: `${spotlightTop}px`,
            left: `${spotlightLeft + spotlightWidth}px`,
            right: '0',
            height: `${spotlightHeight}px`,
          };

          const isMobile = window.innerWidth < 768;
          const tooltipWidth = isMobile ? 280 : 320;
          const estimatedHeight = isMobile ? 130 : 160;

          let tooltipTop = spotlightTop + spotlightHeight + 12;
          let tooltipLeft = spotlightLeft + spotlightWidth / 2 - tooltipWidth / 2;

          const viewportHeight = window.innerHeight;
          const viewportWidth = window.innerWidth;

          // Nếu không đủ chỗ phía dưới, thử đặt tooltip lên trên
          if (tooltipTop + estimatedHeight > viewportHeight - 12) {
            tooltipTop = spotlightTop - estimatedHeight - 12;
          }

          // Nếu vẫn vượt ra khỏi phía trên, đặt gần giữa màn hình
          if (tooltipTop < 12) {
            tooltipTop = Math.max(12, viewportHeight / 2 - estimatedHeight / 2);
          }

          tooltipLeft = Math.max(12, Math.min(tooltipLeft, viewportWidth - tooltipWidth - 12));

          this.tooltipStyle = {
            top: `${tooltipTop}px`,
            left: `${tooltipLeft}px`,
            width: `${tooltipWidth}px`,
          };
        }, 250);
      };

      findElement();
    },
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


