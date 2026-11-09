export async function request({ url, method = 'GET', headers = {}, body, cache, signal }) {
  const startedAt = performance.now();
  const requestRecord = { method, url, headers: { ...headers }, body: body ?? null };
  try {
    const response = await fetch(url, { method, headers, body, ...(cache ? { cache } : {}), ...(signal ? { signal } : {}) });
    const raw = await response.text();
    let data;
    try { data = raw ? JSON.parse(raw) : null; }
    catch (cause) {
      const record = { request: requestRecord, response: responseDetails(response, raw), duration: performance.now() - startedAt };
      throw Object.assign(new Error('The response is not valid JSON.'), { cause, record });
    }
    const record = { request: requestRecord, response: responseDetails(response, data), duration: performance.now() - startedAt };
    if (!response.ok) throw Object.assign(new Error(`HTTP ${response.status}: ${response.statusText || 'unsuccessful response'}`), { record });
    return { data, record };
  } catch (error) {
    if (error.record) throw error;
    const message = error.name === 'AbortError' ? 'The request was cancelled.' : error.message || 'Network error while contacting the service.';
    throw Object.assign(new Error(message), { record: { request: requestRecord, response: null, duration: performance.now() - startedAt }, cause: error });
  }
}

function responseDetails(response, body) {
  return { status: response.status, statusText: response.statusText, headers: Object.fromEntries(response.headers.entries()), body };
}
