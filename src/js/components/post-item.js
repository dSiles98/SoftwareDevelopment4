import { element } from "../utils/dom.js";

export function createPostItem(post) {
  return element(
    "li",
    "rounded-lg border border-neutral-200 px-3 py-2 text-sm leading-5 text-neutral-700 whitespace-pre-line",
    post.body || post.title || "Post content unavailable",
  );
}
