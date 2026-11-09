import { getRestUsersAndPosts } from '../services/rest-api.js';
import { showStatus } from '../components/status-message.js';

export async function loadRestView({ status, onData, onError, isCurrent = () => true, forceNetwork = false }) {
  showStatus(status, 'loading', 'Consultando usuarios y publicaciones en paralelo…');
  try {
    const result = await getRestUsersAndPosts({ forceNetwork });
    onData(result);
    if (!isCurrent()) return;
    if (result.users.length) showStatus(status, 'success', `Se muestran ${result.users.length} usuarios. Procedencia: ${result.sources.map(source => source === 'memory' ? 'caché local' : 'red').join(' y ')}.`);
    else showStatus(status, 'empty', 'La API no devolvió usuarios.');
  } catch (error) {
    if (!isCurrent()) return;
    onError(error.records || (error.record ? [error.record] : []));
    showStatus(status, 'error', `${error.message} Verifica la conexión e inténtalo de nuevo.`);
  }
}
