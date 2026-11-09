import { element } from "../utils/dom.js";
import { createPostItem } from "./post-item.js";

export function createPostList(user) {
  const list = element("ul", "mt-4 space-y-2");
  list.id = `posts-${user.id}`;
  if (!user.posts.length)
    list.append(
      element("li", "text-sm text-neutral-500", "No posts available."),
    );
  else user.posts.forEach((post) => list.append(createPostItem(post)));
  return list;
}
