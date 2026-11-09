import { element } from '../utils/dom.js';
import { createNavigation } from './navigation.js';

export function createAppHeader() {
  const header = element('header', 'flex flex-col gap-5 border-b border-slate-200 py-6 sm:flex-row sm:items-center sm:justify-between');
  const brand = element('a', 'flex items-center gap-3 rounded-lg');
  brand.href = '/users/rest';
  brand.dataset.route = '/users/rest';
  brand.setAttribute('aria-label', 'Manage Users, inicio REST');
  const mark = element('span', 'grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-sm font-black text-white', 'MU');
  const brandText = element('span');
  brandText.append(element('span', 'block text-sm font-bold tracking-wide text-slate-900', 'MANAGE USERS'), element('span', 'block text-xs text-slate-500', 'REST · GraphQL · JavaScript'));
  brand.append(mark, brandText);
  const navigation = createNavigation();
  header.append(brand, navigation.nav);
  return { header, ...navigation };
}
