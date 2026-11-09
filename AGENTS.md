# Prompt: Desarrollo de aplicación educativa `manage-users`

## 1. Rol y contexto

Actúa como un **Senior Frontend Engineer, arquitecto de software y docente universitario especializado en educación superior y enseñanza de programación**.

Necesito que desarrolles una aplicación web llamada **`manage-users`**, que utilizaré como demostración práctica durante una entrevista para impartir la materia Desarrollo de Software 4.

La aplicación debe tener dos propósitos:

1. Ser una aplicación funcional, bien estructurada y visualmente profesional.
2. Servir como recurso didáctico para explicar conceptos de desarrollo frontend e integración cliente-servidor, demostrando buenas prácticas de programación.

No construyas una aplicación excesivamente compleja. Prioriza que cada funcionalidad sea fácil de demostrar, explicar y relacionar con los conceptos de la materia.

## 2. Tecnologías y restricciones obligatorias

La materia trabaja con JavaScript, HTML5, CSS3 y Tailwind CSS. Por tanto, la aplicación debe construirse utilizando exclusivamente estas tecnologías para el frontend.

**Tecnologías obligatorias:**

- HTML5 semántico.
- CSS3.
- Tailwind CSS.
- JavaScript Vanilla (ES6+).
- Fetch API para las peticiones HTTP.
- History API para la navegación entre rutas.

**Restricciones:**

- No utilizar Angular, React, Vue, Svelte ni ningún framework JavaScript.
- No utilizar TypeScript.
- No utilizar jQuery.
- No utilizar bibliotecas GraphQL como Apollo Client o urql. Las consultas GraphQL deben realizarse mediante `fetch`.
- No implementar un backend propio.
- No incorporar dependencias innecesarias.
- No utilizar `innerHTML` para renderizar datos provenientes de las APIs. Priorizar `createElement`, `textContent` y manipulación segura del DOM.

Puedes utilizar Node.js y npm exclusivamente para configurar el entorno de desarrollo y compilar Tailwind CSS, si resulta necesario.

Utiliza versiones actuales y estables de las herramientas.

## 3. Servicios externos

La aplicación debe consumir dos servicios públicos y gratuitos.

### API REST

Nombre: JSONPlaceholder.

URL base:

`https://jsonplaceholder.typicode.com`

Endpoints que se deben utilizar:

**Obtener usuarios:**

`GET https://jsonplaceholder.typicode.com/users`

**Obtener publicaciones:**

`GET https://jsonplaceholder.typicode.com/posts`

La aplicación debe consumir estos dos endpoints y relacionar los datos mediante el campo `userId` de las publicaciones.

Documentación:

`https://jsonplaceholder.typicode.com/`

### API GraphQL

Nombre: GraphQLZero.

Endpoint:

`https://graphqlzero.almansi.me/api`

Documentación y Playground:

`https://graphqlzero.almansi.me/`

La aplicación debe utilizar las consultas GraphQL indicadas en este documento.

No inventes funcionalidades ni capacidades de las APIs. Respeta los campos y las estructuras de respuesta especificadas.

**Importante:** ambos servicios utilizan datos ficticios. Las operaciones de escritura pueden devolver respuestas simuladas sin persistir cambios. No es necesario implementar operaciones de escritura para esta aplicación.

## 4. Objetivo funcional

Construir una aplicación que permita visualizar usuarios y sus publicaciones, comparando cómo se obtiene y relaciona la información mediante REST y GraphQL.

La aplicación tendrá dos rutas principales:

1. `Users with REST`
2. `Users with GraphQL`

Rutas sugeridas:

- `/users/rest`
- `/users/graphql`

Debe existir una navegación claramente visible entre ambas rutas.

La aplicación debe permitir acceder directamente a cualquiera de las rutas y navegar entre ellas sin recargar innecesariamente la página.

**No debe existir una vista de detalle de usuario.**

La información de los usuarios y sus publicaciones debe visualizarse dentro de la misma vista principal.

## 5. Arquitectura y organización del código

Organiza el proyecto de forma modular, separando responsabilidades.

Estructura sugerida:

