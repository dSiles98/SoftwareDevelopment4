import { element } from './utils/dom.js';
import { clearCache } from './utils/cache.js';
import { currentRoute, navigate, subscribeRoute } from './router/router.js';
import { createAppHeader } from './components/app-header.js';
import { createUserList, renderUsers } from './components/user-list.js';
import { renderRequestInspector } from './components/request-inspector.js';
import { createEducationSections } from './components/comparison-panel.js';
import { showStatus } from './components/status-message.js';
import { loadRestView } from './views/users-rest-view.js';
import { loadGraphqlView } from './views/users-graphql-view.js';

const app = document.querySelector('#app');
const shell = element('div', 'mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8');
const { header, restLink, graphqlLink: gqlLink } = createAppHeader();

const main = element('main', 'pt-8');
const hero = element('section', 'mb-6 flex flex-col gap-5 rounded-3xl bg-slate-900 p-6 text-white sm:p-8 lg:flex-row lg:items-end lg:justify-between');
const heroCopy = element('div', 'max-w-3xl');
heroCopy.append(element('p', 'text-xs font-bold uppercase tracking-[.22em] text-sky-300', 'Integración cliente · servidor'), element('h1', 'mt-3 text-3xl font-bold tracking-tight sm:text-4xl', 'Usuarios y publicaciones'), element('p', 'mt-3 text-sm leading-6 text-slate-300 sm:text-base', 'Una demostración práctica para observar cómo REST y GraphQL obtienen y relacionan los mismos datos.'));
const actions = element('div', 'flex flex-wrap gap-2');
const refreshButton = element('button', 'rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-sky-100', 'Volver a solicitar'); refreshButton.type = 'button';
const clearButton = element('button', 'rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-slate-800', 'Invalidar caché'); clearButton.type = 'button';
actions.append(refreshButton, clearButton); hero.append(heroCopy, actions);

const sectionHeader = element('section', 'mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between');
const headingBox = element('div'); const title = element('h2', 'text-2xl font-bold tracking-tight text-slate-900'); const description = element('p', 'mt-1 max-w-3xl text-sm leading-6 text-slate-600'); headingBox.append(title, description);
const serviceBadge = element('span', 'inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700');
sectionHeader.append(headingBox, serviceBadge);
const status = element('div', 'mb-4'); const users = createUserList();

const inspectorSection = element('aside', 'mt-10'); inspectorSection.setAttribute('aria-labelledby', 'inspector-title');
const inspectorHeading = element('div', 'mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between');
const inspectorTitle = element('h2', 'text-xl font-bold text-slate-900', 'Request Inspector'); inspectorTitle.id = 'inspector-title'; inspectorHeading.append(inspectorTitle, element('p', 'max-w-2xl text-xs leading-5 text-slate-500', 'Una petición por bloque. Algunos headers de respuesta se ocultan a JavaScript por las reglas CORS.'));
const inspector = element('div', 'space-y-3'); inspectorSection.append(inspectorHeading, inspector);
const education = createEducationSections();
main.append(hero, sectionHeader, status, users, inspectorSection, education);
const footer = element('footer', 'mt-12 border-t border-slate-200 pt-6 text-xs leading-5 text-slate-500', 'Demo educativa · Datos ficticios de JSONPlaceholder y GraphQLZero · Sin escrituras ni credenciales.');
shell.append(header, main, footer); app.replaceChildren(shell);

let activeController = 0;
function routeClick(event) {
  const link = event.target.closest('a[data-route]');
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault(); navigate(link.dataset.route);
}
app.addEventListener('click', routeClick);
// Suscribirse antes del primer render garantiza que Atrás/Adelante funcione
// también al abrir directamente una ruta profunda.
subscribeRoute(() => renderRoute());
refreshButton.addEventListener('click', () => renderRoute(true));
clearButton.addEventListener('click', () => { clearCache(); renderRoute(false, 'Caché en memoria invalidada.'); });

async function renderRoute(forceNetwork = false, notice = '') {
  const callId = ++activeController;
  const route = currentRoute();
  const isGraphql = route === 'graphql';
  const path = isGraphql ? '/users/graphql' : '/users/rest';
  restLink.className = linkClasses(!isGraphql); gqlLink.className = linkClasses(isGraphql);
  restLink.setAttribute('aria-current', !isGraphql ? 'page' : 'false'); gqlLink.setAttribute('aria-current', isGraphql ? 'page' : 'false');
  title.textContent = isGraphql ? 'Users with GraphQL' : 'Users with REST';
  description.textContent = isGraphql ? 'Consultas parametrizadas en dos fases obtienen los usuarios y sus publicaciones relacionadas mediante GraphQLZero.' : 'Dos solicitudes GET independientes recuperan usuarios y publicaciones; el navegador los relaciona con userId.';
  serviceBadge.replaceChildren(element('span', `status-dot ${isGraphql ? 'bg-violet-500' : 'bg-emerald-500'}`), document.createTextNode(isGraphql ? 'GraphQLZero · Fetch POST' : 'JSONPlaceholder · Fetch GET'));
  users.replaceChildren(); renderRequestInspector(inspector, []);
  if (notice) showStatus(status, 'success', notice);
  const callbacks = {
    status,
    onData(result) { if (callId !== activeController) return; renderUsers(users, result.users); renderRequestInspector(inspector, result.records); },
    onError(records) { if (callId !== activeController) return; renderRequestInspector(inspector, records); },
    forceNetwork,
  };
  if (isGraphql) await loadGraphqlView(callbacks);
  else await loadRestView(callbacks);
}
function linkClasses(active) { return `rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2 ${active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`; }

renderRoute();
