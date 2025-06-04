import api from "./api";

const searchService = {
  // Tìm kiếm hồ sơ với truy vấn ngôn ngữ tự nhiên
  searchProfiles(query) {
    return api.post("/search-profiles/", { query });
  },

  // Tìm kiếm nâng cao với các tham số lọc
  advancedSearch(params) {
    return api.get("/profiles/", { params });
  },
};

export default searchService;
