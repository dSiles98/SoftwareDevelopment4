# Manage Users

Aplicación educativa de una sola página para comparar la obtención y relación de usuarios y publicaciones con REST y GraphQL. Presenta datos reales de dos servicios públicos de prueba, un inspector de las peticiones del navegador y paneles breves para apoyar una demostración universitaria de Desarrollo de Software 4.

## Ejecutar

Requiere Node.js 20.19+ o 22.12+ y npm.

```bash
npm install
npm run dev
```

Abre la dirección local que indique Vite (normalmente `http://localhost:5173`). Para generar y previsualizar una compilación:

```bash
npm run build
npm run preview
```

Tailwind CSS se compila localmente mediante su plugin oficial de Vite. No hay backend propio.

## Rutas

- `/users/rest`: JSONPlaceholder, dos solicitudes GET.
- `/users/graphql`: GraphQLZero, consultas POST parametrizadas por ID.

La navegación usa History API y permite abrir directamente cualquiera de las rutas. No hay página de detalle de usuario, edición, creación, ordenamiento ni paginación. La cabecera conserva enlaces normales y la aplicación intercepta la navegación primaria para cambiar de ruta sin recargar.

## Tecnologías y estructura

- HTML5 semántico, CSS3 y utilidades Tailwind.
- JavaScript Vanilla ES Modules (ES6+), Fetch API y History API.
- Vite solo sirve y compila los archivos estáticos; no aporta un framework de interfaz.

```text
index.html
src/
  styles/app.css
  js/
    main.js
    router/router.js
    components/
      app-header.js
      navigation.js
      post-item.js
      post-list.js
      user-card.js
      comparison-panel.js
      request-inspector.js
      status-message.js
      user-list.js
    services/
      http-client.js
      rest-api.js
      graphql-api.js
    utils/
      cache.js
      dom.js
      formatters.js
    views/
      users-rest-view.js
      users-graphql-view.js
```

### Responsabilidades

- `main.js`: layout compartido, enlaces, eventos y ciclo de cada ruta.
- `router.js`: rutas permitidas, `pushState` y `popstate`.
- `services/http-client.js`: Fetch, medición con `performance.now()`, lectura JSON, status, headers y errores.
- `rest-api.js` y `graphql-api.js`: solicitudes propias de cada servicio y normalización del modelo.
- `components/`: representación de usuarios, estados, inspector y contenidos de la lección.
- `utils/cache.js`: caché pequeña en memoria con caducidad.

Las dos vistas comparten `renderUsers`, tarjetas, inspector y los mismos estilos. El modelo normalizado contiene `id` numérico, `username`, `email`, coordenadas opcionales y `posts` con `id`, `title` y `body` (GraphQLZero no solicita el body de las publicaciones).

## Integración REST

Se solicitan exactamente los endpoints requeridos:

```js
const [usersResult, postsResult] = await Promise.all([
  getResource('/users', forceNetwork),
  getResource('/posts', forceNetwork),
]);

const userPosts = postsResult.data.filter(
  (post) => Number(post.userId) === Number(user.id),
);
```

La relación ocurre en el navegador por `userId`; no se realizan solicitudes por usuario ni rutas adicionales. El inspector muestra los dos GET y sus respuestas. Ambos resultados se guardan independientemente en memoria durante un minuto, y la vista informa si se usó red o caché local.

## Integración GraphQL

El cliente usa `https://graphqlzero.almansi.me/api` y primero envía una operación POST por cada usuario entre 1 y 10. Luego envía una operación para las publicaciones relacionadas de cada usuario válido. Los IDs se pasan en `variables`, nunca concatenados en el texto de la consulta. Las fases ejecutan sus operaciones independientes de forma concurrente con `Promise.allSettled`, para comunicar errores parciales sin perder los resultados correctos.

```graphql
query UserById($id: ID!) {
  user(id: $id) {
    id
    username
    email
    address { geo { lat lng } }
  }
}
```

