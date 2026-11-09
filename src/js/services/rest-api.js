import { request } from './http-client.js';
import { readCache, writeCache } from '../utils/cache.js';

const BASE = 'https://jsonplaceholder.typicode.com';

async function getResource(path, forceNetwork) {
  const key = `${BASE}${path}`;
  if (!forceNetwork) {
    const cached = readCache(key);
    if (cached) return { ...cached, source: 'memory' };
  }
  const result = await request({ url: key, headers: { Accept: 'application/json' } });
  const stored = { ...result, source: 'network' };
  writeCache(key, stored);
  return stored;
}

export async function getRestUsersAndPosts({ forceNetwork = false } = {}) {
  const [usersResult, postsResult] = await Promise.all([
    getResource('/users', forceNetwork),
    getResource('/posts', forceNetwork),
  ]);
  const users = usersResult.data.map(user => ({
    id: Number(user.id), username: user.username, email: user.email,
    geo: user.address?.geo ? { lat: user.address.geo.lat, lng: user.address.geo.lng } : null,
    posts: postsResult.data.filter(post => Number(post.userId) === Number(user.id)).map(post => ({ id: Number(post.id), title: post.title, body: post.body })),
  }));
  return { users, records: [usersResult.record, postsResult.record], sources: [usersResult.source, postsResult.source] };
}
