<template>
  <div class="bg-white rounded-lg p-3" id="search-query">
    <form @submit.prevent="$emit('submit')" class="space-y-2.5">
      <div>
        <label for="query" class="block text-xs font-semibold text-slate-700 mb-1.5">
          <i class="fas fa-edit text-blue-500 mr-1 text-xs"></i>
          Nhập nội dung tìm kiếm
        </label>
        <div class="relative">
          <textarea
            id="query"
            :value="searchQuery"
            @input="handleInput"
            @keydown="handleKeydown"
            @paste="handlePaste"
            rows="7"
            :maxlength="maxLength"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm resize-none"
            placeholder="Ví dụ: Tìm người tên Nguyễn Văn A, sinh năm 1975, thất lạc ở Huế..."
            required
          ></textarea>
          <div class="absolute bottom-2 right-2 text-xs text-slate-400 bg-white px-1 rounded">
            {{ searchQuery.length }}/{{ maxLength }}
          </div>
        </div>
        <p class="mt-1.5 text-xs text-slate-500">
          <i class="fas fa-lightbulb text-blue-400 mr-1 text-xs"></i>
          <strong>Mẹo:</strong> Mô tả chi tiết (tên, năm sinh, địa điểm...) để kết quả chính xác hơn
        </p>
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1">
        <button
          type="button"
          v-if="hasSearched"
          @click="$emit('clear')"
          class="text-xs text-slate-500 hover:text-slate-700 transition-colors"
        >
          <i class="fas fa-times mr-1"></i>
          Xóa tìm kiếm
        </button>
        <div class="flex gap-2 ml-auto">
          <button
            type="submit"
            :disabled="loading || !searchQuery.trim()"
            class="px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 text-xs sm:text-sm font-semibold"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin text-xs"></i>
            <i v-else class="fas fa-search text-xs"></i>
            <span>{{ loading ? 'Đang tìm...' : 'Tìm kiếm' }}</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'SearchForm',
  props: {
    searchQuery: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    hasSearched: {
      type: Boolean,
      default: false,
    },
    maxLength: {
      type: Number,
      default: 2000,
    },
  },
  emits: ['update:searchQuery', 'submit', 'clear'],
  methods: {
    // Xử lý input - tự động loại bỏ ký tự xuống dòng
    handleInput(event) {
      let value = event.target.value;
      // Thay thế tất cả ký tự xuống dòng (\n, \r\n) bằng khoảng trắng
      value = value.replace(/\r?\n/g, ' ');
      // Loại bỏ nhiều khoảng trắng liên tiếp thành 1 khoảng trắng
      value = value.replace(/\s+/g, ' ').trim();
      
      // Giới hạn độ dài
      if (value.length > this.maxLength) {
        value = value.substring(0, this.maxLength);
      }
      
      this.$emit('update:searchQuery', value);
    },
    
    // Ngăn chặn phím Enter tạo xuống dòng
    handleKeydown(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        // Có thể submit form nếu muốn, hoặc chỉ ngăn xuống dòng
        // this.$emit('submit');
      }
    },
    
    // Xử lý paste - loại bỏ xuống dòng từ clipboard
    handlePaste(event) {
      event.preventDefault();
      const paste = (event.clipboardData || window.clipboardData).getData('text');
      // Thay thế xuống dòng bằng khoảng trắng
      let cleanText = paste.replace(/\r?\n/g, ' ');
      // Loại bỏ nhiều khoảng trắng liên tiếp
      cleanText = cleanText.replace(/\s+/g, ' ').trim();
      
      // Lấy vị trí cursor hiện tại
      const textarea = event.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentValue = this.searchQuery;
      
      // Chèn text đã clean vào vị trí cursor
      const newValue = currentValue.substring(0, start) + cleanText + currentValue.substring(end);
      
      // Giới hạn độ dài
      const finalValue = newValue.length > this.maxLength 
        ? newValue.substring(0, this.maxLength) 
        : newValue;
      
      this.$emit('update:searchQuery', finalValue);
      
      // Đặt lại vị trí cursor sau khi paste
      this.$nextTick(() => {
        const newCursorPos = start + cleanText.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      });
    },
  },
};
</script>

