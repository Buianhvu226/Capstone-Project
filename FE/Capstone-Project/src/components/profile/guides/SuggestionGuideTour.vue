<template>
    <Teleport to="body">
        <!-- Spotlight Overlay -->
        <Transition name="fade">
            <div v-if="isActive" class="guide-tour-overlay" @click="closeGuide" @wheel.prevent.stop
                @touchmove.prevent.stop @scroll.prevent.stop>
                <!-- Spotlight effect - tạo vùng sáng xung quanh target -->
                <div class="spotlight-container">
                    <!-- Dark overlay với cutout cho button -->
                    <div class="spotlight-dark" :style="spotlightDarkStyle"></div>
                    <!-- Bright highlight cho button -->
                    <div class="spotlight-bright" :style="spotlightBrightStyle"></div>
                    <!-- Glow ring around target -->
                    <div class="spotlight-glow" :style="spotlightGlowStyle"></div>
                    <!-- Border highlight -->
                    <div class="spotlight-border" :style="spotlightBorderStyle"></div>
                </div>
            </div>
        </Transition>

        <!-- Tooltip với mũi tên -->
        <Transition name="slide-fade">
            <div v-if="isActive && tooltipPosition" class="guide-tooltip" :style="tooltipStyle">
                <div class="tooltip-content">
                    <div class="tooltip-header">
                        <div class="sparkle-icon">
                            <i class="fas fa-lightbulb"></i>
                        </div>
                        <h3 class="tooltip-title">Khám phá hồ sơ gợi ý!</h3>
                    </div>
                    <p class="tooltip-text">
                        Chúng tôi đã tìm thấy <strong>{{ profileCount }}</strong> hồ sơ có thể liên quan đến bạn.
                        Nhấn nút bên dưới để xem ngay!
                    </p>
                    <div class="tooltip-arrow" :style="arrowStyle"></div>
                </div>
            </div>
        </Transition>

        <!-- Animated Arrow pointing to button -->
        <Transition name="bounce">
            <div v-if="isActive && arrowPosition" class="animated-arrow" :style="arrowPosition">
                <div class="arrow-line"></div>
                <i class="fas fa-hand-point-down arrow-icon"></i>
            </div>
        </Transition>
    </Teleport>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

