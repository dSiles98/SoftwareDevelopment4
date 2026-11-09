export function element(tag, className = '', text = '') {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== '') node.textContent = String(text);
  return node;
}

export function codeBlock(value, className = '') {
  const pre = element('pre', `code-scroll rounded-xl bg-slate-950 p-4 text-xs leading-5 text-slate-200 ${className}`);
  pre.textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  return pre;
}

export function clear(node) { node.replaceChildren(); }
