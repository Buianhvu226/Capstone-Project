<template>
  <div class="h-screen bg-slate-50 flex flex-col overflow-hidden">
    <AppHeader class="flex-shrink-0" />
    
    <!-- Main content - Full height without overflow -->
    <div class="flex-1 overflow-hidden pt-16 sm:pt-20">
      <div class="h-full max-w-7xl mx-auto px-3 sm:px-4">
        <div class="h-full bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col">
          <div class="flex flex-1 overflow-hidden">
            <!-- Sidebar: List of conversations -->
            <div class="w-full sm:w-80 lg:w-96 border-r border-slate-200/80 flex flex-col flex-shrink-0 overflow-hidden"
              :class="[
                isMobile && currentConversation && !showConversationList ? 'hidden' : ''
              ]">
              <!-- Sidebar Header -->
              <div class="px-3 sm:px-4 py-3 border-b border-slate-200/80 bg-white flex-shrink-0">
                <div class="flex items-center justify-between">
                  <h2 class="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <i class="fas fa-comments text-blue-500"></i>
                    <span>Tin nhắn</span>
                  </h2>
                  <button v-if="isMobile && currentConversation" @click="toggleConversationList"
                    class="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                    <i class="fas" :class="[showConversationList ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
                  </button>
                </div>
              </div>

              <!-- Conversations List -->
              <div class="flex-1 overflow-y-auto conversations-list">
                <div v-if="loading" class="flex items-center justify-center py-12">
                  <AppLoader />
                </div>
                <div v-else-if="conversations.length === 0" class="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                    <i class="far fa-comment-dots text-2xl text-blue-500"></i>
                  </div>
                  <p class="text-sm font-medium text-slate-700 mb-1">Bạn chưa có cuộc trò chuyện nào</p>
                  <p class="text-xs text-slate-500">Hãy bắt đầu trò chuyện với ai đó</p>
                </div>
                <div v-else class="divide-y divide-slate-100">
                  <div v-for="conversation in conversations" :key="conversation.id"
                    @click="selectConversation(conversation)"
                    class="px-3 sm:px-4 py-3 cursor-pointer transition-colors hover:bg-slate-50/80"
                    :class="[
                      currentConversation?.id === conversation.id 
                        ? 'bg-blue-50/50 border-l-4 border-blue-500' 
                        : ''
                    ]">
                    <div class="flex items-center gap-3">
                      <!-- Avatar -->
                      <div class="relative flex-shrink-0">
                        <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 
                             flex items-center justify-center text-white shadow-sm">
                          <i class="fas fa-user text-xs"></i>
                        </div>
                        <div v-if="conversation.online_status" 
                          class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                      </div>
                      
                      <!-- Content -->
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-2 mb-1">
                          <p class="text-sm font-medium text-slate-900 truncate">
                            {{ conversation.other_user.username || 'Người dùng' }}
                          </p>
                          <p class="text-[10px] sm:text-xs text-slate-400 flex-shrink-0">
                            {{ formatShortTime(conversation.last_message?.created_at) }}
                          </p>
                        </div>
                        <div class="flex items-center justify-between gap-2">
                          <p class="text-xs text-slate-500 truncate flex-1">
                            <span v-if="conversation.last_message?.is_mine" class="text-slate-400 mr-1">
                              <i class="fas fa-reply text-[10px] rotate-180"></i>
                            </span>
                            {{ conversation.last_message?.content || 'Bắt đầu cuộc trò chuyện...' }}
                          </p>
                          <span v-if="conversation.unread_count"
                            class="ml-1 bg-blue-500 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1.5 flex-shrink-0">
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
            <div class="flex-1 flex flex-col overflow-hidden"
              :class="{ 'hidden': isMobile && !currentConversation }">
              
              <!-- Empty state -->
              <div v-if="!currentConversation" class="flex-1 flex items-center justify-center bg-slate-50 p-4 sm:p-6">
                <div class="text-center max-w-md">
                  <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                    <i class="far fa-comment-dots text-4xl sm:text-5xl text-blue-500"></i>
                  </div>
                  <h3 class="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Tin nhắn của bạn</h3>
                  <p class="text-sm text-slate-600 mb-6">
                    Bắt đầu một cuộc trò chuyện mới bằng cách nhấn nút Liên hệ với chủ bài đăng trong trang chi tiết bài đăng.
                  </p>
                  <button
                    class="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white 
                           rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow-md"
                    @click="turnBacktoHome">
                    <i class="fas fa-home"></i>
                    <span>Quay về trang chủ</span>
                  </button>
                </div>
              </div>

              <!-- Chat with conversation -->
              <template v-else>
                <!-- Chat header -->
                <div class="px-3 sm:px-4 py-3 border-b border-slate-200/80 bg-white flex-shrink-0">
                  <div class="flex items-center gap-3">
                    <button v-if="isMobile" @click="toggleConversationList"
                      class="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                      <i class="fas fa-arrow-left"></i>
                    </button>
                    
                    <!-- Avatar -->
                    <div class="relative flex-shrink-0">
                      <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 
                           flex items-center justify-center text-white shadow-sm">
                        <i class="fas fa-user text-xs"></i>
                      </div>
                      <div v-if="currentConversation.online_status" 
                        class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                    </div>
                    
                    <!-- User info -->
                    <div class="flex-1 min-w-0">
                      <h2 class="text-sm sm:text-base font-semibold text-slate-900 truncate">
                        {{ currentConversation.other_user.username }}
                      </h2>
                      <p class="text-xs text-slate-500" v-if="currentConversation.online_status">
                        Đang hoạt động
                      </p>
                    </div>
                    
                    <!-- Actions -->
                    <div class="flex items-center gap-1">
                      <router-link v-if="currentConversation.related_profile_id"
                        :to="`/profile/${currentConversation.related_profile_id}`"
                        class="p-2 rounded-lg text-slate-500 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                        title="Xem hồ sơ">
                        <i class="fas fa-user-circle text-sm"></i>
                      </router-link>
                      
                      <router-link v-if="currentConversation.related_report_id"
                        :to="`/recently-missing/${currentConversation.related_report_id}`"
                        class="p-2 rounded-lg text-slate-500 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                        title="Xem báo cáo">
                        <i class="fas fa-file-alt text-sm"></i>
                      </router-link>
                      
                      <button @click="confirmDelete"
                        class="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Xóa cuộc trò chuyện">
                        <i class="fas fa-trash-alt text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Messages area -->
                <div class="flex-1 overflow-y-auto p-3 sm:p-4 bg-slate-50/50 messages-container" 
                     ref="messagesContainer">
                  <div v-if="loadingMessages" class="flex justify-center py-8">
                    <AppLoader />
                  </div>
                  <div v-else-if="messages.length === 0"
                    class="flex flex-col items-center justify-center h-full text-center py-12">
                    <div class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                      <i class="far fa-paper-plane text-2xl text-blue-500"></i>
                    </div>
                    <p class="text-sm font-medium text-slate-700 mb-1">Chưa có tin nhắn</p>
                    <p class="text-xs text-slate-500">Hãy bắt đầu cuộc trò chuyện!</p>
                  </div>
                  <template v-else>
                    <!-- Date separator -->
                    <div v-for="(messageGroup, date) in groupedMessages" :key="date">
                      <div class="flex justify-center my-3 sm:my-4">
                        <span class="bg-white text-slate-500 text-[10px] sm:text-xs px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                          {{ formatDate(date) }}
                        </span>
                      </div>

                      <!-- Messages -->
                      <div v-for="(message, i) in messageGroup" :key="message.id"
                        class="flex items-end animation-fade-in"
                        :class="[
                          message.is_mine ? 'justify-end' : 'justify-start',
                          getSameUserClass(message, messageGroup[i - 1])
                        ]">
                        <!-- Avatar (left side for received messages) -->
                        <div v-if="!message.is_mine && isFirstInGroup(message, messageGroup[i - 1])"
                          class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-300 to-blue-400 
                                flex-shrink-0 flex items-center justify-center text-white mr-2 shadow-sm">
                          <i class="fas fa-user text-[10px]"></i>
                        </div>
                        <div v-else-if="!message.is_mine" class="w-7 sm:w-8 mr-2"></div>

                        <!-- Message bubble -->
                        <div class="max-w-[75%] sm:max-w-[70%] rounded-2xl px-3 sm:px-4 py-2 shadow-sm mb-1"
                          :class="message.is_mine
                            ? 'bg-blue-500 text-white rounded-br-sm'
                            : 'bg-white border border-slate-200/80 text-slate-900 rounded-bl-sm'">
                          <p class="whitespace-pre-line text-xs sm:text-sm leading-relaxed">
                            {{ message.content }}
                          </p>
                          <p class="text-[10px] mt-1.5 text-right flex items-center justify-end gap-1"
                            :class="message.is_mine ? 'text-blue-100' : 'text-slate-400'">
                            <span>{{ formatTime(message.created_at) }}</span>
                            <span v-if="message.is_mine">
                              <i class="fas fa-check-double text-[10px]"
                                :class="message.read ? 'text-blue-300' : 'text-blue-200'"></i>
                            </span>
                          </p>
                        </div>

                        <!-- Avatar (right side for sent messages) -->
                        <div v-if="message.is_mine && isFirstInGroup(message, messageGroup[i - 1])"
                          class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 
                                flex-shrink-0 flex items-center justify-center text-white ml-2 shadow-sm">
                          <i class="fas fa-user text-[10px]"></i>
                        </div>
                        <div v-else-if="message.is_mine" class="w-7 sm:w-8 ml-2"></div>
                      </div>
                    </div>
                  </template>
                </div>

                <!-- Input area -->
                <div class="px-3 sm:px-4 py-3 border-t border-slate-200/80 bg-white flex-shrink-0">
                  <form @submit.prevent="sendMessage" class="flex items-center gap-2">
                    <button type="button" 
                      class="p-2 rounded-lg text-slate-500 hover:text-blue-500 hover:bg-blue-50 transition-colors flex-shrink-0">
                      <i class="far fa-smile text-sm"></i>
                    </button>
                    <button type="button" 
                      class="p-2 rounded-lg text-slate-500 hover:text-blue-500 hover:bg-blue-50 transition-colors flex-shrink-0">
                      <i class="fas fa-paperclip text-sm"></i>
                    </button>
                    <input v-model="newMessage" type="text"
                      class="flex-1 border border-slate-300 rounded-lg px-3 sm:px-4 py-2 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                             bg-slate-50 text-sm placeholder:text-slate-400"
                      placeholder="Nhập tin nhắn..." />
                    <button type="submit" 
                      :disabled="!newMessage.trim()" 
                      class="p-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg 
                             disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0">
                      <i class="fas fa-paper-plane text-sm"></i>
                    </button>
                  </form>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showDeleteModal"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showDeleteModal = false">
        <div class="bg-white rounded-xl shadow-lg max-w-md w-full p-5 sm:p-6 transform transition-all">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <i class="fas fa-exclamation-triangle text-red-500"></i>
            </div>
            <h3 class="text-lg font-semibold text-slate-900">Xóa cuộc trò chuyện</h3>
          </div>

          <p class="text-sm text-slate-600 mb-6">
            Bạn có chắc chắn muốn xóa cuộc trò chuyện này? Hành động này không thể hoàn tác và toàn bộ tin nhắn sẽ bị xóa.
          </p>

          <div class="flex justify-end gap-3">
            <button @click="showDeleteModal = false"
              class="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium">
              Hủy
            </button>
            <button @click="deleteConversation"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors flex items-center gap-2 text-sm font-medium">
              <span v-if="isDeleting"
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ isDeleting ? 'Đang xóa...' : 'Xóa cuộc trò chuyện' }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
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
    width: 6px;
}

.conversations-list::-webkit-scrollbar-thumb,
.messages-container::-webkit-scrollbar-thumb {
    background-color: rgba(148, 163, 184, 0.5);
    border-radius: 10px;
}

.conversations-list::-webkit-scrollbar-thumb:hover,
.messages-container::-webkit-scrollbar-thumb:hover {
    background-color: rgba(148, 163, 184, 0.7);
}

.conversations-list::-webkit-scrollbar-track,
.messages-container::-webkit-scrollbar-track {
    background-color: transparent;
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
</style>