export default {
    name: 'SuggestionGuideTour',
    props: {
        isActive: {
            type: Boolean,
            default: false,
        },
        targetSelector: {
            type: String,
            default: '.suggestion-button',
        },
        profileCount: {
            type: Number,
            default: 0,
        },
    },
    emits: ['close'],
    setup(props, { emit }) {
        const targetElement = ref(null);
        const tooltipPosition = ref(null);
        const arrowPosition = ref(null);
        const spotlightStyle = ref({});
        const spotlightDarkStyle = ref({});
        const spotlightBrightStyle = ref({});
        const spotlightGlowStyle = ref({});
        const spotlightBorderStyle = ref({});
        const tooltipStyle = ref({});
        const arrowStyle = ref({});

        const updatePositions = () => {
            if (!props.isActive) return;

            const target = document.querySelector(props.targetSelector);
            if (!target) {
                // Fallback: tìm button "Xem ngay"
                const buttons = document.querySelectorAll('button');
                targetElement.value = Array.from(buttons).find(btn =>
                    btn.textContent && btn.textContent.includes('Xem ngay')
                );
            } else {
                targetElement.value = target;
            }

            if (!targetElement.value) {
                tooltipPosition.value = null;
                arrowPosition.value = null;
                return;
            }

            const rect = targetElement.value.getBoundingClientRect();
            const scrollY = window.scrollY;
            const scrollX = window.scrollX;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Tính toán spotlight (vùng sáng xung quanh button)
            const padding = 30;
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const radius = Math.max(rect.width, rect.height) / 2 + padding;
            const glowRadius = radius + 25;
            const borderRadius = radius + 5;

            // Dark overlay với cutout chính xác cho button
            const left = Math.max(0, rect.left - padding);
            const top = Math.max(0, rect.top - padding);
            const right = Math.min(viewportWidth, rect.right + padding);
            const bottom = Math.min(viewportHeight, rect.bottom + padding);

            spotlightDarkStyle.value = {
                clipPath: `polygon(
          0% 0%,
          0% 100%,
          ${left}px 100%,
          ${left}px ${top}px,
          ${right}px ${top}px,
          ${right}px ${bottom}px,
          ${left}px ${bottom}px,
          ${left}px 100%,
          100% 100%,
          100% 0%
        )`,
            };

            // Bright highlight cho button area
            spotlightBrightStyle.value = {
                left: `${centerX}px`,
                top: `${centerY}px`,
                width: `${radius * 2}px`,
                height: `${radius * 2}px`,
                marginLeft: `-${radius}px`,
                marginTop: `-${radius}px`,
            };

            // Glow ring
            spotlightGlowStyle.value = {
                left: `${centerX}px`,
                top: `${centerY}px`,
                width: `${glowRadius * 2}px`,
                height: `${glowRadius * 2}px`,
                marginLeft: `-${glowRadius}px`,
                marginTop: `-${glowRadius}px`,
            };

            // Border highlight
            spotlightBorderStyle.value = {
                left: `${rect.left - padding}px`,
                top: `${rect.top - padding}px`,
                width: `${rect.width + padding * 2}px`,
                height: `${rect.height + padding * 2}px`,
            };

            // Tính toán vị trí tooltip (phía trên button)
            const tooltipWidth = Math.min(320, viewportWidth - 40);
            const tooltipHeight = 160;
            const spaceAbove = rect.top;
            const spaceBelow = viewportHeight - rect.bottom;

            let tooltipTop, tooltipLeft, arrowTop, arrowLeft, arrowTransform;

            if (spaceAbove > tooltipHeight + 40) {
                // Tooltip ở phía trên
                tooltipTop = rect.top + scrollY - tooltipHeight - 20;
                tooltipLeft = Math.max(20, Math.min(
                    rect.left + scrollX + rect.width / 2 - tooltipWidth / 2,
                    viewportWidth + scrollX - tooltipWidth - 20
                ));
                arrowTop = rect.top + scrollY - 8;
                arrowLeft = rect.left + scrollX + rect.width / 2;
                arrowTransform = 'translateX(-50%)';
            } else if (spaceBelow > tooltipHeight + 40) {
                // Tooltip ở phía dưới
                tooltipTop = rect.bottom + scrollY + 20;
                tooltipLeft = Math.max(20, Math.min(
                    rect.left + scrollX + rect.width / 2 - tooltipWidth / 2,
                    viewportWidth + scrollX - tooltipWidth - 20
                ));
                arrowTop = rect.bottom + scrollY + 8;
                arrowLeft = rect.left + scrollX + rect.width / 2;
                arrowTransform = 'translateX(-50%) rotate(180deg)';
            } else {
                // Tooltip ở bên phải hoặc trái
                const spaceRight = viewportWidth - rect.right;
                const spaceLeft = rect.left;

                if (spaceRight > tooltipWidth + 30) {
                    // Bên phải
                    tooltipTop = rect.top + scrollY + rect.height / 2 - tooltipHeight / 2;
                    tooltipLeft = rect.right + scrollX + 20;
                    arrowTop = rect.top + scrollY + rect.height / 2;
                    arrowLeft = rect.right + scrollX + 8;
                    arrowTransform = 'translateY(-50%) rotate(-90deg)';
                } else {
                    // Bên trái
                    tooltipTop = rect.top + scrollY + rect.height / 2 - tooltipHeight / 2;
                    tooltipLeft = rect.left + scrollX - tooltipWidth - 20;
                    arrowTop = rect.top + scrollY + rect.height / 2;
                    arrowLeft = rect.left + scrollX - 8;
                    arrowTransform = 'translateY(-50%) rotate(90deg)';
                }
            }

            tooltipPosition.value = {
                top: `${tooltipTop}px`,
                left: `${tooltipLeft}px`,
            };

            tooltipStyle.value = {
                ...tooltipPosition.value,
                width: `${tooltipWidth}px`,
            };

            arrowStyle.value = {
                top: `${arrowTop}px`,
                left: `${arrowLeft}px`,
                transform: arrowTransform,
            };

            // Tính toán vị trí mũi tên animated (bên phải button)
            arrowPosition.value = {
                top: `${rect.top + scrollY + rect.height / 2}px`,
                left: `${rect.right + scrollX + 15}px`,
            };
        };

        const closeGuide = () => {
            emit('close');
        };

        let resizeObserver = null;
        let scrollHandler = null;

        // Store scroll position
        let scrollPosition = 0;

        // Prevent scroll when guide is active
        const preventScroll = (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };

        const preventWheel = (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };

        const preventTouchMove = (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };

        const preventKeyScroll = (e) => {
            // Prevent arrow keys, space, page up/down
            if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
                e.preventDefault();
                return false;
            }
        };

        const disablePageScroll = () => {
            // Save current scroll position
            scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

            // Disable body scroll with multiple methods
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollPosition}px`;
            document.body.style.width = '100%';
            document.documentElement.style.overflow = 'hidden';

            // Prevent scroll events - use capture phase
            window.addEventListener('wheel', preventWheel, { passive: false, capture: true });
            window.addEventListener('touchmove', preventTouchMove, { passive: false, capture: true });
            window.addEventListener('scroll', preventScroll, { passive: false, capture: true });
            document.addEventListener('keydown', preventKeyScroll, { passive: false, capture: true });
        };

        const enablePageScroll = () => {
            // Restore scroll position
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.documentElement.style.overflow = '';

            // Restore scroll position
            window.scrollTo(0, scrollPosition);

            // Remove scroll prevention
            window.removeEventListener('wheel', preventWheel, { capture: true });
            window.removeEventListener('touchmove', preventTouchMove, { capture: true });
            window.removeEventListener('scroll', preventScroll, { capture: true });
            document.removeEventListener('keydown', preventKeyScroll, { capture: true });
        };

        // Scroll to top of page immediately
        const scrollToTop = () => {
            // Scroll lên đầu trang ngay lập tức (không smooth để nhanh hơn)
            window.scrollTo(0, 0);
            // Hoặc dùng smooth nếu muốn
            // window.scrollTo({ top: 0, behavior: 'smooth' });

            // Lưu scroll position = 0
            scrollPosition = 0;
        };

        watch(() => props.isActive, (newVal) => {
            if (newVal) {
                // Scroll lên đầu trang NGAY LẬP TỨC trước khi làm gì khác
                scrollToTop();

                // Đợi một chút để đảm bảo scroll đã hoàn tất
                setTimeout(() => {
                    // Disable page scroll sau khi đã scroll lên đầu
                    disablePageScroll();
                    // Update positions sau khi scroll và disable
                    setTimeout(() => {
                        updatePositions();
                        scrollHandler = () => updatePositions();
                        // Chỉ update positions khi resize, không cho scroll
                        window.addEventListener('resize', updatePositions);
                    }, 50);
                }, 100);
            } else {
                // Enable page scroll
                enablePageScroll();
                if (scrollHandler) {
                    window.removeEventListener('resize', updatePositions);
                }
            }
        });

        onMounted(() => {
            if (props.isActive) {
                setTimeout(updatePositions, 100);
            }
        });

        onUnmounted(() => {
            // Ensure scroll is enabled when component is destroyed
            enablePageScroll();
            if (scrollHandler) {
                window.removeEventListener('resize', updatePositions);
            }
            // Clean up all event listeners
            window.removeEventListener('wheel', preventWheel, { capture: true });
            window.removeEventListener('touchmove', preventTouchMove, { capture: true });
            window.removeEventListener('scroll', preventScroll, { capture: true });
            document.removeEventListener('keydown', preventKeyScroll, { capture: true });
        });

        return {
            tooltipPosition,
            arrowPosition,
            spotlightDarkStyle,
            spotlightBrightStyle,
            spotlightGlowStyle,
            spotlightBorderStyle,
            tooltipStyle,
            arrowStyle,
            closeGuide,
        };
    },
};
</script>

<style scoped>
/* Overlay với spotlight effect */
.guide-tour-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
    z-index: 9998;
    cursor: pointer;
    pointer-events: auto;
    overflow: hidden;
    touch-action: none;
    -webkit-overflow-scrolling: none;
}

.spotlight-container {
    position: relative;
    width: 100%;
    height: 100%;
}

/* Dark overlay với cutout cho button */
.spotlight-dark {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(1.5px);
    pointer-events: none;
}

/* Bright highlight cho button area - chỉ làm sáng xung quanh, không che button */
.spotlight-bright {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle,
            transparent 0%,
            transparent 40%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.05) 70%,
            transparent 100%);
    pointer-events: none;
    animation: spotlightBright 2s ease-in-out infinite;
    box-shadow: 0 0 30px rgba(96, 165, 250, 0.3),
        0 0 60px rgba(96, 165, 250, 0.2);
    z-index: 1;
}

/* Glow ring around target */
.spotlight-glow {
    position: absolute;
    border-radius: 50%;
    border: 3px solid rgba(96, 165, 250, 0.6);
    pointer-events: none;
    animation: spotlightGlow 2s ease-in-out infinite;
    box-shadow: 0 0 20px rgba(96, 165, 250, 0.5),
        0 0 40px rgba(96, 165, 250, 0.3),
        inset 0 0 20px rgba(96, 165, 250, 0.2);
    z-index: 2;
}

/* Border highlight cho button - nhẹ nhàng hơn */
.spotlight-border {
    position: absolute;
    border-radius: 9999px;
    border: 2px solid rgba(96, 165, 250, 0.5);
    pointer-events: none;
    animation: spotlightBorder 2s ease-in-out infinite;
    box-shadow: 0 0 10px rgba(96, 165, 250, 0.4),
        0 0 20px rgba(96, 165, 250, 0.2);
    z-index: 3;
}

@keyframes spotlightBright {

    0%,
    100% {
        transform: scale(1);
        opacity: 0.6;
    }

    50% {
        transform: scale(1.08);
        opacity: 0.8;
    }
}

@keyframes spotlightGlow {

    0%,
    100% {
        transform: scale(1);
        opacity: 0.4;
        border-color: rgba(96, 165, 250, 0.4);
    }

    50% {
        transform: scale(1.08);
        opacity: 0.6;
        border-color: rgba(96, 165, 250, 0.6);
    }
}

@keyframes spotlightBorder {

    0%,
    100% {
        transform: scale(1);
        opacity: 0.5;
        border-color: rgba(96, 165, 250, 0.5);
    }

    50% {
        transform: scale(1.01);
        opacity: 0.7;
        border-color: rgba(96, 165, 250, 0.7);
    }
}

/* Tooltip */
.guide-tooltip {
    position: fixed;
    z-index: 10001;
    pointer-events: none;
}

.tooltip-content {
    background: #60a5fa;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3),
        0 0 0 2px rgba(255, 255, 255, 0.1);
    position: relative;
    animation: tooltipPulse 2s ease-in-out infinite;
}

.tooltip-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
}

.sparkle-icon {
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.sparkle-icon i {
    color: #ffffff;
    font-size: 16px;
}

.tooltip-title {
    color: white;
    font-size: 18px;
    font-weight: 700;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.tooltip-text {
    color: rgba(255, 255, 255, 0.95);
    font-size: 14px;
    line-height: 1.5;
    margin: 0;
}

.tooltip-text strong {
    color: #ffffff;
    font-weight: 700;
    background: rgba(255, 255, 255, 0.2);
    padding: 2px 6px;
    border-radius: 4px;
}

.tooltip-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 12px solid #60a5fa;
    filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3));
}

/* Animated Arrow */
.animated-arrow {
    position: absolute;
    z-index: 10001;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: arrowBounce 1.5s ease-in-out infinite;
}

.arrow-line {
    width: 2px;
    height: 40px;
    background: #60a5fa;
    margin-bottom: 5px;
    animation: arrowLinePulse 1.5s ease-in-out infinite;
    opacity: 0.6;
}

.arrow-icon {
    font-size: 24px;
    color: #60a5fa;
    filter: drop-shadow(0 2px 4px rgba(96, 165, 250, 0.4));
    animation: arrowIconShake 1s ease-in-out infinite;
}

/* Animations */
@keyframes tooltipPulse {

    0%,
    100% {
        transform: scale(1);
        box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3),
            0 0 0 2px rgba(255, 255, 255, 0.1);
    }

    50% {
        transform: scale(1.01);
        box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4),
            0 0 0 2px rgba(255, 255, 255, 0.15);
    }
}

@keyframes sparkleRotate {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@keyframes sparkleTwinkle {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.7;
        transform: scale(1.2);
    }
}

@keyframes arrowBounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

@keyframes arrowLinePulse {

    0%,
    100% {
        opacity: 0.6;
        height: 40px;
    }

    50% {
        opacity: 1;
        height: 50px;
    }
}

@keyframes arrowIconShake {

    0%,
    100% {
        transform: translateX(0) rotate(0deg);
    }

    25% {
        transform: translateX(-3px) rotate(-5deg);
    }

    75% {
        transform: translateX(3px) rotate(5deg);
    }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-fade-enter-active {
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
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

.bounce-enter-active {
    transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.bounce-leave-active {
    transition: all 0.3s ease;
}

.bounce-enter-from {
    opacity: 0;
    transform: translateX(20px) scale(0.8);
}

.bounce-leave-to {
    opacity: 0;
    transform: translateX(10px) scale(0.9);
}

/* Responsive */
@media (max-width: 640px) {
    .tooltip-content {
        padding: 16px;
        max-width: 280px;
    }

    .tooltip-title {
        font-size: 16px;
    }

    .tooltip-text {
        font-size: 13px;
    }

    .arrow-icon {
        font-size: 20px;
    }
}
</style>
