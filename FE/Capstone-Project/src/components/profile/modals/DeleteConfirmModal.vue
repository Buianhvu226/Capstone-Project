<template>
  <teleport to="body">
    <div v-if="show" class="modal-backdrop" @click.self="handleCancel">
      <div class="modal-container">
        <div class="modal-header">
          <div class="icon-wrapper">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <h3 class="modal-title">Xác nhận xóa hồ sơ</h3>
        </div>

        <div class="modal-body">
          <p class="warning-text">
            Bạn có chắc chắn muốn xóa hồ sơ <strong>"{{ profileTitle }}"</strong> không?
          </p>
          <p class="warning-subtext">
            Hành động này không thể hoàn tác. Tất cả thông tin liên quan đến hồ sơ này sẽ bị xóa vĩnh viễn.
          </p>
        </div>

        <div class="modal-footer">
          <button
            @click="handleCancel"
            :disabled="isLoading"
            class="btn btn-cancel"
            type="button">
            Hủy
          </button>
          <button
            @click="handleConfirm"
            :disabled="isLoading"
            class="btn btn-confirm"
            type="button">
            <span v-if="isLoading" class="loading-spinner"></span>
            <span v-else>Xóa hồ sơ</span>
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  name: 'DeleteConfirmModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    profileTitle: {
      type: String,
      default: ''
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'confirm'],
  setup(props, { emit }) {
    const handleCancel = () => {
      if (!props.isLoading) {
        emit('close');
      }
    };

    const handleConfirm = () => {
      if (!props.isLoading) {
        emit('confirm');
      }
    };

    return {
      handleCancel,
      handleConfirm
    };
  }
};
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
  max-width: 480px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease-out;
  overflow: hidden;
}

.modal-header {
  padding: 1.5rem;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
}

.icon-wrapper {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  background: #fef2f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper i {
  font-size: 1.75rem;
  color: #ef4444;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.modal-body {
  padding: 1.5rem;
}

.warning-text {
  margin: 0 0 0.75rem 0;
  font-size: 0.9375rem;
  color: #334155;
  line-height: 1.6;
}

.warning-text strong {
  color: #0f172a;
  font-weight: 600;
}

.warning-subtext {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background: #f1f5f9;
  color: #475569;
}

.btn-cancel:hover:not(:disabled) {
  background: #e2e8f0;
}

.btn-confirm {
  background: #ef4444;
  color: #ffffff;
}

.btn-confirm:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-confirm:active:not(:disabled) {
  transform: translateY(0);
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .modal-container {
    max-width: 100%;
    border-radius: 16px 16px 0 0;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1.25rem;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
  }
}
</style>

