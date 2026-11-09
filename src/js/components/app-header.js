import { element } from "../utils/dom.js";
import { createNavigation } from "./navigation.js";

export function createAppHeader() {
  const header = element(
    "header",
    "flex flex-col gap-5 border-b border-neutral-200 py-6 sm:flex-row sm:items-center sm:justify-between",
  );
  const brand = element("a", "flex items-center gap-3 rounded-lg");
  brand.href = "/users/rest";
  brand.dataset.route = "/users/rest";
  brand.setAttribute("aria-label", "Manage Users home");
  const navigation = createNavigation();
  header.append(brand, navigation.nav);
  return { header, ...navigation };
}
