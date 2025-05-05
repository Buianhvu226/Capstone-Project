<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="profile in profiles"
      :key="profile.id"
      class="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 flex flex-col"
    >
      <h3 class="text-xl font-bold text-purple-700 mb-2">{{ profile.title }}</h3>
      <div class="mb-2">
        <span class="font-semibold text-gray-700">Tên:</span>
        <span class="text-gray-900">{{ profile.full_name }}</span>
      </div>
      <div class="mb-2 flex flex-wrap gap-x-4 gap-y-1">
        <span v-if="profile.born_year" class="text-sm text-gray-600">Năm sinh: {{ profile.born_year }}</span>
        <span v-if="profile.losing_year" class="text-sm text-gray-600">Năm thất lạc: {{ profile.losing_year }}</span>
      </div>
      <p class="text-gray-700 line-clamp-4 mb-4">{{ profile.description }}</p>
      <router-link
        :to="`/profile/${profile.id}`"
        class="mt-auto inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition"
      >
        Xem chi tiết
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileList',
  props: {
    profiles: {
      type: Array,
      required: true
    }
  }
}
</script>