import { request } from './http-client.js';

const ENDPOINT = 'https://graphqlzero.almansi.me/api';
const USER_QUERY = `query UserWithPosts($id: ID!) {
  user(id: $id) {
    id
    username
    email
    address { geo { lat lng } }
    posts { data { id title } }
  }
}`;

async function getUser(id) {
  const body = JSON.stringify({ query: USER_QUERY, variables: { id: String(id) }, operationName: 'UserWithPosts' });
  const result = await request({ url: ENDPOINT, method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body });
  if (result.data?.errors?.length) {
    const error = new Error(result.data.errors.map(item => item.message).join('; '));
    error.record = result.record;
    throw error;
  }
  const user = result.data?.data?.user;
  if (!user) {
    const error = new Error(`GraphQL no devolvió el usuario ${id}.`);
    error.record = result.record;
    throw error;
  }
  return { user: { id: Number(user.id), username: user.username, email: user.email, geo: user.address?.geo ?? null, posts: (user.posts?.data ?? []).map(post => ({ id: Number(post.id), title: post.title, body: '' })) }, record: result.record };
}

export async function getGraphqlUsers() {
  const settled = await Promise.allSettled(Array.from({ length: 10 }, (_, index) => getUser(index + 1)));
  const users = [];
  const records = [];
  const errors = [];
  settled.forEach((result, index) => {
    if (result.status === 'fulfilled') { users.push(result.value.user); records.push(result.value.record); }
    else { if (result.reason.record) records.push(result.reason.record); errors.push(`Usuario ${index + 1}: ${result.reason.message}`); }
  });
  return { users, records, errors };
}
