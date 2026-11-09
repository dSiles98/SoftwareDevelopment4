const entries = new Map();

export function readCache(key) {
  const entry = entries.get(key);
  if (!entry) return null;
  if (Date.now() >= entry.expiresAt) {
    entries.delete(key);
    return null;
  }
  return entry.value;
}

export function writeCache(key, value, ttl = 60_000) {
  entries.set(key, { value, expiresAt: Date.now() + ttl });
}

export function clearCache() {
  entries.clear();
}
