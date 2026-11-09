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
  if (!Array.isArray(result.data)) {
    throw Object.assign(new Error(`La respuesta de ${path} no tiene el formato de lista esperado.`), { record: result.record });
  }
  const stored = { ...result, source: 'network' };
  writeCache(key, stored);
  return stored;
}

export async function getRestUsersAndPosts({ forceNetwork = false } = {}) {
  const settled = await Promise.allSettled([
    getResource('/users', forceNetwork),
    getResource('/posts', forceNetwork),
  ]);
  const requestLabels = ['Solicitud 1 de 2 — Usuarios', 'Solicitud 2 de 2 — Publicaciones'];
  const records = settled.flatMap((result, index) => {
    const record = result.status === 'fulfilled' ? result.value.record : result.reason?.record;
    if (!record) return [];
    record.label = requestLabels[index];
    return [record];
  });
  const failure = settled.find(result => result.status === 'rejected');
  if (failure) {
    const cause = failure.reason;
    throw Object.assign(new Error(cause?.message || 'No se pudieron cargar usuarios y publicaciones.'), {
      record: cause?.record,
      records,
      cause,
    });
  }
  const [usersResult, postsResult] = settled.map(result => result.value);
  const users = usersResult.data.map(user => ({
    id: Number(user.id), username: user.username, email: user.email,
    geo: user.address?.geo ? { lat: user.address.geo.lat, lng: user.address.geo.lng } : null,
    posts: postsResult.data.filter(post => Number(post.userId) === Number(user.id)).map(post => ({ id: Number(post.id), title: post.title, body: post.body })),
  }));
  return { users, records, sources: [usersResult.source, postsResult.source] };
}
