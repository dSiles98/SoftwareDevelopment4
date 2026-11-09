const routes = new Map([
  ['/users/rest', 'rest'],
  ['/users/graphql', 'graphql'],
]);

export function currentRoute() { return routes.get(location.pathname) || 'rest'; }

export function navigate(path) {
  if (!routes.has(path)) path = '/users/rest';
  if (location.pathname !== path) history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function subscribeRoute(callback) { window.addEventListener('popstate', callback); }
