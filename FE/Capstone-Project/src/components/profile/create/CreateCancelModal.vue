<template>
  <teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" @click.self="$emit('close')">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div class="flex items-start gap-3">
          <div class="h-12 w-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
            <i class="fas fa-exclamation-triangle text-xl"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-slate-800">Xác nhận hủy hồ sơ</h3>
            <p class="text-sm text-slate-600 mt-1">
              Mọi thông tin đang nhập sẽ bị mất. Bạn có chắc chắn muốn hủy?
            </p>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button
            class="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
            @click="$emit('close')"
          >
            Tiếp tục chỉnh sửa
          </button>
          <button
            class="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600"
            @click="$emit('confirm')"
          >
            Hủy hồ sơ
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  name: 'CreateCancelModal',
  emits: ['close', 'confirm'],
};
</script>