La consulta de publicaciones usa `query UserPostsById($id: ID!) { user(id: $id) { posts { data { id title } } } }`. Se pueden observar hasta veinte operaciones (diez de usuarios y diez de publicaciones). Un fallo individual se comunica como error parcial; los demás resultados pueden mostrarse. También se comprueba la propiedad `errors` de GraphQL aunque el status HTTP sea exitoso. La relación `user.posts` deja el filtrado en el servidor, por lo que no se descargan todas las publicaciones para filtrarlas en JavaScript. El inspector conserva query, variables, headers, status, duración y cuerpo recibido para cada consulta.

## Request Inspector y headers

Cada bloque separa la solicitud de la respuesta. Registra método, URL, headers declarados por esta aplicación, body si existe, status HTTP, tiempo, headers de respuesta que `fetch` permite leer y response body.

`Accept` expresa el formato aceptado; `Content-Type` declara el formato del cuerpo enviado. GraphQL lleva `application/json`, query y variables. El inspector incluye un campo conceptual `Authorization` que aclara que no se envía ni se usan credenciales. `Origin` lo controla el navegador. `Access-Control-Allow-Origin` y otros headers CORS son respuestas del servidor. JavaScript puede leer headers de respuesta expuestos por CORS; otros pueden seguir visibles en DevTools. Se muestran los valores efectivamente observados, no ejemplos como si fueran respuestas reales. Los headers de solicitud administrados por el navegador no siempre están disponibles a través de Fetch.

`Cache-Control`, `ETag` e `If-None-Match` son relevantes para caché HTTP. El inspector permite observar lo que el servicio entregue; esta aplicación no inventa una respuesta `304 Not Modified` ni añade una petición condicional si el servidor no la ofrece.

En la tabla REST/GraphQL del panel educativo, la relación usuario-publicaciones aparece explícitamente como filtrado JavaScript por `userId` frente a la relación `user.posts` resuelta por el servidor. Las dos peticiones REST también se etiquetan como solicitud 1 de 2 (usuarios) y 2 de 2 (publicaciones) dentro del inspector.

## Métodos HTTP, seguridad e idempotencia

Seguro significa que el método está pensado para lectura sin pedir cambios en el estado del servidor. Idempotente significa que repetir una solicitud idéntica produce el mismo efecto final previsto, aunque la respuesta pueda variar.

| Método | Seguro | Idempotente | Ejemplo conceptual |
| --- | --- | --- | --- |
| GET | Sí | Sí | Leer `/users` o `/posts` |
| POST | No | Generalmente no | Crear un recurso o enviar una operación GraphQL de lectura |
| PUT | No | Sí | Reemplazar el recurso completo en `/users/1` |
| PATCH | No | Generalmente no | Modificar campos concretos de `/users/1` |
| DELETE | No | Sí | Eliminar `/users/1` |

PUT expresa reemplazo completo y PATCH modificación parcial. Esta demostración solo usa GET para REST y POST para las consultas GraphQL; no ejecuta operaciones de escritura.

## REST frente a GraphQL

REST modela recursos en endpoints; GraphQL modela tipos, campos y relaciones en un endpoint de consulta. En esta aplicación, REST usa dos endpoints y combina sus resultados en el cliente. GraphQL consulta cada usuario junto con sus publicaciones relacionadas. REST devuelve los campos definidos por cada endpoint; GraphQL permite seleccionar campos dentro de una operación.

**Over-fetching** es recibir campos que el cliente no necesita. **Under-fetching** es necesitar solicitudes adicionales para completar los datos de una vista. GraphQL no es automáticamente más rápido ni mejor: la decisión depende de contratos existentes, arquitectura, caché, requisitos de clientes y operación. REST funciona bien con recursos y endpoints estables; GraphQL puede convenir cuando clientes distintos requieren selecciones y relaciones distintas.

## OData y JSON:API

Son convenciones que se muestran de forma conceptual. Ninguna de las APIs de esta demo se presenta como compatible con OData o JSON:API.

- OData: `/Users?$filter=UserId eq 1&$select=Id,Name`. `$filter` restringe registros y `$select` limita propiedades.
- JSON:API: `/posts?filter[userId]=1&fields[posts]=title,body`. `filter` expresa criterios y `fields` limita atributos.

