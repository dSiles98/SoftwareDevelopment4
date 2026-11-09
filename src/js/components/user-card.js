import { element } from '../utils/dom.js';
import { createPostList } from './post-list.js';

export function createUserCard(user) {
  const card = element('article', 'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm');
  const top = element('div', 'border-b border-slate-100 p-5');
  top.append(element('p', 'mb-2 text-xs font-semibold uppercase tracking-wider text-sky-700', `Usuario ${user.id}`));
  top.append(element('h3', 'text-lg font-bold text-slate-900', user.username || 'Sin username'));
  top.append(element('p', 'mt-1 break-all text-sm text-slate-600', user.email || 'Email no disponible'));
  if (user.geo) top.append(element('p', 'mt-3 text-xs text-slate-500', `Coordenadas: ${user.geo.lat}, ${user.geo.lng}`));
  const footer = element('div', 'p-5');
  const toggle = element('button', 'rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200', `${user.posts.length} publicaciones · Ocultar publicaciones`);
  toggle.type = 'button';
  toggle.dataset.action = 'toggle-posts';
  toggle.dataset.userId = String(user.id);
  toggle.setAttribute('aria-expanded', 'true');
  toggle.setAttribute('aria-controls', `posts-${user.id}`);
  footer.append(toggle, createPostList(user));
  card.append(top, footer);
  return card;
}
