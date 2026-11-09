import { element } from '../utils/dom.js';

export function createEducationSections() {
  const section = element('section', 'mt-12 space-y-5');
  section.setAttribute('aria-labelledby', 'learning-title');
  section.append(element('div', 'mb-2', ''));
  const heading = element('div', '');
  heading.append(element('p', 'text-xs font-bold uppercase tracking-[.2em] text-sky-700', 'Aula breve'), element('h2', 'mt-2 text-2xl font-bold tracking-tight text-slate-900', 'Conceptos para explorar'), element('p', 'mt-2 max-w-3xl text-sm leading-6 text-slate-600', 'Usa los paneles como guía mientras observas solicitudes reales, estados y datos relacionados.'));
  heading.querySelector('h2').id = 'learning-title'; section.append(heading);

  const compare = panel('REST y GraphQL', 'REST organiza recursos en endpoints. GraphQL permite seleccionar campos y recorrer relaciones en una operación. En esta demo REST obtiene /users y /posts y relaciona cada post por userId en el navegador; GraphQL consulta user(id) y la relación user.posts, que entrega las publicaciones relacionadas desde el servidor. La comparación describe esta aplicación, no una regla de rendimiento universal.');
  const table = element('div', 'mt-4 overflow-x-auto rounded-xl border border-slate-200');
  const rows = [['Obtención de usuarios', 'GET /users (una solicitud)', 'Consultas por ID 1–10'], ['Publicaciones', 'GET /posts; se filtran con JavaScript', 'Relación user.posts'], ['Selección de campos', 'La define la respuesta REST', 'Se declaran en la consulta'], ['Cliente HTTP', 'Fetch GET', 'Fetch POST con query y variables']];
  table.append(makeTable(['Concepto', 'REST', 'GraphQL'], rows)); compare.append(table);
  compare.append(element('p', 'mt-3 text-sm leading-6 text-slate-600', 'Over-fetching: recibir campos que la pantalla no usa. Under-fetching: necesitar más solicitudes para completar una pantalla. REST es práctico con recursos y contratos estables; GraphQL ayuda cuando los clientes necesitan selecciones y relaciones distintas. La elección depende del contexto, arquitectura y requisitos.'));

  const methods = panel('Métodos HTTP e idempotencia', 'Idempotente significa que repetir la misma solicitud produce el mismo efecto final previsto. Seguro significa que la intención del método es lectura, sin cambio solicitado en el estado del servidor. Esta demo solo ejecuta GET y POST de consulta GraphQL.');
  methods.append(makeTable(['Método', 'Seguro', 'Idempotente', 'Uso conceptual'], [['GET', 'Sí', 'Sí', 'Leer un recurso'], ['POST', 'No', 'No (en general)', 'Crear/enviar una operación; aquí consulta GraphQL'], ['PUT', 'No', 'Sí', 'Reemplazar un recurso completo'], ['PATCH', 'No', 'No (en general)', 'Cambiar campos concretos'], ['DELETE', 'No', 'Sí', 'Eliminar un recurso']]));
  methods.append(element('p', 'mt-3 text-sm leading-6 text-slate-600', 'PUT describe reemplazo completo; PATCH describe modificación parcial. Idempotencia se refiere al efecto previsto, no a que cada respuesta tenga que ser idéntica.'));

  const inspector = panel('Request Inspector y headers', 'Abre las solicitudes de arriba para ver método, URL, headers enviados, estado, tiempo, headers de respuesta expuestos al navegador y body. En GraphQL el body real contiene query y variables. JavaScript solo puede leer los headers de respuesta permitidos por CORS; el resto puede verse en DevTools.');
  inspector.append(element('p', 'mt-3 text-sm leading-6 text-slate-600', 'Accept expresa formatos aceptados; Content-Type declara el formato del body. Authorization es un header conceptual para credenciales y aquí no se envía. Cache-Control controla directivas de caché; ETag identifica una versión y puede combinarse con If-None-Match. Origin lo agrega el navegador; Access-Control-Allow-Origin es una respuesta CORS que indica orígenes permitidos. La aplicación muestra solo valores observados.'));

  const cors = panel('CORS y Same-Origin Policy', 'Same-Origin Policy limita cómo un documento accede a respuestas de otro origen. CORS es el mecanismo mediante el que el servidor declara qué orígenes pueden leer la respuesta, mediante headers como Access-Control-Allow-Origin. El navegador puede enviar una petición OPTIONS de preflight antes de una solicitud que no califica como simple, por ejemplo por ciertos métodos o headers.');
  cors.append(element('p', 'mt-3 text-sm leading-6 text-slate-600', 'Un GET simple puede no producir preflight. El POST JSON de GraphQL suele requerirlo por Content-Type: application/json. La lista visible aquí incluye solo fetches del endpoint, no representa un OPTIONS si no se observó. En Chrome DevTools abre Network, inspecciona OPTIONS y la solicitud principal, y revisa Console cuando CORS bloquea la lectura.'));

  const caching = panel('Caché HTTP y caché en memoria', 'La aplicación guarda respuestas REST por URL durante un minuto en memoria. Usa “Volver a solicitar” para saltar esa caché local, o “Invalidar caché” para borrarla y después volver a consultar. El panel señala “Red” o “Caché local”.');
  caching.append(element('p', 'mt-3 text-sm leading-6 text-slate-600', 'La caché HTTP del navegador y sus políticas Cache-Control/ETag son distintas de este Map en JavaScript. If-None-Match puede permitir una respuesta 304 si el servidor lo admite; no se fuerza ni se inventa esa demostración. Revisa los headers reales en el inspector.'));

  const odata = panel('OData y JSON:API', 'Son convenciones de API diferentes; JSONPlaceholder y GraphQLZero no se presentan como servicios OData o JSON:API.');
  odata.append(makeTable(['Convención', 'URL conceptual', 'Significado'], [['OData', '/Users?$filter=UserId eq 1&$select=Id,Name', '$filter limita registros; $select elige propiedades'], ['JSON:API', '/posts?filter[userId]=1&fields[posts]=title,body', 'filter expresa criterio; fields limita atributos']]));
  odata.append(element('p', 'mt-3 text-sm text-slate-600', 'En esta demo, REST obtiene todas las publicaciones y filtra localmente con post.userId === user.id. GraphQL pide las publicaciones a través de user.posts, y la relación hace el filtrado en el servidor.'));

  const dom = panel('DOM, seguridad y eventos', 'Las respuestas externas se representan con createElement y textContent. textContent inserta texto literal; innerHTML interpreta cadenas como marcado y puede crear XSS si el contenido no confiable se inserta como HTML. La lista delega el evento de alternar publicaciones desde su contenedor.');
  dom.append(codeSample("const title = document.createElement('p');\ntitle.textContent = post.title;\nlist.append(title);"));

  const async = panel('Promises, async/await y Event Loop', 'async/await hace más lineal el flujo de Promises y permite manejar errores con try/catch. Promise.all agrupa tareas independientes y falla si alguna falla; Promise.allSettled permite registrar errores parciales de usuarios GraphQL.');
  async.append(codeSample("console.log('síncrono');\nPromise.resolve().then(() => console.log('microtask'));\nsetTimeout(() => console.log('tarea del navegador'), 0);\n// Orden esperado: síncrono → microtask → tarea"));
  async.append(element('p', 'mt-3 text-sm leading-6 text-slate-600', 'El navegador ejecuta primero el código síncrono, luego vacía la cola de microtasks (por ejemplo, continuaciones de Promise) y después procesa tareas como callbacks de temporizador y eventos, coordinando el renderizado.'));

  section.append(compare, methods, inspector, cors, caching, odata, dom, async);
  return section;
}

function panel(title, description) {
  const article = element('article', 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm');
  article.append(element('h3', 'text-base font-bold text-slate-900', title), element('p', 'mt-2 text-sm leading-6 text-slate-600', description));
  return article;
}
function makeTable(headers, rows) {
  const table = element('table', 'w-full min-w-[36rem] text-left text-sm');
  const thead = element('thead', 'bg-slate-50 text-xs uppercase tracking-wide text-slate-600');
  const hr = element('tr'); headers.forEach(label => hr.append(element('th', 'px-3 py-3 font-semibold', label))); thead.append(hr);
  const tbody = element('tbody', 'divide-y divide-slate-100');
  rows.forEach(row => { const tr = element('tr'); row.forEach(cell => tr.append(element('td', 'px-3 py-3 align-top text-slate-700', cell))); tbody.append(tr); });
  table.append(thead, tbody); return table;
}
function codeSample(text) {
  const pre = element('pre', 'mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-5 text-slate-200'); pre.textContent = text; return pre;
}
