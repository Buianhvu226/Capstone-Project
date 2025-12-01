<template>
    <div class="min-h-screen bg-slate-50 pt-16">
        <AppHeader />
        <div class="container mx-auto px-3 sm:px-4 py-3 sm:py-4 max-w-7xl">
            <SearchHero :show-guide-tour="showGuideTour" @open-guide="startGuideTour" />

            <!-- Guide Tour -->
            <SearchGuideTour v-if="showGuideTour" :is-active="showGuideTour" @close="closeGuideTour" />

            <!-- Main Content Grid - Compact Layout -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-3">
                <SearchForm class="lg:col-span-8" :search-query="searchQuery" :loading="loading"
                    :has-searched="hasSearched" :max-length="500" @update:search-query="(val) => (searchQuery = val)"
                    @submit="searchProfiles" @clear="clearSearch" />
                <SearchHistory class="lg:col-span-4" :history="searchHistory" @clear="clearAllHistory"
                    @view-results="loadHistoryResults" @search-again="useHistoryQuery" @remove="removeHistoryItem" />
            </div>

            <SearchSuggestions :suggestions="searchSuggestions" :displayed-suggestions="displayedSuggestions"
                :show-all="showAllSuggestions" @toggle-show-all="showAllSuggestions = !showAllSuggestions"
                @use-suggestion="useHistoryQuery" />

            <div ref="progressSection">
                <SearchProgressPanel :show="showProgress" :loading="loading" :progress-logs="progressLogs"
                    :current-message="currentProgressMessage" :progress-step="progressStep" :total-steps="totalSteps"
                    :progress-completed="progressCompleted" @clear-logs="clearProgressLogs" />
            </div>

            <!-- Thông báo đăng nhập - Compact -->
            <div v-if="requiresAuth && !isAuthenticated" class="bg-yellow-50 p-2.5 mb-3 rounded-lg">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <i class="fas fa-exclamation-triangle text-yellow-500 text-sm"></i>
                    </div>
                    <div class="ml-2 flex-1">
                        <p class="text-xs text-yellow-700">
                            Bạn cần đăng nhập để sử dụng tính năng tìm kiếm nâng cao
                        </p>
                        <div class="mt-1.5">
                            <router-link :to="{ name: 'auth' }"
                                class="text-xs font-medium text-yellow-700 hover:text-yellow-600 underline">
                                Đăng nhập ngay
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>

            <SearchResults :has-searched="hasSearched" :error="error" :error-code="errorCode" :loading="loading"
                :show-progress="showProgress" :results="searchResults" @clear-results="clearSearch" />
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import searchService from '../services/searchService';
import { useRouter, useRoute } from 'vue-router';
import AppHeader from '../components/common/AppHeader.vue';
import SearchGuideTour from '../components/search/SearchGuideTour.vue';
import SearchHero from '../components/search/SearchHero.vue';
import SearchForm from '../components/search/SearchForm.vue';
import SearchHistory from '../components/search/SearchHistory.vue';
import SearchSuggestions from '../components/search/SearchSuggestions.vue';
import SearchProgressPanel from '../components/search/SearchProgressPanel.vue';
import SearchResults from '../components/search/SearchResults.vue';
import supabase from '../utils/supabase';