```text
manage-users/
├── index.html
├── package.json
├── src/
│   ├── styles/
│   │   └── input.css
│   ├── js/
│   │   ├── app.js
│   │   ├── router/
│   │   │   └── router.js
│   │   ├── components/
│   │   │   ├── app-header.js
│   │   │   ├── navigation.js
│   │   │   ├── user-list.js
│   │   │   ├── user-card.js
│   │   │   ├── post-list.js
│   │   │   ├── post-item.js
│   │   │   ├── request-inspector.js
│   │   │   ├── comparison-panel.js
│   │   │   └── status-message.js
│   │   ├── services/
│   │   │   ├── rest-api.js
│   │   │   ├── graphql-api.js
│   │   │   └── http-client.js
│   │   ├── utils/
│   │   │   ├── dom.js
│   │   │   ├── formatters.js
│   │   │   └── cache.js
│   │   └── views/
│   │       ├── users-rest-view.js
│   │       └── users-graphql-view.js
│   └── main.js
└── README.md
```

Puedes adaptar esta estructura si encuentras una organización mejor, pero conserva la separación de responsabilidades.

Considera los siguientes principios:

- Single Responsibility Principle.
- Separation of Concerns.
- Reutilización de componentes.
- Código legible y mantenible.
- Funciones pequeñas y enfocadas.
- Evitar duplicación de lógica.
- Separación entre acceso a datos y presentación.

No implementes una arquitectura excesivamente abstracta para una aplicación pequeña.

El cliente HTTP debe centralizar las responsabilidades comunes de las peticiones, como configuración, medición de tiempo, tratamiento de errores e inspección de respuestas.

## 6. Diseño visual y experiencia de usuario

La aplicación debe tener una apariencia moderna, profesional y adecuada para una demostración técnica universitaria.

Diseña una interfaz de administración de usuarios que incluya:

- Encabezado principal.
- Navegación entre REST y GraphQL.
- Título y descripción de la sección actual.
- Indicador del servicio que se está utilizando.
- Listado de usuarios.
- Publicaciones asociadas a cada usuario.
- Panel de información técnica de las peticiones.
- Indicadores de carga, error y ausencia de resultados.

No sacrifiques claridad por decoración.

Utiliza Tailwind CSS para la mayor parte de los estilos y evita crear CSS personalizado cuando una utilidad de Tailwind resuelva adecuadamente el problema.

### Responsive design

Implementa un enfoque mobile-first.

Considera:

- Diseño adaptable a móviles, tablets y escritorio.
- Navegación accesible.
- Distribución clara de usuarios y publicaciones.
- Contenido que no provoque desbordamiento horizontal.
- Paneles técnicos que puedan reorganizarse o colapsarse en dispositivos pequeños.

## 7. Funcionalidades y contenidos didácticos

Los temas seleccionados para la demostración son los siguientes.

### A. Fundamentos frontend

La aplicación debe permitir explicar y demostrar estos conceptos:

**HTML semántico**

Utiliza correctamente:

- `header`
- `nav`
- `main`
- `section`
- `article`
- `aside`
- `footer`
- `button`

No utilices elementos HTML únicamente por conveniencia visual cuando exista un elemento semántico más adecuado.

**Box model, Flexbox y CSS Grid**

Utiliza Flexbox y Grid donde corresponda.

La distribución de navegación, encabezados, usuarios, publicaciones y paneles técnicos debe mostrar un uso pertinente de estas herramientas.

**DOM y eventos**

Implementa:

- Manipulación del DOM mediante JavaScript.
- Eventos de usuario.
- Event delegation para elementos repetidos, como tarjetas de usuarios y acciones asociadas.
- Diferencias entre `textContent` e `innerHTML`.

La aplicación debe evitar insertar datos externos directamente como HTML.

Incluye en el README ejemplos que permitan explicar por qué `textContent` es más seguro cuando se representan datos provenientes de una API.

**JavaScript asíncrono**

Utiliza y organiza correctamente:

- Promises.
- `async/await`.
- `try/catch`.
- Event Loop.
- Manejo de errores.
- Estados de carga.
- Operaciones asíncronas.

No mezcles indiscriminadamente `.then()` y `async/await`. Utiliza ambos estilos cuando tenga sentido pedagógico y documenta sus diferencias.

