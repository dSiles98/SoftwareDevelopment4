import { element, codeBlock } from '../utils/dom.js';
import { formatDuration, shortUrl } from '../utils/formatters.js';

export function renderRequestInspector(host, records = []) {
  host.replaceChildren();
  if (!records.length) { host.append(element('p', 'text-sm text-slate-500', 'Las solicitudes aparecerán aquí al completar la carga.')); return; }
  records.forEach((record, index) => {
    const card = element('details', 'rounded-xl border border-slate-200 bg-white');
    card.open = index === 0;
    const summary = element('summary', 'cursor-pointer list-none px-4 py-3 text-sm font-semibold text-slate-800');
    const method = record.request?.method || 'HTTP';
    const status = record.response?.status ? ` · HTTP ${record.response.status}` : ' · Error de red';
    summary.textContent = `${method} ${shortUrl(record.request?.url || '')}${status} · ${formatDuration(record.duration || 0)}`;
    const body = element('div', 'space-y-3 border-t border-slate-100 p-4');
    const requestHeading = element('p', 'text-xs font-bold uppercase tracking-wide text-sky-700', 'Solicitud');
    body.append(requestHeading);
    body.append(kv('Método y URL', `${method} ${record.request?.url || ''}`));
    body.append(kv('Headers enviados', JSON.stringify(record.request?.headers || {}, null, 2)));
    if (record.request?.body) body.append(kv('Request body (query y variables)', record.request.body));
    const responseHeading = element('p', 'mt-4 text-xs font-bold uppercase tracking-wide text-emerald-700', 'Respuesta');
    body.append(responseHeading);
    body.append(kv('Estado', record.response ? `${record.response.status} ${record.response.statusText || ''}` : 'No hubo respuesta HTTP'));
    body.append(kv('Headers visibles para JavaScript', JSON.stringify(record.response?.headers || {}, null, 2)));
    body.append(kv('Response body', JSON.stringify(record.response?.body ?? null, null, 2)));
    card.append(summary, body); host.append(card);
  });
}

function kv(label, value) {
  const section = element('section', 'space-y-1');
  section.append(element('h4', 'text-xs font-semibold text-slate-600', label), codeBlock(value));
  return section;
}
