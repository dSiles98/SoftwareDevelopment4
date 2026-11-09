import { element } from '../utils/dom.js';
import { createUserCard } from './user-card.js';

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
  for (const user of users) grid.append(createUserCard(user));
}
