<template>
  <div>
    <AppHeader />
    <div class="container mx-auto px-4 py-8 pt-16 max-w-7xl">
      <!-- Display loading state -->
      <div v-if="loading" class="flex justify-center py-12">
        <AppLoader />
      </div>
      <div v-else-if="profile" class="bg-white rounded-xl shadow-lg overflow-hidden">
        <ProfileHeader :profile="profile" :is-owner="isOwner" :is-admin="isAdmin" :is-loading="isLoading"
          @change-status="showStatusModal = true" @contact="startConversation" @share="shareProfile"
          @delete="deleteProfile" @open-upload-modal="showImageUploadModal = true" />

        <div v-if="suggestedProfiles.length > 0"
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-6 py-3 bg-blue-50 border-y border-blue-200 relative overflow-hidden">
          <div class="absolute inset-0 bg-blue-100/40 animate-shimmer pointer-events-none"></div>
          <p class="text-sm text-blue-700 font-semibold relative z-10">
            <i class="fas fa-lightbulb text-blue-400 mr-2"></i>
            Có <strong class="text-blue-600">{{ suggestedProfiles.length }}</strong> hồ sơ gợi ý liên quan
          </p>
          <button @click="scrollToSuggestions"
            class="suggestion-button relative inline-flex items-center justify-center gap-2 rounded-full bg-blue-500 px-5 py-2.5 text-sm font-bold text-white shadow-2xl hover:bg-blue-600 hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300/50 transform hover:scale-105 active:scale-95"
            style="z-index: 10000; position: relative; filter: none;">
            <!-- Animated ring -->
            <span
              class="absolute inset-0 rounded-full border-2 border-white/50 animate-ping-slow pointer-events-none"></span>
            <!-- Glow effect nhẹ -->
            <span
              class="absolute inset-0 rounded-full bg-blue-400 opacity-50 blur-lg animate-glow pointer-events-none"></span>
            <!-- Content -->
            <span class="relative z-10 flex items-center gap-2">
              <i class="fas fa-arrow-down text-sm animate-bounce-slow"></i>
              <span class="font-bold">Xem ngay</span>
                  </span>
                </button>
            </div>

        <!-- Guide Tour Component -->
        <SuggestionGuideTour v-if="showSuggestionGuide" :is-active="showSuggestionGuide"
          :profile-count="suggestedProfiles.length" @close="closeGuideTour" />

        <!-- Main Content -->
        <div class="flex flex-col md:flex-row">
          <!-- Left Column - Images and Details -->
          <div class="md:w-2/5 lg:w-1/3 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200">
            <ProfileImageSection
              :profile="profile"
              :is-owner="isOwner"
              :is-liked="isLiked"
              :likes-count="likesCount"
              @toggle-like="toggleLike"
              @open-upload-modal="showImageUploadModal = true"
              @preview-image="openProfileImagePreview"
            />
            <ProfileBasicInfo :profile="profile" />
          </div>

          <!-- Right Column - Description and Comments -->
          <div class="md:w-3/5 lg:w-2/3 p-4 md:p-6">
            <ProfileDescription :profile="profile" />
            <ProfileComments :comments="comments" :new-comment="newComment" :has-more-comments="hasMoreComments"
              @submit-comment="submitComment" @like-comment="likeComment" @reply-comment="replyToComment"
              @load-more="loadMoreComments" @update:newComment="newComment = $event" />
          </div>
        </div>

        <!-- Related Profiles Section -->
        <div v-if="suggestedProfiles.length > 0" ref="suggestionSectionRef">
          <SuggestedProfilesSection :profiles="suggestedProfiles" />
              </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-lg p-8 text-center shadow-md">
        <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
        <p class="text-gray-600 mb-4">Có lỗi xảy ra khi tải thông tin hồ sơ.</p>
        <button @click="fetchProfile"
          class="bg-blue-400 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition">
          Thử lại
        </button>
      </div>

      <!-- Not Found State -->
      <div v-else-if="!loading && !error && !profile" class="bg-white rounded-lg p-8 text-center shadow-md">
        <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
        <p class="text-gray-600 mb-4">Không tìm thấy hồ sơ hoặc hồ sơ đã bị xóa.</p>
        <router-link to="/" class="bg-blue-400 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition">
          Quay lại trang chủ
        </router-link>
      </div>

      <!-- Success Message -->
      <div v-if="editSuccess"
        class="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-md animate__animated animate__fadeIn">
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="fas fa-check-circle text-green-600"></i>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">Cập nhật thành công</h3>
            <div class="mt-2 text-sm text-green-700">
              <p>Hồ sơ đã được cập nhật thành công. Hồ sơ cũ đã được xóa và thay thế bằng hồ sơ mới.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Status Change Modal -->
      <ProfileStatusModal :show="showStatusModal" :current-status="profile?.status" :is-loading="isLoading"
        :status-options="statusOptions" @close="showStatusModal = false" @update-status="updateProfileStatus" />

      <!-- Image Upload Modal -->
      <ProfileImageUploadModal 
        v-if="profile"
        :show="showImageUploadModal" 
        :profile="profile"
        :profile-id="profileId"
        @close="showImageUploadModal = false"
        @upload-success="handleImageUploadSuccess" 
      />

      <!-- Image Preview Modal -->
      <transition enter-active-class="transition-opacity duration-200 ease-out"
        enter-from-class="opacity-0" enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150 ease-in"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="showProfileImagePreview" class="fixed inset-0 z-[1200] flex items-center justify-center px-3 sm:px-4"
          @click.self="closeProfileImagePreview">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div
            class="relative w-full max-w-5xl h-[78vh] sm:h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 flex flex-col">
            <button class="absolute top-3 right-3 p-2 rounded-full bg-white/80 text-slate-600 hover:text-slate-900"
              @click="closeProfileImagePreview">
              <i class="fas fa-times text-sm"></i>
            </button>
            <div class="w-full h-full flex items-center justify-center">
              <img
                :src="profilePreviewImageSrc"
                alt="Ảnh hồ sơ"
                class="h-full w-full object-contain rounded-xl shadow-sm"
              />
            </div>
          </div>
        </div>
      </transition>

      <!-- Delete Confirm Modal -->
      <DeleteConfirmModal
        v-if="profile"
        :show="showDeleteModal"
        :profile-title="profile.title || profile.full_name || 'hồ sơ này'"
        :is-loading="isLoading"
        @close="showDeleteModal = false"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import profileService from '@/services/profileService';
