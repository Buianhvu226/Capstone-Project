<template>
    <div class="flex justify-center mt-20">
        <nav class="inline-flex rounded-md shadow">
            <!-- First page button -->
            <button @click="changePage(1)" :disabled="currentPage === 1" class="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium 
        text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fas fa-angle-double-left"></i>
            </button>

            <!-- Previous button -->
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm 
        font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fas fa-angle-left"></i>
            </button>

            <!-- Page numbers -->
            <template v-for="page in displayPages" :key="page">
                <button v-if="page !== '...'" @click="changePage(page)" :class="{
                    'bg-blue-50 border-blue-500 text-blue-600': page === currentPage,
                    'bg-white border-gray-300 text-gray-700 hover:bg-gray-50': page !== currentPage
                }" class="px-4 py-2 border-t border-b text-sm font-medium">
                    {{ page }}
                </button>

                <!-- Ellipsis -->
                <span v-else class="px-3 py-2 border-t border-b border-gray-300 bg-white text-gray-700">
                    ...
                </span>
            </template>

            <!-- Next button -->
            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm 
        font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fas fa-angle-right"></i>
            </button>

            <!-- Last page button -->
            <button @click="changePage(totalPages)" :disabled="currentPage === totalPages" class="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm 
        font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fas fa-angle-double-right"></i>
            </button>
        </nav>
    </div>
</template>

<script>
import { computed } from 'vue';

export default {
    name: 'AppPagination',

    props: {
        currentPage: {
            type: Number,
            required: true
        },
        totalPages: {
            type: Number,
            required: true
        }
    },

    emits: ['page-change'],

    setup(props, { emit }) {
        // Tính toán các trang sẽ hiển thị
        const displayPages = computed(() => {
            const { currentPage, totalPages } = props;

            // Nếu ít trang, hiển thị tất cả
            if (totalPages <= 7) {
                return Array.from({ length: totalPages }, (_, i) => i + 1);
            }

            // Hiển thị đầu trang
            if (currentPage <= 3) {
                return [1, 2, 3, 4, '...', totalPages - 1, totalPages];
            }

            // Hiển thị cuối trang
            if (currentPage >= totalPages - 2) {
                return [1, 2, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            }

            // Hiển thị ở giữa
            return [
                1,
                '...',
                currentPage - 1,
                currentPage,
                currentPage + 1,
                '...',
                totalPages
            ];
        });

        // Handler khi chuyển trang
        const changePage = (page) => {
            if (page !== props.currentPage && page >= 1 && page <= props.totalPages) {
                emit('page-change', page);
            }
        };

        return {
            displayPages,
            changePage
        };
    }
}
</script>