<template>
  <div class="messages-view h-screen flex flex-col bg-gray-50">
    <AppHeader class="flex-shrink-0" />
    
    <!-- Main content - fixed position and full width -->
    <div class="flex-1 overflow-hidden pt-16 md:pt-20">
      <div class="h-full bg-white shadow-lg border border-gray-100">
        <div class="flex flex-col sm:flex-row h-full">
          <!-- Sidebar: List of conversations -->
          <div class="w-full sm:w-2/5 md:w-1/3 lg:w-1/4 border-r border-gray-200 flex flex-col 
              relative flex-shrink-0 overflow-hidden" :class="[
                isMobile && currentConversation ?
                  showConversationList ? 'h-[40vh]' : 'h-[60px]'
                  : 'h-full'
              ]">
            <div class="p-3 border-b border-gray-100 bg-gradient-to-r from-blue-400 to-indigo-600 
                 flex justify-between items-center min-h-[60px]">
              <h2 class="text-white font-bold text-lg sm:text-xl flex items-center">
                <i class="fas fa-comments mr-2"></i> Tin nhắn
              </h2>
              <button v-if="isMobile && currentConversation" @click="toggleConversationList"
                class="text-white hover:bg-blue-700 p-1.5 rounded transition-colors">
                <i class="fas"
                  :class="[showConversationList ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto conversations-list"
              :class="{ 'hidden': isMobile && currentConversation && !showConversationList }">
              <div v-if="loading" class="p-8 text-center">
                <AppLoader />
              </div>
              <div v-else-if="conversations.length === 0" class="p-8 text-center text-gray-500">
                <div
                  class="bg-blue-50 rounded-full p-6 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <i class="far fa-comment-dots text-3xl text-blue-400"></i>
                </div>
                <p class="text-gray-600 font-medium text-sm">Bạn chưa có cuộc trò chuyện nào</p>
                <p class="text-gray-400 text-xs mt-1">Hãy bắt đầu trò chuyện với ai đó</p>
              </div>
              <div v-else>
                <div v-for="conversation in conversations" :key="conversation.id"
                  @click="selectConversation(conversation)"
                  class="p-3 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-all duration-200 ease-in-out"
                  :class="[currentConversation?.id === conversation.id ? 'bg-blue-50 border-l-4 border-blue-500' : '']">
                  <div class="flex items-center">
                    <div class="relative">
                      <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 
                           flex items-center justify-center text-white shadow-md">
                        <i class="fas fa-user"></i>
                      </div>
                      <div v-if="conversation.online_status" class="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 
                           rounded-full border-2 border-white"></div>
                    </div>
                    <div class="flex-1 ml-3 overflow-hidden">
                      <div class="flex justify-between">
                        <p class="font-medium text-gray-800 truncate text-sm">
                          {{ conversation.other_user.username || 'Người dùng' }}
                        </p>
                        <p class="text-xs text-gray-400">
                          {{ formatShortTime(conversation.last_message?.created_at) }}
                        </p>
                      </div>
                      <div class="flex justify-between items-center mt-1">
                        <p
                          class="text-xs sm:text-sm text-gray-500 truncate max-w-[120px] sm:max-w-[150px]">
                          <span v-if="conversation.last_message?.is_mine"
                            class="text-xs text-gray-400 mr-1">
                            <i class="fas fa-reply text-xs rotate-180"></i>
                          </span>
                          {{ conversation.last_message?.content || 'Bắt đầu cuộc trò chuyện...' }}
                        </p>
                        <span v-if="conversation.unread_count"
                          class="ml-1 bg-blue-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                          {{ conversation.unread_count }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Main chat area -->
          <div class="flex-1 flex flex-col h-full overflow-hidden"
            :class="{ 'hidden': isMobile && !currentConversation }">
            <div v-if="!currentConversation" class="flex-1 flex items-center justify-center bg-gray-50 p-4">
              <div class="text-center p-4 sm:p-8 max-w-md">
                <div class="bg-blue-50 rounded-full p-6 sm:p-8 w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 
                     flex items-center justify-center">
                  <i class="far fa-comment-dots text-4xl sm:text-5xl text-blue-400"></i>
                </div>
                <h3 class="text-lg sm:text-xl font-bold text-gray-700 mb-2">Tin nhắn của bạn</h3>
                <p class="text-sm text-gray-500 mb-4 sm:mb-6">Bắt đầu một cuộc trò chuyện mới bằng cách
                  nhấn nút Liên hệ với chủ bài đăng trong trang chi tiết bài đăng.</p>
                <button
                  class="bg-blue-500 hover:bg-blue-400 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors flex items-center mx-auto text-sm cursor-pointer"
                  @click="turnBacktoHome">
                  <i class="fas fa-home text-xs sm:text-sm mr-2"></i> Quay về trang chủ
                </button>
              </div>
            </div>

            <template v-else>
              <!-- Chat header -->
              <div class="p-3 border-b border-gray-200 flex items-center bg-white shadow-sm">
                <button v-if="isMobile" @click="toggleConversationList"
                  class="mr-2 text-blue-500 hover:bg-blue-50 p-1.5 rounded-full transition-colors">
                  <i class="fas"
                    :class="[showConversationList ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
                </button>
                <div class="relative">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 
                       flex items-center justify-center text-white shadow-sm">
                    <i class="fas fa-user"></i>
                  </div>
                  <div class="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 
                       rounded-full border-2 border-white"></div>
                </div>
                <div class="ml-2 sm:ml-3 flex-1">
                  <h2 class="font-semibold text-gray-800 text-sm sm:text-base truncate">
                    {{ currentConversation.other_user.username }}
                  </h2>
                  <!-- Thông tin trạng thái thay thế cho link hồ sơ -->
                  <p class="text-xs text-gray-400 hidden sm:block"
                    v-if="currentConversation.online_status">
                    Đang hoạt động
                  </p>
                </div>
                <div class="flex items-center space-x-1">
                  <!-- Nút đi đến hồ sơ liên quan (thay thế nút ba chấm) -->
                  <router-link v-if="currentConversation.related_profile_id"
                    :to="`/profile/${currentConversation.related_profile_id}`"
                    class="text-gray-500 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-colors group relative"
                    title="Đi đến hồ sơ liên quan">
                    <i class="fas fa-user-circle"></i>
                    <!-- Tooltip -->
                    <span
                      class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      Xem hồ sơ
                    </span>
                  </router-link>

                  <!-- Nút đi đến báo cáo liên quan -->
                  <router-link v-if="currentConversation.related_report_id"
                    :to="`/recently-missing/${currentConversation.related_report_id}`"
                    class="text-gray-500 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-colors group relative"
                    title="Đi đến báo cáo liên quan">
                    <i class="fas fa-user-circle"></i>
                    <!-- Tooltip -->
                    <span
                      class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      Xem báo cáo
                    </span>
                  </router-link>

                  <!-- Delete conversation button -->
                  <button @click="confirmDelete"
                    class="text-gray-500 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors group relative cursor-pointer"
                    title="Xóa cuộc trò chuyện">
                    <i class="fas fa-trash-alt"></i>
                    <!-- Tooltip -->
                    <span
                      class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      Xóa chat
                    </span>
                  </button>
                </div>
              </div>

              <!-- Messages area -->
              <div class="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 
                   bg-gradient-to-b from-blue-50/30 to-white" ref="messagesContainer">
                <div v-if="loadingMessages" class="flex justify-center py-8 sm:py-12">
                  <AppLoader />
                </div>
                <div v-else-if="messages.length === 0"
                  class="flex flex-col items-center justify-center h-full text-center p-4 sm:p-6">
                  <div class="bg-blue-50 rounded-full p-4 sm:p-6 w-16 h-16 sm:w-20 sm:h-20 
                       mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                    <i class="far fa-paper-plane text-2xl sm:text-3xl text-blue-400"></i>
                  </div>
                  <p class="text-sm sm:text-base text-gray-600 font-medium">Chưa có tin nhắn</p>
                  <p class="text-xs sm:text-sm text-gray-400 mt-1">Hãy bắt đầu cuộc trò chuyện!</p>
                </div>
                <template v-else>
                  <!-- Date separator -->
                  <div v-for="(messageGroup, date) in groupedMessages" :key="date">
                    <div class="flex justify-center my-3 sm:my-4">
                      <span class="bg-gray-200 text-gray-500 text-xs px-3 py-1 rounded-full">
                        {{ formatDate(date) }}
                      </span>
                    </div>

                    <!-- Messages -->
                    <div v-for="(message, i) in messageGroup" :key="message.id"
                      class="flex items-end animation-fade-in" :class="[
                        message.is_mine ? 'justify-end' : 'justify-start',
                        getSameUserClass(message, messageGroup[i - 1])
                      ]">

                      <!-- Avatar (only show for first message in group) -->
                      <div v-if="!message.is_mine && isFirstInGroup(message, messageGroup[i - 1])"
                        class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-300 to-blue-400 flex-shrink-0 
                          flex items-center justify-center text-white mr-1 sm:mr-2 shadow-sm">
                        <i class="fas fa-user text-[8px] sm:text-xs"></i>
                      </div>
                      <div v-else-if="!message.is_mine" class="w-6 sm:w-8 mr-1 sm:mr-2"></div>

                      <!-- Message bubble -->
                      <div class="max-w-[75%] rounded-2xl px-3 sm:px-4 py-2 shadow-sm mb-1 text-sm"
                        :class="message.is_mine
                          ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-tr-none'
                          : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'">
                        <p class="whitespace-pre-line text-xs sm:text-sm">{{ message.content }}
                        </p>
                        <p class="text-[8px] sm:text-[10px] mt-0.5 sm:mt-1 text-right"
                          :class="message.is_mine ? 'text-blue-100' : 'text-gray-400'">
                          {{ formatTime(message.created_at) }}
                          <span v-if="message.is_mine" class="ml-1">
                            <i class="fas fa-check-double"
                              :class="message.read ? 'text-blue-300' : ''"></i>
                          </span>
                        </p>
                      </div>

                      <!-- Avatar (only show for first message in group) -->
                      <div v-if="message.is_mine && isFirstInGroup(message, messageGroup[i - 1])"
                        class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-indigo-500 to-blue-400 flex-shrink-0 
                          flex items-center justify-center text-white ml-1 sm:ml-2 shadow-sm">
                        <i class="fas fa-user text-[8px] sm:text-xs"></i>
                      </div>
                      <div v-else-if="message.is_mine" class="w-6 sm:w-8 ml-1 sm:ml-2"></div>
                    </div>
                  </div>

                  <!-- Typing indicator -->
                  <div v-if="isTyping" class="flex items-start mt-2">
                    <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex-shrink-0 
                         flex items-center justify-center text-blue-500 mr-1 sm:mr-2">
                      <i class="fas fa-user text-[8px] sm:text-xs"></i>
                    </div>
                    <div
                      class="max-w-[75%] rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-100 shadow-sm">
                      <div class="flex space-x-1">
                        <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300 animate-bounce"
                          style="animation-delay: 0ms"></div>
                        <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300 animate-bounce"
                          style="animation-delay: 150ms"></div>
                        <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300 animate-bounce"
                          style="animation-delay: 300ms"></div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>

              <!-- Input area -->
              <div class="p-2 sm:p-3 border-t border-gray-200 bg-white">
                <form @submit.prevent="sendMessage" class="flex items-center">
                  <button type="button" class="p-1.5 sm:p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 
                         rounded-full transition-colors mr-1">
                    <i class="far fa-smile"></i>
                  </button>
                  <button type="button" class="p-1.5 sm:p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 
                         rounded-full transition-colors mr-1 sm:mr-2">
                    <i class="fas fa-paperclip"></i>
                  </button>
                  <input v-model="newMessage" type="text"
                    class="flex-1 border border-gray-300 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-xs sm:text-sm"
                    placeholder="Nhập tin nhắn..." />
                  <button type="submit" :disabled="!newMessage.trim()" class="ml-1 sm:ml-2 bg-blue-500 hover:bg-blue-400 text-white p-1.5 sm:p-2 
                      w-8 h-8 sm:w-10 sm:h-10 rounded-full disabled:opacity-50 disabled:cursor-not-allowed 
                      transition-colors flex items-center justify-center">
                    <i class="fas fa-paper-plane text-xs sm:text-base"></i>
                  </button>
                </form>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal"
      class="fixed inset-0 bg-opacity-50 bg-gray-300 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <i class="fas fa-exclamation-triangle text-red-500"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 ml-3">Xóa cuộc trò chuyện</h3>
        </div>

        <p class="text-gray-600 mb-6">
          Bạn có chắc chắn muốn xóa cuộc trò chuyện này? Hành động này không thể hoàn tác và toàn bộ tin nhắn
          sẽ bị xóa.
        </p>

        <div class="flex justify-end space-x-3">
          <button @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
            Hủy
          </button>
          <button @click="deleteConversation"
            class="px-4 py-2 bg-red-600 rounded-md text-white hover:bg-red-700 transition-colors flex items-center">
            <span v-if="isDeleting"
              class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            <span>{{ isDeleting ? 'Đang xóa...' : 'Xóa cuộc trò chuyện' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import messageService from '@/services/messageService';
import AppHeader from '@/components/common/AppHeader.vue';
import AppLoader from '@/components/common/AppLoader.vue';

export default {
    name: 'MessagesView',
    components: {
        AppHeader,
        AppLoader
    },
    setup() {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();

        // State
        const conversations = computed(() => store.getters['message/allConversations']);
        const messages = computed(() => store.getters['message/allMessages']);
        const currentConversation = computed(() => store.getters['message/currentConversation']);
        const loading = computed(() => store.state.message.loading);
        const error = computed(() => store.state.message.error);

        const loadingMessages = ref(false);
        const newMessage = ref('');
        const messagesContainer = ref(null);
        const isTyping = ref(false);
        const isMobile = ref(window.innerWidth < 640);
        const showConversationList = ref(true);

        // Add delete conversation state
        const showDeleteModal = ref(false);
        const isDeleting = ref(false);

        // Group messages by date
        const groupedMessages = computed(() => {
            const groups = {};

            messages.value.forEach(message => {
                const date = new Date(message.created_at).toLocaleDateString();
                if (!groups[date]) {
                    groups[date] = [];
                }
                groups[date].push(message);
            });

            return groups;
        });

        // Check if window size changes (for responsive)
        window.addEventListener('resize', () => {
            isMobile.value = window.innerWidth < 640;
            if (!isMobile.value) {
                showConversationList.value = true;
            }
        });

        // Helper for toggling conversation list on mobile
        const toggleConversationList = () => {
            showConversationList.value = !showConversationList.value;
        };

        // Helper for back button on mobile
        const backToList = () => {
            store.dispatch('message/setCurrentConversation', null);
            showConversationList.value = true;
        };

        // Determine if a message is first in a group (for avatar display)
        const isFirstInGroup = (message, prevMessage) => {
            if (!prevMessage) return true;
            return message.is_mine !== prevMessage.is_mine;
        };

        // Get class based on message grouping
        const getSameUserClass = (message, prevMessage) => {
            if (!prevMessage) return '';
            return message.is_mine === prevMessage.is_mine ? 'mt-1' : 'mt-3 sm:mt-4';
        };

        const currentUser = computed(() => {
            const storeUser = store.getters['auth/currentUser'];

            if (storeUser) {
                return storeUser;
            }

            try {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    return JSON.parse(userStr);
                }
            } catch (e) {
                console.error("Error parsing user from localStorage:", e);
            }

            return null;
        });

        // Format date for message group headers
        const formatDate = (dateString) => {
            const today = new Date().toLocaleDateString();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toLocaleDateString();

            if (dateString === today) {
                return 'Hôm nay';
            } else if (dateString === yesterdayStr) {
                return 'Hôm qua';
            } else {
                const date = new Date(dateString);
                return new Intl.DateTimeFormat('vi-VN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }).format(date);
            }
        };

        // Format time for messages
        const formatTime = (dateString) => {
            if (!dateString) return '';

            const date = new Date(dateString);
            return new Intl.DateTimeFormat('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        };

        // Format short time for conversation list
        const formatShortTime = (dateString) => {
            if (!dateString) return '';

            const date = new Date(dateString);
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const messageDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

            // If today, show time only
            if (messageDay.getTime() === today.getTime()) {
                return new Intl.DateTimeFormat('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit'
                }).format(date);
            }

            // If this week, show day of week
            const daysDiff = Math.floor((today - messageDay) / (1000 * 60 * 60 * 24));
            if (daysDiff < 7) {
                const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
                return dayNames[date.getDay()];
            }

            // Otherwise show short date
            return new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit'
            }).format(date);
        };

        // Rest of the code remains similar
        const fetchConversations = async () => {
            try {
                const resultConversations = await store.dispatch('message/fetchConversations');

                const sessionId = parseInt(route.query.session);
                if (sessionId) {
                    const conversation = resultConversations.find(c => c.id === sessionId);
                    if (conversation) {
                        selectConversation(conversation);
                    }
                } else if (resultConversations.length > 0 && !isMobile.value) {
                    selectConversation(resultConversations[0]);
                }
            } catch (err) {
                console.error('Failed to fetch conversations:', err);
            }
        };

        const selectConversation = (conversation) => {
            if (!conversation || !conversation.id) {
                console.error("Invalid conversation object received");
                return;
            }

            store.dispatch('message/setCurrentConversation', conversation);

            router.replace({
                query: { ...route.query, session: conversation.id }
            });

            if (isMobile.value) {
                showConversationList.value = false;
            }
        };

        const sendMessage = async () => {
            if (!newMessage.value.trim() || !currentConversation.value) return;

            try {
                const messageContent = newMessage.value.trim();

                await store.dispatch('message/sendMessage', {
                    conversationId: currentConversation.value.id,
                    content: messageContent
                });

                newMessage.value = '';

                await nextTick();
                scrollToBottom();
            } catch (err) {
                console.error('Failed to send message:', err);
                alert('Không thể gửi tin nhắn. Vui lòng thử lại.');
            }
        };

        const scrollToBottom = () => {
            if (messagesContainer.value) {
                messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
            }
        };

        const turnBacktoHome = () => {
            router.push({ path: '/' });
        };

        // Function to show delete confirmation modal
        const confirmDelete = () => {
            showDeleteModal.value = true;
        };

        // Function to delete the conversation
        const deleteConversation = async () => {
            if (!currentConversation.value) return;

            try {
                isDeleting.value = true;

                // Call API to delete conversation
                await store.dispatch('message/deleteConversation', currentConversation.value.id);

                // Close modal and reset current conversation
                showDeleteModal.value = false;
                store.dispatch('message/setCurrentConversation', null);
                showConversationList.value = true;

                // Show success notification (optional)
                if (window.toast) {
                    window.toast.success('Cuộc trò chuyện đã được xóa thành công');
                }
            } catch (err) {
                console.error('Failed to delete conversation:', err);
                if (window.toast) {
                    window.toast.error('Không thể xóa cuộc trò chuyện. Vui lòng thử lại.');
                } else {
                    alert('Không thể xóa cuộc trò chuyện. Vui lòng thử lại.');
                }
            } finally {
                isDeleting.value = false;
            }
        };

        onMounted(() => {
            if (!currentUser.value) {
                router.push({ path: '/auth', query: { redirect: route.fullPath } });
                return;
            }

            fetchConversations();
            store.dispatch('message/subscribeToMessages');

            // Simulate typing indicator occasionally
            setInterval(() => {
                if (Math.random() > 0.7 && currentConversation.value) {
                    isTyping.value = true;
                    setTimeout(() => {
                        isTyping.value = false;
                    }, 3000);
                }
            }, 10000);
        });

        watch(messages, () => {
            nextTick(() => {
                scrollToBottom();
            });
        }, { deep: true });

        return {
            conversations,
            currentConversation,
            messages,
            groupedMessages,
            newMessage,
            loading,
            loadingMessages,
            error,
            currentUser,
            messagesContainer,
            isTyping,
            isMobile,
            showConversationList,
            // Add new state and methods
            showDeleteModal,
            isDeleting,
            confirmDelete,
            deleteConversation,
            // Existing returns...
            turnBacktoHome,
            formatDate,
            formatTime,
            formatShortTime,
            selectConversation,
            backToList,
            isFirstInGroup,
            getSameUserClass,
            sendMessage,
            toggleConversationList
        };
    }
}
</script>

<style scoped>
.conversations-list::-webkit-scrollbar,
.messages-container::-webkit-scrollbar {
    width: 4px;
}

.conversations-list::-webkit-scrollbar-thumb,
.messages-container::-webkit-scrollbar-thumb {
    background-color: rgba(203, 213, 225, 0.8);
    border-radius: 10px;
}

.conversations-list::-webkit-scrollbar-track,
.messages-container::-webkit-scrollbar-track {
    background-color: rgba(241, 245, 249, 0.3);
}

/* Simple animation for new messages */
@keyframes newMessage {
    0% {
        transform: translateY(10px);
        opacity: 0;
    }

    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

.animation-fade-in {
    animation: newMessage 0.3s ease-out forwards;
}

.messages-view {
    background-image: linear-gradient(to bottom, rgba(241, 245, 249, 0.8), rgba(249, 250, 251, 0.9));
    min-height: 100vh;
}
</style>