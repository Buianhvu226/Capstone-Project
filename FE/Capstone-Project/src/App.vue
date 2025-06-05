<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Conditionally render AppHeader only for non-admin routes -->
    <AppHeader v-if="!isAdminRoute" />
    <main class="container mx-auto px-4 py-6">
      <router-view />
    </main>
    <AppFooter v-if="isAuthenticated" />
  </div>
</template>

<script>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import AppHeader from './components/common/AppHeader.vue';
import AppFooter from './components/common/AppFooter.vue';

export default {
  components: {
    AppHeader,
    AppFooter,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
    const isDevelopmentMode = ref(process.env.NODE_ENV === 'development');

    // Check if the current route is an admin route
    const isAdminRoute = computed(() => route.path.startsWith('/admin'));

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

          if (permission === 'granted' && isAuthenticated.value) {
            store.dispatch('notifications/subscribeToNotifications');
          }
        });
      } else if (Notification.permission === 'granted' && isAuthenticated.value) {
        store.dispatch('notifications/subscribeToNotifications');
      }

      // Check auth status
      const token = localStorage.getItem('token');
      if (token) {
        store.dispatch('notifications/subscribeToNotifications');
        store.dispatch('message/subscribeToMessages');
      }
    });

    onBeforeUnmount(() => {
      store.dispatch('notifications/unsubscribeFromNotifications');
      store.dispatch('message/unsubscribeFromMessages');
    });

    return {
      isAuthenticated,
      isDevelopmentMode,
      isAdminRoute,
    };
  },
};
</script>