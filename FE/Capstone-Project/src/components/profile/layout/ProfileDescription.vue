<template>
  <div>
    <h3
      class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600 bg-slate-100 px-3 py-1 rounded-full mb-3">
      <i class="fas fa-info-circle text-slate-400 text-[11px]"></i>
      Thông tin chi tiết
    </h3>
    <div class="prose prose-blue max-w-none mb-6">
      <div
        class="text-slate-800 leading-relaxed text-[15px] sm:text-base max-h-[600px] overflow-y-auto pr-2 custom-scrollbar"
        v-html="formatDescription(profile.description)"></div>
    </div>
    <!-- Tags -->
    <div v-if="profile.tags && profile.tags.length > 0" class="mb-6">
      <div class="flex flex-wrap gap-2">
        <span v-for="tag in profile.tags" :key="tag"
          class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
          {{ tag }}
        </span>
      </div>
    </div>
    <!-- Found Notification -->
    <div v-if="profile.status === 'found'" class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="fas fa-check-circle text-blue-400"></i>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-blue-800">Đã tìm thấy</h3>
          <div class="mt-2 text-sm text-blue-700">
            <p>Người thân trong hồ sơ này đã được tìm thấy.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileDescription',
  props: {
    profile: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDescription(text) {
      if (!text) return '';

      let formatted = text;

      // Bước 1: Xóa phần "Thông tin cơ bản:" và nội dung sau nó khỏi mô tả (vì đã hiển thị trong ProfileBasicInfo)
      // Tìm và xóa từ "Thông tin cơ bản:" đến hết text hoặc đến phần tiếp theo
      formatted = formatted.replace(/Thông tin cơ bản:[\s\S]*/gi, '').trim();

      // Bước 2: Xử lý dấu ; để ngắt dòng và viết hoa chữ đầu
      formatted = formatted.replace(/;\s*/g, ';<br/>');
      // Viết hoa chữ đầu sau dấu ;
      formatted = formatted.replace(/;<br\/>([a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ])/g, (match, letter) => {
        return ';<br/>' + letter.toUpperCase();
      });

      // Bước 3: Highlight số 4 chữ số (năm) - chỉ highlight trong phần text thuần, không trong HTML
      // Tách text thành các phần: text và HTML tags
      const parts = [];
      let currentIndex = 0;
      const tagRegex = /<[^>]+>/g;
      let tagMatch;

      // Tìm tất cả HTML tags
      const tags = [];
      while ((tagMatch = tagRegex.exec(formatted)) !== null) {
        tags.push({
          start: tagMatch.index,
          end: tagMatch.index + tagMatch[0].length,
          content: tagMatch[0]
        });
      }

      // Replace số 4 chữ số, nhưng tránh các vùng HTML
      formatted = formatted.replace(/(\d{4})/g, (match, number, offset) => {
        // Kiểm tra xem số này có nằm trong HTML tag không
        const isInHtml = tags.some(tag => offset >= tag.start && offset < tag.end);
        if (isInHtml) {
          return match; // Giữ nguyên nếu nằm trong HTML
        }
        // Highlight số
        return `<span class="font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">${number}</span>`;
      });

      // Bước 4: Giữ nguyên line breaks gốc
      formatted = formatted.replace(/\n/g, '<br/>');

      return formatted;
    }
  }
}
</script>

<style scoped>
/* Custom scrollbar cho description */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}
</style>
