<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="isActive" class="fixed inset-0 z-[9999]">
        <!-- Overlay ở 4 phía để tạo "lỗ" tại vị trí spotlight -->
        <!-- Top overlay -->
        <div class="absolute bg-black/45 pointer-events-auto" 
          :style="overlayTopStyle"
          @click="close">
        </div>
        <!-- Bottom overlay -->
        <div class="absolute bg-black/45 pointer-events-auto" 
          :style="overlayBottomStyle"
          @click="close">
        </div>
        <!-- Left overlay -->
        <div class="absolute bg-black/45 pointer-events-auto" 
          :style="overlayLeftStyle"
          @click="close">
        </div>
        <!-- Right overlay -->
        <div class="absolute bg-black/45 pointer-events-auto" 
          :style="overlayRightStyle"
          @click="close">
        </div>
        
        <!-- Spotlight border -->
        <div class="absolute rounded-xl border-2 border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.7)] pointer-events-none z-[10]"
          :style="spotlightStyle">
        </div>

        <!-- Tooltip -->
        <div class="absolute bg-white rounded-xl shadow-lg p-4 text-sm text-slate-700 z-20" :style="tooltipStyle">
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
  name: 'MyProfileGuideTour',
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
          selector: '#my-profile-hero',
          message: 'Trang quản lý hồ sơ của bạn: xem tất cả hồ sơ đã tạo, các gợi ý từ hệ thống và hồ sơ liên quan.',
          tips: ['Nút "Hướng dẫn" mở lại tour này bất cứ lúc nào', 'Số lượng hiển thị trên mỗi tab cho biết có bao nhiêu hồ sơ']
        },
        {
          selector: '#tab-my_profiles',
          message: 'Tab "Hồ sơ của tôi": Quản lý tất cả các hồ sơ tìm kiếm người thân mà bạn đã tạo. Tại đây bạn có thể xem, chỉnh sửa hoặc xóa hồ sơ của mình.',
          tips: ['Xem danh sách tất cả hồ sơ bạn đã đăng', 'Chỉnh sửa hoặc xóa hồ sơ bất cứ lúc nào', 'Sắp xếp hồ sơ theo nhiều tiêu chí khác nhau']
        },
        {
          selector: '#btn-create-profile',
          message: 'Nút "Tạo hồ sơ mới": Tạo một hồ sơ tìm kiếm người thân mới. Bạn có thể điền thông tin chi tiết hoặc sử dụng tính năng tạo từ mô tả.',
          tips: ['Nhấn nút này để bắt đầu tạo hồ sơ mới', 'Có thể tạo nhiều hồ sơ cho nhiều người thân khác nhau'],
          requiredTab: 'my_profiles'
        },
        {
          selector: '.first-profile-action.profile-action-edit, .first-profile-action.profile-action-view, .first-profile-action.profile-action-menu, .profile-action-edit, .profile-action-view, .profile-action-menu',
          message: 'Các nút hành động trên hồ sơ: Mỗi hồ sơ có các nút để quản lý. Nút menu (3 chấm) chứa các tùy chọn như xem chi tiết, chỉnh sửa và xóa.',
          tips: ['Nút "Chỉnh sửa" để cập nhật thông tin hồ sơ', 'Nút "Xem chi tiết" để xem đầy đủ thông tin', 'Menu 3 chấm có thêm tùy chọn xóa hồ sơ'],
          requiredTab: 'my_profiles'
        },
        {
          selector: '#tab-suggested',
          message: 'Tab "Gợi ý cho tôi": Hệ thống tự động phân tích và gợi ý các hồ sơ khác có thể liên quan đến hồ sơ của bạn. Đây là cơ hội để bạn tìm thấy người thân.',
          tips: ['Xem các hồ sơ được hệ thống gợi ý', 'Xác nhận hoặc từ chối nếu hồ sơ có liên quan', 'Mỗi gợi ý đều có thông tin về hồ sơ nguồn']
        },
        {
          selector: '.first-profile-action.suggested-action-accept, .first-profile-action.suggested-action-reject, .first-profile-action.suggested-action-pending, .suggested-action-accept, .suggested-action-reject, .suggested-action-pending',
          message: 'Các nút xử lý gợi ý: Khi xem hồ sơ gợi ý, bạn có thể xác nhận nếu hồ sơ khớp với người thân bạn đang tìm, từ chối nếu không liên quan, hoặc để chờ xem xét thêm.',
          tips: ['Nút "Khớp" (màu xanh lá) để xác nhận hồ sơ liên quan', 'Nút "Không" (màu đỏ) để từ chối gợi ý', 'Nút "Chờ" (màu xanh dương) để tạm hoãn quyết định'],
          requiredTab: 'suggested'
        },
        {
          selector: '#tab-referenced',
          message: 'Tab "Hồ sơ tham chiếu": Hiển thị các hồ sơ khác đã tham chiếu đến hồ sơ của bạn. Điều này có nghĩa là người khác nghĩ hồ sơ của bạn có thể liên quan đến họ.',
          tips: ['Xem ai đã tham chiếu đến hồ sơ của bạn', 'Liên hệ với người đăng hồ sơ tham chiếu', 'Cơ hội kết nối với những người đang tìm kiếm']
        },
        {
          selector: '.first-profile-action.referenced-action-accept, .first-profile-action.referenced-action-reject, .first-profile-action.referenced-action-pending, .referenced-action-accept, .referenced-action-reject, .referenced-action-pending',
          message: 'Các nút xử lý tham chiếu: Tương tự như gợi ý, bạn có thể xác nhận, từ chối hoặc để chờ các hồ sơ tham chiếu đến hồ sơ của bạn.',
          tips: ['Xác nhận "Khớp" nếu hồ sơ tham chiếu đúng với người thân', 'Từ chối "Không" nếu không liên quan', 'Luôn xem chi tiết trước khi quyết định'],
          requiredTab: 'referenced'
        },
      ],
    };
  },
  watch: {
    isActive(value) {
      if (value) {
        this.activeStep = 0;
        // Đợi DOM render xong trước khi tìm element
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
        // Đợi lâu hơn trên mobile để đảm bảo tab content đã render
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
      
      // Tự động chuyển tab nếu cần
      if (step.requiredTab) {
        const tabButton = document.querySelector(`#tab-${step.requiredTab}`);
        if (tabButton) {
          const currentTab = document.querySelector('.border-blue-500');
          if (!currentTab || !currentTab.id.includes(step.requiredTab)) {
            tabButton.click();
            // Đợi tab content render
            setTimeout(() => {
              this.findAndHighlightElement(step);
            }, 300);
            return;
          }
        }
      }
      
      this.findAndHighlightElement(step);
    },
    
    findAndHighlightElement(step) {
      // Retry logic để đảm bảo element đã render
      const findElement = (retries = 0) => {
        // Hỗ trợ multiple selectors (phân tách bằng dấu phẩy)
        const selectors = step.selector.split(',').map(s => s.trim());
        let element = null;
        
        // Thử từng selector cho đến khi tìm thấy
        for (const selector of selectors) {
          const found = document.querySelector(selector);
          if (found) {
            // Kiểm tra element có visible không
            const rect = found.getBoundingClientRect();
            const isVisible = rect.width > 0 && rect.height > 0 && 
                            window.getComputedStyle(found).display !== 'none' &&
                            window.getComputedStyle(found).visibility !== 'hidden' &&
                            window.getComputedStyle(found).opacity !== '0';
            
            if (isVisible) {
              element = found;
              break;
            }
          }
        }
        
        // Nếu không tìm thấy và chưa hết retry, thử lại
        if (!element && retries < 20) {
          setTimeout(() => findElement(retries + 1), 150);
          return;
        }
        
        // Nếu vẫn không tìm thấy sau nhiều lần thử, thử fallback
        if (!element) {
          // Fallback: thử tìm element đầu tiên có một trong các class
          if (step.selector.includes('first-profile-action')) {
            const classNames = step.selector.match(/\.([\w-]+)/g);
            if (classNames && classNames.length > 0) {
              // Tìm element có class đầu tiên
              const firstClass = classNames[0].substring(1);
              element = document.querySelector(`.${firstClass}`);
            }
          }
          
          if (!element) {
            console.warn(`Element not found: ${step.selector}`);
            // Vẫn hiển thị tooltip ở giữa màn hình nếu không tìm thấy element
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
        }
        
        // Scroll element vào view
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        
        // Đợi scroll hoàn tất trước khi tính toán vị trí
        setTimeout(() => {
          const rect = element.getBoundingClientRect();
          
          // Kiểm tra lại element có trong viewport không
          if (rect.width === 0 || rect.height === 0) {
            console.warn('Element has zero dimensions');
            return;
          }
          
          const padding = 8;
          const spotlightTop = Math.max(0, rect.top - padding);
          const spotlightLeft = Math.max(0, rect.left - padding);
          const spotlightWidth = rect.width + padding * 2;
          const spotlightHeight = rect.height + padding * 2;
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;
          
          this.spotlightStyle = {
            top: `${spotlightTop}px`,
            left: `${spotlightLeft}px`,
            width: `${spotlightWidth}px`,
            height: `${spotlightHeight}px`,
          };
          
          // Tạo 4 overlay ở 4 phía để tạo "lỗ" tại vị trí spotlight
          // Top overlay
          this.overlayTopStyle = {
            top: '0',
            left: '0',
            width: `${windowWidth}px`,
            height: `${Math.max(0, spotlightTop)}px`,
          };
          
          // Bottom overlay
          this.overlayBottomStyle = {
            top: `${spotlightTop + spotlightHeight}px`,
            left: '0',
            width: `${windowWidth}px`,
            height: `${Math.max(0, windowHeight - spotlightTop - spotlightHeight)}px`,
          };
          
          // Left overlay
          this.overlayLeftStyle = {
            top: `${spotlightTop}px`,
            left: '0',
            width: `${Math.max(0, spotlightLeft)}px`,
            height: `${spotlightHeight}px`,
          };
          
          // Right overlay
          this.overlayRightStyle = {
            top: `${spotlightTop}px`,
            left: `${spotlightLeft + spotlightWidth}px`,
            width: `${Math.max(0, windowWidth - spotlightLeft - spotlightWidth)}px`,
            height: `${spotlightHeight}px`,
          };
          
          // Tooltip positioning - responsive cho mobile
          const tooltipWidth = 280;
          const tooltipMargin = 12;
          let tooltipTop = rect.bottom + tooltipMargin;
          let tooltipLeft = rect.left;
          
          // Nếu tooltip bị tràn dưới màn hình, đặt phía trên
          if (tooltipTop + 200 > windowHeight) {
            tooltipTop = rect.top - 200;
          }
          
          // Nếu tooltip bị tràn bên phải, điều chỉnh
          if (tooltipLeft + tooltipWidth > windowWidth) {
            tooltipLeft = windowWidth - tooltipWidth - tooltipMargin;
          }
          
          // Đảm bảo tooltip không bị tràn bên trái
          if (tooltipLeft < tooltipMargin) {
            tooltipLeft = tooltipMargin;
          }
          
          this.tooltipStyle = {
            top: `${Math.max(tooltipMargin, Math.min(tooltipTop, windowHeight - 200))}px`,
            left: `${tooltipLeft}px`,
            maxWidth: `${Math.min(tooltipWidth, windowWidth - tooltipMargin * 2)}px`,
          };
        }, 400);
      };
      
      findElement();
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