Incluye una explicación breve del Event Loop en la documentación y una pequeña demostración visual que permita entender la ejecución síncrona, las microtasks y las tareas del navegador.

### B. Integración cliente-servidor

Esta es una de las partes más importantes de la demostración.

La aplicación debe mostrar no solamente los datos recibidos, sino también cómo se produce la comunicación entre cliente y servidor.

#### Inspector de peticiones HTTP

Implementa un componente reutilizable llamado `Request Inspector`.

Debe permitir visualizar, para cada petición:

- Método HTTP.
- URL solicitada.
- Query parameters, cuando existan.
- Request headers.
- Response status.
- Response headers disponibles.
- Tiempo de respuesta.
- Request body, cuando corresponda.
- Response body.

El inspector debe diferenciar visualmente la petición y la respuesta.

Incluye ejemplos de headers relevantes:

- `Accept`.
- `Content-Type`.
- `Authorization` (como ejemplo conceptual, sin enviar credenciales inexistentes).
- `Cache-Control`.
- `ETag`.
- `Origin`.
- `Access-Control-Allow-Origin`.

No inventes headers recibidos por el servidor. Muestra los valores reales que el navegador permita consultar y explica las restricciones de acceso a determinados headers.

Para GraphQL, muestra cómo una operación puede enviarse mediante HTTP POST con un body que contiene `query` y `variables`, cuando corresponda.

#### Métodos HTTP e idempotencia

Incluye una sección didáctica que explique:

- Propósito de GET, POST, PUT, PATCH y DELETE.
- Si cada método es seguro o no.
- Si cada método es idempotente o no.
- Ejemplos de uso.
- Diferencias entre PUT y PATCH.

No es necesario implementar operaciones de escritura. La aplicación debe concentrarse en las consultas GET de REST y las consultas POST de GraphQL.

Utiliza ejemplos conceptuales para explicar los métodos HTTP sin añadir funcionalidades que no forman parte del objetivo de la demo.

#### REST frente a GraphQL

Incluye un panel comparativo que permita explicar:

- Modelo de recursos y endpoints en REST.
- Modelo de tipos, campos y operaciones en GraphQL.
- Over-fetching.
- Under-fetching.
- Obtención de datos relacionados.
- Selección de campos.
- Diferencias en la cantidad y estructura de solicitudes.
- Cuándo elegir REST.
- Cuándo elegir GraphQL.

Utiliza ejemplos reales de las dos APIs.

Explica que la elección depende del contexto, los requisitos, la arquitectura y las necesidades del cliente. No afirmes que GraphQL siempre es más rápido o mejor que REST.

#### OData y JSON:API

Incluye una sección didáctica breve para explicar cómo se representan convenciones de filtrado mediante OData y JSON:API.

OData:

- `$filter`
- `$select`

JSON:API:

- `filter`
- `fields`

Muestra ejemplos de URLs y explica qué representa cada parámetro.

**Importante:** no afirmes que JSONPlaceholder o GraphQLZero implementan OData o JSON:API.

En esta aplicación, el filtrado de publicaciones se implementará de manera diferente en cada servicio:

- REST: filtrado en el frontend utilizando JavaScript.
- GraphQL: filtrado en el servidor mediante la relación entre usuario y publicaciones.

Explica esta diferencia y aclara que el filtrado de REST en esta demo no es una consulta de filtrado realizada por el servidor.

No incorpores funcionalidades de ordenamiento ni paginación.

#### CORS

Incluye una sección didáctica para explicar:

- Qué es Same-Origin Policy.
- Qué es CORS.
- Qué significa `Access-Control-Allow-Origin`.
- Qué es un preflight request.
- Cuándo se genera una petición OPTIONS.
- Diferencia entre una petición simple y una petición que requiere preflight.
- Cómo identificar un problema CORS en Chrome DevTools.

La aplicación debe consumir directamente las APIs desde el navegador.

No implementes proxies para evitar CORS.

No intentes deshabilitar las restricciones de seguridad del navegador.

Si las APIs permiten las peticiones desde el origen de desarrollo, muestra los headers disponibles y explica su significado.

