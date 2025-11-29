const { LRUCache } = require('lru-cache');

const cache = new LRUCache({
    max: 1000,
    ttl: 24 * 60 * 60 * 1000,
});

module.exports = cache;
