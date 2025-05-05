<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      {{ error }}
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input id="email" v-model="form.email" type="email" class="input" required />
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
      <input id="password" v-model="form.password" type="password" class="input" required />
    </div>

    <div>
      <button type="submit" class="w-full btn btn-primary py-3" :disabled="loading">
        <span v-if="loading">Đang xử lý...</span>
        <span v-else>Đăng ký</span>
      </button>
    </div>

  </form>
</template>

<script>
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'RegisterForm',
  emits: ['switch-mode'],
  setup(props, { emit }) {
    const store = useStore()

    const form = reactive({
      email: '',
      password: ''
    })

    const loading = computed(() => store.getters['auth/isLoading'])
    const error = computed(() => store.getters['auth/authError'])

    const handleSubmit = async () => {
      try {
        await store.dispatch('auth/register', {
          email: form.email,
          password: form.password
        })
        emit('switch-mode') // Switch to login form after successful registration
      } catch (error) {
        console.error('Registration failed:', error)
      }
    }

    return {
      form,
      loading,
      error,
      handleSubmit
    }
  }
}
</script>