El filtrado de REST aquí sucede localmente (`posts.filter(...)`); no es una consulta de filtrado al servidor. En GraphQL la relación `user.posts` solicita al servidor las publicaciones asociadas al usuario.

## CORS

Same-Origin Policy restringe la lectura de recursos entre orígenes distintos. CORS permite al servidor declarar, con `Access-Control-Allow-Origin` y headers relacionados, qué orígenes pueden leer una respuesta. Una petición simple puede enviarse sin preflight. El navegador genera `OPTIONS` antes de solicitudes que no cumplen los criterios de petición simple, por ejemplo por ciertos métodos o headers. El POST GraphQL con `Content-Type: application/json` normalmente requiere preflight.

El inspector registra las llamadas de aplicación; no finge un OPTIONS. Para diagnosticar en Chrome, abre DevTools → Network y Console, revisa status y headers de `OPTIONS` y de la petición principal. Si la política CORS bloquea la respuesta, JavaScript suele recibir un error de red genérico y la consola detalla el motivo. La app llama directamente a ambas APIs: no usa proxy ni desactiva protecciones del navegador.

## Caché

La demo implementa caché local en un `Map`, separada por URL y con TTL de un minuto. Primera carga: red; navegación o recarga dentro del TTL: caché en memoria; “Invalidar caché”: limpia el Map; “Volver a solicitar”: omite la caché local y obtiene datos de red.

Esto no es la caché HTTP del navegador. `Cache-Control` puede definir políticas HTTP y `ETag` puede identificar una versión; un cliente puede enviar `If-None-Match` y el servidor responder `304` si soporta validación condicional. Se inspeccionan headers reales y no se simula ese intercambio.

## DOM, seguridad y delegación de eventos

Los datos de API se crean con `createElement` y `textContent`, no se interpolan como HTML. Por ejemplo:

```js
const title = document.createElement('p');
title.textContent = post.title;
list.append(title);
```

`textContent` trata el valor como texto literal. `innerHTML` interpreta la cadena como marcado; con datos no confiables puede abrir una vía de inyección XSS. Las publicaciones comparten un listener delegado en el contenedor de la lista para alternar su visibilidad, en vez de registrar un listener independiente por cada botón.

La estructura usa `header`, `nav`, `main`, `section`, `article`, `footer` y controles `button`/`a` según su función. La cuadrícula de tarjetas responde al ancho disponible, los controles tienen foco visible y los estados de carga/error se anuncian con roles apropiados.

## Promises, async/await y Event Loop

Las funciones de las vistas usan `async/await` y `try/catch` para expresar claramente estados de carga y errores. `Promise.all` permite esperar las dos peticiones REST independientes, pero rechaza si una falla. `Promise.allSettled` en GraphQL conserva los resultados que sí llegaron aunque una consulta individual falle. El cliente HTTP mantiene un solo estilo asíncrono por flujo.

Demostración para consola:

```js
console.log('síncrono');
Promise.resolve().then(() => console.log('microtask'));
setTimeout(() => console.log('tarea del navegador'), 0);
// síncrono → microtask → tarea
```

El Event Loop ejecuta el bloque síncrono actual, vacía la cola de microtasks (incluidas continuaciones de Promise) y después procesa tareas como temporizadores y eventos, con oportunidades de renderizado entre ciclos.

## Estados, límites y uso responsable

La interfaz contempla carga, éxito, vacío, errores HTTP, red, JSON y errores GraphQL, incluidos fallos parciales de usuario. Las APIs sirven datos ficticios para aprendizaje; las operaciones de escritura, si se probaran fuera de esta aplicación, no representarían persistencia real. La demo no incluye credenciales y no modifica los datos.

Las respuestas dependen de la disponibilidad de los servicios externos y de sus políticas CORS. Los headers que el navegador expone a JavaScript pueden ser menos que los que aparecen en DevTools. Los tiempos son mediciones de la sesión actual y no constituyen un benchmark comparativo.
