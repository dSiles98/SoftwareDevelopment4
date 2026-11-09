import { element } from "../utils/dom.js";

export function showStatus(host, kind, message) {
  host.replaceChildren();
  const box = element("div", "", message);
  if (kind === "loading") box.setAttribute("role", "status");
  if (kind === "error") box.setAttribute("role", "alert");
  host.append(box);
}
