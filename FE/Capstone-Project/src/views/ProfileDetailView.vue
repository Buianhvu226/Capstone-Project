<template>
  <div>
    <AppHeader />
    <div class="container mx-auto px-4 py-8 pt-16">
      <!-- Display loading state -->
      <div v-if="loading" class="flex justify-center py-12">
        <AppLoader />
      </div>
      <div v-else-if="profile" class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Header Section - Màu nhẹ hơn -->
        <div
          class="bg-gradient-to-br from-blue-400 via-blue-400 to-blue-500 rounded-t-xl shadow-xl relative overflow-hidden">
          <!-- Background decorative elements -->
          <div class="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div class="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div class="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-16"></div>

          <div class="relative px-6 py-8">
            <!-- Top row: Status badge -->
            <div class="flex justify-between items-start mb-6">
              <div class="flex items-center gap-3">
                <!-- Profile status indicator -->
                <div class="flex items-center">
                  <div class="relative">
                    <div class="w-3 h-3 rounded-full animate-pulse" :class="{
                      'bg-green-400': profile.status === 'active',
                      'bg-blue-400': profile.status === 'found',
                      'bg-gray-400': profile.status === 'closed'
                    }"></div>
                    <div class="absolute inset-0 w-3 h-3 rounded-full animate-ping" :class="{
                      'bg-green-400': profile.status === 'active',
                      'bg-blue-400': profile.status === 'found',
                      'bg-gray-400': profile.status === 'closed'
                    }"></div>
                  </div>
                  <span class="ml-2 text-white/90 text-sm font-medium">
                    {{ getStatusText(profile.status) }}
                  </span>
                </div>

                <!-- Additional metadata -->
                <div class="hidden sm:flex items-center text-white/70 text-xs">
                  <span>ID: {{ profile.id }}</span>
                  <span class="mx-2">•</span>
                  <span>{{ formatDate(profile.created_at) }}</span>
                  <span v-if="profile.view_count" class="mx-2">•</span>
                  <span v-if="profile.view_count">{{ profile.view_count }} lượt xem</span>
                </div>
              </div>

              <!-- Change Status Button for Owner -->
              <div v-if="isOwner">
                <button @click="showStatusModal = true" :disabled="isLoading"
                  class="inline-flex items-center px-3 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg text-sm font-medium transition-all hover:scale-105">
                  <i class="fas fa-exchange-alt mr-2"></i>
                  <span class="hidden sm:inline">Thay đổi trạng thái</span>
                </button>
              </div>
            </div>

            <!-- Main title -->
            <div class="mb-6">
              <h1 class="text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                {{ profile.title }}
              </h1>
              <div class="flex flex-wrap items-center gap-4 text-white/80">
                <span class="flex items-center text-sm">
                  <i class="fas fa-user-circle mr-1"></i>
                  Đăng bởi {{ profile.username }}
                </span>
                <span v-if="profile.status === 'found'" class="flex items-center text-sm">
                  <div class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Đã tìm thấy
                </span>
              </div>
            </div>

            <!-- Action buttons row -->
            <div class="flex flex-wrap items-center gap-3">
              <!-- Owner controls -->
              <template v-if="isOwner">
                <router-link :to="`/profile/edit/${profile.id}`"
                  class="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-medium transition-all hover:scale-105">
                  <i class="fas fa-edit mr-2"></i>
                  <span class="hidden sm:inline">Chỉnh sửa</span>
                </router-link>
                <router-link :to="`/profiles/${profile.id}/upload-image`"
                  class="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-medium transition-all hover:scale-105">
                  <i class="fas fa-camera mr-2"></i>
                  <span class="hidden sm:inline">{{ profile.images ? 'Cập nhật ảnh' : 'Thêm ảnh' }}</span>
                </router-link>
              </template>
              <!-- Non-owner controls -->
              <template v-else>
                <button @click="startConversation"
                  class="inline-flex items-center px-6 py-2 bg-white hover:bg-gray-50 text-blue-600 rounded-lg font-medium transition-all hover:scale-105 shadow-lg">
                  <i class="fas fa-envelope mr-2"></i>
                  <span>Liên hệ</span>
                </button>
              </template>
              <!-- Share button -->
              <button @click="shareProfile"
                class="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-medium transition-all hover:scale-105">
                <i class="fas fa-share-alt mr-2"></i>
                <span class="hidden sm:inline">Chia sẻ</span>
              </button>
              <!-- Loading indicator when updating status -->
              <div v-if="isLoading" class="inline-flex items-center px-4 py-2 bg-white/20 rounded-lg">
                <i class="fas fa-circle-notch fa-spin mr-2 text-white"></i>
                <span class="text-white text-sm">Đang cập nhật...</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex flex-col lg:flex-row">
          <!-- Left Column - Images and Details -->
          <div class="lg:w-1/3 p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
            <!-- Image Gallery -->
            <div class="mb-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Hình ảnh</h3>
                <router-link v-if="isOwner" :to="`/profiles/${profile.id}/upload-image`"
                  class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition flex items-center">
                  <i class="fas fa-upload mr-1"></i>
                  {{ profile.images ? 'Cập nhật ảnh' : 'Thêm ảnh' }}
                </router-link>
              </div>
              <div class="relative h-72 rounded-lg overflow-hidden bg-gray-100 shadow-inner">
                <img v-if="profile.images" :src="profile.images" :alt="profile.title"
                  class="w-full h-full object-contain" @error="handleImageError" />
                <div v-else class="flex flex-col items-center justify-center h-full">
                  <i class="fas fa-image text-4xl text-gray-400 mb-2"></i>
                  <p class="text-gray-500 text-center">Không có hình ảnh</p>
                  <router-link v-if="isOwner" :to="`/profiles/${profile.id}/upload-image`"
                    class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
                    <i class="fas fa-cloud-upload-alt mr-2"></i>
                    Tải ảnh lên
                  </router-link>
                </div>
              </div>
              <!-- Likes -->
              <div class="flex items-center justify-between mt-3 px-1">
                <div class="flex items-center">
                  <button @click="toggleLike" class="flex items-center focus:outline-none group">
                    <div
                      :class="`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isLiked ? 'bg-red-100' : 'bg-gray-100 group-hover:bg-red-50'}`">
                      <i
                        :class="`fas fa-heart transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 group-hover:text-red-400'}`"></i>
                    </div>
                    <span class="ml-2 text-sm font-medium" :class="isLiked ? 'text-red-500' : 'text-gray-600'">
                      {{ likesCount }} lượt cảm xúc
                    </span>
                  </button>
                </div>
                <div class="text-sm text-gray-500">
                  <i class="far fa-eye mr-1"></i> {{ profile.view_count || 1220 }} lượt xem
                </div>
              </div>
            </div>
            <!-- Status Badge -->
            <div class="mb-6">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" :class="{
                'bg-green-100 text-green-800': profile.status === 'active',
                'bg-blue-100 text-blue-800': profile.status === 'found',
                'bg-gray-100 text-gray-800': profile.status === 'closed'
              }">
                <span class="w-2 h-2 rounded-full mr-2" :class="{
                  'bg-green-500': profile.status === 'active',
                  'bg-blue-500': profile.status === 'found',
                  'bg-gray-500': profile.status === 'closed'
                }"></span>
                {{ getStatusText(profile.status) }}
              </span>
            </div>
            <!-- Basic Information -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Thông tin cơ bản</h3>
              <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                <div class="grid grid-cols-2 gap-2">
                  <div class="text-sm text-gray-500">Họ và tên:</div>
                  <div class="text-sm font-medium text-gray-800">{{ profile.full_name }}</div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div class="text-sm text-gray-500">Năm sinh:</div>
                  <div class="text-sm font-medium text-gray-800">{{ profile.born_year || 'Không rõ' }}</div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div class="text-sm text-gray-500">Năm thất lạc:</div>
                  <div class="text-sm font-medium text-gray-800">{{ profile.losing_year || 'Không rõ' }}</div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div class="text-sm text-gray-500">Tên cha:</div>
                  <div class="text-sm font-medium text-gray-800">{{ profile.name_of_father || 'Không rõ' }}</div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div class="text-sm text-gray-500">Tên mẹ:</div>
                  <div class="text-sm font-medium text-gray-800">{{ profile.name_of_mother || 'Không rõ' }}</div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div class="text-sm text-gray-500">Anh chị em:</div>
                  <div class="text-sm font-medium text-gray-800">{{ profile.siblings || 'Không rõ' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Description and Comments -->
          <div class="md:w-2/3 p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Thông tin chi tiết</h3>
            <div class="prose prose-blue max-w-none mb-6">
              <p class="whitespace-pre-line" v-html="formatDescription(profile.description)"></p>
            </div>
            <!-- Tags -->
            <div v-if="profile.tags && profile.tags.length > 0" class="mb-6">
              <div class="flex flex-wrap gap-2">
                <span v-for="tag in profile.tags" :key="tag"
                  class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                  {{ tag }}
                </span>
              </div>
            </div>
            <!-- Found Notification -->
            <div v-if="profile.status === 'found'" class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-6">
              <div class="flex">
                <div class="flex-shrink-0">
                  <i class="fas fa-check-circle text-blue-600"></i>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-blue-800">Đã tìm thấy</h3>
                  <div class="mt-2 text-sm text-blue-700">
                    <p>Người thân trong hồ sơ này đã được tìm thấy.</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- Comments Section -->
            <div class="mt-6 border-t border-gray-200 pt-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Bình luận ({{ comments.length }})</h3>
              <!-- Comment Form -->
              <div class="mb-6">
                <form @submit.prevent="submitComment" class="space-y-3">
                  <div class="flex items-start">
                    <div class="flex-shrink-0 mr-3">
                      <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                        <i class="fas fa-user"></i>
                      </div>
                    </div>
                    <div class="flex-grow">
                      <textarea v-model="newComment" placeholder="Chia sẻ suy nghĩ của bạn về hồ sơ này..."
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows="2"></textarea>
                      <div class="flex justify-end mt-2">
                        <button type="submit" :disabled="!newComment.trim()"
                          :class="`px-4 py-2 rounded-md font-medium transition ${newComment.trim() ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`">
                          Gửi bình luận
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <!-- Comment List -->
              <div class="divide-y divide-gray-100">
                <div v-if="comments.length === 0" class="py-8 text-center text-gray-500">
                  <i class="far fa-comment-dots text-3xl mb-3 block text-gray-300"></i>
                  <p>Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ!</p>
                </div>
                <div v-for="comment in comments" :key="comment.id" class="py-4">
                  <div class="flex">
                    <div class="flex-shrink-0 mr-3">
                      <div v-if="comment.user_avatar" class="w-10 h-10 rounded-full overflow-hidden">
                        <img :src="comment.user_avatar" alt="Avatar" class="w-full h-full object-cover" />
                      </div>
                      <div v-else
                        class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                        <i class="fas fa-user"></i>
                      </div>
                    </div>
                    <div class="flex-grow">
                      <div class="flex items-center justify-between">
                        <h4 class="font-medium text-gray-800">{{ comment.user_name }}</h4>
                        <time class="text-xs text-gray-500">{{ formatDate(comment.created_at) }}</time>
                      </div>
                      <p class="mt-1 text-gray-700">{{ comment.content }}</p>
                      <div class="mt-2 flex items-center space-x-4 text-sm">
                        <button @click="likeComment(comment.id)"
                          class="flex items-center text-gray-500 hover:text-blue-600">
                          <i :class="`${comment.is_liked ? 'fas text-blue-600' : 'far'} fa-thumbs-up mr-1`"></i>
                          <span>{{ comment.likes || 0 }}</span>
                        </button>
                        <button @click="replyToComment(comment.id)"
                          class="flex items-center text-gray-500 hover:text-blue-600">
                          <i class="far fa-comment mr-1"></i>
                          <span>Trả lời</span>
                        </button>
                      </div>
                      <!-- Replies -->
                      <div v-if="comment.replies && comment.replies.length > 0" class="ml-6 mt-2 space-y-2">
                        <div v-for="reply in comment.replies" :key="reply.id"
                          class="border-l-2 border-gray-100 pl-3 py-1">
                          <div class="flex items-center justify-between">
                            <h5 class="font-medium text-gray-800 text-sm">{{ reply.user_name }}</h5>
                            <time class="text-xs text-gray-500">{{ formatDate(reply.created_at) }}</time>
                          </div>
                          <p class="text-sm text-gray-700 mt-1">{{ reply.content }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Pagination -->
              <div v-if="comments.length > 0 && hasMoreComments" class="mt-4 text-center">
                <button @click="loadMoreComments"
                  class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-blue-600 hover:bg-blue-50">
                  Xem thêm bình luận
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Section -->
        <div class="border-t border-gray-200 bg-gradient-to-r from-blue-50 to-blue-50 px-6 py-5">
          <div class="flex flex-col md:flex-row md:items-center justify-between">
            <div class="flex items-center">
              <div class="bg-blue-100 rounded-full p-2 mr-3">
                <i class="fas fa-hands-helping text-blue-600"></i>
              </div>
              <div>
                <h3 class="font-medium text-gray-800">Bạn có thông tin về người thân này?</h3>
                <p class="text-sm text-gray-600">Hãy liên hệ với người đăng tin để chia sẻ thông tin.</p>
              </div>
            </div>
            <button @click="startConversation"
              class="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition">
              <i class="fas fa-comment-alt mr-2"></i> Liên hệ ngay
            </button>
          </div>
        </div>

        <!-- Related Profiles Section -->
        <SuggestedProfilesSection v-if="suggestedProfiles.length > 0" :profiles="suggestedProfiles" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-lg p-8 text-center shadow-md">
        <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
        <p class="text-gray-600 mb-4">Có lỗi xảy ra khi tải thông tin hồ sơ.</p>
        <button @click="fetchProfile"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition">
          Thử lại
        </button>
      </div>

      <!-- Not Found State -->
      <div v-else-if="!loading && !error && !profile" class="bg-white rounded-lg p-8 text-center shadow-md">
        <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
        <p class="text-gray-600 mb-4">Không tìm thấy hồ sơ hoặc hồ sơ đã bị xóa.</p>
        <router-link to="/" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition">
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
      <div v-if="showStatusModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Thay đổi trạng thái hồ sơ</h3>
              <button @click="showStatusModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
            <p class="text-sm text-gray-600 mt-1">Chọn trạng thái phù hợp cho hồ sơ của bạn</p>
          </div>

          <!-- Modal Body -->
          <div class="px-6 py-4">
            <div class="space-y-3">
              <button v-for="status in statusOptions" :key="status.value" @click="updateProfileStatus(status.value)"
                :disabled="profile.status === status.value || isLoading"
                class="w-full p-4 text-left border-2 rounded-lg transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                :class="{
                  'border-blue-500 bg-blue-50': profile.status === status.value,
                  'border-gray-200 hover:border-gray-300': profile.status !== status.value
                }">
                <div class="flex items-center">
                  <!-- Status icon -->
                  <div class="flex items-center justify-center w-12 h-12 rounded-full mr-4" :class="status.bgClass">
                    <i :class="status.iconClass" class="text-lg"></i>
                  </div>

                  <!-- Status info -->
                  <div class="flex-1">
                    <div class="font-medium text-gray-900"
                      :class="{ 'text-blue-600': profile.status === status.value }">
                      {{ status.label }}
                    </div>
                    <div class="text-sm text-gray-500 mt-1">{{ status.description }}</div>
                  </div>

                  <!-- Current status indicator -->
                  <div v-if="profile.status === status.value" class="ml-3">
                    <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <i class="fas fa-check text-blue-600 text-sm"></i>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div class="flex justify-end space-x-3">
              <button @click="showStatusModal = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import profileService from '../services/profileService';
import noImage from '@/assets/images/no_image.png';
import AppLoader from '../components/common/AppLoader.vue';
import AppHeader from '../components/common/AppHeader.vue';
import SuggestedProfilesSection from '../components/profile/SuggestedProfilesSection.vue';
import messageService from '../services/messageService';

export default {
  name: 'ProfileDetailView',
  components: {
    AppHeader,
    AppLoader,
    SuggestedProfilesSection,
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
        iconClass: 'fas fa-check-circle text-blue-600',
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

    // Handle image errors
    const handleImageError = (event) => {
      event.target.src = noImage;
    };

    // Computed property for profile image
    const profileImage = computed(() => profile.value?.images || noImage);

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
        suggestedProfiles.value = Array.isArray(response.data) ? response.data : (response.data.results || []);
      } catch (err) {
        console.error('Error fetching suggested profiles:', err);
      }
    };

    // Format date
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date);
    };

    // Format date with time
    const formatDateWithTime = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    };

    // Get status text
    const getStatusText = (status) => {
      const statusMap = {
        active: 'Đang tìm kiếm',
        found: 'Đã tìm thấy',
        closed: 'Đã đóng',
      };
      return statusMap[status] || 'Không xác định';
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

    // Fetch comments
    const fetchComments = async (page = 1) => {
      try {
        if (page === 1) {
          comments.value = [
            {
              id: 1,
              user_name: 'Nguyễn Văn A',
              content: 'Tôi nghĩ mình đã từng gặp người này ở Đà Nẵng vào năm 2018. Có thể liên hệ thêm với tôi để biết chi tiết.',
              created_at: new Date(Date.now() - 86400000).toISOString(),
              likes: 3,
              is_liked: false,
              replies: [
                {
                  id: 101,
                  user_name: 'Trần Thị B',
                  content: 'Bạn có thể chia sẻ thêm thông tin được không?',
                  created_at: new Date(Date.now() - 43200000).toISOString(),
                },
              ],
            },
            {
              id: 2,
              user_name: 'Lê Văn C',
              content: 'Tôi có người quen ở quê này, để tôi hỏi thăm giúp bạn.',
              created_at: new Date(Date.now() - 172800000).toISOString(),
              likes: 5,
              is_liked: true,
              replies: [],
            },
          ];
        } else {
          comments.value = [
            ...comments.value,
            {
              id: 3,
              user_name: 'Phạm Văn D',
              content: 'Chia sẻ thông tin này đến người dân ở địa phương để hỗ trợ tìm kiếm nhé.',
              created_at: new Date(Date.now() - 259200000).toISOString(),
              likes: 2,
              is_liked: false,
              replies: [],
            },
          ];
        }
        hasMoreComments.value = page < 2;
        commentsPage.value = page;
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    // Submit comment
    const submitComment = async () => {
      if (!currentUser.value || !newComment.value.trim()) return;
      try {
        comments.value.unshift({
          id: Date.now(),
          user_name: currentUser.value.username || 'Người dùng',
          content: newComment.value,
          created_at: new Date().toISOString(),
          likes: 0,
          is_liked: false,
          replies: [],
        });
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

    // Format description
    const formatDescription = (text) => {
      if (!text) return '';
      return text.replace(/(Thông tin cơ bản:)/g, '<br/><strong class="text-blue-700">$1</strong>');
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
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    });

    watch(() => route.params.id, () => {
      fetchProfile();
    });

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

    return {
      profile,
      loading,
      error,
      profileImage,
      suggestedProfiles,
      isOwner,
      formatDate,
      formatDateWithTime,
      getStatusText,
      toggleProfileStatus,
      startConversation,
      shareProfile,
      fetchProfile,
      handleImageError,
      noImage,
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
      formatDescription,
      updateProfileStatus,
      statusOptions,
      showStatusModal,
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