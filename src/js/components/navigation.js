import { element } from '../utils/dom.js';

export function createNavigation() {
  const nav = element('nav', 'flex flex-wrap gap-2');
  nav.setAttribute('aria-label', 'Navegación principal');
  const restLink = createRouteLink('/users/rest', 'Users with REST');
  const graphqlLink = createRouteLink('/users/graphql', 'Users with GraphQL');
  nav.append(restLink, graphqlLink);
  return { nav, restLink, graphqlLink };
}

function createRouteLink(path, label) {
  const link = element('a', 'rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2');
  link.href = path;
  link.dataset.route = path;
  link.textContent = label;
  return link;
}
