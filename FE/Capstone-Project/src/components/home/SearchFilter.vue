<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <form @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Tên người thất lạc</label>
          <input 
            id="name" 
            v-model="filters.name" 
            type="text" 
            class="input"
            placeholder="Nhập tên người cần tìm"
          />
        </div>
        
        <div>
          <label for="location" class="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
          <input 
            id="location" 
            v-model="filters.location" 
            type="text" 
            class="input"
            placeholder="Nhập địa điểm"
          />
        </div>
        
        <div>
          <label for="gender" class="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
          <select 
            id="gender" 
            v-model="filters.gender" 
            class="input"
          >
            <option value="">Tất cả</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>
      </div>
      
      <div class="mt-4 flex justify-end">
        <button 
          type="button" 
          @click="resetFilters" 
          class="btn btn-secondary mr-2"
        >
          Đặt lại
        </button>
        <button 
          type="submit" 
          class="btn btn-primary"
        >
          Tìm kiếm
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  name: 'SearchFilter',
  emits: ['filter-change'],
  setup(props, { emit }) {
    const defaultFilters = {
      name: '',
      location: '',
      gender: ''
    }
    
    const filters = reactive({...defaultFilters})
    
    const handleSubmit = () => {
      emit('filter-change', {...filters})
    }
    
    const resetFilters = () => {
      Object.keys(defaultFilters).forEach(key => {
        filters[key] = defaultFilters[key]
      })
      emit('filter-change', {...filters})
    }
    
    return {
      filters,
      handleSubmit,
      resetFilters
    }
  }
}
</script>