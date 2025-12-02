<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="isActive" class="fixed inset-0 z-[10001]">
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
  name: 'AIMatchesModalGuideTour',
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
          selector: '#ai-modal-header',
          title: 'Tiêu đề modal',
          message:
            'Phần header hiển thị tiêu đề "Kết quả tìm kiếm AI" và số lượng báo cáo có khả năng trùng khớp. Bạn có thể đóng modal bằng nút X.',
          tips: [
            'Nút "Hướng dẫn" (?) giúp bạn tìm hiểu cách sử dụng modal này',
            'Nhấp vào nút X hoặc click ra ngoài modal để đóng',
          ],
        },
        {
          selector: '#ai-modal-first-card',
          title: 'Báo cáo gợi ý',
          message:
            'Mỗi card hiển thị một báo cáo được AI đánh giá có khả năng trùng khớp với hồ sơ hiện tại. Các báo cáo được sắp xếp theo độ khớp giảm dần.',
          tips: [
            'Card đầu tiên thường có độ khớp cao nhất',
            'Cuộn xuống để xem các báo cáo khác',
          ],
        },
        {
          selector: '#ai-modal-match-image',
          title: 'Ảnh và điểm khớp',
          message:
            'Ảnh khuôn mặt của báo cáo gợi ý và điểm phần trăm khớp khuôn mặt được hiển thị ở đây. Điểm càng cao, khả năng trùng khớp càng lớn.',
          tips: [
            'Điểm ≥ 90%: Rất khả năng trùng khớp',
            'Điểm 80-89%: Khả năng trùng khớp cao',
            'Điểm < 80%: Cần xem xét thêm',
          ],
        },
        {
          selector: '#ai-modal-match-meta',
          title: 'Thông tin báo cáo',
          message:
            'Phần này hiển thị thông tin chi tiết: người đăng, thời gian đăng, độ khớp khuôn mặt và kết luận từ AI.',
          tips: [
            'Kiểm tra thời gian đăng để biết báo cáo mới hay cũ',
            'Kết luận AI giúp đánh giá tổng quan về khả năng trùng khớp',
          ],
        },
        {
          selector: '#ai-modal-analysis',
          title: 'Phân tích AI chi tiết',
          message:
            'AI phân tích chi tiết các khía cạnh như tuổi, giới tính, đặc điểm ngoại hình để đưa ra kết luận. Nhấp "Xem chi tiết" để mở rộng.',
          tips: [
            'Kết luận nhanh tóm tắt đánh giá của AI',
            'Mở rộng để xem phân tích chi tiết từng khía cạnh',
          ],
        },
        {
          selector: '#ai-modal-actions',
          title: 'Hành động',
          message:
            'Bạn có thể xem chi tiết báo cáo hoặc liên hệ trực tiếp với người đăng báo cáo từ đây.',
          tips: [
            '"Xem chi tiết" để mở trang chi tiết báo cáo',
            '"Liên hệ" để bắt đầu cuộc trò chuyện với người đăng (nếu không phải chủ báo cáo)',
          ],
        },
      ],
    };
  },
  watch: {
    isActive(value) {
      if (value) {
        this.activeStep = 0;
        // Đợi modal render hoàn toàn trước khi bắt đầu guide tour
        this.$nextTick(() => {
          setTimeout(() => {
            // Kiểm tra xem modal có tồn tại không
            const modal = document.querySelector('#rmd-ai-modal');
            if (modal) {
              this.updateSpotlight();
            } else {
              // Nếu modal chưa render, thử lại sau 300ms
              setTimeout(() => {
                this.updateSpotlight();
              }, 300);
            }
          }, 200);
        });
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
    updateSpotlight() {
      const step = this.steps[this.activeStep];
      if (!step) return;
      this.findAndHighlightElement(step);
    },
    findAndHighlightElement(step) {
      const findElement = (retries = 0) => {
        // Kiểm tra xem modal có tồn tại không
        const modal = document.querySelector('#rmd-ai-modal');
        if (!modal && retries < 10) {
          setTimeout(() => findElement(retries + 1), 150);
          return;
        }

        let selectors = [];

        if (step.selector) {
          selectors = step.selector.split(',').map((s) => s.trim());
        }

        if (!selectors.length) {
          selectors = ['body'];
        }

        let element = null;

        for (const selector of selectors) {
          // Tìm trong modal trước (ưu tiên)
          if (modal) {
            const found = modal.querySelector(selector);
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

          // Nếu không tìm thấy trong modal, thử tìm trong toàn bộ document
          if (!element) {
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

        // Scroll tới vị trí element trong modal
        // Sử dụng biến modal đã khai báo ở đầu hàm
        if (modal) {
          const modalContent = modal.querySelector('.flex-1.overflow-y-auto');
          if (modalContent && element) {
            const elementRect = element.getBoundingClientRect();
            const modalRect = modalContent.getBoundingClientRect();
            const scrollTop = modalContent.scrollTop;
            const targetScroll = scrollTop + elementRect.top - modalRect.top - 20;
            modalContent.scrollTo({
              top: targetScroll,
              behavior: 'smooth',
            });
          }
        }

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

