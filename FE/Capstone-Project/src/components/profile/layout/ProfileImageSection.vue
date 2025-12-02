<template>
  <div class="mb-6">
    <div class="flex justify-between items-center mb-4">
      <h3
        class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
        <i class="fas fa-image text-slate-400 text-[11px]"></i>
        Hình ảnh
      </h3>
      <button v-if="isOwner" @click="$emit('open-upload-modal')"
        class="px-3 py-1 bg-blue-400 hover:bg-blue-700 text-white text-sm rounded-md transition flex items-center">
        <i class="fas fa-upload mr-1"></i>
        {{ profile.images || profile.image_url ? 'Cập nhật ảnh' : 'Thêm ảnh' }}
      </button>
    </div>
    <div :class="['relative h-72 rounded-lg overflow-hidden bg-gray-100 shadow-inner flex items-center justify-center', hasImage ? 'cursor-zoom-in group' : 'cursor-default']"
      @click="handlePreview">
      <img v-if="hasImage" :src="profile.images || profile.image_url" :alt="profile.title || profile.full_name"
        class="w-full h-full object-contain transition-transform duration-200 group-hover:scale-[1.01]" @error="handleImageError" />
      <div v-else class="flex flex-col items-center justify-center h-full">
        <i class="fas fa-image text-4xl text-gray-400 mb-2"></i>
        <p class="text-gray-500 text-center">Không có hình ảnh</p>
        <button v-if="isOwner" @click="$emit('open-upload-modal')"
          class="mt-4 px-4 py-2 bg-blue-400 hover:bg-blue-700 text-white rounded-md transition">
          <i class="fas fa-cloud-upload-alt mr-2"></i>
          Tải ảnh lên
        </button>
      </div>
    </div>
    <!-- Likes and Views -->
    <div class="flex items-center justify-between mt-3 px-1">
      <div class="flex items-center">
        <button @click="$emit('toggle-like')" class="flex items-center focus:outline-none group">
          <div
            :class="`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isLiked ? 'bg-red-100' : 'bg-gray-100 group-hover:bg-red-50'}`">
            <i
              :class="`fas fa-heart transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 group-hover:text-red-400'}`"></i>
          </div>
          <span class="ml-2 text-sm font-medium" :class="isLiked ? 'text-red-500' : 'text-gray-600'">
            {{ likesCount }} lượt cảm xúc
          </span>
        </button>
      </div>
      <div class="text-sm text-gray-500">
        <i class="far fa-eye mr-1"></i> {{ profile.view_count || 1220 }} lượt xem
      </div>
    </div>
  </div>
</template>

<script>
import noImage from '@/assets/images/no_image.png'

export default {
  name: 'ProfileImageSection',
  props: {
    profile: {
      type: Object,
      required: true
    },
    isOwner: {
      type: Boolean,
      default: false
    },
    isLiked: {
      type: Boolean,
      default: false
    },
    likesCount: {
      type: Number,
      default: 0
    }
  },
  emits: ['toggle-like', 'open-upload-modal', 'preview-image'],
  computed: {
    hasImage() {
      return Boolean(this.profile?.images || this.profile?.image_url);
    }
  },
  methods: {
    handleImageError(event) {
      event.target.src = noImage;
    },
    handlePreview() {
      if (!this.hasImage) return;
      this.$emit('preview-image', this.profile.images || this.profile.image_url);
    }
  }
}
</script>
