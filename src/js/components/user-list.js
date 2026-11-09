import { element } from '../utils/dom.js';

export function createUserList() {
  const grid = element('section', 'user-grid');
  grid.setAttribute('aria-label', 'Usuarios y publicaciones');
  grid.addEventListener('click', event => {
    const button = event.target.closest('[data-action="toggle-posts"]');
    if (!button || !grid.contains(button)) return;
    const list = grid.querySelector(`#posts-${CSS.escape(button.dataset.userId)}`);
    if (!list) return;
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    list.hidden = expanded;
    button.textContent = expanded ? 'Mostrar publicaciones' : 'Ocultar publicaciones';
  });
  return grid;
}

export function renderUsers(grid, users) {
  grid.replaceChildren();
  for (const user of users) {
    const card = element('article', 'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm');
    const top = element('div', 'border-b border-slate-100 p-5');
    const badge = element('p', 'mb-2 text-xs font-semibold uppercase tracking-wider text-sky-700', `Usuario ${user.id}`);
    const title = element('h3', 'text-lg font-bold text-slate-900', user.username || 'Sin username');
    const email = element('p', 'mt-1 break-all text-sm text-slate-600', user.email || 'Email no disponible');
    top.append(badge, title, email);
    if (user.geo) {
      const coordinates = element('p', 'mt-3 text-xs text-slate-500', `Coordenadas: ${user.geo.lat}, ${user.geo.lng}`);
      top.append(coordinates);
    }
    const footer = element('div', 'p-5');
    const toggle = element('button', 'rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200', `${user.posts.length} publicaciones · Ocultar publicaciones`);
    toggle.type = 'button'; toggle.dataset.action = 'toggle-posts'; toggle.dataset.userId = String(user.id); toggle.setAttribute('aria-expanded', 'true');
    const list = element('ul', 'mt-4 space-y-2'); list.id = `posts-${user.id}`;
    if (!user.posts.length) list.append(element('li', 'text-sm text-slate-500', 'Sin publicaciones disponibles.'));
    for (const post of user.posts) {
      const item = element('li', 'rounded-lg bg-slate-50 px-3 py-2 text-sm leading-5 text-slate-700', post.title || 'Publicación sin título');
      list.append(item);
    }
    footer.append(toggle, list); card.append(top, footer); grid.append(card);
  }
}
