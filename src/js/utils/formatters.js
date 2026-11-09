export function numberId(value) {
  return Number(value);
}
export function formatDuration(ms) {
  return `${Math.round(ms)} ms`;
}
export function shortUrl(value) {
  try {
    const url = new URL(value);
    return `${url.host}${url.pathname}${url.search}`;
  } catch {
    return value;
  }
}