Si no es posible generar un preflight con las operaciones utilizadas, incorpora una explicación o ejemplo didáctico, sin presentar una simulación como una petición real.

#### Caching

Incluye una demostración sencilla de estrategias de caché.

Conceptos:

- `Cache-Control`.
- `ETag`.
- `If-None-Match`.
- `304 Not Modified`.
- Caché del navegador.
- Caché en memoria del frontend.

La aplicación debe inspeccionar los headers reales de las APIs.

Si el servicio no devuelve `ETag` o no permite demostrar un flujo condicional, no inventes esos headers ni simules una respuesta 304 real.

En ese caso, implementa una caché sencilla en memoria del frontend y permite demostrar:

1. Primera solicitud: consulta al servidor.
2. Segunda solicitud: recuperación desde caché local.
3. Acción para invalidar la caché.
4. Nueva solicitud al servidor.

Muestra claramente si el resultado proviene de la red o de la caché local.

Explica las diferencias entre caché HTTP y caché implementada en la aplicación.

## 8. Comportamiento específico de las integraciones

Esta sección es obligatoria. Implementa exactamente el comportamiento descrito para evitar diferencias entre las dos vistas.

### A. REST — JSONPlaceholder

La integración REST debe realizar dos solicitudes independientes.

**Primera solicitud: obtener usuarios**

```javascript
GET https://jsonplaceholder.typicode.com/users
```

La respuesta contiene un arreglo de usuarios con una estructura similar a:

```json
[
  {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "address": {
      "street": "Kulas Light",
      "suite": "Apt. 556",
      "city": "Gwenborough",
      "zipcode": "92998-3874",
      "geo": {
        "lat": "-37.3159",
        "lng": "81.1496"
      }
    }
  }
]
```

**Segunda solicitud: obtener publicaciones**

```javascript
GET https://jsonplaceholder.typicode.com/posts
```

La respuesta contiene un arreglo de publicaciones con esta estructura:

```json
[
  {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
  }
]
```

**Lógica obligatoria de la vista REST:**

1. Consultar el endpoint de usuarios.
2. Consultar el endpoint de publicaciones.
3. Esperar a que ambas solicitudes terminen correctamente.
4. Relacionar cada usuario con sus publicaciones utilizando el campo `userId`.
5. Realizar el filtrado en el frontend mediante JavaScript.
6. Mostrar cada usuario y sus publicaciones asociadas.

La relación debe realizarse utilizando el identificador del usuario.

Ejemplo conceptual:

```javascript
const userPosts = posts.filter((post) => post.userId === user.id);
```

No realices una petición individual de publicaciones por cada usuario.

No utilices endpoints adicionales.

La intención es demostrar que REST puede requerir obtener recursos desde endpoints diferentes y relacionarlos posteriormente en el cliente.

### B. GraphQL — GraphQLZero

La integración GraphQL debe consultar los usuarios y sus publicaciones utilizando el endpoint:

```javascript
const uri = "https://graphqlzero.almansi.me/api";
```

**Obtención de usuarios**

Se deben obtener los usuarios con identificadores del 1 al 10.

Para cada identificador, realiza una consulta GraphQL con la siguiente estructura:

```graphql
query {
  user(id: 1) {
    id
    username
    email
    address {
      geo {
        lat
        lng
      }
    }
  }
}
```

El identificador debe parametrizarse mediante variables GraphQL, evitando concatenar valores directamente en la consulta.

Ejemplo de respuesta:

```json
{
  "user": {
    "id": "1",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "address": {
      "geo": {
        "lat": -37.3159,
        "lng": 81.1496
      }
    }
  }
}
```

Ten en cuenta que los identificadores pueden llegar como strings, mientras que en REST son números. Normaliza los tipos cuando sea necesario para compartir los componentes de presentación.

**Obtención de publicaciones por usuario**

Para cada usuario, utiliza la relación `posts` definida en el esquema GraphQL.

Consulta de ejemplo:

```graphql
query {
  user(id: 1) {
    posts {
      data {
        id
        title
      }
    }
  }
}
```

Ejemplo de respuesta:

