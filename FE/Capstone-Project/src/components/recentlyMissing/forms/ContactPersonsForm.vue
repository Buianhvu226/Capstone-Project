<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700">
                <i class="fas fa-users mr-2 text-blue-400"></i>
                Thông tin người thân liên hệ
                <span class="text-gray-400 font-normal ml-1">(tùy chọn)</span>
            </label>
            <button type="button" @click="addContact"
                class="text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors">
                <i class="fas fa-plus mr-1"></i> Thêm người thân
            </button>
        </div>

        <div v-if="contacts.length === 0"
            class="text-gray-500 text-sm italic text-center py-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <i class="fas fa-user-friends text-gray-400 text-2xl mb-2 block"></i>
            Chưa có thông tin người thân nào. Nhấn "Thêm người thân" để bắt đầu.
        </div>

        <div v-for="(contact, index) in contacts" :key="index"
            class="flex gap-3 items-start bg-blue-50 p-4 rounded-lg border border-blue-200 contact-item">

            <!-- Mối quan hệ - Input tự do -->
            <div class="flex-1">
                <label class="block text-xs text-gray-600 mb-1">Mối quan hệ</label>
                <input v-model="contact.relationship" type="text" placeholder="Ví dụ: Ba, Mẹ, Anh, Người quen..."
                    class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    maxlength="50" @input="updateContacts" />
                <div v-if="contact.relationship && contact.relationship.length > 40"
                    class="text-xs text-orange-600 mt-1">
                    Còn {{ 50 - contact.relationship.length }} ký tự
                </div>
            </div>

            <!-- Tên -->
            <div class="flex-2">
                <label class="block text-xs text-gray-600 mb-1">Tên người thân</label>
                <input v-model="contact.name" type="text" placeholder="Nhập tên đầy đủ..."
                    class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    maxlength="100" @input="updateContacts" />
                <div v-if="contact.name && contact.name.length > 80" class="text-xs text-orange-600 mt-1">
                    Còn {{ 100 - contact.name.length }} ký tự
                </div>
            </div>

            <!-- Xóa -->
            <div class="flex flex-col justify-end">
                <label class="block text-xs text-transparent mb-1">Xóa</label>
                <button type="button" @click="removeContact(index)"
                    class="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded-md transition-colors">
                    <i class="fas fa-trash text-sm"></i>
                </button>
            </div>
        </div>

        <!-- Suggestions -->
        <div v-if="contacts.length === 0 || showSuggestions"
            class="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div class="flex items-center justify-between mb-2">
                <p class="text-xs text-blue-700 font-medium">
                    <i class="fas fa-lightbulb mr-1"></i>
                    Gợi ý mối quan hệ phổ biến:
                </p>
                <button type="button" @click="showSuggestions = !showSuggestions"
                    class="text-xs text-blue-400 hover:text-blue-800">
                    {{ showSuggestions ? 'Ẩn' : 'Hiện' }}
                </button>
            </div>
            <div v-if="showSuggestions" class="flex flex-wrap gap-1">
                <button v-for="suggestion in suggestions" :key="suggestion" type="button"
                    @click="addSuggestion(suggestion)"
                    class="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded transition-colors">
                    {{ suggestion }}
                </button>
            </div>
        </div>

        <p class="text-xs text-gray-500">
            <i class="fas fa-info-circle mr-1"></i>
            Bạn có thể tự định nghĩa mối quan hệ theo ý muốn. Thông tin này giúp các bên liên hệ khi có thông tin hữu
            ích.
        </p>
    </div>
</template>

<script>
import { ref, watch, nextTick } from 'vue';

export default {
    name: 'ContactPersonsForm',

    props: {
        modelValue: {
            type: Object,
            default: () => ({})
        }
    },

    emits: ['update:modelValue'],

    setup(props, { emit }) {
        const contacts = ref([]);
        const showSuggestions = ref(true);
        const isInternalUpdate = ref(false); // Flag để tránh recursive updates

        // Common suggestions for relationships
        const suggestions = [
            'Ba', 'Mẹ', 'Anh', 'Chị', 'Em', 'Ông nội', 'Bà nội',
            'Ông ngoại', 'Bà ngoại', 'Chú', 'Cô', 'Dì', 'Bác',
            'Người quen', 'Hàng xóm', 'Bạn bè', 'Đồng nghiệp', 'Thầy/Cô giáo'
        ];

        // Initialize from modelValue
        const initializeContacts = () => {
            if (isInternalUpdate.value) return; // Skip nếu là internal update

            if (props.modelValue && Object.keys(props.modelValue).length > 0) {
                contacts.value = Object.entries(props.modelValue).map(([relationship, name]) => ({
                    relationship,
                    name
                }));
            } else if (contacts.value.length === 0) {
                // Chỉ reset contacts nếu chưa có data
                contacts.value = [];
            }
        };

        // Watch for external changes - chỉ khi không phải internal update
        watch(() => props.modelValue, initializeContacts, { immediate: true });

        // Emit changes to parent
        const emitChanges = () => {
            const obj = {};
            contacts.value.forEach(contact => {
                const cleanRelationship = contact.relationship?.trim();
                const cleanName = contact.name?.trim();

                if (cleanRelationship && cleanName) {
                    obj[cleanRelationship] = cleanName;
                }
            });

            isInternalUpdate.value = true; // Set flag trước khi emit
            emit('update:modelValue', obj);

            // Reset flag sau khi Vue đã update
            nextTick(() => {
                isInternalUpdate.value = false;
            });
        };

        // Update contacts - được gọi khi user input
        const updateContacts = () => {
            emitChanges();
        };

        const addContact = () => {
            contacts.value.push({
                relationship: '',
                name: ''
            });
            showSuggestions.value = false;
            emitChanges();
        };

        const removeContact = (index) => {
            contacts.value.splice(index, 1);
            if (contacts.value.length === 0) {
                showSuggestions.value = true;
            }
            emitChanges();
        };

        const addSuggestion = (suggestion) => {
            // Check if suggestion already exists
            const exists = contacts.value.some(contact =>
                contact.relationship?.toLowerCase() === suggestion.toLowerCase()
            );

            if (!exists) {
                contacts.value.push({
                    relationship: suggestion,
                    name: ''
                });
                emitChanges();
            }
        };

        return {
            contacts,
            suggestions,
            showSuggestions,
            addContact,
            removeContact,
            addSuggestion,
            updateContacts
        };
    }
}
</script>

<style scoped>
/* Custom styles for contact form */
.contact-item {
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Focus states */
input:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

/* Responsive design */
@media (max-width: 640px) {
    .flex-2 {
        flex: 2;
        min-width: 0;
    }

    .flex-1 {
        flex: 1;
        min-width: 0;
    }
}
</style>