const cache = new Map();

const TTL = 24 * 60 * 60 * 1000;

function get(key) {
    const item = cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
        cache.delete(key);
        return null;
    }

    return item.value;
}

function set(key, value, ttl = TTL) {
    cache.set(key, {
        value,
        expiry: Date.now() + ttl
    });
}

module.exports = { get, set };
