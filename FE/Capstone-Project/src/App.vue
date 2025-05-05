<template>
  <div class="min-h-screen bg-gray-50 text-black">
    <AppHeader v-if="isAuthenticated" />
    <main class="container mx-auto px-4 py-6">
      <router-view />
    </main>
    <AppFooter v-if="isAuthenticated" />
  </div>
</template>

<script>
</script>
