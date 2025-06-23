<!-- AdminView.vue - Enhanced single page admin dashboard with smooth scrolling -->
<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <!-- Sidebar Navigation -->
        <div class="fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 shadow-2xl transform transition-transform duration-300 ease-in-out"
            :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen, 'lg:translate-x-0': true }">

            <!-- Logo & Brand -->
            <div
                class="flex items-center justify-center h-20 px-6 border-b border-blue-700/50 bg-blue-200 backdrop-blur-sm">
                <div class="flex items-center">
                    <router-link to="/admin" class="font-semibold text-blue-400">
                        <div class="flex items-center">
                            <img src="@/assets/images/logo1.png" alt="Logo"
                                class="w-[6rem] h-[2.5rem] xl:w-[8rem] xl:h-[3rem] object-contain" />
                        </div>
                    </router-link>
                    <div>
                        <span class="text-xl font-bold text-blue-500">Admin</span>
                    </div>
                </div>
            </div>

            <!-- Navigation Menu -->
            <nav class="mt-8 px-6">
                <div class="space-y-2">
                    <!-- Dashboard -->
                    <button @click="scrollToSection('dashboard')"
                        class="w-full flex items-center px-5 py-4 text-white rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group cursor-pointer"
                        :class="{ 'bg-white/20 shadow-lg scale-105': activeSection === 'dashboard' }">
                        <div
                            class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-400 rounded-lg flex items-center justify-center mr-4 group-hover:rotate-6 transition-transform">
                            <i class="fas fa-tachometer-alt text-white"></i>
                        </div>
                        <div class="text-left">
                            <span class="font-semibold">Trang chủ</span>
                            <p class="text-xs text-blue-200 opacity-75">Tổng quan hệ thống</p>
                        </div>
                    </button>

                    <!-- Users Management -->
                    <button @click="scrollToSection('users')"
                        class="w-full flex items-center px-5 py-4 text-white rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group cursor-pointer"
                        :class="{ 'bg-white/20 shadow-lg scale-105': activeSection === 'users' }">
                        <div
                            class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center mr-4 group-hover:rotate-6 transition-transform">
                            <i class="fas fa-users text-white"></i>
                        </div>
                        <div class="text-left">
                            <span class="font-semibold">Quản lý người dùng</span>
                            <p class="text-xs text-blue-200 opacity-75">Tài khoản & quyền hạn</p>
                        </div>
                    </button>

                    <!-- Analytics -->
                    <button @click="scrollToSection('analytics')"
                        class="w-full flex items-center px-5 py-4 text-white rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group cursor-pointer"
                        :class="{ 'bg-white/20 shadow-lg scale-105': activeSection === 'analytics' }">
                        <div
                            class="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-600 rounded-lg flex items-center justify-center mr-4 group-hover:rotate-6 transition-transform">
                            <i class="fas fa-chart-bar text-white"></i>
                        </div>
                        <div class="text-left">
                            <span class="font-semibold">Thống kê</span>
                            <p class="text-xs text-blue-200 opacity-75">Báo cáo & phân tích</p>
                        </div>
                    </button>

                    <!-- Nút đến trang xem hệ thống -->
                    <button @click="goToPageUserSystem"
                        class="w-full flex items-center px-5 py-4 text-white rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group cursor-pointer">
                        <div
                            class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mr-4 group-hover:rotate-6 transition-transform">
                            <i class="fas fa-cogs text-white"></i>
                        </div>
                        <div class="text-left">
                            <span class="font-semibold">Hệ thống</span>
                            <p class="text-xs text-blue-200 opacity-75">Đi đến trang chủ hệ thống</p>
                        </div>
                    </button>

                    <!-- Settings -->
                </div>
            </nav>

            <!-- User Info & Logout -->
            <div
                class="absolute bottom-0 left-0 right-0 p-6 border-t border-blue-700/50 bg-gradient-to-r from-blue-900/80 to-blue-400/80 backdrop-blur-sm">
                <div class="flex items-center space-x-4 mb-4">
                    <div
                        class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                        A
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-white">Admin</p>
                        <p class="text-xs text-blue-200">buianhvu226@gmail.com</p>
                    </div>
                </div>
                <button @click="logout"
                    class="w-full flex items-center justify-center px-4 py-3 text-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <i class="fas fa-sign-out-alt w-4 h-4 mr-2"></i>
                    <span class="font-medium">Đăng xuất</span>
                </button>
            </div>
        </div>

        <!-- Mobile Overlay -->
        <div v-if="sidebarOpen" class="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity lg:hidden z-40"
            @click="sidebarOpen = false">
        </div>

        <!-- Main Content -->
        <div class="lg:pl-72">
            <!-- Top Header -->
            <header class="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-30 border-b border-gray-200/50">
                <div class="flex items-center justify-between px-8 py-3">
                    <div class="flex items-center space-x-4">
                        <!-- Mobile menu button -->
                        <button @click="sidebarOpen = !sidebarOpen"
                            class="text-gray-500 hover:text-gray-700 lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <i class="fas fa-bars text-xl"></i>
                        </button>

                        <div>
                            <h1
                                class="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
                                {{ currentSectionTitle }}
                            </h1>
                            <p class="text-sm text-gray-600 mt-1">{{ currentSectionDescription }}</p>
                        </div>
                    </div>

                    <!-- Header Actions -->
                    <div class="flex items-center space-x-4">

                        <!-- Profile dropdown -->
                        <div class="relative profile-dropdown">
                            <button @click="profileDropdown = !profileDropdown"
                                class="flex items-center space-x-3 p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
                                <div
                                    class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-400 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                                    A
                                </div>
                                <i class="fas fa-chevron-down text-xs"></i>
                            </button>

                            <!-- Dropdown menu -->
                            <div v-if="profileDropdown"
                                class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100">
                                <a href="#"
                                    class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    <i class="fas fa-user w-4 h-4 mr-3 text-gray-400"></i>
                                    Thông tin cá nhân
                                </a>
                                <a href="#"
                                    class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    <i class="fas fa-cog w-4 h-4 mr-3 text-gray-400"></i>
                                    Cài đặt tài khoản
                                </a>
                                <div class="border-t border-gray-100 my-2"></div>
                                <a @click="logout"
                                    class="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors">
                                    <i class="fas fa-sign-out-alt w-4 h-4 mr-3"></i>
                                    Đăng xuất
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Page Content with Sections -->
            <main class="relative">
                <!-- Dashboard Section -->
                <section id="dashboard" class="min-h-screen py-12 px-8">
                    <div class="max-w-7xl mx-auto">
                        <div class="text-center mb-16">
                            <h2
                                class="text-5xl font-bold bg-gradient-to-r from-blue-500 via-blue-400 to-pink-600 bg-clip-text text-transparent mb-6">
                                Kinnect - Admin
                            </h2>
                            <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Quản lý toàn bộ hệ thống một cách hiệu quả với giao diện hiện đại và trực quan
                            </p>
                        </div>

                        <!-- Action Cards -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div
                                class="bg-gradient-to-br from-blue-500 to-blue-400 rounded-3xl p-8 text-white relative overflow-hidden">
                                <div
                                    class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16">
                                </div>
                                <div class="relative z-10">
                                    <h3 class="text-2xl font-bold mb-4">Quản lý người dùng</h3>
                                    <p class="text-blue-100 mb-6">Xem và quản lý tất cả tài khoản người dùng trong hệ
                                        thống</p>
                                    <button @click="scrollToSection('users')"
                                        class="bg-white text-blue-500 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                                        Truy cập ngay
                                    </button>
                                </div>
                            </div>

                            <div
                                class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white relative overflow-hidden">
                                <div
                                    class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16">
                                </div>
                                <div class="relative z-10">
                                    <h3 class="text-2xl font-bold mb-4">Thống kê & Báo cáo</h3>
                                    <p class="text-emerald-100 mb-6">Xem báo cáo chi tiết và phân tích dữ liệu hệ thống
                                    </p>
                                    <button @click="scrollToSection('analytics')"
                                        class="bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors">
                                        Xem báo cáo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Users Management Section -->
                <section id="users" class="min-h-screen py-12 px-8 bg-gradient-to-br from-blue-50 to-blue-50">
                    <div class="max-w-7xl mx-auto">
                        <div class="text-center mb-12">
                            <h2 class="text-4xl font-bold text-gray-800 mb-4">Quản lý người dùng</h2>
                            <p class="text-lg text-gray-600">Quản lý tài khoản và quyền hạn người dùng</p>
                        </div>
                        <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
                            <UsersManagement />
                        </div>
                    </div>
                </section>

                <!-- Analytics Section -->
                <section id="analytics" class="min-h-screen py-12 px-8 bg-gradient-to-br from-blue-50 to-pink-50">
                    <div class="max-w-7xl mx-auto">
                        <div class="text-center mb-12">
                            <h2 class="text-4xl font-bold text-gray-800 mb-4">Thống kê & Phân tích</h2>
                            <p class="text-lg text-gray-600">Biểu đồ thống kê số lượng hồ sơ và cặp ghép đôi theo trạng
                                thái</p>
                        </div>
                        <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
                            <AdminAnalytics />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UsersManagement from '@/components/admin/UsersManagement.vue'
