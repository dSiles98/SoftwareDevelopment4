import { element } from '../utils/dom.js';

export function showStatus(host, kind, message) {
  host.replaceChildren();
  const styles = {
    loading: 'border-sky-200 bg-sky-50 text-sky-900',
    error: 'border-rose-200 bg-rose-50 text-rose-900',
    empty: 'border-amber-200 bg-amber-50 text-amber-900',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  };
  const box = element('div', `rounded-xl border px-4 py-3 text-sm ${styles[kind] || styles.loading}`, message);
  if (kind === 'loading') box.setAttribute('role', 'status');
  if (kind === 'error') box.setAttribute('role', 'alert');
  host.append(box);
}
