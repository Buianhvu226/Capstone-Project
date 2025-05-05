<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Tin nhắn</h1>
    
    <div v-if="loading" class="flex justify-center py-12">
      <AppLoader />
    </div>
    
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="flex h-[600px]">
        <div class="w-1/3 border-r border-gray-200">
          <div class="p-4 border-b border-gray-200">
            <h2 class="font-semibold">Cuộc trò chuyện</h2>
          </div>
          
          <div v-if="conversations.length === 0" class="p-6 text-center text-gray-500">
            Chưa có cuộc trò chuyện nào
          </div>
          
          <div v-else class="overflow-y-auto h-[calc(600px-57px)]">
            <div 
              v-for="conversation in conversations" 
              :key="conversation.id"
              @click="selectConversation(conversation)"
              class="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              :class="{ 'bg-gray-100': currentConversation && currentConversation.id === conversation.id }"
            >
              <div class="flex items-center">
                <div class="flex-1 min-w-0">
                  <p class="font-medium truncate">{{ conversation.otherUser.name }}</p>
                  <p class="text-sm text-gray-500 truncate">
                    {{ conversation.lastMessage ? conversation.lastMessage.content : 'Chưa có tin nhắn' }}
                  </p>
                </div>
                <div v-if="conversation.unreadCount" class="ml-2">
                  <span class="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                    {{ conversation.unreadCount }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="w-2/3 flex flex-col">
          <div v-if="!currentConversation" class="flex-1 flex items-center justify-center text-gray-500">
            Chọn một cuộc trò chuyện để bắt đầu
          </div>
          
          <template v-else>
            <div class="p-4 border-b border-gray-200">
              <h2 class="font-semibold">{{ currentConversation.otherUser.name }}</h2>
            </div>
            
            <div class="flex-1 overflow-y-auto p-4 space-y-4">
              <div 
                v-for="message in messages" 
                :key="message.id"
                class="flex"
                :class="{ 'justify-end': message.senderId === currentUser.id }"
              >
                <div 
                  class="max-w-[70%] rounded-lg px-4 py-2"
                  :class="message.senderId === currentUser.id ? 'bg-primary-100 text-primary-800' : 'bg-gray-100'"
                >
                  <p>{{ message.content }}</p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ formatTime(message.createdAt) }}
                  </p>
                </div>
              </div>
            </div>
            
            <div class="p-4 border-t border-gray-200">
              <form @submit.prevent="sendMessage" class="flex">
                <input 
                  v-model="newMessage" 
                  type="text" 
                  placeholder="Nhập tin nhắn..." 
                  class="flex-1 input"
                  required
                />
                <button 
                  type="submit" 
                  class="ml-2 btn btn-primary"
                  :disabled="sendingMessage"
                >
                  Gửi
                </button>
              </form>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import AppLoader from '../components/common/AppLoader.vue'

export default {
  name: 'MessageView',
  components: {
    AppLoader
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    
    const conversations = computed(() => store.getters['message/allConversations'])
    const currentConversation = computed(() => store.getters['message/currentConversation'])
    const messages = computed(() => store.getters['message/conversationMessages'])
    const currentUser = computed(() => store.getters['auth/currentUser'])
    const loading = computed(() => store.getters['message/isLoading'])
    
    const newMessage = ref('')
    const sendingMessage = ref(false)
    
    const fetchConversations = async () => {
      try {
        await store.dispatch('message/fetchConversations')
      } catch (error) {
        console.error('Failed to fetch conversations:', error)
      }
    }
    
    const selectConversation = async (conversation) => {
      try {
        await store.dispatch('message/fetchMessages', conversation.id)
        store.commit('message/SET_CURRENT_CONVERSATION', conversation)
        
        // Update URL without reloading
        router.push({ 
          name: 'message-detail', 
          params: { userId: conversation.id },
          replace: true
        })
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      }
    }
    
    const sendMessage = async () => {
      if (!newMessage.value.trim() || !currentConversation.value) return
      
      sendingMessage.value = true
      try {
        await store.dispatch('message/sendMessage', {
          conversationId: currentConversation.value.id,
          content: newMessage.value
        })
        newMessage.value = ''
      } catch (error) {
        console.error('Failed to send message:', error)
      } finally {
        sendingMessage.value = false
      }
    }
    
    const formatTime = (timestamp) => {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      return new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date)
    }
    
    onMounted(async () => {
      await fetchConversations()
      
      // If URL contains userId, select that conversation
      if (route.params.userId && conversations.value.length > 0) {
        const conversation = conversations.value.find(c => c.id === route.params.userId)
        if (conversation) {
          selectConversation(conversation)
        }
      }
    })
    
    return {
      conversations,
      currentConversation,
      messages,
      currentUser,
      loading,
      newMessage,
      sendingMessage,
      selectConversation,
      sendMessage,
      formatTime
    }
  }
}
</script>