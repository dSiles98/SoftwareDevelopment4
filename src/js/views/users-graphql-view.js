import { getGraphqlUsers } from '../services/graphql-api.js';
import { showStatus } from '../components/status-message.js';

export async function loadGraphqlView({ status, onData, onError }) {
  showStatus(status, 'loading', 'Consultando GraphQLZero para los usuarios 1–10…');
  try {
    const result = await getGraphqlUsers();
    onData(result);
    if (result.errors.length) {
      onError(result.records);
      showStatus(status, result.users.length ? 'success' : 'error', `${result.users.length} usuarios cargados. Errores parciales: ${result.errors.join(' · ')}`);
    } else if (result.users.length) showStatus(status, 'success', `Se muestran ${result.users.length} usuarios; cada respuesta incluye su relación posts.`);
    else showStatus(status, 'empty', 'GraphQLZero no devolvió usuarios.');
  } catch (error) {
    onError(error.record ? [error.record] : []);
    showStatus(status, 'error', error.message || 'No se pudo completar la consulta GraphQL.');
  }
}
