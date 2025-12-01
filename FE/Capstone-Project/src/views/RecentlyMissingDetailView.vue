<template>
  <div class="min-h-screen bg-slate-50 pt-16 pb-6 sm:pt-20 sm:pb-8">

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-20">
      <AppLoader />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <div class="inline-block p-4 bg-red-100 rounded-full mb-4">
          <i class="fas fa-exclamation-triangle text-red-500 text-3xl"></i>
        </div>
        <h3 class="text-xl font-medium text-red-800 mb-2">Có lỗi xảy ra</h3>
        <p class="text-red-600 mb-6">{{ error }}</p>
        <div class="space-x-3">
          <button @click="fetchMissingReport"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
            <i class="fas fa-redo mr-2"></i> Thử lại
          </button>
          <router-link to="/recently-missing"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg inline-block transition-colors">
            <i class="fas fa-arrow-left mr-2"></i> Quay lại
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="missingReport" class="max-w-7xl mx-auto px-3 sm:px-4">
      <div class="w-full">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-5 items-start">
          <!-- Left Column - Missing Report Info (fixed position while scrolling) -->
          <div id="rmd-sidebar-wrapper" class="lg:sticky lg:top-20 lg:self-start">
            <RecentlyMissingDetailSidebar :missing-report="missingReport" :is-owner="isOwner" :no-image="noImage"
              :matches-length="matches.length" :on-upload-image="goToUploadImage" :on-image-error="handleImageError"
              :on-view-a-i-matches="viewAIMatches" :on-open-matches-modal="openMatchesModal"
              :on-open-image-modal="openImagePreview" />
          </div>
          <div class="lg:col-span-2 space-y-3 lg:space-y-3 lg:pr-1">
            <!-- Header Card -->
            <section id="rmd-header-card">
              <RecentlyMissingDetailHeaderCard :missing-report="missingReport"
                :formatted-missing-date="formattedMissingDate" :time-ago="timeAgo" :matches-length="matches.length"
                :is-owner="isOwner" :is-admin="isAdmin" :on-delete="confirmDelete" />
            </section>

            <!-- Description -->
            <section id="rmd-description">
              <RecentlyMissingDetailDescriptionContacts :missing-report="missingReport" />
            </section>

          </div>

        </div>
      </div>
    </div>

    <!-- AI Matches Modal -->
    <transition enter-active-class="transition-opacity duration-200 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showMatchesModal" id="rmd-ai-modal"
        class="fixed inset-0 z-[1000] flex items-center justify-center px-3 sm:px-4" @click.self="closeMatchesModal">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div
          class="relative max-w-5xl w-full max-h-[80vh] sm:max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
          <div class="flex items-center justify-between px-4 sm:px-5 py-2.5 border-b border-slate-200">
            <div class="flex items-center gap-2">
              <span
                class="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-50 text-blue-500 text-xs">
                <i class="fas fa-brain"></i>
              </span>
              <div>
                <p class="text-xs font-semibold text-slate-900">Kết quả tìm kiếm AI</p>
                <p class="text-[11px] text-slate-500" v-if="matches.length">
                  {{ matches.length }} báo cáo có khả năng trùng khớp với hồ sơ hiện tại
                </p>
              </div>
            </div>
            <button @click="closeMatchesModal"
              class="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              <i class="fas fa-times text-sm"></i>
            </button>
          </div>
          <div class="flex-1 overflow-y-auto p-3 sm:p-4">
            <RecentlyMissingDetailMatches :matches="matches" :sorted-matches="sortedMatches"
              :show-analysis-detail="showAnalysisDetail" :get-suggested-report-image="getSuggestedReportImage"
              :get-suggested-report-title="getSuggestedReportTitle"
              :get-suggested-report-profile-type="getSuggestedReportProfileType"
              :get-suggested-report-status="getSuggestedReportStatus"
              :get-suggested-report-status-label="getSuggestedReportStatusLabel"
              :get-suggested-report-username="getSuggestedReportUsername"
              :get-suggested-report-created-at="getSuggestedReportCreatedAt" :format-time="formatTime"
              :get-match-score-color="getMatchScoreColor" :get-match-score-bg-color="getMatchScoreBgColor"
              :get-confidence-label="getConfidenceLabel" :get-vietnamese-conclusion="getVietnameseConclusion"
              :format-key="formatKey" :get-suggested-report-id="getSuggestedReportId" :is-report-owner="isReportOwner"
              :start-conversation-with-report-owner="startConversationWithReportOwner"
              :toggle-analysis-detail="toggleAnalysisDetail" />
          </div>
        </div>
      </div>
    </transition>

    <!-- Image Preview Modal -->
    <transition enter-active-class="transition-opacity duration-200 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showImagePreview" class="fixed inset-0 z-[1000] flex items-center justify-center px-3 sm:px-4"
        @click.self="closeImagePreview">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div
          class="relative w-full max-w-5xl h-[78vh] sm:h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 flex flex-col">
          <button @click="closeImagePreview"
            class="absolute top-3 right-3 p-2 rounded-full bg-white/80 text-slate-500 hover:text-slate-800 hover:bg-white transition">
            <i class="fas fa-times text-sm"></i>
          </button>
          <div class="w-full h-full flex items-center justify-center">
            <img :src="previewImageSrc" alt="Ảnh báo cáo" class="h-full w-full object-contain rounded-xl shadow-sm" />
          </div>
        </div>
      </div>
    </transition>

    <!-- Nút mở guide tour cho trang chi tiết -->
    <button
      class="fixed left-4 bottom-6 z-40 inline-flex items-center gap-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-3.5 py-2 shadow-lg hover:shadow-xl transition-all"
      @click="openGuideTour">
      <i class="fas fa-question-circle text-sm"></i>
      <span class="hidden sm:inline">Hướng dẫn</span>
    </button>

    <RecentlyMissingDetailGuideTour :is-active="showGuideTour" @close="closeGuideTour" />
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { format, formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale';
import AppLoader from '@/components/common/AppLoader.vue';
import RecentlyMissingDetailSidebar from '@/components/recentlyMissing/RecentlyMissingDetailSidebar.vue';
import RecentlyMissingDetailHeaderCard from '@/components/recentlyMissing/RecentlyMissingDetailHeaderCard.vue';
import RecentlyMissingDetailDescriptionContacts from '@/components/recentlyMissing/RecentlyMissingDetailDescriptionContacts.vue';
import RecentlyMissingDetailMatches from '@/components/recentlyMissing/RecentlyMissingDetailMatches.vue';
import RecentlyMissingDetailGuideTour from '@/components/recentlyMissing/RecentlyMissingDetailGuideTour.vue';
import noImage from '@/assets/images/no_image.png';
import messageService from '../services/messageService';

export default {
  name: 'RecentlyMissingDetailView',
  components: {
    AppLoader,
    RecentlyMissingDetailSidebar,
    RecentlyMissingDetailHeaderCard,
    RecentlyMissingDetailDescriptionContacts,
    RecentlyMissingDetailMatches,
    RecentlyMissingDetailGuideTour,
  },

  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const reportId = route.params.id;
    const missingReport = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const matches = ref([]);
    const showMatchesModal = ref(false);
    const showAnalysisDetail = ref({});
    const showImagePreview = ref(false);
    const previewImageSrc = ref(null);
    const isLoading = ref(false);
    const isAdmin = ref(false)
    const showGuideTour = ref(false)

    const formatKey = (key) => {
      // Thay thế dấu gạch dưới bằng khoảng trắng và viết hoa chữ cái đầu mỗi từ
      return key.replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };
    const currentUser = computed(() => {
      const storeUser = store.getters['auth/currentUser'];
      if (storeUser) {
        console.log('🔍 Current user from store:', storeUser);
        return storeUser;
      }
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const localUser = JSON.parse(userStr);
          console.log('🔍 Current user from localStorage:', localUser);
          return localUser;
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
      console.log('🔍 No current user found');
      return null;
    });

    const isAuthenticated = computed(() => {
      const authStatus = store.getters['auth/isAuthenticated'];
      const hasToken = localStorage.getItem('token');
      const result = authStatus || !!hasToken;
      console.log('🔐 Is authenticated:', result, { authStatus, hasToken: !!hasToken });
      return result;
    });

    const isOwner = computed(() => {
      if (!currentUser.value || !missingReport.value) return false;
      const currentUsername = currentUser.value.username || currentUser.value.email;
      const currentId = currentUser.value.id;
      const isOwn = (missingReport.value.username === currentUsername) ||
        (missingReport.value.username === currentUser.value.email) ||
        (missingReport.value.user_id === currentId) ||
        (missingReport.value.created_by === currentId);
      console.log('🔍 Is owner check:', {
        reportUsername: missingReport.value.username,
        reportUserId: missingReport.value.user_id,
        reportCreatedBy: missingReport.value.created_by,
        currentUsername,
        currentEmail: currentUser.value.email,
        currentId,
        isOwn
      });
      return isOwn;
    });

    const sortedMatches = computed(() => {
      // Thứ tự ưu tiên cho llm_confidence cũ
      const confidenceOrder = {
        'highly_confident': 5,
        'confident': 4,
        'fairly_confident': 3,
        'moderate': 2,
        'uncertain': 1
      };

      // Thứ tự ưu tiên cho llm_confidence mới (match, partial, no_match)
      const matchOrder = {
        'match': 3,
        'partial': 2,
        'no_match': 1
      };

      return [...matches.value].sort((a, b) => {
        // Kiểm tra xem có phải là giá trị match, partial, no_match không
        const aHasMatchValue = a.llm_confidence && (a.llm_confidence === 'match' || a.llm_confidence === 'partial' || a.llm_confidence === 'no_match');
        const bHasMatchValue = b.llm_confidence && (b.llm_confidence === 'match' || b.llm_confidence === 'partial' || b.llm_confidence === 'no_match');

        // Nếu cả hai đều có giá trị match, partial, no_match
        if (aHasMatchValue && bHasMatchValue) {
          // Sắp xếp theo thứ tự match, partial, no_match
          const matchDiff = matchOrder[b.llm_confidence] - matchOrder[a.llm_confidence];
          // Nếu cùng giá trị match/partial/no_match, sắp xếp theo face_match_score
          return matchDiff !== 0 ? matchDiff : b.face_match_score - a.face_match_score;
        }

        // Nếu chỉ một trong hai có giá trị match/partial/no_match, ưu tiên cái có giá trị đó
        if (aHasMatchValue && !bHasMatchValue) return -1;
        if (!aHasMatchValue && bHasMatchValue) return 1;

        // Nếu không có giá trị match/partial/no_match, sử dụng logic sắp xếp cũ
        return confidenceOrder[b.llm_confidence] - confidenceOrder[a.llm_confidence] || b.face_match_score - a.face_match_score;
      });
    });

    const formattedMissingDate = computed(() => {
      if (!missingReport.value?.missing_date) return null;
      try {
        return format(new Date(missingReport.value.missing_date), 'dd/MM/yyyy', { locale: vi });
      } catch {
        return missingReport.value.missing_date;
      }
    });

    const timeAgo = computed(() => {
      if (!missingReport.value?.created_at) return '';
      try {
        return formatDistance(new Date(missingReport.value.created_at), new Date(), {
          addSuffix: true,
          locale: vi
        });
      } catch {
        return '';
      }
    });

    const fetchMissingReport = async () => {
      try {
        loading.value = true;
        error.value = null;
        console.log('📤 Fetching missing report with ID:', reportId);
        const response = await store.dispatch('recentlyMissing/fetchMissingReportById', reportId);
        console.log('📄 Fetched missing report:', response);
        missingReport.value = response;
      } catch (err) {
        console.error('❌ Error fetching missing report:', err);
        error.value = err.message || 'Không thể tải thông tin báo cáo missing';
        if (err.response?.status === 404) {
          error.value = 'Không tìm thấy báo cáo missing này';
        } else if (err.response?.status === 403) {
          error.value = 'Bạn không có quyền xem báo cáo này';
        }
      } finally {
        loading.value = false;
      }
    };

    const fetchMatches = async () => {
      try {
        console.log('📤 Fetching matches for missing report:', reportId);
        const response = await store.dispatch('recentlyMissing/fetchMissingReportMatches', reportId);
        matches.value = response || [];
        console.log('📄 Fetched matches:', matches.value);
      } catch (err) {
        console.error('❌ Error fetching matches:', err);
      }
    };

    const openMatchesModal = () => {
      if (matches.value && matches.value.length > 0) {
        showMatchesModal.value = true;
      }
    };

    const closeMatchesModal = () => {
      showMatchesModal.value = false;
    };

    const viewAIMatches = async () => {
      try {
        loading.value = true;
        console.log('📤 Preparing to analyze matches with AI for report:', reportId);
        // Trích xuất danh sách report_id từ matches
        const otherReportIds = matches.value.map(match =>
          match.report1_id === parseInt(reportId) ? match.report2_id : match.report1_id
        );
        console.log('📤 Sending report IDs to analyze:', otherReportIds);
        const response = await store.dispatch('recentlyMissing/analyzeMatchesWithLLM', {
          current_report_id: reportId,
          other_report_ids: otherReportIds
        });
        console.log('📄 AI analysis response:', response);
        await fetchMatches(); // Cập nhật lại danh sách matches
      } catch (err) {
        console.error('❌ Error analyzing matches with AI:', err);
        error.value = err.message || 'Không thể phân tích kết quả khớp AI';
      } finally {
        loading.value = false;
      }
    };

    // Function để toggle chi tiết phân tích AI
    const toggleAnalysisDetail = (matchId) => {
      showAnalysisDetail.value[matchId] = !showAnalysisDetail.value[matchId];
    };

    // Function để lấy trạng thái màu cho match score
    const getMatchScoreColor = (score) => {
      if (score >= 90) return 'text-green-600';
      if (score >= 85) return 'text-blue-400';
      if (score >= 80) return 'text-yellow-600';
      if (score >= 75) return 'text-orange-600';
      return 'text-red-600';
    };

    // Function để lấy background color cho match score
    const getMatchScoreBgColor = (score) => {
      if (score >= 90) return 'bg-gradient-to-br from-green-400 to-green-600';
      if (score >= 85) return 'bg-gradient-to-br from-blue-400 to-blue-400';
      if (score >= 80) return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
      if (score >= 75) return 'bg-gradient-to-br from-orange-400 to-orange-600';
      return 'bg-gradient-to-br from-red-400 to-red-600';
    };

    const confirmDelete = () => {
      if (confirm('Bạn có chắc chắn muốn xóa báo cáo này? Hành động này không thể hoàn tác.')) {
        deleteMissingReport();
      }
    };

    const deleteMissingReport = async () => {
      try {
        console.log('📤 Deleting missing report:', reportId);
        await store.dispatch('recentlyMissing/deleteMissingReport', reportId);
        alert('Xóa báo cáo thành công!');
        router.push('/recently-missing');
      } catch (err) {
        console.error('❌ Error deleting missing report:', err);
        alert('Lỗi khi xóa báo cáo: ' + (err.message || 'Không thể xóa báo cáo'));
      }
    };

    const openImagePreview = (src) => {
      previewImageSrc.value = src || noImage;
      showImagePreview.value = true;
    };

    const closeImagePreview = () => {
      showImagePreview.value = false;
    };

    const goToUploadImage = () => {
      router.push(`/recently-missing/${reportId}/upload-image`);
    };

    const goToMatches = () => {
      router.push(`/recently-missing/${reportId}/matches`);
    };

    const handleImageError = (event) => {
      event.target.src = noImage;
    };

    // Matches
    const getSuggestedReportId = (match) => {
      return match.report1_id === parseInt(reportId) ? match.report2_id : match.report1_id;
    };

    const getSuggestedReportTitle = (match) => {
      return match.report1_id === parseInt(reportId) ? match.report2_title : match.report1_title;
    };

    const getSuggestedReportImage = (match) => {
      const baseUrl = match.report1_id === parseInt(reportId)
        ? match.report2_image_url
        : match.report1_image_url;
      return baseUrl ? `${baseUrl}?t=${Date.now()}` : noImage;
    };

    const getSuggestedReportProfileType = (match) => {
      const profileType = match.report1_id === parseInt(reportId) ? match.report2_profile_type : match.report1_profile_type;
      return profileType === 'seeker' ? 'Người đi tìm' : 'Người cung cấp thông tin';
    };

    const getConfidenceLabel = (confidence) => {
      const labels = {
        uncertain: 'Chưa chắc chắn về độ giống trên khuôn mặt',
        moderate: 'Độ giống nhau trên khuôn mặt ở mức trung bình',
        fairly_confident: 'Độ giống nhau trên khuôn mặt ở mức khá tin cậy',
        confident: 'Độ giống nhau trên khuôn mặt ở mức tin cậy',
        highly_confident: 'Độ giống nhau trên khuôn mặt ở mức rất tin cậy',
        no_match: 'Báo cáo về người này không khớp',
        partial: 'Báo cáo về người này chỉ có một phần khớp',
        match: 'Báo cáo về người này hoàn toàn khớp'
      };
      return labels[confidence] || 'Đang đánh giá';
    };

    const getSuggestedReportUsername = (match) => {
      return match.report1_id === parseInt(reportId) ? match.report2_username : match.report1_username;
    };

    const getSuggestedReportCreatedAt = (match) => {
      return match.report1_id === parseInt(reportId) ? match.report2_created_at : match.report1_created_at;
    };

    const getSuggestedReportStatus = (match) => {
      return match.report1_id === parseInt(reportId) ? match.report2_status : match.report1_status;
    };

    const getSuggestedReportStatusLabel = (match) => {
      const status = getSuggestedReportStatus(match);
      const statusLabels = {
        active: 'Đang tìm kiếm',
        found: 'Đã tìm thấy',
        closed: 'Đã đóng'
      };
      return statusLabels[status] || status || 'Không xác định';
    };

    const formatTime = (date) => {
      try {
        return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: vi });
      } catch {
        return date || 'Không xác định';
      }
    };

    const getVietnameseConclusion = (conclusion) => {
      const translations = {
        'match': 'Khớp hoàn toàn',
        'partial': 'Khớp một phần',
        'no_match': 'Không khớp'
      };
      return translations[conclusion] || conclusion || 'Chưa có kết luận';
    };

    const loadUserIfNeeded = async () => {
      const hasToken = localStorage.getItem('token');
      const storeUser = store.getters['auth/currentUser'];
      if (hasToken && !storeUser) {
        try {
          console.log('🔄 Loading user from server...');
          await store.dispatch('auth/fetchCurrentUser');
        } catch (error) {
          console.error('Failed to load user:', error);
        }
      }
    };

    // Hàm kiểm tra xem người dùng hiện tại có phải là chủ sở hữu của báo cáo hay không
    const isReportOwner = (match) => {
      if (!currentUser.value) return false;

      // Lấy ID của báo cáo được đề xuất
      const reportId = getSuggestedReportId(match);

      // Lấy tên người dùng của chủ sở hữu báo cáo
      const reportUsername = match.report1_id === parseInt(reportId)
        ? match.report1_username
        : match.report2_username;

      // Lấy ID người dùng của báo cáo
      const reportUserId = match.report1_id === parseInt(reportId)
        ? match.report1_user_id
        : match.report2_user_id;

      // Kiểm tra xem người dùng hiện tại có phải là chủ sở hữu không
      return (
        reportUserId === currentUser.value.id ||
        (reportUsername && currentUser.value.username && reportUsername === currentUser.value.username) ||
        (reportUsername && currentUser.value.email && reportUsername === currentUser.value.email)
      );
    };

    const startConversationWithReportOwner = async (match) => {
      // Kiểm tra đăng nhập
      if (!currentUser.value) {
        // Chuyển hướng đến trang đăng nhập và lưu đường dẫn hiện tại để quay lại sau khi đăng nhập
        const reportId = getSuggestedReportId(match);
        router.push({
          path: '/auth',
          query: { redirect: `/recently-missing/${reportId}` },
        });
        return;
      }

      try {
        isLoading.value = true;

        // Lấy thông tin báo cáo
        const reportId = getSuggestedReportId(match);

        // Xác định ID của chủ sở hữu báo cáo
        const ownerId = match.report1_id === parseInt(reportId)
          ? match.report1_user_id
          : match.report2_user_id;

        // Kiểm tra xem có xác định được ID chủ sở hữu không
        if (!ownerId) {
          throw new Error('Không thể xác định ID chủ sở hữu báo cáo');
        }

        // Kiểm tra xem người dùng có đang cố gắng nhắn tin với chính mình không
        if (ownerId === currentUser.value.id) {
          alert('Bạn không thể nhắn tin với chính mình');
          return;
        }

        // Gọi API để bắt đầu cuộc trò chuyện, chỉ định entityType là 'report'
        const response = await messageService.startConversation(ownerId, reportId, 'report');

        // Chuyển hướng đến trang tin nhắn với ID phiên trò chuyện
        router.push({
          path: '/messages',
          query: { session: response.data.id },
        });
      } catch (err) {
        console.error('Không thể bắt đầu cuộc trò chuyện:', err);
        alert('Không thể bắt đầu cuộc trò chuyện. Vui lòng thử lại sau.');
      } finally {
        isLoading.value = false;
      }
    };

    watch(currentUser, (newUser) => {
      console.log('🔍 User changed in detail view:', newUser);
    });

    // Xem sử thay đổi của id trên url thì reload trang lại 1 lần
    watch(() => route.params.id, async (newId) => {
      console.log('🔄 Route changed to:', newId);
      location.reload();
    });



    const openGuideTour = () => {
      showGuideTour.value = true;
      localStorage.setItem('recentlyMissingDetailGuideSeen', '1');
    };

    const closeGuideTour = () => {
      showGuideTour.value = false;
    };

    onMounted(async () => {
      console.log('🚀 Detail view mounted for missing report:', reportId);
      await loadUserIfNeeded();
      await fetchMissingReport();
      if (isAuthenticated.value) {
        await fetchMatches();
      }

      // Kiểm tra thông tin người dùng trong localStorage
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const userData = JSON.parse(userStr)
          isAdmin.value = userData.id === 1;
        } catch (error) {
          console.error('Lỗi khi phân tích dữ liệu người dùng:', error)
        }
      }
      console.log('Là Admin:', isAdmin.value);

      const seen = localStorage.getItem('recentlyMissingDetailGuideSeen');
      if (!seen) {
        setTimeout(() => {
          openGuideTour();
        }, 800);
      }
    });

    return {
      reportId,
      missingReport,
      loading,
      error,
      matches,
      showMatchesModal,
      showImagePreview,
      previewImageSrc,
      openImagePreview,
      closeImagePreview,
      sortedMatches,
      currentUser,
      isAuthenticated,
      isOwner,
      isAdmin,
      formattedMissingDate,
      timeAgo,
      fetchMissingReport,
      confirmDelete,
      deleteMissingReport,
      goToUploadImage,
      goToMatches,
      handleImageError,
      noImage,
      getSuggestedReportImage,
      getSuggestedReportTitle,
      getSuggestedReportProfileType,
      getSuggestedReportId,
      getConfidenceLabel,
      getSuggestedReportUsername,
      getSuggestedReportCreatedAt,
      getSuggestedReportStatus,
      getSuggestedReportStatusLabel,
      formatTime,
      viewAIMatches,
      showAnalysisDetail,
      toggleAnalysisDetail,
      getMatchScoreColor,
      getMatchScoreBgColor,
      formatKey,
      getVietnameseConclusion,
      openMatchesModal,
      closeMatchesModal,
      isReportOwner,
      startConversationWithReportOwner,
      isLoading,
      showGuideTour,
      openGuideTour,
      closeGuideTour,
    };
  }
}
</script>

<style scoped>
/* Line clamp utilities */
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

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-transform {
  transition-property: transform;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom animations */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

/* Progress bar animations */
@keyframes progressFill {
  from {
    width: 0%;
  }

  to {
    width: var(--progress-width);
  }
}

.progress-animate {
  animation: progressFill 1s ease-out;
}

/* Hover effects */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Custom scrollbar for analysis details */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Responsive grid improvements */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .sm\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .lg\:grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Badge and status improvements */
.status-badge {
  position: relative;
  overflow: hidden;
}

.status-badge::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.status-badge:hover::before {
  left: 100%;
}

/* Image container improvements */
.image-container {
  position: relative;
  overflow: hidden;
}

.image-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%);
  pointer-events: none;
}

/* Loading skeleton */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

/* Compact mode for mobile */
@media (max-width: 480px) {
  .mobile-compact .grid-cols-2 {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .mobile-compact .p-3 {
    padding: 0.5rem;
  }

  .mobile-compact .text-sm {
    font-size: 0.75rem;
  }
}

/* Focus improvements for accessibility */
.focus\:ring-custom:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }

  .print-break {
    page-break-inside: avoid;
  }
}

/* .responsive-sticky moved to sidebar component and replaced by Tailwind utilities */
</style>