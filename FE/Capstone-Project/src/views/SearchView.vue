<template>
    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen pt-10">
        <div class="container mx-auto px-4 py-6">
            <!-- Hero section -->
            <div class="bg-white rounded-xl shadow-lg overflow-hidden p-5 mb-8 border border-blue-100">
                <div class="flex flex-col md:flex-row items-center">
                    <div class="flex-shrink-0 bg-blue-400 rounded-full p-3 mr-5 mb-4 md:mb-0 shadow-md">
                        <i class="fas fa-search text-white text-2xl"></i>
                    </div>
                    <div>
                        <h1 class="text-3xl font-bold text-gray-800 mb-2">Tìm kiếm hồ sơ nâng cao</h1>
                        <p class="text-gray-600">Nhập câu hỏi tìm kiếm bằng ngôn ngữ tự nhiên để tìm những hồ sơ phù
                            hợp.</p>
                    </div>
                </div>
            </div>

            <!-- Gợi ý tìm kiếm & Form -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <!-- Main search form -->
                <div class="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                    <form @submit.prevent="searchProfiles" class="space-y-4">
                        <div>
                            <label for="query" class="block text-sm font-medium text-gray-700 mb-1">Nhập nội dung tìm
                                kiếm</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i class="fas fa-search text-gray-400"></i>
                                </div>
                                <textarea id="query" v-model="searchQuery" rows="3"
                                    class="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Nhập câu hỏi của bạn (Ví dụ: Tôi muốn tìm những hồ sơ người thất lạc tên Hoàng)"
                                    required></textarea>
                            </div>
                        </div>

                        <div class="flex justify-end">
                            <button type="submit" :disabled="loading || !searchQuery.trim()"
                                class="px-6 py-3 bg-gradient-to-r from-blue-400 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 hover:shadow-lg flex items-center">
                                <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
                                <i v-else class="fas fa-search mr-2"></i>
                                <span>{{ loading ? 'Đang tìm kiếm...' : 'Tìm kiếm' }}</span>
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Lịch sử tìm kiếm -->
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                            <i class="fas fa-history text-blue-500 mr-2"></i>
                            Lịch sử tìm kiếm
                        </h3>
                        <button v-if="searchHistory.length > 0" @click="clearAllHistory"
                            class="text-xs text-red-500 hover:text-red-700">
                            <i class="fas fa-trash-alt mr-1"></i>
                            Xóa tất cả
                        </button>
                    </div>

                    <div v-if="searchHistory.length === 0" class="text-center py-8 text-gray-500">
                        <i class="fas fa-history text-gray-300 text-4xl mb-2"></i>
                        <p>Chưa có lịch sử tìm kiếm</p>
                    </div>

                    <div v-else class="space-y-3 max-h-96 overflow-y-auto pr-1">
                        <div v-for="(item, index) in searchHistory" :key="index"
                            class="bg-gray-50 hover:bg-blue-50 transition-colors p-3 rounded-lg border border-gray-200 relative group">
                            <p class="text-gray-800 pr-6 text-sm line-clamp-2">{{ item.query }}</p>
                            <div class="flex justify-between items-center mt-2">
                                <span class="text-xs text-gray-500">{{ formatDate(item.timestamp) }}</span>
                                <div class="flex space-x-2">
                                    <button @click="useHistoryQuery(item.query)"
                                        class="text-xs py-1 px-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                                        <i class="fas fa-redo-alt mr-1"></i>
                                        Tìm lại
                                    </button>
                                    <button @click="removeHistoryItem(index)"
                                        class="text-xs py-1 px-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Progress indicator -->
            <div v-if="showProgress && loading" ref="progressSection"
                class="bg-white rounded-xl shadow-lg p-6 mb-8 border border-blue-100 animate__animated animate__fadeIn">
                <div class="flex items-center mb-6">
                    <div class="bg-gradient-to-r from-blue-100 to-indigo-100 p-3 rounded-lg mr-4">
                        <i class="fas fa-cogs text-blue-400 text-2xl animate-spin"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-semibold text-gray-800">Đang xử lý tìm kiếm</h3>
                        <p class="text-sm text-gray-600">Hệ thống đang phân tích và tìm kiếm các hồ sơ phù hợp</p>
                    </div>
                </div>

                <!-- Overall Progress bar -->
                <div v-if="totalSteps > 0" class="mb-6">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm font-medium text-gray-700">Tiến độ tổng thể</span>
                        <span class="text-sm font-semibold text-blue-400">{{ Math.round((progressStep / totalSteps) *
                            100) }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div class="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 h-3 rounded-full transition-all duration-1000 ease-out"
                            :style="{ width: (progressStep / totalSteps) * 100 + '%' }">
                            <div class="w-full h-full bg-gradient-to-r from-white/30 to-transparent animate-pulse">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Progress Steps Log -->
                <div class="space-y-3 max-h-80 overflow-y-auto">
                    <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <i class="fas fa-list-ul mr-2 text-indigo-500"></i>
                        Quá trình xử lý
                    </h4>

                    <div class="space-y-2">
                        <div v-for="(log, index) in progressLogs" :key="index"
                            class="flex items-start p-3 rounded-lg transition-all duration-500" :class="[
                                index === progressLogs.length - 1
                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 transform scale-105'
                                    : 'bg-gray-50 border-l-4 border-gray-300'
                            ]">
                            <!-- Status Icon -->
                            <div class="flex-shrink-0 mt-0.5">
                                <div class="w-6 h-6 rounded-full flex items-center justify-center" :class="[
                                    index === progressLogs.length - 1
                                        ? 'bg-blue-500 animate-pulse'
                                        : log.completed
                                            ? 'bg-green-500'
                                            : 'bg-gray-400'
                                ]">
                                    <i v-if="index === progressLogs.length - 1 && !log.completed"
                                        class="fas fa-spinner fa-spin text-white text-xs"></i>
                                    <i v-else-if="log.completed" class="fas fa-check text-white text-xs"></i>
                                    <i v-else class="fas fa-circle text-white text-xs"></i>
                                </div>
                            </div>

                            <!-- Content -->
                            <div class="ml-3 flex-1">
                                <div class="flex items-center justify-between">
                                    <p class="text-sm font-medium"
                                        :class="index === progressLogs.length - 1 ? 'text-blue-700' : 'text-gray-700'">
                                        {{ log.message }}
                                    </p>
                                    <span class="text-xs text-gray-500">{{ log.timestamp }}</span>
                                </div>

                                <!-- Sub-progress for current step -->
                                <div v-if="index === progressLogs.length - 1 && log.subProgress" class="mt-2">
                                    <div class="w-full bg-blue-200 rounded-full h-1">
                                        <div class="bg-blue-500 h-1 rounded-full transition-all duration-500"
                                            :style="{ width: log.subProgress + '%' }"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Current Status Message -->
                <div class="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-lg">
                    <div class="flex items-center">
                        <div class="w-2 h-2 bg-blue-500 rounded-full animate-ping mr-3"></div>
                        <p class="text-blue-700 text-sm font-medium flex items-center">
                            <i class="fas fa-info-circle mr-2"></i>
                            {{ currentProgressMessage }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Gợi ý tìm kiếm mở rộng -->
            <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div class="flex items-center mb-3">
                    <i class="fas fa-lightbulb text-yellow-500 mr-2 text-xl"></i>
                    <h2 class="text-lg font-semibold text-gray-800">Gợi ý tìm kiếm</h2>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div v-for="(suggestion, index) in searchSuggestions" :key="index"
                        class="bg-blue-50 rounded-lg p-3 border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
                        @click="useHistoryQuery(suggestion)">
                        <p class="text-sm text-gray-700">{{ suggestion }}</p>
                    </div>
                </div>
            </div>

            <!-- Thông báo đăng nhập nếu cần thiết -->
            <div v-if="requiresAuth && !isAuthenticated" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <i class="fas fa-exclamation-triangle text-yellow-400"></i>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-yellow-700">
                            Bạn cần đăng nhập để sử dụng tính năng tìm kiếm nâng cao
                        </p>
                        <div class="mt-2">
                            <router-link :to="{ name: 'auth' }"
                                class="text-sm font-medium text-yellow-700 hover:text-yellow-600 underline">
                                Đăng nhập ngay
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Kết quả tìm kiếm -->
            <div v-if="hasSearched">
                <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <i class="fas fa-exclamation-circle text-red-500"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-red-700">{{ error }}</p>
                            <div v-if="errorCode === 401" class="mt-2">
                                <router-link :to="{ name: 'auth' }"
                                    class="text-sm font-medium text-red-700 hover:text-red-600 underline">
                                    Đăng nhập để tiếp tục
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else-if="loading && !showProgress" class="flex justify-center items-center py-16">
                    <div class="animate__animated animate__pulse animate__infinite flex flex-col items-center">
                        <div class="rounded-full bg-blue-200 h-16 w-16 flex items-center justify-center mb-3">
                            <i class="fas fa-search text-blue-500 text-2xl"></i>
                        </div>
                        <div class="h-4 bg-blue-200 rounded w-36 mb-2"></div>
                        <div class="h-3 bg-blue-100 rounded w-24"></div>
                    </div>
                </div>

                <div v-else-if="searchResults.length === 0" class="bg-white rounded-xl shadow-md p-8 text-center">
                    <div class="inline-block p-4 bg-gray-100 rounded-full mb-4">
                        <i class="fas fa-search text-gray-400 text-3xl"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy kết quả nào</h3>
                    <p class="text-gray-600 mb-4">Thử sử dụng các từ khóa khác hoặc điều chỉnh truy vấn của bạn</p>
                    <div class="mt-6 bg-blue-50 rounded-lg p-4 text-left">
                        <p class="text-sm text-gray-700 font-medium mb-2">Gợi ý:</p>
                        <ul class="list-disc pl-5 text-sm text-gray-600 space-y-1">
                            <li>Sử dụng từ khóa cụ thể (tên, địa điểm, thời gian)</li>
                            <li>Kiểm tra lỗi chính tả</li>
                            <li>Thử với cách diễn đạt khác</li>
                        </ul>
                    </div>
                </div>

                <div v-else>
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold text-gray-800">Kết quả tìm kiếm ({{ searchResults.length }})</h2>
                        <button @click="clearSearch"
                            class="text-blue-400 hover:text-blue-800 flex items-center text-sm">
                            <i class="fas fa-times mr-1"></i> Xóa kết quả
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div v-for="profile in searchResults" :key="profile.id"
                            class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <div class="p-5 border-b border-gray-100">
                                <div class="flex justify-between items-start mb-3">
                                    <h3
                                        class="font-semibold text-blue-700 text-lg line-clamp-2 hover:text-blue-800 transition-colors">
                                        {{ profile.title }}
                                    </h3>
                                    <span
                                        class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                                        ID: {{ profile.id }}
                                    </span>
                                </div>

                                <div class="space-y-2 mb-4">
                                    <div v-if="profile.full_name" class="flex items-start">
                                        <i class="fas fa-user text-gray-400 mt-0.5 w-5"></i>
                                        <span class="ml-2 text-gray-700">{{ profile.full_name }}</span>
                                    </div>
                                    <div v-if="profile.born_year" class="flex items-start">
                                        <i class="fas fa-birthday-cake text-gray-400 mt-0.5 w-5"></i>
                                        <span class="ml-2 text-gray-700">Sinh: {{ profile.born_year }}</span>
                                    </div>
                                    <div v-if="profile.losing_year" class="flex items-start">
                                        <i class="fas fa-calendar-minus text-gray-400 mt-0.5 w-5"></i>
                                        <span class="ml-2 text-gray-700">Mất tích: {{ profile.losing_year }}</span>
                                    </div>
                                </div>

                                <div class="bg-gray-50 p-3 rounded-lg mb-4">
                                    <p class="text-gray-600 line-clamp-3 text-sm">{{ profile.detail ||
                                        profile.description }}</p>
                                </div>

                                <div class="flex justify-between items-center">
                                    <div class="flex flex-wrap gap-1">
                                        <span v-if="profile.name_of_father"
                                            class="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded">
                                            Cha: {{ truncateText(profile.name_of_father, 10) }}
                                        </span>
                                        <span v-if="profile.name_of_mother"
                                            class="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                                            Mẹ: {{ truncateText(profile.name_of_mother, 10) }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-gray-50 p-3 flex justify-between items-center">
                                <span class="text-xs text-gray-500 flex items-center">
                                    <i class="fas fa-users text-gray-400 mr-1"></i>
                                    {{ profile.siblings ? truncateText(profile.siblings, 20) : 'Không có thông tin' }}
                                </span>
                                <router-link v-if="profile.id"
                                    :to="{ name: 'profile-detail', params: { id: profile.id } }"
                                    class="text-sm font-medium text-blue-400 hover:text-blue-800 transition-colors flex items-center">
                                    Chi tiết
                                    <i class="fas fa-arrow-right ml-1"></i>
                                </router-link>
                                <span v-else class="text-sm text-gray-400">
                                    Không có chi tiết
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import searchService from '../services/searchService'
import { useRouter, useRoute } from 'vue-router'

export default {
    name: 'SearchView',
    setup() {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()

        const searchQuery = ref('')
        const searchResults = ref([])
        const loading = ref(false)
        const error = ref(null)
        const errorCode = ref(null)
        const hasSearched = ref(false)
        const requiresAuth = ref(false)
        const progressPercentage = ref(0)
        const progressTimer = ref(null)
        const searchHistory = ref([])
        const showProgress = ref(false)
        const progressLogs = ref([])
        const currentProgressMessage = ref('')
        const progressStep = ref(0)
        const totalSteps = ref(4)
        const progressSection = ref(null)

        const searchSuggestions = [
            "Tôi muốn tìm những người thất lạc ở Huế vào năm 1975",
            "Tìm hồ sơ người có tên Nguyễn Văn An sinh năm 1980",
            "Tìm kiếm người mất tích ở Hà Nội năm 2010",
            "Đang tìm con gái bị thất lạc từ nhỏ quê ở Quảng Nam",
            "Tìm kiếm anh trai tên Lê Minh, sinh năm 1985",
            "Tìm người có cha tên Trần Văn Đức và mẹ tên Lê Thị Hoa",
            "Mất tích trong trận lũ năm 1999 ở miền Trung",
            "Tìm cậu con trai Phạm Tuấn bị thất lạc khi 5 tuổi",
            "Tìm người có đặc điểm sẹo ở cánh tay phải",
        ]

        const isAuthenticated = computed(() => {
            return localStorage.getItem('token') !== null
        })

        const progressNotifications = computed(() => {
            const notifications = store.getters['notifications/searchNotifications'] ||
                store.state.notifications.notifications || []
            console.log('Computed progressNotifications:', notifications)
            return notifications
        })

        const formatDate = (timestamp) => {
            const date = new Date(timestamp)
            return new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date)
        }

        const formatTimestamp = () => {
            return new Date().toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        }

        const addProgressLog = (message, completed = false, subProgress = null) => {
            progressLogs.value.push({
                message,
                completed,
                subProgress,
                timestamp: formatTimestamp()
            })
            setTimeout(() => {
                if (progressSection.value) {
                    const logContainer = progressSection.value.querySelector('.overflow-y-auto')
                    if (logContainer) {
                        logContainer.scrollTop = logContainer.scrollHeight
                    }
                }
            }, 100)
        }

        const scrollToProgress = () => {
            setTimeout(() => {
                if (progressSection.value) {
                    progressSection.value.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    })
                }
            }, 300)
        }

        const startProgressTimer = () => {
            progressPercentage.value = 0
            if (progressTimer.value) {
                clearInterval(progressTimer.value)
            }
            progressTimer.value = setInterval(() => {
                if (progressPercentage.value < 90) {
                    const increment = (95 - progressPercentage.value) / 10
                    progressPercentage.value += increment > 0.5 ? increment : 0.5
                }
            }, 300)
        }

        const stopProgressTimer = () => {
            if (progressTimer.value) {
                clearInterval(progressTimer.value)
                progressTimer.value = null
            }
            progressPercentage.value = 100
            setTimeout(() => {
                progressPercentage.value = 0
            }, 500)
        }

        const saveSearchState = () => {
            const searchState = {
                query: searchQuery.value,
                results: searchResults.value,
                hasSearched: hasSearched.value,
                timestamp: new Date().getTime()
            }
            localStorage.setItem('searchState', JSON.stringify(searchState))

            router.replace({
                query: {
                    ...route.query,
                    q: searchQuery.value
                }
            })

            if (searchQuery.value.trim()) {
                const historyItem = {
                    query: searchQuery.value,
                    timestamp: new Date().getTime(),
                    resultCount: searchResults.value.length
                }
                const existingIndex = searchHistory.value.findIndex(item => item.query === searchQuery.value)
                if (existingIndex >= 0) {
                    searchHistory.value.splice(existingIndex, 1)
                }
                searchHistory.value.unshift(historyItem)
                if (searchHistory.value.length > 10) {
                    searchHistory.value = searchHistory.value.slice(0, 10)
                }
                localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
            }
        }

        const loadSearchState = () => {
            const historyJson = localStorage.getItem('searchHistory')
            if (historyJson) {
                try {
                    searchHistory.value = JSON.parse(historyJson)
                } catch (e) {
                    console.error('Error loading search history:', e)
                    localStorage.removeItem('searchHistory')
                }
            }
            const searchStateJson = localStorage.getItem('searchState')
            if (searchStateJson) {
                try {
                    const searchState = JSON.parse(searchStateJson)
                    const isValid = (new Date().getTime() - searchState.timestamp) < 24 * 60 * 60 * 1000
                    if (isValid) {
                        searchQuery.value = searchState.query
                        searchResults.value = searchState.results
                        hasSearched.value = searchState.hasSearched
                        if (route.query.q && route.query.q !== searchQuery.value) {
                            searchQuery.value = route.query.q
                            searchProfiles()
                        }
                    } else {
                        localStorage.removeItem('searchState')
                    }
                } catch (e) {
                    console.error('Error loading search state:', e)
                    localStorage.removeItem('searchState')
                }
            } else if (route.query.q) {
                searchQuery.value = route.query.q
                searchProfiles()
            }
        }

        const searchProfiles = async () => {
            if (!searchQuery.value.trim()) return

            loading.value = true
            error.value = null
            errorCode.value = null
            hasSearched.value = true
            searchResults.value = []
            showProgress.value = true
            progressLogs.value = []
            currentProgressMessage.value = 'Khởi tạo quá trình tìm kiếm...'
            progressStep.value = 0
            totalSteps.value = 4

            addProgressLog('🚀 Khởi tạo tìm kiếm hồ sơ')
            scrollToProgress()

            startProgressTimer()

            try {
                addProgressLog('🔍 Đang xác thực truy vấn tìm kiếm...', false)
                currentProgressMessage.value = 'Đang kiểm tra truy vấn...'
                progressStep.value = 1
                await new Promise(resolve => setTimeout(resolve, 500))

                addProgressLog('🧠 Đang phân tích câu hỏi tìm kiếm...', true)
                currentProgressMessage.value = 'Hệ thống đang phân tích truy vấn...'
                progressStep.value = 2
                await new Promise(resolve => setTimeout(resolve, 500))

                addProgressLog('📡 Đang gửi yêu cầu tìm kiếm đến server...', false)
                currentProgressMessage.value = 'Đang thu thập dữ liệu...'
                progressStep.value = 3

                const response = await searchService.searchProfiles(searchQuery.value)
                console.log('Search API Response:', response) // Debug log

                addProgressLog('✅ Hoàn tất tìm kiếm và nhận kết quả!', true)
                currentProgressMessage.value = 'Đã hoàn thành tìm kiếm!'
                progressStep.value = 4

                if (response.data && response.data.results) {
                    searchResults.value = response.data.results
                } else if (Array.isArray(response.data)) {
                    searchResults.value = response.data
                } else {
                    searchResults.value = []
                }

                saveSearchState()

            } catch (err) {
                addProgressLog('❌ Lỗi: ' + (err.response?.data?.detail || 'Có lỗi xảy ra'), false)
                console.error('Search error:', err)
                error.value = err.response?.data?.detail || 'Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.'
                errorCode.value = err.response?.status

                if (err.response?.status === 401) {
                    requiresAuth.value = true
                    error.value = 'Bạn cần đăng nhập để sử dụng tính năng tìm kiếm nâng cao'
                }
            } finally {
                stopProgressTimer()
                loading.value = false
                setTimeout(() => {
                    showProgress.value = false
                }, 2000)
            }
        }

        const clearSearch = () => {
            searchResults.value = []
            searchQuery.value = ''
            hasSearched.value = false
            error.value = null
            errorCode.value = null
            requiresAuth.value = false
            showProgress.value = false
            progressLogs.value = []
            localStorage.removeItem('searchState')
            router.replace({ query: {} })
        }

        const truncateText = (text, maxLength) => {
            if (!text) return ''
            return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
        }

        const useHistoryQuery = (query) => {
            searchQuery.value = query
            searchProfiles()
        }

        const removeHistoryItem = (index) => {
            searchHistory.value.splice(index, 1)
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
        }

        const clearAllHistory = () => {
            searchHistory.value = []
            localStorage.removeItem('searchHistory')
        }

        watch(() => route.query.q, (newQuery) => {
            if (newQuery && newQuery !== searchQuery.value) {
                searchQuery.value = newQuery
                searchProfiles()
            }
        })

        watch(progressNotifications, (newNotifications) => {
            console.log('Progress Notifications Changed:', newNotifications) // Debug log
            if (newNotifications && newNotifications.length > 0 && loading.value) {
                // Lấy thông báo mới nhất
                const latestNotification = newNotifications[0]
                console.log('Latest notification:', latestNotification) // Debug log

                // Kiểm tra xem có phải là thông báo search không
                if (latestNotification.type === 'search_progress' ||
                    latestNotification.type === 'profile_creating' ||
                    latestNotification.content.includes('tìm kiếm') ||
                    latestNotification.content.includes('Đang')) {

                    // Thêm log mới vào progress
                    addProgressLog('📡 ' + latestNotification.content)
                    currentProgressMessage.value = latestNotification.content

                    // Cập nhật progress step nếu có thông tin bổ sung
                    if (latestNotification.additional_data) {
                        if (latestNotification.additional_data.current_step) {
                            progressStep.value = latestNotification.additional_data.current_step
                        }
                        if (latestNotification.additional_data.total_steps) {
                            totalSteps.value = latestNotification.additional_data.total_steps
                        }

                        // Cập nhật sub-progress cho log hiện tại
                        if (progressLogs.value.length > 0) {
                            const lastLog = progressLogs.value[progressLogs.value.length - 1]
                            if (!lastLog.completed) {
                                lastLog.subProgress = Math.round((progressStep.value / totalSteps.value) * 100)
                            }
                        }
                    }
                }
            }
        }, { deep: true, immediate: true })

        // Thêm một watcher riêng để theo dõi tất cả notifications
        watch(() => store.state.notifications.notifications, (newNotifications) => {
            console.log('All Notifications Updated:', newNotifications)
            if (loading.value && newNotifications && newNotifications.length > 0) {
                // Lọc các thông báo liên quan đến search trong 30 giây gần đây
                const recentSearchNotifications = newNotifications.filter(notification => {
                    const notificationTime = new Date(notification.created_at).getTime()
                    const now = new Date().getTime()
                    const isRecent = (now - notificationTime) < 30000 // 30 giây

                    const isSearchRelated = notification.type === 'search_progress' ||
                        notification.type === 'profile_creating' ||
                        notification.content.includes('tìm kiếm') ||
                        notification.content.includes('Đang') ||
                        notification.content.includes('từ khóa') ||
                        notification.content.includes('Gemini')

                    return isRecent && isSearchRelated
                })

                if (recentSearchNotifications.length > 0) {
                    const latestNotification = recentSearchNotifications[0]
                    console.log('Processing search notification:', latestNotification)

                    // Kiểm tra xem đã thêm notification này chưa
                    const existingLog = progressLogs.value.find(log =>
                        log.message.includes(latestNotification.content.substring(0, 20))
                    )

                    if (!existingLog) {
                        addProgressLog('🔄 ' + latestNotification.content)
                        currentProgressMessage.value = latestNotification.content

                        // Cập nhật progress dựa trên nội dung
                        if (latestNotification.content.includes('từ khóa')) {
                            progressStep.value = Math.max(progressStep.value, 2)
                        } else if (latestNotification.content.includes('Gemini')) {
                            progressStep.value = Math.max(progressStep.value, 3)
                        }
                    }
                }
            }
        }, { deep: true, immediate: true })

        onMounted(() => {
            loadSearchState()
            if (!store.state.notifications.subscribed) {
                console.log('Subscribing to notifications...')
                store.dispatch('notifications/subscribeToNotifications')
            }
        })

        return {
            searchQuery,
            searchResults,
            loading,
            error,
            errorCode,
            hasSearched,
            requiresAuth,
            isAuthenticated,
            progressPercentage,
            searchHistory,
            searchSuggestions,
            searchProfiles,
            clearSearch,
            truncateText,
            formatDate,
            useHistoryQuery,
            removeHistoryItem,
            clearAllHistory,
            showProgress,
            progressLogs,
            currentProgressMessage,
            progressStep,
            totalSteps,
            progressSection,
            addProgressLog,
            scrollToProgress,
            formatTimestamp
        }
    }
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.animate__animated {
    animation-duration: 1s;
    animation-fill-mode: both;
}

.animate__fadeIn {
    animation-name: fadeIn;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>