import { request } from "./http-client.js";

const ENDPOINT = "https://graphqlzero.almansi.me/api";
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
  const operationName = query === USER_QUERY ? "UserById" : "UserPostsById";
  const body = JSON.stringify({
    query,
    variables: { id: String(id) },
    operationName,
  });
  let result;
  try {
    result = await request({
      url: ENDPOINT,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    });
  } catch (error) {
    if (error.record) error.record.label = label;
    throw error;
  }
  result.record.label = label;
  return {
    user: result.data?.data?.user,
    errors: (result.data?.errors ?? []).map(
      (item) => item.message || "GraphQL error without a message.",
    ),
    record: result.record,
  };
}

function requestFailure(error, fallback) {
  return {
    error: error?.message || (typeof error === "string" ? error : fallback),
    record: error?.record ?? null,
  };
}

export async function getGraphqlUsers() {
  const ids = Array.from({ length: 10 }, (_, index) => index + 1);
  const userResults = await Promise.allSettled(
    ids.map((id) => runQuery(USER_QUERY, id, `User ${id} — user query`)),
  );
  const records = [];
  const errors = [];
  const users = [];
  const usersById = new Map();

  userResults.forEach((result, index) => {
    const id = ids[index];
    if (result.status === "rejected") {
      const failure = requestFailure(
        result.reason,
        `Could not query user ${id}.`,
      );
      if (failure.record) records.push(failure.record);
      errors.push(`User ${id}: ${failure.error}`);
      return;
    }
    const response = result.value.user;
    records.push(result.value.record);
    result.value.errors.forEach((message) =>
      errors.push(`User ${id}: ${message}`),
    );
    if (response?.id == null) {
      if (!result.value.errors.length)
        errors.push(`User ${id}: GraphQLZero did not return this user.`);
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

  const validUserIds = [...usersById.keys()];
  const postResults = await Promise.allSettled(
    validUserIds.map((id) =>
      runQuery(USER_POSTS_QUERY, id, `User ${id} — related posts`),
    ),
  );

  postResults.forEach((result, index) => {
    const id = validUserIds[index];
    if (result.status === "rejected") {
      const failure = requestFailure(
        result.reason,
        `Could not query posts for user ${id}.`,
      );
      if (failure.record) records.push(failure.record);
      errors.push(`Posts for user ${id}: ${failure.error}`);
      return;
    }
    const user = usersById.get(id);
    records.push(result.value.record);
    result.value.errors.forEach((message) =>
      errors.push(`Posts for user ${id}: ${message}`),
    );
    user.posts = (result.value.user?.posts?.data ?? []).map((post) => ({
      id: Number(post.id),
      title: post.title,
      body: "",
    }));
  });

  return { users, records, errors };
}
