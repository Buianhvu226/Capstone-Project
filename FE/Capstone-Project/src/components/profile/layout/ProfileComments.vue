<template>
    <section class="mt-6">
        <div class="space-y-5">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3
                    class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                    <i class="fas fa-comments text-slate-400 text-[11px]"></i>
                    Bình luận ({{ comments.length }})
                </h3>
            </div>

            <!-- Comment Form -->
            <form @submit.prevent="$emit('submit-comment')"
                class="hidden sm:flex sm:flex-row sm:items-start gap-3 bg-slate-50/80 border border-slate-100 rounded-2xl p-3 sm:p-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="sm:hidden text-sm font-semibold text-slate-600">Bạn đang bình luận</div>
                </div>
                <div class="flex-1 min-w-0 space-y-2">
                    <textarea :value="newComment" @input="$emit('update:newComment', $event.target.value)"
                        placeholder="Chia sẻ suy nghĩ của bạn về hồ sơ này..."
                        class="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm sm:text-base resize-none"
                        rows="3"></textarea>
                    <div class="flex justify-end">
                        <button type="submit" :disabled="!newComment.trim()" :class="`px-4 py-2 rounded-full text-sm font-semibold transition ${newComment.trim()
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                            }`">
                            Gửi bình luận
                        </button>
                    </div>
                </div>
            </form>

            <button @click="showMobileComposer = true"
                class="sm:hidden w-full rounded-full bg-blue-500 text-white py-2.5 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm">
                <i class="fas fa-pen"></i>
                Viết bình luận
            </button>

            <!-- Comment List -->
            <div class="space-y-4">
                <div v-if="comments.length === 0" class="py-10 text-center text-slate-500">
                    <i class="far fa-comment-dots text-4xl mb-3 block text-slate-300"></i>
                    <p>Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ!</p>
                </div>
                <article v-for="comment in comments" :key="comment.id"
                    class="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white/80 p-3 sm:p-4">
                    <header class="flex gap-3 sm:gap-4">
                        <div class="flex-shrink-0">
                            <div v-if="comment.user_avatar" class="w-10 h-10 rounded-full overflow-hidden">
                                <img :src="comment.user_avatar" alt="Avatar" class="w-full h-full object-cover" />
                            </div>
                            <div v-else
                                class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                                <i class="fas fa-user"></i>
                            </div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                <h4 class="font-semibold text-slate-800 truncate">{{ comment.user_name }}</h4>
                                <time class="text-xs text-slate-400 flex-shrink-0">{{ formatDate(comment.created_at)
                                    }}</time>
                            </div>
                            <p class="mt-1 text-sm sm:text-base text-slate-700 leading-relaxed">{{ comment.content }}
                            </p>
                        </div>
                    </header>
                    <footer class="flex flex-wrap items-center gap-4 text-sm text-slate-500 pl-[52px] sm:pl-14">
                        <button @click="$emit('like-comment', comment.id)"
                            class="inline-flex items-center gap-1 hover:text-blue-500 transition">
                            <i :class="`${comment.is_liked ? 'fas text-blue-500' : 'far'} fa-thumbs-up`"></i>
                            <span>{{ comment.likes || 0 }}</span>
                        </button>
                        <button @click="$emit('reply-comment', comment.id)"
                            class="inline-flex items-center gap-1 hover:text-blue-500 transition">
                            <i class="far fa-comment"></i>
                            <span>Trả lời</span>
                        </button>
                    </footer>
                    <!-- Replies -->
                    <div v-if="comment.replies && comment.replies.length > 0"
                        class="pl-[52px] sm:pl-14 space-y-2 border-l border-slate-100 ml-3 sm:ml-5">
                        <article v-for="reply in comment.replies" :key="reply.id" class="rounded-xl bg-slate-50/90 p-3">
                            <div class="flex items-center justify-between">
                                <h5 class="font-medium text-sm text-slate-800">{{ reply.user_name }}</h5>
                                <time class="text-xs text-slate-400">{{ formatDate(reply.created_at) }}</time>
                            </div>
                            <p class="text-sm text-slate-600 mt-1 leading-relaxed">{{ reply.content }}</p>
                        </article>
                    </div>
                </article>
            </div>

            <!-- Pagination -->
            <div v-if="comments.length > 0 && hasMoreComments" class="pt-2 text-center">
                <button @click="$emit('load-more')"
                    class="px-4 py-2 rounded-full border border-slate-200 text-sm font-medium text-blue-500 hover:border-blue-300 hover:text-blue-600 transition">
                    Xem thêm bình luận
                </button>
            </div>
        </div>

        <transition name="fade">
            <div v-if="showMobileComposer"
                class="sm:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center p-4">
                <div class="w-full max-w-md bg-white rounded-3xl p-4 space-y-3 shadow-xl">
                    <div class="flex items-center justify-between">
                        <h4 class="text-base font-semibold text-slate-800">Viết bình luận</h4>
                        <button @click="showMobileComposer = false" class="text-slate-400 hover:text-slate-600">
                            <i class="fas fa-times text-lg"></i>
                        </button>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                            <i class="fas fa-user"></i>
                        </div>
                        <p class="text-sm text-slate-500">Chia sẻ suy nghĩ của bạn</p>
                    </div>
                    <form @submit.prevent="handleMobileSubmit" class="space-y-3">
                        <textarea :value="newComment" @input="$emit('update:newComment', $event.target.value)"
                            class="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                            rows="4" placeholder="Nhập bình luận..."></textarea>
                        <div class="flex items-center justify-between gap-2">
                            <button type="button" @click="showMobileComposer = false"
                                class="w-1/3 rounded-full border border-slate-200 py-2 text-sm font-medium text-slate-500">
                                Đóng
                            </button>
                            <button type="submit" :disabled="!newComment.trim()" :class="`flex-1 rounded-full py-2 text-sm font-semibold transition ${newComment.trim()
                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                }`">
                                Gửi bình luận
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </transition>
    </section>
</template>

<script>
export default {
    name: 'ProfileComments',
    props: {
        comments: {
            type: Array,
            default: () => []
        },
        newComment: {
            type: String,
            default: ''
        },
        hasMoreComments: {
            type: Boolean,
            default: false
        }
    },
    emits: ['submit-comment', 'like-comment', 'reply-comment', 'load-more', 'update:newComment'],
    data() {
        return {
            showMobileComposer: false
        }
    },
    methods: {
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';
            return date.toLocaleDateString('vi-VN');
        },
        handleMobileSubmit() {
            if (!this.newComment.trim()) return;
            this.$emit('submit-comment');
            this.showMobileComposer = false;
        }
    }
}
</script>
