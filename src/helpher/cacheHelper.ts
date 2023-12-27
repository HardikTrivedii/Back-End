import NodeCache from "node-cache";

// Use a simple in-memory cache, adjust as needed for production
const cache = new NodeCache({
  stdTTL: 60, // Time to live in seconds (adjust as needed)
  checkperiod: 120, // Check for expired keys every 120 seconds
});

const cacheHelper = {
  // Key generation function for caching
  generateKey: (query: string) => `query:${query}`,

  // Get data from cache or fetch from the database and cache it
  getOrSet: async <T>(key: string, fetchFn: () => Promise<T>): Promise<T> => {
    const cachedData = cache.get<T>(key);

    if (cachedData !== undefined) {
      console.log("Data retrieved from cache.");
      return cachedData;
    }

    console.log("Data not found in cache. Fetching from the database...");
    const newData = await fetchFn();

    // Cache the fetched data
    cache.set(key, newData);

    return newData;
  },

  // Clear cache for a specific key
  clearKey: (key: string) => cache.del(key),

  // Clear the entire cache
  clearAll: () => cache.flushAll(),
};

export default cacheHelper;
