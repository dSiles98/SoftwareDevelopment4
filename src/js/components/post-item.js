import { element } from '../utils/dom.js';

export function createPostItem(post) {
  return element('li', 'rounded-lg bg-slate-50 px-3 py-2 text-sm leading-5 text-slate-700', post.title || 'Publicación sin título');
}
