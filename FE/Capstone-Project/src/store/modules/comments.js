import commentService from '../../services/commentService';

export default {
  namespaced: true,
  state: {
    comments: [],
    loading: false,
    error: null,
    hasMore: false,
    page: 1,
  },
  getters: {
    allComments: state => state.comments,
    isLoading: state => state.loading,
    hasError: state => !!state.error,
    hasMore: state => state.hasMore,
    page: state => state.page,
  },
  mutations: {
    SET_COMMENTS(state, comments) {
      state.comments = comments;
    },
    APPEND_COMMENTS(state, comments) {
      state.comments = [...state.comments, ...comments];
    },
    ADD_COMMENT(state, comment) {
      state.comments.unshift(comment);
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_HAS_MORE(state, hasMore) {
      state.hasMore = hasMore;
    },
    SET_PAGE(state, page) {
      state.page = page;
    }
  },
  actions: {
    async fetchComments({ commit }, { profileId, page = 1 }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const data = await commentService.getComments(profileId, page);
        const commentsArr = data.comments || [];
        if (page === 1) {
          commit('SET_COMMENTS', commentsArr);
        } else {
          commit('APPEND_COMMENTS', commentsArr);
        }
        commit('SET_HAS_MORE', !!data.has_more);
        commit('SET_PAGE', page);
      } catch (error) {
        commit('SET_ERROR', error.message || 'Không thể tải bình luận');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async postComment({ commit }, { profileId, content }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const comment = await commentService.postComment(profileId, content);
        commit('ADD_COMMENT', comment);
        return comment;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Không thể gửi bình luận');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
};