import AdminAnalytics from '@/components/admin/AdminAnalytics.vue'

export default {
    name: 'AdminView',
    components: {
        UsersManagement,
        AdminAnalytics
    },
    setup() {
        const route = useRoute()
        const router = useRouter()
        const sidebarOpen = ref(false)
        const profileDropdown = ref(false)
        const activeSection = ref('dashboard')

        // Mock data for stats
        const totalUsers = ref(7)
        const activeUsers = ref(7)

        const goToPageUserSystem = () => {
            router.push('/')
        }

        const currentSectionTitle = computed(() => {
            const titles = {
                'dashboard': 'Dashboard',
                'users': 'Quản lý người dùng',
                'analytics': 'Thống kê & Phân tích'
            }
            return titles[activeSection.value] || 'Admin Panel'
        })

        const currentSectionDescription = computed(() => {
            const descriptions = {
                'dashboard': 'Tổng quan hệ thống và thống kê chung',
                'users': 'Quản lý tài khoản và quyền hạn người dùng',
                'analytics': 'Báo cáo chi tiết và phân tích dữ liệu'
            }
            return descriptions[activeSection.value] || 'Bảng điều khiển quản trị'
        })

        const scrollToSection = (sectionId) => {
            const element = document.getElementById(sectionId)
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
                activeSection.value = sectionId
                // Close mobile sidebar after navigation
                if (window.innerWidth < 1024) {
                    sidebarOpen.value = false
                }
            }
        }

        // Không cho phép người dùng thao tác quay lại
        onMounted(() => {
            history.pushState(null, document.title, location.href)
            window.addEventListener('popstate', () => {
                history.pushState(null, document.title, location.href)
            })
        })

        const logout = async () => {
            try {

                // Xóa thông tin người dùng khỏi localStorage
                localStorage.removeItem('user');
                localStorage.removeItem('token');

                await store.dispatch('auth/logout');
            } catch (error) {
                console.error('Lỗi khi đăng xuất:', error);
            }

            router.push('/').then(() => {
                // Force reload page để clear tất cả state
                window.location.reload();
            });
        }

        // Handle click outside dropdown
        const handleClickOutside = (e) => {
            if (profileDropdown.value && !e.target.closest('.profile-dropdown')) {
                profileDropdown.value = false
            }
        }

        // Intersection Observer to track active section
        const setupIntersectionObserver = () => {
            const sections = ['dashboard', 'users', 'analytics']
            const options = {
                root: null,
                rootMargin: '-50% 0px -50% 0px',
                threshold: 0
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        activeSection.value = entry.target.id
                    }
                })
            }, options)

            sections.forEach(sectionId => {
                const element = document.getElementById(sectionId)
                if (element) {
                    observer.observe(element)
                }
            })

            return observer
        }

        let observer = null

        onMounted(() => {
            document.addEventListener('click', handleClickOutside)
            // Setup intersection observer after DOM is ready
            setTimeout(() => {
                observer = setupIntersectionObserver()
            }, 100)
        })

        onBeforeUnmount(() => {
            document.removeEventListener('click', handleClickOutside)
            if (observer) {
                observer.disconnect()
            }
        })

        return {
            sidebarOpen,
            profileDropdown,
            activeSection,
            currentSectionTitle,
            currentSectionDescription,
            totalUsers,
            activeUsers,
            scrollToSection,
            goToPageUserSystem,
            logout
        }
    }
}
</script>

<style scoped>
/* Smooth scrolling for the entire page */
html {
    scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #8b5cf6, #a855f7);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #7c3aed, #9333ea);
}

/* Section transitions */
section {
    transition: all 0.3s ease-in-out;
}

/* Profile dropdown positioning */
.profile-dropdown {
    position: relative;
}

/* Glass effect for header */
header {
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
}

/* Gradient text animation */
@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.bg-clip-text {
    background-size: 200% 200%;
    animation: gradient 3s ease infinite;
}
</style>