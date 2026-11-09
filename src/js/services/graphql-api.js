import { request } from './http-client.js';

const ENDPOINT = 'https://graphqlzero.almansi.me/api';
const USER_QUERY = `query UserById($id: ID!) {
  user(id: $id) {
    id
    username
    email
    address { geo { lat lng } }
  }
}`;
const USER_POSTS_QUERY = `query UserPostsById($id: ID!) {
  user(id: $id) {
    posts { data { id title } }
  }
}`;

async function runQuery(query, id, label) {
  const operationName = query === USER_QUERY ? 'UserById' : 'UserPostsById';
  const body = JSON.stringify({ query, variables: { id: String(id) }, operationName });
  const result = await request({
    url: ENDPOINT,
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body,
  });
  result.record.label = label;
  if (result.data?.errors?.length) {
    const error = new Error(result.data.errors.map(item => item.message).join('; '));
    error.record = result.record;
    throw error;
  }
  return { user: result.data?.data?.user, record: result.record };
}

function requestFailure(error, fallback) {
  return { error: error.message || fallback, record: error.record ?? null };
}

export async function getGraphqlUsers() {
  const ids = Array.from({ length: 10 }, (_, index) => index + 1);
  const userResults = await Promise.allSettled(ids.map(id => runQuery(USER_QUERY, id, `Usuario ${id} — consulta de usuario`)));
  const records = [];
  const errors = [];
  const users = [];
  const usersById = new Map();

  userResults.forEach((result, index) => {
    const id = ids[index];
    if (result.status === 'rejected') {
      const failure = requestFailure(result.reason, `No se pudo consultar el usuario ${id}.`);
      if (failure.record) records.push(failure.record);
      errors.push(`Usuario ${id}: ${failure.error}`);
      return;
    }
    const response = result.value.user;
    records.push(result.value.record);
    if (response?.id == null) {
      errors.push(`Usuario ${id}: GraphQLZero no devolvió ese usuario.`);
      return;
    }
    const user = {
      id: Number(response.id),
      username: response.username,
      email: response.email,
      geo: response.address?.geo ?? null,
      posts: [],
    };
    users.push(user);
    usersById.set(id, user);
  });

  // Las publicaciones se consultan solo después de identificar usuarios válidos;
  // cada relación se resuelve en GraphQLZero, no mediante filtrado en el cliente.
  const postResults = await Promise.allSettled([...usersById.keys()].map(id =>
    runQuery(USER_POSTS_QUERY, id, `Usuario ${id} — publicaciones relacionadas`)
  ));

  postResults.forEach((result, index) => {
    const id = [...usersById.keys()][index];
    if (result.status === 'rejected') {
      const failure = requestFailure(result.reason, `No se pudieron consultar las publicaciones del usuario ${id}.`);
      if (failure.record) records.push(failure.record);
      errors.push(`Publicaciones del usuario ${id}: ${failure.error}`);
      return;
    }
    const user = usersById.get(id);
    records.push(result.value.record);
    user.posts = (result.value.user?.posts?.data ?? []).map(post => ({ id: Number(post.id), title: post.title, body: '' }));
  });

  return { users, records, errors };
}