import AppLoader from '@/components/common/AppLoader.vue';
import AppHeader from '@/components/common/AppHeader.vue';
import SuggestedProfilesSection from '@/components/profile/SuggestedProfilesSection.vue';
import ProfileHeader from '@/components/profile/layout/ProfileHeader.vue';
import ProfileImageSection from '@/components/profile/layout/ProfileImageSection.vue';
import ProfileBasicInfo from '@/components/profile/layout/ProfileBasicInfo.vue';
import ProfileDescription from '@/components/profile/layout/ProfileDescription.vue';
import ProfileComments from '@/components/profile/layout/ProfileComments.vue';
import ProfileStatusModal from '@/components/profile/modals/ProfileStatusModal.vue';
import SuggestionGuideTour from '@/components/profile/guides/SuggestionGuideTour.vue';
import ProfileImageUploadModal from '@/components/profile/modals/ProfileImageUploadModal.vue';
import DeleteConfirmModal from '@/components/profile/modals/DeleteConfirmModal.vue';
import messageService from '@/services/messageService';
import commentService from '@/services/commentService';

export default {
  name: 'ProfileDetailView',
  components: {
    AppHeader,
    AppLoader,
    SuggestedProfilesSection,
    ProfileHeader,
    ProfileImageSection,
    ProfileBasicInfo,
    ProfileDescription,
    ProfileComments,
    ProfileStatusModal,
    SuggestionGuideTour,
    ProfileImageUploadModal,
    DeleteConfirmModal,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const statusButton = ref(null); // Reference to the status button
    const profileId = computed(() => route.params.id);
    const profile = ref(null);
    const suggestedProfiles = ref([]);
    const currentUser = computed(() => {
      const storeUser = store.getters['auth/currentUser'];
      if (storeUser) return storeUser;
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
      return null;
    });
    const loading = ref(true);
    const error = ref(null);
    const editSuccess = ref(route.query.action === 'edit-success');
    const oldProfileId = ref(route.query.oldId);
    const isLiked = ref(false);
    const likesCount = ref(0);
    const comments = ref([]);
    const newComment = ref('');
    const hasMoreComments = ref(false);
    const commentsPage = ref(1);
    const isLoading = ref(false);
    const showStatusDropdown = ref(false);
    const dropdownWidth = ref(200); // Default dropdown width
    const showStatusModal = ref(false); // Modal visibility
    const isAdmin = ref(false);
    const suggestionSectionRef = ref(null);
    const showSuggestionGuide = ref(false);
    const hasShownSuggestionGuide = ref(false);
    const showImageUploadModal = ref(false);
    const showDeleteModal = ref(false);
    const showProfileImagePreview = ref(false);
    const profilePreviewImageSrc = ref(null);

    const statusOptions = ref([
      {
        value: 'active',
        label: 'Đang tìm kiếm',
        description: 'Hồ sơ hiển thị công khai và nhận thông tin',
        iconClass: 'fas fa-search text-green-600',
        bgClass: 'bg-green-100',
      },
      {
        value: 'found',
        label: 'Đã tìm thấy',
        description: 'Đánh dấu đã đoàn tụ thành công',
        iconClass: 'fas fa-check-circle text-blue-400',
        bgClass: 'bg-blue-100',
      },
      {
        value: 'closed',
        label: 'Đã đóng',
        description: 'Tạm thời ẩn khỏi kết quả tìm kiếm',
        iconClass: 'fas fa-pause-circle text-gray-600',
        bgClass: 'bg-gray-100',
      },
    ]);

    // Check if current user is the profile owner
    const isOwner = computed(() => {
      if (!profile.value || !currentUser.value) return false;
      return (
        profile.value.is_owner === true ||
        profile.value.user === currentUser.value.id ||
        (profile.value.username && currentUser.value.username && profile.value.username === currentUser.value.username)
      );
    });

    // Dynamic dropdown positioning
    const dropdownStyle = computed(() => {
      if (!statusButton.value || !showStatusDropdown.value) return { top: '0px', left: '0px' };
      const rect = statusButton.value.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const dropdownMinWidth = dropdownWidth.value;
      const spaceRight = viewportWidth - rect.right;
      const spaceLeft = rect.left;
      let style = {
        top: `${rect.bottom + window.scrollY + 8}px`, // 8px gap below button
      };

      if (spaceRight >= dropdownMinWidth) {
        style.left = `${rect.right + window.scrollX - dropdownMinWidth}px`;
      } else if (spaceLeft >= dropdownMinWidth) {
        style.left = `${rect.left + window.scrollX}px`;
      } else {
        style.left = `${Math.max(8, rect.left + window.scrollX - (dropdownMinWidth - rect.width) / 2)}px`;
        style.maxWidth = `${viewportWidth - 16}px`; // Ensure fits within viewport
      }
      return style;
    });

    // Toggle dropdown and update position
    const toggleStatusDropdown = () => {
      showStatusDropdown.value = !showStatusDropdown.value;
    };

    // Fetch profile details
    const fetchProfile = async () => {
      loading.value = true;
      error.value = null;
      try {
        const response = await profileService.getProfileById(profileId.value);
        profile.value = response.data;
        editSuccess.value = false;
        fetchSuggestedProfiles();
      } catch (err) {
        console.error('Error fetching profile:', err);
        error.value = err.message || 'Failed to load profile';
      } finally {
        loading.value = false;
      }
    };

    // Fetch suggested profiles
    const fetchSuggestedProfiles = async () => {
      try {
        const response = await profileService.getSuggestedProfiles(profileId.value);
        const profiles = Array.isArray(response.data) ? response.data : (response.data.results || []);
        suggestedProfiles.value = profiles;
        // Trigger guide ngay khi có profiles, không cần đợi
        if (profiles.length > 0) {
          triggerSuggestionGuide();
        }
      } catch (err) {
        console.error('Error fetching suggested profiles:', err);
      }
    };

    // Toggle profile status
    const toggleProfileStatus = async () => {
      try {
        const currentStatus = profile.value.status;
        const newStatus = currentStatus === 'active' ? 'closed' : 'active';
        isLoading.value = true;
        await profileService.updateProfileStatus(profileId.value, newStatus);
        console.log(`Đã ${newStatus === 'active' ? 'kích hoạt' : 'tạm dừng'} hồ sơ thành công`);
        window.location.reload();
      } catch (error) {
        console.error('Error updating profile status:', error);
        error.value = `Không thể cập nhật trạng thái hồ sơ: ${error.message}`;
        isLoading.value = false;
      }
    };

    // Update profile status
    const updateProfileStatus = async (newStatus) => {
      try {
        if (profile.value.status === newStatus) {
          showStatusModal.value = false;
          return;
        }

        isLoading.value = true;
        showStatusModal.value = false;

        await profileService.updateProfileStatus(profileId.value, newStatus);

        let statusMessage = '';
        switch (newStatus) {
          case 'active':
            statusMessage = 'Hồ sơ đã được kích hoạt và đang tìm kiếm.';
            break;
          case 'found':
            statusMessage = 'Hồ sơ đã được đánh dấu là đã tìm thấy.';
            break;
          case 'closed':
            statusMessage = 'Hồ sơ đã được tạm dừng.';
            break;
        }

        console.log(statusMessage);
        window.location.reload();
      } catch (err) {
        console.error('Error updating profile status:', err);
        error.value = `Không thể cập nhật trạng thái hồ sơ: ${err.message}`;
        isLoading.value = false;
        showStatusModal.value = false;
      }
    };

    // Share profile
    const shareProfile = async () => {
      const shareUrl = window.location.href;
      if (navigator.share) {
        try {
          await navigator.share({
            title: profile.value ? profile.value.title : 'Tìm kiếm người thân',
            text: profile.value ? `${profile.value.full_name} - ${profile.value.title}` : 'Xem hồ sơ tìm kiếm này',
            url: shareUrl,
          });
        } catch (err) {
          console.error('Error sharing:', err);
        }
      } else {
        try {
          await navigator.clipboard.writeText(shareUrl);
          alert('Đã sao chép liên kết vào clipboard');
        } catch (err) {
          console.error('Error copying to clipboard:', err);
          prompt('Sao chép liên kết này để chia sẻ:', shareUrl);
        }
      }
    };

    // Start conversation
    const startConversation = async () => {
      if (!currentUser.value) {
        router.push({
          path: '/auth',
          query: { redirect: `/profile/${profileId.value}` },
        });
        return;
      }
      try {
        isLoading.value = true;
        if (!profile.value) throw new Error('Profile data is not available');
        const ownerId = profile.value.user_id || profile.value.user || profile.value.owner_id;
        if (!ownerId) throw new Error('Could not determine profile owner ID');
        if (ownerId === currentUser.value.id) {
          alert('Bạn không thể nhắn tin với chính mình');
          return;
        }

        // Sử dụng phương thức mới với tham số entityType là 'profile'
        const response = await messageService.startConversation(ownerId, profileId.value, 'profile');

        router.push({
          path: '/messages',
          query: { session: response.data.id },
        });
      } catch (err) {
        console.error('Failed to start conversation:', err);
        alert('Không thể bắt đầu cuộc trò chuyện. Vui lòng thử lại sau.');
      } finally {
        isLoading.value = false;
      }
    };

    // Toggle like
    const toggleLike = async () => {
      if (!currentUser.value) {
        router.push({
          path: '/auth',
          query: { redirect: `/profile/${profileId.value}` },
        });
        return;
      }
      isLiked.value = !isLiked.value;
      likesCount.value += isLiked.value ? 1 : -1;
      try {
        console.log('Like toggled:', isLiked.value);
      } catch (err) {
        isLiked.value = !isLiked.value;
        likesCount.value += isLiked.value ? 1 : -1;
        console.error('Error toggling like:', err);
      }
    };

    // Fetch likes data
    const fetchLikesData = async () => {
      try {
        likesCount.value = Math.floor(Math.random() * 50);
        isLiked.value = Math.random() > 0.5;
      } catch (err) {
        console.error('Error fetching likes data:', err);
      }
    };

    // Fetch comments từ API
    const fetchComments = async (page = 1) => {
      try {
        const data = await commentService.getComments(profileId.value, page);
        // Đúng trường dữ liệu:
        const commentsArr = data.comments || [];
        if (page === 1) {
          comments.value = commentsArr;
        } else {
          comments.value = [...comments.value, ...commentsArr];
        }
        hasMoreComments.value = !!data.has_more;
        commentsPage.value = page;
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    // Gửi bình luận mới
    const submitComment = async () => {
      if (!currentUser.value || !newComment.value.trim()) return;
      try {
        const newCmt = await commentService.postComment(profileId.value, newComment.value.trim());
        comments.value.unshift(newCmt);
        newComment.value = '';
      } catch (err) {
        console.error('Error submitting comment:', err);
      }
    };

    // Like comment
    const likeComment = async (commentId) => {
      if (!currentUser.value) return;
      const comment = comments.value.find(c => c.id === commentId);
      if (comment) {
        comment.is_liked = !comment.is_liked;
        comment.likes += comment.is_liked ? 1 : -1;
      }
      try {
        console.log('Comment like toggled for:', commentId);
      } catch (err) {
        if (comment) {
          comment.is_liked = !comment.is_liked;
          comment.likes += comment.is_liked ? 1 : -1;
        }
        console.error('Error liking comment:', err);
      }
    };

    // Reply to comment
    const replyToComment = (commentId) => {
      if (!currentUser.value) {
        router.push({
          path: '/auth',
          query: { redirect: `/profile/${profileId.value}` },
        });
        return;
      }
      const comment = comments.value.find(c => c.id === commentId);
      if (comment) {
        newComment.value = `@${comment.user_name} `;
        document.querySelector('textarea').focus();
      }
    };

    // Load more comments
    const loadMoreComments = () => {
      fetchComments(commentsPage.value + 1);
    };

    const triggerSuggestionGuide = () => {
      if (hasShownSuggestionGuide.value) return;
      // Hiển thị guide ngay khi có suggested profiles
      hasShownSuggestionGuide.value = true;
      // Scroll lên đầu trang trước khi hiển thị guide
      window.scrollTo(0, 0);
      // Đợi một chút để đảm bảo scroll xong và DOM render button
      setTimeout(() => {
        showSuggestionGuide.value = true;
        // Không tự động ẩn - chỉ ẩn khi người dùng tương tác
      }, 200);
    };

    const closeGuideTour = () => {
      showSuggestionGuide.value = false;
    };

    const openProfileImagePreview = (src) => {
      const fallback = profile.value?.images || profile.value?.image_url;
      const resolved = src || fallback;
      if (!resolved) return;
      profilePreviewImageSrc.value = resolved;
      showProfileImagePreview.value = true;
    };

    const closeProfileImagePreview = () => {
      showProfileImagePreview.value = false;
    };

    const scrollToSuggestions = () => {
      closeGuideTour();
      // Đợi một chút để guide ẩn đi trước khi scroll
      setTimeout(() => {
        if (suggestionSectionRef.value) {
          suggestionSectionRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    };

    // Handle click outside to close dropdown
    const handleClickOutside = (event) => {
      if (showStatusDropdown.value && !event.target.closest('.relative')) {
        showStatusDropdown.value = false;
      }
    };

    // Handle window resize to update dropdown position
    const handleResize = () => {
      if (showStatusDropdown.value) {
        // Dropdown position will be updated via computed property
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      fetchProfile();
      fetchLikesData();
      fetchComments(1);
      document.addEventListener('click', handleClickOutside);
      window.addEventListener('resize', handleResize);
      
      // Kiểm tra thông tin người dùng trong localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          isAdmin.value = userData.id === 1;
        } catch (error) {
          console.error('Lỗi khi phân tích dữ liệu người dùng:', error);
        }
      }
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    });

    watch(() => route.params.id, () => {
      fetchProfile();
    });

    // Không cần watch nữa vì đã trigger trong fetchSuggestedProfiles

    if (editSuccess.value) {
      setTimeout(() => {
        editSuccess.value = false;
        router.replace({ query: {} });
      }, 5000);
    }

    watch([profile, currentUser], ([newProfile, newUser]) => {
      if (newProfile && newUser) {
        console.log('Profile user ID:', newProfile.user);
        console.log('Current user ID:', newUser.id);
        console.log('Is owner from API:', newProfile.is_owner);
        console.log('Computed isOwner:', isOwner.value);
      }
    });

    // Handle image upload success
    const handleImageUploadSuccess = ({ imageUrl }) => {
      if (profile.value) {
        profile.value.image_url = imageUrl;
        profile.value.images = imageUrl; // Cập nhật cả hai thuộc tính để tương thích
      }
      showImageUploadModal.value = false;
      // Refresh profile để lấy dữ liệu mới nhất
      fetchProfile();
    };

    // Open delete confirmation modal
    const deleteProfile = () => {
      showDeleteModal.value = true;
    };

    // Confirm and execute delete
    const confirmDelete = async () => {
      try {
        isLoading.value = true;
        await profileService.deleteProfile(profileId.value);
        showDeleteModal.value = false;
        // Show success message (có thể dùng toast notification sau)
        router.push('/');
      } catch (err) {
        console.error('Error deleting profile:', err);
        // Show error message (có thể dùng toast notification sau)
        alert('Không thể xóa hồ sơ. Vui lòng thử lại sau.');
      } finally {
        isLoading.value = false;
      }
    };
    
    return {
      profile,
      loading,
      error,
      suggestedProfiles,
      isOwner,
      toggleProfileStatus,
      startConversation,
      shareProfile,
      fetchProfile,
      editSuccess,
      oldProfileId,
      isLoading,
      isLiked,
      likesCount,
      toggleLike,
      comments,
      newComment,
      hasMoreComments,
      submitComment,
      likeComment,
      replyToComment,
      loadMoreComments,
      updateProfileStatus,
      statusOptions,
      showStatusModal,
      isAdmin,
      deleteProfile,
      scrollToSuggestions,
      suggestionSectionRef,
      showSuggestionGuide,
      closeGuideTour,
      showImageUploadModal,
      handleImageUploadSuccess,
      showDeleteModal,
      confirmDelete,
      showProfileImagePreview,
      profilePreviewImageSrc,
      openProfileImagePreview,
      closeProfileImagePreview,
    };
  },
};
</script>

<style scoped>
.animate__fadeIn {
  animation: fadeIn 0.2s ease-out;
  max-width: calc(100vw - 16px);
  /* Ensure dropdown fits within viewport */
  overflow-x: auto;
}

@keyframes pulse-slow {
  0% {
    transform: translateX(-100%);
  }

  50% {
    transform: translateX(0%);
  }

  100% {
    transform: translateX(100%);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 4s linear infinite;
}

/* Shimmer animation for banner background */
@keyframes shimmer {
  0% {
    opacity: 0.3;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 0.3;
  }
}

.animate-shimmer {
  animation: shimmer 3s ease-in-out infinite;
}

/* Sparkle animation */
@keyframes sparkle {

  0%,
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }

  50% {
    opacity: 0.7;
    transform: scale(1.2) rotate(180deg);
  }
}

.animate-sparkle {
  animation: sparkle 2s ease-in-out infinite;
}

/* Ping slow for button */
@keyframes ping-slow {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping-slow {
  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Glow animation for button */
@keyframes glow {

  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }

  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}

/* Shine effect for button */
@keyframes shine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }

  100% {
    transform: translateX(200%) translateY(200%) rotate(45deg);
  }
}

.animate-shine {
  animation: shine 3s ease-in-out infinite;
}

/* Bounce slow for arrow icon */
@keyframes bounce-slow {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 1.5s ease-in-out infinite;
}

/* Slide right animation */
@keyframes slide-right {

  0%,
  100% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(3px);
  }
}

.animate-slide-right {
  animation: slide-right 1.5s ease-in-out infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM36 4V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

@keyframes button-glow {

  0%,
  100% {
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
  }

  50% {
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.8);
  }
}

.action-btn:hover {
  animation: button-glow 2s infinite;
}

@media (max-width: 640px) {
  .action-btn-text {
    display: none;
  }

  .action-btn-icon {
    margin-right: 0;
  }

  .min-w-\[200px\] {
    min-width: 180px;
    width: calc(100vw - 32px);
    right: 8px;
    left: auto;
  }
}

.relative {
  position: relative;
  z-index: 10;
}

.animate__fadeIn {
  z-index: 9999;
}

/* Modal styles */
.fixed {
  position: fixed;
  z-index: 9999;
}

.bg-black {
  background-color: rgba(0, 0, 0, 0.7) !important;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-xl {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.1) !important;
}

.max-w-md {
  max-width: 28rem;
}

.overflow-y-auto {
  overflow-y: auto !important;
}

.p-4 {
  padding: 1rem !important;
}

.px-6 {
  padding-left: 1.5rem !important;
  padding-right: 1.5rem !important;
}

.py-4 {
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
}

.border-b {
  border-bottom-width: 1px;
}

.border-t {
  border-top-width: 1px;
}

.border-gray-200 {
  border-color: #edf2f7;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.text-gray-900 {
  color: #111827;
}

.text-gray-600 {
  color: #4b5563;
}

.text-gray-500 {
  color: #6b7280;
}

.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1) !important;
}

.disabled\:opacity-50:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cursor-not-allowed {
  cursor: not-allowed;
}

.overflow-hidden {
  overflow: hidden;
}

.overflow-auto {
  overflow: auto;
}
</style>