```json
{
  "user": {
    "posts": {
      "data": [
        {
          "id": "1",
          "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit"
        },
        {
          "id": "2",
          "title": "qui est esse"
        },
        {
          "id": "3",
          "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut"
        }
      ]
    }
  }
}
```

La respuesta real contiene las publicaciones asociadas al usuario consultado.

**Lógica obligatoria de la vista GraphQL:**

1. Obtener los usuarios con IDs del 1 al 10 mediante las consultas indicadas.
2. Obtener las publicaciones asociadas a cada usuario mediante la relación `posts`.
3. El servidor debe realizar el filtrado de publicaciones.
4. No descargar todas las publicaciones para filtrarlas posteriormente en JavaScript.
5. Construir un modelo de datos normalizado para reutilizar los mismos componentes visuales de la vista REST.

Puedes utilizar `Promise.all` para ejecutar las consultas independientes de los diez usuarios y sus publicaciones de manera concurrente, siempre que el servicio lo permita.

Evita realizar consultas innecesarias o duplicadas.

Muestra en el Request Inspector las consultas GraphQL enviadas, las variables utilizadas y las respuestas recibidas.

**Nota:** verifica que las operaciones y relaciones descritas sean compatibles con el esquema real de GraphQLZero antes de implementar la aplicación.

### C. Comparación visual entre REST y GraphQL

Ambas vistas deben mostrar información equivalente:

- Los mismos diez usuarios.
- Username.
- Email.
- Coordenadas geográficas cuando estén disponibles.
- Publicaciones asociadas a cada usuario.
- Título de cada publicación.

Utiliza los mismos componentes visuales para ambas vistas.

La diferencia debe encontrarse en cómo se obtiene y relaciona la información, no en cómo se presenta.

La aplicación debe permitir explicar claramente:

| Concepto                       | REST                                     | GraphQL                             |
| ------------------------------ | ---------------------------------------- | ----------------------------------- |
| Obtención de usuarios          | Una solicitud a `/users`                 | Consultas por ID                    |
| Obtención de publicaciones     | Una solicitud a `/posts`                 | Relación `user.posts`               |
| Relación usuario-publicaciones | Filtrado en JavaScript mediante `userId` | Filtrado en el servidor             |
| Selección de campos            | Respuesta definida por el endpoint       | Campos seleccionados en la consulta |
| Cliente HTTP                   | Fetch GET                                | Fetch POST                          |

## 9. Componentes compartidos y reutilización

Las dos vistas deben reutilizar los componentes visuales siempre que sea razonable.

Considera como mínimo:

- Header.
- Navegación.
- User List.
- User Card.
- Post List.
- Post Item.
- Request Inspector.
- Loading State.
- Error State.
- Empty State.
- Comparison Panel.

No dupliques los componentes ni la lógica de presentación para REST y GraphQL.

La diferencia entre ambas vistas debe estar principalmente en la capa de acceso a datos y en las particularidades de cada API.

No crees una vista de detalle de usuario.

Los datos y publicaciones deben mostrarse directamente en las tarjetas o secciones de cada usuario dentro de la vista principal.

## 10. Estados y manejo de errores

Implementa correctamente:

- Loading.
- Success.
- Empty.
- Error.
- Timeout, si decides incorporarlo.
- Respuesta HTTP no exitosa.
- Error de red.
- Error de parsing JSON.
- Error GraphQL.

Recuerda que una respuesta HTTP 200 de GraphQL puede contener errores dentro de la propiedad `errors`.

Por tanto, no basta con comprobar únicamente `response.ok`.

Evita que la aplicación se quede bloqueada cuando una petición falla.

Si falla la obtención de datos de un usuario en GraphQL, considera cómo comunicar el error sin impedir innecesariamente la visualización de los demás usuarios.

## 11. Accesibilidad y seguridad

Considera:

- HTML semántico.
- Navegación por teclado.
- Estados de foco visibles.
- Contraste adecuado.
- Uso correcto de botones y enlaces.
- Atributos ARIA solamente cuando sean necesarios.
- Escape seguro de datos.
- No insertar contenido externo mediante `innerHTML`.
- No almacenar credenciales ni secretos.
- No exponer información sensible.

## 12. Documentación y enfoque pedagógico

