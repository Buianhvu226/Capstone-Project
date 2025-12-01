<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Thay đổi trạng thái hồ sơ</h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <p class="text-sm text-gray-600 mt-1">Chọn trạng thái phù hợp cho hồ sơ của bạn</p>
      </div>

      <!-- Modal Body -->
      <div class="px-6 py-4">
        <div class="space-y-3">
          <button v-for="status in statusOptions" :key="status.value" @click="$emit('update-status', status.value)"
            :disabled="currentStatus === status.value || isLoading"
            class="w-full p-4 text-left border-2 rounded-lg transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{
              'border-blue-500 bg-blue-50': currentStatus === status.value,
              'border-gray-200 hover:border-gray-300': currentStatus !== status.value
            }">
            <div class="flex items-center">
              <!-- Status icon -->
              <div class="flex items-center justify-center w-12 h-12 rounded-full mr-4" :class="status.bgClass">
                <i :class="status.iconClass" class="text-lg"></i>
              </div>

              <!-- Status info -->
              <div class="flex-1">
                <div class="font-medium text-gray-900" :class="{ 'text-blue-400': currentStatus === status.value }">
                  {{ status.label }}
                </div>
                <div class="text-sm text-gray-500 mt-1">{{ status.description }}</div>
              </div>

              <!-- Current status indicator -->
              <div v-if="currentStatus === status.value" class="ml-3">
                <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <i class="fas fa-check text-blue-400 text-sm"></i>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex justify-end space-x-3">
          <button @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            Hủy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'ProfileStatusModal',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        currentStatus: {
            type: String,
            default: 'active'
        },
        isLoading: {
            type: Boolean,
            default: false
        },
        statusOptions: {
            type: Array,
            default: () => []
        }
    },
    emits: ['close', 'update-status']
}
</script>