export default {
    name: 'SearchView',
    components: {
        AppHeader,
        SearchGuideTour,
        SearchHero,
        SearchForm,
        SearchHistory,
        SearchSuggestions,
        SearchProgressPanel,
        SearchResults,
    },
    setup() {
        const store = useStore();
        const router = useRouter();
        const route = useRoute();

        const searchQuery = ref('');
        const searchResults = ref([]);
        const loading = ref(false);
        const error = ref(null);
        const errorCode = ref(null);
        const hasSearched = ref(false);
        const requiresAuth = ref(false);
        const searchHistory = ref([]);
        const showProgress = ref(false);
        const progressLogs = ref([]);
        const currentProgressMessage = ref('');
        const progressStep = ref(0);
        const totalSteps = ref(4);
        const progressSection = ref(null);
        const showGuideTour = ref(false);
        const showAllSuggestions = ref(false);
        const processedNotificationIds = ref(new Set());
        const activeSearchStartTime = ref(null);
        const progressCompleted = ref(false);
        const realtimeNotificationIds = ref([]);

        const PENDING_REALTIME_IDS_KEY = 'pendingRealtimeNotificationIds';

        const searchSuggestions = [
            'Tìm người tên Nguyễn Văn A, sinh năm 1975, thất lạc ở Huế',
            'Tìm hồ sơ người có tên Nguyễn Văn An sinh năm 1980',
            'Tìm kiếm người mất tích ở Hà Nội năm 2010',
            'Đang tìm con gái bị thất lạc từ nhỏ quê ở Quảng Nam',
            'Tìm kiếm anh trai tên Lê Minh, sinh năm 1985',
            'Tìm người có cha tên Trần Văn Đức và mẹ tên Lê Thị Hoa',
        ];

        const displayedSuggestions = computed(() => {
            if (showAllSuggestions.value || searchSuggestions.length <= 6) {
                return searchSuggestions;
            }
            return searchSuggestions.slice(0, 6);
        });

        const queuePendingRealtimeIds = (ids) => {
            if (!ids || !ids.length) return;
            try {
                const existingRaw = localStorage.getItem(PENDING_REALTIME_IDS_KEY);
                const existing = existingRaw ? JSON.parse(existingRaw) : [];
                const merged = Array.from(new Set([...(Array.isArray(existing) ? existing : []), ...ids]));
                localStorage.setItem(PENDING_REALTIME_IDS_KEY, JSON.stringify(merged));
            } catch (error) {
                console.error('Không thể lưu danh sách realtime notification pending:', error);
            }
        };

        const deletePendingRealtimeNotifications = async () => {
            try {
                const raw = localStorage.getItem(PENDING_REALTIME_IDS_KEY);
                if (!raw) return;
                const pendingIds = JSON.parse(raw);
                if (!Array.isArray(pendingIds) || pendingIds.length === 0) {
                    localStorage.removeItem(PENDING_REALTIME_IDS_KEY);
                    return;
                }
                await supabase.from('notifications_notification').delete().in('id', pendingIds);
                localStorage.removeItem(PENDING_REALTIME_IDS_KEY);
            } catch (error) {
                console.error('Không thể xóa realtime notifications pending:', error);
            }
        };

        const deleteRealtimeNotifications = async (ids) => {
            if (!ids || !ids.length) return;
            try {
                await supabase.from('notifications_notification').delete().in('id', ids);
            } catch (error) {
                console.error('Không thể xóa realtime notifications:', error);
                queuePendingRealtimeIds(ids);
            }
        };

        const profileRealtimeNotifications = computed(
            () => store.getters['notifications/profileCreatingNotifications'] || []
        );

        const isAuthenticated = computed(() => {
            return localStorage.getItem('token') !== null;
        });

        const formatDate = (timestamp) => {
            const date = new Date(timestamp);
            return new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }).format(date);
        };

        const formatTimestamp = () => {
            return new Date().toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
        };

        const addProgressLog = (message, completed = false, subProgress = null) => {
            progressLogs.value.push({
                message,
                completed,
                subProgress,
                timestamp: formatTimestamp(),
            });
            setTimeout(() => {
                if (progressSection.value) {
                    const logContainer = progressSection.value.querySelector('.overflow-y-auto');
                    if (logContainer) {
                        logContainer.scrollTop = logContainer.scrollHeight;
                    }
                }
            }, 100);
        };

        const scrollToProgress = () => {
            setTimeout(() => {
                if (progressSection.value) {
                    progressSection.value.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                }
            }, 300);
        };

        const saveSearchState = () => {
            router.replace({
                query: {
                    ...route.query,
                    q: searchQuery.value,
                },
            });

            if (searchQuery.value.trim()) {
                const historyItem = {
                    query: searchQuery.value,
                    results: [...searchResults.value],
                    resultCount: searchResults.value.length,
                    timestamp: new Date().getTime(),
                    hasSearched: true,
                };

                // Kiểm tra xem đã có query giống hệt trong vòng 60s không
                const existingIndex = searchHistory.value.findIndex(
                    (item) =>
                        item.query === searchQuery.value &&
                        Math.abs(item.timestamp - historyItem.timestamp) < 60 * 1000
                );

                if (existingIndex >= 0) {
                    searchHistory.value[existingIndex] = historyItem;
                } else {
                    searchHistory.value.unshift(historyItem);
                }

                if (searchHistory.value.length > 50) {
                    searchHistory.value = searchHistory.value.slice(0, 50);
                }

                localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));
            }
        };

        const loadSearchState = () => {
            const historyJson = localStorage.getItem('searchHistory');
            if (historyJson) {
                try {
                    const history = JSON.parse(historyJson);
                    const thirtyDaysAgo = new Date().getTime() - 30 * 24 * 60 * 60 * 1000;
                    searchHistory.value = history.filter((item) => item.timestamp && item.timestamp > thirtyDaysAgo);

                    if (searchHistory.value.length !== history.length) {
                        localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));
                    }
                } catch (e) {
                    console.error('Error loading search history:', e);
                    localStorage.removeItem('searchHistory');
                    searchHistory.value = [];
                }
            }

            if (route.query.q) {
                searchQuery.value = route.query.q;
                const historyItem = searchHistory.value.find((item) => item.query === route.query.q);
                if (historyItem && historyItem.results) {
                    loadHistoryResults(historyItem);
                    return;
                }
                searchProfiles();
            }

            const hasSeenGuide = localStorage.getItem('hasSeenSearchGuide');
            if (!hasSeenGuide) {
                setTimeout(() => {
                    startGuideTour();
                }, 1000);
            }
        };

        const loadHistoryResults = (historyItem) => {
            if (historyItem && historyItem.results) {
                searchQuery.value = historyItem.query;
                searchResults.value = historyItem.results;
                hasSearched.value = true;
                // Scroll lên đầu trang để xem kết quả
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        const searchProfiles = async () => {
            if (!searchQuery.value.trim()) return;

            // Giới hạn độ dài
            if (searchQuery.value.length > 500) {
                searchQuery.value = searchQuery.value.substring(0, 500);
            }

            loading.value = true;
            error.value = null;
            errorCode.value = null;
            hasSearched.value = true;
            searchResults.value = [];
            showProgress.value = true;
            processedNotificationIds.value = new Set();
            activeSearchStartTime.value = Date.now();
            realtimeNotificationIds.value = [];
            progressLogs.value = [];
            currentProgressMessage.value = 'Khởi tạo quá trình tìm kiếm...';
            progressStep.value = 0;
            totalSteps.value = 4;
            progressCompleted.value = false;

            addProgressLog('🚀 Khởi tạo tìm kiếm hồ sơ');
            scrollToProgress();

            try {
                addProgressLog('🔍 Đang xác thực truy vấn tìm kiếm...', false);
                currentProgressMessage.value = 'Đang kiểm tra truy vấn...';
                progressStep.value = 1;
                await new Promise((resolve) => setTimeout(resolve, 500));

                addProgressLog('🧠 Đang phân tích câu hỏi tìm kiếm...', true);
                currentProgressMessage.value = 'Hệ thống đang phân tích truy vấn...';
                progressStep.value = 2;
                await new Promise((resolve) => setTimeout(resolve, 500));

                addProgressLog('📡 Đang gửi yêu cầu tìm kiếm đến server...', false);
                currentProgressMessage.value = 'Đang thu thập dữ liệu...';
                progressStep.value = 3;

                const response = await searchService.searchProfiles(searchQuery.value);
                console.log('Search API Response:', response);

                addProgressLog('✅ Hoàn tất tìm kiếm và nhận kết quả!', true);
                currentProgressMessage.value = 'Đã hoàn thành tìm kiếm!';
                progressStep.value = 4;
                progressCompleted.value = true;

                if (response.data && response.data.results) {
                    searchResults.value = response.data.results;
                } else if (Array.isArray(response.data)) {
                    searchResults.value = response.data;
                } else {
                    searchResults.value = [];
                }

                saveSearchState();
            } catch (err) {
                addProgressLog('❌ Lỗi: ' + (err.response?.data?.detail || 'Có lỗi xảy ra'), false);
                console.error('Search error:', err);
                error.value = err.response?.data?.detail || 'Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.';
                errorCode.value = err.response?.status;

                if (err.response?.status === 401) {
                    requiresAuth.value = true;
                    error.value = 'Bạn cần đăng nhập để sử dụng tính năng tìm kiếm nâng cao';
                }
            } finally {
                loading.value = false;
            }
        };

        const clearSearch = () => {
            searchResults.value = [];
            searchQuery.value = '';
            hasSearched.value = false;
            error.value = null;
            errorCode.value = null;
            requiresAuth.value = false;
            showProgress.value = false;
            progressLogs.value = [];
            progressCompleted.value = false;
            router.replace({ query: {} });
        };

        const truncateText = (text, maxLength) => {
            if (!text) return '';
            return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
        };

        const useHistoryQuery = (query) => {
            searchQuery.value = query;
            searchProfiles();
        };

        const removeHistoryItem = (index) => {
            searchHistory.value.splice(index, 1);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));
        };

        const clearAllHistory = () => {
            if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử tìm kiếm?')) {
                searchHistory.value = [];
                localStorage.removeItem('searchHistory');
            }
        };

        const startGuideTour = () => {
            showGuideTour.value = true;
        };

        const closeGuideTour = () => {
            showGuideTour.value = false;
            localStorage.setItem('hasSeenSearchGuide', 'true');
        };

        const clearProgressLogs = () => {
            progressLogs.value = [];
            currentProgressMessage.value = '';
            progressStep.value = 0;
            totalSteps.value = 4;
            progressCompleted.value = false;
            showProgress.value = false;
        };

        const cleanupRealtimeLogs = async (queueOnly = false) => {
            const idsToDelete = [...realtimeNotificationIds.value];
            realtimeNotificationIds.value = [];
            processedNotificationIds.value = new Set();
            activeSearchStartTime.value = null;
            clearProgressLogs();

            if (idsToDelete.length > 0) {
                if (queueOnly) {
                    queuePendingRealtimeIds(idsToDelete);
                } else {
                    await deleteRealtimeNotifications(idsToDelete);
                }
            }

            const realtimeLogs = profileRealtimeNotifications.value || [];
            realtimeLogs
                .filter((notification) => notification.type === 'profile_creating')
                .forEach((notification) => {
                    store.dispatch('notifications/removeNotification', notification.id).catch(() => { });
                });
        };

        const handleBeforeUnload = () => {
            queuePendingRealtimeIds([...realtimeNotificationIds.value]);
        };

        const trackRealtimeNotification = (notificationId) => {
            if (!notificationId) return;
            if (!realtimeNotificationIds.value.includes(notificationId)) {
                realtimeNotificationIds.value.push(notificationId);
            }
        };

        const parseAdditionalData = (data) => {
            if (!data) return null;
            if (typeof data === 'object') return data;
            if (typeof data === 'string') {
                try {
                    return JSON.parse(data);
                } catch (error) {
                    console.error('Không thể parse additional_data:', error);
                }
            }
            return null;
        };

        const handleRealtimeProgressNotification = (notification) => {
            const additionalData = parseAdditionalData(notification.additional_data);
            const message =
                additionalData?.text ||
                additionalData?.message ||
                notification.content ||
                'Đang xử lý tìm kiếm...';

            const isCompleted =
                additionalData?.completed === true ||
                additionalData?.status === 'done' ||
                notification.type === 'profile_created_with_matches';

            const subProgress =
                typeof additionalData?.percentage === 'number'
                    ? additionalData.percentage
                    : typeof additionalData?.progress === 'number'
                        ? additionalData.progress
                        : null;

            addProgressLog(message, isCompleted, subProgress);
            currentProgressMessage.value = message;
            showProgress.value = true;
            if (isCompleted) {
                progressCompleted.value = true;
            }

            if (typeof additionalData?.current_step === 'number') {
                progressStep.value = additionalData.current_step;
            } else if (progressStep.value < totalSteps.value) {
                progressStep.value += 1;
            }

            if (typeof additionalData?.total_steps === 'number') {
                totalSteps.value = additionalData.total_steps;
            }

            if (Array.isArray(additionalData?.results)) {
                searchResults.value = additionalData.results;
                hasSearched.value = true;
            }
        };

        watch(
            () => route.query.q,
            (newQuery) => {
                if (newQuery && newQuery !== searchQuery.value) {
                    searchQuery.value = newQuery;
                    searchProfiles();
                }
            }
        );

        watch(
            profileRealtimeNotifications,
            (newNotifications) => {
                if (!activeSearchStartTime.value || !Array.isArray(newNotifications)) {
                    return;
                }

                newNotifications.forEach((notification) => {
                    if (!notification || notification.type !== 'profile_creating') return;
                    if (processedNotificationIds.value.has(notification.id)) return;

                    const notificationTime = notification.created_at
                        ? new Date(notification.created_at).getTime()
                        : Date.now();

                    if (notificationTime < activeSearchStartTime.value) {
                        return;
                    }

                    processedNotificationIds.value.add(notification.id);
                    trackRealtimeNotification(notification.id);
                    handleRealtimeProgressNotification(notification);
                });
            },
            { deep: true }
        );

        onMounted(async () => {
            await deletePendingRealtimeNotifications();
            loadSearchState();
            window.addEventListener('beforeunload', handleBeforeUnload);
            if (!store.state.notifications.subscribed) {
                store.dispatch('notifications/subscribeToNotifications');
            }
        });

        onBeforeUnmount(async () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            await cleanupRealtimeLogs();
        });

        return {
            searchQuery,
            searchResults,
            loading,
            error,
            errorCode,
            hasSearched,
            requiresAuth,
            isAuthenticated,
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
            formatTimestamp,
            showGuideTour,
            startGuideTour,
            closeGuideTour,
            showAllSuggestions,
            displayedSuggestions,
            loadHistoryResults,
            clearProgressLogs,
            progressCompleted,
        };
    },
};
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
}
</style>
