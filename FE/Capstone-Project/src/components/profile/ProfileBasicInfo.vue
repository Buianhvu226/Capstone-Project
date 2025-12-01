<template>
  <div>
    <!-- Basic Information -->
    <div>
      <h3
        class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600 bg-slate-100 px-3 py-1 rounded-full mb-3">
        <i class="fas fa-id-card text-slate-400 text-[11px]"></i>
        Thông tin cơ bản
      </h3>
      <div class="bg-gray-50 rounded-lg p-4 space-y-3">
        <div class="grid grid-cols-2 gap-2">
          <div class="text-sm text-gray-500">Họ và tên:</div>
          <div class="text-sm font-medium text-gray-800">{{ profile.full_name }}</div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="text-sm text-gray-500">Năm sinh:</div>
          <div class="text-sm font-medium text-gray-800">{{ profile.born_year || 'Không rõ' }}</div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="text-sm text-gray-500">Năm thất lạc:</div>
          <div class="text-sm font-medium text-gray-800">{{ profile.losing_year || 'Không rõ' }}</div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="text-sm text-gray-500">Tên cha:</div>
          <div class="text-sm font-medium text-gray-800">{{ profile.name_of_father || 'Không rõ' }}</div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="text-sm text-gray-500">Tên mẹ:</div>
          <div class="text-sm font-medium text-gray-800">{{ profile.name_of_mother || 'Không rõ' }}</div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="text-sm text-gray-500">Anh chị em:</div>
          <div class="text-sm font-medium text-gray-800">{{ profile.siblings || 'Không rõ' }}</div>
        </div>
      </div>

      <!-- Thông tin cơ bản từ mô tả (nếu có) -->
      <div v-if="basicInfoFromDescription" class="mt-4">
        <div class="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-3">
          <div class="text-slate-800 leading-relaxed text-sm max-h-[200px] overflow-y-auto pr-2 custom-scrollbar" v-html="formatBasicInfo(basicInfoFromDescription)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileBasicInfo',
  props: {
    profile: {
      type: Object,
      required: true
    }
  },
  computed: {
    // Extract phần "Thông tin cơ bản:" từ mô tả
    basicInfoFromDescription() {
      if (!this.profile.description) return null;
      const match = this.profile.description.match(/Thông tin cơ bản:[\s\S]*/i);
      return match ? match[0].replace(/Thông tin cơ bản:\s*/i, '').trim() : null;
    }
  },
  methods: {
    formatBasicInfo(text) {
      if (!text) return '';
      
      let formatted = text;
      
      // Xử lý dấu ; để ngắt dòng và viết hoa chữ đầu
      formatted = formatted.replace(/;\s*/g, ';<br/>');
      // Viết hoa chữ đầu sau dấu ;
      formatted = formatted.replace(/;<br\/>([a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ])/g, (match, letter) => {
        return ';<br/>' + letter.toUpperCase();
      });
      
      // Highlight số 4 chữ số (năm)
      const tagRegex = /<[^>]+>/g;
      const tags = [];
      let tagMatch;
      while ((tagMatch = tagRegex.exec(formatted)) !== null) {
        tags.push({
          start: tagMatch.index,
          end: tagMatch.index + tagMatch[0].length
        });
      }
      
      formatted = formatted.replace(/(\d{4})/g, (match, number, offset) => {
        const isInHtml = tags.some(tag => offset >= tag.start && offset < tag.end);
        if (isInHtml) return match;
        return `<span class="font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">${number}</span>`;
      });
      
      // Giữ nguyên line breaks
      formatted = formatted.replace(/\n/g, '<br/>');
      
      return formatted;
    }
  }
}
</script>

<style scoped>
/* Custom scrollbar cho basic info từ description */
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
