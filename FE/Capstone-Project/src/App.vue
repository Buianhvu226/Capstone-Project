<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <main class="container mx-auto px-4 py-6">
      <router-view />
    </main>
    <AppFooter v-if="isAuthenticated" />

  </div>
</template>

<script>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue' // Thêm ref
import { useStore } from 'vuex'
import AppHeader from './components/common/AppHeader.vue'
import AppFooter from './components/common/AppFooter.vue'

export default {
  components: {
    AppHeader,
    AppFooter,
  },
  setup() {
    const store = useStore()
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])

    // Thêm biến để kiểm tra môi trường
    const isDevelopmentMode = ref(process.env.NODE_ENV === 'development');

    onMounted(() => {
      // Check if notifications are supported
      if (!('Notification' in window)) {
        console.log('Trình duyệt này không hỗ trợ thông báo');
        return;
      }

      // Request notification permission if not already granted
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          console.log('Quyền thông báo:', permission);

          // If permission granted and user is logged in, subscribe to real-time notifications
          if (permission === 'granted' && isLoggedIn.value) {
            store.dispatch('notifications/subscribeToNotifications');
          }
        });
      } else if (Notification.permission === 'granted' && isLoggedIn.value) {
        // If permission already granted and user is logged in, subscribe to real-time notifications
        store.dispatch('notifications/subscribeToNotifications');
      }

      // Check auth status
      const token = localStorage.getItem('token');
      if (token) {
        // Subscribe to realtime notifications and messages
        store.dispatch('notifications/subscribeToNotifications');
        store.dispatch('message/subscribeToMessages');
      }
    })

    // Clean up when app is destroyed
    onBeforeUnmount(() => {
      // Unsubscribe from notifications and messages
      store.dispatch('notifications/unsubscribeFromNotifications');
      store.dispatch('message/unsubscribeFromMessages');
    })

    return {
      isAuthenticated,
      isDevelopmentMode // Trả về để sử dụng trong template
    }
  }
}
</script>
