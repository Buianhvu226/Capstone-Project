/**
 * Cache Service - Quản lý cache cho API requests
 * Sử dụng localStorage để lưu cache với TTL (Time To Live)
 */

const CACHE_PREFIX = 'profile_cache_';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 phút (milliseconds)

/**
 * Tạo cache key từ params
 */
const createCacheKey = (params) => {
  // Sắp xếp params để đảm bảo key nhất quán
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        acc[key] = params[key];
      }
      return acc;
    }, {});
  
  return CACHE_PREFIX + JSON.stringify(sortedParams);
};

/**
 * Lấy dữ liệu từ cache
 */
const getCache = (params) => {
  try {
    const cacheKey = createCacheKey(params);
    const cachedData = localStorage.getItem(cacheKey);
    
    if (!cachedData) {
      return null;
    }
    
    const { data, timestamp, ttl } = JSON.parse(cachedData);
    const now = Date.now();
    
    // Kiểm tra cache có hết hạn không
    if (now - timestamp > (ttl || DEFAULT_TTL)) {
      // Cache đã hết hạn, xóa nó
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
};

/**
 * Lưu dữ liệu vào cache
 */
const setCache = (params, data, customTTL = null) => {
  try {
    const cacheKey = createCacheKey(params);
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl: customTTL || DEFAULT_TTL
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error saving cache:', error);
    // Nếu localStorage đầy, xóa cache cũ nhất
    clearOldCache();
  }
};

/**
 * Xóa cache cũ nhất khi localStorage đầy
 */
const clearOldCache = () => {
  try {
    const cacheKeys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_PREFIX));
    
    if (cacheKeys.length === 0) return;
    
    // Sắp xếp theo timestamp (cũ nhất trước)
    const cacheEntries = cacheKeys.map(key => {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        return { key, timestamp: data.timestamp };
      } catch {
        return { key, timestamp: 0 };
      }
    }).sort((a, b) => a.timestamp - b.timestamp);
    
    // Xóa 20% cache cũ nhất
    const toDelete = Math.ceil(cacheEntries.length * 0.2);
    for (let i = 0; i < toDelete; i++) {
      localStorage.removeItem(cacheEntries[i].key);
    }
  } catch (error) {
    console.error('Error clearing old cache:', error);
  }
};

/**
 * Xóa tất cả cache
 */
const clearAllCache = () => {
  try {
    const cacheKeys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_PREFIX));
    cacheKeys.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing all cache:', error);
  }
};

/**
 * Xóa cache theo pattern (ví dụ: xóa cache của một profile cụ thể)
 */
const clearCacheByPattern = (pattern) => {
  try {
    const cacheKeys = Object.keys(localStorage).filter(key => 
      key.startsWith(CACHE_PREFIX) && key.includes(pattern)
    );
    cacheKeys.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing cache by pattern:', error);
  }
};

/**
 * Làm sạch cache đã hết hạn
 */
const cleanExpiredCache = () => {
  try {
    const cacheKeys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_PREFIX));
    const now = Date.now();
    
    cacheKeys.forEach(key => {
      try {
        const cachedData = JSON.parse(localStorage.getItem(key));
        const { timestamp, ttl } = cachedData;
        
        if (now - timestamp > (ttl || DEFAULT_TTL)) {
          localStorage.removeItem(key);
        }
      } catch {
        // Nếu không parse được, xóa luôn
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error cleaning expired cache:', error);
  }
};

// Tự động làm sạch cache đã hết hạn khi load module
cleanExpiredCache();

export default {
  getCache,
  setCache,
  clearAllCache,
  clearCacheByPattern,
  cleanExpiredCache,
  DEFAULT_TTL
};