El proyecto debe incluir un `README.md` completo.

Debe explicar:

1. Propósito de la aplicación.
2. Tecnologías utilizadas.
3. Cómo instalar y ejecutar el proyecto.
4. Estructura del proyecto.
5. Arquitectura y responsabilidades.
6. Funcionamiento de las rutas.
7. Integración REST.
8. Integración GraphQL.
9. Métodos HTTP e idempotencia.
10. Headers.
11. CORS.
12. OData y JSON:API.
13. Caching.
14. DOM y event delegation.
15. Promises, async/await y Event Loop.
16. Limitaciones de las APIs externas.
17. Diferencias entre filtrado en el cliente y filtrado en el servidor.

Incluye ejemplos pequeños de código que pueda utilizar durante la explicación.

## 13. Criterios de calidad

La aplicación debe cumplir estas condiciones:

- Ejecutarse correctamente.
- Consumir realmente ambas APIs.
- Tener dos rutas funcionales.
- Mostrar los mismos usuarios y sus publicaciones en ambas vistas.
- Obtener los usuarios y publicaciones mediante los endpoints y consultas especificados.
- Realizar el filtrado REST en el frontend.
- Realizar el filtrado GraphQL en el servidor.
- Reutilizar componentes.
- Utilizar JavaScript Vanilla.
- Tener diseño responsive mobile-first.
- Utilizar HTML semántico.
- Aplicar correctamente Flexbox y Grid.
- Mostrar información técnica de las peticiones.
- Gestionar correctamente errores y estados de carga.
- No implementar funcionalidades de ordenamiento ni paginación.
- No implementar una vista de detalle de usuario.
- No presentar capacidades inexistentes de las APIs.
- Mantener una estructura de código clara y mantenible.

## 14. Prioridades de implementación

Desarrolla la aplicación por etapas para evitar construir funcionalidades sin una base sólida.

**Fase 1 — Estructura y navegación**

- Configuración del proyecto.
- Tailwind CSS.
- Layout principal.
- Navegación.
- Rutas REST y GraphQL.
- Componentes compartidos.

**Fase 2 — Integración REST**

- Cliente HTTP.
- Consulta de usuarios.
- Consulta de publicaciones.
- Relación entre usuarios y publicaciones mediante `userId`.
- Renderizado de datos.
- Estados de carga y errores.

**Fase 3 — Integración GraphQL**

- Cliente GraphQL mediante Fetch.
- Consultas de usuarios del 1 al 10.
- Consultas de publicaciones relacionadas.
- Normalización de datos.
- Renderizado con los mismos componentes de REST.
- Tratamiento de errores GraphQL.

**Fase 4 — Demostración técnica**

- Request Inspector.
- Métodos HTTP.
- Headers.
- REST vs GraphQL.
- OData y JSON:API.
- CORS.
- Caching.
- DOM y eventos.
- Promises, async/await y Event Loop.

**Fase 5 — Calidad y documentación**

- Responsive design.
- Accesibilidad.
- Revisión de código.
- README.
- Validación de funcionalidades.

Al finalizar cada fase, verifica que la aplicación siga funcionando antes de continuar.

## 15. Instrucciones finales para el agente

Antes de comenzar:

1. Inspecciona el entorno y los archivos existentes.
2. Verifica la documentación y el esquema real de las APIs.
3. Comprueba las estructuras de respuesta descritas en este prompt.
4. Identifica cualquier diferencia entre los ejemplos y el esquema actual.
5. Define la arquitectura y estructura de archivos.
6. Presenta un plan breve de implementación.

No te limites a crear una maqueta visual: necesito una aplicación funcional que consuma los servicios reales.

No agregues funcionalidades ajenas al objetivo educativo.

No utilices frameworks JavaScript.

No implementes formularios de creación o edición de usuarios.

No implementes ordenamiento ni paginación.

No crees una vista de detalle de usuario.

**Resultado esperado:** una aplicación educativa, funcional y profesional que me permita realizar una demostración técnica de Desarrollo de Software 4, explicando fundamentos de JavaScript y frontend mientras comparo cómo REST y GraphQL obtienen y relacionan usuarios y publicaciones.
