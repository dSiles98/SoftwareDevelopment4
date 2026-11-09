import { getRestUsersAndPosts } from '../services/rest-api.js';
import { showStatus } from '../components/status-message.js';

export async function loadRestView({ status, onData, isCurrent = () => true, forceNetwork = false }) {
  showStatus(status, 'loading', 'Loading users and posts in parallel…');
  try {
    const result = await getRestUsersAndPosts({ forceNetwork });
    onData(result);
    if (!isCurrent()) return;
    if (result.users.length) showStatus(status, 'success', `Showing ${result.users.length} users. Source: ${result.sources.map(source => source === 'memory' ? 'local cache' : 'network').join(' and ')}.`);
    else showStatus(status, 'empty', 'The API returned no users.');
  } catch (error) {
    if (!isCurrent()) return;
    showStatus(status, 'error', `${error.message} Check your connection and try again.`);
  }
}
