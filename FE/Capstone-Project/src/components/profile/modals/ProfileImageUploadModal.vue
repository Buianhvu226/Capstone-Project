<template>
  <teleport to="body">
    <div v-if="show" class="modal-backdrop" @click.self="handleClose">
      <div class="modal-container">
        <div class="modal-header">
          <div>
            <h3 class="modal-title">
              <i class="fas fa-image text-blue-500 mr-2"></i>
              {{ profile?.image_url ? 'Cập nhật ảnh hồ sơ' : 'Thêm ảnh hồ sơ' }}
            </h3>
            <p class="modal-subtitle">
              Chọn ảnh rõ mặt, dung lượng &lt; 5MB để có chất lượng tốt nhất
            </p>
          </div>
          <button class="close-button" @click="handleClose" aria-label="Đóng">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <ProfileImageUpload 
            v-if="profile && actualProfileId" 
            :profileId="actualProfileId" 
            :initialProfile="profile"
            @upload-success="handleUploadSuccess" 
          />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import { computed } from 'vue'
import ProfileImageUpload from '@/components/profile/upload/ProfileImageUpload.vue'

export default {
  name: 'ProfileImageUploadModal',
  components: {
    ProfileImageUpload
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    profile: {
      type: Object,
      default: null
    },
    profileId: {
      type: [Number, String],
      default: null
    }
  },
  emits: ['close', 'upload-success'],
  setup(props, { emit }) {
    // Computed để lấy profileId từ prop hoặc từ profile.id
    const actualProfileId = computed(() => {
      if (props.profileId) {
        return props.profileId;
      }
      if (props.profile?.id) {
        return props.profile.id;
      }
      return null;
    });

    const handleClose = () => {
      emit('close')
    }

    const handleUploadSuccess = (data) => {
      emit('upload-success', data)
      // Tự động đóng modal sau khi upload thành công
      setTimeout(() => {
        emit('close')
      }, 1000)
    }

    return {
      actualProfileId,
      handleClose,
      handleUploadSuccess
    }
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;
}

.modal-container {
  background: #ffffff;
  border-radius: 20px;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
}

.modal-subtitle {
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
  color: #64748b;
}

.close-button {
  border: none;
  background: transparent;
  font-size: 1.25rem;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #f1f5f9;
  color: #475569;
}

.modal-body {
  padding: 1.5rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom scrollbar cho modal */
.modal-container::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.modal-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.modal-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

@media (max-width: 640px) {
  .modal-container {
    max-width: 100%;
    border-radius: 16px 16px 0 0;
    max-height: 95vh;
  }

  .modal-header {
    padding: 1.25rem;
  }

  .modal-title {
    font-size: 1.125rem;
  }

  .modal-subtitle {
    font-size: 0.8125rem;
  }

  .modal-body {
    padding: 1.25rem;
  }
}
</style>

